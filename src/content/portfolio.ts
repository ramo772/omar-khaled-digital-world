import type {
  CompactProject,
  ContactChannel,
  Course,
  Education,
  Identity,
  Project,
  Role,
  SkillGroup,
} from './types';

/**
 * Omar's professional content. Source of truth: Omar-Khaled-Cv.pdf.
 * Every record lists the provenance fact IDs (see provenance.ts) it relies on.
 * `tests/content.test.mjs` fails if a source ID does not exist.
 */

export const identity: Identity = {
  name: 'Omar Khaled',
  headline: 'Software Engineer',
  currentRole: 'Senior Software Engineer',
  currentOrganization: 'VOIS (Vodafone Intelligent Solutions)',
  shortOrganization: 'VOIS',
  currentProject: 'TOBi',
  currentProjectNote: 'Vodafone’s digital assistant',
  pitch: 'Node.js, React, Next.js, PHP/Laravel and MySQL across web and mobile.',
  focus: 'Backend / Full-Stack',
  exploring: 'AI engineering',
  summary:
    'I work on TOBi, Vodafone’s digital assistant, at VOIS — building new features such as Ask Once, integrating with other Vodafone services, and resolving production issues. Before that I built web and mobile products across the front-end and back-end with Node.js, React, Next.js, PHP/Laravel and MySQL.',
  origin:
    'My path into software started in engineering: a Bachelor of Aeronautical Engineering (graduation project: a KJ66 micro-jet engine), then workshop and field engineering roles before moving into full-stack development.',
  location: 'Cairo, Egypt',
  sources: [
    'id.name',
    'id.headline',
    'id.location',
    'exp.vois.role',
    'exp.vois.tobi',
    'exp.vois.scope',
    'skills.list',
    'exp.fullstack.role',
    'edu.degree',
    'exp.emc.role',
    'exp.xerox.role',
  ],
};

/** Chronological order, oldest first — the career trail walks this list. */
export const roles: Role[] = [
  {
    id: 'emc',
    short: 'EMC',
    title: 'Workshop Engineer',
    organization: 'Egyptian Maintenance Center (EMC)',
    start: 'Dec 2019',
    end: 'Jun 2020',
    sortKey: '2019-12',
    era: 'engineering',
    summary:
      'Gave servicing technicians an accurate description of why vehicles were returned, and guided them to solve the problem.',
    sources: ['exp.emc.role', 'exp.emc.dates', 'exp.emc.scope'],
  },
  {
    id: 'xerox',
    short: 'Xerox',
    title: 'Field Engineer',
    organization: 'Xerox',
    start: 'Jul 2020',
    end: 'Nov 2021',
    sortKey: '2020-07',
    era: 'engineering',
    summary: 'Maintained, serviced, networked and installed Xerox products.',
    sources: ['exp.xerox.role', 'exp.xerox.dates', 'exp.xerox.scope'],
  },
  {
    id: 'fullstack',
    short: 'Full-stack',
    title: 'Software Engineer · Full-Stack Developer',
    start: 'Jun 2021',
    end: 'Jul 2022',
    sortKey: '2021-06',
    era: 'software',
    summary:
      'Managed back-end services and the data exchange between server and users, designed and optimised database queries, and developed admin panels.',
    sources: ['exp.fullstack.role', 'exp.fullstack.dates', 'exp.fullstack.scope'],
  },
  {
    id: 'saba',
    short: 'Saba-IP',
    title: 'Patent Engineer',
    organization: 'Saba-IP',
    start: 'Nov 2021',
    end: 'Apr 2023',
    sortKey: '2021-11',
    era: 'engineering',
    summary:
      'Created a Figma presentation showing how Saba IP’s work processes could move from Outlook to an admin panel and a mobile application.',
    sources: ['exp.saba.role', 'exp.saba.dates', 'proj.saba'],
  },
  {
    id: 'amit',
    short: 'Amit',
    title: 'Full-Stack Instructor',
    organization: 'Amit-Learning',
    start: 'Aug 2022',
    end: 'May 2023',
    sortKey: '2022-08',
    era: 'software',
    summary:
      'Taught full-stack development: assessed training needs, planned lessons, prepared materials, answered student questions and mentored final projects.',
    sources: ['exp.amit.role', 'exp.amit.dates', 'exp.amit.scope'],
  },
  {
    id: 'beyond',
    short: 'Beyond',
    title: 'Software Engineer',
    organization: 'Beyond Creation',
    start: 'Apr 2023',
    end: 'Apr 2025',
    sortKey: '2023-04',
    era: 'software',
    summary:
      'Built web applications with React, Next.js, PHP and Laravel — database design, front-end (HTML, CSS, JS, Bootstrap) and RESTful APIs.',
    sources: ['exp.beyond.role', 'exp.beyond.dates', 'exp.beyond.scope'],
  },
  {
    id: 'vois',
    short: 'VOIS',
    title: 'Senior Software Engineer',
    organization: 'VOIS (Vodafone Intelligent Solutions)',
    start: 'Apr 2025',
    end: 'Present',
    sortKey: '2025-04',
    current: true,
    era: 'software',
    summary:
      'Working on the TOBi chatbot application, Vodafone’s digital assistant: developing new features such as Ask Once, integrating with other Vodafone services, and resolving production issues to improve performance and customer experience.',
    highlights: ['TOBi Chatbot – Vodafone UK', 'Ask Once', 'Vodafone service integrations', 'Production issue resolution'],
    sources: ['exp.vois.role', 'exp.vois.dates', 'exp.vois.tobi', 'exp.vois.scope'],
  },
];

/**
 * The CV does not state which employer each project belongs to, except TOBi
 * (VOIS). Contexts therefore stay neutral instead of guessing.
 */
export const projects: Project[] = [
  {
    id: 'tobi',
    name: 'TOBi Chatbot',
    context: 'Vodafone UK · VOIS',
    station: 'tobi',
    summary:
      'Front-end components and small Node.js services for Vodafone’s digital assistant, including the Ask Once functionality and integrations with other Vodafone services.',
    sides: [
      {
        label: 'Front-end',
        technologies: ['React.js'],
        points: [
          'Developed and maintained JavaScript components for Vodafone’s digital assistant TOBi.',
          'Kept customer interactions smooth and the UX consistent across platforms.',
        ],
      },
      {
        label: 'Back-end',
        technologies: ['Node.js'],
        points: [
          'Built and maintained small Node.js services that receive messages and deliver them to the front-end.',
          'Enhanced the Ask Once functionality and integrated TOBi with other Vodafone services.',
        ],
      },
    ],
    sources: ['proj.tobi.name', 'proj.tobi.fe', 'proj.tobi.be', 'exp.vois.tobi'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate Platforms',
    context: 'MadinetMasr · Inertia Egypt · MisrItalia · Tatweer Misr',
    station: 'real-estate',
    summary:
      'Next.js admin interfaces and Laravel APIs for several real estate developers — CRUD tooling, media libraries, CRM integrations and automated notifications.',
    sides: [
      {
        label: 'Front-end',
        technologies: ['Next.js'],
        points: [
          'Developed CRUD operations for projects such as MadinetMasr and Tatweer Misr.',
          'Integrated media libraries with drag-and-drop and language switching.',
          'Created modular, reusable components.',
        ],
      },
      {
        label: 'Back-end',
        technologies: ['PHP', 'Laravel API', 'MySQL'],
        points: [
          'Built backend frameworks for real estate services with API integration for front-end and admin interfaces.',
          'Applied the service-repository pattern for maintainability.',
          'Improved database structures for storage and retrieval.',
          'Developed flexible application settings to streamline project setup.',
          'Implemented automated email notifications and CRM integrations.',
          'Documented APIs and data integrations with Postman and Figma.',
        ],
      },
    ],
    links: [
      { label: 'MadinetMasr', url: 'https://madinetmasr.com/en' },
      { label: 'Inertia Egypt', url: 'https://inertiaegypt.com/' },
      { label: 'MisrItalia', url: 'https://misritaliaproperties.com/' },
    ],
    sources: [
      'proj.realestate.name',
      'proj.realestate.fe',
      'proj.realestate.be',
      'proj.realestate.link.madinetmasr',
      'proj.realestate.link.inertia',
      'proj.realestate.link.misritalia',
    ],
  },
  {
    id: 'mansour',
    name: 'Mansour Automotive',
    context: 'Mobile app + Laravel API',
    station: 'mansour',
    summary:
      'A React Native (Expo) app and Laravel API: payment screens, services, QR codes and image uploads, background jobs for service reminders, and SAP synchronisation with the Mansour team.',
    sides: [
      {
        label: 'Front-end',
        technologies: ['React Native (Expo)'],
        points: [
          'Integrated backend systems with the app for dynamic data display.',
          'Extended existing components into new features: payment screens, services, QR code generation and image uploads.',
          'Implemented and maintained filtering functionality.',
        ],
      },
      {
        label: 'Back-end',
        technologies: ['PHP', 'Laravel API', 'MySQL'],
        points: [
          'Developed automated background commands for service reminders, vehicle status updates and notifications.',
          'Collaborated with the Mansour SAP team to synchronise user data, service tracking and payment processing.',
          'Updated and optimised Laravel Blade views for admin panel management.',
          'Designed and implemented APIs for the application.',
        ],
      },
    ],
    sources: ['proj.mansour.name', 'proj.mansour.fe', 'proj.mansour.be'],
  },
  {
    id: 'happy-human',
    name: 'Happy Human · OpenAI Integration',
    context: 'HR admin panel',
    station: 'happy-human',
    summary:
      'Integrated OpenAI tools and LangChain into an HR admin panel — using database information for insights, with a memory feature for context recall and streaming for real-time responses.',
    sides: [
      {
        label: 'Back-end',
        technologies: ['PHP', 'Laravel', 'Node.js', 'MySQL', 'LangChain', 'OpenAI', 'Postman'],
        points: [
          'Integrated LangChain with the admin panel for data management.',
          'Supported the HR team by integrating OpenAI tools for employee management.',
          'Used database information to provide insights and guidance.',
          'Implemented a memory feature for context recall.',
          'Enabled streaming for real-time responses.',
        ],
      },
    ],
    sources: ['proj.happyhuman.name', 'proj.happyhuman.be'],
  },
];

/**
 * Words painted onto the workshop's screens and boards. Kept here (not in the
 * 3D code) so every visible label stays traceable to the CV.
 */
export const workshopDisplays = {
  tobi: {
    title: 'TOBi · Vodafone UK — where my part sits',
    nodes: [
      { label: 'React.js UI', sub: 'TOBi components' },
      { label: 'Node.js services', sub: 'messages → FE' },
      { label: 'Vodafone services', sub: 'integrations' },
    ],
    badge: 'ASK ONCE',
    footnote: 'Simplified from my CV · not an official architecture diagram',
    sources: ['proj.tobi.fe', 'proj.tobi.be'],
  },
  realEstate: { screen: 'Next.js · CRUD', toggle: 'LANG', api: 'LARAVEL API', sources: ['proj.realestate.fe', 'proj.realestate.be'] },
  mansour: {
    screen: 'Laravel · background jobs',
    jobs: ['service-reminders', 'vehicle-status', 'notifications'],
    sync: 'SAP SYNC',
    sources: ['proj.mansour.be'],
  },
  happyHuman: { screen: 'HR assistant', badges: ['MEMORY', 'STREAMING'], chain: 'LANGCHAIN', sources: ['proj.happyhuman.be'] },
};

export const moreProjects: CompactProject[] = [
  {
    id: 'hyundai',
    name: 'Hyundai Click to Buy',
    role: 'Back-end developer',
    technologies: ['PHP', 'Laravel API', 'AdminLTE', 'MySQL'],
    summary: 'RESTful APIs for the sections and the garage; AdminLTE views for content management.',
    sources: ['proj.hyundai'],
  },
  {
    id: 'aflse7a',
    name: 'Aflse7a.com',
    role: 'Back-end developer',
    technologies: ['PHP', 'Laravel API', 'AdminLTE', 'MySQL'],
    summary: 'Database design and RESTful APIs for the JavaScript front-end; a reusable CKEditor component for Laravel 8.',
    sources: ['proj.aflse7a'],
  },
  {
    id: 'gawazy',
    name: 'Gawazy.com',
    role: 'Back-end developer',
    technologies: ['PHP', 'Laravel API', 'Bootstrap', 'MySQL'],
    summary: 'Database design, RESTful APIs, and an admin system for content, user data and employee management.',
    sources: ['proj.gawazy'],
  },
  {
    id: 'noje',
    name: 'NojeEgypt.com',
    role: 'Back-end developer',
    technologies: ['PHP', 'Laravel API', 'Bootstrap', 'MySQL'],
    summary: 'Database design, RESTful APIs and a content/admin system.',
    sources: ['proj.noje'],
  },
  {
    id: 'sisscom',
    name: 'Sisscom.com',
    role: 'Back-end developer',
    technologies: ['PHP', 'Laravel', 'Bootstrap', 'MySQL'],
    summary: 'Database design and an admin system for services, categories and employees.',
    sources: ['proj.sisscom'],
  },
  {
    id: 'blog-api',
    name: 'Blog Management API',
    role: 'Vodafone Node.js Reskilling graduation project',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Swagger'],
    summary: 'RESTful API with authentication, CRUD, filtering, pagination, Swagger docs and automated tests.',
    links: [{ label: 'GitHub', url: 'https://github.com/ramo772/blog-managment-node-js' }],
    sources: ['proj.blogapi', 'proj.blogapi.link'],
  },
];

export const skills: SkillGroup[] = [
  {
    label: 'Back-end',
    items: ['Node.js', 'PHP', 'Laravel', 'RESTful APIs', 'MySQL'],
    sources: ['skills.list', 'exp.beyond.scope', 'exp.fullstack.scope'],
  },
  {
    label: 'Front-end',
    items: ['React.js', 'Next.js', 'JavaScript', 'HTML/CSS', 'React Native (Expo)'],
    sources: ['skills.list', 'proj.mansour.fe'],
  },
  {
    label: 'AI integration (professional)',
    items: ['OpenAI', 'LangChain'],
    sources: ['proj.happyhuman.be'],
  },
  {
    label: 'Tools & foundations',
    items: ['Git', 'Postman', 'Figma', 'C Programming'],
    sources: ['skills.list', 'proj.realestate.be'],
  },
];

export const education: Education = {
  institution: 'Institute of Aviation Engineering and Technology',
  degree: 'Bachelor of Aeronautical Engineering',
  short: 'Aero Eng.',
  date: 'May 2017',
  note: 'Graduation project: Micro-Jet Engine KJ66',
  sources: ['edu.degree'],
};

export const courses: Course[] = [
  { name: 'Vodafone Node.js Reskilling Program', provider: 'Vodafone', sources: ['edu.courses'] },
  { name: 'Node.js – The Hardest Parts', provider: 'Frontend Masters (Will Sentance)', sources: ['edu.courses'] },
  { name: 'Create Node.js App with Express, Socket.io & MongoDB', provider: 'Udemy', sources: ['edu.courses'] },
  { name: 'Front End Web Development Professional Nanodegree', provider: 'Udacity', sources: ['edu.courses'] },
  { name: 'Full Stack Crash Course 1 & 2', provider: 'SiliconArena', sources: ['edu.courses'] },
];

export const languages = { items: ['Arabic (native)', 'English (B1)'], sources: ['edu.languages'] };

export const contact: ContactChannel[] = [
  {
    kind: 'email',
    label: 'Email',
    value: 'omarkhaledibraheem@gmail.com',
    href: 'mailto:omarkhaledibraheem@gmail.com',
    sources: ['id.email'],
  },
  {
    kind: 'linkedin',
    label: 'LinkedIn',
    value: 'in/omar-khaled-a04655111',
    href: 'https://www.linkedin.com/in/omar-khaled-a04655111/',
    sources: ['id.linkedin'],
  },
  { kind: 'location', label: 'Based in', value: 'Cairo, Egypt', sources: ['id.location'] },
];

/**
 * “What I want to build next” — a direction, clearly not a shipped project.
 * Grounded in the brief (interest in AI engineering) and the CV (backend work,
 * Happy Human OpenAI/LangChain integration).
 */
export const nextChapter = {
  title: 'What I want to build next',
  body: 'Reliable AI features on top of solid backend systems: agents that call real tools, retrieval grounded in real data, and evaluations that keep them honest.',
  label: 'Direction · not a shipped project',
};
