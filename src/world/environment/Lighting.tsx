import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type {
  AmbientLight,
  Color,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  ShadowMaterial,
} from 'three';
import { Color as ThreeColor } from 'three';
import { lighting, type SceneLighting } from '@/src/theme/world-tokens';
import { features } from '@/src/config/features';
import type { ResolvedTheme } from '@/src/theme/theme';
import { setNightMix } from '../materials/registry';
import type { V3 } from './Primitives';

/**
 * Warm practical lights at the landmarks. Always mounted so switching theme
 * never recompiles shaders; `day` is the fraction kept on in daylight
 * (the workshop interior stays softly lit, like the reference).
 */
export const practicalLights: { position: V3; intensity: number; distance: number; day: number }[] = [
  { position: [-7.7, 1.9, 3.9], intensity: 7, distance: 5.5, day: 0 }, // About desk lamp
  { position: [-0.6, 2.6, -2.2], intensity: 11, distance: 7, day: 0.22 }, // Workshop, left bay
  { position: [2.8, 2.6, -2.2], intensity: 11, distance: 7, day: 0.22 }, // Workshop, right bay
  features.aiLab
    ? { position: [7.45, 2.4, -2.1], intensity: 9, distance: 6, day: 0 } // AI Lab core
    : { position: [-0.6, 2.2, 4.6], intensity: 7, distance: 5, day: 0 }, // Skills station
  { position: [7.4, 1.8, 4.6], intensity: 6, distance: 5, day: 0 }, // Next / contact
];

const c1 = new ThreeColor();
const c2 = new ThreeColor();
const mixColor = (target: Color, a: string, b: string, k: number) => target.copy(c1.set(a)).lerp(c2.set(b), k);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export default function Lighting({
  theme,
  reducedMotion,
  shadows,
}: {
  theme: ResolvedTheme;
  reducedMotion: boolean;
  shadows: boolean;
}) {
  const hemi = useRef<HemisphereLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const practical = useRef<(PointLight | null)[]>([]);
  const shadowPlane = useRef<ShadowMaterial>(null);
  const target = theme === 'dark' ? 1 : 0;
  const mix = useRef(target);
  const invalidate = useThree((s) => s.invalidate);

  const apply = (k: number) => {
    const d: SceneLighting = lighting.day;
    const n: SceneLighting = lighting.night;
    setNightMix(k);
    if (hemi.current) {
      mixColor(hemi.current.color, d.hemiSky, n.hemiSky, k);
      mixColor(hemi.current.groundColor, d.hemiGround, n.hemiGround, k);
      hemi.current.intensity = lerp(d.hemi, n.hemi, k);
    }
    if (ambient.current) {
      mixColor(ambient.current.color, d.ambientColor, n.ambientColor, k);
      ambient.current.intensity = lerp(d.ambient, n.ambient, k);
    }
    if (sun.current) {
      mixColor(sun.current.color, d.sunColor, n.sunColor, k);
      sun.current.intensity = lerp(d.sun, n.sun, k);
      sun.current.position.set(
        lerp(d.sunPosition[0], n.sunPosition[0], k),
        lerp(d.sunPosition[1], n.sunPosition[1], k),
        lerp(d.sunPosition[2], n.sunPosition[2], k),
      );
    }
    practical.current.forEach((l, i) => {
      const p = practicalLights[i];
      if (l) l.intensity = p.intensity * lerp(p.day, n.practical, k);
    });
    if (shadowPlane.current) shadowPlane.current.opacity = lerp(d.shadowOpacity, n.shadowOpacity, k);
  };

  // Apply the initial theme before the first frame (no tween on page load).
  useLayoutEffect(() => {
    apply(mix.current);
    // oxlint-disable-next-line react/react-compiler -- one-time imperative sync of Three.js light objects.
  }, []);

  // Kick a render when the theme changes, even while the frame loop is on demand.
  useLayoutEffect(() => {
    invalidate();
  }, [target, invalidate]);

  useFrame((_, dt) => {
    if (mix.current === target) return;
    const step = reducedMotion ? 1 : Math.min(dt, 0.05) / 0.65;
    mix.current =
      mix.current < target ? Math.min(target, mix.current + step) : Math.max(target, mix.current - step);
    apply(mix.current);
    invalidate();
  });

  return (
    <>
      <hemisphereLight ref={hemi} />
      <ambientLight ref={ambient} />
      <directionalLight
        ref={sun}
        castShadow={shadows}
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-far={60}
        shadow-normalBias={0.035}
      />
      {practicalLights.map((l, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            practical.current[i] = el;
          }}
          position={l.position}
          distance={l.distance}
          decay={1.6}
          color="#ffbf78"
          intensity={0}
        />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.73, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <shadowMaterial ref={shadowPlane} transparent opacity={0.12} />
      </mesh>
    </>
  );
}
