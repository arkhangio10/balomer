import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import type {Alert} from '../contracts';
import {colors, STATS_AREA, TWEEN_MS} from '../theme';
import {usePulse} from './AlertBanner';

const WIDTH = STATS_AREA.width;
const HEIGHT = 16;
const BORDER = 2;

interface Props {
  home: number;
  away: number;
  banner: Alert | null;
}

export const PossessionBar = ({home, away, banner}: Props) => {
  const share = home + away > 0 ? home / (home + away) : 0.5;
  const scale = useRef(new Animated.Value(share)).current;
  // A scale is about the centre; this shift keeps the fill on the left edge.
  const shift = useRef(
    scale.interpolate({inputRange: [0, 1], outputRange: [-WIDTH / 2, 0]}),
  ).current;
  const pulse = usePulse(banner, ['possession']);

  useEffect(() => {
    Animated.timing(scale, {
      toValue: share,
      duration: TWEEN_MS,
      useNativeDriver: true,
    }).start();
  }, [scale, share]);

  return (
    <Animated.View
      testID="possession-bar"
      style={[styles.bar, {transform: [{scale: pulse}]}]}>
      <View style={[styles.part, styles.away]} />
      <Animated.View
        testID="possession-home"
        style={[
          styles.part,
          styles.home,
          {transform: [{translateX: shift}, {scaleX: scale}]},
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: WIDTH,
    height: HEIGHT,
    marginVertical: 8,
  },
  part: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  home: {
    backgroundColor: colors.home,
  },
  away: {
    borderWidth: BORDER,
    borderColor: colors.away,
  },
});
