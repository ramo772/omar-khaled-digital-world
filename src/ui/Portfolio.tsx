'use client';
import {
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Sparkles,
  Grid2X2,
  Home,
  BriefcaseBusiness,
  Wrench,
  Radio,
  FlaskConical,
  Plus,
  Minus,
  RotateCcw,
  Leaf,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { destinations, spawn, type DestinationId } from '@/src/data/world-map';
import type { Controls } from '@/src/world/character/Controller';
import { usePreferences } from '@/src/hooks/usePreferences';
import WorldBoundary from './WorldBoundary';
import TouchControls from './TouchControls';
import AgentSimulation from './AgentSimulation';
const World = lazy(() => import('@/src/world/World'));
const icons = {
  about: Home,
  experience: BriefcaseBusiness,
  projects: Code2,
  ai: FlaskConical,
  skills: Wrench,
  contact: Radio,
};
export default function Portfolio() {
  const [ready, setReady] = useState(false),
    [available, setAvailable] = useState(true),
    [entered, setEntered] = useState(false);
  const [panel, setPanel] = useState<DestinationId | 'quick' | null>(null),
    [near, setNear] = useState<DestinationId | null>(null),
    [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: spawn[0], z: spawn[1] }),
    [textOnly, setTextOnly] = useState(false);
  const { reducedMotion, lowQuality, setLowQuality, visible } =
    usePreferences();
  const controls = useRef<Controls>({
    touch: { x: 0, z: 0 },
    target: null,
    jump: null,
    position: { x: spawn[0], z: spawn[1] },
  });
  const stage = useRef<HTMLDivElement>(null),
    lastFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    setReady(true);
    setAvailable(typeof WebGL2RenderingContext !== 'undefined');
  }, []);
  const show = useCallback((id: DestinationId | 'quick') => {
    lastFocus.current = document.activeElement as HTMLElement;
    if (id !== 'quick') controls.current.jump = id;
    setPanel(id);
  }, []);
  const close = () => {
    setPanel(null);
    requestAnimationFrame(() =>
      lastFocus.current?.focus({ preventScroll: true }),
    );
  };
  const fail = useCallback(() => {
    setAvailable(false);
  }, []);
  const slow = useCallback(() => setLowQuality(true), [setLowQuality]);
  const place = destinations.find((p) => p.id === panel),
    nearby = destinations.find((p) => p.id === near);
  const active = entered && !panel && visible && !textOnly;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        !active ||
        !near ||
        (e.target as HTMLElement)?.closest('button,a,input,textarea,select')
      )
        return;
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        e.preventDefault();
        show(near);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, near, show]);
  const enter = () => {
    setEntered(true);
    requestAnimationFrame(() => stage.current?.focus({ preventScroll: true }));
  };
  return (
    <main className={`portfolio ${entered ? 'is-entered' : ''}`}>
      <a className="skip-link" href="#readable-portfolio">
        Skip to readable portfolio
      </a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Omar Khaled home">
          <span className="monogram">
            ok<span>.</span>
          </span>
          <span>
            OMAR KHALED<small>SOFTWARE ENGINEER</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="phase-tag">
            <i /> WORLD IN PROGRESS · 01
          </span>
          <Button
            variant="outline"
            className="quick-button"
            onClick={() => show('quick')}
          >
            <Grid2X2 /> Quick view <ArrowUpRight />
          </Button>
        </div>
      </header>
      <div
        ref={stage}
        className="world-canvas"
        tabIndex={entered ? 0 : -1}
        role="region"
        aria-label="Interactive engineering world. Move with WASD or arrow keys. Click ground to walk. Press E near a landmark."
        data-position={`${position.x.toFixed(2)},${position.z.toFixed(2)}`}
      >
        {ready && available && !textOnly ? (
          <WorldBoundary onFallback={() => show('quick')}>
            <Suspense
              fallback={
                <div className="world-loading">
                  <span />
                  Assembling a little world…
                </div>
              }
            >
              <World
                onSelect={show}
                active={active}
                paused={!visible || !!panel}
                reducedMotion={reducedMotion}
                lowQuality={lowQuality}
                zoom={zoom}
                controls={controls}
                onNear={setNear}
                onPosition={setPosition}
                onSlow={slow}
                onLost={fail}
              />
            </Suspense>
          </WorldBoundary>
        ) : (
          ready && (
            <div className="fallback-message">
              <p>
                {textOnly
                  ? 'A quieter way to explore.'
                  : 'Your portfolio doesn’t need WebGL.'}
              </p>
              <Button onClick={() => show('quick')}>
                Open Quick View <ArrowRight />
              </Button>
              <a href="#readable-portfolio">Read the text version</a>
            </div>
          )
        )}
      </div>
      <section className="intro-copy">
        <p className="eyebrow">
          <span className="tiny-line" /> A SMALL DIGITAL WORLD
        </p>
        <h1>
          {entered ? (
            <>
              Make yourself
              <br />
              <em>at home.</em>
            </>
          ) : (
            <>
              Serious about building.
              <br />
              <em>
                Curious about
                <br />
                everything.
              </em>
            </>
          )}
        </h1>
        <p className="intro-description">
          I’m Omar, a software engineer.
          <br />
          Welcome to my little corner of the internet.
        </p>
        {!entered ? (
          <Button className="enter-button" onClick={enter}>
            Enter my world <ArrowRight />
          </Button>
        ) : (
          <div className="walk-hint">
            <p>
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
              <span> or arrow keys to walk</span>
            </p>
            <p>Click a path. Discover a place.</p>
            <Button
              variant="outline"
              className="near-button"
              disabled={!nearby}
              onClick={() => near && show(near)}
            >
              <kbd>E</kbd>
              {nearby ? `Explore ${nearby.label}` : 'Follow your curiosity'}
            </Button>
          </div>
        )}
        <p className="intro-note">A portfolio to explore, at your own pace.</p>
      </section>
      <div className="world-caption">
        <span className="live-dot" />{' '}
        {entered
          ? `POSITION ${position.x.toFixed(1)} / ${position.z.toFixed(1)}`
          : 'BUILT WITH CURIOSITY'}{' '}
        <span className="caption-rule" />{' '}
        {reducedMotion ? 'REDUCED MOTION' : 'EXPLORE FREELY'}
      </div>
      <aside className="lab-note">
        <Sparkles size={16} />
        <div>
          <span>CURRENTLY EXPLORING</span>
          <p>A little space for AI experiments.</p>
        </div>
      </aside>
      <div className="world-settings" aria-label="World settings">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Zoom in"
          disabled={zoom >= 1.2}
          onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}
        >
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Zoom out"
          disabled={zoom <= 0.8}
          onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
        >
          <Minus />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reset view and position"
          onClick={() => {
            setZoom(1);
            controls.current.jump = 'home';
            stage.current?.focus({ preventScroll: true });
          }}
        >
          <RotateCcw />
        </Button>
        <span />
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            lowQuality ? 'Enable full graphics' : 'Enable low graphics'
          }
          aria-pressed={lowQuality}
          onClick={() => setLowQuality(!lowQuality)}
        >
          <Leaf />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            textOnly ? 'Return to 3D world' : 'Switch to text-only mode'
          }
          aria-pressed={textOnly}
          onClick={() => {
            setTextOnly(!textOnly);
            if (!textOnly) show('quick');
          }}
        >
          <Grid2X2 />
        </Button>
        <span
          className="sound-off"
          title="Audio is off. Optional ambience is planned for a later phase."
        >
          <VolumeX size={15} />
          <span className="sr-only">Audio off</span>
        </span>
      </div>
      {entered && available && !textOnly && (
        <TouchControls controls={controls} />
      )}
      <nav className="destination-dock" aria-label="Quick portfolio navigation">
        {destinations.map((p) => {
          const Icon = icons[p.id];
          return (
            <Button
              key={p.id}
              variant="ghost"
              className={`dock-item ${p.id === 'projects' ? 'featured' : ''}`}
              onClick={() => show(p.id)}
            >
              <Icon size={18} />
              <span>{p.label}</span>
            </Button>
          );
        })}
      </nav>
      <footer className="world-footer">
        <span>© 2026 OMAR KHALED</span>
        <span>PHASE 1 · ORIGINAL WORLD FOUNDATION</span>
        <span>TAKE THE SCENIC ROUTE ↗</span>
      </footer>
      <Dialog
        open={!!panel}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent
          className={`portfolio-dialog ${panel === 'quick' ? 'quick-dialog' : ''}`}
        >
          {panel === 'quick' ? (
            <>
              <p className="eyebrow">NO WALKING REQUIRED</p>
              <DialogTitle>Omar Khaled</DialogTitle>
              <DialogDescription>
                Software Engineer · A small digital world for building and
                curiosity.
              </DialogDescription>
              <p className="content-notice">
                Foundation preview. Professional details await CV verification.
              </p>
              <nav className="quick-sections" aria-label="Quick View sections">
                {destinations.map((p) => (
                  <a key={p.id} href={`#quick-${p.id}`}>
                    {p.label}
                  </a>
                ))}
              </nav>
              <div className="quick-content">
                {destinations.map((p) => (
                  <section key={p.id} id={`quick-${p.id}`}>
                    <p className="eyebrow">{p.chapter}</p>
                    <h3>{p.label}</h3>
                    <p>{p.description}</p>
                  </section>
                ))}
              </div>
            </>
          ) : (
            place && (
              <>
                <p className="eyebrow">{place.chapter}</p>
                <DialogTitle>{place.title}</DialogTitle>
                <DialogDescription>{place.description}</DialogDescription>
                {place.id === 'ai' && <AgentSimulation />}
                <p className="content-notice">
                  {place.id === 'ai'
                    ? 'Currently exploring · Learning, not employment experience'
                    : 'Foundation preview · Awaiting verified CV content'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    close();
                    setEntered(true);
                    requestAnimationFrame(() =>
                      stage.current?.focus({ preventScroll: true }),
                    );
                  }}
                >
                  Continue exploring <ArrowRight />
                </Button>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
