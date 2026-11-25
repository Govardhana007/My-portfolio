export type ThemeMode = 'contrast' | 'obsidian' | 'paper';

export type ProjectCategory = 'All' | 'AI & ML' | 'Full Stack' | 'Data Analytics';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  stack: string[];
  year: string;
  tagline: string;
  description: string;
  highlights: string[];
  image?: string;
  imageAlt: string;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface AiWorkShowcaseItem {
  id: string;
  index: string;
  title: string;
  focus: string;
  description: string;
  capabilities: string[];
  image: string;
  imageAlt: string;
  lightSurface?: boolean;
  relatedProjectId: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  points: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  score: string;
  period: string;
  location: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialNote: string;
  image: string;
  pdf: string;
}

export const PROFILE = {
  wordmark: 'gr.dev',
  name: 'Govardhana Ramgopal',
  portrait: '/assets/aistudio/myyyy_a1cf45c7.jpeg',
  portraitAlt: 'Studio portrait of Govardhana Ramgopal wearing a dark knit sweater against a deep crimson backdrop',
  roleHeadline: 'AI & ML Engineer and Full-Stack Developer',
  rotatorPhrases: [
    'intelligent ML models.',
    'computer vision CNNs.',
    'responsive web interfaces.',
    'end-to-end Flask systems.',
  ],
  bio: 'Computer Engineering undergraduate specializing in AI & Machine Learning at Presidency University, Bengaluru. I engineer deployable neural networks, real-time Flask APIs, and kinetic web interfaces.',
  location: 'Bengaluru, India',
  email: 'ramg2366@gmail.com',
  phone: '+91 91088 36911',
  githubUrl: 'https://github.com/Govardhana007',
  githubReposUrl: 'https://github.com/Govardhana007?tab=repositories',
  linkedinUrl: 'https://www.linkedin.com/in/govardhana-ramgopal-computer-engineering',
  resumePdf: '/assets/aistudio/Govardhana_Ramgopal_resume_ceb82a99.pdf',
};

export const KEY_METRICS = [
  { value: '06', label: 'End-to-End Projects' },
  { value: '06', label: 'Verified Certificates' },
  { value: '04', label: 'Technical Internships' },
  { value: '7.34', label: 'B.Tech CGPA (AI & ML)' },
];

export const AI_WORK_SHOWCASE: AiWorkShowcaseItem[] = [
  {
    id: 'ai-vision-inference',
    index: 'AI · 01',
    title: 'Applied Neural Architectures & Vision Pipelines',
    focus: 'Deep Learning · TensorFlow · Computer Vision',
    description:
      'End-to-end Convolutional Neural Networks engineered for real-world diagnostic imagery—bridging preprocessing, model regularization, and responsive Flask REST inference in SkinShield AI and Brain Tumor CNN.',
    capabilities: [
      'Multi-class MRI & dermatological image classification',
      'Object-oriented Python inference services & unit testing',
      'Public model deployment on Render & Hugging Face Spaces',
    ],
    image: '/assets/aistudio/images_002_73ae02ca.jpg',
    imageAlt: 'AI neural processing chip connected to computer vision, analytics, dialogue, and code interfaces',
    lightSurface: true,
    relatedProjectId: 'skinshield-ai',
  },
  {
    id: 'ai-predictive-automation',
    index: 'AI · 02',
    title: 'Predictive ML Classifiers & Data Automation',
    focus: 'Scikit-learn · Feature Engineering · Decision Systems',
    description:
      'Translating raw telemetry and lexical URL signals into fast risk classifications and cohort retention dashboards across SecureURL AI and E-commerce Performance BI.',
    capabilities: [
      '14 engineered lexical & host security features in Random Forest',
      'Automated SQL + Python ETL cleaning and RFM segmentation',
      'Low-latency REST scoring APIs with calibrated reliability',
    ],
    image: '/assets/aistudio/images001_7b991a24.jpg',
    imageAlt: 'Autonomous AI assistant surrounded by neural network, automation workflows, and machine intelligence modules',
    lightSurface: false,
    relatedProjectId: 'secureurl-ai',
  },
];

export const EDUCATION: EducationItem[] = [
  {
    institution: 'Presidency University',
    degree: 'B.Tech — Computer Engineering (AI & ML)',
    score: 'CGPA 7.34',
    period: 'Expected 2027',
    location: 'Bengaluru, India',
  },
  {
    institution: 'RVSR College',
    degree: 'Pre-University (11th – 12th Grade)',
    score: '84.6%',
    period: 'Completed',
    location: 'India',
  },
  {
    institution: 'JGVV, Chennai',
    degree: 'High School (CBSE)',
    score: '70.8%',
    period: 'Completed',
    location: 'Chennai, India',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'skillcraft',
    role: 'Data Analyst Intern',
    company: 'SkillCraft Technology',
    period: 'Jun 2026 – Jul 2026',
    location: 'Remote',
    summary: 'Data cleaning, SQL querying, and actionable analytical reporting.',
    points: [
      'Applied Python and SQL to clean, query, and analyze multi-table datasets, translating raw records into clear insights.',
      'Delivered structured analytical documentation within defined timelines for engineering and stakeholder review.',
    ],
  },
  {
    id: 'staxtech',
    role: 'Front-End Developer Intern',
    company: 'StaxTech',
    period: 'Jun 2025 – Jul 2025',
    location: 'Remote',
    summary: 'Interactive responsive web interfaces built in an agile batch program.',
    points: [
      'Designed and developed interactive, responsive web applications using HTML5, CSS3, and modern JavaScript.',
      'Architected responsive layouts and client-side state logic, delivering assigned applications independently on schedule.',
    ],
  },
  {
    id: 'internpe',
    role: 'Python Programming Intern',
    company: 'InternPe',
    period: 'Jul 2024 – Aug 2024',
    location: 'Remote',
    summary: 'Algorithmic problem solving and modular Python mini-applications.',
    points: [
      'Solved hands-on Python programming challenges and engineered interactive mini-projects.',
      'Strengthened debugging discipline, algorithmic decomposition, and clean-code structure.',
    ],
  },
  {
    id: 'ybi',
    role: 'Python Programming Intern',
    company: 'YBI Foundation',
    period: 'Aug 2024',
    location: 'Remote',
    summary: 'Foundational Python workflows and practical engineering exercises.',
    points: [
      'Completed an intensive 1-month Python internship applying core language paradigms to real problem statements.',
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'Java', 'JavaScript', 'SQL', 'C', 'C++', 'PHP'],
  },
  {
    label: 'AI, ML & Data',
    items: ['TensorFlow', 'Scikit-learn', 'CNN', 'Random Forest', 'Power BI', 'MySQL'],
  },
  {
    label: 'Web & Motion',
    items: ['HTML5', 'CSS3', 'Flask', 'REST APIs', 'GSAP', 'Three.js', 'Bootstrap'],
  },
  {
    label: 'Tools & Systems',
    items: ['Git & GitHub', 'Linux / Bash', 'VS Code', 'PyCharm', 'Arduino', 'Raspberry Pi'],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'skinshield-ai',
    index: '01',
    title: 'SkinShield AI',
    category: 'AI & ML',
    stack: ['Python', 'TensorFlow', 'CNN', 'Flask'],
    year: '2025',
    tagline: 'CNN-powered dermatological lesion triage through an instant web diagnostic interface.',
    description:
      'Built a Convolutional Neural Network image classification pipeline capable of analyzing skin lesion photographs and returning rapid probability assessments through a responsive Flask web interface.',
    highlights: [
      'Trained and evaluated a deep CNN classifier across key dermatological lesion categories.',
      'Structured the inference backend using clean object-oriented design for unit testing and extensibility.',
      'Deployed publicly on Render with streamlined image preprocessing and instant result cards.',
    ],
    image: '/assets/aistudio/skinshield-ai_2f6e1284.jpg',
    imageAlt: 'SkinShield AI medical skin analysis dashboard',
    githubUrl: 'https://github.com/Govardhana007/SkinShield-AI',
    liveUrl: 'https://skinshield-ai.onrender.com/',
    featured: true,
  },
  {
    id: 'secureurl-ai',
    index: '02',
    title: 'SecureURL AI',
    category: 'AI & ML',
    stack: ['Python', 'Random Forest', 'Scikit-learn', 'Flask'],
    year: '2025',
    tagline: 'Real-time phishing URL detector classifying malicious links across 14 engineered features.',
    description:
      'Designed a Random Forest classification model trained on 14 lexical, structural, and host-based URL security features, paired with a modular Flask REST service for real-time link safety scoring.',
    highlights: [
      'Engineered 14 targeted URL security heuristics optimized with clean data structures.',
      'Built and deployed a modular Flask REST API delivering sub-second phishing risk verdicts.',
      'Calibrated model thresholds and edge-case parsing to minimize false positives on legitimate domains.',
    ],
    image: '/assets/aistudio/secureurl-ai_596cd3a1.jpg',
    imageAlt: 'SecureURL AI phishing URL detection monitor interface',
    githubUrl: 'https://github.com/Govardhana007/SecureURL-AI',
    liveUrl: 'https://secureurl-ai.onrender.com',
    featured: true,
  },
  {
    id: 'brain-tumor-cnn',
    index: '03',
    title: 'Brain Tumor CNN',
    category: 'AI & ML',
    stack: ['Deep Learning', 'TensorFlow', 'CNN', 'Flask'],
    year: '2025',
    tagline: 'Four-class MRI scan classifier for automated neuroimaging screening.',
    description:
      'Developed and tuned a Convolutional Neural Network to classify brain MRI scans into four diagnostic categories, served via a Flask web interface hosted on Hugging Face Spaces.',
    highlights: [
      'Tuned convolutional depth, dropout regularization, and augmentation to sharpen MRI classification accuracy.',
      'Wrapped TensorFlow inference inside an object-oriented Flask pipeline for repeatable testing.',
      'Published an accessible browser interface on Hugging Face Spaces for real-time MRI evaluation.',
    ],
    image: '/assets/aistudio/brain-tumor-cnn_e7dd093c.jpg',
    imageAlt: 'Brain Tumor CNN MRI analysis interface',
    githubUrl: 'https://github.com/Govardhana007/brain-tumor-cnn',
    liveUrl: 'https://huggingface.co/spaces/ramg2366/brain-tumor-cnn',
    featured: true,
  },
  {
    id: 'ecommerce-analysis',
    index: '04',
    title: 'E-commerce Performance BI',
    category: 'Data Analytics',
    stack: ['Python', 'SQL', 'Power BI'],
    year: '2025',
    tagline: 'End-to-end retail telemetry cleaning, RFM segmentation, and cohort retention analytics.',
    description:
      'Transforms noisy transactional order logs into a multi-view analytical dashboard surfacing monthly revenue trends, category return rates, regional performance, and 12-cohort retention matrices.',
    highlights: [
      'Cleaned and normalized raw transactional records using Python and relational SQL queries.',
      'Modeled RFM customer segments (Champions, Loyal, At Risk) alongside cohort retention heatmaps.',
      'Built an interactive Power BI dashboard tracking category margins and geographic revenue split.',
    ],
    image: '/assets/aistudio/ecommerce-analysis_610d0596.jpg',
    imageAlt: 'E-commerce performance dashboard showing revenue, category returns, and cohort retention charts',
    githubUrl: 'https://github.com/Govardhana007/ecommerce_analysis',
  },
  {
    id: 'movie-review',
    index: '05',
    title: 'Movie Review Platform',
    category: 'Full Stack',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
    year: '2024',
    tagline: 'Full-stack cinema catalog and community review portal with authenticated user sessions.',
    description:
      'Developed a full-stack web application where users authenticate, submit film listings, and publish or browse community reviews backed by relational MySQL storage and client-side state.',
    highlights: [
      'Designed normalized MySQL schemas connecting user accounts, film metadata, and review entries.',
      'Implemented responsive catalog cards, user authentication flows, and interactive rating forms.',
    ],
    imageAlt: 'Movie Review full-stack web application interface preview',
    githubUrl: 'https://github.com/Govardhana007/movie-review',
  },
  {
    id: 'weather-app',
    index: '06',
    title: 'Atmosphere Weather App',
    category: 'Full Stack',
    stack: ['JavaScript', 'REST API', 'HTML5', 'CSS3'],
    year: '2024',
    tagline: 'Minimalist real-time city weather and multi-day forecast explorer.',
    description:
      'Responsive weather utility querying live meteorological REST endpoints to present temperature, humidity, wind velocity, and hourly/5-day forecasts in a focused mobile-first layout.',
    highlights: [
      'Integrated asynchronous fetch pipelines with clean loading and invalid-city error handling.',
      'Crafted high-legibility forecast rows for instant scanning across desktop and mobile viewports.',
    ],
    image: '/assets/aistudio/weather-app_15d20a4b.jpg',
    imageAlt: 'Atmosphere Weather App interface showing temperature and 5-day forecast',
    githubUrl: 'https://github.com/Govardhana007/Wheather-app',
  },
];

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'c1',
    title: 'Python Course for Beginners',
    issuer: 'Scaler Topics',
    date: 'April 2025',
    credentialNote: 'Certificate of Excellence · 121 Video Tutorials, 16 Modules & 10 Challenges',
    image: '/assets/aistudio/c1_78a67e81.jpg',
    pdf: '/assets/aistudio/scaler-python_ddf60c95.pdf',
  },
  {
    id: 'c2',
    title: 'Front-End Developer Internship',
    issuer: 'StaxTech',
    date: 'July 2025',
    credentialNote: 'Completion Certificate · Credential ID: STAXP678',
    image: '/assets/aistudio/c2_1718250a.jpg',
    pdf: '/assets/aistudio/staxtech-completion_f6f60e0c.pdf',
  },
  {
    id: 'c3',
    title: 'Internship Joining Letter',
    issuer: 'StaxTech',
    date: 'June 2025',
    credentialNote: 'Official Offer & Batch Program Selection · Front-End Developer Intern',
    image: '/assets/aistudio/c3_d52829f1.jpg',
    pdf: '/assets/aistudio/staxtech-joining_b068e4fe.pdf',
  },
  {
    id: 'c4',
    title: 'Python Programming Internship',
    issuer: 'YBI Foundation',
    date: 'August 2024',
    credentialNote: '1-Month Practical Internship · Credential ID: CVBMNAF3UTFWZ',
    image: '/assets/aistudio/c4_157ab188.jpg',
    pdf: '/assets/aistudio/ybi-python_f7731bbf.pdf',
  },
  {
    id: 'c5',
    title: 'Python Internship',
    issuer: 'InternPe',
    date: 'August 2024',
    credentialNote: 'Hands-on Coding & Mini-Projects Completion',
    image: '/assets/aistudio/c5_42ae6ddc.jpg',
    pdf: '/assets/aistudio/internpe-python_ee666ace.pdf',
  },
  {
    id: 'c6',
    title: '36-Hour Vibeathon Participation',
    issuer: 'Polaris School of Technology × Replit',
    date: '2025',
    credentialNote: '36-Hour Rapid Prototyping & Vibe-Coding Hackathon',
    image: '/assets/aistudio/c6_8d64fcb3.jpg',
    pdf: '/assets/aistudio/polaris-vibeathon_92ff9a5c.pdf',
  },
];
