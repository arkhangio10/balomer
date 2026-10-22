import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import type {Player} from '../contracts';
import {colors, FRAME_MS} from '../theme';

const SIZE = 14;
const HALO = 34;
const GHOST_OPACITY = [0.45, 0.25, 0.1];

interface ScreenPoint {
  left: number;
  top: number;
}

interface Props extends ScreenPoint {
  trail: ScreenPoint[];
  possession: Player['team'] | null;
}

export const Ball = ({left, top, trail, possession}: Props) => {
  const position = useRef(new Animated.ValueXY({x: left, y: top})).current;

  useEffect(() => {
    Animated.timing(position, {
      toValue: {x: left, y: top},
      duration: FRAME_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [position, left, top]);

  return (
    <>
      {trail.map((p, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            styles.ghost,
            {
              opacity: GHOST_OPACITY[i],
              transform: [{translateX: p.left}, {translateY: p.top}],
            },
          ]}
        />
      ))}
      <Animated.View
        style={[styles.halo, {transform: position.getTranslateTransform()}]}>
        {possession && (
          <View style={[styles.ring, {borderColor: colors[possession]}]} />
        )}
        <View style={styles.dot} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.ball,
  },
  ghost: {
    position: 'absolute',
    left: -SIZE / 2,
    top: -SIZE / 2,
  },
  halo: {
    position: 'absolute',
    left: -HALO / 2,
    top: -HALO / 2,
    width: HALO,
    height: HALO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: HALO / 2,
    borderWidth: 3,
  },
});
