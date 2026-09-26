/** Omar's in-world character palette, grounded in his real photo. */
export const omarLook = {
  // The museum reference is very warm, so the game material is deliberately
  // less saturated to stay a natural light-medium tan under every day phase.
  skin: '#c99a78',
  skinShade: '#ad735b',
  hair: '#0d0c0c',
  hairHighlight: '#1b191a',
  beard: '#121010',
  frames: '#0a0a0b',
  eyes: '#1c1411',
  teeth: '#f7f2ea',
  lip: '#9a5646',
  trousers: '#26292f',
  shoe: '#f3f1ec',
  sole: '#d6d2ca',
  watch: '#121212',
  shirt: '#efe9df',
  stripeA: '#2e3340',
  stripeB: '#4a3a44',
} as const;

/**
 * Head geometry in head-local units: origin at the chin line, +y up, face
 * toward +z. The narrower x radius gives Omar a slim oval silhouette.
 */
export const headSpec = {
  center: 0.31,
  rx: 0.218,
  ry: 0.34,
  rz: 0.218,
  eyes: { x: 0.069, y: 0.35, w: 0.03, h: 0.038 },
  /** Medium, softly rectangular lenses fitted close around the eyes. */
  lens: {
    x: 0.071,
    y: 0.351,
    w: 0.132,
    h: 0.083,
    radius: 0.029,
    side: 0.006,
    top: 0.008,
  },
  bridge: { y: 0.356, w: 0.031 },
  brows: { x: 0.071, y: 0.418, w: 0.087, h: 0.017, tilt: 0.07 },
  nose: { y: 0.273, w: 0.048, h: 0.075 },
  moustache: { y: 0.205, w: 0.148, h: 0.025 },
  mouth: { y: 0.163, w: 0.102, h: 0.027 },
  /** High visibility through the cheeks; the beard stays close to the jaw. */
  beardLine: { center: 0.095, side: 0.195 },
  /** Hairline: low at the back and sides, higher over the forehead. */
  hairline: { front: 0.49, side: 0.335, back: 0.25 },
  ears: { x: 0.219, y: 0.305 },
} as const;

/** z of the face surface at (x, y) on the head ellipsoid (0 outside it). */
export function faceZ(x: number, y: number, grow = 1) {
  const { rx, ry, rz, center } = headSpec;
  const k = 1 - (x / (rx * grow)) ** 2 - ((y - center) / (ry * grow)) ** 2;
  return k > 0 ? rz * grow * Math.sqrt(k) : 0;
}
