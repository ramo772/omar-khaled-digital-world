/* oxlint-disable react/react-compiler -- The per-frame animation mutates Three.js transforms and shared materials by design. */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, TorusGeometry, type Group } from 'three';
import { unitBox, unitSphere, getNightMix } from '../../materials/registry';
import { canvasTexture } from '../../materials/canvas';
import { tshirt } from '../../materials/painters';
import type { AvatarModelProps } from '../avatar-contract';

/**
 * A stylised, blocky miniature developer inspired by Omar's photo: dark curly
 * hair, full beard, round glasses, warm medium-brown skin, striped off-white
 * tee, dark trousers, white sneakers, a smartwatch. Original geometry — not a
 * copy of any toy or game character. Oversized head so the glasses and beard
 * still read at gameplay distance.
 *
 * Y-up, feet at y = 0, facing +Z. Omar's right side is -X.
 */
const colors = {
  skin: '#9e6a4e',
  skinShade: '#87573d',
  hair: '#1d1714',
  beard: '#241b17',
  frames: '#121212',
  eyes: '#17120f',
  teeth: '#f3ece2',
  trousers: '#27303d',
  shoe: '#efebe3',
  sole: '#3b3a38',
  watch: '#101010',
} as const;
type Tone = keyof typeof colors | 'shirt';

function useMaterials() {
  return useMemo(() => {
    const make = (c: string) => new MeshStandardMaterial({ color: c, roughness: 0.75, emissive: c, emissiveIntensity: 0 });
    const m = Object.fromEntries(Object.entries(colors).map(([k, c]) => [k, make(c)])) as Record<Tone, MeshStandardMaterial>;
    const knit = canvasTexture('omar-tshirt', 64, 64, tshirt);
    m.shirt = new MeshStandardMaterial({ map: knit, roughness: 0.9, emissive: '#ffffff', emissiveMap: knit, emissiveIntensity: 0 });
    return m;
  }, []);
}

type V3 = [number, number, number];
function Part({ p, s, m, r }: { p: V3; s: V3; m: MeshStandardMaterial; r?: V3 }) {
  return <mesh geometry={unitBox} material={m} position={p} scale={s} rotation={r} castShadow />;
}

/** Head measurements (a big, friendly block). */
const HW = 0.56;
const HH = 0.54;
const HD = 0.5;
const FACE = HD / 2;

/** Deterministic curl placement so the silhouette reads as curly, not as a helmet. */
const curls: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  let seed = 3;
  const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    out.push([Math.cos(a) * 0.22, HH + 0.02 + r() * 0.05, Math.sin(a) * 0.19 - 0.02, 0.085 + r() * 0.03]);
  }
  for (let i = 0; i < 6; i++) out.push([-0.15 + i * 0.06, HH + 0.07 + r() * 0.03, -0.02 + (r() - 0.5) * 0.14, 0.09]);
  for (let i = 0; i < 5; i++) out.push([-0.2 + i * 0.1, HH - 0.04, FACE - 0.03, 0.075]);
  for (let i = 0; i < 5; i++) out.push([-0.22 + i * 0.11, HH * 0.62, -FACE + 0.02, 0.085]);
  return out;
})();

export default function OmarFigure({ motion, reducedMotion }: AvatarModelProps) {
  const mat = useMaterials();
  const rim = useMemo(() => new TorusGeometry(0.088, 0.026, 8, 22), []);
  const body = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const legs = [useRef<Group>(null), useRef<Group>(null)];
  const shoulders = [useRef<Group>(null), useRef<Group>(null)];
  const elbows = [useRef<Group>(null), useRef<Group>(null)];
  const state = useRef({ phase: 0, speed: 0, cross: 0, night: -1 });

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const m = motion.current;
    const still = reducedMotion;

    // Keep Omar readable after sunset with a faint self-illumination.
    const night = getNightMix();
    if (night !== s.night) {
      s.night = night;
      Object.values(mat).forEach((x) => (x.emissiveIntensity = x === mat.shirt ? 0.16 * night : 0.2 * night));
    }

    s.speed += ((m?.moving ? 1 : 0) - s.speed) * Math.min(1, dt * 10);
    s.phase += dt * 9.5 * s.speed;
    const wantCross = !still && !m?.moving && (m?.idle ?? 0) > 2.2 ? 1 : 0;
    s.cross += (wantCross - s.cross) * Math.min(1, dt * 5);

    const swing = still ? 0 : Math.sin(s.phase) * s.speed;
    const t = clock.elapsedTime;
    if (body.current) body.current.position.y = still ? 0 : Math.abs(Math.sin(s.phase)) * 0.045 * s.speed;
    if (torso.current) {
      torso.current.rotation.x = still ? 0 : 0.07 * s.speed;
      torso.current.scale.y = still ? 1 : 1 + Math.sin(t * 2.1) * 0.01 * (1 - s.speed);
    }
    if (head.current) head.current.rotation.y = still ? 0 : Math.sin(t * 0.45) * 0.22 * (1 - s.speed) * (1 - s.cross * 0.5);
    legs.forEach((l, i) => {
      if (l.current) l.current.rotation.x = swing * 0.6 * (i ? -1 : 1);
    });
    const c = s.cross;
    shoulders.forEach((sh, i) => {
      const side = i ? -1 : 1; // 0 = left (+x), 1 = right (-x)
      if (sh.current) {
        sh.current.rotation.x = -swing * 0.55 * side * (1 - c) + -0.5 * c;
        sh.current.rotation.z = 0.06 * side * (1 - c);
      }
    });
    elbows.forEach((el, i) => {
      const side = i ? -1 : 1;
      if (el.current) {
        el.current.rotation.x = -0.25 * s.speed * (1 - c);
        el.current.rotation.y = 0.42 * side * c;
        el.current.rotation.z = (-Math.PI / 2) * side * c;
      }
    });
  });

  return (
    <group ref={body}>
      {/* Legs */}
      {[0.12, -0.12].map((x, i) => (
        <group key={x} ref={legs[i]} position={[x, 0.62, 0]}>
          <Part p={[0, -0.27, 0]} s={[0.19, 0.52, 0.22]} m={mat.trousers} />
          <Part p={[0, -0.565, 0.04]} s={[0.21, 0.1, 0.3]} m={mat.shoe} />
          <Part p={[0, -0.615, 0.04]} s={[0.22, 0.025, 0.31]} m={mat.sole} />
        </group>
      ))}
      <group ref={torso} position={[0, 0.62, 0]}>
        <Part p={[0, 0.03, 0]} s={[0.46, 0.14, 0.26]} m={mat.trousers} />
        <Part p={[0, 0.34, 0]} s={[0.5, 0.52, 0.28]} m={mat.shirt} />
        <Part p={[0, 0.62, 0]} s={[0.16, 0.08, 0.16]} m={mat.skin} />
        {/* Arms: shoulder → elbow joints so the idle pose can cross them, like the photo */}
        {[0.31, -0.31].map((x, i) => (
          <group key={x} ref={shoulders[i]} position={[x, 0.55, 0]}>
            <Part p={[0, -0.11, 0]} s={[0.15, 0.24, 0.17]} m={mat.shirt} />
            <Part p={[0, -0.27, 0]} s={[0.12, 0.1, 0.13]} m={mat.skin} />
            <group ref={elbows[i]} position={[0, -0.3, 0]}>
              <Part p={[0, -0.12, 0]} s={[0.12, 0.24, 0.13]} m={mat.skin} />
              <Part p={[0, -0.29, 0]} s={[0.12, 0.1, 0.12]} m={mat.skin} />
              {i === 0 && <Part p={[0, -0.21, 0]} s={[0.135, 0.05, 0.145]} m={mat.watch} />}
            </group>
          </group>
        ))}
        {/* Head */}
        <group ref={head} position={[0, 0.66, 0]}>
          <Part p={[0, HH / 2, 0]} s={[HW, HH, HD]} m={mat.skin} />
          {/* ears + nose */}
          {[1, -1].map((side) => (
            <Part key={side} p={[side * (HW / 2 + 0.02), HH * 0.48, 0]} s={[0.05, 0.11, 0.09]} m={mat.skinShade} />
          ))}
          <Part p={[0, HH * 0.42, FACE + 0.02]} s={[0.075, 0.1, 0.06]} m={mat.skinShade} />
          {/* eyes, brows */}
          {[1, -1].map((side) => (
            <group key={side}>
              <Part p={[side * 0.11, HH * 0.56, FACE + 0.005]} s={[0.05, 0.06, 0.02]} m={mat.eyes} />
              <Part p={[side * 0.11, HH * 0.72, FACE + 0.006]} s={[0.13, 0.035, 0.02]} m={mat.hair} />
            </group>
          ))}
          {/* round glasses: thick frames so they read from the camera */}
          {[1, -1].map((side) => (
            <mesh key={side} geometry={rim} material={mat.frames} position={[side * 0.11, HH * 0.56, FACE + 0.03]} />
          ))}
          <Part p={[0, HH * 0.58, FACE + 0.03]} s={[0.06, 0.022, 0.02]} m={mat.frames} />
          {[1, -1].map((side) => (
            <Part key={side} p={[side * (HW / 2 + 0.005), HH * 0.58, FACE / 2]} s={[0.02, 0.022, FACE]} m={mat.frames} />
          ))}
          {/* full beard, moustache and a big smile */}
          <Part p={[0, HH * 0.13, FACE - 0.005]} s={[HW - 0.02, HH * 0.28, 0.05]} m={mat.beard} />
          <Part p={[0, HH * 0.28, FACE + 0.015]} s={[0.22, 0.045, 0.04]} m={mat.beard} />
          <Part p={[0, HH * 0.2, FACE + 0.025]} s={[0.16, 0.04, 0.02]} m={mat.teeth} />
          {[1, -1].map((side) => (
            <Part key={side} p={[side * (HW / 2 - 0.02), HH * 0.3, 0.02]} s={[0.06, HH * 0.55, HD - 0.06]} m={mat.beard} />
          ))}
          <Part p={[0, 0.0, 0.03]} s={[HW - 0.04, 0.06, HD - 0.04]} m={mat.beard} />
          {(
            [
              [0, -0.01, FACE - 0.01],
              [0.12, 0.0, FACE - 0.03],
              [-0.12, 0.0, FACE - 0.03],
              [0.22, 0.05, FACE - 0.1],
              [-0.22, 0.05, FACE - 0.1],
            ] as [number, number, number][]
          ).map((p, i) => (
            <mesh key={i} geometry={unitSphere} material={mat.beard} position={p} scale={[0.06, 0.06, 0.06]} />
          ))}
          {/* hair: a cap plus a crown of curls */}
          <Part p={[0, HH - 0.02, -0.02]} s={[HW + 0.02, 0.12, HD]} m={mat.hair} />
          <Part p={[0, HH * 0.62, -FACE + 0.02]} s={[HW + 0.02, HH * 0.5, 0.08]} m={mat.hair} />
          {[1, -1].map((side) => (
            <Part key={side} p={[side * (HW / 2 + 0.005), HH * 0.8, -0.04]} s={[0.05, 0.16, HD - 0.12]} m={mat.hair} />
          ))}
          {curls.map(([x, y, z, r], i) => (
            <mesh key={i} geometry={unitSphere} material={mat.hair} position={[x, y, z]} scale={[r, r * 0.9, r]} castShadow />
          ))}
        </group>
      </group>
    </group>
  );
}
