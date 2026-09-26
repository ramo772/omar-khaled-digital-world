import { identity } from '@/src/content/portfolio';
import { landmarks } from '@/src/data/world-map';
import { plaque, profileCard } from '../materials/painters';
import { Box, Cylinder, Monitor, Panel, Rock } from '../environment/Primitives';
import { LightPools } from '../environment/Landscape';

/** Faces the camera (camera sits toward +x/+z). */
export const FACE_CAMERA = 0.56;

const books: [number, number, 'signal' | 'seafoam' | 'butter' | 'graphite'][] = [
  [0.07, 0.2, 'signal'],
  [0.06, 0.24, 'seafoam'],
  [0.08, 0.18, 'butter'],
  [0.06, 0.22, 'graphite'],
];

/** 01 · Arrival: Omar's own desk — the personal starting point. */
export default function AboutDesk() {
  const { x, z } = landmarks.about;
  return (
    <group position={[x, 0, z]} rotation={[0, FACE_CAMERA, 0]}>
      <Cylinder position={[0, 0.05, 0]} radius={1.35} height={0.1} m="timber" />
      <Cylinder position={[0, 0.105, 0]} radius={1.2} height={0.012} m="stone" shadow={false} />
      {/* Desk */}
      <Box position={[0, 0.8, 0]} size={[1.9, 0.08, 0.86]} m="timber" />
      {[-0.86, 0.86].map((dx) => (
        <Box key={dx} position={[dx, 0.42, 0]} size={[0.07, 0.72, 0.76]} m="graphite" />
      ))}
      <Monitor
        id="about-profile"
        paint={profileCard(identity.name, identity.currentRole, identity.status)}
        position={[-0.2, 1.47, -0.18]}
        width={1.12}
        height={0.66}
        px={[420, 248]}
      />
      <Box position={[-0.2, 0.86, 0.2]} size={[0.72, 0.035, 0.24]} m="ink" />
      {/* Books, mug, notebook, desk lamp, plant */}
      <group position={[-0.78, 0.84, -0.22]}>
        {books.map(([w, h, m], i) => (
          <Box key={i} position={[i * 0.085, h / 2, 0]} size={[w, h, 0.2]} m={m} />
        ))}
      </group>
      <Cylinder position={[0.55, 0.93, 0.18]} radius={0.075} height={0.18} m="signal" />
      <Box position={[0.62, 0.855, -0.14]} size={[0.34, 0.03, 0.26]} m="paper" rotation={[0, 0.3, 0]} />
      <Cylinder position={[0.78, 0.86, -0.28]} radius={0.1} height={0.04} m="graphite" />
      <Box position={[0.78, 1.12, -0.28]} size={[0.03, 0.5, 0.03]} m="graphite" rotation={[0, 0, -0.25]} />
      <Box position={[0.66, 1.36, -0.24]} size={[0.2, 0.1, 0.16]} m="graphite" />
      <Box position={[0.66, 1.3, -0.24]} size={[0.12, 0.04, 0.1]} m="interiorLamp" shadow={false} />
      <group position={[0.95, 0.1, 0.62]}>
        <Cylinder position={[0, 0.18, 0]} radius={0.16} height={0.36} m="pot" />
        <Rock position={[0, 0.5, 0]} scale={[0.26, 0.3, 0.24]} m="leafA" />
        <Rock position={[0.08, 0.66, 0.02]} scale={[0.16, 0.2, 0.16]} m="leafB" />
      </group>
      {/* Chair */}
      <group position={[-0.1, 0, 0.78]} rotation={[0, Math.PI + 0.25, 0]}>
        <Cylinder position={[0, 0.25, 0]} radius={0.04} height={0.45} m="graphite" />
        <Box position={[0, 0.5, 0]} size={[0.5, 0.08, 0.48]} m="seafoam" />
        <Box position={[0, 0.8, -0.22]} size={[0.48, 0.52, 0.07]} m="seafoam" />
      </group>
      {/* Hello sign */}
      <group position={[1.3, 0, 0.58]} rotation={[0, -0.2, 0]}>
        <Box position={[0, 0.5, -0.03]} size={[0.05, 1.0, 0.05]} m="graphite" />
        <Panel
          id="about-sign"
          paint={plaque(`Hi, I'm ${identity.name.split(' ')[0]}`, identity.currentRole.toUpperCase())}
          size={[1.1, 0.46]}
          px={[440, 184]}
          position={[0, 1.08, 0]}
          glow="sign"
        />
      </group>
      <LightPools interior items={[{ p: [0.4, 0.12, -0.05], s: [2.0, 2.0, 1], r: [-Math.PI / 2, 0, 0] }]} />
    </group>
  );
}
