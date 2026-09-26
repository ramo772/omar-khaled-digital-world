import { ArrowRight, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { identity } from '@/src/content/portfolio';
import WorkShelf from './WorkShelf';

/** The first ten seconds: who, what, where, and two obvious next steps. */
export default function Intro({
  entered,
  canExplore,
  onEnter,
  onQuickView,
  onProject,
}: {
  entered: boolean;
  canExplore: boolean;
  onEnter: () => void;
  onQuickView: () => void;
  onProject: (id: string) => void;
}) {
  return (
    <section className={`intro ${entered ? 'is-compact' : ''}`} aria-labelledby="intro-name">
      <p className="eyebrow">
        <span className="rule" aria-hidden="true" /> {identity.name.split(' ')[0]}’s small digital engineering world
      </p>
      <h1 id="intro-name">{identity.name}</h1>
      <p className="intro-role">
        {identity.currentRole} <span aria-hidden="true">·</span> <em>{identity.focus}</em>
      </p>
      <p className="now-chip">
        <span className="live-dot" aria-hidden="true" />
        Now at {identity.shortOrganization}, building {identity.currentProject} — {identity.currentProjectNote}
      </p>
      <p className="intro-copy">
        {identity.pitch} Currently exploring {identity.exploring}.
      </p>
      {!entered && (
        <div className="intro-actions">
          <Button className="cta-primary" onClick={onQuickView}>
            <Grid2X2 aria-hidden="true" /> Quick View <span className="cta-note">60-second profile</span>
          </Button>
          {canExplore && (
            <Button variant="outline" className="cta-secondary" onClick={onEnter}>
              Explore the world <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
      {!entered && <WorkShelf className="shelf-inline" onOpen={onProject} />}
      {!entered && canExplore && <p className="intro-hint">Or click any place in the world — every stop is also in the menu below.</p>}
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
