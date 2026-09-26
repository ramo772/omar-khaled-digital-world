import { Blink } from './Animated';
import { Box, Cylinder, Led, type V3 } from './Primitives';

/**
 * The quiet plumbing between landmarks: cable trenches, a junction box and
 * access hatches. Decorative engineering texture — it glows softly at night
 * so the world reads as "still running after sunset".
 */
const trenches: { from: [number, number]; to: [number, number] }[] = [
  { from: [4.35, -0.55], to: [4.35, 2.9] },
  { from: [4.35, 2.9], to: [2.75, 3.25] },
  { from: [2.75, 3.25], to: [6.7, 3.25] },
  { from: [2.75, 3.25], to: [0.9, 2.2] },
  { from: [-3.1, 0.2], to: [-3.1, 2.7] },
];

function Trench({ from, to }: { from: [number, number]; to: [number, number] }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  const position: V3 = [(from[0] + to[0]) / 2, 0.02, (from[1] + to[1]) / 2];
  const rotation: V3 = [0, Math.atan2(dx, dz), 0];
  return (
    <group position={position} rotation={rotation}>
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
      {/* Junction box */}
      <group position={[2.75, 0, 3.25]}>
        <Box position={[0, 0.34, 0]} size={[0.62, 0.68, 0.4]} m="graphite" />
        <Box position={[0, 0.72, 0]} size={[0.7, 0.06, 0.48]} m="steel" />
        {[-0.18, 0, 0.18].map((x, i) => (
          <Blink key={x} animate={animate} period={0.8 + i * 0.35} phase={i * 0.3} duty={0.65}>
            <Led position={[x, 0.52, 0.205]} m={i === 1 ? 'ledAmber' : 'ledGreen'} size={0.05} />
          </Blink>
        ))}
        <Box position={[0, 0.3, 0.205]} size={[0.4, 0.22, 0.01]} m="steel" />
      </group>
      {/* Access hatches */}
      {(
        [
          [4.35, 1.2],
          [5.2, 3.25],
          [-3.1, 1.4],
        ] as [number, number][]
      ).map(([x, z]) => (
        <Cylinder key={`${x}${z}`} position={[x, 0.025, z]} radius={0.24} height={0.03} m="steel" shadow={false} />
      ))}
      {/* A bench for thinking — a small human detail */}
      <group position={[1.1, 0, 5.2]} rotation={[0, 0.56, 0]}>
        <Box position={[0, 0.42, 0]} size={[1.3, 0.07, 0.4]} m="timber" />
        <Box position={[0, 0.72, -0.18]} size={[1.3, 0.3, 0.05]} m="timber" />
        {[-0.55, 0.55].map((x) => (
          <Box key={x} position={[x, 0.21, 0]} size={[0.06, 0.42, 0.36]} m="graphite" />
        ))}
        <Box position={[0.3, 0.47, 0.02]} size={[0.34, 0.02, 0.24]} m="steel" />
        <Box position={[0.3, 0.58, -0.09]} size={[0.34, 0.22, 0.02]} m="steel" rotation={[-0.3, 0, 0]} />
      </group>
    </group>
  );
}
