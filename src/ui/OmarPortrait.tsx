import { useId, useMemo } from 'react';
import {
  faceZ,
  headSpec as H,
  omarLook as c,
} from '@/src/world/character/avatar-look';
import {
  beardCurls,
  beardlineAt,
  hairCurls,
  hairlineAt,
} from '@/src/world/character/avatar-shape';

/**
 * Head-and-shoulders portrait of the SAME Omar as the 3D figure: it is drawn
 * from the same headSpec and the same hair/beard geometry (projected to a
 * front view), with the same colours. Pure SVG — no download. Blink and wave
 * are CSS animations, disabled under reduced motion.
 */
const S = 200; // px per head unit
const CX = 100;
const CY = 94; // head centre
const X = (x: number) => CX + x * S;
const Y = (y: number) => CY + (H.center - y) * S;
const f = (n: number) => n.toFixed(1);

/** Outline of a region of the (grown) face ellipse between two y-functions of x, as an SVG path. */
function band(
  grow: number,
  top: (x: number) => number,
  bottom: (x: number) => number,
  steps = 48,
) {
  const rx = H.rx * grow;
  const upper: string[] = [];
  const lower: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = -rx + (2 * rx * i) / steps;
    const t = top(x);
    const b = bottom(x);
    if (t <= b) continue;
    upper.push(`${f(X(x))} ${f(Y(t))}`);
    lower.unshift(`${f(X(x))} ${f(Y(b))}`);
  }
  return upper.length ? `M${upper.join(' L')} L${lower.join(' L')} Z` : '';
}

const ellipseY = (x: number, grow: number, sign: 1 | -1) =>
  H.center +
  sign * H.ry * grow * Math.sqrt(Math.max(0, 1 - (x / (H.rx * grow)) ** 2));

function rrect(cx: number, cy: number, w: number, h: number, r: number) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `M${f(x + r)} ${f(y)} H${f(x + w - r)} Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)} V${f(y + h - r)} Q${f(x + w)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)} H${f(x + r)} Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)} V${f(y + r)} Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)} Z`;
}

export default function OmarPortrait({
  size = 160,
  wave = true,
  className = '',
}: {
  size?: number;
  wave?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const art = useMemo(() => {
    const hairLine = (x: number) =>
      hairlineAt(x, Math.max(0.01, faceZ(x, H.hairline.front)));
    const beardLine = (x: number) =>
      beardlineAt(x, Math.max(0.02, faceZ(x, 0.25)));
    const L = H.lens;
    const frame = (sx: 1 | -1) =>
      rrect(X(sx * L.x), Y(L.y), L.w * S, L.h * S, L.radius * S) +
      ' ' +
      rrect(
        X(sx * L.x),
        Y(L.y) + ((L.top - L.side) / 2) * S,
        (L.w - 2 * L.side) * S,
        (L.h - L.side - L.top) * S,
        L.radius * 0.7 * S,
      );
    return {
      // Hair above the front hairline (forehead top); the rest is the curls.
      hairFront: band(
        1.04,
        (x) => ellipseY(x, 1.06, 1),
        (x) => Math.min(hairLine(x), ellipseY(x, 1.06, 1)),
      ),
      // Beard below the jaw line, down to the (grown) chin.
      beard: band(
        1.035,
        (x) => Math.min(beardLine(x), ellipseY(x, 1.03, 1)),
        (x) => ellipseY(x, 1.03, -1),
      ),
      curls: hairCurls()
        .filter((b) => b.p[2] > -0.04)
        .sort((a, b) => a.p[2] - b.p[2]),
      beardCurls: beardCurls().filter((b) => b.p[2] > 0),
      frames: [frame(1), frame(-1)],
    };
  }, []);
  const {
    eyes: E,
    brows: B,
    nose: N,
    moustache: M,
    mouth: Mo,
    chin: C,
    ears: Ea,
    bridge: Br,
  } = H;
  return (
    <span className={`omar-portrait ${className}`}>
      <span className="sr-only">
        Stylised portrait of Omar: curly black hair, black rectangular glasses,
        full beard, smiling
      </span>
      <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <clipPath id={`clip-${id}`}>
            <circle cx="100" cy="100" r="96" />
          </clipPath>
          {/* Back hair only shows above the ears, never as a frame around the jaw */}
          <clipPath id={`above-${id}`}>
            <rect
              x="0"
              y="0"
              width="200"
              height={f(Y(H.hairline.side - 0.02))}
            />
          </clipPath>
          <pattern
            id={`tee-${id}`}
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <rect width="12" height="12" fill={c.shirt} />
            <rect y="3" width="12" height="1.5" fill={c.stripeA} />
            <rect y="8" width="12" height="1" fill={c.stripeB} />
          </pattern>
        </defs>
        <circle cx="100" cy="100" r="96" className="portrait-bg" />
        <g clipPath={`url(#clip-${id})`}>
          {/* Shoulders in the striped tee, neck */}
          <rect
            x="32"
            y="170"
            width="136"
            height="60"
            rx="22"
            fill={`url(#tee-${id})`}
          />
          <rect x="86" y="150" width="28" height="24" fill={c.skin} />
          {/* Hair behind the face, ears */}
          <ellipse
            cx={CX}
            cy={Y(H.center + 0.01)}
            rx={H.rx * 1.015 * S}
            ry={H.ry * 1.025 * S}
            fill={c.hair}
            clipPath={`url(#above-${id})`}
          />
          {[1, -1].map((s) => (
            <ellipse
              key={s}
              cx={X(s * Ea.x)}
              cy={Y(Ea.y)}
              rx="6"
              ry="10.5"
              fill={c.skinShade}
            />
          ))}
          {/* Oval face */}
          <ellipse cx={CX} cy={CY} rx={H.rx * S} ry={H.ry * S} fill={c.skin} />
          {/* Beard: follows the jaw, fuller chin */}
          <path d={art.beard} fill={c.beard} />
          <ellipse
            cx={CX}
            cy={Y(C.y)}
            rx={C.rx * S}
            ry={C.ry * S}
            fill={c.beard}
          />
          {art.beardCurls.map((b, i) => (
            <circle
              key={i}
              cx={f(X(b.p[0]))}
              cy={f(Y(b.p[1]))}
              r={f(b.s[0] * S)}
              fill={c.beard}
            />
          ))}
          {/* Hair: forehead line + dense, uneven curls */}
          <path d={art.hairFront} fill={c.hair} />
          {art.curls.map((b, i) => (
            <circle
              key={i}
              cx={f(X(b.p[0]))}
              cy={f(Y(b.p[1]))}
              r={f(b.s[0] * S * 0.95)}
              fill={c.hair}
              stroke={c.hairHighlight}
              strokeWidth="0.8"
            />
          ))}
          {/* Brows, eyes (blink) */}
          {[1, -1].map((s) => (
            <rect
              key={s}
              x={f(X(s * B.x) - (B.w * S) / 2)}
              y={f(Y(B.y) - (B.h * S) / 2)}
              width={f(B.w * S)}
              height={f(B.h * S)}
              rx="2"
              fill={c.hair}
              transform={`rotate(${f(s * B.tilt * 57.3)} ${f(X(s * B.x))} ${f(Y(B.y))})`}
            />
          ))}
          <g className="portrait-eyes">
            {[1, -1].map((s) => (
              <ellipse
                key={s}
                cx={X(s * E.x)}
                cy={Y(E.y)}
                rx={(E.w * S) / 2}
                ry={(E.h * S) / 2}
                fill={c.eyes}
              />
            ))}
          </g>
          {/* Glasses: smaller, softly rectangular, thin black frames */}
          {art.frames.map((d, i) => (
            <path key={i} d={d} fill={c.frames} fillRule="evenodd" />
          ))}
          <rect
            x={f(CX - (Br.w * S) / 2)}
            y={f(Y(Br.y) - 1.4)}
            width={f(Br.w * S)}
            height="2.8"
            fill={c.frames}
          />
          {/* Nose, moustache joined to the beard, smile */}
          <rect
            x={f(CX - (N.w * S) / 2)}
            y={f(Y(N.y) - (N.h * S) / 2)}
            width={f(N.w * S)}
            height={f(N.h * S)}
            rx="4.5"
            fill={c.skinShade}
          />
          {[-1, 1].map((side) => (
            <rect
              key={side}
              x={f(CX + side * M.w * S * 0.235 - (M.w * S) / 4)}
              y={f(Y(M.y) - (M.h * S) / 2)}
              width={f((M.w * S) / 2 + 1.6)}
              height={f(M.h * S)}
              rx="3"
              fill={c.beard}
              transform={`rotate(${f(side * 6.3)} ${f(CX + side * M.w * S * 0.235)} ${f(Y(M.y))})`}
            />
          ))}
          <rect
            x={f(CX - (Mo.w * S) / 2)}
            y={f(Y(Mo.y) - (Mo.h * S) / 2)}
            width={f(Mo.w * S)}
            height={f(Mo.h * S)}
            rx="2.5"
            fill={c.teeth}
          />
          <rect
            x={f(CX - (Mo.w * S * 0.8) / 2)}
            y={f(Y(Mo.y) + (Mo.h * S) / 2 + 0.6)}
            width={f(Mo.w * S * 0.8)}
            height="2.4"
            rx="1"
            fill={c.lip}
          />
          {/* Waving hand */}
          {wave && (
            <g className="portrait-hand">
              <rect
                x="152"
                y="152"
                width="24"
                height="30"
                rx="5"
                fill={`url(#tee-${id})`}
              />
              <ellipse cx="163" cy="136" rx="13" ry="15" fill={c.skin} />
              <ellipse
                cx="149"
                cy="138"
                rx="4.5"
                ry="7"
                fill={c.skin}
                transform="rotate(-25 149 138)"
              />
              {[155, 161, 167, 173].map((x, i) => (
                <rect
                  key={x}
                  x={x - 2.4}
                  y={118 - (i === 1 || i === 2 ? 4 : 0)}
                  width="4.8"
                  height="15"
                  rx="2.4"
                  fill={c.skin}
                />
              ))}
            </g>
          )}
        </g>
      </svg>
    </span>
  );
}
