'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The named world region is an intentional keyboard movement surface, with a full semantic text alternative. */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Grid2X2 } from 'lucide-react';
import { identity } from '@/src/content/portfolio';
import { destinationById, spawn, type DestinationId } from '@/src/data/world-map';
import type { Controls } from '@/src/world/character/Controller';
import { usePreferences } from '@/src/hooks/usePreferences';
import { useTheme } from '@/src/theme/ThemeProvider';
import { detectWebGL } from '@/src/lib/webgl';
import type { ProfileSectionId } from './profile/Profile';
import WorldBoundary from './WorldBoundary';
import WorldFallback from './WorldFallback';
import TouchControls from './TouchControls';
import ThemeToggle from './ThemeToggle';
import Intro from './Intro';
import Dock from './Dock';
import WorkShelf from './WorkShelf';
import WorldSettings from './WorldSettings';
import QuickView from './panels/QuickView';
import PlacePanel from './panels/PlacePanel';

const World = lazy(() => import('@/src/world/World'));

type Panel = { kind: 'place'; id: DestinationId; project?: string } | { kind: 'quick'; section?: ProfileSectionId } | null;
type WorldStatus = 'pending' | 'ok' | 'forced' | 'unsupported' | 'failed';

export default function Portfolio() {
  const [status, setStatus] = useState<WorldStatus>('pending');
  const [entered, setEntered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [near, setNear] = useState<DestinationId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [follow, setFollow] = useState(true);
  const [textOnly, setTextOnly] = useState(false);
  const { reducedMotion, lowQuality, setLowQuality, visible } = usePreferences();
  const { resolved } = useTheme();
  const controls = useRef<Controls>({ touch: { x: 0, z: 0 }, target: null, jump: null, position: { x: spawn[0], z: spawn[1] } });
  const stage = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Capability detection after hydration keeps server and first client render identical.
    const webgl = detectWebGL();
    // oxlint-disable-next-line react/react-compiler -- one-time browser capability probe after hydration.
    setStatus(webgl.ok ? 'ok' : (webgl.reason ?? 'unsupported'));
  }, []);

  const worldOn = status === 'ok' && !textOnly;
  const active = worldOn && entered && !panel && visible;

  const openPlace = useCallback((id: DestinationId, project?: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    controls.current.jump = id;
    setPanel({ kind: 'place', id, project });
  }, []);
  const openProject = useCallback((id: string) => openPlace('projects', id), [openPlace]);
  const openQuick = useCallback((section?: ProfileSectionId) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setPanel({ kind: 'quick', section });
  }, []);
  const close = () => {
    setPanel(null);
    requestAnimationFrame(() => lastFocus.current?.focus({ preventScroll: true }));
  };
  const focusWorld = () => requestAnimationFrame(() => stage.current?.focus({ preventScroll: true }));
  const enter = () => {
    setEntered(true);
    setFollow(true);
    focusWorld();
  };
  const onWorldError = useCallback(() => setStatus('failed'), []);
  // Exposed for tests/debugging without re-rendering React on every step.
  const onPosition = useCallback((p: { x: number; z: number }) => {
    if (stage.current) stage.current.dataset.position = `${p.x.toFixed(2)},${p.z.toFixed(2)}`;
  }, []);
  const slow = useCallback(() => setLowQuality(true), [setLowQuality]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!active || !near || (e.target as HTMLElement)?.closest('button,a,input,textarea,select')) return;
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        e.preventDefault();
        openPlace(near);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, near, openPlace]);

  const fallbackReason = textOnly ? 'text' : status === 'ok' || status === 'pending' ? null : status;
  const nearby = near ? destinationById[near] : null;

  return (
    <div className={`stage ${entered && worldOn ? 'is-entered' : ''} ${worldOn ? 'has-world' : 'no-world'}`}>
      <a className="skip-link" href="#readable-portfolio">
        Skip to the readable portfolio
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${identity.name} — home`}>
          <span className="monogram" aria-hidden="true">
            ok<span>.</span>
          </span>
          <span className="wordmark-text">
            {identity.name}
            <small>{identity.headline}</small>
          </span>
        </a>
        <div className="header-actions">
          <ThemeToggle />
          <button type="button" className="quick-button" onClick={() => openQuick()}>
            <Grid2X2 aria-hidden="true" size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </header>

      <Intro
        entered={entered && worldOn}
        canExplore={worldOn}
        onEnter={enter}
        onQuickView={() => openQuick()}
        onProject={openProject}
      />
      {!(entered && worldOn) && <WorkShelf className="shelf-floating" onOpen={openProject} />}

      <section
        ref={stage}
        id="top"
        className="world-canvas"
        tabIndex={active ? 0 : -1}
        aria-label="Interactive 3D world. Move with W A S D or the arrow keys, click the ground to walk, press E near a place to open it. Everything here is also in Quick View."
      >
        {worldOn ? (
          <WorldBoundary onError={onWorldError}>
            <Suspense
              fallback={
                <div className="world-loading" aria-live="polite">
                  <span aria-hidden="true" /> Assembling the workshop…
                </div>
              }
            >
              <World
                onSelect={openPlace}
                onProject={openProject}
                active={active}
                paused={!visible || !!panel}
                follow={entered && follow}
                labels={!panel}
                theme={resolved}
                reducedMotion={reducedMotion}
                lowQuality={lowQuality}
                zoom={zoom}
                controls={controls}
                onNear={setNear}
                onPosition={onPosition}
                onSlow={slow}
                onLost={onWorldError}
              />
            </Suspense>
          </WorldBoundary>
        ) : (
          fallbackReason && (
            <WorldFallback
              reason={fallbackReason}
              onQuickView={() => openQuick()}
              onRetry={textOnly ? () => setTextOnly(false) : undefined}
            />
          )
        )}
      </section>

      {active && nearby && (
        <div className="near-prompt" aria-live="polite">
          <button type="button" onClick={() => openPlace(nearby.id)}>
            Open {nearby.label}
          </button>
          <span className="near-key">
            or press <kbd>E</kbd>
          </span>
        </div>
      )}

      {status !== 'pending' && (
        <WorldSettings
          zoom={zoom}
          follow={follow}
          lowQuality={lowQuality}
          textOnly={textOnly || !worldOn}
          entered={entered && worldOn}
          onZoom={setZoom}
          onFollow={setFollow}
          onReset={() => {
            setZoom(1);
            setFollow(entered);
            controls.current.jump = 'home';
            if (entered) focusWorld();
          }}
          onQuality={setLowQuality}
          onTextOnly={(t) => {
            setTextOnly(t);
            if (!t) setStatus(detectWebGL().ok ? 'ok' : 'unsupported');
          }}
        />
      )}

      {active && <TouchControls controls={controls} />}

      <Dock current={active ? near : null} onSelect={(id) => openPlace(id)} />

      <QuickView open={panel?.kind === 'quick'} section={panel?.kind === 'quick' ? panel.section : undefined} onClose={close} />
      <PlacePanel
        place={panel?.kind === 'place' ? panel.id : null}
        project={panel?.kind === 'place' ? panel.project : undefined}
        reducedMotion={reducedMotion}
        onClose={close}
        onContinue={() => {
          setPanel(null);
          if (worldOn) {
            setEntered(true);
            focusWorld();
          }
        }}
        onQuickView={() => setPanel({ kind: 'quick', section: panel?.kind === 'place' ? sectionFor(panel.id) : undefined })}
      />
    </div>
  );
}

function sectionFor(id: DestinationId): ProfileSectionId {
  return id === 'contact' ? 'contact' : id;
}
