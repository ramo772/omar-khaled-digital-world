import { headSpec as H } from './avatar-look';

export type HairStrand = {
  points: [number, number, number][];
  radius: number;
};

function rand(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

/** Direction around the head: 0 = front, +/-pi/2 = sides, pi = back. */
const around = (x: number, z: number) => Math.abs(Math.atan2(x, z));
const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * Math.min(1, Math.max(0, t));

export function hairlineAt(x: number, z: number) {
  const a = around(x, z);
  const { front, side, back } = H.hairline;
  return a < 1.35
    ? lerp(front, side, (a - 0.35) / 1.0)
    : lerp(side, back, (a - 1.35) / 1.2);
}

export function beardlineAt(x: number, z: number) {
  const a = around(x, z);
  const { center, side } = H.beardLine;
  const t = Math.min(1, Math.max(0, (a - 0.16) / 1.23));
  return lerp(center, side, t ** 3.2);
}

/**
 * Loose, irregular curved locks that sit over a compact hair shell. The locks
 * are open tube paths, rather than repeated spheres, so the silhouette reads
 * as naturally curly hair instead of beads or an afro ball.
 */
export function hairStrands(): HairStrand[] {
  const random = rand(47);
  const out: HairStrand[] = [];
  const rows = [
    { elevation: 0.1, count: 15 },
    { elevation: 0.32, count: 14 },
    { elevation: 0.53, count: 12 },
    { elevation: 0.72, count: 10 },
    { elevation: 0.86, count: 6 },
  ];

  for (const [rowIndex, row] of rows.entries()) {
    for (let i = 0; i < row.count; i++) {
      const theta =
        -Math.PI +
        ((i + 0.5 + (random() - 0.5) * 0.42) / row.count) * Math.PI * 2;
      const elevation = row.elevation + (random() - 0.5) * 0.09;
      const ring = Math.sqrt(Math.max(0, 1 - elevation * elevation));
      const nx = Math.sin(theta) * ring;
      const ny = elevation;
      const nz = Math.cos(theta) * ring;
      const cx = nx * H.rx * 1.018;
      const cy = H.center + ny * H.ry * 1.025;
      const cz = nz * H.rz * 1.022;
      if (cy < hairlineAt(cx, cz) - 0.012) continue;

      const tx = Math.cos(theta);
      const tz = -Math.sin(theta);
      const bx = -Math.sin(theta) * elevation;
      const by = ring;
      const bz = -Math.cos(theta) * elevation;
      const length = 0.046 + random() * 0.042;
      const curl = 0.005 + random() * 0.006;
      const phase = (random() - 0.5) * 0.75;
      const points: HairStrand['points'] = [];

      for (let k = 0; k < 6; k++) {
        const t = k / 5 - 0.5;
        const wave = Math.sin((t + 0.5) * Math.PI + phase) * curl;
        const lift = 0.005 + Math.cos(t * Math.PI) * 0.004 + random() * 0.0015;
        points.push([
          cx + tx * t * length + bx * wave + nx * lift,
          cy +
            by * wave +
            ny * lift +
            (k - 2.5) * 0.0015 * (rowIndex % 2 ? 1 : -1),
          cz + tz * t * length + bz * wave + nz * lift,
        ]);
      }
      out.push({ points, radius: 0.005 + random() * 0.0025 });
    }
  }

  // A few longer, asymmetrical forehead curls reproduce Omar's loose fringe.
  const fringe = [
    [-0.125, 0.522, 0.03],
    [-0.058, 0.51, 0.038],
    [0.018, 0.516, 0.034],
    [0.086, 0.526, 0.028],
  ] as const;
  for (const [x, y, lean] of fringe) {
    const z =
      Math.sqrt(
        Math.max(
          0,
          1 - (x / (H.rx * 1.03)) ** 2 - ((y - H.center) / (H.ry * 1.03)) ** 2,
        ),
      ) *
      H.rz *
      1.03;
    out.push({
      radius: 0.0065 + random() * 0.002,
      points: [
        [x - lean * 0.45, y + 0.044, z + 0.012],
        [x - lean * 0.08, y + 0.05, z + 0.022],
        [x + lean * 0.32, y + 0.033, z + 0.029],
        [x + lean * 0.38, y + 0.012, z + 0.031],
        [x + lean * 0.05, y - 0.004, z + 0.027],
      ],
    });
  }
  return out;
}
