/* oxlint-disable react/react-compiler -- R3F owns this mutable Three.js camera; it is updated imperatively in the frame loop. */
import { useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Vector3 } from 'three';
import type { Controls } from '../character/Controller';

/** Fixed isometric-ish direction: no free orbit, so orientation never gets lost. */
const OFFSET = new Vector3(15, 19, 24);
const OVERVIEW = new Vector3(0, 0.3, 0.2);
/** Ground direction toward the camera, and how much ground distance shows up as screen height. */
const TOWARD_CAMERA = new Vector3(OFFSET.x, 0, OFFSET.z).normalize();
const SIN_ELEVATION = OFFSET.y / OFFSET.length();
/** Approximate on-screen height of the whole island (with labels), in world units. */
const ISLAND_SCREEN_HEIGHT = 16;
/** Follow focus is clamped so the view never drifts off the island. */
const LIMIT = { x: 6.2, zMin: -3.2, zMax: 3.8 };

export default function CameraRig({
  zoom,
  follow,
  controls,
  reducedMotion,
}: {
  zoom: number;
  follow: boolean;
  controls: RefObject<Controls>;
  reducedMotion: boolean;
}) {
  const { camera, size } = useThree();
  const focus = useRef(OVERVIEW.clone());
  const goal = useMemo(() => new Vector3(), []);
  const settled = useRef(false);
  const last = useRef({ zoom: 0, follow, w: 0, h: 0 });

  useFrame((_, rawDt) => {
    if (!(camera instanceof OrthographicCamera)) return;
    const dt = Math.min(rawDt, 0.05);
    // The island projects to ~26 × 15 units on screen; leave room for header and dock.
    // Phones trade the island's rounded corners for a larger, more legible world.
    const fit = size.width < 700 ? Math.min(size.width / 23.5, size.height / 14) : Math.min(size.width / 27, size.height / 17, 50);
    const closer = size.width < 700 ? 2.05 : size.width < 1100 ? 1.75 : 1.6;
    const targetZoom = fit * zoom * (follow ? closer : 1);
    if (follow) {
      const p = controls.current.position;
      goal.set(Math.max(-LIMIT.x, Math.min(LIMIT.x, p.x)), 0.5, Math.max(LIMIT.zMin, Math.min(LIMIT.zMax, p.z)));
    } else {
      goal.copy(OVERVIEW);
      // On tall, narrow (phone) canvases the island is width-bound: lift it
      // toward the top instead of leaving an empty band above it.
      const spare = size.height / targetZoom - ISLAND_SCREEN_HEIGHT;
      if (size.width < 700 && spare > 2) goal.addScaledVector(TOWARD_CAMERA, (spare / 2 - 1.5) / SIN_ELEVATION);
    }

    const l = last.current;
    const changed = l.zoom !== targetZoom || l.follow !== follow || l.w !== size.width || l.h !== size.height;
    if (changed) settled.current = false;
    Object.assign(l, { zoom: targetZoom, follow, w: size.width, h: size.height });
    if (settled.current && !follow) return;

    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 5);
    focus.current.lerp(goal, k);
    camera.zoom += (targetZoom - camera.zoom) * k;
    if (Math.abs(camera.zoom - targetZoom) < 0.01 && focus.current.distanceToSquared(goal) < 1e-5) {
      camera.zoom = targetZoom;
      focus.current.copy(goal);
      settled.current = true;
    }
    camera.position.copy(focus.current).add(OFFSET);
    camera.lookAt(focus.current);
    camera.updateProjectionMatrix();
  });
  return null;
}
