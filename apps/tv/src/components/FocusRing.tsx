import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {
  colors,
  FOCUS_IN_MS,
  FOCUS_OUT_MS,
  FOCUS_SCALE,
  FOCUS_SCALE_LARGE,
} from '../theme';

const RING = 4;
const GAP = 6;

interface Props {
  focused: boolean;
  large: boolean;
  children: React.ReactNode;
}

export const FocusRing = ({focused, large, children}: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const tween = (value: Animated.Value, toValue: number) =>
      Animated.timing(value, {
        toValue,
        duration: focused ? FOCUS_IN_MS : FOCUS_OUT_MS,
        useNativeDriver: true,
      });
    const grown = large ? FOCUS_SCALE_LARGE : FOCUS_SCALE;
    Animated.parallel([
      tween(opacity, focused ? 1 : 0),
      tween(scale, focused ? grown : 1),
    ]).start();
  }, [focused, large, opacity, scale]);

  return (
    <Animated.View testID="focus-scale" style={{transform: [{scale}]}}>
      {children}
      <Animated.View testID="focus-ring" style={[styles.ring, {opacity}]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    left: -GAP,
    top: -GAP,
    right: -GAP,
    bottom: -GAP,
    borderWidth: RING,
    borderRadius: 12,
    borderColor: colors.text,
  },
});
