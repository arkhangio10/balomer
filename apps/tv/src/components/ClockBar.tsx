import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CLOCK_BAR_HEIGHT, colors, MIN_TEXT, SAFE, SCREEN} from '../theme';

interface Props {
  clockMs: number;
  half: 1 | 2;
  credit: string;
}

const twoDigits = (n: number) => String(n).padStart(2, '0');

export const ClockBar = ({clockMs, half, credit}: Props) => {
  const seconds = Math.floor(clockMs / 1000);
  const clock = `${twoDigits(Math.floor(seconds / 60))}:${twoDigits(seconds % 60)}`;

  return (
    <View style={styles.bar}>
      <Text style={styles.clock}>{clock}</Text>
      <Text style={styles.label}>{half === 1 ? '1st half' : '2nd half'}</Text>
      <Text style={[styles.label, styles.credit]}>{credit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: SAFE.x,
    top: SAFE.y,
    width: SCREEN.width - 2 * SAFE.x,
    height: CLOCK_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clock: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '600',
    marginRight: 24,
  },
  label: {
    color: colors.text,
    fontSize: MIN_TEXT,
  },
  credit: {
    marginLeft: 'auto',
  },
});
