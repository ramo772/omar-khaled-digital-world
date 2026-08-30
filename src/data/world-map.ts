export type DestinationId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'ai'
  | 'skills'
  | 'contact';
export interface Destination {
  id: DestinationId;
  label: string;
  chapter: string;
  title: string;
  description: string;
  position: [number, number, number];
  stop: [number, number];
  color: string;
}
export const destinations: Destination[] = [
  {
    id: 'about',
    label: 'About',
    chapter: '01 / HELLO, WORLD',
    title: 'Every world starts with a person.',
    description:
      'Omar Khaled · Software Engineer. The biography and education details are awaiting CV verification.',
    position: [-6.6, 1.8, 3.5],
    stop: [-5.1, 4.3],
    color: '#9aafa0',
  },
  {
    id: 'experience',
    label: 'Experience',
    chapter: '02 / THE JOURNEY',
    title: 'The path that led here.',
    description:
      'A place for verified roles, companies, and milestones. No professional history has been populated in this foundation preview.',
    position: [-6.5, 2.4, -2.9],
    stop: [-5, -1.4],
    color: '#cfac70',
  },
  {
    id: 'projects',
    label: 'Projects',
    chapter: '03 / THE WORKSHOP',
    title: 'Ideas become working things.',
    description:
      'The centerpiece of the world. These are neutral workshop artifacts, not representations of completed professional projects. Case studies will follow CV verification.',
    position: [0, 4.3, -1],
    stop: [0, 2.2],
    color: '#df7950',
  },
  {
    id: 'ai',
    label: 'AI Lab',
    chapter: '04 / CURRENTLY EXPLORING',
    title: 'Leave a little room for discovery.',
    description:
      'An experimental space for learning about agents, tools, retrieval, and AI workflows. All interactive demonstrations are local simulations, not real AI calls or claims of professional expertise.',
    position: [6, 3.5, -2.1],
    stop: [5.1, 0.3],
    color: '#719f9c',
  },
  {
    id: 'skills',
    label: 'Skills',
    chapter: 'THE TOOLBENCH',
    title: 'Tools, with a purpose.',
    description:
      'Verified technologies and skills will be added from the CV. Learning topics belong in the AI Lab and are kept separate from professional proficiency.',
    position: [-0.9, 1.2, 5],
    stop: [1, 4],
    color: '#a4aa80',
  },
  {
    id: 'contact',
    label: 'Contact',
    chapter: '05 / WHAT COMES NEXT',
    title: 'The next idea starts with a conversation.',
    description:
      'A space for what comes next. Contact details and public links are intentionally absent until they can be verified from the CV.',
    position: [6.3, 2.7, 4],
    stop: [4.6, 4],
    color: '#c79b7d',
  },
];
export const spawn: [number, number] = [-4.8, 4.3];
export const pathPoints: [number, number][] = [
  [-5.1, 5.8],
  [-5.1, 2.5],
  [-5, -1.4],
  [-3.8, -1.8],
  [-3.5, 1.6],
  [0, 2.2],
  [3.3, 1.8],
  [5.1, 0.3],
  [5.2, 2.1],
  [4.6, 4],
  [3.8, 5.4],
];
export const worldBounds = { x: 9.4, z: 6.35 };
export const obstacles = [
  { x: 0, z: -1.35, halfX: 2.65, halfZ: 1.65 },
  { x: -6.6, z: 3, halfX: 1, halfZ: 0.6 },
  { x: -6.7, z: -3.1, halfX: 1.9, halfZ: 1 },
  { x: 6, z: -2.1, halfX: 1.55, halfZ: 1.55 },
  { x: 6.8, z: 3.8, halfX: 1, halfZ: 0.7 },
  { x: -0.9, z: 5, halfX: 1.4, halfZ: 0.45 },
];
