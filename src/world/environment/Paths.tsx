import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  InstancedMesh,
  Object3D,
  Vector3,
} from 'three';
import { pathPoints, skillsSpur } from '@/src/data/world-map';
import { material, unitBox } from '../materials/registry';
import { Lamp, type V3 } from './Primitives';

function ribbon(curve: CatmullRomCurve3, offset: number, width: number, y: number, segments = 160) {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPoint(t);
    const d = curve.getTangent(t);
    const n = new Vector3(-d.z, 0, d.x).normalize();
    const c = p.clone().addScaledVector(n, offset);
    vertices.push(c.x + n.x * width, y, c.z + n.z * width, c.x - n.x * width, y, c.z - n.z * width);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

const curveOf = (points: [number, number][]) =>
  new CatmullRomCurve3(points.map(([x, z]) => new Vector3(x, 0, z)));

const PULSES = 9;

/** Small data packets travelling the story path: the world keeps running. */
function Pulses({ curve, animate }: { curve: CatmullRomCurve3; animate: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const scratch = useMemo(() => ({ o: new Object3D(), p: new Vector3(), d: new Vector3() }), []);
  const time = useRef(0);
  const placed = useRef(false);
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m || (!animate && placed.current)) return;
    placed.current = true;
    if (animate) time.current += Math.min(dt, 0.05);
    const { o, p, d } = scratch;
    for (let i = 0; i < PULSES; i++) {
      const t = (time.current * 0.035 + i / PULSES) % 1;
      curve.getPoint(t, p);
      curve.getTangent(t, d);
      const side = i % 2 ? 0.64 : -0.64;
      const len = Math.hypot(d.x, d.z) || 1;
      o.position.set(p.x - (d.z / len) * side, 0.06, p.z + (d.x / len) * side);
      o.rotation.set(0, Math.atan2(d.x, d.z), 0);
      o.scale.set(0.08, 0.05, 0.24);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={mesh} args={[unitBox, material('pulse'), PULSES]} frustumCulled={false} />;
}

/** Lamp posts along the route (warm at night). */
const lamps: V3[] = [
  [-4.7, 0, 4.2],
  [-7.6, 0, 2.9],
  [-4.1, 0, -0.9],
  [-1.3, 0, -0.2],
  [3.0, 0, 1.55],
  [7.1, 0, 1.5],
  [4.6, 0, 3.9],
];

export default function Paths({ animate }: { animate: boolean }) {
  const { main, mainTraces, spur, spurTraces, curve } = useMemo(() => {
    const c = curveOf(pathPoints);
    const s = curveOf(skillsSpur);
    return {
      curve: c,
      main: ribbon(c, 0, 0.56, 0.028),
      mainTraces: [ribbon(c, 0.64, 0.028, 0.034), ribbon(c, -0.64, 0.028, 0.034)],
      spur: ribbon(s, 0, 0.42, 0.026, 40),
      spurTraces: [ribbon(s, 0.5, 0.024, 0.032, 40), ribbon(s, -0.5, 0.024, 0.032, 40)],
    };
  }, []);
  return (
    <group>
      <mesh geometry={main} material={material('path')} receiveShadow />
      <mesh geometry={spur} material={material('path')} receiveShadow />
      {[...mainTraces, ...spurTraces].map((g, i) => (
        <mesh key={i} geometry={g} material={material('trace')} />
      ))}
      <Pulses curve={curve} animate={animate} />
      {lamps.map((p, i) => (
        <Lamp key={i} position={p} />
      ))}
    </group>
  );
}
