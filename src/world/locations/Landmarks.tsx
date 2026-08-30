import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { Box, Cylinder, Screen } from '../environment/Primitives';
function Rack({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <Box position={[0, 1, 0]} size={[0.78, 2, 0.65]} color="#3b5151" />
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i}>
          <Box
            position={[0, 0.3 + i * 0.34, 0.34]}
            size={[0.65, 0.24, 0.05]}
            color="#607670"
          />
          <Box
            position={[0.23, 0.3 + i * 0.34, 0.38]}
            size={[0.05, 0.05, 0.02]}
            color="#edc975"
          />
        </group>
      ))}
    </group>
  );
}
export function Workshop() {
  return (
    <group position={[0, 0, -1.25]}>
      <Box position={[0, 0.1, 0]} size={[5.8, 0.2, 3.7]} color="#eae3d2" />
      {[-2.5, 2.5].flatMap((x) =>
        [-1.5, 1.5].map((z) => (
          <Box
            key={`${x}${z}`}
            position={[x, 1.75, z]}
            size={[0.14, 3.4, 0.14]}
            color="#4b6260"
          />
        )),
      )}
      <Box
        position={[0, 3.5, 0]}
        size={[5.7, 0.18, 3.7]}
        color="#f0e6c8"
        rotation={[0, 0, -0.06]}
      />
      <Box
        position={[0, 3.47, 1.9]}
        size={[5.8, 0.24, 0.12]}
        color="#d8845d"
        rotation={[0, 0, -0.06]}
      />
      <Box
        position={[0, 3.6, -0.6]}
        size={[3.7, 0.1, 1.4]}
        color="#779c9a"
        rotation={[0, 0, -0.06]}
      />
      {[-1.5, -0.75, 0, 0.75, 1.5].map((x) => (
        <Box
          key={x}
          position={[x, 3.7 - x * 0.06, -0.6]}
          size={[0.026, 0.018, 1.36]}
          color="#aec3b6"
        />
      ))}
      <Box
        position={[-0.55, 0.95, 0.65]}
        size={[3.7, 0.14, 0.9]}
        color="#cdb891"
      />
      {[-2, 1].map((x) => (
        <Box
          key={x}
          position={[x, 0.5, 0.65]}
          size={[0.15, 0.9, 0.55]}
          color="#718b80"
        />
      ))}
      <Screen position={[-0.7, 1.93, 0.3]} scale={1.35} />
      <Box
        position={[-0.7, 1.05, 0.84]}
        size={[1.55, 0.05, 0.36]}
        color="#5e7770"
      />
      <Rack x={2} z={-0.3} />
      <Box
        position={[-2, 1.07, 0.7]}
        size={[0.32, 0.12, 0.38]}
        color="#e39866"
      />
      <Cylinder
        position={[0.65, 1.19, 0.79]}
        radius={0.12}
        height={0.29}
        color="#f6ebd0"
      />
      <Box
        position={[-0.3, 1.6, -1.4]}
        size={[2.8, 1.8, 0.1]}
        color="#f4efdd"
      />
      {[-0.95, 0, 0.95].map((x, i) => (
        <group key={x}>
          <Box
            position={[x, 1.8, -1.33]}
            size={[0.5, 0.36, 0.04]}
            color={i === 1 ? '#d99467' : '#9bb9a7'}
          />
          <Box
            position={[x, 1.4, -1.33]}
            size={[0.5, 0.035, 0.04]}
            color="#718d82"
          />
          {i < 2 && (
            <Box
              position={[x + 0.45, 1.8, -1.33]}
              size={[0.4, 0.03, 0.04]}
              color="#718d82"
            />
          )}
        </group>
      ))}
      <Cylinder
        position={[2.55, 3.86, 1.45]}
        radius={0.12}
        height={0.3}
        color="#ecc670"
      />
    </group>
  );
}
export function AboutDesk() {
  return (
    <group position={[-6.6, 0, 3]} rotation={[0, 0.16, 0]}>
      <Cylinder
        radius={1.35}
        height={0.12}
        position={[0, 0.04, 0]}
        color="#dcd9c1"
      />
      <Box position={[0, 0.82, 0]} size={[1.9, 0.12, 1]} color="#d3b790" />
      {[-0.7, 0.7].map((x) => (
        <Box
          key={x}
          position={[x, 0.4, 0]}
          size={[0.12, 0.8, 0.7]}
          color="#5e7974"
        />
      ))}
      <Screen position={[-0.1, 1.4, -0.12]} scale={0.6} />
      <Box
        position={[-0.1, 0.91, 0.16]}
        size={[0.9, 0.055, 0.42]}
        color="#e5e1d0"
      />
      <Cylinder
        position={[0.7, 1.01, 0.2]}
        radius={0.11}
        height={0.28}
        color="#dd8b61"
      />
      <Cylinder
        position={[0, 0.39, 1]}
        radius={0.35}
        height={0.12}
        color="#b49473"
      />
      <Cylinder
        position={[0, 0.19, 1]}
        radius={0.1}
        height={0.35}
        color="#627976"
      />
    </group>
  );
}
export function Journey() {
  return (
    <group position={[-6.6, 0, -3.1]}>
      <Box position={[0, 0.07, 0]} size={[3.8, 0.12, 1.7]} color="#ddd9c0" />
      {[-1.3, 0, 1.3].map((x, i) => (
        <group key={x}>
          <Box
            position={[x, 0.45 + i * 0.2, 0]}
            size={[0.83, 0.8 + i * 0.4, 0.73]}
            color={['#d4c29c', '#a7b9a2', '#7c9e94'][i]}
          />
          <Box
            position={[x, 0.73 + i * 0.4, 0.375]}
            size={[0.43, 0.035, 0.025]}
            color="#f3ead4"
          />
          <Cylinder
            position={[x, 0.94 + i * 0.4, 0]}
            radius={0.11}
            height={0.08}
            color="#e9bb76"
          />
        </group>
      ))}
      <Box
        position={[0, 0.15, 0.75]}
        size={[3.4, 0.05, 0.08]}
        color="#c19168"
      />
      <Rack x={-1} z={-1.2} />
    </group>
  );
}
export function AILab({ animate = true }: { animate?: boolean }) {
  const ring = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ring.current && animate)
      ring.current.rotation.y += Math.min(dt, 0.04) * 0.3;
  });
  return (
    <group position={[6, 0, -2.1]}>
      <Cylinder
        position={[0, 0.13, 0]}
        radius={1.8}
        height={0.25}
        color="#dfdfc8"
      />
      <Cylinder
        position={[0, 0.42, 0]}
        radius={1.05}
        height={0.35}
        color="#87aaa1"
      />
      <Cylinder
        position={[0, 0.65, 0]}
        radius={0.85}
        height={0.12}
        color="#e9ebd4"
      />
      <group ref={ring} position={[0, 1.75, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0.15]}>
          <torusGeometry args={[1.12, 0.045, 6, 40]} />
          <meshStandardMaterial color="#5c8d84" />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group
            key={i}
            position={[
              Math.cos((i * Math.PI * 2) / 3) * 1.12,
              0,
              Math.sin((i * Math.PI * 2) / 3) * 1.12,
            ]}
          >
            <Box
              size={[0.3, 0.32, 0.3]}
              color={i === 0 ? '#eab874' : '#8eafa8'}
            />
            <Box
              position={[0, 0.19, 0]}
              size={[0.15, 0.03, 0.15]}
              color="#fff3c9"
            />
          </group>
        ))}
      </group>
      <mesh position={[0, 1.3, 0]} rotation={[0.25, 0.4, 0.3]}>
        <octahedronGeometry args={[0.44]} />
        <meshStandardMaterial color="#e4bd7e" flatShading />
      </mesh>
      <Box position={[1.25, 0.65, 1]} size={[0.5, 0.7, 0.45]} color="#eadfca" />
      <Box position={[1.25, 1.2, 1]} size={[0.63, 0.4, 0.5]} color="#f2ead5" />
      <Box
        position={[1.25, 1.2, 1.27]}
        size={[0.47, 0.17, 0.025]}
        color="#456d68"
      />
      {[1.11, 1.39].map((x) => (
        <Box
          key={x}
          position={[x, 1.2, 1.29]}
          size={[0.055, 0.055, 0.015]}
          color="#ecc67d"
        />
      ))}
      <Cylinder
        position={[1.25, 1.49, 1]}
        radius={0.025}
        height={0.23}
        color="#54766e"
      />
      <Box
        position={[-1.2, 0.93, 1.2]}
        size={[0.9, 0.09, 0.6]}
        color="#455f5c"
        rotation={[0.2, 0, 0]}
      />
    </group>
  );
}
export function Toolbench() {
  return (
    <group position={[-0.9, 0, 5]}>
      <Box position={[0, 0.42, 0]} size={[2.6, 0.85, 0.7]} color="#7b9381" />
      <Box position={[0, 0.88, 0]} size={[2.8, 0.12, 0.85]} color="#d8c5a1" />
      {[-0.6, -0.2, 0.2].map((x, i) => (
        <Box
          key={x}
          position={[x, 1.05, 0]}
          size={[0.27, 0.25, 0.42]}
          color={['#d1926b', '#dfc788', '#aac0ae'][i]}
        />
      ))}
      <Box
        position={[0.8, 0.48, 0.36]}
        size={[0.5, 0.06, 0.03]}
        color="#d6d6bd"
      />
    </group>
  );
}
export function SignalStation() {
  return (
    <group position={[6.8, 0, 3.8]}>
      <Box position={[0, 0.08, 0]} size={[2, 0.16, 1.6]} color="#e2d8bd" />
      <Box position={[-0.3, 0.65, 0]} size={[1, 1.15, 0.6]} color="#d5a079" />
      <Box
        position={[-0.3, 0.91, 0.32]}
        size={[0.7, 0.3, 0.05]}
        color="#4e716c"
      />
      <Box
        position={[-0.3, 0.47, 0.32]}
        size={[0.58, 0.07, 0.05]}
        color="#f3e5c4"
      />
      <Cylinder
        position={[0.6, 1.55, 0]}
        radius={0.05}
        height={3}
        color="#5f7e75"
      />
      <mesh position={[0.6, 2.75, 0]} rotation={[0.5, 0, -0.5]}>
        <sphereGeometry args={[0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e4e5cb" side={2} />
      </mesh>
      <Box position={[0.85, 2, 0]} size={[0.5, 0.36, 0.04]} color="#e4b568" />
    </group>
  );
}
