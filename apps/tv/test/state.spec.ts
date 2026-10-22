import type {Frame, Player, Point, Session} from '../src/contracts';
import {initialState, reduce, TvState} from '../src/state';

const session = (half: 1 | 2): Session => ({
  type: 'session',
  match_id: 'sample',
  half,
  pitch_length_m: 105,
  pitch_width_m: 68,
  credit: 'Synthetic test sample',
});

const h1: Player = {id: 'h1', team: 'home', role: 'goalkeeper', x: -50, y: 0};
const a1: Player = {id: 'a1', team: 'away', role: 'player', x: 10, y: -5};
const h2: Player = {id: 'h2', team: 'home', role: 'player', x: -20, y: 8};

const frame = (
  clockMs: number,
  players: Player[],
  ball: Point | null = {x: 0, y: 0},
): Frame => ({
  type: 'frame',
  half: 1,
  clock_ms: clockMs,
  players,
  ball,
  possession: 'home',
});

const play = (...frames: Frame[]): TvState =>
  frames.reduce(
    (state, message) => reduce(state, {kind: 'message', message}),
    reduce(initialState, {kind: 'message', message: session(1)}),
  );

describe('reduce', () => {
  it('shows the players of a frame at their coordinates', () => {
    const state = play(frame(200, [h1, a1]));
    expect(state.dots.h1).toEqual({...h1, visible: true});
    expect(state.dots.a1).toEqual({...a1, visible: true});
    expect(state.possession).toBe('home');
    expect(state.half).toBe(1);
    expect(state.clockMs).toBe(200);
  });

  it('keeps a missing player hidden and adds a new one', () => {
    const state = play(frame(0, [h1, a1]), frame(200, [h1, h2]));
    expect(state.dots.a1).toEqual({...a1, visible: false});
    expect(state.dots.h2).toEqual({...h2, visible: true});
  });

  it('shows a player again when it comes back', () => {
    const state = play(
      frame(0, [h1, a1]),
      frame(200, [h1]),
      frame(400, [h1, a1]),
    );
    expect(state.dots.a1.visible).toBe(true);
  });

  it('keeps the last three ball positions, newest first', () => {
    const state = play(
      frame(0, [h1], {x: 0, y: 0}),
      frame(200, [h1], {x: 1, y: 0}),
      frame(400, [h1], {x: 2, y: 0}),
      frame(600, [h1], {x: 3, y: 0}),
      frame(800, [h1], {x: 4, y: 0}),
    );
    expect(state.ball).toEqual({x: 4, y: 0});
    expect(state.trail).toEqual([
      {x: 3, y: 0},
      {x: 2, y: 0},
      {x: 1, y: 0},
    ]);
  });

  it('clears the ball and its trail when the ball is missing', () => {
    const state = play(
      frame(0, [h1], {x: 0, y: 0}),
      frame(200, [h1], {x: 1, y: 0}),
      frame(400, [h1], null),
    );
    expect(state.ball).toBeNull();
    expect(state.trail).toEqual([]);
  });

  it('resets the state on a session for half 1', () => {
    const state = play(frame(0, [h1], {x: 0, y: 0}), frame(200, [h1, a1]));
    const next = reduce(state, {kind: 'message', message: session(1)});
    expect(next).toEqual({...initialState, session: session(1)});
  });

  it('keeps the players on a session for half 2', () => {
    const state = play(frame(0, [h1]));
    const next = reduce(state, {kind: 'message', message: session(2)});
    expect(next).toEqual({...state, session: session(2), half: 2});
  });
});
