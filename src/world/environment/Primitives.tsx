import type { ThreeElements } from '@react-three/fiber';
type V3 = [number, number, number];
export function Box({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color = '#e9e2cf',
  ...props
}: { position?: V3; size?: V3; color?: string } & Omit<
  ThreeElements['mesh'],
  'position'
>) {
  return (
    <mesh position={position} castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}
export function Cylinder({
  position = [0, 0, 0],
  radius = 1,
  height = 1,
  color = '#e9e2cf',
  ...props
}: { position?: V3; radius?: number; height?: number; color?: string } & Omit<
  ThreeElements['mesh'],
  'position'
>) {
  return (
    <mesh position={position} castShadow receiveShadow {...props}>
      <cylinderGeometry args={[radius, radius, height, 12]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}
export function Plant({
  position,
  scale = 1,
}: {
  position: V3;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <Cylinder
        position={[0, 0.18, 0]}
        radius={0.43}
        height={0.36}
        color="#bdab8b"
      />
      <Cylinder
        position={[0, 0.7, 0]}
        radius={0.07}
        height={1.1}
        color="#86775e"
      />
      {[
        [0, 1.45, 0],
        [-0.37, 1.17, 0.05],
        [0.35, 1.12, -0.15],
      ].map((p, i) => (
        <mesh key={i} position={p as V3} scale={[0.65, 0.76, 0.57]} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={['#819c7d', '#9ab08b', '#718e76'][i]}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
export function Screen({
  position,
  scale = 1,
}: {
  position: V3;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <Box size={[1.8, 1.15, 0.14]} color="#35494b" />
      <Box position={[0, 0, 0.081]} size={[1.61, 0.97, 0.02]} color="#a7cec2" />
      {Array.from({ length: 5 }, (_, i) => (
        <Box
          key={i}
          position={[-0.12 + (i % 2) * 0.11, 0.31 - i * 0.145, 0.099]}
          size={[0.6 + (i % 3) * 0.21, 0.047, 0.008]}
          color={i === 0 ? '#e9e8c1' : '#4f7771'}
        />
      ))}
      <Box position={[0, -0.74, 0]} size={[0.12, 0.35, 0.15]} color="#35494b" />
      <Box
        position={[0, -0.91, 0.08]}
        size={[0.6, 0.06, 0.4]}
        color="#35494b"
      />
    </group>
  );
}
