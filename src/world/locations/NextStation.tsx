import { useMemo } from 'react';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial } from 'three';
import { landmarks } from '@/src/data/world-map';
import { ink } from '../materials/canvas';
import { plaque, tag } from '../materials/painters';
import { Blink, Bob, Spin } from '../environment/Animated';
import { Box, Cylinder, Panel } from '../environment/Primitives';
import { FACE_CAMERA } from './AboutDesk';

/**
 * 05 · What's next + contact. An unfinished wireframe prototype on a launch
 * plinth (the next thing to build), a signal mast, and a mailbox.
 */
export default function NextStation({ animate }: { animate: boolean }) {
  const { x, z } = landmarks.contact;
  const { edges, line } = useMemo(
    () => ({
      edges: new EdgesGeometry(new BoxGeometry(0.62, 0.62, 0.62)),
      line: new LineBasicMaterial({ color: '#df7950' }),
    }),
    [],
  );
  return (
    <group position={[x, 0, z]}>
      <Box position={[0, 0.07, 0]} size={[2.3, 0.14, 1.9]} m="stone" />
      {/* Launch plinth + wireframe prototype */}
      <group position={[-0.45, 0.14, -0.2]}>
        <Cylinder position={[0, 0.2, 0]} radius={0.46} height={0.4} m="graphite" />
        <Cylinder position={[0, 0.41, 0]} radius={0.5} height={0.03} m="trace" />
        <Bob animate={animate} amplitude={0.05} position={[0, 0.95, 0]}>
          <Spin animate={animate} speed={0.35}>
            <lineSegments geometry={edges} material={line} rotation={[0.4, 0, 0.3]} />
          </Spin>
        </Bob>
        <Panel
          id="next-tag"
          paint={tag('NEXT →', ink.amber)}
          size={[0.5, 0.13]}
          px={[240, 62]}
          position={[0, 0.26, 0.47]}
          rotation={[0, 0, 0]}
        />
      </group>
      {/* Signal mast */}
      <group position={[0.75, 0.14, -0.55]}>
        <Cylinder position={[0, 1.2, 0]} radius={0.035} height={2.4} m="graphite" />
        {[0.7, 1.3, 1.9].map((h) => (
          <Box key={h} position={[0, h, 0]} size={[0.34 - h * 0.08, 0.025, 0.025]} m="graphite" />
        ))}
        <Blink animate={animate} period={1.6} duty={0.35}>
          <Box position={[0, 2.46, 0]} size={[0.1, 0.1, 0.1]} m="ledRed" shadow={false} />
        </Blink>
      </group>
      {/* Mailbox */}
      <group position={[0.55, 0.14, 0.45]} rotation={[0, FACE_CAMERA, 0]}>
        <Box position={[0, 0.4, 0]} size={[0.06, 0.8, 0.06]} m="graphite" />
        <Box position={[0, 0.9, 0]} size={[0.34, 0.26, 0.46]} m="signal" />
        <Box position={[0, 1.04, 0.1]} size={[0.24, 0.02, 0.16]} m="paper" rotation={[0.35, 0, 0]} />
        <Box position={[0.19, 1.0, -0.1]} size={[0.02, 0.2, 0.06]} m="butter" />
      </group>
      {/* Sign */}
      <group position={[-0.35, 0.14, 0.72]} rotation={[0, FACE_CAMERA, 0]}>
        <Box position={[-0.5, 0.35, -0.02]} size={[0.04, 0.7, 0.04]} m="graphite" />
        <Box position={[0.5, 0.35, -0.02]} size={[0.04, 0.7, 0.04]} m="graphite" />
        <Panel id="next-sign" paint={plaque("WHAT'S NEXT", "LET'S TALK")} size={[1.2, 0.42]} px={[480, 168]} position={[0, 0.74, 0]} glow="sign" />
      </group>
    </group>
  );
}
