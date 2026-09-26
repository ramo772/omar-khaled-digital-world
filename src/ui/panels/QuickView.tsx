'use client';
import { useEffect } from 'react';
import { identity } from '@/src/content/portfolio';
import Profile, { profileSections, type ProfileSectionId } from '../profile/Profile';
import Sheet from './Sheet';

/** The whole profile, no walking required. Works with or without WebGL. */
export default function QuickView({
  open,
  section,
  onClose,
}: {
  open: boolean;
  section?: ProfileSectionId;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open || !section) return;
    const id = requestAnimationFrame(() => document.getElementById(`qv-${section}`)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(id);
  }, [open, section]);
  return (
    <Sheet
      open={open}
      onClose={onClose}
      wide
      eyebrow="Quick View · no walking required"
      title={identity.name}
      description={`${identity.currentRole} at ${identity.shortOrganization} · ${identity.focus} · ${identity.location}`}
    >
      <nav className="qv-nav" aria-label="Quick View sections">
        {profileSections.map((s) => (
          <a key={s.id} href={`#qv-${s.id}`}>
            {s.label}
          </a>
        ))}
      </nav>
      <Profile idPrefix="qv" />
    </Sheet>
  );
}
