/* global globalThis */
import 'react-native';
import {act, render} from '@testing-library/react-native';
import * as React from 'react';

import {App} from '../src/App';
import type {Metrics, Session, TeamMetrics} from '../src/contracts';

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

const send = (message: Session | Metrics) =>
  act(() => FakeSocket.last.onmessage?.({data: JSON.stringify(message)}));

const realWebSocket = globalThis.WebSocket;

beforeEach(() => {
  jest.useFakeTimers();
  globalThis.WebSocket = FakeSocket as unknown as typeof WebSocket;
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
});
