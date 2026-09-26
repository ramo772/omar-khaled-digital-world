import { useLayoutEffect, useRef } from 'react';
import { InstancedMesh, Object3D, type BufferGeometry, type Material } from 'three';
import type { V3 } from './Primitives';

export interface Placement {
  p: V3;
  s: V3;
  r?: V3;
}

/**
 * One draw call for many identical props (lamps, bushes, rocks, light pools).
 * Placements are static; pass a memoised array.
 */
export default function Instances({
  geometry,
  material,
  items,
  castShadow = false,
  receiveShadow = true,
  renderOrder,
}: {
  geometry: BufferGeometry;
  material: Material;
  items: Placement[];
  castShadow?: boolean;
  receiveShadow?: boolean;
  renderOrder?: number;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new Object3D();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.rotation.set(...(it.r ?? [0, 0, 0]));
      o.scale.set(...it.s);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  if (!items.length) return null;
  return (
    <instancedMesh
      key={items.length}
      ref={ref}
      args={[geometry, material, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      renderOrder={renderOrder}
    />
  );
}
