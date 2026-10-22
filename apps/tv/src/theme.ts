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

export const FRAME_MS = 200;

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
