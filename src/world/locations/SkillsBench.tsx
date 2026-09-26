import { featuredSkills } from '@/src/content/portfolio';
import { landmarks } from '@/src/data/world-map';
import { ink } from '../materials/canvas';
import { codeCard, techTile } from '../materials/painters';
import { Box, Cylinder, Monitor, Panel } from '../environment/Primitives';
import { LightPools } from '../environment/Landscape';

const accents = ['#8fd6a0', '#7fc4b8', '#e8e4dc', '#ef8a66', '#b9a4e8', '#f0cf7a'];
const TILE_W = 0.56;
const TILE_H = 0.42;

/** Skills: a physical tech board — six CV technologies as lit tiles — with a small desk. */
export default function SkillsBench() {
  const { x, z } = landmarks.skills;
  const items = featuredSkills.items;
  return (
    <group position={[x, 0, z]} rotation={[0, 0.42, 0]}>
      <Box position={[0, 0.05, 0]} size={[2.6, 0.1, 1.25]} m="stone" />
      {/* Board frame */}
      {[-1.02, 1.02].map((dx) => (
        <Box key={dx} position={[dx, 0.95, -0.35]} size={[0.1, 1.8, 0.12]} m="timber" />
      ))}
      <Box position={[0, 1.02, -0.4]} size={[2.0, 1.24, 0.08]} m="graphite" />
      <Box position={[0, 1.7, -0.35]} size={[2.16, 0.1, 0.16]} m="timber" />
      {items.map((name, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const px = (col - 1) * (TILE_W + 0.08);
        const py = 1.3 - row * (TILE_H + 0.1);
        return (
          <group key={name} position={[px, py, -0.35]}>
            <Box size={[TILE_W + 0.04, TILE_H + 0.04, 0.05]} m="ink" />
            <Panel
              id={`tile:${name}`}
              paint={techTile(name === 'React.js' ? 'React' : name, accents[i % accents.length])}
              size={[TILE_W, TILE_H]}
              px={[256, 192]}
              position={[0, 0, 0.027]}
            />
          </group>
        );
      })}
      {/* Board lamp */}
      <Box position={[0, 1.78, -0.2]} size={[0.9, 0.06, 0.14]} m="graphite" />
      <Box position={[0, 1.74, -0.14]} size={[0.8, 0.03, 0.06]} m="interiorLamp" shadow={false} />
      {/* Desk with laptop and a code screen */}
      <group position={[0.35, 0.1, 0.32]}>
        <Box position={[0, 0.66, 0]} size={[1.25, 0.06, 0.5]} m="timber" />
        {[-0.56, 0.56].map((dx) => (
          <Box key={dx} position={[dx, 0.33, 0]} size={[0.05, 0.64, 0.44]} m="graphite" />
        ))}
        <Box position={[-0.25, 0.7, 0.04]} size={[0.36, 0.02, 0.24]} m="steel" />
        <Box position={[-0.25, 0.82, -0.08]} size={[0.36, 0.23, 0.02]} m="steel" rotation={[-0.25, 0, 0]} />
        <Monitor
          id="skills-code"
          paint={codeCard(
            [
              ['stack = [', ink.text],
              [`  '${items.slice(0, 3).join("', '")}',`, ink.green],
              [`  '${items.slice(3).join("', '")}',`, ink.green],
              [']', ink.text],
            ],
            'stack.ts',
          )}
          position={[0.3, 0.98, -0.1]}
          width={0.52}
          height={0.34}
          px={[300, 200]}
        />
        <Cylinder position={[0.5, 0.74, 0.14]} radius={0.05} height={0.1} m="signal" />
      </group>
      <LightPools items={[{ p: [0, 0.11, 0.25], s: [2.2, 1.6, 1], r: [-Math.PI / 2, 0, 0] }]} />
    </group>
  );
}
