import { useMemo } from 'react';
import {
  CatmullRomCurve3,
  Vector3,
  Shape,
  BufferGeometry,
  Float32BufferAttribute,
} from 'three';
import { pathPoints } from '@/src/data/world-map';
import { Box, Cylinder, Plant } from './Primitives';
function Ribbon() {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(
      pathPoints.map(([x, z]) => new Vector3(x, 0.035, z)),
    );
    const vertices: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100,
        p = curve.getPoint(t),
        d = curve.getTangent(t);
      const n = new Vector3(-d.z, 0, d.x).multiplyScalar(0.6);
      vertices.push(p.x + n.x, p.y, p.z + n.z, p.x - n.x, p.y, p.z - n.z);
      if (i < 100) {
        const a = i * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#c4b897" roughness={1} side={2} />
    </mesh>
  );
}
export default function Island() {
  const shape = useMemo(() => {
    const s = new Shape();
    const x = 10,
      y = 7,
      r = 2;
    s.moveTo(-x + r, -y);
    s.lineTo(x - r, -y);
    s.quadraticCurveTo(x, -y, x, -y + r);
    s.lineTo(x, y - r);
    s.quadraticCurveTo(x, y, x - r, y);
    s.lineTo(-x + r, y);
    s.quadraticCurveTo(-x, y, -x, y - r);
    s.lineTo(-x, -y + r);
    s.quadraticCurveTo(-x, -y, -x + r, -y);
    return s;
  }, []);
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.3, 0]}
        receiveShadow
        castShadow
      >
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 1.2,
              bevelEnabled: true,
              bevelSize: 0.2,
              bevelThickness: 0.1,
              bevelSegments: 2,
              steps: 1,
            },
          ]}
        />
        <meshStandardMaterial color="#d8d4bf" roughness={1} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
        receiveShadow
      >
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#c3cbb0" roughness={1} />
      </mesh>
      <Ribbon />
      <Box
        position={[0, -0.83, 6.99]}
        size={[4.6, 0.12, 0.07]}
        color="#718d87"
      />
      <Box
        position={[3.3, -0.83, 6.93]}
        size={[0.9, 0.12, 0.07]}
        color="#d67f53"
      />
      {[-7.8, -6.8, -5.8].map((x) => (
        <Box
          key={x}
          position={[x, -0.63, 6.6]}
          size={[0.55, 0.55, 0.1]}
          color="#96a49a"
        />
      ))}
      <Plant position={[-8, 0, -0.3]} scale={1.3} />
      <Plant position={[-8.3, 0, 4.8]} scale={0.85} />
      <Plant position={[8.4, 0, -4.5]} scale={1.1} />
      <Plant position={[2.5, 0, -4.8]} scale={1.15} />
      <Plant position={[8.6, 0, 1]} scale={0.7} />
      {[
        [1.8, -5.5],
        [-3, -5.8],
        [8.5, 5.3],
        [-8.8, -4.6],
        [-2.9, 5.4],
      ].map(([x, z], i) => (
        <group key={i}>
          <Cylinder
            position={[x, 0.05, z]}
            radius={0.35}
            height={0.1}
            color="#d8d9b9"
          />
          <mesh position={[x, 0.22, z]} scale={[0.38, 0.24, 0.3]}>
            <dodecahedronGeometry />
            <meshStandardMaterial color="#e6dfcc" flatShading />
          </mesh>
        </group>
      ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.75, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.11} />
      </mesh>
    </group>
  );
}
