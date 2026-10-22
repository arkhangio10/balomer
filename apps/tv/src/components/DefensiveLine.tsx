import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import type {Alert, Player} from '../contracts';
import type {Box} from '../pitch';
import {colors} from '../theme';
import {usePulse} from './AlertBanner';

const WIDTH = 4;

interface Props {
  team: Player['team'];
  left: number;
  box: Box;
  banner: Alert | null;
}

export const DefensiveLine = ({team, left, box, banner}: Props) => {
  const x = useRef(new Animated.Value(left)).current;
  const pulse = usePulse(banner, ['line_height'], team);

  useEffect(() => {
    Animated.spring(x, {toValue: left, useNativeDriver: true}).start();
  }, [x, left]);

  return (
    <Animated.View
      style={[
        styles.line,
        {
          top: box.top,
          height: box.height,
          backgroundColor: colors[team],
          transform: [{translateX: x}, {scale: pulse}],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: -WIDTH / 2,
    width: WIDTH,
  },
});
