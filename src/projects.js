// Each project also carries trust-facing fields used on the home page:
//   audience     who it is for (plain language)
//   stage        { label, note } — an honest, plain statement of where it stands
//   previewLabel button text for liveUrl; say "test build"/"preview" until it has launched
//   outcome      null until there is a REAL, checkable result. When a project launches,
//                add e.g. { value: '-35%', label: 'average waiting time', context: 'Pilot at <clinic>, 3 months',
//                quote: '…', attribution: 'Name, Role, Organisation' } — the card then shows the
//                outcome instead of the stage line. Never fill this with estimates or placeholders.
export const projects = [
  {
    id: 'mediqueue',
    title: 'MediQueue',
    icon: '+',
    iconClass: 'medical-icon',
    status: 'Testing',
    liveUrl: 'https://mediqueue.theinnovibe.com/',
    previewLabel: 'Open the test build',
    audience: 'Medical centres, their patients and clinic staff',
    stage: { label: 'In testing', note: 'A public test build is running, so you can try it today.' },
    outcome: null,
    domain: 'Healthcare',
    domainSummary: 'Bringing order to clinical queues and clarity to patient journeys.',
    category: 'HEALTHCARE TECHNOLOGY',
    tagline: 'LESS WAITING. MORE CARING.',
    summary: 'Smart queue management for modern medical centers and calmer waits.',
    description: 'Organizes patient queues with real-time visibility, reducing waiting room stress for patients and clinical staff.',
    challenge: 'Chaotic waiting rooms and uncertain wait times frustrate patients and clinic staff.',
    focus: [
      'Automated patient queue sequencing',
      'Real-time waiting status on mobile',
      'Smoother doctor-patient consultations'
    ]
  },
  {
    id: 'sahakara',
    title: 'sahakara',
    icon: '⌂',
    iconClass: 'home-icon',
    status: 'In development',
    liveUrl: 'https://sahakara.theinnovibe.com/',
    previewLabel: 'Open the preview',
    audience: 'Busy families and the household helpers they work with',
    stage: { label: 'In development', note: 'A working preview is online while the core features are built.' },
    outcome: null,
    domain: 'Home & everyday living',
    domainSummary: 'Making household help simple, structured, and easy to coordinate.',
    category: 'HOME & EVERYDAY LIVING',
    tagline: 'A LITTLE HELP. A LOT OF HARMONY.',
    summary: 'Streamlined household coordination and help management in one place.',
    description: 'Simplifies scheduling, task delegation, and daily household help management so homes run more smoothly.',
    challenge: 'Coordinating domestic help and recurring chores often creates daily miscommunication.',
    focus: [
      'Daily chore schedules & checklists',
      'Clear helper task coordination',
      'More free time for busy families'
    ]
  },
  {
    id: 'chemlab',
    title: 'Virtual Chem Lab',
    icon: '⚗\uFE0E',
    iconClass: 'lab-icon',
    status: 'Requirement analysis',
    audience: 'A/L chemistry students with limited access to a physical lab',
    stage: { label: 'In research', note: 'We are mapping experiments to the A/L syllabus before writing code.' },
    outcome: null,
    domain: 'Education',
    domainSummary: 'Interactive practical chemistry simulations for students.',
    category: 'EDUCATION TECHNOLOGY',
    tagline: 'EXPERIMENT. OBSERVE. UNDERSTAND.',
    summary: 'Interactive virtual chemistry laboratory for self-paced student experiments.',
    description: 'Brings chemistry lab experiments to the screen so students can simulate reactions and learn by doing.',
    challenge: 'Limited physical lab access makes practical chemistry difficult to practice and visualize.',
    focus: [
      'Simulated titration and reactions',
      'Step-by-step experiment modules',
      'Direct alignment with A/L syllabus'
    ]
  }
];
