import { useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import type { PaletteKey } from '@/src/theme/world-tokens';
import {
  material,
  texturedMaterial,
  unitBox,
  unitCone,
  unitCylinder,
  unitPlane,
  unitRock,
  unitSphere,
  type Glow,
} from '../materials/registry';
import { canvasTexture, type Painter } from '../materials/canvas';

export type V3 = [number, number, number];
type MeshProps = Omit<ThreeElements['mesh'], 'position' | 'scale' | 'material' | 'geometry'>;

/** Large pieces cast shadows; small props only receive them (cheaper shadow pass). */
const casts = (dims: number[]) => Math.max(...dims) > 0.34;

export function Box({
  position = [0, 0, 0],
  size = [1, 1, 1],
  m = 'cream',
  shadow,
  ...props
}: { position?: V3; size?: V3; m?: PaletteKey; shadow?: boolean } & MeshProps) {
  return (
    <mesh
      geometry={unitBox}
      material={material(m)}
      position={position}
      scale={size}
      castShadow={shadow ?? casts(size)}
      receiveShadow
      {...props}
    />
  );
}

export function Cylinder({
  position = [0, 0, 0],
  radius = 1,
  height = 1,
  m = 'cream',
  shadow,
  ...props
}: { position?: V3; radius?: number; height?: number; m?: PaletteKey; shadow?: boolean } & MeshProps) {
  return (
    <mesh
      geometry={unitCylinder}
      material={material(m)}
      position={position}
      scale={[radius, height, radius]}
      castShadow={shadow ?? casts([radius * 2, height])}
      receiveShadow
      {...props}
    />
  );
}

export function Ball({
  position = [0, 0, 0],
  radius = 0.5,
  scale,
  m = 'cream',
  ...props
}: { position?: V3; radius?: number; scale?: V3; m?: PaletteKey } & MeshProps) {
  return (
    <mesh
      geometry={unitSphere}
      material={material(m)}
      position={position}
      scale={scale ?? [radius, radius, radius]}
      castShadow={radius > 0.2}
      receiveShadow
      {...props}
    />
  );
}

export function Cone({
  position = [0, 0, 0],
  radius = 0.5,
  height = 1,
  m = 'cream',
  ...props
}: { position?: V3; radius?: number; height?: number; m?: PaletteKey } & MeshProps) {
  return (
    <mesh
      geometry={unitCone}
      material={material(m)}
      position={position}
      scale={[radius, height, radius]}
      castShadow={height > 0.4}
      receiveShadow
      {...props}
    />
  );
}

export function Rock({ position, scale, m = 'stone' }: { position: V3; scale: V3; m?: PaletteKey }) {
  return (
    <mesh geometry={unitRock} material={material(m)} position={position} scale={scale} castShadow receiveShadow />
  );
}

/**
 * A flat panel showing a procedural canvas texture: screens (always lit) or
 * painted signs (backlit at night). `px` is the canvas resolution.
 */
export function Panel({
  id,
  paint,
  size,
  px,
  position = [0, 0, 0],
  rotation,
  glow = 'screen',
}: {
  id: string;
  paint: Painter;
  size: [number, number];
  px: [number, number];
  position?: V3;
  rotation?: V3;
  glow?: Glow;
}) {
  // Textures and materials are cached by id, so this is a cheap lookup after the first paint.
  const mat = useMemo(
    () => texturedMaterial(canvasTexture(id, px[0], px[1], paint), glow),
    [id, glow, paint, px],
  );
  return (
    <mesh geometry={unitPlane} material={mat} position={position} rotation={rotation} scale={[size[0], size[1], 1]} />
  );
}

/** A monitor: bezel, lit panel, and an optional stand. */
export function Monitor({
  id,
  paint,
  position,
  rotation,
  width = 1.2,
  height = 0.75,
  px = [384, 240],
  stand = true,
}: {
  id: string;
  paint: Painter;
  position: V3;
  rotation?: V3;
  width?: number;
  height?: number;
  px?: [number, number];
  stand?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      <Box size={[width + 0.1, height + 0.1, 0.07]} m="graphite" />
      <Panel id={id} paint={paint} size={[width, height]} px={px} position={[0, 0, 0.037]} />
      {stand && (
        <>
          <Box position={[0, -height / 2 - 0.16, -0.02]} size={[0.07, 0.3, 0.06]} m="graphite" />
          <Box position={[0, -height / 2 - 0.3, 0.02]} size={[0.38, 0.03, 0.22]} m="graphite" />
        </>
      )}
    </group>
  );
}

/** Small status light. Pass a ref-able group via `name` to animate. */
export function Led({ position, m = 'ledGreen', size = 0.06 }: { position: V3; m?: PaletteKey; size?: number }) {
  return <Box position={position} size={[size, size, size * 0.5]} m={m} shadow={false} />;
}

const leaves: { p: V3; s: V3; m: PaletteKey }[] = [
  { p: [0, 1.42, 0], s: [0.62, 0.72, 0.56], m: 'leafA' },
  { p: [-0.34, 1.14, 0.06], s: [0.44, 0.5, 0.42], m: 'leafB' },
  { p: [0.32, 1.1, -0.14], s: [0.46, 0.52, 0.42], m: 'leafC' },
];

export function Tree({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder position={[0, 0.16, 0]} radius={0.36} height={0.32} m="pot" />
      <Cylinder position={[0, 0.72, 0]} radius={0.065} height={1.1} m="bark" />
      {leaves.map((l, i) => (
        <Rock key={i} position={l.p} scale={l.s} m={l.m} />
      ))}
    </group>
  );
}

/** Path lamp: off by day, a warm bulb at night. */
export function Lamp({ position, height = 1.25 }: { position: V3; height?: number }) {
  return (
    <group position={position}>
      <Cylinder position={[0, 0.04, 0]} radius={0.12} height={0.08} m="graphite" />
      <Cylinder position={[0, height / 2, 0]} radius={0.028} height={height} m="graphite" />
      <Box position={[0, height + 0.02, 0]} size={[0.2, 0.05, 0.2]} m="graphite" />
      <Box position={[0, height - 0.07, 0]} size={[0.13, 0.13, 0.13]} m="lampBulb" shadow={false} />
    </group>
  );
}
