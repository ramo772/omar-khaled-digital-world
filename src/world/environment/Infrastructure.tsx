import { Blink } from './Animated';
import { Box, Cylinder, Led, type V3 } from './Primitives';

/**
 * Quiet plumbing between places: a junction box by the workshop, a cable
 * trench, access hatches, and a bench by the water. Decorative engineering
 * texture that glows softly at night.
 */
const trenches: { from: [number, number]; to: [number, number] }[] = [
  { from: [4.45, -0.55], to: [4.45, -0.1] },
  { from: [-3.1, 0.35], to: [-3.1, 2.6] },
  { from: [-3.1, 2.6], to: [-2.2, 3.3] },
];

function Trench({ from, to }: { from: [number, number]; to: [number, number] }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  const position: V3 = [(from[0] + to[0]) / 2, 0.02, (from[1] + to[1]) / 2];
  return (
    <group position={position} rotation={[0, Math.atan2(dx, dz), 0]}>
      <Box size={[0.2, 0.02, length]} m="plinth" shadow={false} />
      <Box position={[0, 0.012, 0]} size={[0.045, 0.012, length]} m="trace" shadow={false} />
    </group>
  );
}

export default function Infrastructure({ animate }: { animate: boolean }) {
  return (
    <group>
      {trenches.map((t, i) => (
        <Trench key={i} {...t} />
      ))}
      <group position={[4.45, 0, 0.1]}>
        <Box position={[0, 0.34, 0]} size={[0.62, 0.68, 0.4]} m="graphite" />
        <Box position={[0, 0.72, 0]} size={[0.7, 0.06, 0.48]} m="steel" />
        {[-0.18, 0, 0.18].map((x, i) => (
          <Blink key={x} animate={animate} period={0.8 + i * 0.35} phase={i * 0.3} duty={0.65}>
            <Led position={[x, 0.52, 0.205]} m={i === 1 ? 'ledAmber' : 'ledGreen'} size={0.05} />
          </Blink>
        ))}
        <Box position={[0, 0.3, 0.205]} size={[0.4, 0.22, 0.01]} m="steel" />
      </group>
      {(
        [
          [-3.1, 1.5],
          [2.6, 2.6],
        ] as [number, number][]
      ).map(([x, z]) => (
        <Cylinder key={`${x}${z}`} position={[x, 0.025, z]} radius={0.24} height={0.03} m="steel" shadow={false} />
      ))}
      {/* A bench by the water — a small human detail */}
      <group position={[2.1, 0, 5.75]} rotation={[0, 0.56, 0]}>
        <Box position={[0, 0.42, 0]} size={[1.2, 0.07, 0.4]} m="timber" />
        <Box position={[0, 0.72, -0.18]} size={[1.2, 0.3, 0.05]} m="timber" />
        {[-0.5, 0.5].map((x) => (
          <Box key={x} position={[x, 0.21, 0]} size={[0.06, 0.42, 0.36]} m="graphite" />
        ))}
        <Box position={[0.28, 0.47, 0.02]} size={[0.34, 0.02, 0.24]} m="steel" />
        <Box position={[0.28, 0.58, -0.09]} size={[0.34, 0.22, 0.02]} m="steel" rotation={[-0.3, 0, 0]} />
      </group>
    </group>
  );
}
