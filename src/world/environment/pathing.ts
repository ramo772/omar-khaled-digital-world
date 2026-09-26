import { CatmullRomCurve3, Vector3 } from 'three';
import { destinations, obstacles, pathPoints, worldBounds } from '@/src/data/world-map';
import { isWalkable } from '@/src/lib/movement';

export const curveOf = (points: [number, number][]) =>
  new CatmullRomCurve3(points.map(([x, z]) => new Vector3(x, 0, z)));

export const storyCurve = () => curveOf(pathPoints);

/**
 * Lamp posts every ~1.9 units along the story path, alternating sides, never
 * inside a building, on a stop, or in the water.
 */
export function pathLamps(): [number, number][] {
  const curve = storyCurve();
  const length = curve.getLength();
  const out: [number, number][] = [];
  const p = new Vector3();
  const d = new Vector3();
  let side = 1;
  for (let s = 0.9; s < length - 0.5; s += 1.9) {
    const t = curve.getUtoTmapping(s / length, 0);
    curve.getPoint(t, p);
    curve.getTangent(t, d);
    const n = Math.hypot(d.x, d.z) || 1;
    const x = p.x - (d.z / n) * 0.98 * side;
    const z = p.z + (d.x / n) * 0.98 * side;
    side = -side;
    const nearStop = destinations.some((dst) => Math.hypot(x - dst.stop[0], z - dst.stop[1]) < 1.0);
    if (nearStop || !isWalkable({ x, z }, obstacles, worldBounds)) continue;
    out.push([x, z]);
  }
  return out;
}
