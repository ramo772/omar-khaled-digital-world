// Relative + extension so the layout tests can load this file directly in Node.
import { features } from '../config/features.ts';

/**
 * World layout: where things are, never what they say (that is src/content).
 *
 * The island reads like a page along one path:
 *   About (arrival) → Experience trail → Project Workshop (centerpiece)
 *   → [AI Lab, when enabled] → Skills → Next & Contact.
 * With the AI Lab hidden, its corner becomes a raised terrace whose waterfall
 * feeds a stream; the path crosses it on a bridge before the last stop.
 * Camera looks from +x/+z, so +z is "front" (bottom of the screen).
 */
export type DestinationId = 'about' | 'experience' | 'projects' | 'ai' | 'skills' | 'contact';

export interface Destination {
  id: DestinationId;
  /** Narrative index shown in the UI (computed from story order). */
  index: string;
  label: string;
  /** Short label for tight spaces (mobile dock). */
  short: string;
  hint: string;
  /** World-space anchor for the floating label. */
  position: [number, number, number];
  /** Where the avatar stands to "arrive" at this place. */
  stop: [number, number];
  color: string;
}

const ai = features.aiLab;

const story: Omit<Destination, 'index'>[] = [
  { id: 'about', label: 'About', short: 'About', hint: 'Who I am', position: [-8.6, 2.75, 3.0], stop: [-6.1, 4.3], color: '#7fa89f' },
  {
    id: 'experience',
    label: 'Experience',
    short: 'Career',
    hint: 'The career trail',
    position: [-7.6, 3.25, -1.9],
    stop: [-5.2, -0.6],
    color: '#e8c46f',
  },
  {
    id: 'projects',
    label: 'Projects',
    short: 'Projects',
    hint: 'The workshop',
    position: [3.3, 5.35, -3.9],
    stop: [1.0, 0.75],
    color: '#df7950',
  },
  { id: 'ai', label: 'AI Lab', short: 'AI Lab', hint: 'Experiments', position: [7.4, 4.1, -2.5], stop: [6.0, 0.9], color: '#6fb6ae' },
  {
    id: 'skills',
    label: 'Skills',
    short: 'Skills',
    hint: 'The tech board',
    position: [-1.5, 2.9, 3.4],
    stop: [0.9, 3.55],
    color: '#95ad88',
  },
  {
    id: 'contact',
    label: 'Next & Contact',
    short: 'Contact',
    hint: 'What’s next',
    position: [8.5, 3.0, 3.7],
    stop: [5.8, 4.4],
    color: '#c98a5a',
  },
];

export const destinations: Destination[] = story
  .filter((d) => d.id !== 'ai' || ai)
  .map((d, i) => ({ ...d, index: String(i + 1).padStart(2, '0') }));

export const destinationById = Object.fromEntries(destinations.map((d) => [d.id, d])) as Record<
  DestinationId,
  Destination
>;

export const spawn: [number, number] = [-5.2, 5.3];

export const island = { halfX: 10.5, halfZ: 7, corner: 2 };
export const worldBounds = { x: 10.1, z: 6.6 };

/** Main route through the story, in order. */
export const pathPoints: [number, number][] = [
  [-4.3, 6.1],
  [-6.1, 4.3],
  [-6.9, 2.3],
  [-6.4, 0.4],
  [-5.2, -0.6],
  [-4.1, -2.3],
  [-3.55, -3.7],
  [-3.25, -1.6],
  [-2.3, 0.35],
  [1.0, 0.75],
  ...(ai
    ? ([
        [3.7, 0.7],
        [6.0, 0.9],
        [4.2, 2.2],
      ] as [number, number][])
    : ([[1.3, 2.2]] as [number, number][])),
  [0.9, 3.55],
  [2.5, 4.0],
  [3.95, 4.1],
  [5.8, 4.4],
  [6.5, 5.9],
];

/** Stream (AI Lab hidden): terrace waterfall → pond near the front edge. */
export const stream = ai
  ? null
  : {
      points: [
        [7.1, -0.35],
        [6.3, 0.9],
        [5.0, 2.2],
        [4.15, 3.4],
        [3.8, 4.8],
        [3.5, 5.9],
      ] as [number, number][],
      width: 0.95,
      bridge: { x: 3.95, z: 4.1, length: 1.9, width: 1.0, angle: 0.08 },
      pond: { x: 3.4, z: 6.05, radius: 0.85 },
    };

/** Raised terraces add height at the back of the island. */
export const terraces: { x: number; z: number; w: number; d: number; h: number }[] = [
  { x: -6.4, z: -5.9, w: 5.8, d: 1.5, h: 0.9 },
  { x: 1.0, z: -6.3, w: 7.6, d: 0.9, h: 0.45 },
  ...(ai ? [] : [{ x: 7.7, z: -3.55, w: 4.8, d: 5.3, h: 0.6 }]),
];

/** Height of the ground at (x, z): terraces are raised blocks. */
export function groundHeight(x: number, z: number) {
  for (const t of terraces) if (Math.abs(x - t.x) < t.w / 2 && Math.abs(z - t.z) < t.d / 2) return t.h;
  return 0;
}

/** Trees: [x, z, scale]. Supporting greenery — kept to the edges and terraces. */
export const trees: [number, number, number][] = [
  [-8.9, -5.75, 1.1],
  [-7.0, -6.25, 0.95],
  [-4.4, -6.15, 1.0],
  [-9.4, -1.9, 1.1],
  [-9.6, 1.0, 0.8],
  [-1.9, -6.4, 0.9],
  [3.6, -6.35, 0.95],
  ...(ai
    ? ([[9.3, -5.4, 0.95]] as [number, number, number][])
    : ([
        [6.0, -5.6, 1.0],
        [9.5, -4.4, 0.9],
        [9.55, -1.55, 0.8],
      ] as [number, number, number][])),
  [-2.6, 6.1, 0.8],
  [9.55, 1.55, 0.9],
  [9.7, 5.55, 0.7],
  [5.55, 6.3, 0.7],
];

/** Career trail milestones sit beside the path, rising as the career progresses. */
export const trail = {
  from: [-8.2, 1.55] as [number, number],
  to: [-4.75, -4.35] as [number, number],
};

export const landmarks = {
  about: { x: -8.15, z: 3.45 },
  workshop: { x: 1.0, z: -2.95, halfX: 3.75, halfZ: 2.2 },
  ai: { x: 7.45, z: -2.5, radius: 2.05 },
  skills: { x: -0.95, z: 3.75 },
  contact: { x: 7.95, z: 4.25 },
};

type Box = { x: number; z: number; halfX: number; halfZ: number };

/** Collision boxes along the stream, leaving a gap at the bridge. */
function streamObstacles(): Box[] {
  if (!stream) return [];
  const out: Box[] = [];
  const { points, bridge } = stream;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, z0] = points[i];
    const [x1, z1] = points[i + 1];
    const steps = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.35);
    for (let s = 0; s < steps; s++) {
      const x = x0 + ((x1 - x0) * s) / steps;
      const z = z0 + ((z1 - z0) * s) / steps;
      // Leave a walkable gap exactly as wide as the bridge deck.
      const dx = x - bridge.x;
      const dz = z - bridge.z;
      const along = dx * Math.cos(bridge.angle) - dz * Math.sin(bridge.angle);
      const across = dx * Math.sin(bridge.angle) + dz * Math.cos(bridge.angle);
      if (Math.abs(along) < bridge.length / 2 && Math.abs(across) < bridge.width / 2 - 0.05) continue;
      out.push({ x, z, halfX: 0.3, halfZ: 0.3 });
    }
  }
  out.push({ x: stream.pond.x, z: stream.pond.z, halfX: 0.75, halfZ: 0.65 });
  return out;
}

/** Axis-aligned collision boxes (the avatar's 0.28 radius is added in movement.ts). */
export const obstacles: Box[] = [
  // About desk + platform
  { x: -8.15, z: 3.35, halfX: 1.05, halfZ: 0.65 },
  // Career trail (boxes approximating the diagonal staircase)
  { x: -7.7, z: 0.9, halfX: 0.7, halfZ: 0.9 },
  { x: -6.55, z: -1.2, halfX: 0.7, halfZ: 1.1 },
  { x: -5.3, z: -3.35, halfX: 0.75, halfZ: 1.15 },
  // Back terraces
  { x: -6.4, z: -5.95, halfX: 2.9, halfZ: 0.85 },
  // Project workshop, extended to the back edge so nobody hides behind it
  { x: 1.0, z: -4.1, halfX: 3.75, halfZ: 3.4 },
  ...(ai ? [{ x: 7.45, z: -2.55, halfX: 1.85, halfZ: 1.85 }] : [{ x: 7.7, z: -3.55, halfX: 2.4, halfZ: 2.65 }]),
  // Skills station
  { x: -0.95, z: 3.7, halfX: 1.25, halfZ: 0.55 },
  // Next & contact station
  { x: 7.95, z: 4.25, halfX: 1.15, halfZ: 0.95 },
  // Bench by the water, junction box
  { x: 2.1, z: 5.75, halfX: 0.6, halfZ: 0.4 },
  { x: 4.45, z: 0.1, halfX: 0.36, halfZ: 0.26 },
  // Trees on open ground (terrace trees are already inside a terrace box)
  ...trees.filter(([x, z]) => groundHeight(x, z) === 0).map(([x, z]) => ({ x, z, halfX: 0.32, halfZ: 0.32 })),
  ...streamObstacles(),
];
