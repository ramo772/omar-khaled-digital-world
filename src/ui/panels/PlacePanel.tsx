'use client';
import { ArrowRight, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { destinationById, type DestinationId } from '@/src/data/world-map';
import {
  AboutSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  ExplorationSection,
  ProjectsSection,
  SkillsSection,
} from '../profile/Profile';
import LabSimulations from '../lab/LabSimulations';
import Sheet from './Sheet';

const titles: Record<DestinationId, { title: string; lead: string }> = {
  about: { title: 'Who I am', lead: 'The desk where the trail starts.' },
  experience: { title: 'The career trail', lead: 'From engineering workshops to software engineering — each step on the trail is a role from my CV.' },
  projects: { title: 'The Project Workshop', lead: 'Every bench in the workshop is a project from my CV. Screens and models are illustrations, not client systems.' },
  ai: { title: 'AI Lab', lead: 'What I am exploring now. Experiments run locally in your browser.' },
  skills: { title: 'The toolbench', lead: 'Technologies from my CV, grouped by where I use them.' },
  contact: { title: 'Contact', lead: 'The last stop on the path — and the start of a conversation.' },
};

export default function PlacePanel({
  place,
  project,
  reducedMotion,
  onClose,
  onContinue,
  onQuickView,
}: {
  place: DestinationId | null;
  project?: string;
  reducedMotion: boolean;
  onClose: () => void;
  onContinue: () => void;
  onQuickView: () => void;
}) {
  const d = place ? destinationById[place] : null;
  const copy = place ? titles[place] : null;
  return (
    <Sheet
      open={!!place}
      onClose={onClose}
      wide={place === 'ai' || place === 'projects'}
      eyebrow={d ? `${d.index} · ${d.hint}` : undefined}
      title={copy?.title ?? ''}
      description={copy?.lead}
      footer={
        <>
          <Button variant="outline" onClick={onQuickView}>
            <Grid2X2 aria-hidden="true" /> Full Quick View
          </Button>
          <Button onClick={onContinue}>
            Keep exploring <ArrowRight aria-hidden="true" />
          </Button>
        </>
      }
    >
      {place === 'about' && <AboutSection />}
      {place === 'experience' && (
        <>
          <ExperienceSection />
          <h3 className="subhead">Where the trail begins</h3>
          <EducationSection />
        </>
      )}
      {place === 'projects' && <ProjectsSection focus={project} />}
      {place === 'ai' && (
        <>
          <LabSimulations reducedMotion={reducedMotion} />
          <h3 className="subhead">On my reading list</h3>
          <ExplorationSection />
        </>
      )}
      {place === 'skills' && <SkillsSection />}
      {place === 'contact' && <ContactSection />}
    </Sheet>
  );
}
