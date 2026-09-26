/**
 * Omar's look, shared by the 3D figure (OmarFigure/OmarHead) and the 2D
 * loader portrait (OmarPortrait) so both always show the same person.
 * Plain data, no Three.js. Source of truth: Omar's real photo.
 */
export const omarLook = {
  // Light-medium warm tan. Deliberately held brighter than the orange museum
  // lighting in the photo so Omar does not read too dark in the night scene.
  skin: '#d8a27c',
  skinShade: '#bd805f',
  hair: '#0d0c0c',
  hairHighlight: '#292526',
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
 * toward +z. The face is an ellipsoid (slightly oval, not square). Both the
 * 3D head and the SVG portrait are generated from these numbers.
 */
export const headSpec = {
  center: 0.31,
  rx: 0.26,
  ry: 0.325,
  rz: 0.245,
  eyes: { x: 0.078, y: 0.35, w: 0.03, h: 0.038 },
  /** Small, thin, softly rectangular lenses fitted close around the eyes. */
  lens: {
    x: 0.078,
    y: 0.351,
    w: 0.125,
    h: 0.072,
    radius: 0.012,
    side: 0.008,
    top: 0.012,
  },
  bridge: { y: 0.356, w: 0.032 },
  brows: { x: 0.082, y: 0.416, w: 0.096, h: 0.022, tilt: 0.08 },
  nose: { y: 0.275, w: 0.052, h: 0.072 },
  moustache: { y: 0.211, w: 0.164, h: 0.03 },
  mouth: { y: 0.165, w: 0.11, h: 0.03 },
  /** Beard follows the jaw: bare upper cheeks, beard below this line (fuller at the chin). */
  beardLine: { center: 0.225, side: 0.345 },
  chin: { y: 0.025, rx: 0.115, ry: 0.06, z: 0.15 },
  /** Hairline: low at the back and sides, higher over the forehead. */
  hairline: { front: 0.495, side: 0.405, back: 0.255 },
  ears: { x: 0.258, y: 0.305 },
} as const;

/** z of the face surface at (x, y) on the head ellipsoid (0 outside it). */
export function faceZ(x: number, y: number, grow = 1) {
  const { rx, ry, rz, center } = headSpec;
  const k = 1 - (x / (rx * grow)) ** 2 - ((y - center) / (ry * grow)) ** 2;
  return k > 0 ? rz * grow * Math.sqrt(k) : 0;
}
