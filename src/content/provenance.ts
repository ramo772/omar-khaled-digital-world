import type { SourceFact } from './types';

/**
 * Provenance table: verbatim excerpts from Omar-Khaled-Cv.pdf (4 pages, read
 * 2026-09-26). Public copy in portfolio.ts may be tightened or have typos
 * fixed, but must not go beyond what these excerpts say.
 *
 * Deliberately NOT recorded or published: the phone number and the district
 * part of the address. Add them only after an explicit privacy decision.
 */
export const facts: SourceFact[] = [
  // ── Identity (page 1, header) ─────────────────────────────────────────
  { id: 'id.name', page: 1, section: 'Header', quote: 'OMAR KHALED' },
  { id: 'id.headline', page: 1, section: 'Header', quote: 'SOFTWARE ENGINEER' },
  { id: 'id.email', page: 1, section: 'Header', quote: 'omarkhaledibraheem@gmail.com' },
  { id: 'id.location', page: 1, section: 'Header', quote: 'Cairo, Egypt' },
  {
    id: 'id.linkedin',
    page: 1,
    section: 'Header',
    quote: 'https://www.linkedin.com/in/omar-khaled-a04655111/',
  },

  // ── Technical skills (page 1) ─────────────────────────────────────────
  {
    id: 'skills.list',
    page: 1,
    section: 'Technical skills',
    quote:
      'HTML/CSS JavaScript PHP Node js Laravel Git C Programming React.js Next.js MySQL',
  },

  // ── Experience (page 1) ───────────────────────────────────────────────
  {
    id: 'exp.vois.role',
    page: 1,
    section: 'Experience',
    quote: 'Senior software engineer VOIS (Vodafone Intelligent Solutions)',
  },
  { id: 'exp.vois.dates', page: 1, section: 'Experience', quote: 'April 2025- Present' },
  {
    id: 'exp.vois.tobi',
    page: 1,
    section: 'Experience',
    quote: 'Working on TOBi Chatbot Application, Vodafone’s digital assistant.',
  },
  {
    id: 'exp.vois.scope',
    page: 1,
    section: 'Experience',
    quote:
      'Responsible for developing new features such as Ask Once, integrating with other Vodafone services, and resolving production issues to enhance performance and customer experience.',
  },
  { id: 'exp.beyond.role', page: 1, section: 'Experience', quote: 'Software Engineer Beyond Creation' },
  { id: 'exp.beyond.dates', page: 1, section: 'Experience', quote: 'April 2023 - April 2025' },
  {
    id: 'exp.beyond.scope',
    page: 1,
    section: 'Experience',
    quote:
      'Expertise in React, Next js, PHP, Laravel, database design, front-end (HTML, CSS, JS, Bootstrap), and RESTful API development for efficient web application creation.',
  },
  { id: 'exp.amit.role', page: 1, section: 'Experience', quote: 'Full-Stack Instructor Amit-Learning' },
  { id: 'exp.amit.dates', page: 1, section: 'Experience', quote: 'Aug, 2022 - May, 2023' },
  {
    id: 'exp.amit.scope',
    page: 1,
    section: 'Experience',
    quote:
      'Instruct the students and assessing training needs, developing lessons plans, preparing materials, teaching, answering to student inquiries and helping them at the final project,',
  },
  {
    id: 'exp.fullstack.role',
    page: 1,
    section: 'Experience',
    quote: 'Software Engineer Full-Stack Developer',
  },
  { id: 'exp.fullstack.dates', page: 1, section: 'Experience', quote: 'Jun, 2021 - Jul, 2022' },
  {
    id: 'exp.fullstack.scope',
    page: 1,
    section: 'Experience',
    quote:
      'Managing back-end services and the interchange of data between the server and the users. designing and querying optimization of database, developing admin panels.',
  },
  { id: 'exp.saba.role', page: 1, section: 'Experience', quote: 'Patent Engineer Saba-IP' },
  { id: 'exp.saba.dates', page: 1, section: 'Experience', quote: 'Nov, 2021 - Apr, 2023' },
  { id: 'exp.xerox.role', page: 1, section: 'Experience', quote: 'Field Engineer Xerox' },
  { id: 'exp.xerox.dates', page: 1, section: 'Experience', quote: 'Jul, 2020 - Nov, 2021' },
  {
    id: 'exp.xerox.scope',
    page: 1,
    section: 'Experience',
    quote: 'Maintaining , servicing , networking and installing Xerox products.',
  },
  {
    id: 'exp.emc.role',
    page: 1,
    section: 'Experience',
    quote: 'Workshop Engineer Egyptian Maintenance Center (EMC)',
  },
  { id: 'exp.emc.dates', page: 1, section: 'Experience', quote: 'Dec, 2019 - Jun, 2020' },
  {
    id: 'exp.emc.scope',
    page: 1,
    section: 'Experience',
    quote:
      'Provide the servicing technician with an accurate description of the reasons for returning the vehicle to them & assist/ guide him to solve the problem',
  },

  // ── Projects (pages 2–3) ──────────────────────────────────────────────
  { id: 'proj.tobi.name', page: 2, section: 'Projects', quote: '1. TOBi Chatbot – Vodafone UK' },
  {
    id: 'proj.tobi.fe',
    page: 2,
    section: 'Projects',
    quote:
      'Technology: React.js Developed and maintained js components for Vodafone’s digital assistant TOBi. Ensured smooth customer interactions and consistent UX across platforms.',
  },
  {
    id: 'proj.tobi.be',
    page: 2,
    section: 'Projects',
    quote:
      'Technology: Node.js Built and maintained small Node.js services supporting reciveing messages and send it to the FE. Enhanced Ask Once functionality and integrated TOBi with other Vodafone services.',
  },
  {
    id: 'proj.realestate.name',
    page: 2,
    section: 'Projects',
    quote: '2.Real Estate Projects (MadinetMasr, Inertia Egypt, MisrItalia, Tatweer Misr)',
  },
  {
    id: 'proj.realestate.fe',
    page: 2,
    section: 'Projects',
    quote:
      'Technology: Next.js Developed CRUD operations for projects like MadinetMasr and Tatweer Misr, improving interactive data management. Integrated media libraries with drag-and-drop and language switching features. Created modular, reusable components to enhance code efficiency and usability.',
  },
  {
    id: 'proj.realestate.be',
    page: 2,
    section: 'Projects',
    quote:
      'Built backend frameworks for real estate services, ensuring strong API integration with front-end and admin interfaces. Applied service repository pattern for better code maintainability and scalability. Enhanced database structures for efficient data storage and retrieval. Developed flexible application settings to streamline project setup. Implemented automated email notifications and CRM integrations for real-time data access. Used Postman and Figma for detailed documentation and data integration presentations.',
  },
  { id: 'proj.realestate.link.madinetmasr', page: 2, section: 'Projects', quote: 'https://madinetmasr.com/en' },
  { id: 'proj.realestate.link.inertia', page: 2, section: 'Projects', quote: 'https://inertiaegypt.com/' },
  {
    id: 'proj.realestate.link.misritalia',
    page: 2,
    section: 'Projects',
    quote: 'https://misritaliaproperties.com/',
  },
  { id: 'proj.mansour.name', page: 2, section: 'Projects', quote: '3. Mansour Automotive' },
  {
    id: 'proj.mansour.fe',
    page: 2,
    section: 'Projects',
    quote:
      'Technology: React Native (Expo) Integrated backend systems with the front-end for dynamic data display. Enhanced existing components to develop new features, such as payment screens, services, QR code generation, and image uploads, improving user experience. Implemented and maintained filtering functionality to ensure optimal app performance.',
  },
  {
    id: 'proj.mansour.be',
    page: 2,
    section: 'Projects',
    quote:
      'Developed automated background commands for service reminders, vehicle status updates, and notifications, boosting operational efficiency. Collaborated on integration with the Mansour SAP Team for synchronizing user data, service tracking, and payment processing. Updated and optimized Laravel blades for improved admin panel management. Designed and implemented APIs for enhanced application functionality.',
  },
  { id: 'proj.happyhuman.name', page: 2, section: 'Projects', quote: '4. OpenAi Integration (Happy Human)' },
  {
    id: 'proj.happyhuman.be',
    page: 2,
    section: 'Projects',
    quote:
      'Technology: PHP, Laravel, Node.js, MySQL, Postman, LangChain, OpenAI Integrated LangChain with the admin panel for enhanced data management. Supported the HR team by integrating OpenAI tools for efficient employee management. Leveraged database information to provide insights and guidance. Implemented a memory feature for context recall, improving user interactions. Enabled streaming features for real-time responses.',
  },
  {
    id: 'proj.hyundai',
    page: 3,
    section: 'Projects',
    quote:
      '5. Hyundai Click to buy Back-End Developer: Technogloy: PhP , Laravel API, Html, Css , Adminlte, Postman, MySQL. Build Restful APIs related to the sections and the garage. Integrating AdminLTE Views for website content management.',
  },
  {
    id: 'proj.saba',
    page: 3,
    section: 'Projects',
    quote:
      "Create a Figma presentation to visually showcase the transition from Outlook to an efficient admin panel and mobile application, driving enhanced workflows and productivity.",
  },
  {
    id: 'proj.aflse7a',
    page: 3,
    section: 'Projects',
    quote:
      '7. Aflse7a.com Back-End Development: Technology: PHP, Laravel API, HTML, CSS, AdminLTE, Postman, MySQL Designed databases and built RESTful APIs for the JavaScript front-end. Integrated AdminLTE with Laravel for content management. Developed a reusable CKEditor component for Laravel 8.',
  },
  {
    id: 'proj.gawazy',
    page: 3,
    section: 'Projects',
    quote:
      '8. Gawazy.com Back-End Development: Technology: PHP, Laravel API, HTML, CSS, Bootstrap, Postman, MySQL Designed databases and built RESTful APIs for the JavaScript front-end. Developed an admin system for managing website content, user data, and employee management.',
  },
  {
    id: 'proj.noje',
    page: 3,
    section: 'Projects',
    quote: '9. NojeEgypt.com Back-End Developer Technology: PHP , Laravel API, HTML, CS , Bootstrap, Postman, MySQL.',
  },
  {
    id: 'proj.sisscom',
    page: 3,
    section: 'Projects',
    quote: '10. Sisscom.com Back-End Developer Technology: PHP, Laravel, HTML, CSS , Bootstrap, MySQL.',
  },
  {
    id: 'proj.blogapi',
    page: 3,
    section: 'Projects',
    quote:
      'Blog Management API (Node.js Reskilling Graduation Project): Built a RESTful API using Express.js, MongoDB, and JWT with authentication, CRUD operations, filtering, pagination, Swagger docs, and automated tests.',
  },
  {
    id: 'proj.blogapi.link',
    page: 3,
    section: 'Projects',
    quote: 'https://github.com/ramo772/blog-managment-node-js',
  },

  // ── Education, courses, languages (page 4) ────────────────────────────
  {
    id: 'edu.degree',
    page: 4,
    section: 'Education',
    quote:
      'Institute of Aviation Engineering and Technology Bachelor of Aeronautical Engineering May, 2017 (Graduation Project: Micro-Jet Engine KJ66)',
  },
  {
    id: 'edu.courses',
    page: 4,
    section: 'Courses',
    quote:
      'Full stack crash-course 1&2, SiliconArena Front end web development Professional Nano-degree Program, Udacity Vodafone Node.js Reskilling Program Node.js – The Hardest Parts, Frontend Masters (Will Sentance) Create Node.js App with Express, Socket.io & MongoDB, Udemy',
  },
  { id: 'edu.languages', page: 4, section: 'Languages', quote: 'Arabic (Native Speaker) English (B1)' },
];

export const factIds = new Set(facts.map((f) => f.id));
