/* oxlint-disable react/react-compiler -- The frame loop intentionally mutates shared input refs and Three.js transforms outside React rendering. React state must not update on every frame. */
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { ConeGeometry, MeshBasicMaterial, RingGeometry, type Group } from 'three';
import Avatar from './Avatar';
import { AVATAR, type AvatarMotion } from './avatar-contract';
import { destinationById, obstacles, spawn, worldBounds, type DestinationId } from '@/src/data/world-map';
import { move, normalize, route, turnToward, type Point } from '@/src/lib/movement';
import { MOVE_KEYS, OWNS_KEYS } from './keys';

export interface Controls {
  touch: Point;
  target: Point | null;
  jump: DestinationId | 'home' | null;
  position: Point;
}

const SPEED = 3.3;
const NEAR = 1.7;
/** Heading that faces the (fixed-direction) camera; idle Omar turns to greet the visitor. */
const FACE_VISITOR = Math.atan2(15, 24);

/**
 * Owns input → movement → collision → heading. Knows nothing about how the
 * avatar looks; it publishes AvatarMotion for whichever model is mounted.
 */
export default function Controller({
  active,
  reducedMotion,
  controls,
  onNear,
  onPosition,
}: {
  active: boolean;
  reducedMotion: boolean;
  controls: RefObject<Controls>;
  onNear: (id: DestinationId | null) => void;
  onPosition: (p: Point) => void;
}) {
  const root = useRef<Group>(null);
  const heading = useRef<Group>(null);
  const marker = useRef<Group>(null);
  const motion = useRef<AvatarMotion>({ moving: false, idle: 0 });
  const keys = useRef(new Set<string>());
  const path = useRef<Point[]>([]);
  const sample = useRef(0);
  const lastNear = useRef<DestinationId | null>(null);
  const yaw = useRef(0.6);
  const art = useMemo(
    () => ({
      ring: new RingGeometry(0.4, 0.47, 40),
      ringMaterial: new MeshBasicMaterial({ color: '#df7950', transparent: true, opacity: 0.75, depthWrite: false }),
      chevron: new ConeGeometry(0.13, 0.22, 4),
      // Drawn on top of everything so Omar is never lost behind a building.
      chevronMaterial: new MeshBasicMaterial({ color: '#df7950', depthTest: false, transparent: true, opacity: 0.95 }),
    }),
    [],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Walking still works after clicking a toolbar button; only real input widgets keep their keys.
      if (!active || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.closest(OWNS_KEYS)) return;
      const k = e.key.toLowerCase();
      if (MOVE_KEYS.includes(k)) {
        e.preventDefault();
        keys.current.add(k);
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

  useFrame(({ clock }, rawDt) => {
    if (!root.current) return;
    const dt = Math.min(rawDt, 0.05);
    let p = controls.current.position;
    if (controls.current.jump) {
      const id = controls.current.jump;
      const next = id === 'home' ? spawn : destinationById[id].stop;
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
    let moved = false;
    if (active) {
      const k = keys.current;
      const sx = Number(k.has('d') || k.has('arrowright')) - Number(k.has('a') || k.has('arrowleft')) + controls.current.touch.x;
      const sy = Number(k.has('s') || k.has('arrowdown')) - Number(k.has('w') || k.has('arrowup')) + controls.current.touch.z;
      // Screen-relative input rotated into the isometric camera's ground frame.
      let direction = normalize(sx * 0.848 + sy * 0.53, -sx * 0.53 + sy * 0.848);
      if (sx || sy) path.current = [];
      else if (path.current.length) {
        const goal = path.current[0];
        const dx = goal.x - p.x;
        const dz = goal.z - p.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.12) path.current.shift();
        else direction = { x: dx / d, z: dz / d };
      }
      const next = move(p, { x: direction.x * dt * SPEED, z: direction.z * dt * SPEED }, obstacles, worldBounds);
      moved = Math.hypot(next.x - p.x, next.z - p.z) > 0.0005;
      if (moved) yaw.current = turnToward(yaw.current, Math.atan2(next.x - p.x, next.z - p.z), reducedMotion ? 1 : dt * 12);
      p = next;
      controls.current.position = p;
    }
    motion.current.moving = moved;
    // Idle time is wall-clock time (movement uses the capped dt), so slow devices still reach the idle pose.
    motion.current.idle = moved ? 0 : motion.current.idle + Math.min(rawDt, 0.5);
    if (motion.current.idle > 1.2) yaw.current = turnToward(yaw.current, FACE_VISITOR, reducedMotion ? 1 : dt * 3);
    root.current.position.set(p.x, 0.02, p.z);
    if (heading.current) heading.current.rotation.y = yaw.current;
    if (marker.current) marker.current.position.y = AVATAR.markerHeight + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 2.4) * 0.06);

    sample.current += rawDt;
    if (sample.current > 0.18) {
      sample.current = 0;
      onPosition({ ...p });
      const nearest = Object.values(destinationById).find((d) => Math.hypot(p.x - d.stop[0], p.z - d.stop[1]) < NEAR)?.id ?? null;
      if (nearest !== lastNear.current) {
        lastNear.current = nearest;
        onNear(nearest);
      }
    }
  });

  return (
    <group ref={root} position={[spawn[0], 0.02, spawn[1]]}>
      <group ref={heading}>
        <Avatar motion={motion} reducedMotion={reducedMotion} />
      </group>
      <mesh geometry={art.ring} material={art.ringMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} />
      <group ref={marker} position={[0, AVATAR.markerHeight, 0]}>
        <mesh geometry={art.chevron} material={art.chevronMaterial} rotation={[Math.PI, Math.PI / 4, 0]} renderOrder={10} />
      </group>
    </group>
  );
}
