'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useRef, type RefObject } from 'react';
import { PCFShadowMap } from 'three';
import { identity } from '@/src/content/portfolio';
import { destinations, type DestinationId } from '@/src/data/world-map';
import type { Point } from '@/src/lib/movement';
import type { ResolvedTheme } from '@/src/theme/theme';
import Island from './environment/Island';
import Paths from './environment/Paths';
import Infrastructure from './environment/Infrastructure';
import Landscape from './environment/Landscape';
import { features } from '@/src/config/features';
import Lighting from './environment/Lighting';
import AboutDesk from './locations/AboutDesk';
import CareerTrail from './locations/CareerTrail';
import ProjectWorkshop from './locations/ProjectWorkshop';
import AILab from './locations/AILab';
import SkillsBench from './locations/SkillsBench';
import NextStation from './locations/NextStation';
import Landmark from './interaction/Landmark';
import Controller, { type Controls } from './character/Controller';
import CameraRig from './camera/CameraRig';

function QualityMonitor({ onSlow }: { onSlow: () => void }) {
  const sample = useRef({ time: 0, frames: 0, done: false });
  useFrame((_, dt) => {
    const s = sample.current;
    if (s.done) return;
    s.time += Math.min(dt, 0.15);
    s.frames++;
    // Judge sustained performance (4s of frames), not a single hitch.
    if (s.frames >= 240) {
      if (s.time / s.frames > 1 / 28) onSlow();
      s.done = true;
    }
  });
  return null;
}

/** Reports real loading milestones: renderer created, then the first frames drawn. */
function ReadyProbe({ onStage }: { onStage?: (s: 'scene' | 'ready') => void }) {
  const frames = useRef(0);
  useEffect(() => onStage?.('scene'), [onStage]);
  useFrame(() => {
    if (frames.current > 2) return;
    frames.current++;
    if (frames.current === 3) onStage?.('ready');
  });
  return null;
}

function ContextGuard({ onLost }: { onLost: () => void }) {
  const element = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const onContextLost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    element.addEventListener('webglcontextlost', onContextLost);
    return () => element.removeEventListener('webglcontextlost', onContextLost);
  }, [element, onLost]);
  return null;
}

export interface WorldProps {
  onSelect: (id: DestinationId) => void;
  onProject: (id: string) => void;
  active: boolean;
  paused: boolean;
  follow: boolean;
  labels: boolean;
  theme: ResolvedTheme;
  reducedMotion: boolean;
  lowQuality: boolean;
  zoom: number;
  controls: RefObject<Controls>;
  onNear: (id: DestinationId | null) => void;
  onPosition: (p: Point) => void;
  onSlow: () => void;
  onLost: () => void;
  /** Loading milestones for the intro loader. */
  onStage?: (s: 'scene' | 'ready') => void;
  /** True while the intro loader is still on screen (camera waits, slightly pulled back). */
  intro?: boolean;
}

/** Composition only: every place, the character and the camera are separate modules. */
export default function World({
  onSelect,
  onProject,
  active,
  paused,
  follow,
  labels,
  theme,
  reducedMotion,
  lowQuality,
  zoom,
  controls,
  onNear,
  onPosition,
  onSlow,
  onLost,
  onStage,
  intro = false,
}: WorldProps) {
  const animate = !reducedMotion && !paused;
  return (
    <Canvas
      orthographic
      camera={{ position: [15, 19, 24], zoom: 30, near: 0.1, far: 160 }}
      shadows={lowQuality ? false : { type: PCFShadowMap }}
      dpr={lowQuality ? 1 : [1, 1.5]}
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: !lowQuality, alpha: true, powerPreference: 'high-performance' }}
    >
      <CameraRig zoom={zoom} follow={follow} controls={controls} reducedMotion={reducedMotion} intro={intro} />
      <ReadyProbe onStage={onStage} />
      <QualityMonitor onSlow={onSlow} />
      <ContextGuard onLost={onLost} />
      <Lighting theme={theme} reducedMotion={reducedMotion} shadows={!lowQuality} />
      <Island name={identity.name.split(' ')[0]} />
      <Landscape animate={animate} />
      <Paths animate={animate} />
      <Infrastructure animate={animate} />
      <Landmark onActivate={() => onSelect('about')}>
        <AboutDesk />
      </Landmark>
      <Landmark onActivate={() => onSelect('experience')}>
        <CareerTrail animate={animate} />
      </Landmark>
      <ProjectWorkshop animate={animate} onOpen={() => onSelect('projects')} onProject={onProject} />
      {features.aiLab && (
        <Landmark onActivate={() => onSelect('ai')}>
          <AILab animate={animate} />
        </Landmark>
      )}
      <Landmark onActivate={() => onSelect('skills')}>
        <SkillsBench />
      </Landmark>
      <Landmark onActivate={() => onSelect('contact')}>
        <NextStation animate={animate} />
      </Landmark>
      {/* Invisible walk-target plane: click/tap the ground to walk there */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={(e) => {
          if (active && e.delta < 8) {
            e.stopPropagation();
            // oxlint-disable-next-line react/react-compiler -- Pointer input is passed to the imperative frame controller through a mutable ref.
            controls.current.target = { x: e.point.x, z: e.point.z };
          }
        }}
      >
        <planeGeometry args={[21, 14]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Controller active={active} reducedMotion={reducedMotion} controls={controls} onNear={onNear} onPosition={onPosition} />
      {labels &&
        destinations.map((place) => (
          <Html key={place.id} position={place.position} center zIndexRange={[10, 0]}>
            <button
              type="button"
              className={`world-label label-${place.id}`}
              aria-label={`Open ${place.label}: ${place.hint}`}
              onClick={() => onSelect(place.id)}
            >
              <span className="world-label-index" aria-hidden="true">
                {place.index}
              </span>
              {place.label}
            </button>
          </Html>
        ))}
    </Canvas>
  );
}
