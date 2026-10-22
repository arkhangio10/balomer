import 'react-native';
import {act, render} from '@testing-library/react-native';
import * as React from 'react';
import {StyleSheet} from 'react-native';

import {AlertBanner} from '../src/components/AlertBanner';
import type {Alert, Metrics, Period, TeamMetrics} from '../src/contracts';
import {periodKey} from '../src/state';
import {BANNER_IN_MS, BANNER_OUT_MS} from '../src/theme';

const team = (values: Partial<TeamMetrics>): TeamMetrics => ({
  possession: 50,
  line_height: 30,
  width: 40,
  depth: 30,
  compactness: 1200,
  attack_direction: 1,
  line_x: -20,
  block: {x_min: -25, x_max: 5, y_min: -20, y_max: 20},
  ...values,
});

const first: Period = {kind: 'block', from_min: 0, to_min: 15};
const second: Period = {kind: 'block', from_min: 15, to_min: 30};

const block = (
  period: Period,
  home: Partial<TeamMetrics>,
  away: Partial<TeamMetrics>,
): Metrics => ({
  type: 'metrics',
  half: 1,
  clock_ms: period.to_min * 60000,
  period,
  teams: {home: team(home), away: team(away)},
});

const snapshots = {
  [periodKey(first)]: block(first, {}, {line_height: 24.0}),
  [periodKey(second)]: block(
    second,
    {possession: 54.2},
    {line_height: 18.0, possession: 45.8},
  ),
};

const alert = (text: string, evidence: Alert['evidence']): Alert => ({
  type: 'alert',
  minute: 30,
  template_id: 'line_height_down',
  text,
  evidence,
});

const lineDrop = alert(
  'Away dropped their defensive line deeper towards their own goal than in the previous quarter-hour.',
  [
    {metric: 'line_height', team: 'away', period: second},
    {metric: 'line_height', team: 'away', period: first},
  ],
);

const EIGHT_WORDS = 'Home kept the ball longer than Away did.';
const FOURTEEN_WORDS =
  'Away pushed their defensive line higher up the pitch than in the previous quarter-hour.';

const banner = (screen: ReturnType<typeof render>) =>
  StyleSheet.flatten(screen.getByTestId('alert-banner').props.style);

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('AlertBanner', () => {
  it('shows a metric cited over two blocks as the earlier value → the later one', () => {
    const screen = render(
      <AlertBanner
        alert={lineDrop}
        snapshots={snapshots}
        onExpire={jest.fn()}
      />,
    );
    expect(screen.getByText("30'")).toBeTruthy();
    expect(screen.getByText(lineDrop.text)).toBeTruthy();
    expect(screen.getByText('Line height · Away')).toBeTruthy();
    expect(screen.getByText('24 m → 18 m')).toBeTruthy();
  });

  it("shows each team's value for a metric cited for both teams in one block", () => {
    const lead = alert('Home had more possession than Away.', [
      {metric: 'possession', team: 'home', period: second},
      {metric: 'possession', team: 'away', period: second},
    ]);
    const screen = render(
      <AlertBanner alert={lead} snapshots={snapshots} onExpire={jest.fn()} />,
    );
    expect(screen.getByText('Possession')).toBeTruthy();
    expect(screen.getByText('Home 54% · Away 46%')).toBeTruthy();
  });

  it('shows the label without a number when the snapshot is missing', () => {
    const missing = alert('Home dropped their line.', [
      {
        metric: 'line_height',
        team: 'home',
        period: {kind: 'block', from_min: 30, to_min: 45},
      },
    ]);
    const screen = render(
      <AlertBanner
        alert={missing}
        snapshots={snapshots}
        onExpire={jest.fn()}
      />,
    );
    expect(screen.getByText('Line height · Home')).toBeTruthy();
    expect(screen.queryByText(/ m$/)).toBeNull();
  });

  it('calls onExpire at 5000 ms for an eight-word alert, not at 4999', () => {
    const onExpire = jest.fn();
    render(
      <AlertBanner
        alert={alert(EIGHT_WORDS, lineDrop.evidence)}
        snapshots={snapshots}
        onExpire={onExpire}
      />,
    );
    act(() => {
      jest.advanceTimersByTime(4999);
    });
    expect(onExpire).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('calls onExpire at 6620 ms for a fourteen-word alert', () => {
    const onExpire = jest.fn();
    render(
      <AlertBanner
        alert={alert(FOURTEEN_WORDS, lineDrop.evidence)}
        snapshots={snapshots}
        onExpire={onExpire}
      />,
    );
    act(() => {
      jest.advanceTimersByTime(6619);
    });
    expect(onExpire).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('restarts the timer when a new alert replaces the banner', () => {
    const onExpire = jest.fn();
    const screen = render(
      <AlertBanner
        alert={alert(EIGHT_WORDS, lineDrop.evidence)}
        snapshots={snapshots}
        onExpire={onExpire}
      />,
    );
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    screen.rerender(
      <AlertBanner
        alert={lineDrop}
        snapshots={snapshots}
        onExpire={onExpire}
      />,
    );
    expect(screen.getByText(lineDrop.text)).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(4999);
    });
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('slides in from 32 px above and fades out once the alert is gone', () => {
    const screen = render(
      <AlertBanner
        alert={lineDrop}
        snapshots={snapshots}
        onExpire={jest.fn()}
      />,
    );
    expect(banner(screen)).toMatchObject({
      opacity: 0,
      transform: [{translateY: -32}],
    });
    act(() => {
      jest.advanceTimersByTime(BANNER_IN_MS + 10);
    });
    expect(banner(screen)).toMatchObject({
      opacity: 1,
      transform: [{translateY: 0}],
    });
    screen.rerender(
      <AlertBanner alert={null} snapshots={snapshots} onExpire={jest.fn()} />,
    );
    expect(screen.getByTestId('alert-banner')).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(BANNER_OUT_MS + 10);
    });
    expect(screen.queryByTestId('alert-banner')).toBeNull();
  });
});
