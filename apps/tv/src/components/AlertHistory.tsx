import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Alert} from '../contracts';
import {colors, MIN_TEXT} from '../theme';
import {MinuteBadge} from './AlertBanner';

interface Props {
  alerts: Alert[];
}

export const AlertHistory = ({alerts}: Props) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <View testID="alert-history" style={styles.history}>
      <Text style={[styles.text, styles.heading]}>Alerts</Text>
      {alerts.map(alert => (
        <View key={alert.minute} style={styles.item}>
          <MinuteBadge minute={alert.minute} />
          <Text style={[styles.text, styles.body]}>{alert.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  history: {
    marginTop: 24,
  },
  text: {
    color: colors.text,
    fontSize: MIN_TEXT,
  },
  heading: {
    fontWeight: '600',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  body: {
    flex: 1,
  },
});
