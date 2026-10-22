import {TVFocusGuideView} from '@amazon-devices/react-native-kepler';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import type {Report} from '../contracts';
import type {TvState} from '../state';
import {colors, MIN_TEXT, RADAR_AREA, WAIT_PULSE_MS} from '../theme';
import {ReportCard} from './ReportCard';

const TITLE: Record<Report['kind'], string> = {
  halftime: 'Halftime report',
  fulltime: 'Full-time report',
};

const PULSE_LOW = 0.4;

const Analysing = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const tween = (toValue: number) =>
      Animated.timing(opacity, {
        toValue,
        duration: WAIT_PULSE_MS,
        useNativeDriver: true,
      });
    const pulse = Animated.loop(
      Animated.sequence([tween(PULSE_LOW), tween(1)]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View style={[styles.area, styles.centre]}>
      <Animated.Text style={[styles.text, styles.title, {opacity}]}>
        Analysing the first half…
      </Animated.Text>
    </View>
  );
};

interface Props {
  report: Report | null;
  snapshots: TvState['snapshots'];
}

export const ReportScreen = ({report, snapshots}: Props) => {
  if (!report) {
    return <Analysing />;
  }

  return (
    <View style={styles.area}>
      <Text style={[styles.text, styles.title]}>{TITLE[report.kind]}</Text>
      {report.status === 'ok' ? (
        <TVFocusGuideView autoFocus>
          {report.recommendations.map((recommendation, index) => (
            <ReportCard
              key={index}
              recommendation={recommendation}
              snapshots={snapshots}
              index={index}
            />
          ))}
        </TVFocusGuideView>
      ) : (
        <View style={styles.unavailable}>
          <Text style={styles.text}>
            This report failed validation, so it is not shown.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  area: {
    position: 'absolute',
    left: RADAR_AREA.left,
    top: RADAR_AREA.top,
    width: RADAR_AREA.width,
    height: RADAR_AREA.height,
    paddingHorizontal: 24,
  },
  centre: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontSize: MIN_TEXT,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 24,
  },
  unavailable: {
    padding: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.lines,
    backgroundColor: colors.background,
  },
});
