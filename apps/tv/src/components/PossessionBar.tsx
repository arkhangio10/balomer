import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {colors, STATS_AREA, TWEEN_MS} from '../theme';

const WIDTH = STATS_AREA.width;
const HEIGHT = 16;
const BORDER = 2;

interface Props {
  home: number;
  away: number;
}

export const PossessionBar = ({home, away}: Props) => {
  const share = home + away > 0 ? home / (home + away) : 0.5;
  const scale = useRef(new Animated.Value(share)).current;
  // A scale is about the centre; this shift keeps the fill on the left edge.
  const shift = useRef(
    scale.interpolate({inputRange: [0, 1], outputRange: [-WIDTH / 2, 0]}),
  ).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: share,
      duration: TWEEN_MS,
      useNativeDriver: true,
    }).start();
  }, [scale, share]);

  return (
    <View style={styles.bar}>
      <View style={[styles.part, styles.away]} />
      <Animated.View
        testID="possession-home"
        style={[
          styles.part,
          styles.home,
          {transform: [{translateX: shift}, {scaleX: scale}]},
        ]}
      />
    </View>
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
