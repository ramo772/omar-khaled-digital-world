import type { RefObject } from 'react';
import { RADIUS } from '@/src/lib/movement';

/**
 * The avatar replacement contract. Any visual model (the procedural Omar
 * figure today, a GLB tomorrow) must honour these numbers and consume
 * AvatarMotion; it must never move itself. Controller.tsx owns position,
 * heading and collision; CameraRig.tsx owns the camera.
 */
export const AVATAR = {
  /** Feet at y = 0, top of hair at ~height. Y-up, facing +Z. */
  height: 2.05,
  /** Horizontal collider radius — independent of the visual model. */
  colliderRadius: RADIUS,
  /** Height of the "you are here" marker above the head. */
  markerHeight: 2.62,
} as const;

/** Written by the controller every frame, read by the model's animation. */
export interface AvatarMotion {
  /** True while the avatar is actually translating this frame. */
  moving: boolean;
  /** Seconds since the avatar last moved (drives idle behaviour). */
  idle: number;
}

export interface AvatarModelProps {
  motion: RefObject<AvatarMotion>;
  reducedMotion: boolean;
}
