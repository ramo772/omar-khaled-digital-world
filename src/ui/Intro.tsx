import { ArrowRight, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { identity } from '@/src/content/portfolio';
import CurrentWork from './CurrentWork';

/** The first ten seconds: name, role, where Omar works now, two clear next steps. */
export default function Intro({
  entered,
  canExplore,
  onEnter,
  onQuickView,
}: {
  entered: boolean;
  canExplore: boolean;
  onEnter: () => void;
  onQuickView: () => void;
}) {
  return (
    <section className={`intro ${entered ? 'is-compact' : ''}`} aria-labelledby="intro-name">
      <h1 id="intro-name">{identity.name}</h1>
      <p className="intro-role">{identity.currentRole}</p>
      <CurrentWork />
      {!entered && (
        <div className="intro-actions">
          <Button className="cta-primary" onClick={onQuickView}>
            <Grid2X2 aria-hidden="true" /> Quick View
          </Button>
          {canExplore && (
            <Button variant="outline" className="cta-secondary" onClick={onEnter}>
              Explore the world <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
      {entered && (
        <>
          <p className="walk-hint hint-keys">
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> or arrows to walk · click the ground · <kbd>E</kbd> opens a place
          </p>
          <p className="walk-hint hint-touch">Tap the ground to walk, or use the arrows. Tap a label to open a place.</p>
        </>
      )}
    </section>
  );
}
