import { faceZ, headSpec as H } from './avatar-look';

/**
 * Pure geometry of Omar's hair and beard (no Three.js), shared by the 3D head
 * and the 2D loader portrait so both have the same curls and beard line.
 */
export type Blob = { p: [number, number, number]; s: [number, number, number]; r?: [number, number, number] };

function rand(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

/** Direction around the head: 0 = front, ±π/2 = sides, π = back. */
const around = (x: number, z: number) => Math.abs(Math.atan2(x, z));
const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));

/** Hairline height at a given direction around the head. */
export function hairlineAt(x: number, z: number) {
  const a = around(x, z);
  const { front, side, back } = H.hairline;
  return a < 1.35 ? lerp(front, side, (a - 0.35) / 1.0) : lerp(side, back, (a - 1.35) / 1.2);
}

/**
 * Beard edge: low under the nose, staying low across the cheeks (the upper
 * cheeks are bare skin in the photo), then rising steeply into the sideburns.
 */
export function beardlineAt(x: number, z: number) {
  const a = around(x, z);
  const { center, side } = H.beardLine;
  const t = Math.min(1, Math.max(0, (a - 0.2) / 1.15));
  return lerp(center, side, t ** 4);
}

/** Curls scattered over the hair region: dense and uneven, compact around the head. */
export function hairCurls(): Blob[] {
  const r = rand(11);
  const out: Blob[] = [];
  const n = 150;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.cos(phi);
    const dz = Math.sin(phi) * Math.sin(theta);
    // Compact: curls sit close to the head, with only a little extra on top.
    const x = dx * H.rx * 1.04;
    const y = H.center + dy * H.ry * 1.06;
    const z = dz * H.rz * 1.04;
    if (y < hairlineAt(x, z) - 0.015) continue;
    const s = 0.032 + r() * 0.022;
    const lift = 0.002 + r() * 0.012 + (dy > 0.6 ? 0.006 : 0);
    out.push({ p: [x + dx * lift, y + dy * lift, z + dz * lift], s: [s, s * (0.8 + r() * 0.3), s], r: [r() * 3, r() * 3, 0] });
  }
  // Loose curls breaking the hairline over the forehead.
  for (let i = 0; i < 8; i++) {
    const x = -0.19 + i * 0.054 + (r() - 0.5) * 0.015;
    const y = H.hairline.front - 0.01 + (r() - 0.5) * 0.03;
    const s = 0.032 + r() * 0.012;
    out.push({ p: [x, y, faceZ(x, y, 1.05) + 0.005], s: [s, s, s] });
  }
  return out;
}

/** A few curls along the jaw and chin so the beard reads as hair, not a mask. */
export function beardCurls(): Blob[] {
  const r = rand(29);
  const out: Blob[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = -1.25 + (2.5 * i) / 16;
    const x = Math.sin(a) * H.rx * 0.98;
    const z = Math.cos(a) * H.rz * 0.98 + 0.012;
    const y = 0.03 + Math.abs(Math.sin(a)) * 0.12 + (r() - 0.5) * 0.015;
    const s = 0.024 + r() * 0.014;
    out.push({ p: [x, y, z], s: [s, s, s] });
  }
  return out;
}
