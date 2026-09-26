// Checks that every provenance quote appears verbatim in the CV text.
// The CV itself is private and never committed. Extract its text AND its
// hyperlink annotations (the project URLs are links, not visible text), e.g.
// with PyMuPDF: page.get_text() plus `LINK: <uri>` lines from page.get_links().
// Then run:
//   node --experimental-strip-types scripts/verify-provenance.mjs path/to/cv.txt
import { readFileSync } from 'node:fs';
import { facts } from '../src/content/provenance.ts';

const path = process.argv[2] ?? process.env.CV_TEXT;
if (!path) {
  console.log('No CV text supplied — skipping. Usage: verify-provenance.mjs <cv.txt>');
  process.exit(0);
}
const normalise = (s) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
const cv = normalise(readFileSync(path, 'utf8').replace(/=+ PAGE \d+ =+/g, ' '));
const missing = facts.filter((f) => !cv.includes(normalise(f.quote)));
for (const f of missing) console.error(`✗ ${f.id} (page ${f.page}): "${f.quote}"`);
console.log(`${facts.length - missing.length}/${facts.length} provenance quotes found verbatim in the CV.`);
process.exit(missing.length ? 1 : 0);
