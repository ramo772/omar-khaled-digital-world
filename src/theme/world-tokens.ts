/**
 * World theme tokens. Every 3D surface references a semantic key; each key has
 * a daylight and a night value. Dark mode re-tints the SAME shared materials
 * (no second scene, no second asset set).
 *
 * glow: [day, night] emissive intensity. Lamps are off by day and on at night;
 * screens and status lights are always on but read brighter after sunset.
 */
export interface MaterialToken {
  day: string;
  night: string;
  emissive?: string;
  glow?: [number, number];
  roughness?: number;
  metalness?: number;
}

export const palette = {
  // Terrain and base
  deck: { day: '#ded6c3', night: '#434b5c', roughness: 1 },
  deckEdge: { day: '#cbbfa5', night: '#323846', roughness: 1 },
  plinth: { day: '#b9ad93', night: '#232833', roughness: 1 },
  moss: { day: '#aebb92', night: '#3c4a44', roughness: 1 },
  path: { day: '#c3b391', night: '#4f4c50', roughness: 1 },
  trace: { day: '#c98a5a', night: '#f0a25c', emissive: '#f0a25c', glow: [0, 1.4] },
  stone: { day: '#e6dfcc', night: '#6b6e78', roughness: 0.95 },
  wall: { day: '#cdbd9b', night: '#4b4b55', roughness: 1 },
  wallCap: { day: '#e4d8bc', night: '#5d5e6a', roughness: 1 },
  grass: { day: '#b7c296', night: '#44544a', roughness: 1 },
  water: { day: '#86c4c4', night: '#1d5663', emissive: '#4fc0c7', glow: [0.06, 0.45], roughness: 0.18, metalness: 0.1 },

  // Architecture
  cream: { day: '#f0e9d8', night: '#aaa392', roughness: 0.85 },
  timber: { day: '#c9a57a', night: '#806449', roughness: 0.9 },
  graphite: { day: '#3d4f50', night: '#1e2731', roughness: 0.6, metalness: 0.2 },
  steel: { day: '#8ea19c', night: '#5b6a70', roughness: 0.5, metalness: 0.3 },
  seafoam: { day: '#7fa89f', night: '#4c7a74', roughness: 0.7 },
  signal: { day: '#df7950', night: '#d97a4c', roughness: 0.7 },
  butter: { day: '#e8c46f', night: '#caa055', roughness: 0.8 },
  glass: { day: '#b9d3cd', night: '#35505a', roughness: 0.2, metalness: 0.1 },
  paper: { day: '#faf6ec', night: '#c9c2b2', roughness: 1 },
  ink: { day: '#2a3437', night: '#10151b', roughness: 0.8 },

  // Nature (supporting only)
  leafA: { day: '#7f9b7b', night: '#46604f', roughness: 1 },
  leafB: { day: '#95ad88', night: '#526b57', roughness: 1 },
  leafC: { day: '#6d8a73', night: '#3d5446', roughness: 1 },
  bark: { day: '#86775e', night: '#4b4136', roughness: 1 },
  pot: { day: '#c2ab8b', night: '#6d5f4e', roughness: 1 },

  // Light sources
  lampBulb: { day: '#f4ead2', night: '#ffd49a', emissive: '#ffc77d', glow: [0, 3.2] },
  /** Workshop and desk lamps: softly on by day, warm and bright at night. */
  interiorLamp: { day: '#ffe9bf', night: '#ffd49a', emissive: '#ffc77d', glow: [0.9, 3.4] },
  ledGreen: { day: '#6fbf7c', night: '#5ee07a', emissive: '#5ee07a', glow: [0.35, 2.4] },
  ledAmber: { day: '#e9b04a', night: '#ffc15a', emissive: '#ffb84a', glow: [0.35, 2.4] },
  ledRed: { day: '#dc6a52', night: '#ff6e52', emissive: '#ff6a4d', glow: [0.3, 2.2] },
  ledCyan: { day: '#6fb6ae', night: '#7fe0d4', emissive: '#7fe0d4', glow: [0.3, 2] },
  pipe: { day: '#d9c9a6', night: '#b3864f', emissive: '#f0a25c', glow: [0, 0.55] },
  pulse: { day: '#e9884f', night: '#ffc27a', emissive: '#ffb06a', glow: [0.6, 3] },
  aiCore: { day: '#e4bd7e', night: '#f3c98a', emissive: '#f7c47c', glow: [0.15, 1.6] },
  wire: { day: '#5e8a84', night: '#7fcfc3', emissive: '#7fcfc3', glow: [0, 0.9] },

  // Robot helper (AI Lab only)
  robot: { day: '#ece6d8', night: '#b9b3a6', roughness: 0.6 },
} satisfies Record<string, MaterialToken>;

export type PaletteKey = keyof typeof palette;

export interface SceneLighting {
  hemiSky: string;
  hemiGround: string;
  hemi: number;
  ambient: number;
  ambientColor: string;
  sun: number;
  sunColor: string;
  sunPosition: [number, number, number];
  /** Warm practical lights at the landmarks; off by day. */
  practical: number;
  /** Screen emissive (screens use their own texture as emissive map). */
  screen: number;
  shadowOpacity: number;
}

export const lighting: Record<'day' | 'night', SceneLighting> = {
  day: {
    hemiSky: '#fff4de',
    hemiGround: '#9aa59a',
    hemi: 0.95,
    ambient: 0.35,
    ambientColor: '#ffffff',
    sun: 2.3,
    sunColor: '#fff1d8',
    sunPosition: [-8, 16, 8],
    practical: 0,
    screen: 0.55,
    shadowOpacity: 0.12,
  },
  night: {
    hemiSky: '#56699a',
    hemiGround: '#232633',
    hemi: 0.95,
    ambient: 0.38,
    ambientColor: '#8d9cc8',
    sun: 0.85,
    sunColor: '#aebfe6',
    sunPosition: [9, 15, -6],
    practical: 1,
    screen: 1.25,
    shadowOpacity: 0.26,
  },
};
