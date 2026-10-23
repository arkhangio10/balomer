import {SCREEN} from './theme';

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function fitPitch(lengthM: number, widthM: number, area: Box): Box {
  const scale = Math.min(area.width / lengthM, area.height / widthM);
  const width = lengthM * scale;
  const height = widthM * scale;
  return {
    left: area.left + (area.width - width) / 2,
    top: area.top + (area.height - height) / 2,
    width,
    height,
  };
}

export function toScreen(
  p: {x: number; y: number},
  lengthM: number,
  widthM: number,
  box: Box,
): {left: number; top: number} {
  return {
    left: box.left + ((p.x + lengthM / 2) / lengthM) * box.width,
    top: box.top + ((p.y + widthM / 2) / widthM) * box.height,
  };
}

// Vega lays out in dp, 960x540 on a 1080p screen, so the 1920x1080 design is
// scaled down from its top-left corner to fill the window.
export function fitScreen(window: {
  width: number;
  height: number;
}): [{translateX: number}, {translateY: number}, {scale: number}] {
  const scale = Math.min(
    window.width / SCREEN.width,
    window.height / SCREEN.height,
  );
  return [
    {translateX: (SCREEN.width * (scale - 1)) / 2},
    {translateY: (SCREEN.height * (scale - 1)) / 2},
    {scale},
  ];
}
