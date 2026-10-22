import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import type {Alert, Player} from '../contracts';
import type {Box} from '../pitch';
import {colors, SCREEN, TWEEN_MS} from '../theme';
import {usePulse} from './AlertBanner';

const EDGE = 3;
const FILL_OPACITY = 0.25;

interface ScreenPoint {
  left: number;
  top: number;
}

interface Props {
  team: Player['team'];
  topLeft: ScreenPoint;
  bottomRight: ScreenPoint;
  box: Box;
  banner: Alert | null;
}

const useTween = (target: number) => {
  const value = useRef(new Animated.Value(target)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: target,
      duration: TWEEN_MS,
      useNativeDriver: true,
    }).start();
  }, [value, target]);

  return value;
};

// sign × (x − half) as a node that follows x: interpolate extrapolates linearly.
const offset = (x: Animated.Value, half: number, sign: 1 | -1) =>
  x.interpolate({
    inputRange: [0, 1],
    outputRange: [-sign * half, sign * (1 - half)],
  });

export const TeamBlock = ({team, topLeft, bottomRight, box, banner}: Props) => {
  const centreX = useTween((topLeft.left + bottomRight.left) / 2);
  const centreY = useTween((topLeft.top + bottomRight.top) / 2);
  const scaleX = useTween((bottomRight.left - topLeft.left) / box.width);
  const scaleY = useTween((bottomRight.top - topLeft.top) / box.height);
  const left = useTween(topLeft.left);
  const right = useTween(bottomRight.left);
  const top = useTween(topLeft.top);
  const bottom = useTween(bottomRight.top);
  const pulse = usePulse(banner, ['width', 'depth', 'compactness'], team);
  // The wrapper's origin is the screen centre: move it to the block centre to scale there.
  const aroundCentre = useMemo(
    () => [
      {translateX: offset(centreX, SCREEN.width / 2, 1)},
      {translateY: offset(centreY, SCREEN.height / 2, 1)},
      {scale: pulse},
      {translateX: offset(centreX, SCREEN.width / 2, -1)},
      {translateY: offset(centreY, SCREEN.height / 2, -1)},
    ],
    [centreX, centreY, pulse],
  );

  const spanX = {left: -box.width / 2, width: box.width};
  const spanY = {top: -box.height / 2, height: box.height};

  if (team === 'home') {
    return (
      <Animated.View style={[styles.screen, {transform: aroundCentre}]}>
        <Animated.View
          style={[
            styles.fill,
            spanX,
            spanY,
            {
              transform: [
                {translateX: centreX},
                {translateY: centreY},
                {scaleX},
                {scaleY},
              ],
            },
          ]}
        />
      </Animated.View>
    );
  }

  // Each edge is scaled along its length only, so the outline keeps its thickness.
  return (
    <Animated.View style={[styles.screen, {transform: aroundCentre}]}>
      {[top, bottom].map((y, i) => (
        <Animated.View
          key={`horizontal-${i}`}
          style={[
            styles.edge,
            styles.horizontal,
            spanX,
            {transform: [{translateX: centreX}, {translateY: y}, {scaleX}]},
          ]}
        />
      ))}
      {[left, right].map((x, i) => (
        <Animated.View
          key={`vertical-${i}`}
          style={[
            styles.edge,
            styles.vertical,
            spanY,
            {transform: [{translateX: x}, {translateY: centreY}, {scaleY}]},
          ]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN.width,
    height: SCREEN.height,
  },
  fill: {
    position: 'absolute',
    backgroundColor: colors.home,
    opacity: FILL_OPACITY,
  },
  edge: {
    position: 'absolute',
    backgroundColor: colors.away,
  },
  horizontal: {
    top: -EDGE / 2,
    height: EDGE,
  },
  vertical: {
    left: -EDGE / 2,
    width: EDGE,
  },
});
