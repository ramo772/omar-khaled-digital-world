import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Box } from '../environment/Primitives';
export const AVATAR_HEIGHT = 1.7;
export const AVATAR_RADIUS = 0.28;
// Y-up, feet at zero, facing +Z. A generic human, never a likeness of Omar.
export default forwardRef<
  Group,
  { moving?: React.RefObject<boolean>; reducedMotion?: boolean }
>(function Avatar({ moving, reducedMotion }, ref) {
  const leftLeg = useRef<Group>(null),
    rightLeg = useRef<Group>(null),
    leftArm = useRef<Group>(null),
    rightArm = useRef<Group>(null);
  useFrame(({ clock }) => {
    const swing =
      moving?.current && !reducedMotion
        ? Math.sin(clock.elapsedTime * 10) * 0.42
        : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.65;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.65;
  });
  return (
    <group ref={ref}>
      <group ref={leftLeg} position={[-0.15, 0.62, 0]}>
        <Box position={[0, -0.25, 0]} size={[0.2, 0.5, 0.23]} color="#465c65" />
        <Box
          position={[0, -0.53, 0.055]}
          size={[0.23, 0.12, 0.35]}
          color="#eee5d1"
        />
      </group>
      <group ref={rightLeg} position={[0.15, 0.62, 0]}>
        <Box position={[0, -0.25, 0]} size={[0.2, 0.5, 0.23]} color="#465c65" />
        <Box
          position={[0, -0.53, 0.055]}
          size={[0.23, 0.12, 0.35]}
          color="#eee5d1"
        />
      </group>
      <Box position={[0, 0.88, 0]} size={[0.59, 0.57, 0.33]} color="#d67c52" />
      <group ref={leftArm} position={[-0.38, 1.07, 0]}>
        <Box
          position={[0, -0.17, 0]}
          size={[0.16, 0.38, 0.21]}
          color="#d67c52"
        />
        <Box
          position={[0, -0.42, 0]}
          size={[0.15, 0.16, 0.16]}
          color="#d6b995"
        />
      </group>
      <group ref={rightArm} position={[0.38, 1.07, 0]}>
        <Box
          position={[0, -0.17, 0]}
          size={[0.16, 0.38, 0.21]}
          color="#d67c52"
        />
        <Box
          position={[0, -0.42, 0]}
          size={[0.15, 0.16, 0.16]}
          color="#d6b995"
        />
      </group>
      <Box position={[0, 1.24, 0]} size={[0.17, 0.17, 0.17]} color="#d6b995" />
      <Box position={[0, 1.44, 0]} size={[0.42, 0.41, 0.38]} color="#d6b995" />
      <Box
        position={[0, 1.63, -0.025]}
        size={[0.44, 0.11, 0.4]}
        color="#4d4740"
      />
      <Box
        position={[0, 1.48, -0.18]}
        size={[0.44, 0.27, 0.06]}
        color="#4d4740"
      />
      <Box
        position={[0, 1.47, 0.197]}
        size={[0.34, 0.09, 0.025]}
        color="#4c5652"
      />
      <Box
        position={[0, 0.91, -0.23]}
        size={[0.37, 0.4, 0.18]}
        color="#627d72"
      />
    </group>
  );
});
