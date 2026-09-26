/**
 * Public feature switches. Flip a flag and rebuild — nothing else to change.
 *
 * aiLab: the AI Lab landmark, its map label, dock item, experiments panel and
 * every "AI exploration" section in Quick View and the readable portfolio.
 * Hidden for now; the code and content (src/content/exploration.ts,
 * src/ui/lab/*, src/world/locations/AILab.tsx) are kept intact.
 * To restore: set aiLab to true.
 */
export const features = {
  aiLab: false,
} as const;
