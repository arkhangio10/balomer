import React, {useEffect, useReducer} from 'react';
import {StyleSheet, View} from 'react-native';
import {Ball} from './components/Ball';
import {ClockBar} from './components/ClockBar';
import {Pitch} from './components/Pitch';
import {PlayerDot} from './components/PlayerDot';
import {API_URL, connect} from './feed';
import {fitPitch, toScreen} from './pitch';
import {initialState, reduce} from './state';
import {colors, RADAR_AREA} from './theme';

export const App = () => {
  const [state, dispatch] = useReducer(reduce, initialState);

  useEffect(
    () => connect(API_URL, message => dispatch({kind: 'message', message})),
    [],
  );

  const {session} = state;
  if (!session) {
    return <View style={styles.screen} />;
  }

  const L = session.pitch_length_m;
  const W = session.pitch_width_m;
  const box = fitPitch(L, W, RADAR_AREA);

  return (
    <View style={styles.screen}>
      <ClockBar
        clockMs={state.clockMs}
        half={session.half}
        credit={session.credit}
      />
      <Pitch box={box} />
      {Object.values(state.dots).map(dot => (
        <PlayerDot
          key={dot.id}
          {...toScreen(dot, L, W, box)}
          team={dot.team}
          visible={dot.visible}
        />
      ))}
      {state.ball && (
        <Ball
          {...toScreen(state.ball, L, W, box)}
          trail={state.trail.map(p => toScreen(p, L, W, box))}
          possession={state.possession}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
