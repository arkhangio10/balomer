/* global globalThis */
import 'react-native';
import {BackHandler} from '@amazon-devices/react-native-kepler';
import {act, render, within} from '@testing-library/react-native';
import * as React from 'react';
import {StyleSheet} from 'react-native';

import {App} from '../src/App';
import type {
  Alert,
  Message,
  Metrics,
  ReportUnavailable,
  Session,
  TeamMetrics,
} from '../src/contracts';
import {BANNER_OUT_MS, FADE_MS} from '../src/theme';

// The preset's BackHandler mock has no `default`, which the package index reads.
jest.mock(
  '@amazon-devices/react-native-kepler/Libraries/Utilities/BackHandler.kepler',
  () => ({__esModule: true, default: {addEventListener: jest.fn()}}),
);

class FakeSocket {
  static last: FakeSocket;
  onmessage: ((event: {data: string}) => void) | null = null;
  onclose: (() => void) | null = null;

  constructor() {
    FakeSocket.last = this;
  }

  close(): void {}
}

const session: Session = {
  type: 'session',
  match_id: 'sample',
  half: 1,
  pitch_length_m: 105,
  pitch_width_m: 68,
  credit: 'Synthetic test sample',
};

const team: TeamMetrics = {
  possession: 50,
  line_height: 30,
  width: 40,
  depth: 30,
  compactness: 1200,
  attack_direction: 1,
  line_x: -20,
  block: {x_min: -25, x_max: 5, y_min: -20, y_max: 20},
};

const rolling: Metrics = {
  type: 'metrics',
  half: 1,
  clock_ms: 300000,
  period: {kind: 'rolling', from_min: 0, to_min: 5},
  teams: {home: team, away: {...team, attack_direction: -1, line_x: 20}},
};

const alert: Alert = {
  type: 'alert',
  minute: 15,
  template_id: 'possession_lead',
  text: 'Home had more possession than Away during this quarter-hour of the match.',
  evidence: [
    {
      metric: 'possession',
      team: 'home',
      period: {kind: 'block', from_min: 0, to_min: 15},
    },
  ],
};

const report: ReportUnavailable = {
  type: 'report',
  kind: 'halftime',
  status: 'unavailable',
};

const send = (message: Message) =>
  act(() => FakeSocket.last.onmessage?.({data: JSON.stringify(message)}));

const realWebSocket = globalThis.WebSocket;
const removeBack = jest.fn();
let pressBack: () => boolean | null | undefined;

beforeEach(() => {
  jest.useFakeTimers();
  globalThis.WebSocket = FakeSocket as unknown as typeof WebSocket;
  removeBack.mockClear();
  jest
    .mocked(BackHandler.addEventListener)
    .mockImplementation((_event, handler) => {
      pressBack = handler;
      return {remove: removeBack};
    });
});

afterEach(() => {
  globalThis.WebSocket = realWebSocket;
  jest.useRealTimers();
});

describe('App', () => {
  it('shows the session credit on the clock bar', () => {
    const screen = render(<App />);
    send(session);
    expect(screen.getByText(session.credit)).toBeTruthy();
  });

  it('shows the stats panel once rolling metrics arrive', () => {
    const screen = render(<App />);
    send(session);
    expect(screen.queryByText('Possession')).toBeNull();
    send(rolling);
    expect(screen.getByText('Possession')).toBeTruthy();
  });

  it('lists an alert before any rolling metrics, and Back dismisses only its banner', () => {
    const screen = render(<App />);
    send(session);
    send(alert);
    const history = screen.getByTestId('alert-history');
    expect(within(history).getByText(alert.text)).toBeTruthy();
    expect(screen.getByTestId('alert-banner')).toBeTruthy();

    let handled: boolean | null | undefined;
    act(() => {
      handled = pressBack();
    });
    expect(handled).toBe(true);
    act(() => {
      jest.advanceTimersByTime(BANNER_OUT_MS + 10);
    });
    expect(screen.queryByTestId('alert-banner')).toBeNull();
    expect(within(history).getByText(alert.text)).toBeTruthy();
    expect(pressBack()).toBe(false);

    screen.unmount();
    expect(removeBack).toHaveBeenCalledTimes(1);
  });

  it('dims the radar at halftime, shows the report over it, and Back returns to the radar', () => {
    const screen = render(<App />);
    send(session);
    const radarOpacity = () =>
      StyleSheet.flatten(screen.getByTestId('radar').props.style).opacity;
    send({type: 'phase', phase: 'end', half: 1});
    act(() => {
      jest.advanceTimersByTime(FADE_MS + 10);
    });
    expect(radarOpacity()).toBeCloseTo(0.3);
    expect(screen.getByText('Analysing the first half…')).toBeTruthy();

    send(report);
    expect(screen.getByText('Halftime report')).toBeTruthy();

    let handled: boolean | null | undefined;
    act(() => {
      handled = pressBack();
    });
    expect(handled).toBe(true);
    expect(screen.queryByText('Halftime report')).toBeNull();
    act(() => {
      jest.advanceTimersByTime(FADE_MS + 10);
    });
    expect(radarOpacity()).toBe(1);
    expect(pressBack()).toBe(false);
  });
});
