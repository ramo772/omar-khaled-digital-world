'use client';
import { useEffect, useState } from 'react';
export function usePreferences() {
  const [reducedMotion, setReducedMotion] = useState(false),
    [lowQuality, setLowQuality] = useState(false),
    [visible, setVisible] = useState(true);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    const visibility = () =>
      setVisible(!document.hidden && window.scrollY < window.innerHeight * 0.7);
    update();
    setLowQuality(
      matchMedia('(pointer: coarse)').matches ||
        navigator.hardwareConcurrency <= 4,
    );
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('scroll', visibility, { passive: true });
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', visibility);
    };
  }, []);
  return { reducedMotion, lowQuality, setLowQuality, visible };
}
