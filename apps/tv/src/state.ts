import type {Frame, Message, Player, Point, Session} from './contracts';

const TRAIL_LENGTH = 3;

export interface Dot {
  id: string;
  team: Player['team'];
  role: Player['role'];
  x: number;
  y: number;
  visible: boolean;
}

export interface TvState {
  session: Session | null;
  half: 1 | 2 | null;
  clockMs: number;
  dots: Record<string, Dot>;
  ball: Point | null;
  trail: Point[];
  possession: Player['team'] | null;
}

export type Action = {kind: 'message'; message: Message};

export const initialState: TvState = {
  session: null,
  half: null,
  clockMs: 0,
  dots: {},
  ball: null,
  trail: [],
  possession: null,
};

function applyFrame(state: TvState, frame: Frame): TvState {
  const dots: Record<string, Dot> = {};
  for (const [id, dot] of Object.entries(state.dots)) {
    dots[id] = {...dot, visible: false};
  }
  for (const {id, team, role, x, y} of frame.players) {
    dots[id] = {id, team, role, x, y, visible: true};
  }
  return {
    ...state,
    half: frame.half,
    clockMs: frame.clock_ms,
    dots,
    ball: frame.ball,
    trail:
      frame.ball && state.ball
        ? [state.ball, ...state.trail].slice(0, TRAIL_LENGTH)
        : [],
    possession: frame.possession,
  };
}

export function reduce(state: TvState, action: Action): TvState {
  const message = action.message;
  switch (message.type) {
    case 'session':
      return message.half === 1
        ? {...initialState, session: message}
        : {...state, session: message, half: message.half};
    case 'frame':
      return applyFrame(state, message);
    default:
      return state;
  }
}
