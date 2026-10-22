import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import type {Alert, Evidence, Metrics, Player} from '../contracts';
import {
  colors,
  FADE_MS,
  formatValue,
  METRIC_LABEL,
  MIN_TEXT,
  TEAM_LABEL,
} from '../theme';
import {usePulse} from './AlertBanner';
import {PossessionBar} from './PossessionBar';

const TEAMS = ['home', 'away'] as const;
const METRICS = Object.keys(METRIC_LABEL) as Evidence['metric'][];

interface Props {
  current: Metrics | null;
  previous: Metrics | null;
  banner: Alert | null;
}

function trend(now: number, before: number): string | null {
  const change = Math.round(now) - Math.round(before);
  if (change > 0) {
    return '▲';
  }
  return change < 0 ? '▼' : null;
}

const FadeText = ({text}: {text: string}) => {
  const [shown, setShown] = useState(text);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: text === shown ? 1 : 0,
      duration: FADE_MS,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished && text !== shown) {
        setShown(text);
      }
    });
  }, [opacity, text, shown]);

  return (
    <Animated.Text style={[styles.text, styles.value, {opacity}]}>
      {shown}
    </Animated.Text>
  );
};

interface CellProps {
  banner: Alert | null;
  metric: Evidence['metric'];
  team: Player['team'];
  children: React.ReactNode;
}

const Cell = ({banner, metric, team, children}: CellProps) => {
  const scale = usePulse(banner, [metric], team);

  return (
    <Animated.View
      testID={`cell-${team}-${metric}`}
      style={[styles.cell, {transform: [{scale}]}]}>
      {children}
    </Animated.View>
  );
};

export const StatsPanel = ({current, previous, banner}: Props) => {
  if (!current) {
    return null;
  }

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.label} />
        {TEAMS.map(team => (
          <View key={team} style={styles.cell}>
            <Text
              style={[
                styles.text,
                styles.value,
                styles.team,
                {color: colors[team]},
              ]}>
              {TEAM_LABEL[team]}
            </Text>
            <View style={styles.trend} />
          </View>
        ))}
      </View>
      {METRICS.map(metric => (
        <React.Fragment key={metric}>
          <View style={styles.row}>
            <Text style={[styles.text, styles.label]}>
              {METRIC_LABEL[metric]}
            </Text>
            {TEAMS.map(team => {
              const value = current.teams[team][metric];
              const arrow =
                previous && trend(value, previous.teams[team][metric]);
              return (
                <Cell key={team} banner={banner} metric={metric} team={team}>
                  <FadeText text={formatValue(metric, value)} />
                  <View style={styles.trend}>
                    {arrow && (
                      <Text
                        testID={`trend-${team}-${metric}`}
                        style={styles.text}>
                        {arrow}
                      </Text>
                    )}
                  </View>
                </Cell>
              );
            })}
          </View>
          {metric === 'possession' && (
            <PossessionBar
              home={current.teams.home.possession}
              away={current.teams.away.possession}
              banner={banner}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    flex: 1,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontSize: MIN_TEXT,
  },
  value: {
    minWidth: 120,
    textAlign: 'right',
  },
  team: {
    fontWeight: '600',
  },
  trend: {
    width: 32,
    alignItems: 'flex-end',
  },
});
