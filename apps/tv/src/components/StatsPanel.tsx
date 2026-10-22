import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import type {Evidence, Metrics} from '../contracts';
import {
  colors,
  FADE_MS,
  formatValue,
  METRIC_LABEL,
  MIN_TEXT,
  STATS_AREA,
  TEAM_LABEL,
} from '../theme';
import {PossessionBar} from './PossessionBar';

const TEAMS = ['home', 'away'] as const;
const METRICS = Object.keys(METRIC_LABEL) as Evidence['metric'][];

interface Props {
  current: Metrics | null;
  previous: Metrics | null;
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

export const StatsPanel = ({current, previous}: Props) => {
  if (!current) {
    return null;
  }

  return (
    <View style={styles.panel}>
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
                <View key={team} style={styles.cell}>
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
                </View>
              );
            })}
          </View>
          {metric === 'possession' && (
            <PossessionBar
              home={current.teams.home.possession}
              away={current.teams.away.possession}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: STATS_AREA.left,
    top: STATS_AREA.top,
    width: STATS_AREA.width,
  },
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
