import 'react-native';
import {act, render} from '@testing-library/react-native';
import * as React from 'react';
import {StyleSheet} from 'react-native';

import {StatsPanel} from '../src/components/StatsPanel';
import type {Evidence, Metrics, TeamMetrics} from '../src/contracts';
import {FADE_MS} from '../src/theme';

const home: TeamMetrics = {
  possession: 54.2,
  line_height: 31.5,
  width: 44.8,
  depth: 36.2,
  compactness: 1621.8,
  attack_direction: 1,
  line_x: -21.0,
  block: {x_min: -24.1, x_max: 12.1, y_min: -22.0, y_max: 22.8},
};

const away: TeamMetrics = {
  possession: 45.8,
  line_height: 24.0,
  width: 40.2,
  depth: 30.5,
  compactness: 1226.1,
  attack_direction: -1,
  line_x: 28.5,
  block: {x_min: 0.5, x_max: 31.0, y_min: -19.6, y_max: 20.6},
};

const rolling = (
  h: Partial<TeamMetrics> = {},
  a: Partial<TeamMetrics> = {},
): Metrics => ({
  type: 'metrics',
  half: 1,
  clock_ms: 600000,
  period: {kind: 'rolling', from_min: 5, to_min: 10},
  teams: {home: {...home, ...h}, away: {...away, ...a}},
});

const current = rolling();
const previous = rolling(
  {possession: 50, width: 46, depth: 36.4, compactness: 1500},
  {possession: 50, line_height: 26, depth: 29},
);

const METRICS: Evidence['metric'][] = [
  'possession',
  'line_height',
  'width',
  'depth',
  'compactness',
];
const TEAMS = ['home', 'away'] as const;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const possessionTransform = (screen: ReturnType<typeof render>) =>
  StyleSheet.flatten(screen.getByTestId('possession-home').props.style)
    .transform;

describe('StatsPanel', () => {
  it("renders both teams' five values through formatValue", () => {
    const screen = render(<StatsPanel current={current} previous={previous} />);
    for (const text of [
      'Home',
      'Away',
      'Possession',
      'Line height',
      'Width',
      'Depth',
      'Compactness',
      '54%',
      '32 m',
      '45 m',
      '36 m',
      '1622 m²',
      '46%',
      '24 m',
      '40 m',
      '31 m',
      '1226 m²',
    ]) {
      expect(screen.getByText(text)).toBeTruthy();
    }
  });

  it('shows ▲ where a value rose, ▼ where it fell and nothing where it is unchanged', () => {
    const screen = render(<StatsPanel current={current} previous={previous} />);
    const trends = Object.fromEntries(
      TEAMS.map(team => [
        team,
        Object.fromEntries(
          METRICS.map(metric => [
            metric,
            screen.queryByTestId(`trend-${team}-${metric}`)?.props.children ??
              null,
          ]),
        ),
      ]),
    );
    expect(trends).toEqual({
      home: {
        possession: '▲',
        line_height: null,
        width: '▼',
        depth: null,
        compactness: '▲',
      },
      away: {
        possession: '▼',
        line_height: '▼',
        width: null,
        depth: '▲',
        compactness: null,
      },
    });
  });

  it('fades a changed value out before showing the new one', () => {
    const screen = render(<StatsPanel current={current} previous={null} />);
    screen.rerender(
      <StatsPanel current={rolling({possession: 60})} previous={current} />,
    );
    expect(screen.getByText('54%')).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(FADE_MS + 50);
    });
    expect(screen.queryByText('54%')).toBeNull();
    expect(screen.getByText('60%')).toBeTruthy();
  });

  it('shows no trend without previous metrics', () => {
    const screen = render(<StatsPanel current={current} previous={null} />);
    expect(screen.queryByText('▲')).toBeNull();
    expect(screen.queryByText('▼')).toBeNull();
  });

  it('scales the possession bar to home / (home + away)', () => {
    const screen = render(<StatsPanel current={current} previous={null} />);
    expect(possessionTransform(screen)).toContainEqual({scaleX: 0.542});
  });

  it('keeps the possession bar at half, never NaN, when both possessions are 0', () => {
    const screen = render(
      <StatsPanel
        current={rolling({possession: 0}, {possession: 0})}
        previous={null}
      />,
    );
    expect(possessionTransform(screen)).toContainEqual({scaleX: 0.5});
  });

  it('renders nothing before the first rolling metrics', () => {
    const screen = render(<StatsPanel current={null} previous={null} />);
    expect(screen.toJSON()).toBeNull();
  });
});
