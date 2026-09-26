import { projects } from '@/src/content/portfolio';

/** The CV's headline projects, one tap from the first screen. */
export default function WorkShelf({ className, onOpen }: { className: string; onOpen: (id: string) => void }) {
  return (
    <nav className={`work-shelf ${className}`} aria-label="Featured projects">
      <p className="eyebrow">In the workshop</p>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onOpen(p.id)}>
              {p.name.split(' · ')[0]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
