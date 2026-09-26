import { ArrowRight, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Shown instead of the canvas when WebGL is unavailable, the renderer fails,
 * or the visitor picks text mode. A still picture of the same world (day or
 * night, matching the theme) keeps the identity; the portfolio stays one
 * click away. The pictures only download when this component is shown.
 */
export default function WorldFallback({
  reason,
  onQuickView,
  onRetry,
}: {
  reason: 'forced' | 'unsupported' | 'failed' | 'text';
  onQuickView: () => void;
  onRetry?: () => void;
}) {
  const message = {
    forced: 'The 3D world is switched off for this visit.',
    unsupported: 'This browser can’t run the 3D world — the portfolio doesn’t need it.',
    failed: 'The 3D world couldn’t start on this device — the portfolio doesn’t need it.',
    text: 'A quieter way to explore.',
  }[reason];
  return (
    <section className="world-fallback" aria-label="World preview">
      {/* Static export has no image optimiser: these are pre-sized WebP stills, lazy and theme-gated. */}
      <div className="fallback-art" aria-hidden="true">
        {/* oxlint-disable-next-line nextjs/no-img-element */}
        <img className="fallback-day" src="/fallback/world-day.webp" alt="" width={1200} height={760} loading="lazy" decoding="async" />
        {/* oxlint-disable-next-line nextjs/no-img-element */}
        <img className="fallback-night" src="/fallback/world-night.webp" alt="" width={1200} height={760} loading="lazy" decoding="async" />
      </div>
      <div className="fallback-copy">
        <p>{message}</p>
        <div className="fallback-actions">
          <Button onClick={onQuickView}>
            <Grid2X2 aria-hidden="true" /> Open Quick View
          </Button>
          <a className="text-link" href="#readable-portfolio">
            Read the full portfolio <ArrowRight size={14} aria-hidden="true" />
          </a>
          {onRetry && (
            <Button variant="ghost" onClick={onRetry}>
              Back to the 3D world
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
