import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import type {Alert, Evidence, Player} from '../contracts';
import {bannerDurationMs, resolveEvidence, TvState} from '../state';
import {
  BANNER_IN_MS,
  BANNER_OUT_MS,
  BANNER_SHIFT,
  colors,
  formatValue,
  METRIC_LABEL,
  MIN_TEXT,
  PULSE_COUNT,
  PULSE_MS,
  PULSE_SCALE,
  RADAR_AREA,
  TEAM_LABEL,
} from '../theme';

type Snapshots = TvState['snapshots'];

interface Chip {
  label: string;
  values: string;
}

function chips(evidence: Evidence[], snapshots: Snapshots): Chip[] {
  const metrics = [...new Set(evidence.map(e => e.metric))];
  return metrics.map(metric => {
    const refs = evidence.filter(e => e.metric === metric);
    const value = (e: Evidence) => {
      const v = resolveEvidence(e, {snapshots});
      return v === undefined ? undefined : formatValue(metric, v);
    };
    const team = refs[0].team;
    if (refs.every(e => e.team === team)) {
      return {
        label: `${METRIC_LABEL[metric]} · ${TEAM_LABEL[team]}`,
        values: [...refs]
          .sort((a, b) => a.period.from_min - b.period.from_min)
          .map(value)
          .filter(v => v !== undefined)
          .join(' → '),
      };
    }
    return {
      label: METRIC_LABEL[metric],
      values: refs
        .map(e => {
          const v = value(e);
          return v === undefined
            ? TEAM_LABEL[e.team]
            : `${TEAM_LABEL[e.team]} ${v}`;
        })
        .join(' · '),
    };
  });
}

export const usePulse = (
  banner: Alert | null,
  metrics: Evidence['metric'][],
  team?: Player['team'],
) => {
  const scale = useRef(new Animated.Value(1)).current;
  const trigger = banner?.evidence.some(
    e => metrics.includes(e.metric) && (team === undefined || e.team === team),
  )
    ? banner
    : null;

  useEffect(() => {
    if (!trigger) {
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: PULSE_SCALE,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: PULSE_MS,
          useNativeDriver: true,
        }),
      ]),
      {iterations: PULSE_COUNT},
    );
    pulse.start();
    return () => {
      pulse.stop();
      scale.setValue(1);
    };
  }, [scale, trigger]);

  return scale;
};

export const MinuteBadge = ({minute}: {minute: Alert['minute']}) => (
  <Text style={styles.badge}>{`${minute}'`}</Text>
);

interface Props {
  alert: Alert | null;
  snapshots: Snapshots;
  onExpire: () => void;
}

export const AlertBanner = ({alert, snapshots, onExpire}: Props) => {
  const [shown, setShown] = useState(alert);
  const translateY = useRef(new Animated.Value(-BANNER_SHIFT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  if (alert && alert !== shown) {
    setShown(alert);
  }

  useEffect(() => {
    const visible = alert !== null;
    const tween = (value: Animated.Value, toValue: number) =>
      Animated.timing(value, {
        toValue,
        duration: visible ? BANNER_IN_MS : BANNER_OUT_MS,
        easing: visible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
        useNativeDriver: true,
      });
    const motion = Animated.parallel([
      tween(translateY, visible ? 0 : -BANNER_SHIFT),
      tween(opacity, visible ? 1 : 0),
    ]);

    if (!alert) {
      motion.start(({finished}) => {
        if (finished) {
          setShown(null);
        }
      });
      return;
    }
    motion.start();
    const timer = setTimeout(onExpire, bannerDurationMs(alert.text));
    return () => clearTimeout(timer);
  }, [alert, onExpire, opacity, translateY]);

  if (!shown) {
    return null;
  }

  return (
    <Animated.View
      testID="alert-banner"
      style={[styles.banner, {opacity, transform: [{translateY}]}]}>
      <View style={styles.row}>
        <MinuteBadge minute={shown.minute} />
        <Text style={[styles.text, styles.message]}>{shown.text}</Text>
      </View>
      <View style={styles.chips}>
        {chips(shown.evidence, snapshots).map(chip => (
          <View key={chip.label} style={styles.chip}>
            <Text style={styles.text}>{chip.label}</Text>
            {chip.values !== '' && (
              <Text style={[styles.text, styles.value]}>{chip.values}</Text>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: RADAR_AREA.left,
    top: RADAR_AREA.top,
    width: RADAR_AREA.width,
    padding: 24,
    backgroundColor: colors.background,
    borderColor: colors.alert,
    borderWidth: 2,
    borderLeftWidth: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  text: {
    color: colors.text,
    fontSize: MIN_TEXT,
  },
  message: {
    flex: 1,
    fontSize: 32,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginLeft: 72,
  },
  chip: {
    marginRight: 40,
  },
  value: {
    fontWeight: '600',
  },
  badge: {
    minWidth: 72,
    color: colors.alert,
    fontSize: 32,
    fontWeight: '700',
  },
});
