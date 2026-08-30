export type Point = { x: number; z: number };
export type Obstacle = { x: number; z: number; halfX: number; halfZ: number };
export type Bounds = { x: number; z: number };
export const RADIUS = 0.28;
export function normalize(x: number, z: number): Point {
  const length = Math.hypot(x, z);
  return length > 1 ? { x: x / length, z: z / length } : { x, z };
}
export function isWalkable(
  p: Point,
  obstacles: Obstacle[],
  bounds: Bounds,
): boolean {
  if (Math.abs(p.x) > bounds.x - RADIUS || Math.abs(p.z) > bounds.z - RADIUS)
    return false;
  // Rounded island corners: constrain the avatar inside the chamfer as well.
  const cx = Math.max(Math.abs(p.x) - (bounds.x - 1.8), 0),
    cz = Math.max(Math.abs(p.z) - (bounds.z - 1.8), 0);
  if (Math.hypot(cx, cz) > 1.8 - RADIUS) return false;
  return !obstacles.some(
    (o) =>
      Math.abs(p.x - o.x) < o.halfX + RADIUS &&
      Math.abs(p.z - o.z) < o.halfZ + RADIUS,
  );
}
export function move(
  position: Point,
  delta: Point,
  obstacles: Obstacle[],
  bounds: Bounds,
): Point {
  const p = { ...position };
  const steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.z) / 0.12));
  for (let i = 0; i < steps; i++) {
    const x = p.x + delta.x / steps,
      z = p.z + delta.z / steps;
    if (isWalkable({ x, z: p.z }, obstacles, bounds)) p.x = x;
    if (isWalkable({ x: p.x, z }, obstacles, bounds)) p.z = z;
  }
  return p;
}
export function route(
  start: Point,
  goal: Point,
  obstacles: Obstacle[],
  bounds: Bounds,
): Point[] {
  if (!isWalkable(goal, obstacles, bounds)) return [];
  const step = 0.45,
    cols = Math.ceil((bounds.x * 2) / step),
    rows = Math.ceil((bounds.z * 2) / step);
  const point = (i: number): Point => ({
    x: (i % cols) * step - bounds.x,
    z: Math.floor(i / cols) * step - bounds.z,
  });
  const index = (p: Point) =>
    Math.min(rows - 1, Math.max(0, Math.round((p.z + bounds.z) / step))) *
      cols +
    Math.min(cols - 1, Math.max(0, Math.round((p.x + bounds.x) / step)));
  const nearest = (p: Point) => {
    let best = -1,
      distance = Infinity;
    for (let i = 0; i < cols * rows; i++) {
      const v = point(i),
        d = Math.hypot(v.x - p.x, v.z - p.z);
      if (d < distance && isWalkable(v, obstacles, bounds)) {
        distance = d;
        best = i;
      }
    }
    return best;
  };
  const first = isWalkable(point(index(start)), obstacles, bounds)
      ? index(start)
      : nearest(start),
    last = nearest(goal);
  if (first < 0 || last < 0) return [];
  const queue = [first],
    parents = new Map<number, number>([[first, -1]]);
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (current === last) break;
    const x = current % cols,
      z = Math.floor(current / cols);
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx,
        nz = z + dz,
        next = nz * cols + nx;
      if (
        nx < 0 ||
        nz < 0 ||
        nx >= cols ||
        nz >= rows ||
        parents.has(next) ||
        !isWalkable(point(next), obstacles, bounds)
      )
        continue;
      parents.set(next, current);
      queue.push(next);
    }
  }
  if (!parents.has(last)) return [];
  const result: Point[] = [goal];
  let cursor = last;
  while (cursor !== first && cursor !== -1) {
    result.unshift(point(cursor));
    cursor = parents.get(cursor) ?? -1;
  }
  return result;
}
