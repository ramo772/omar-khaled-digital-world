import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { V3 } from './Primitives';

/**
 * Tiny, allocation-free animation helpers. Each one freezes in a sensible
 * resting pose when `animate` is false (reduced motion, hidden, or paused).
 */

/** Blinks its children on and off; resting state is "on". */
export function Blink({
  children,
  period = 1.2,
  duty = 0.5,
  phase = 0,
  animate,
}: {
  children: ReactNode;
  period?: number;
  duty?: number;
  phase?: number;
  animate: boolean;
}) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.visible = !animate || ((clock.elapsedTime / period + phase) % 1) < duty;
  });
  return <group ref={g}>{children}</group>;
}

/** Continuous rotation around Y. */
export function Spin({
  children,
  speed = 0.4,
  position,
  animate,
}: {
  children: ReactNode;
  speed?: number;
  position?: V3;
  animate: boolean;
}) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (g.current && animate) g.current.rotation.y += Math.min(dt, 0.05) * speed;
  });
  return (
    <group ref={g} position={position}>
      {children}
    </group>
  );
}

/** Gentle vertical float. */
export function Bob({
  children,
  amplitude = 0.06,
  speed = 1.6,
  position,
  animate,
}: {
  children: ReactNode;
  amplitude?: number;
  speed?: number;
  position?: V3;
  animate: boolean;
}) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = animate ? Math.sin(clock.elapsedTime * speed) * amplitude : 0;
  });
  return (
    <group position={position}>
      <group ref={g}>{children}</group>
    </group>
  );
}
