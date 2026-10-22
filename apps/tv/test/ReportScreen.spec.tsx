import 'react-native';
import {act, fireEvent, render, within} from '@testing-library/react-native';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import type {ReactTestInstance} from 'react-test-renderer';

import {ReportScreen} from '../src/components/ReportScreen';
import type {
  Metrics,
  Period,
  ReportOk,
  ReportUnavailable,
  TeamMetrics,
} from '../src/contracts';
import {periodKey} from '../src/state';
import {
  CARD_IN_MS,
  CARD_STAGGER_MS,
  FOCUS_IN_MS,
  FOCUS_OUT_MS,
  WAIT_PULSE_MS,
} from '../src/theme';

const second: Period = {kind: 'block', from_min: 15, to_min: 30};
const firstHalf: Period = {kind: 'half', from_min: 0, to_min: 45};

// A fixture for the screen only: it is never shown as a generated report.
const fixture: ReportOk = {
  type: 'report',
  kind: 'halftime',
  status: 'ok',
  recommendations: [
    {
      problem:
        'Away defended deep after the first quarter-hour and gave Home time on the ball.',
      adjustment:
        'Push the back line up together whenever the ball goes backwards.',
      evidence: [{metric: 'line_height', team: 'away', period: second}],
    },
    {
      problem: 'Home stretched wide and left space between the lines.',
      adjustment:
        'Keep the far winger narrow while the ball is on the other flank.',
      evidence: [
        {metric: 'width', team: 'home', period: firstHalf},
        {metric: 'compactness', team: 'home', period: firstHalf},
      ],
    },
    {
      problem: 'Away lost the ball more often than Home in the first half.',
      adjustment:
        'Add a midfielder close to the ball carrier to offer a short pass.',
      evidence: [{metric: 'possession', team: 'away', period: firstHalf}],
    },
  ],
};

const unavailable: ReportUnavailable = {
  type: 'report',
  kind: 'fulltime',
  status: 'unavailable',
};

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

const snapshot = (
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
  [periodKey(second)]: snapshot(second, {}, {line_height: 24.2}),
  [periodKey(firstHalf)]: snapshot(
    firstHalf,
    {width: 51.6, compactness: 1450.4},
    {possession: 43.6},
  ),
};

const flat = (element: ReactTestInstance) =>
  StyleSheet.flatten(element.props.style);

const focusOf = (card: ReactTestInstance) => ({
  ringOpacity: flat(within(card).getByTestId('focus-ring')).opacity,
  scale: flat(within(card).getByTestId('focus-scale')).transform,
});

const advance = (ms: number) =>
  act(() => {
    jest.advanceTimersByTime(ms);
  });

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('ReportScreen', () => {
  it('shows three cards with their problem, adjustment and resolved evidence', () => {
    const screen = render(
      <ReportScreen report={fixture} snapshots={snapshots} />,
    );
    expect(screen.getByText('Halftime report')).toBeTruthy();
    const cards = screen.getAllByTestId('report-card');
    expect(cards).toHaveLength(3);
    fixture.recommendations.forEach((r, i) => {
      expect(within(cards[i]).getByText(r.problem)).toBeTruthy();
      expect(within(cards[i]).getByText(r.adjustment)).toBeTruthy();
    });
    expect(
      within(cards[0]).getByText("Line height · Away · 15–30' · 24 m"),
    ).toBeTruthy();
    expect(
      within(cards[1]).getByText("Width · Home · 0–45' · 52 m"),
    ).toBeTruthy();
    expect(
      within(cards[1]).getByText("Compactness · Home · 0–45' · 1450 m²"),
    ).toBeTruthy();
    expect(
      within(cards[2]).getByText("Possession · Away · 0–45' · 44%"),
    ).toBeTruthy();
  });

  it('shows an evidence chip without a value when its snapshot is missing', () => {
    const screen = render(<ReportScreen report={fixture} snapshots={{}} />);
    expect(screen.getByText("Line height · Away · 15–30'")).toBeTruthy();
    expect(screen.queryAllByText(/' · /)).toHaveLength(0);
  });

  it('makes every card focusable and gives only the first the preferred focus', () => {
    const screen = render(
      <ReportScreen report={fixture} snapshots={snapshots} />,
    );
    const cards = screen.getAllByTestId('report-card');
    expect(cards.map(c => c.props.focusable)).toEqual([true, true, true]);
    expect(cards.map(c => c.props.hasTVPreferredFocus)).toEqual([
      true,
      false,
      false,
    ]);
  });

  it('staggers the cards in 120 ms apart, rising 40 px as they fade in', () => {
    const screen = render(
      <ReportScreen report={fixture} snapshots={snapshots} />,
    );
    const cards = () => screen.getAllByTestId('report-card').map(flat);
    expect(cards().map(c => [c.opacity, c.transform])).toEqual([
      [0, [{translateY: 40}]],
      [0, [{translateY: 40}]],
      [0, [{translateY: 40}]],
    ]);
    advance(CARD_IN_MS + 10);
    const [first, ...rest] = cards();
    expect([first.opacity, first.transform]).toEqual([1, [{translateY: 0}]]);
    rest.forEach(c => expect(c.opacity).toBeLessThan(1));
    advance(2 * CARD_STAGGER_MS);
    expect(cards().map(c => [c.opacity, c.transform])).toEqual([
      [1, [{translateY: 0}]],
      [1, [{translateY: 0}]],
      [1, [{translateY: 0}]],
    ]);
  });

  it('moves the ring and the scale with the D-pad focus', () => {
    const screen = render(
      <ReportScreen report={fixture} snapshots={snapshots} />,
    );
    const [card1, card2, card3] = screen.getAllByTestId('report-card');
    fireEvent(card1, 'focus');
    advance(FOCUS_IN_MS + 10);
    expect(focusOf(card1)).toEqual({ringOpacity: 1, scale: [{scale: 1.025}]});

    fireEvent(card1, 'blur');
    fireEvent(card2, 'focus');
    advance(FOCUS_OUT_MS + 10);
    expect(focusOf(card1)).toEqual({ringOpacity: 0, scale: [{scale: 1}]});
    advance(FOCUS_IN_MS - FOCUS_OUT_MS);
    expect(focusOf(card2)).toEqual({ringOpacity: 1, scale: [{scale: 1.025}]});
    expect(focusOf(card3)).toEqual({ringOpacity: 0, scale: [{scale: 1}]});
  });

  it('shows one static card and no recommendation for an unavailable report', () => {
    const screen = render(
      <ReportScreen report={unavailable} snapshots={snapshots} />,
    );
    expect(screen.getByText('Full-time report')).toBeTruthy();
    expect(screen.getByText(/failed validation/)).toBeTruthy();
    expect(screen.queryAllByTestId('report-card')).toHaveLength(0);
    fixture.recommendations.forEach(r => {
      expect(screen.queryByText(r.problem)).toBeNull();
      expect(screen.queryByText(r.adjustment)).toBeNull();
    });
  });

  it('pulses "Analysing the first half…" while the halftime report is pending', () => {
    const screen = render(<ReportScreen report={null} snapshots={snapshots} />);
    const label = screen.getByText('Analysing the first half…');
    expect(flat(label).opacity).toBe(1);
    advance(WAIT_PULSE_MS / 2);
    expect(
      flat(screen.getByText('Analysing the first half…')).opacity,
    ).toBeLessThan(1);
    expect(screen.queryAllByTestId('report-card')).toHaveLength(0);
  });
});
