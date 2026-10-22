import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import type {Evidence, Recommendation} from '../contracts';
import {resolveEvidence, TvState} from '../state';
import {
  CARD_IN_MS,
  CARD_SHIFT,
  CARD_STAGGER_MS,
  colors,
  formatValue,
  METRIC_LABEL,
  MIN_TEXT,
  TEAM_LABEL,
} from '../theme';
import {FocusRing} from './FocusRing';

type Snapshots = TvState['snapshots'];

function chip(e: Evidence, snapshots: Snapshots): string {
  const parts = [
    METRIC_LABEL[e.metric],
    TEAM_LABEL[e.team],
    `${e.period.from_min}–${e.period.to_min}'`,
  ];
  const value = resolveEvidence(e, {snapshots});
  return (
    value === undefined ? parts : [...parts, formatValue(e.metric, value)]
  ).join(' · ');
}

interface Props {
  recommendation: Recommendation;
  snapshots: Snapshots;
  index: number;
}

export const ReportCard = ({recommendation, snapshots, index}: Props) => {
  const [focused, setFocused] = useState(false);
  const enter = useRef(new Animated.Value(0)).current;
  const translateY = useRef(
    enter.interpolate({inputRange: [0, 1], outputRange: [CARD_SHIFT, 0]}),
  ).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: CARD_IN_MS,
      delay: index * CARD_STAGGER_MS,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  return (
    <Animated.View
      testID="report-card"
      focusable
      hasTVPreferredFocus={index === 0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.card, {opacity: enter, transform: [{translateY}]}]}>
      <FocusRing focused={focused} large>
        <View style={styles.body}>
          <Text style={[styles.text, styles.problem]}>
            {recommendation.problem}
          </Text>
          <Text style={styles.text}>{recommendation.adjustment}</Text>
          <View style={styles.chips}>
            {recommendation.evidence.map((e, i) => (
              <Text key={i} style={[styles.text, styles.chip]}>
                {chip(e, snapshots)}
              </Text>
            ))}
          </View>
        </View>
      </FocusRing>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
  },
  body: {
    padding: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.lines,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
    fontSize: MIN_TEXT,
  },
  problem: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  chip: {
    marginRight: 40,
    fontWeight: '600',
  },
});
