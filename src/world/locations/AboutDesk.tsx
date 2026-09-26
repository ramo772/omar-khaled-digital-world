import { identity } from '@/src/content/portfolio';
import { landmarks } from '@/src/data/world-map';
import { ink } from '../materials/canvas';
import { codeCard, plaque } from '../materials/painters';
import { Box, Cylinder, Monitor, Panel } from '../environment/Primitives';

/** Faces the camera (camera sits toward +x/+z). */
export const FACE_CAMERA = 0.56;

const code: [string, string][] = [
  ['const omar = {', ink.text],
  [`  role: '${identity.currentRole}',`, ink.green],
  [`  at: '${identity.shortOrganization} · ${identity.currentProject}',`, ink.green],
  [`  focus: '${identity.focus}',`, ink.green],
  [`  exploring: '${identity.exploring}',`, ink.amber],
  ['};', ink.text],
];

/** 01 · Arrival: Omar's own desk — the "who I am" landmark. */
export default function AboutDesk() {
  const { x, z } = landmarks.about;
  return (
    <group position={[x, 0, z]} rotation={[0, FACE_CAMERA, 0]}>
      <Cylinder position={[0, 0.05, 0]} radius={1.35} height={0.1} m="timber" />
      {/* Desk */}
      <Box position={[0, 0.8, 0]} size={[1.9, 0.08, 0.86]} m="timber" />
      {[-0.86, 0.86].map((dx) => (
        <Box key={dx} position={[dx, 0.42, 0]} size={[0.07, 0.72, 0.76]} m="graphite" />
      ))}
      <Monitor
        id="about-monitor"
        paint={codeCard(code, 'about.ts')}
        position={[-0.2, 1.47, -0.18]}
        width={1.08}
        height={0.68}
      />
      <Box position={[-0.2, 0.86, 0.2]} size={[0.72, 0.035, 0.24]} m="ink" />
      {/* Mug, notebook, desk lamp */}
      <Cylinder position={[0.55, 0.93, 0.18]} radius={0.075} height={0.18} m="signal" />
      <Box position={[0.62, 0.855, -0.14]} size={[0.34, 0.03, 0.26]} m="paper" rotation={[0, 0.3, 0]} />
      <Cylinder position={[0.78, 0.86, -0.28]} radius={0.1} height={0.04} m="graphite" />
      <Box position={[0.78, 1.12, -0.28]} size={[0.03, 0.5, 0.03]} m="graphite" rotation={[0, 0, -0.25]} />
      <Box position={[0.66, 1.36, -0.24]} size={[0.2, 0.1, 0.16]} m="graphite" />
      <Box position={[0.66, 1.3, -0.24]} size={[0.12, 0.04, 0.1]} m="lampBulb" shadow={false} />
      {/* Chair */}
      <group position={[-0.1, 0, 0.78]} rotation={[0, Math.PI + 0.25, 0]}>
        <Cylinder position={[0, 0.25, 0]} radius={0.04} height={0.45} m="graphite" />
        <Box position={[0, 0.5, 0]} size={[0.5, 0.08, 0.48]} m="seafoam" />
        <Box position={[0, 0.8, -0.22]} size={[0.48, 0.52, 0.07]} m="seafoam" />
      </group>
      {/* Hello sign */}
      <group position={[1.25, 0, 0.72]} rotation={[0, -0.2, 0]}>
        <Box position={[0, 0.5, -0.03]} size={[0.05, 1.0, 0.05]} m="graphite" />
        <Panel
          id="about-sign"
          paint={plaque(`Hi, I'm ${identity.name.split(' ')[0]}`, identity.headline.toUpperCase())}
          size={[1.1, 0.46]}
          px={[440, 184]}
          position={[0, 1.08, 0]}
          glow="sign"
        />
      </group>
    </group>
  );
}
