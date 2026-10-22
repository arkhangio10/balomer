import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import type {Player} from '../contracts';
import type {Box} from '../pitch';
import {colors} from '../theme';

const WIDTH = 4;

interface Props {
  team: Player['team'];
  left: number;
  box: Box;
}

export const DefensiveLine = ({team, left, box}: Props) => {
  const x = useRef(new Animated.Value(left)).current;

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
          transform: [{translateX: x}],
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
