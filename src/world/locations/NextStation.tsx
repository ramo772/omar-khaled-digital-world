import { useMemo } from 'react';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial } from 'three';
import { contact } from '@/src/content/portfolio';
import { landmarks } from '@/src/data/world-map';
import { ink } from '../materials/canvas';
import { contactScreen, plaque, tag } from '../materials/painters';
import { Blink, Bob, Spin } from '../environment/Animated';
import { Box, Cylinder, Monitor, Panel } from '../environment/Primitives';
import { LightPools } from '../environment/Landscape';
import { FACE_CAMERA } from './AboutDesk';

/**
 * The last stop: what's next, and how to reach Omar. A desk with a contact
 * terminal, a signpost pointing forward, a mailbox, and an unfinished
 * wireframe prototype — the next thing to build.
 */
export default function NextStation({ animate }: { animate: boolean }) {
  const { x, z } = landmarks.contact;
  const { edges, line } = useMemo(
    () => ({
      edges: new EdgesGeometry(new BoxGeometry(0.5, 0.5, 0.5)),
      line: new LineBasicMaterial({ color: '#df7950' }),
    }),
    [],
  );
  const channels = contact.filter((c) => c.href).map((c) => `${c.label.padEnd(9)}${c.value}`);
  return (
    <group position={[x, 0, z]}>
      <Box position={[0, 0.07, 0]} size={[2.3, 0.14, 1.9]} m="stone" />
      {/* Desk + contact terminal */}
      <group position={[-0.15, 0.14, -0.35]} rotation={[0, FACE_CAMERA - 0.35, 0]}>
        <Box position={[0, 0.62, 0]} size={[1.2, 0.06, 0.55]} m="timber" />
        {[-0.54, 0.54].map((dx) => (
          <Box key={dx} position={[dx, 0.31, 0]} size={[0.05, 0.6, 0.48]} m="graphite" />
        ))}
        <Monitor id="next-contact" paint={contactScreen('contact', channels)} position={[-0.12, 1.02, -0.12]} width={0.72} height={0.5} px={[340, 236]} />
        <Box position={[0.4, 0.66, 0.08]} size={[0.3, 0.02, 0.2]} m="steel" />
        <Box position={[0.4, 0.76, -0.02]} size={[0.3, 0.19, 0.02]} m="steel" rotation={[-0.3, 0, 0]} />
        <Cylinder position={[-0.46, 0.7, 0.14]} radius={0.05} height={0.1} m="signal" />
      </group>
      {/* Wireframe prototype on a small launch plinth */}
      <group position={[0.8, 0.14, -0.45]}>
        <Cylinder position={[0, 0.16, 0]} radius={0.3} height={0.32} m="graphite" />
        <Cylinder position={[0, 0.33, 0]} radius={0.33} height={0.02} m="trace" />
        <Bob animate={animate} amplitude={0.04} position={[0, 0.78, 0]}>
          <Spin animate={animate} speed={0.35}>
            <lineSegments geometry={edges} material={line} rotation={[0.4, 0, 0.3]} />
          </Spin>
        </Bob>
        <Panel id="next-tag" paint={tag('CONTACT', ink.amber)} size={[0.46, 0.12]} px={[240, 62]} position={[0, 0.2, 0.31]} />
      </group>
      {/* Signpost pointing forward */}
      <group position={[-0.8, 0.14, 0.6]} rotation={[0, FACE_CAMERA, 0]}>
        <Box position={[0, 0.6, 0]} size={[0.06, 1.2, 0.06]} m="graphite" />
        <group position={[0.25, 1.02, 0.04]}>
          <Panel id="next-sign" paint={plaque('GET IN TOUCH →', "LET'S TALK")} size={[1.0, 0.36]} px={[480, 172]} glow="sign" />
        </group>
      </group>
      {/* Mailbox */}
      <group position={[0.85, 0.14, 0.55]} rotation={[0, FACE_CAMERA, 0]}>
        <Box position={[0, 0.4, 0]} size={[0.06, 0.8, 0.06]} m="graphite" />
        <Box position={[0, 0.9, 0]} size={[0.34, 0.26, 0.46]} m="signal" />
        <Box position={[0, 1.04, 0.1]} size={[0.24, 0.02, 0.16]} m="paper" rotation={[0.35, 0, 0]} />
        <Box position={[0.19, 1.0, -0.1]} size={[0.02, 0.2, 0.06]} m="butter" />
      </group>
      {/* Signal mast */}
      <group position={[0.95, 0.14, -0.85]}>
        <Cylinder position={[0, 1.1, 0]} radius={0.03} height={2.2} m="graphite" />
        {[0.7, 1.25, 1.8].map((h) => (
          <Box key={h} position={[0, h, 0]} size={[0.3 - h * 0.07, 0.022, 0.022]} m="graphite" />
        ))}
        <Blink animate={animate} period={1.6} duty={0.35}>
          <Box position={[0, 2.26, 0]} size={[0.09, 0.09, 0.09]} m="ledRed" shadow={false} />
        </Blink>
      </group>
      <LightPools items={[{ p: [0, 0.15, 0], s: [2.6, 2.3, 1], r: [-Math.PI / 2, 0, 0] }]} />
    </group>
  );
}
