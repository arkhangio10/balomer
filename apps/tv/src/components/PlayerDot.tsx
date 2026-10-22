import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import type {Player} from '../contracts';
import {colors, FRAME_MS} from '../theme';

const SIZE = 24;
const RING = 4;

interface Props {
  left: number;
  top: number;
  team: Player['team'];
  visible: boolean;
}

export const PlayerDot = ({left, top, team, visible}: Props) => {
  const position = useRef(new Animated.ValueXY({x: left, y: top})).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(position, {
      toValue: {x: left, y: top},
      duration: FRAME_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [position, left, top]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: FRAME_MS,
      useNativeDriver: true,
    }).start();
  }, [opacity, visible]);

  return (
    <Animated.View
      style={[
        styles.dot,
        team === 'home' ? styles.home : styles.away,
        {opacity, transform: position.getTranslateTransform()},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    left: -SIZE / 2,
    top: -SIZE / 2,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  home: {
    backgroundColor: colors.home,
  },
  away: {
    borderWidth: RING,
    borderColor: colors.away,
  },
});
