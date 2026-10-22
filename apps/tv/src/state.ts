import type {
  Alert,
  Evidence,
  Frame,
  Message,
  Metrics,
  Period,
  Phase,
  Player,
  Point,
  Report,
  Session,
} from './contracts';

const TRAIL_LENGTH = 3;

const REPORT_HALF: Record<Report['kind'], Phase['half']> = {
  halftime: 1,
  fulltime: 2,
};

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
  rolling: Metrics | null;
  previousRolling: Metrics | null;
  snapshots: Record<string, Metrics>;
  alerts: Alert[];
  banner: Alert | null;
  seenFrame: boolean;
  phase: Phase | null;
  report: Report | null;
  screen: 'live' | 'halftime' | 'fulltime';
}

export type Action =
  | {kind: 'message'; message: Message}
  | {kind: 'back'}
  | {kind: 'bannerExpired'};

export const initialState: TvState = {
  session: null,
  half: null,
  clockMs: 0,
  dots: {},
  ball: null,
  trail: [],
  possession: null,
  rolling: null,
  previousRolling: null,
  snapshots: {},
  alerts: [],
  banner: null,
  seenFrame: false,
  phase: null,
  report: null,
  screen: 'live',
};

export function periodKey(p: Period): string {
  return `${p.kind}:${p.from_min}-${p.to_min}`;
}

export function resolveEvidence(
  e: Evidence,
  state: Pick<TvState, 'snapshots'>,
): number | undefined {
  return state.snapshots[periodKey(e.period)]?.teams[e.team][e.metric];
}

export function bannerDurationMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(5000, 330 * words + 2000);
}

export function handlesBack(state: TvState): boolean {
  return state.banner !== null || state.screen !== 'live';
}

function applyMetrics(state: TvState, metrics: Metrics): TvState {
  return metrics.period.kind === 'rolling'
    ? {...state, rolling: metrics, previousRolling: state.rolling}
    : {
        ...state,
        snapshots: {...state.snapshots, [periodKey(metrics.period)]: metrics},
      };
}

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
    seenFrame: true,
  };
}

export function reduce(state: TvState, action: Action): TvState {
  if (action.kind === 'bannerExpired') {
    return {...state, banner: null};
  }
  if (action.kind === 'back') {
    return state.banner ? {...state, banner: null} : {...state, screen: 'live'};
  }
  const message = action.message;
  switch (message.type) {
    case 'session':
      return message.half === 1
        ? {...initialState, session: message}
        : {
            ...state,
            session: message,
            half: message.half,
            rolling: null,
            previousRolling: null,
            banner: null,
            seenFrame: false,
            phase: null,
          };
    case 'frame':
      return applyFrame(state, message);
    case 'metrics':
      return applyMetrics(state, message);
    case 'alert':
      return {
        ...state,
        alerts: [
          message,
          ...state.alerts.filter(a => a.minute !== message.minute),
        ],
        banner: state.seenFrame ? message : state.banner,
      };
    case 'phase':
      return {
        ...state,
        phase: message,
        screen:
          message.phase === 'kickoff'
            ? 'live'
            : message.half === 1
            ? 'halftime'
            : state.screen,
      };
    case 'report':
      return {
        ...state,
        report: message,
        screen:
          state.phase?.phase === 'end' &&
          state.phase.half === REPORT_HALF[message.kind]
            ? message.kind
            : state.screen,
      };
  }
}
