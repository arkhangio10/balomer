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
