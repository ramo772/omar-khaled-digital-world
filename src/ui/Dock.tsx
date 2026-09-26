import { BriefcaseBusiness, Code2, FlaskConical, Radio, UserRound, Wrench } from 'lucide-react';
import { destinations, type DestinationId } from '@/src/data/world-map';

const icons: Record<DestinationId, typeof Code2> = {
  about: UserRound,
  experience: BriefcaseBusiness,
  projects: Code2,
  ai: FlaskConical,
  contact: Radio,
  skills: Wrench,
};

/** Persistent navigation: every place is one click away, no walking needed. */
export default function Dock({ current, onSelect }: { current: DestinationId | null; onSelect: (id: DestinationId) => void }) {
  return (
    <nav className="dock" aria-label="Portfolio navigation">
      <ol>
        {destinations.map((d) => {
          const Icon = icons[d.id];
          return (
            <li key={d.id}>
              <button
                type="button"
                className={`dock-item ${d.id === 'projects' ? 'is-featured' : ''} ${current === d.id ? 'is-near' : ''}`}
                onClick={() => onSelect(d.id)}
                title={d.hint}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                <span className="dock-label">{d.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
