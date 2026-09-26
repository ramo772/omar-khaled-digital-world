/**
 * Omar's look, shared by the 3D figure (OmarFigure/OmarHead) and the 2D
 * loader portrait (OmarPortrait) so both always show the same person.
 * Plain data, no Three.js. Source of truth: Omar's real photo.
 */
export const omarLook = {
  // Medium warm tan / light-medium brown. Sampled from the photo and
  // white-balanced against the off-white T-shirt (the museum light is very orange).
  skin: '#cf9a73',
  skinShade: '#b9835e',
  hair: '#15100e',
  beard: '#1a1310',
  frames: '#0d0d0d',
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
  rx: 0.28,
  ry: 0.31,
  rz: 0.26,
  eyes: { x: 0.088, y: 0.345, w: 0.034, h: 0.042 },
  /** Smaller, softly rectangular lenses; thin frame with a slightly heavier top rim. */
  lens: { x: 0.09, y: 0.348, w: 0.142, h: 0.098, radius: 0.026, side: 0.016, top: 0.024 },
  bridge: { y: 0.36, w: 0.038 },
  brows: { x: 0.092, y: 0.425, w: 0.108, h: 0.026, tilt: 0.1 },
  nose: { y: 0.272, w: 0.058, h: 0.075 },
  moustache: { y: 0.207, w: 0.18, h: 0.034 },
  mouth: { y: 0.165, w: 0.11, h: 0.03 },
  /** Beard follows the jaw: bare upper cheeks, beard below this line (fuller at the chin). */
  beardLine: { center: 0.228, side: 0.37 },
  chin: { y: 0.03, rx: 0.13, ry: 0.075, z: 0.17 },
  /** Hairline: low at the back and sides, higher over the forehead. */
  hairline: { front: 0.5, side: 0.36, back: 0.2 },
  ears: { x: 0.278, y: 0.305 },
} as const;

/** z of the face surface at (x, y) on the head ellipsoid (0 outside it). */
export function faceZ(x: number, y: number, grow = 1) {
  const { rx, ry, rz, center } = headSpec;
  const k = 1 - (x / (rx * grow)) ** 2 - ((y - center) / (ry * grow)) ** 2;
  return k > 0 ? rz * grow * Math.sqrt(k) : 0;
}
