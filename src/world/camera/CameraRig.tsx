import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';
export default function CameraRig({ zoom }: { zoom: number }) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (camera instanceof OrthographicCamera) {
      // oxlint-disable-next-line react/react-compiler -- R3F owns this mutable Three.js camera; it must be updated imperatively in the layout effect.
      camera.zoom = Math.min(size.width / 25, size.height / 18, 43) * zoom;
      camera.position.set(15, 19, 24);
      camera.lookAt(0, 0.45, 0);
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, size.width, size.height, zoom, invalidate]);
  return null;
}
