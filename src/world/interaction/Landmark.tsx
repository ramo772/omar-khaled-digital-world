import { useRef, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { V3 } from '../environment/Primitives';

/**
 * Makes any group of meshes an interactive place: pointer cursor, a small
 * hover lift, and click/tap to open its panel. Content lives in the panel UI;
 * this wrapper only reports which place was chosen.
 */
export default function Landmark({
  onActivate,
  position,
  rotation,
  children,
  lift = 0.06,
}: {
  onActivate: () => void;
  position?: V3;
  rotation?: V3;
  children: ReactNode;
  lift?: number;
}) {
  const inner = useRef<Group>(null);
  const hovered = useRef(false);
  useFrame((_, dt) => {
    const g = inner.current;
    if (!g) return;
    const goal = hovered.current ? lift : 0;
    if (Math.abs(g.position.y - goal) > 0.001) g.position.y += (goal - g.position.y) * Math.min(1, dt * 14);
  });
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = true;
    document.body.style.cursor = 'pointer';
  };
  const out = () => {
    hovered.current = false;
    document.body.style.cursor = '';
  };
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        if (e.delta > 8) return; // a drag, not a click
        e.stopPropagation();
        onActivate();
      }}
      onPointerOver={over}
      onPointerOut={out}
    >
      <group ref={inner}>{children}</group>
    </group>
  );
}
