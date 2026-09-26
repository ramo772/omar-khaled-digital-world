/* oxlint-disable react/react-compiler -- The per-frame animation mutates Three.js transforms and shared materials by design. */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, type Group } from 'three';
import { RoundedBox } from '@react-three/drei';
import {
  unitBox,
  unitCylinder,
  unitSphere,
  getNightMix,
} from '../../materials/registry';
import { canvasTexture } from '../../materials/canvas';
import type { AvatarModelProps } from '../avatar-contract';
import { omarLook } from '../avatar-look';
import OmarHead from './OmarHead';

/**
 * A stylised miniature of Omar, modelled from his photo: light-medium warm tan
 * skin, dense black curls, full black beard, black softly-rectangular glasses,
 * off-white tee with thin dark stripes, dark trousers, white sneakers, a
 * smartwatch. Original geometry — not a copy of any toy or game character.
 * The head is slightly oversized so the face reads at gameplay distance.
 *
 * Y-up, feet at y = 0, facing +Z. Omar's right side is -X.
 */
const tones = [
  'skin',
  'skinShade',
  'hair',
  'beard',
  'frames',
  'eyes',
  'teeth',
  'lip',
  'trousers',
  'shoe',
  'sole',
  'watch',
] as const;
const colors = Object.fromEntries(tones.map((t) => [t, omarLook[t]])) as Record<
  (typeof tones)[number],
  string
>;
type Tone = keyof typeof colors | 'shirt';

function useMaterials() {
  return useMemo(() => {
    const make = (c: string) =>
      new MeshStandardMaterial({
        color: c,
        roughness: 0.75,
        emissive: c,
        emissiveIntensity: 0,
      });
    const m = Object.fromEntries(
      Object.entries(colors).map(([k, c]) => [k, make(c)]),
    ) as Record<Tone, MeshStandardMaterial>;
    const knit = canvasTexture('omar-tshirt-v2', 96, 96, (g, w, h) => {
      g.fillStyle = omarLook.shirt;
      g.fillRect(0, 0, w, h);
      for (let y = 5, i = 0; y < h; y += 11, i++) {
        g.fillStyle = i % 3 === 1 ? omarLook.stripeB : omarLook.stripeA;
        g.fillRect(0, y, w, i % 3 === 1 ? 1.4 : 1.8);
      }
    });
    m.shirt = new MeshStandardMaterial({
      map: knit,
      roughness: 0.9,
      emissive: '#ffffff',
      emissiveMap: knit,
      emissiveIntensity: 0,
    });
    return m;
  }, []);
}

type V3 = [number, number, number];
function Part({
  p,
  s,
  m,
  r,
}: {
  p: V3;
  s: V3;
  m: MeshStandardMaterial;
  r?: V3;
}) {
  return (
    <mesh
      geometry={unitBox}
      material={m}
      position={p}
      scale={s}
      rotation={r}
      castShadow
    />
  );
}

export default function OmarFigure({
  motion,
  reducedMotion,
}: AvatarModelProps) {
  const mat = useMaterials();
  const body = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const head = useRef<Group>(null);
  const legs = [useRef<Group>(null), useRef<Group>(null)];
  const shoulders = [useRef<Group>(null), useRef<Group>(null)];
  const elbows = [useRef<Group>(null), useRef<Group>(null)];
  const eyes = useRef<Group>(null);
  const state = useRef({ phase: 0, speed: 0, cross: 0, wave: 0, night: -1 });

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const m = motion.current;
    const still = reducedMotion;

    // A faint self-illumination at night; the fill light in Controller keeps skin tone natural.
    const night = getNightMix();
    if (night !== s.night) {
      s.night = night;
      Object.entries(mat).forEach(([name, material]) => {
        const strength =
          name === 'skin' || name === 'skinShade'
            ? 0.14
            : name === 'shirt'
              ? 0.08
              : 0.055;
        material.emissiveIntensity = strength * night;
      });
    }

    s.speed += ((m?.moving ? 1 : 0) - s.speed) * Math.min(1, dt * 10);
    s.phase += dt * 9.5 * s.speed;
    // Idle sequence (never with reduced motion): turn to the visitor, a short
    // friendly wave, then arms crossed like the reference photo.
    const idle = m?.moving ? 0 : (m?.idle ?? 0);
    const wantWave = !still && idle > 1.4 && idle < 3.6 ? 1 : 0;
    const wantCross = !still && idle > 3.8 ? 1 : 0;
    s.wave += (wantWave - s.wave) * Math.min(1, dt * 6);
    s.cross += (wantCross - s.cross) * Math.min(1, dt * 5);

    const swing = still ? 0 : Math.sin(s.phase) * s.speed;
    const t = clock.elapsedTime;
    if (body.current)
      body.current.position.y = still
        ? 0
        : Math.abs(Math.sin(s.phase)) * 0.045 * s.speed;
    if (torso.current) {
      torso.current.rotation.x = still ? 0 : 0.07 * s.speed;
      torso.current.scale.y = still
        ? 1
        : 1 + Math.sin(t * 2.1) * 0.01 * (1 - s.speed);
    }
    if (head.current) {
      head.current.rotation.y = still
        ? 0
        : Math.sin(t * 0.45) *
          0.22 *
          (1 - s.speed) *
          (1 - s.cross * 0.5) *
          (1 - s.wave);
      head.current.rotation.z = still ? 0 : 0.08 * s.wave;
    }
    // Blink every few seconds.
    if (eyes.current)
      eyes.current.scale.y = !still && t % 3.7 < 0.12 ? 0.15 : 1;
    legs.forEach((l, i) => {
      if (l.current) l.current.rotation.x = swing * 0.6 * (i ? -1 : 1);
    });
    const c = s.cross;
    const w = s.wave;
    const wag = Math.sin(t * 9) * 0.38;
    shoulders.forEach((sh, i) => {
      const side = i ? -1 : 1; // 0 = left (+x), 1 = right (-x)
      if (!sh.current) return;
      const waving = i === 1 ? w : 0;
      sh.current.rotation.x =
        (-swing * 0.55 * side * (1 - c) + -0.5 * c) * (1 - waving);
      sh.current.rotation.z =
        0.06 * side * (1 - c) * (1 - waving) + -2.45 * waving;
    });
    elbows.forEach((el, i) => {
      const side = i ? -1 : 1;
      if (!el.current) return;
      const waving = i === 1 ? w : 0;
      el.current.rotation.x = -0.25 * s.speed * (1 - c) * (1 - waving);
      el.current.rotation.y = 0.42 * side * c;
      el.current.rotation.z = (-Math.PI / 2) * side * c + (0.55 + wag) * waving;
    });
  });

  return (
    <group ref={body}>
      {/* Legs: dark trousers, clean white sneakers */}
      {[0.12, -0.12].map((x, i) => (
        <group key={x} ref={legs[i]} position={[x, 0.62, 0]}>
          <RoundedBox
            args={[0.2, 0.52, 0.23]}
            radius={0.04}
            smoothness={2}
            position={[0, -0.27, 0]}
            material={mat.trousers}
            castShadow
          />
          <RoundedBox
            args={[0.22, 0.11, 0.32]}
            radius={0.045}
            smoothness={2}
            position={[0, -0.56, 0.045]}
            material={mat.shoe}
            castShadow
          />
          <Part p={[0, -0.617, 0.045]} s={[0.225, 0.022, 0.325]} m={mat.sole} />
        </group>
      ))}
      <group ref={torso} position={[0, 0.62, 0]}>
        <RoundedBox
          args={[0.47, 0.15, 0.27]}
          radius={0.04}
          smoothness={2}
          position={[0, 0.03, 0]}
          material={mat.trousers}
          castShadow
        />
        {/* Relaxed striped tee (box UVs keep the stripes horizontal on every side) */}
        <Part p={[0, 0.34, 0]} s={[0.5, 0.52, 0.28]} m={mat.shirt} />
        <Part p={[0, 0.605, 0]} s={[0.36, 0.03, 0.22]} m={mat.shirt} />
        <mesh
          geometry={unitCylinder}
          material={mat.skin}
          position={[0, 0.64, 0]}
          scale={[0.075, 0.08, 0.07]}
        />
        {/* Arms: shoulder → elbow joints so the idle pose can cross them, like the photo */}
        {[0.31, -0.31].map((x, i) => (
          <group key={x} ref={shoulders[i]} position={[x, 0.55, 0]}>
            <Part p={[0, -0.11, 0]} s={[0.155, 0.24, 0.175]} m={mat.shirt} />
            <Part p={[0, -0.27, 0]} s={[0.115, 0.1, 0.125]} m={mat.skin} />
            <group ref={elbows[i]} position={[0, -0.3, 0]}>
              <RoundedBox
                args={[0.115, 0.24, 0.125]}
                radius={0.03}
                smoothness={2}
                position={[0, -0.12, 0]}
                material={mat.skin}
                castShadow
              />
              {/* Rounded toy-like hand */}
              <mesh
                geometry={unitSphere}
                material={mat.skin}
                position={[0, -0.29, 0.005]}
                scale={[0.07, 0.068, 0.072]}
                castShadow
              />
              {i === 0 && (
                <RoundedBox
                  args={[0.13, 0.05, 0.14]}
                  radius={0.015}
                  position={[0, -0.21, 0]}
                  material={mat.watch}
                />
              )}
            </group>
          </group>
        ))}
        {/* Head: see OmarHead.tsx */}
        <group ref={head} position={[0, 0.66, 0]}>
          <OmarHead mat={mat} eyes={eyes} />
        </group>
      </group>
    </group>
  );
}
