import {fitPitch, toScreen} from '../src/pitch';
import {RADAR_AREA} from '../src/theme';

describe.each([
  [105, 68],
  [40, 25],
])('a %ix%i pitch in the radar area', (L, W) => {
  const box = fitPitch(L, W, RADAR_AREA);
  const corners = [
    {p: {x: -L / 2, y: -W / 2}, left: box.left, top: box.top},
    {p: {x: L / 2, y: -W / 2}, left: box.left + box.width, top: box.top},
    {p: {x: -L / 2, y: W / 2}, left: box.left, top: box.top + box.height},
    {
      p: {x: L / 2, y: W / 2},
      left: box.left + box.width,
      top: box.top + box.height,
    },
  ];

  it('maps the corners to the box corners and the centre spot to its centre', () => {
    for (const c of corners) {
      const s = toScreen(c.p, L, W, box);
      expect(s.left).toBeCloseTo(c.left, 9);
      expect(s.top).toBeCloseTo(c.top, 9);
    }
    const centre = toScreen({x: 0, y: 0}, L, W, box);
    expect(centre.left).toBeCloseTo(box.left + box.width / 2, 9);
    expect(centre.top).toBeCloseTo(box.top + box.height / 2, 9);
  });

  it('keeps the pitch aspect ratio', () => {
    expect(Math.abs(box.width / box.height - L / W)).toBeLessThan(1e-9);
  });

  it('keeps every corner inside the safe area', () => {
    for (const c of corners) {
      const s = toScreen(c.p, L, W, box);
      expect(s.left).toBeGreaterThanOrEqual(96);
      expect(s.left).toBeLessThanOrEqual(1824);
      expect(s.top).toBeGreaterThanOrEqual(54);
      expect(s.top).toBeLessThanOrEqual(1026);
    }
  });
});
