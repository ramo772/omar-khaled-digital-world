import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  TorusGeometry,
  type Group,
} from 'three';
import { landmarks } from '@/src/data/world-map';
import { ink } from '../materials/canvas';
import { material, unitBox, unitSphere } from '../materials/registry';
import { plaque, scoreBoard, tag } from '../materials/painters';
import { Blink, Bob } from '../environment/Animated';
import { Box, Cylinder, Led, Monitor, Panel, type V3 } from '../environment/Primitives';
import { FACE_CAMERA } from './AboutDesk';

/**
 * 04 · AI Lab. Everything here is an illustrative, local simulation of ideas
 * Omar is exploring — no model calls, no real data, clearly labelled.
 */
const LOOP = ['AGENT', 'TOOL', 'OBSERVE', 'DECIDE'];
const TOOLS = ['DB', 'SEARCH', 'FILES', 'API'];

function Label({ text, position, color = ink.seafoam, width = 0.5 }: { text: string; position: V3; color?: string; width?: number }) {
  return (
    <Panel
      id={`lab:${text}:${color}`}
      paint={tag(text, color)}
      size={[width, width * 0.24]}
      px={[320, 76]}
      position={position}
      rotation={[0, FACE_CAMERA, 0]}
    />
  );
}

/** Agent → tool → observation → decision, lit in sequence around a ring. */
function AgentLoop({ animate }: { animate: boolean }) {
  const pods = useRef<(Mesh | null)[]>([]);
  const packet = useRef<Group>(null);
  const core = useRef<Group>(null);
  const ring = useMemo(() => new TorusGeometry(1.05, 0.03, 8, 64), []);
  const gem = useMemo(() => new OctahedronGeometry(0.34), []);
  const t = useRef(0.1);
  useFrame((_, dt) => {
    if (animate) t.current += Math.min(dt, 0.05) * 0.22;
    const angle = t.current * Math.PI * 2;
    if (packet.current) packet.current.position.set(Math.cos(angle) * 1.05, 0, Math.sin(angle) * 1.05);
    const active = Math.floor((((t.current % 1) + 1) % 1) * 4 + 0.5) % 4;
    pods.current.forEach((p, i) => {
      if (p) p.material = material(i === active ? 'ledAmber' : 'cream');
    });
    if (core.current && animate) {
      core.current.rotation.y += Math.min(dt, 0.05) * 0.6;
      core.current.position.y = 1.62 + Math.sin(t.current * 9) * 0.05;
    }
  });
  return (
    <group>
      <Cylinder position={[0, 0.45, 0]} radius={0.36} height={0.6} m="steel" />
      <Cylinder position={[0, 0.78, 0]} radius={0.42} height={0.06} m="graphite" />
      <group ref={core} position={[0, 1.62, 0]}>
        <mesh geometry={gem} material={material('aiCore')} castShadow />
      </group>
      <group position={[0, 1.1, 0]}>
        <mesh geometry={ring} material={material('wire')} rotation={[Math.PI / 2, 0, 0]} />
        {LOOP.map((name, i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <group key={name} position={[Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05]}>
              <mesh
                ref={(el) => {
                  pods.current[i] = el;
                }}
                geometry={unitBox}
                material={material('cream')}
                scale={[0.26, 0.26, 0.26]}
                castShadow
              />
              <Label text={name} position={[0, 0.3, 0]} width={0.52} color={i === 1 ? ink.amber : ink.seafoam} />
            </group>
          );
        })}
        <group ref={packet}>
          <mesh geometry={unitSphere} material={material('pulse')} scale={[0.08, 0.08, 0.08]} />
        </group>
      </group>
    </group>
  );
}

/** MCP hub: a client connects to tool servers one at a time. */
function McpHub({ animate }: { animate: boolean }) {
  const wires = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const active = animate ? Math.floor(clock.elapsedTime / 0.9) % TOOLS.length : 0;
    wires.current.forEach((w, i) => {
      if (w) w.material = material(i === active ? 'ledCyan' : 'wire');
    });
  });
  return (
    <group>
      <Box position={[0, 0.2, 0]} size={[0.36, 0.3, 0.36]} m="graphite" />
      <Label text="MCP" position={[0, 0.5, 0]} width={0.4} color={ink.butter} />
      {TOOLS.map((name, i) => {
        const a = -0.9 + i * 0.6;
        const r = 0.78;
        const px = Math.cos(a) * r;
        const pz = Math.sin(a) * r;
        return (
          <group key={name}>
            <mesh
              ref={(el) => {
                wires.current[i] = el;
              }}
              geometry={unitBox}
              material={material('wire')}
              position={[px / 2, 0.08, pz / 2]}
              rotation={[0, -a, 0]}
              scale={[r, 0.03, 0.03]}
            />
            <Box position={[px, 0.12, pz]} size={[0.2, 0.2, 0.2]} m={i % 2 ? 'seafoam' : 'steel'} />
            <Label text={name} position={[px, 0.34, pz]} width={0.36} />
          </group>
        );
      })}
    </group>
  );
}

/** Embeddings: similar things cluster together. Three coloured clusters in a glass case. */
function EmbeddingCloud({ animate }: { animate: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const spin = useRef<Group>(null);
  const COUNT = 36;
  const glass = useMemo(
    () => new MeshStandardMaterial({ color: '#cfe3de', transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false }),
    [],
  );
  const pointMaterial = useMemo(() => new MeshStandardMaterial({ roughness: 0.4, emissive: '#ffffff', emissiveIntensity: 0.25 }), []);
  useFrame(() => {
    const m = mesh.current;
    if (!m || m.userData.placed) return;
    const o = new Object3D();
    const colors = ['#f2a65c', '#7fc4b8', '#e8c46f'].map((c) => new Color(c));
    const centers: V3[] = [
      [-0.18, 0.55, -0.1],
      [0.2, 0.85, 0.12],
      [0.05, 0.35, 0.2],
    ];
    let seed = 11;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280) - 0.5;
    for (let i = 0; i < COUNT; i++) {
      const c = centers[i % 3];
      o.position.set(c[0] + rand() * 0.22, c[1] + rand() * 0.22, c[2] + rand() * 0.22);
      o.scale.setScalar(0.035);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, colors[i % 3]);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.userData.placed = true;
  });
  useFrame((_, dt) => {
    if (spin.current && animate) spin.current.rotation.y += Math.min(dt, 0.05) * 0.35;
  });
  return (
    <group>
      <Cylinder position={[0, 0.06, 0]} radius={0.42} height={0.12} m="graphite" />
      <mesh position={[0, 0.66, 0]} scale={[0.4, 1.1, 0.4]} geometry={unitSphere} material={glass} />
      <group ref={spin}>
        <instancedMesh ref={mesh} args={[unitSphere, pointMaterial, COUNT]} frustumCulled={false} />
      </group>
    </group>
  );
}

/** Small environmental helper robot that patrols the lab. */
function Robot({ animate }: { animate: boolean }) {
  const root = useRef<Group>(null);
  const t = useRef(0.6);
  useFrame((_, dt) => {
    const g = root.current;
    if (!g) return;
    if (animate) t.current += Math.min(dt, 0.05) * 0.18;
    const a = t.current * Math.PI * 2;
    const r = 1.62;
    g.position.set(Math.cos(a) * r, 0.2 + (animate ? Math.abs(Math.sin(t.current * 40)) * 0.02 : 0), Math.sin(a) * r);
    g.rotation.y = -a;
  });
  return (
    <group ref={root}>
      <Box position={[0, 0.22, 0]} size={[0.3, 0.26, 0.26]} m="robot" />
      <Box position={[0, 0.48, 0]} size={[0.34, 0.24, 0.28]} m="robot" />
      <Box position={[0, 0.48, 0.145]} size={[0.26, 0.15, 0.01]} m="ink" />
      {[-0.06, 0.06].map((x) => (
        <Box key={x} position={[x, 0.5, 0.152]} size={[0.045, 0.045, 0.01]} m="ledCyan" shadow={false} />
      ))}
      <Box position={[0, 0.66, 0]} size={[0.02, 0.12, 0.02]} m="graphite" />
      <Blink animate={animate} period={1.1}>
        <Box position={[0, 0.74, 0]} size={[0.06, 0.06, 0.06]} m="ledAmber" shadow={false} />
      </Blink>
      {[-0.17, 0.17].map((x) => (
        <Cylinder key={x} position={[x, 0.08, 0]} radius={0.08} height={0.05} m="ink" rotation={[0, 0, Math.PI / 2]} />
      ))}
    </group>
  );
}

export default function AILab({ animate }: { animate: boolean }) {
  const { x, z, radius } = landmarks.ai;
  return (
    <group position={[x, 0, z]}>
      <Cylinder position={[0, 0.07, 0]} radius={radius} height={0.14} m="stone" />
      <Cylinder position={[0, 0.15, 0]} radius={radius - 0.18} height={0.04} m="graphite" />
      <Cylinder position={[0, 0.17, 0]} radius={radius - 0.3} height={0.02} m="deck" />
      <group position={[0, 0.18, 0]}>
        <AgentLoop animate={animate} />
        <group position={[0.95, 0, 1.05]}>
          <McpHub animate={animate} />
        </group>
        <group position={[-1.2, 0, 0.45]}>
          <EmbeddingCloud animate={animate} />
          <Label text="EMBEDDINGS" position={[0, 1.55, 0]} width={0.7} />
        </group>
        <group position={[-0.35, 0, -1.45]} rotation={[0, FACE_CAMERA - 0.3, 0]}>
          <Monitor
            id="lab-evals"
            paint={scoreBoard('evals', [['grounded', 0.82], ['tool use', 0.67], ['format', 0.91]], 'SYNTHETIC DEMO DATA · NOT RESULTS')}
            position={[0, 1.25, 0]}
            width={1.0}
            height={0.62}
            px={[340, 210]}
          />
        </group>
        <Robot animate={animate} />
        <Bob animate={animate} amplitude={0.04} position={[1.35, 0, -0.95]}>
          <Blink animate={animate} period={2.2} duty={0.8}>
            <Led position={[0, 1.2, 0]} m="ledCyan" size={0.08} />
          </Blink>
        </Bob>
      </group>
      {/* Sign */}
      <group position={[1.55, 0, 1.5]} rotation={[0, FACE_CAMERA, 0]}>
        <Box position={[-0.55, 0.45, -0.02]} size={[0.04, 0.9, 0.04]} m="graphite" />
        <Box position={[0.55, 0.45, -0.02]} size={[0.04, 0.9, 0.04]} m="graphite" />
        <Panel id="lab-sign" paint={plaque('AI LAB', 'EXPERIMENTS · LEARNING')} size={[1.3, 0.46]} px={[520, 184]} position={[0, 0.95, 0]} glow="sign" />
      </group>
    </group>
  );
}
