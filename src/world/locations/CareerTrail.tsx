import type { ReactNode } from 'react';
import { education, roles } from '@/src/content/portfolio';
import { trail } from '@/src/data/world-map';
import { tag, yearCard } from '../materials/painters';
import { ink } from '../materials/canvas';
import { Blink, Bob, Spin } from '../environment/Animated';
import { Box, Cone, Cylinder, Led, Monitor, Panel } from '../environment/Primitives';
import { codeCard, chatScreen } from '../materials/painters';
import { FACE_CAMERA } from './AboutDesk';

/**
 * 02 · The career trail. Milestones come from src/content (education + roles,
 * oldest first) and rise step by step: mechanical/field engineering props
 * give way to screens and servers as the path climbs toward today.
 */
interface Milestone {
  id: string;
  year: string;
  short: string;
  era: 'origin' | 'engineering' | 'software';
  current?: boolean;
}

const milestones: Milestone[] = [
  { id: 'education', year: education.date.slice(-4), short: education.short, era: 'origin' },
  ...roles.map((r) => ({ id: r.id, year: r.start.slice(-4), short: r.short, era: r.era, current: r.current })),
];

/** Props per milestone id; unknown ids fall back to a neutral crate. */
function Prop({ id, animate }: { id: string; animate: boolean }): ReactNode {
  switch (id) {
    case 'education': // KJ66 micro-jet engine model (graduation project)
      return (
        <group position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder radius={0.13} height={0.46} m="steel" />
          <Cone position={[0, 0.3, 0]} radius={0.1} height={0.16} m="graphite" />
          <Cylinder position={[0, -0.25, 0]} radius={0.15} height={0.05} m="signal" />
          <Spin animate={animate} speed={6} position={[0, -0.26, 0]}>
            <Box size={[0.26, 0.02, 0.04]} m="butter" />
            <Box size={[0.04, 0.02, 0.26]} m="butter" />
          </Spin>
        </group>
      );
    case 'emc': // A car on a service lift
      return (
        <group>
          <Box position={[0, 0.08, 0]} size={[0.5, 0.05, 0.3]} m="graphite" />
          <Box position={[0, 0.2, 0]} size={[0.46, 0.12, 0.26]} m="signal" />
          <Box position={[-0.03, 0.31, 0]} size={[0.24, 0.1, 0.22]} m="glass" />
          {[-0.15, 0.15].flatMap((x) =>
            [-0.14, 0.14].map((z) => <Cylinder key={`${x}${z}`} position={[x, 0.14, z]} radius={0.055} height={0.04} m="ink" rotation={[Math.PI / 2, 0, 0]} />),
          )}
        </group>
      );
    case 'xerox': // Copier / printer
      return (
        <group>
          <Box position={[0, 0.2, 0]} size={[0.46, 0.36, 0.36]} m="cream" />
          <Box position={[0, 0.4, 0]} size={[0.48, 0.05, 0.38]} m="graphite" />
          <Box position={[0.26, 0.24, 0]} size={[0.12, 0.02, 0.26]} m="paper" />
          <Led position={[-0.12, 0.3, 0.185]} m="ledGreen" />
        </group>
      );
    case 'fullstack': // First screen + a database
      return (
        <group>
          <Monitor id="trail-code" paint={codeCard([['GET /api', ink.green], ['200 OK', ink.amber]], 'api')} position={[-0.08, 0.36, 0]} width={0.4} height={0.26} px={[192, 128]} />
          {[0, 1, 2].map((i) => (
            <Cylinder key={i} position={[0.24, 0.07 + i * 0.1, 0.08]} radius={0.09} height={0.08} m="seafoam" />
          ))}
        </group>
      );
    case 'saba': // Stack of documents and a stamp
      return (
        <group>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} position={[-0.06, 0.03 + i * 0.045, 0]} size={[0.34, 0.04, 0.44]} m="paper" rotation={[0, i * 0.08, 0]} />
          ))}
          <Cylinder position={[0.2, 0.12, 0.12]} radius={0.06} height={0.14} m="signal" />
        </group>
      );
    case 'amit': // Whiteboard: teaching
      return (
        <group>
          <Box position={[0, 0.34, -0.05]} size={[0.56, 0.4, 0.04]} m="graphite" />
          <Box position={[0, 0.34, -0.025]} size={[0.5, 0.34, 0.01]} m="paper" />
          <Box position={[-0.08, 0.4, -0.018]} size={[0.26, 0.025, 0.005]} m="seafoam" />
          <Box position={[-0.04, 0.33, -0.018]} size={[0.32, 0.025, 0.005]} m="signal" />
          <Box position={[0, 0.07, 0.16]} size={[0.3, 0.05, 0.14]} m="timber" />
        </group>
      );
    case 'beyond': // Laptop and a small rack
      return (
        <group>
          <Box position={[-0.1, 0.04, 0.05]} size={[0.34, 0.025, 0.24]} m="steel" />
          <Box position={[-0.1, 0.16, -0.07]} size={[0.34, 0.22, 0.02]} m="steel" rotation={[-0.25, 0, 0]} />
          <Box position={[0.23, 0.26, -0.05]} size={[0.18, 0.5, 0.22]} m="graphite" />
          <Blink animate={animate} period={0.9}>
            <Led position={[0.26, 0.4, 0.065]} m="ledGreen" size={0.04} />
          </Blink>
          <Led position={[0.26, 0.3, 0.065]} m="ledAmber" size={0.04} />
        </group>
      );
    case 'vois': // Today: TOBi — a chat assistant tower with a live beacon
      return (
        <group>
          <Box position={[0, 0.45, 0]} size={[0.3, 0.9, 0.3]} m="graphite" />
          <Monitor id="trail-tobi" paint={chatScreen('TOBi')} position={[0, 0.62, 0.16]} width={0.26} height={0.4} px={[160, 240]} stand={false} />
          <Bob animate={animate} amplitude={0.05} position={[0, 1.12, 0]}>
            <Box size={[0.46, 0.26, 0.08]} m="signal" />
            <Box position={[-0.12, -0.17, 0]} size={[0.1, 0.1, 0.08]} m="signal" rotation={[0, 0, 0.8]} />
          </Bob>
          <Blink animate={animate} period={1.6} duty={0.6}>
            <Box position={[0, 0.94, 0]} size={[0.1, 0.1, 0.1]} m="ledAmber" shadow={false} />
          </Blink>
        </group>
      );
    default:
      return <Box position={[0, 0.18, 0]} size={[0.3, 0.3, 0.3]} m="timber" />;
  }
}

export default function CareerTrail({ animate }: { animate: boolean }) {
  const [x0, z0] = trail.from;
  const [x1, z1] = trail.to;
  const n = milestones.length;
  const len = Math.hypot(x1 - x0, z1 - z0);
  const dir = { x: (x1 - x0) / len, z: (z1 - z0) / len };
  const yaw = Math.atan2(dir.x, dir.z);
  // Away from the camera (the outer, retaining side of the staircase).
  const away = { x: -dir.z, z: dir.x };
  if (away.x * 0.53 + away.z * 0.85 > 0) {
    away.x = -away.x;
    away.z = -away.z;
  }
  const stepLength = len / (n - 1) + 0.02;
  return (
    <group>
      {milestones.map((m, i) => {
        const t = n === 1 ? 0 : i / (n - 1);
        const x = x0 + (x1 - x0) * t;
        const z = z0 + (z1 - z0) * t;
        const h = 0.14 + i * 0.1;
        const software = m.era === 'software';
        const accent = m.current ? '#df7950' : software ? '#7fc4b8' : '#e8c46f';
        const cardY = h + (m.id === 'vois' ? 1.72 : 1.18);
        return (
          <group key={m.id} position={[x, 0, z]}>
            {/* One stair step of the rising trail */}
            <Box position={[0, h / 2, 0]} size={[0.96, h, stepLength]} rotation={[0, yaw, 0]} m={software ? 'seafoam' : m.era === 'origin' ? 'stone' : 'timber'} />
            <Box position={[0, h + 0.012, 0]} size={[1.0, 0.025, stepLength]} rotation={[0, yaw, 0]} m={software ? 'graphite' : 'wallCap'} />
            {/* Stepped retaining wall on the outer side */}
            <Box position={[away.x * 0.53, (h + 0.32) / 2, away.z * 0.53]} size={[0.12, h + 0.32, stepLength]} rotation={[0, yaw, 0]} m="wall" />
            {/* Step light on the open edge (glows at night) */}
            <Box position={[-away.x * 0.47, h + 0.03, -away.z * 0.47]} size={[0.05, 0.03, stepLength * 0.7]} rotation={[0, yaw, 0]} m="trace" shadow={false} />
            <group position={[0, h + 0.025, 0]} rotation={[0, FACE_CAMERA, 0]}>
              <Prop id={m.id} animate={animate} />
            </group>
            {/* Year card on a post, behind the prop */}
            <group position={[away.x * 0.34, 0, away.z * 0.34]} rotation={[0, FACE_CAMERA, 0]}>
              <Box position={[0, cardY / 2, -0.03]} size={[0.04, cardY, 0.04]} m="graphite" />
              <Panel
                id={`trail-card:${m.id}`}
                paint={yearCard(m.year, m.short, accent, (i + 1) / n, m.current)}
                size={[0.74, 0.44]}
                px={[296, 176]}
                position={[0, cardY, 0]}
              />
            </group>
          </group>
        );
      })}
      <Panel
        id="trail-sign"
        paint={tag('CAREER TRAIL →', ink.butter)}
        size={[1.5, 0.3]}
        px={[400, 80]}
        position={[x0 - 0.2, 0.55, z0 + 1.05]}
        rotation={[0, FACE_CAMERA, 0]}
      />
    </group>
  );
}
