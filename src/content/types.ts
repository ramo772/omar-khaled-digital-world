/**
 * Content model. Every professional record names the CV facts it is derived
 * from (`sources`), so any public sentence can be traced back to the CV.
 * Exploration topics are deliberately a separate type: they come from Omar's
 * brief, not from employment history.
 */
export type FactId = string;

export interface SourceFact {
  id: FactId;
  /** 1-based page in Omar-Khaled-Cv.pdf. */
  page: 1 | 2 | 3 | 4;
  section: string;
  /** Verbatim CV excerpt (whitespace-normalised). Checked by scripts/verify-provenance.mjs. */
  quote: string;
}

export interface Sourced {
  sources: FactId[];
}

export interface Identity extends Sourced {
  name: string;
  headline: string;
  currentRole: string;
  currentOrganization: string;
  focus: string;
  summary: string;
  origin: string;
  location: string;
}

export interface Role extends Sourced {
  id: string;
  title: string;
  /** Omitted when the CV does not name the organisation. */
  organization?: string;
  start: string;
  end: string;
  /** ISO month used only for ordering. */
  sortKey: string;
  current?: boolean;
  /** Which chapter of the career trail this milestone belongs to. */
  era: 'engineering' | 'software';
  summary: string;
  highlights?: string[];
}

export interface WorkSide {
  label: 'Front-end' | 'Back-end';
  technologies: string[];
  points: string[];
}

export interface Link {
  label: string;
  url: string;
}

export type StationId = 'tobi' | 'real-estate' | 'mansour' | 'happy-human';

export interface Project extends Sourced {
  id: string;
  name: string;
  context: string;
  summary: string;
  /** Workshop station that visualises this project in the 3D world. */
  station?: StationId;
  sides: WorkSide[];
  links?: Link[];
}

export interface CompactProject extends Sourced {
  id: string;
  name: string;
  role: string;
  technologies: string[];
  summary: string;
  links?: Link[];
}

export interface SkillGroup extends Sourced {
  label: string;
  items: string[];
}

export interface Education extends Sourced {
  institution: string;
  degree: string;
  date: string;
  note: string;
}

export interface Course extends Sourced {
  name: string;
  provider: string;
}

export interface ContactChannel extends Sourced {
  kind: 'email' | 'linkedin' | 'location';
  label: string;
  value: string;
  href?: string;
}

export type ExplorationStatus = 'Currently exploring' | 'Learning' | 'Experiment';

export interface ExplorationTopic {
  id: string;
  name: string;
  group: 'Agents' | 'Retrieval & context' | 'Evaluation & observability' | 'Automation & workflow' | 'Voice';
  status: ExplorationStatus;
  note: string;
}
