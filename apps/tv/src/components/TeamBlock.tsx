import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import type {Player} from '../contracts';
import type {Box} from '../pitch';
import {colors, TWEEN_MS} from '../theme';

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

export const TeamBlock = ({team, topLeft, bottomRight, box}: Props) => {
  const centreX = useTween((topLeft.left + bottomRight.left) / 2);
  const centreY = useTween((topLeft.top + bottomRight.top) / 2);
  const scaleX = useTween((bottomRight.left - topLeft.left) / box.width);
  const scaleY = useTween((bottomRight.top - topLeft.top) / box.height);
  const left = useTween(topLeft.left);
  const right = useTween(bottomRight.left);
  const top = useTween(topLeft.top);
  const bottom = useTween(bottomRight.top);

  const spanX = {left: -box.width / 2, width: box.width};
  const spanY = {top: -box.height / 2, height: box.height};

  if (team === 'home') {
    return (
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
    );
  }

  // Each edge is scaled along its length only, so the outline keeps its thickness.
  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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
