/**
 * Polished rendered portrait of the same Omar identity as the world avatar.
 * Kept as a real image asset so the loader does not reduce the face to flat
 * SVG primitives.
 */
export default function OmarPortrait({
  size = 160,
  className = '',
}: {
  size?: number;
  wave?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`omar-portrait ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/avatar/omar-loader-portrait-v2.png"
        width={size}
        height={size}
        alt="Stylised miniature portrait of Omar"
        priority
      />
    </span>
  );
}
import Image from 'next/image';
