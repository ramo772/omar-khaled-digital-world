import { useMemo } from 'react';
import { Shape } from 'three';
import { island } from '@/src/data/world-map';
import { material } from '../materials/registry';
import { canvasTexture } from '../materials/canvas';
import { deckGrid, plaque } from '../materials/painters';
import { Box, Panel, Rock, Tree } from './Primitives';

function roundedRect(hx: number, hz: number, r: number) {
  const s = new Shape();
  s.moveTo(-hx + r, -hz);
  s.lineTo(hx - r, -hz);
  s.quadraticCurveTo(hx, -hz, hx, -hz + r);
  s.lineTo(hx, hz - r);
  s.quadraticCurveTo(hx, hz, hx - r, hz);
  s.lineTo(-hx + r, hz);
  s.quadraticCurveTo(-hx, hz, -hx, hz - r);
  s.lineTo(-hx, -hz + r);
  s.quadraticCurveTo(-hx, -hz, -hx + r, -hz);
  return s;
}

/** Moss beds: nature as a supporting accent, never the identity. */
const beds: [number, number, number, number][] = [
  [-9.1, -2.4, 1.3, 1.6],
  [9.2, 1.9, 1.1, 1.7],
  [-2.6, 6.0, 1.7, 0.8],
  [3.1, 5.9, 1.4, 0.8],
  [-0.9, -6.3, 2.4, 0.6],
  [9.3, -5.3, 1.0, 1.1],
];

export default function Island({ name }: { name: string }) {
  const { top, base, deck } = useMemo(() => {
    const grid = canvasTexture('deck-grid', 128, 128, deckGrid, 1);
    // Shape UVs are world units, so one grid cell per world unit.
    grid.repeat.set(1, 1);
    return {
      top: roundedRect(island.halfX, island.halfZ, island.corner),
      base: roundedRect(island.halfX - 0.35, island.halfZ - 0.35, 1.7),
      // Same theme tint as the "deck" token, plus the faint engineering grid.
      deck: material('deck', grid),
    };
  }, []);

  return (
    <group>
      {/* Base block */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow castShadow material={material('deckEdge')}>
        <extrudeGeometry
          args={[
            top,
            { depth: 1.25, bevelEnabled: true, bevelSize: 0.16, bevelThickness: 0.08, bevelSegments: 2, steps: 1 },
          ]}
        />
      </mesh>
      {/* Dark plinth under the base, like a model on a workbench */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} material={material('plinth')}>
        <extrudeGeometry args={[base, { depth: 0.4, bevelEnabled: false }]} />
      </mesh>
      {/* Deck surface with grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow material={deck}>
        <shapeGeometry args={[top]} />
      </mesh>
      {/* Copper trace band around the deck edge (glows at night) */}
      <Box position={[0, -0.5, island.halfZ + 0.17]} size={[island.halfX * 2 - 4, 0.05, 0.02]} m="trace" shadow={false} />
      <Box position={[island.halfX + 0.17, -0.5, 0]} size={[0.02, 0.05, island.halfZ * 2 - 4]} m="trace" shadow={false} />
      {/* Nameplate on the front face */}
      <Panel
        id={`world-plaque:${name}`}
        paint={plaque(`${name.toUpperCase()}’S SMALL DIGITAL ENGINEERING WORLD`, undefined, '#df7950')}
        size={[6.4, 0.44]}
        px={[1280, 88]}
        position={[-2.2, -0.62, island.halfZ + 0.18]}
        glow="sign"
      />
      {beds.map(([x, z, w, d], i) => (
        <Box key={i} position={[x, 0.03, z]} size={[w, 0.06, d]} m="moss" shadow={false} />
      ))}
      <Tree position={[-9.2, 0, -1.9]} scale={1.15} />
      <Tree position={[9.55, 0, 1.55]} scale={0.9} />
      <Tree position={[-2.4, 0, 6.1]} scale={0.8} />
      <Tree position={[2.9, 0, 6.0]} scale={0.7} />
      <Tree position={[-0.2, 0, -6.35]} scale={1.05} />
      <Tree position={[9.3, 0, -5.4]} scale={0.95} />
      {(
        [
          [-9.6, 5.2, 0.34],
          [4.6, -6.3, 0.3],
          [9.7, 4.9, 0.26],
          [-6.0, -5.9, 0.36],
          [0.6, 6.4, 0.24],
        ] as const
      ).map(([x, z, s], i) => (
        <Rock key={i} position={[x, s * 0.45, z]} scale={[s * 1.3, s * 0.8, s]} />
      ))}
    </group>
  );
}
