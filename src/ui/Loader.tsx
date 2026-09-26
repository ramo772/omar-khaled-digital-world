import { identity } from '@/src/content/portfolio';
import OmarPortrait from './OmarPortrait';

export type LoadStage = 'boot' | 'hydrated' | 'code' | 'scene' | 'ready';

/** Each value is a real milestone, never a timer. */
export const stageProgress: Record<LoadStage, number> = { boot: 0.08, hydrated: 0.25, code: 0.62, scene: 0.85, ready: 1 };
const stageLabel: Record<LoadStage, string> = {
  boot: 'Loading…',
  hydrated: 'Loading the 3D engine…',
  code: 'Building the island…',
  scene: 'Switching on the lights…',
  ready: 'Welcome in',
};

/**
 * Omar welcoming the visitor. Rendered in the server HTML (so it shows from
 * the first paint, in the right theme) and removed as soon as the world is
 * ready. Hidden without JavaScript via a <noscript> style in the layout.
 */
export default function Loader({ stage, leaving }: { stage: LoadStage; leaving: boolean }) {
  const progress = stageProgress[stage];
  const R = 104;
  const C = 2 * Math.PI * R;
  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`}>
      <div className="loader-card">
        <div className="loader-ring">
          <svg viewBox="0 0 232 232" aria-hidden="true">
            <circle cx="116" cy="116" r={R} className="ring-track" />
            <circle
              cx="116"
              cy="116"
              r={R}
              className="ring-progress"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              transform="rotate(-90 116 116)"
            />
          </svg>
          <OmarPortrait size={176} className="loader-portrait" />
        </div>
        <p className="loader-hello">
          Hi, I’m {identity.name.split(' ')[0]} <span aria-hidden="true">👋</span>
        </p>
        <p className="loader-welcome">Welcome to my digital world</p>
        <p className="loader-stage" aria-live="polite">
          {stageLabel[stage]}
        </p>
      </div>
    </div>
  );
}
