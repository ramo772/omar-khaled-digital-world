/* oxlint-disable react/react-compiler -- Touch events update the shared movement ref consumed by the imperative Three.js frame loop. */
import type { PointerEvent, RefObject } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import type { Controls } from '@/src/world/character/Controller';

const pads = [
  { x: 0, z: -1, label: 'Move up', Icon: ArrowUp, area: 'up' },
  { x: -1, z: 0, label: 'Move left', Icon: ArrowLeft, area: 'left' },
  { x: 0, z: 1, label: 'Move down', Icon: ArrowDown, area: 'down' },
  { x: 1, z: 0, label: 'Move right', Icon: ArrowRight, area: 'right' },
] as const;

/** On-screen D-pad for touch devices. Tapping the ground also walks there. */
export default function TouchControls({ controls }: { controls: RefObject<Controls> }) {
  const reset = () => {
    controls.current.touch = { x: 0, z: 0 };
  };
  const start = (e: PointerEvent<HTMLButtonElement>, x: number, z: number) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    controls.current.touch = { x, z };
  };
  return (
    <fieldset className="touch-controls">
      <legend className="sr-only">Movement controls</legend>
      {pads.map(({ x, z, label, Icon, area }) => (
        <button
          key={area}
          type="button"
          aria-label={label}
          className={`pad pad-${area}`}
          onPointerDown={(e) => start(e, x, z)}
          onPointerUp={reset}
          onPointerCancel={reset}
          onLostPointerCapture={reset}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Icon aria-hidden="true" size={18} />
        </button>
      ))}
    </fieldset>
  );
}
