import Portfolio from '@/src/ui/Portfolio';
import Profile from '@/src/ui/profile/Profile';
import { identity } from '@/src/content/portfolio';

export default function Page() {
  return (
    <>
      <Portfolio />
      {/* Server-rendered: the whole portfolio without JavaScript or WebGL. */}
      <main id="readable-portfolio" className="readable" tabIndex={-1}>
        <header className="readable-header">
          <p className="eyebrow">The readable version</p>
          <h2>Omar’s portfolio, in plain text</h2>
          <p>
            {identity.currentRole} at {identity.currentOrganization} · {identity.focus} · {identity.location}
          </p>
        </header>
        <Profile idPrefix="section" />
      </main>
      <footer className="site-footer">
        <p>© 2026 {identity.name}</p>
        <p>Original procedural 3D · no trackers · content sourced from my CV</p>
        <p>
          <a className="text-link" href="#top">
            Back to the world ↑
          </a>
        </p>
      </footer>
    </>
  );
}
