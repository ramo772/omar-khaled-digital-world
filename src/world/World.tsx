'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useRef, type RefObject } from 'react';
import { PCFShadowMap } from 'three';
import Island from './environment/Island';
import {
  Workshop,
  AboutDesk,
  Journey,
  AILab,
  Toolbench,
  SignalStation,
} from './locations/Landmarks';
import Controller, { type Controls } from './character/Controller';
import CameraRig from './camera/CameraRig';
import { destinations, type DestinationId } from '@/src/data/world-map';
import type { Point } from '@/src/lib/movement';
function QualityMonitor({ onSlow }: { onSlow: () => void }) {
  const sample = useRef({ time: 0, frames: 0, done: false });
  useFrame((_, dt) => {
    const s = sample.current;
    if (s.done) return;
    s.time += Math.min(dt, 0.15);
    s.frames++;
    if (s.frames >= 240) {
      if (s.time / s.frames > 1 / 28) onSlow();
      s.done = true;
    }
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
  active: boolean;
  paused: boolean;
  reducedMotion: boolean;
  lowQuality: boolean;
  zoom: number;
  controls: RefObject<Controls>;
  onNear: (id: DestinationId | null) => void;
  onPosition: (p: Point) => void;
  onSlow: () => void;
  onLost: () => void;
}
export default function World({
  onSelect,
  active,
  paused,
  reducedMotion,
  lowQuality,
  zoom,
  controls,
  onNear,
  onPosition,
  onSlow,
  onLost,
}: WorldProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [15, 19, 24], zoom: 35, near: 0.1, far: 150 }}
      shadows={lowQuality ? false : { type: PCFShadowMap }}
      dpr={lowQuality ? 1 : [1, 1.5]}
      frameloop={paused ? 'never' : 'always'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <CameraRig zoom={zoom} />
      <QualityMonitor onSlow={onSlow} />
      <ContextGuard onLost={onLost} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#f6f0d6', '#92aaa1', 0.75]} />
      <directionalLight
        position={[-8, 16, 8]}
        intensity={2.15}
        castShadow={!lowQuality}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-normalBias={0.04}
      />
      <Island />
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('projects');
        }}
      >
        <Workshop />
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('about');
        }}
      >
        <AboutDesk />
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('experience');
        }}
      >
        <Journey />
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('ai');
        }}
      >
        <AILab animate={!reducedMotion && !paused} />
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('skills');
        }}
      >
        <Toolbench />
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect('contact');
        }}
      >
        <SignalStation />
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.018, 0]}
        onClick={(e) => {
          if (active && e.delta < 8) {
            e.stopPropagation();
            // oxlint-disable-next-line react/react-compiler -- Pointer input is passed to the imperative frame controller through a mutable ref.
            controls.current.target = { x: e.point.x, z: e.point.z };
          }
        }}
      >
        <planeGeometry args={[19, 13]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Controller
        active={active}
        reducedMotion={reducedMotion}
        controls={controls}
        onNear={onNear}
        onPosition={onPosition}
      />
      {destinations.map((place) => (
        <Html
          key={place.id}
          position={place.position}
          center
          zIndexRange={[10, 0]}
        >
          <button
            className={`world-label label-${place.id}`}
            aria-label={`Explore ${place.label}`}
            onClick={() => onSelect(place.id)}
          >
            <span style={{ background: place.color }} />
            {place.label}
            <b>↗</b>
          </button>
        </Html>
      ))}
    </Canvas>
  );
}
