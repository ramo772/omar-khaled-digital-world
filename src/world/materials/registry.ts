import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  type Texture,
} from 'three';
import { lighting, palette, type PaletteKey } from '@/src/theme/world-tokens';

/**
 * One shared material per palette key and one shared unit geometry per shape.
 * Hundreds of meshes reuse a few dozen GPU programs/buffers, and the theme
 * switch only re-tints these objects in place (no scene duplication).
 */
const materials = new Map<string, { material: MeshStandardMaterial; key: PaletteKey }>();
const textured = new Map<string, { material: MeshStandardMaterial; glow: [number, number] }>();
const a = new Color();
const b = new Color();
let nightMix = 0;

const lerp = (x: number, y: number, k: number) => x + (y - x) * k;

function tint(m: MeshStandardMaterial, key: PaletteKey, k: number) {
  const t = palette[key];
  m.color.copy(a.set(t.day)).lerp(b.set(t.night), k);
  if ('glow' in t) m.emissiveIntensity = lerp(t.glow[0], t.glow[1], k);
}

/** Shared, theme-tinted material for a palette key (optionally with a detail map). */
export function material(key: PaletteKey, map?: Texture): MeshStandardMaterial {
  const id = map ? `${key}:${map.uuid}` : key;
  let entry = materials.get(id);
  if (!entry) {
    const t: (typeof palette)[PaletteKey] = palette[key];
    const m = new MeshStandardMaterial({
      map: map ?? null,
      roughness: 'roughness' in t ? t.roughness : 0.85,
      metalness: 'metalness' in t ? t.metalness : 0,
    });
    if ('emissive' in t) m.emissive.set(t.emissive);
    tint(m, key, nightMix);
    entry = { material: m, key };
    materials.set(id, entry);
  }
  return entry.material;
}

export type Glow = 'screen' | 'sign';
const glows: Record<Glow, [number, number]> = {
  // Screens are always on and read brighter after sunset.
  screen: [lighting.day.screen, lighting.night.screen],
  // Painted signs are unlit by day and softly backlit at night.
  sign: [0, 0.42],
};

/** Textured panels use their own canvas texture as their light source. */
export function texturedMaterial(texture: Texture, glow: Glow = 'screen'): MeshStandardMaterial {
  const id = `${texture.uuid}:${glow}`;
  let entry = textured.get(id);
  if (!entry) {
    const m = new MeshStandardMaterial({
      map: texture,
      emissiveMap: texture,
      emissive: '#ffffff',
      roughness: glow === 'screen' ? 0.45 : 0.9,
    });
    entry = { material: m, glow: glows[glow] };
    m.emissiveIntensity = lerp(entry.glow[0], entry.glow[1], nightMix);
    textured.set(id, entry);
  }
  return entry.material;
}

const listeners = new Set<(k: number) => void>();

/** For bespoke materials (light pools, water streaks): called with the current and every future night mix. */
export function onNightMix(listener: (k: number) => void) {
  listeners.add(listener);
  listener(nightMix);
  return () => {
    listeners.delete(listener);
  };
}

/** 0 = daylight, 1 = night. Called by the lighting rig while it tweens. */
export function setNightMix(k: number) {
  nightMix = k;
  materials.forEach(({ material: m, key }) => tint(m, key, k));
  textured.forEach(({ material: m, glow }) => (m.emissiveIntensity = lerp(glow[0], glow[1], k)));
  listeners.forEach((l) => l(k));
}

export const getNightMix = () => nightMix;

export const unitBox = new BoxGeometry(1, 1, 1);
export const unitPlane = new PlaneGeometry(1, 1);
export const unitCylinder = new CylinderGeometry(1, 1, 1, 16);
export const unitSphere = new SphereGeometry(1, 16, 12);
export const unitCone = new ConeGeometry(1, 1, 16);
export const unitRock = new IcosahedronGeometry(1, 0);
