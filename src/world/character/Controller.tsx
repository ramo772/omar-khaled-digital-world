import { useEffect, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import Avatar from './Avatar';
import {
  destinations,
  obstacles,
  worldBounds,
  spawn,
  type DestinationId,
} from '@/src/data/world-map';
import { move, normalize, route, type Point } from '@/src/lib/movement';
export interface Controls {
  touch: Point;
  target: Point | null;
  jump: DestinationId | 'home' | null;
  position: Point;
}
export default function Controller({
  active,
  reducedMotion,
  controls,
  onNear,
  onPosition,
}: {
  active: boolean;
  reducedMotion: boolean;
  controls: MutableRefObject<Controls>;
  onNear: (id: DestinationId | null) => void;
  onPosition: (p: Point) => void;
}) {
  const root = useRef<Group>(null),
    model = useRef<Group>(null),
    moving = useRef(false),
    keys = useRef(new Set<string>()),
    path = useRef<Point[]>([]),
    sample = useRef(0),
    lastNear = useRef<DestinationId | null>(null);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        !active ||
        (e.target as HTMLElement)?.closest(
          'button,a,input,textarea,select,[contenteditable]',
        )
      )
        return;
      if (
        [
          'w',
          'a',
          's',
          'd',
          'arrowup',
          'arrowleft',
          'arrowdown',
          'arrowright',
        ].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        keys.current.add(e.key.toLowerCase());
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const reset = () => {
      keys.current.clear();
      controls.current.touch = { x: 0, z: 0 };
      path.current = [];
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', reset);
    if (!active) reset();
    return () => {
      reset();
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, [active, controls]);
  useFrame((_, rawDt) => {
    if (!root.current) return;
    let p = controls.current.position;
    if (controls.current.jump) {
      const id = controls.current.jump;
      const next =
        id === 'home' ? spawn : destinations.find((d) => d.id === id)!.stop;
      p = { x: next[0], z: next[1] };
      controls.current.position = p;
      controls.current.jump = null;
      controls.current.target = null;
      path.current = [];
    }
    if (controls.current.target) {
      path.current = route(p, controls.current.target, obstacles, worldBounds);
      controls.current.target = null;
    }
    moving.current = false;
    if (active) {
      const k = keys.current;
      const sx =
        Number(k.has('d') || k.has('arrowright')) -
        Number(k.has('a') || k.has('arrowleft')) +
        controls.current.touch.x;
      const sy =
        Number(k.has('s') || k.has('arrowdown')) -
        Number(k.has('w') || k.has('arrowup')) +
        controls.current.touch.z;
      let direction = normalize(
        sx * 0.848 + sy * 0.53,
        -sx * 0.53 + sy * 0.848,
      );
      if (sx || sy) path.current = [];
      else if (path.current.length) {
        const goal = path.current[0],
          dx = goal.x - p.x,
          dz = goal.z - p.z;
        if (Math.hypot(dx, dz) < 0.12) path.current.shift();
        else
          direction = normalize(
            dx / Math.hypot(dx, dz),
            dz / Math.hypot(dx, dz),
          );
      }
      const dt = Math.min(rawDt, 0.04),
        next = move(
          p,
          { x: direction.x * dt * 3.1, z: direction.z * dt * 3.1 },
          obstacles,
          worldBounds,
        );
      moving.current = Math.hypot(next.x - p.x, next.z - p.z) > 0.0001;
      if (moving.current && model.current)
        model.current.rotation.y = Math.atan2(next.x - p.x, next.z - p.z);
      p = next;
      controls.current.position = p;
    }
    root.current.position.set(p.x, 0.02, p.z);
    sample.current += rawDt;
    if (sample.current > 0.18) {
      sample.current = 0;
      onPosition({ ...p });
      const nearest =
        destinations.find(
          (d) => Math.hypot(p.x - d.stop[0], p.z - d.stop[1]) < 1.8,
        )?.id ?? null;
      if (nearest !== lastNear.current) {
        lastNear.current = nearest;
        onNear(nearest);
      }
    }
  });
  return (
    <group ref={root} position={[spawn[0], 0.02, spawn[1]]}>
      <Avatar ref={model} moving={moving} reducedMotion={reducedMotion} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.46, 0.49, 32]} />
        <meshBasicMaterial color="#cc8055" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
