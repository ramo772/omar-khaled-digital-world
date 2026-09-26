import { identity } from '@/src/content/portfolio';

/**
 * "Currently working at VOIS, TOBi UK" with the VOIS and TOBi marks.
 * The VOIS wordmark sits on a small white chip so its dark purple end stays
 * legible on the night theme; neither mark is recoloured or distorted.
 */
export default function CurrentWork({ className = '' }: { className?: string }) {
  return (
    <p className={`current-work ${className}`}>
      <span className="brand-marks" aria-hidden="true">
        <span className="brand-chip">
          {/* oxlint-disable-next-line nextjs/no-img-element -- tiny static brand marks; no image optimiser in a static export */}
          <img src="/brand/vois.png" alt="" width={140} height={48} decoding="async" />
        </span>
        {/* oxlint-disable-next-line nextjs/no-img-element */}
        <img className="brand-tobi" src="/brand/tobi.png" alt="" width={96} height={96} decoding="async" />
      </span>
      <span className="live-dot" aria-hidden="true" />
      <span>{identity.status}</span>
    </p>
  );
}
