import type {Evidence, Player} from './contracts';
import type {Box} from './pitch';

export const SCREEN = {width: 1920, height: 1080};
export const SAFE = {x: 96, y: 54};
export const CLOCK_BAR_HEIGHT = 72;
export const MIN_TEXT = 28;

export const RADAR_AREA: Box = {
  left: SAFE.x,
  top: SAFE.y + CLOCK_BAR_HEIGHT,
  width: (SCREEN.width - 2 * SAFE.x) * 0.7,
  height: SCREEN.height - SAFE.y - (SAFE.y + CLOCK_BAR_HEIGHT),
};

const PANEL_GAP = 32;
const STATS_LEFT = RADAR_AREA.left + RADAR_AREA.width + PANEL_GAP;

export const STATS_AREA: Box = {
  left: STATS_LEFT,
  top: RADAR_AREA.top,
  width: SCREEN.width - SAFE.x - STATS_LEFT,
  height: RADAR_AREA.height,
};

export const FRAME_MS = 200;
export const TWEEN_MS = 600;
export const FADE_MS = 150;

export const TEAM_LABEL: Record<Player['team'], string> = {
  home: 'Home',
  away: 'Away',
};

export const METRIC_LABEL: Record<Evidence['metric'], string> = {
  possession: 'Possession',
  line_height: 'Line height',
  width: 'Width',
  depth: 'Depth',
  compactness: 'Compactness',
};

const UNIT: Record<Evidence['metric'], string> = {
  possession: '%',
  line_height: ' m',
  width: ' m',
  depth: ' m',
  compactness: ' m²',
};

export function formatValue(metric: Evidence['metric'], value: number): string {
  return `${Math.round(value)}${UNIT[metric]}`;
}

export const colors = {
  background: '#0B1F17',
  lines: 'rgba(255,255,255,0.35)',
  text: '#FFFFFF',
  home: '#E69F00',
  away: '#56B4E9',
  ball: '#FFFFFF',
  alert: '#F43F5E',
};

export const FOCUS_IN_MS = 150;
export const FOCUS_OUT_MS = 100;
export const FOCUS_SCALE = 1.05;
export const FOCUS_SCALE_LARGE = 1.025;

export const BANNER_IN_MS = 300;
export const BANNER_OUT_MS = 220;
export const BANNER_SHIFT = 32;

export const PULSE_SCALE = 1.12;
export const PULSE_COUNT = 3;
export const PULSE_MS = 250;
