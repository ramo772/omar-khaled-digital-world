import { skills } from '@/src/content/portfolio';
import { landmarks } from '@/src/data/world-map';
import { drawers } from '../materials/painters';
import { Box, Cylinder, Panel } from '../environment/Primitives';

/** Toolbench: CV skills as labelled drawers on a pegboard. */
export default function SkillsBench() {
  const { x, z } = landmarks.skills;
  const items = skills
    .filter((g) => !g.label.startsWith('AI'))
    .flatMap((g) => g.items)
    .slice(0, 12);
  return (
    <group position={[x, 0, z]} rotation={[0, 0.35, 0]}>
      <Box position={[0, 0.84, 0]} size={[2.2, 0.08, 0.78]} m="timber" />
      <Box position={[0, 0.42, 0]} size={[2.05, 0.76, 0.66]} m="seafoam" />
      {[-0.68, 0, 0.68].map((dx) => (
        <group key={dx}>
          <Box position={[dx, 0.62, 0.335]} size={[0.6, 0.26, 0.02]} m="cream" />
          <Box position={[dx, 0.62, 0.35]} size={[0.16, 0.035, 0.03]} m="graphite" />
          <Box position={[dx, 0.28, 0.335]} size={[0.6, 0.3, 0.02]} m="cream" />
          <Box position={[dx, 0.28, 0.35]} size={[0.16, 0.035, 0.03]} m="graphite" />
        </group>
      ))}
      {/* Pegboard of skills */}
      <Box position={[0, 1.55, -0.38]} size={[2.2, 1.35, 0.06]} m="graphite" />
      <Panel
        id={`skills-board:${items.join(',')}`}
        paint={drawers('TOOLBENCH · FROM MY CV', items)}
        size={[2.08, 1.24]}
        px={[640, 380]}
        position={[0, 1.55, -0.345]}
        glow="sign"
      />
      {/* Toolbox, wrench, spool */}
      <Box position={[-0.62, 0.99, 0.08]} size={[0.44, 0.22, 0.24]} m="signal" />
      <Box position={[-0.62, 1.12, 0.08]} size={[0.26, 0.04, 0.04]} m="graphite" />
      <Box position={[0.1, 0.9, 0.12]} size={[0.42, 0.03, 0.06]} m="steel" rotation={[0, 0.5, 0]} />
      <Cylinder position={[0.62, 0.95, 0.05]} radius={0.12} height={0.14} m="butter" rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}
