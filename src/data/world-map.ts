/**
 * World layout: where things are, never what they say (that is src/content).
 *
 * The island is read like a page, left to right, along one path:
 *   01 About (arrival) → 02 Career trail → 03 Project Workshop (centerpiece)
 *   → 04 AI Lab → 05 What's next / Contact.   Skills is a short side branch.
 * Camera looks from +x/+z, so +z is "front" (bottom of the screen).
 */
export type DestinationId = 'about' | 'experience' | 'projects' | 'ai' | 'skills' | 'contact';

export interface Destination {
  id: DestinationId;
  /** Narrative index shown in the UI; skills is a side branch. */
  index: string;
  label: string;
  /** Short line for world labels and the dock tooltip. */
  hint: string;
  /** World-space anchor for the floating label. */
  position: [number, number, number];
  /** Where the avatar stands to "arrive" at this place. */
  stop: [number, number];
  color: string;
}

export const destinations: Destination[] = [
  {
    id: 'about',
    index: '01',
    label: 'About',
    hint: 'Who I am',
    position: [-8.1, 2.75, 3.3],
    stop: [-6.1, 4.3],
    color: '#7fa89f',
  },
  {
    id: 'experience',
    index: '02',
    label: 'Experience',
    hint: 'The career trail',
    position: [-7.1, 2.9, -1.4],
    stop: [-5.2, -0.6],
    color: '#e8c46f',
  },
  {
    id: 'projects',
    index: '03',
    label: 'Projects',
    hint: 'The workshop',
    position: [2.6, 5.2, -3.6],
    stop: [1.0, 0.75],
    color: '#df7950',
  },
  {
    id: 'ai',
    index: '04',
    label: 'AI Lab',
    hint: 'Currently exploring',
    position: [7.4, 4.1, -2.5],
    stop: [6.0, 0.9],
    color: '#6fb6ae',
  },
  {
    id: 'contact',
    index: '05',
    label: 'Next & Contact',
    hint: 'What comes next',
    position: [7.9, 3.35, 4.3],
    stop: [5.8, 4.3],
    color: '#c98a5a',
  },
  {
    id: 'skills',
    index: '··',
    label: 'Skills',
    hint: 'The toolbench',
    position: [-2.0, 2.35, 3.3],
    stop: [-0.35, 3.45],
    color: '#95ad88',
  },
];

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
  [3.7, 0.7],
  [6.0, 0.9],
  [6.6, 2.7],
  [5.8, 4.3],
  [4.1, 5.8],
];

/** Short spur from the main path to the skills bench. */
export const skillsSpur: [number, number][] = [
  [-0.9, 0.6],
  [-0.5, 2.1],
  [-0.35, 3.45],
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
  skills: { x: -2.0, z: 3.45 },
  contact: { x: 7.95, z: 4.25 },
};

/** Axis-aligned collision boxes (the avatar's 0.28 radius is added in movement.ts). */
export const obstacles = [
  // About desk + platform
  { x: -8.15, z: 3.35, halfX: 1.05, halfZ: 0.65 },
  // Career trail (three boxes approximating the diagonal band of plinths)
  { x: -7.7, z: 0.9, halfX: 0.7, halfZ: 0.9 },
  { x: -6.55, z: -1.2, halfX: 0.7, halfZ: 1.1 },
  { x: -5.3, z: -3.35, halfX: 0.75, halfZ: 1.15 },
  // Project workshop, extended to the back edge so nobody hides behind it
  { x: 1.0, z: -4.1, halfX: 3.75, halfZ: 3.4 },
  // AI Lab
  { x: 7.45, z: -2.55, halfX: 1.85, halfZ: 1.85 },
  // Skills bench
  { x: -2.0, z: 3.35, halfX: 1.2, halfZ: 0.5 },
  // Contact / next station
  { x: 7.95, z: 4.25, halfX: 1.15, halfZ: 0.95 },
  // Junction box and the thinking bench
  { x: 2.75, z: 3.25, halfX: 0.36, halfZ: 0.26 },
  { x: 1.1, z: 5.2, halfX: 0.62, halfZ: 0.45 },
  // Trees
  { x: -9.2, z: -1.9, halfX: 0.35, halfZ: 0.35 },
  { x: 9.55, z: 1.55, halfX: 0.35, halfZ: 0.35 },
  { x: -2.4, z: 6.1, halfX: 0.35, halfZ: 0.35 },
  { x: 2.9, z: 6.0, halfX: 0.3, halfZ: 0.3 },
];
