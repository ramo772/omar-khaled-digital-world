import type { MutableRefObject, PointerEvent } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Controls } from '@/src/world/character/Controller';
export default function TouchControls({
  controls,
}: {
  controls: MutableRefObject<Controls>;
}) {
  const reset = () => {
    controls.current.touch = { x: 0, z: 0 };
  };
  const start = (e: PointerEvent<HTMLButtonElement>, x: number, z: number) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    controls.current.touch = { x, z };
  };
  return (
    <div className="touch-controls" aria-label="Movement controls">
      {[
        [0, -1, 'Move forward', ArrowUp],
        [-1, 0, 'Move left', ArrowLeft],
        [0, 1, 'Move backward', ArrowDown],
        [1, 0, 'Move right', ArrowRight],
      ].map(([x, z, label, Icon], i) => {
        const Glyph = Icon as typeof ArrowUp;
        return (
          <Button
            key={i}
            variant="outline"
            aria-label={label as string}
            className={`direction direction-${i}`}
            onPointerDown={(e) => start(e, x as number, z as number)}
            onPointerUp={reset}
            onPointerCancel={reset}
            onLostPointerCapture={reset}
          >
            <Glyph />
          </Button>
        );
      })}
    </div>
  );
}
