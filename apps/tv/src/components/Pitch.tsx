import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {Box} from '../pitch';
import {colors} from '../theme';

// Markings as shares of a 105 x 68 m pitch, so a smaller pitch keeps them in proportion.
const PENALTY_AREA = {depth: 16.5 / 105, width: 40.32 / 68};
const GOAL_AREA = {depth: 5.5 / 105, width: 18.32 / 68};
const CENTRE_CIRCLE = 18.3 / 68;
const LINE = 2;

interface Props {
  box: Box;
}

export const Pitch = ({box}: Props) => {
  const circle = box.height * CENTRE_CIRCLE;
  const area = (
    share: {depth: number; width: number},
    edge: {left: number} | {right: number},
  ) => ({
    ...edge,
    top: (box.height * (1 - share.width)) / 2,
    width: box.width * share.depth,
    height: box.height * share.width,
  });

  return (
    <View
      style={[
        styles.pitch,
        {left: box.left, top: box.top, width: box.width, height: box.height},
      ]}>
      <View style={[styles.line, styles.outline]} />
      <View
        style={[styles.line, styles.halfway, {left: (box.width - LINE) / 2}]}
      />
      <View
        style={[
          styles.line,
          {
            left: (box.width - circle) / 2,
            top: (box.height - circle) / 2,
            width: circle,
            height: circle,
            borderRadius: circle / 2,
          },
        ]}
      />
      <View style={[styles.line, area(PENALTY_AREA, {left: 0})]} />
      <View style={[styles.line, area(PENALTY_AREA, {right: 0})]} />
      <View style={[styles.line, area(GOAL_AREA, {left: 0})]} />
      <View style={[styles.line, area(GOAL_AREA, {right: 0})]} />
    </View>
  );
};

const styles = StyleSheet.create({
  pitch: {
    position: 'absolute',
  },
  line: {
    position: 'absolute',
    borderWidth: LINE,
    borderColor: colors.lines,
  },
  outline: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  halfway: {
    top: 0,
    bottom: 0,
    width: LINE,
    borderWidth: 0,
    borderLeftWidth: LINE,
  },
});
