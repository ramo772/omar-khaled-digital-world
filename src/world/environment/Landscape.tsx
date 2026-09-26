/* oxlint-disable react/react-compiler -- Frame-loop texture scrolling and theme listeners mutate Three.js objects by design. */
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferGeometry,
  CircleGeometry,
  Float32BufferAttribute,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Vector3,
  type CatmullRomCurve3,
} from 'three';
import { features } from '@/src/config/features';
import { groundHeight, stream, terraces, trees } from '@/src/data/world-map';
import { material, onNightMix, unitBox, unitCylinder, unitRock } from '../materials/registry';
import { canvasTexture } from '../materials/canvas';
import { glowDisc, waterStreaks } from '../materials/painters';
import { Blink, Spin } from './Animated';
import Instances, { type Placement } from './Instances';
import { roundedRect } from './Island';
import { curveOf, pathLamps } from './pathing';
import { Box, Cylinder, Led } from './Primitives';

/** Deterministic jitter so the landscape is identical on every load. */
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

/* ─────────────── Terraces: raised blocks with stone retaining walls ─────────────── */

function Terraces() {
  const shapes = useMemo(
    () =>
      terraces.map((t) => {
        const r = Math.min(1.1, t.w / 4, t.d / 4);
        return {
          t,
          wall: roundedRect(t.w / 2, t.d / 2, r),
          cap: roundedRect(t.w / 2 + 0.06, t.d / 2 + 0.06, r + 0.06),
          top: roundedRect(t.w / 2 - 0.1, t.d / 2 - 0.1, Math.max(0.1, r - 0.1)),
        };
      }),
    [],
  );
  return (
    <group>
      {shapes.map(({ t, wall, cap, top }, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} material={material('wall')} castShadow receiveShadow>
            <extrudeGeometry args={[wall, { depth: t.h - 0.04, bevelEnabled: false }]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, t.h - 0.07, 0]} material={material('wallCap')} receiveShadow>
            <extrudeGeometry args={[cap, { depth: 0.07, bevelEnabled: false }]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, t.h + 0.004, 0]} material={material('grass')} receiveShadow>
            <shapeGeometry args={[top]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─────────────── Greenery: instanced trees, bushes and rocks ─────────────── */

function Greenery() {
  const { trunks, leaves, bushes, rocks } = useMemo(() => {
    const rand = seeded(17);
    const trunks: Placement[] = [];
    const leaves: [Placement[], Placement[], Placement[]] = [[], [], []];
    for (const [x, z, s] of trees) {
      const y = groundHeight(x, z);
      trunks.push({ p: [x, y + 0.55 * s, z], s: [0.07 * s, 1.1 * s, 0.07 * s] });
      leaves[0].push({ p: [x, y + 1.42 * s, z], s: [0.62 * s, 0.72 * s, 0.56 * s], r: [0, rand() * 3, 0] });
      leaves[1].push({ p: [x - 0.34 * s, y + 1.12 * s, z + 0.06 * s], s: [0.44 * s, 0.5 * s, 0.42 * s] });
      leaves[2].push({ p: [x + 0.32 * s, y + 1.08 * s, z - 0.14 * s], s: [0.46 * s, 0.52 * s, 0.42 * s] });
    }
    // Bush clusters: terrace edges, landmark backs, the stream banks.
    const anchors: [number, number, number][] = [
      [-9.0, -5.05, 6],
      [-6.5, -5.05, 5],
      [-4.2, -5.1, 3],
      [-2.4, -5.75, 4],
      [4.3, -5.75, 4],
      [-9.5, 3.2, 3],
      [-9.3, 4.9, 3],
      [-2.4, 4.4, 3],
      [0.6, 4.6, 2],
      [9.3, 3.2, 3],
      [8.9, 5.7, 3],
      [2.4, 6.3, 3],
      [-5.6, 6.3, 3],
      ...(features.aiLab
        ? []
        : ([
            [6.0, -1.0, 4],
            [9.3, -0.95, 4],
            [9.7, -3.0, 3],
            [6.6, -2.6, 3],
            [8.6, -1.2, 3],
          ] as [number, number, number][])),
    ];
    const bushes: [Placement[], Placement[], Placement[]] = [[], [], []];
    anchors.forEach(([ax, az, n]) => {
      for (let i = 0; i < n; i++) {
        const x = ax + (rand() - 0.5) * 1.1;
        const z = az + (rand() - 0.5) * 0.55;
        const s = 0.16 + rand() * 0.16;
        bushes[i % 3].push({ p: [x, groundHeight(x, z) + s * 0.6, z], s: [s * 1.2, s, s * 1.1], r: [0, rand() * 3, 0] });
      }
    });
    const rocks: Placement[] = [];
    const rock = (x: number, z: number, s: number) =>
      rocks.push({ p: [x, groundHeight(x, z) + s * 0.35, z], s: [s * 1.3, s * 0.75, s], r: [rand(), rand() * 3, rand()] });
    [
      [-9.7, 5.3, 0.3],
      [4.6, -6.5, 0.26],
      [-6.0, -4.8, 0.3],
      [9.8, 4.6, 0.24],
      [-3.3, 6.5, 0.22],
      [0.2, 6.5, 0.2],
    ].forEach(([x, z, s]) => rock(x, z, s));
    if (stream) {
      // Banks: stones along both sides of the water, skipping the bridge.
      const c = curveOf(stream.points);
      const p = new Vector3();
      const d = new Vector3();
      for (let i = 0; i <= 26; i++) {
        const t = i / 26;
        c.getPoint(t, p);
        c.getTangent(t, d);
        if (Math.hypot(p.x - stream.bridge.x, p.z - stream.bridge.z) < 1.1) continue;
        const side = i % 2 ? 1 : -1;
        const off = stream.width / 2 + 0.12 + rand() * 0.1;
        rock(p.x - d.z * off * side, p.z + d.x * off * side, 0.12 + rand() * 0.12);
      }
      const { pond } = stream;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + rand() * 0.3;
        rock(pond.x + Math.cos(a) * (pond.radius + 0.1), pond.z + Math.sin(a) * (pond.radius * 0.8 + 0.1), 0.13 + rand() * 0.1);
      }
    }
    return { trunks, leaves, bushes, rocks };
  }, []);
  return (
    <group>
      <Instances geometry={unitCylinder} material={material('bark')} items={trunks} castShadow />
      <Instances geometry={unitRock} material={material('leafA')} items={leaves[0]} castShadow />
      <Instances geometry={unitRock} material={material('leafB')} items={leaves[1]} castShadow />
      <Instances geometry={unitRock} material={material('leafC')} items={leaves[2]} castShadow />
      <Instances geometry={unitRock} material={material('leafB')} items={bushes[0]} />
      <Instances geometry={unitRock} material={material('leafA')} items={bushes[1]} />
      <Instances geometry={unitRock} material={material('leafC')} items={bushes[2]} />
      <Instances geometry={unitRock} material={material('stone')} items={rocks} castShadow />
    </group>
  );
}

/* ─────────────── Water: stream, pond, waterfall, bridge ─────────────── */

function ribbonUV(curve: CatmullRomCurve3, width: number, y: number, offset = 0, segments = 90) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const p = new Vector3();
  const d = new Vector3();
  const length = curve.getLength();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPoint(t, p);
    curve.getTangent(t, d);
    const n = Math.hypot(d.x, d.z) || 1;
    const nx = -d.z / n;
    const nz = d.x / n;
    const cx = p.x + nx * offset;
    const cz = p.z + nz * offset;
    pos.push(cx + nx * width, y, cz + nz * width, cx - nx * width, y, cz - nz * width);
    uv.push(0, (t * length) / 1.4, 1, (t * length) / 1.4);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function Water({ animate }: { animate: boolean }) {
  const s = stream!;
  const art = useMemo(() => {
    const { points, width } = stream!;
    const curve = curveOf(points);
    const streakTex = canvasTexture('water-streaks', 64, 128, waterStreaks).clone();
    streakTex.wrapS = streakTex.wrapT = RepeatWrapping;
    streakTex.needsUpdate = true;
    const fallTex = streakTex.clone();
    fallTex.repeat.set(1, 2);
    fallTex.needsUpdate = true;
    const streaks = new MeshBasicMaterial({ map: streakTex, transparent: true, depthWrite: false, opacity: 0.5 });
    const fall = new MeshBasicMaterial({ map: fallTex, transparent: true, depthWrite: false, opacity: 0.8 });
    return {
      water: ribbonUV(curve, width / 2, 0.014),
      surface: ribbonUV(curve, width / 2 - 0.04, 0.02),
      banks: [ribbonUV(curve, 0.05, 0.03, width / 2 + 0.03), ribbonUV(curve, 0.05, 0.03, -width / 2 - 0.03)],
      streakTex,
      fallTex,
      streaks,
      fall,
      pond: new CircleGeometry(1, 28),
    };
  }, []);
  useEffect(
    () =>
      onNightMix((k) => {
        art.streaks.opacity = 0.5 - 0.22 * k;
        art.fall.opacity = 0.85 - 0.3 * k;
      }),
    [art],
  );
  useFrame((_, dt) => {
    if (!animate) return;
    const step = Math.min(dt, 0.05);
    art.streakTex.offset.y -= step * 0.35;
    art.fallTex.offset.y += step * 1.4;
  });
  const { bridge, pond } = s;
  const fallX = s.points[0][0];
  const fallZ = s.points[0][1] - 0.53;
  return (
    <group>
      <mesh geometry={art.water} material={material('water')} receiveShadow />
      <mesh geometry={art.surface} material={art.streaks} />
      {art.banks.map((g, i) => (
        <mesh key={i} geometry={g} material={material('wallCap')} receiveShadow />
      ))}
      {/* Pond near the front edge, with a couple of lily pads */}
      <mesh geometry={art.pond} material={material('water')} rotation={[-Math.PI / 2, 0, 0]} position={[pond.x, 0.016, pond.z]} scale={[pond.radius, pond.radius * 0.8, 1]} />
      <mesh geometry={art.pond} material={art.streaks} rotation={[-Math.PI / 2, 0, 0]} position={[pond.x, 0.022, pond.z]} scale={[pond.radius * 0.8, pond.radius * 0.62, 1]} />
      {(
        [
          [-0.3, 0.1],
          [0.25, -0.2],
        ] as const
      ).map(([dx, dz]) => (
        <Cylinder key={dx} position={[pond.x + dx, 0.03, pond.z + dz]} radius={0.12} height={0.01} m="leafB" shadow={false} />
      ))}
      {/* Waterfall off the terrace, and the spring pool above it */}
      <group position={[fallX, 0, fallZ]}>
        <mesh material={material('water')} position={[0, 0.3, 0.005]}>
          <planeGeometry args={[0.72, 0.6]} />
        </mesh>
        <mesh material={art.fall} position={[0, 0.3, 0.012]}>
          <planeGeometry args={[0.68, 0.6]} />
        </mesh>
        <Box position={[0, 0.605, -0.2]} size={[0.72, 0.02, 0.5]} m="water" shadow={false} />
      </group>
      <mesh geometry={art.pond} material={material('water')} rotation={[-Math.PI / 2, 0, 0]} position={[fallX + 0.55, 0.612, fallZ - 1.05]} scale={[0.75, 0.6, 1]} />
      {/* Timber footbridge — flat, so Omar walks across it */}
      <group position={[bridge.x, 0, bridge.z]} rotation={[0, bridge.angle, 0]}>
        <Box position={[0, 0.06, 0]} size={[bridge.length, 0.08, bridge.width]} m="timber" />
        {[-0.6, -0.2, 0.2, 0.6].map((x) => (
          <Box key={x} position={[x, 0.105, 0]} size={[0.02, 0.01, bridge.width]} m="bark" shadow={false} />
        ))}
        {[-1, 1].map((side) =>
          [-bridge.length / 2 + 0.06, 0, bridge.length / 2 - 0.06].map((x) => (
            <Box key={`${side}${x}`} position={[x, 0.3, (side * bridge.width) / 2]} size={[0.06, 0.42, 0.06]} m="graphite" />
          )),
        )}
        {[-1, 1].map((side) => (
          <Box key={side} position={[0, 0.5, (side * bridge.width) / 2]} size={[bridge.length, 0.05, 0.05]} m="timber" />
        ))}
      </group>
    </group>
  );
}

/* ─────────────── Server yard on the terrace (neutral engineering props) ─────────────── */

function ServerYard({ animate }: { animate: boolean }) {
  const t = terraces[terraces.length - 1];
  const y = t.h;
  return (
    <group position={[0, y, 0]}>
      {[8.1, 8.8].map((x, i) => (
        <group key={x} position={[x, 0, -5.15]}>
          <Box position={[0, 0.55, 0]} size={[0.6, 1.1, 0.5]} m="graphite" />
          {[0, 1, 2, 3].map((r) => (
            <Blink key={r} animate={animate} period={0.7 + r * 0.31} phase={i * 0.4 + r * 0.2} duty={0.7}>
              <Led position={[0.18, 0.3 + r * 0.2, 0.255]} m={r % 2 ? 'ledGreen' : 'ledCyan'} size={0.045} />
            </Blink>
          ))}
          <Box position={[-0.1, 0.62, 0.255]} size={[0.26, 0.6, 0.01]} m="steel" />
        </group>
      ))}
      <group position={[6.6, 0, -4.9]}>
        <Box position={[0, 0.28, 0]} size={[0.85, 0.56, 0.85]} m="steel" />
        <Cylinder position={[0, 0.57, 0]} radius={0.32} height={0.03} m="graphite" />
        <Spin animate={animate} speed={4} position={[0, 0.6, 0]}>
          <Box size={[0.56, 0.015, 0.08]} m="cream" />
          <Box size={[0.08, 0.015, 0.56]} m="cream" />
        </Spin>
      </group>
      {/* Conduit back to the workshop */}
      <Box position={[5.85, 0.04, -4.1]} size={[1.1, 0.06, 0.12]} m="graphite" />
      <Box position={[5.85, 0.08, -4.1]} size={[1.1, 0.012, 0.035]} m="trace" shadow={false} />
    </group>
  );
}

/* ─────────────── Lamps and light pools ─────────────── */

const poolGeometry = new PlaneGeometry(1, 1);

/** Warm light pools on the ground. `interior` pools also show (faintly) by day. */
export function LightPools({ items, interior = false }: { items: Placement[]; interior?: boolean }) {
  const mat = useMemo(
    () =>
      new MeshBasicMaterial({
        map: canvasTexture('glow-disc', 128, 128, glowDisc),
        color: '#ffb466',
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        opacity: 0,
      }),
    [],
  );
  useEffect(
    () =>
      onNightMix((k) => {
        mat.opacity = interior ? 0.16 + 0.5 * k : 0.62 * k;
        mat.visible = mat.opacity > 0.01;
      }),
    [mat, interior],
  );
  return <Instances geometry={poolGeometry} material={mat} items={items} receiveShadow={false} renderOrder={2} />;
}

function Lamps() {
  const { bases, posts, heads, bulbs, pools } = useMemo(() => {
    const spots: [number, number][] = [...pathLamps()];
    if (stream) {
      const { bridge } = stream;
      spots.push([bridge.x - bridge.length / 2 - 0.2, bridge.z - bridge.width / 2 - 0.2]);
      spots.push([bridge.x + bridge.length / 2 + 0.2, bridge.z + bridge.width / 2 + 0.2]);
    }
    const H = 1.25;
    const bases: Placement[] = [];
    const posts: Placement[] = [];
    const heads: Placement[] = [];
    const bulbs: Placement[] = [];
    const pools: Placement[] = [];
    for (const [x, z] of spots) {
      const y = groundHeight(x, z);
      bases.push({ p: [x, y + 0.04, z], s: [0.11, 0.08, 0.11] });
      posts.push({ p: [x, y + H / 2, z], s: [0.026, H, 0.026] });
      heads.push({ p: [x, y + H + 0.02, z], s: [0.2, 0.05, 0.2] });
      bulbs.push({ p: [x, y + H - 0.07, z], s: [0.13, 0.13, 0.13] });
      pools.push({ p: [x, y + 0.045, z], s: [2.2, 2.2, 1], r: [-Math.PI / 2, 0, 0] });
    }
    return { bases, posts, heads, bulbs, pools };
  }, []);
  return (
    <group>
      <Instances geometry={unitCylinder} material={material('graphite')} items={bases} />
      <Instances geometry={unitCylinder} material={material('graphite')} items={posts} castShadow />
      <Instances geometry={unitBox} material={material('graphite')} items={heads} />
      <Instances geometry={unitBox} material={material('lampBulb')} items={bulbs} receiveShadow={false} />
      <LightPools items={pools} />
    </group>
  );
}

export default function Landscape({ animate }: { animate: boolean }) {
  return (
    <group>
      <Terraces />
      <Greenery />
      {stream && <Water animate={animate} />}
      {!features.aiLab && <ServerYard animate={animate} />}
      <Lamps />
    </group>
  );
}

