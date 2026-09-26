import {
  contact,
  courses,
  education,
  identity,
  languages,
  moreProjects,
  nextChapter,
  projects,
  roles,
  skills,
} from '@/src/content/portfolio';
import { explorationTopics } from '@/src/content/exploration';
import type { Project } from '@/src/content/types';

/**
 * The readable portfolio. Server-compatible (no hooks), so the same sections
 * render in the static HTML for recruiters, search engines and no-WebGL
 * visitors, and inside Quick View / place panels.
 */
export const profileSections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'ai', label: 'AI exploration' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;
export type ProfileSectionId = (typeof profileSections)[number]['id'];

const External = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-link">
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export function AboutSection() {
  return (
    <>
      <p className="lead">{identity.summary}</p>
      <p>{identity.origin}</p>
      <dl className="facts">
        <div>
          <dt>Now</dt>
          <dd>
            {identity.currentRole}, {identity.currentOrganization}
          </dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>{identity.focus}</dd>
        </div>
        <div>
          <dt>Based in</dt>
          <dd>{identity.location}</dd>
        </div>
        <div>
          <dt>Exploring</dt>
          <dd>{identity.exploring}</dd>
        </div>
      </dl>
    </>
  );
}

export function ExperienceSection() {
  return (
    <ol className="timeline">
      {[...roles].reverse().map((r) => (
        <li key={r.id} className={r.current ? 'is-current' : undefined}>
          <div className="timeline-head">
            <h4>
              {r.title}
              {r.organization && <span> · {r.organization}</span>}
            </h4>
            <p className="dates">
              {r.start} – {r.end}
              {r.current && <span className="badge badge-live">Current</span>}
            </p>
          </div>
          <p>{r.summary}</p>
          {r.highlights && (
            <ul className="chips" aria-label="Highlights">
              {r.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

export function ProjectCard({ project, open = false }: { project: Project; open?: boolean }) {
  const tech = [...new Set(project.sides.flatMap((s) => s.technologies))];
  return (
    <article className="project-card" id={`project-${project.id}`}>
      <p className="eyebrow">{project.context}</p>
      <h4>{project.name}</h4>
      <p>{project.summary}</p>
      <ul className="chips" aria-label="Technologies">
        {tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <details open={open}>
        <summary>What I did</summary>
        {project.sides.map((side) => (
          <div key={side.label} className="project-side">
            <h5>
              {side.label} <span>· {side.technologies.join(', ')}</span>
            </h5>
            <ul>
              {side.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </details>
      {project.links && (
        <p className="links">
          Live sites:{' '}
          {project.links.map((l, i) => (
            <span key={l.url}>
              {i > 0 && ' · '}
              <External href={l.url}>{l.label}</External>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}

export function ProjectsSection({ focus }: { focus?: string }) {
  const ordered = focus ? [...projects].sort((a, b) => Number(b.id === focus) - Number(a.id === focus)) : projects;
  return (
    <>
      <div className="project-grid">
        {ordered.map((p) => (
          <ProjectCard key={p.id} project={p} open={p.id === focus} />
        ))}
      </div>
      <h4 className="subhead">More from the CV</h4>
      <ul className="compact-list">
        {moreProjects.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> <span className="muted">· {p.role}</span>
            <p>
              {p.summary} <span className="muted">({p.technologies.join(', ')})</span>
              {p.links?.map((l) => (
                <span key={l.url}>
                  {' '}
                  <External href={l.url}>{l.label}</External>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SkillsSection() {
  return (
    <div className="skill-groups">
      {skills.map((g) => (
        <div key={g.label}>
          <h4>{g.label}</h4>
          <ul className="chips">
            {g.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="note">Everything above is from my CV. Things I am still learning live in the AI Lab.</p>
    </div>
  );
}

export function ExplorationSection() {
  const groups = [...new Set(explorationTopics.map((t) => t.group))];
  return (
    <>
      <p className="notice">
        <strong>Currently exploring — not professional experience.</strong> The only AI work in my employment history is
        the Happy Human OpenAI + LangChain integration listed under Projects.
      </p>
      <div className="topic-groups">
        {groups.map((g) => (
          <div key={g}>
            <h4>{g}</h4>
            <ul className="topics">
              {explorationTopics
                .filter((t) => t.group === g)
                .map((t) => (
                  <li key={t.id}>
                    <span className={`badge badge-${t.status === 'Learning' ? 'learning' : 'exploring'}`}>{t.status}</span>
                    <strong>{t.name}</strong>
                    <span className="muted">{t.note}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function EducationSection() {
  return (
    <>
      <div className="edu">
        <h4>{education.degree}</h4>
        <p>
          {education.institution} · {education.date}
        </p>
        <p className="muted">{education.note}</p>
      </div>
      <h4 className="subhead">Courses</h4>
      <ul className="compact-list">
        {courses.map((c) => (
          <li key={c.name}>
            <strong>{c.name}</strong> <span className="muted">· {c.provider}</span>
          </li>
        ))}
      </ul>
      <h4 className="subhead">Languages</h4>
      <p>{languages.items.join(' · ')}</p>
    </>
  );
}

export function ContactSection() {
  return (
    <>
      <div className="next-callout">
        <p className="eyebrow">{nextChapter.label}</p>
        <h4>{nextChapter.title}</h4>
        <p>{nextChapter.body}</p>
      </div>
      <ul className="contact-list">
        {contact.map((c) => (
          <li key={c.kind}>
            <span className="muted">{c.label}</span>
            {c.href ? (
              c.href.startsWith('http') ? (
                <External href={c.href}>{c.value}</External>
              ) : (
                <a className="text-link" href={c.href}>
                  {c.value}
                </a>
              )
            ) : (
              <span>{c.value}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

const renderers: Record<ProfileSectionId, () => React.ReactNode> = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: () => <ProjectsSection />,
  skills: SkillsSection,
  ai: ExplorationSection,
  education: EducationSection,
  contact: ContactSection,
};

/** All sections, in order, with stable ids (`${idPrefix}-${section}`). */
export default function Profile({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="profile">
      {profileSections.map((s, i) => (
        <section key={s.id} id={`${idPrefix}-${s.id}`} aria-labelledby={`${idPrefix}-${s.id}-title`} className="profile-section">
          <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
          <h3 id={`${idPrefix}-${s.id}-title`}>{s.label}</h3>
          {renderers[s.id]()}
        </section>
      ))}
    </div>
  );
}
