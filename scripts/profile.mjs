// Everything personal lives here. Edit this file, run `node scripts/build-svgs.mjs`, commit.

export const USER = 'amirshahzadhashmi7145';
export const SITE = 'https://amirshahzadhashmi.com';

export const HERO = {
  name: 'Amir Shahzad Hashmi',
  eyebrow: '$ whoami',
  lead: 'I build',
  // Rotates in the hero, one at a time.
  phrases: [
    'LLM agents that ship to production.',
    'RAG pipelines with evals before release.',
    'RLHF benchmark tasks and graders.',
    'automation that replaces manual work.',
  ],
  meta: 'AI engineer · Python first · amirshahzadhashmi.com',
  tagline: 'Building for real users since 2021. Open to AI engineering roles and open source.',
};

export const NAV = [
  { n: '01', label: 'About', anchor: 'about' },
  { n: '02', label: 'Stack', anchor: 'stack' },
  { n: '03', label: 'Projects', anchor: 'projects' },
  { n: '04', label: 'Activity', anchor: 'activity' },
  { n: '05', label: 'Contact', anchor: 'contact' },
];

export const HEADERS = {
  about: { n: '01', title: 'About me', sub: 'What I build and how I work' },
  stack: { n: '02', title: 'Tech stack', sub: 'The tools I reach for' },
  projects: { n: '03', title: 'Featured projects', sub: 'Things I have built and shipped' },
  activity: { n: '04', title: 'GitHub activity', sub: 'Live from the contribution graph' },
  contact: { n: '05', title: "Let's work together", sub: 'Roles, contracts and open source' },
};

export const ABOUT_INTRO = 'AI engineer working mostly in **Python**. I build LLM-powered systems: **agents, RAG pipelines, evaluation infrastructure** and the automation around them. Working professionally since 2021, currently as a full-stack automation engineer, with freelance projects on the side.';

export const ABOUT_TILES = {
  main: {
    eyebrow: 'NOW · IN PRODUCTION',
    title: 'Agentic RAG',
    body: 'A hierarchical agent that answers from real documents and structured data. Retrieval routing, escalation to humans, and evals before anything ships.',
    icon: 'brain-circuit',
  },
  small: [
    { eyebrow: 'EVALS · RLHF', title: 'Model evaluation', body: 'Benchmark tasks and grading infrastructure used to train and test LLMs, including agentic tasks with automated graders.', icon: 'flask-conical' },
    { eyebrow: 'I CARE ABOUT', title: 'Plain Python first', body: 'No framework layer that does not earn its keep. Tests and evals before release. Automation that removes work people did by hand.', icon: 'shield-check' },
  ],
  wide: { eyebrow: 'OPEN TO', title: 'AI engineering roles, contracts and open source', body: 'Getting involved in open source LLM tooling. If you maintain something in that space and could use a hand, my inbox is open.', icon: 'git-pull-request' },
};

// Stack marquee. `brand` is a Simple Icons slug, `icon` a Lucide name for things without a logo.
export const STACK = [
  { cat: 'AI & LLM', items: [
    { label: 'Python', brand: 'python' },
    { label: 'Anthropic', brand: 'anthropic' },
    { label: 'OpenAI', icon: 'sparkles' },
    { label: 'RAG / embeddings', icon: 'database-zap' },
    { label: 'Agents & tools', icon: 'bot' },
    { label: 'Evals', icon: 'flask-conical' },
    { label: 'MCP', brand: 'modelcontextprotocol' },
    { label: 'Pydantic', brand: 'pydantic' },
    { label: 'Jupyter', brand: 'jupyter' },
  ] },
  { cat: 'Backend & data', items: [
    { label: 'FastAPI', brand: 'fastapi' },
    { label: 'Node.js', brand: 'nodedotjs' },
    { label: 'TypeScript', brand: 'typescript' },
    { label: 'Express', brand: 'express' },
    { label: 'PostgreSQL', brand: 'postgresql' },
    { label: 'MongoDB', brand: 'mongodb' },
    { label: 'MySQL', brand: 'mysql' },
    { label: 'SQLite', brand: 'sqlite' },
    { label: 'Socket.IO', brand: 'socketdotio' },
  ] },
  { cat: 'Frontend & apps', items: [
    { label: 'React', brand: 'react' },
    { label: 'JavaScript', brand: 'javascript' },
    { label: 'HTML5', brand: 'html5' },
    { label: 'CSS', brand: 'css' },
    { label: 'Go', brand: 'go' },
    { label: 'WebAssembly', brand: 'webassembly' },
    { label: 'Chrome extensions', brand: 'googlechrome' },
  ] },
  { cat: 'Ship & automate', items: [
    { label: 'Docker', brand: 'docker' },
    { label: 'GitHub Actions', brand: 'githubactions' },
    { label: 'Git', brand: 'git' },
    { label: 'Linux', brand: 'linux' },
    { label: 'Bash', brand: 'gnubash' },
    { label: 'n8n', brand: 'n8n' },
    { label: 'Webhooks & APIs', icon: 'plug-zap' },
    { label: 'Freqtrade', icon: 'chart-candlestick' },
  ] },
];

export const FEATURE = {
  key: 'atelier',
  n: '01',
  kicker: 'AGENT ORCHESTRATION · FLAGSHIP',
  title: 'Atelier',
  tag: 'From a product description to reviewed pull requests.',
  body: 'An orchestration platform that turns a one-paragraph product description into requirements, tasks, code, tests and reviewed pull requests. Agents work in isolated folders, and every task is routed through one function, so a supervisor can slot in later.',
  chips: ['Python', 'FastAPI', 'OpenAI', 'Alembic', 'Next.js', 'Agents'],
  status: { label: 'In development', live: false },
  repo: 'https://github.com/amirshahzadhashmi7145/atelier',
  icon: 'workflow',
  links: [
    { key: 'repo', label: 'Atelier repository', sub: 'github.com', href: 'https://github.com/amirshahzadhashmi7145/atelier', icon: 'folder-git-2' },
    { key: 'v2', label: 'Atelier V2 (Agent Studio)', sub: 'newest branch of the idea', href: 'https://github.com/amirshahzadhashmi7145/Atelier-V2', icon: 'rocket' },
  ],
};

export const CARDS = [
  { key: 'agentrewind', n: '02', kicker: 'DEVTOOLS · AGENTS', title: 'AgentRewind', icon: 'rewind',
    body: 'Record, inspect and replay agent runs so you can debug one bad decision without rerunning the whole thing. A small Python SDK wraps LLM and tool calls as spans.',
    chips: ['Python', 'SDK', 'Tracing', 'React'], status: { label: 'Active', live: true },
    href: 'https://github.com/amirshahzadhashmi7145/agentrewind' },
  { key: 'dbport', n: '03', kicker: 'DATA · SELF-HOSTED', title: 'DBPort', icon: 'database',
    body: 'Connect to any database with credentials and browse, query and edit it with no setup code. Introspects schemas for PostgreSQL, MySQL, SQLite, SQL Server and MongoDB.',
    chips: ['Python', 'SQL', 'MongoDB', 'React'], status: { label: 'Active', live: true },
    href: 'https://github.com/amirshahzadhashmi7145/dbport' },
  { key: 'nexjob', n: '04', kicker: 'BROWSER · LLM', title: 'NexJob', icon: 'app-window',
    body: 'A Chrome extension that fills any job-application form from your saved profile. The LLM only does semantic field matching, so it works on sites it has never seen. Keys stay in the browser.',
    chips: ['JavaScript', 'Chrome', 'OpenAI'], status: { label: 'Usable', live: false },
    href: 'https://github.com/amirshahzadhashmi7145/NexJob' },
  { key: 'ryxogo', n: '05', kicker: 'FRAMEWORK · GO', title: 'RyxoGo', icon: 'blocks',
    body: 'A Go-first frontend framework that compiles to WebAssembly. Signals, components, routing, SSR, i18n and an MCP server so AI tools can drive it.',
    chips: ['Go', 'WebAssembly', 'MCP'], status: { label: 'Experimental', live: false },
    href: 'https://github.com/amirshahzadhashmi7145/ryxogo' },
  { key: 'tradebot', n: '06', kicker: 'TRADING · AUTOMATION', title: 'Trend bot', icon: 'chart-candlestick',
    body: 'A trend-following crypto bot (Donchian breakout, 4h timeframe) on Freqtrade in Docker, plus a news-watcher service that uses LLM classification to pause trading around macro events.',
    chips: ['Python', 'Freqtrade', 'Docker', 'LLM'], status: { label: 'Dry-run', live: true },
    href: null },
  { key: 'dai', n: '07', kicker: 'OPEN SOURCE · CONTRIBUTOR', title: '.dai', icon: 'git-merge',
    body: 'An open plain-text format for AI memory. Two merged upstream PRs: keep setup-written files out of git repos, and a clearer hint after a skipped history conversion.',
    chips: ['Open source', 'MCP', 'CLI'], status: { label: '2 PRs merged', live: false },
    href: 'https://github.com/Kerneta/daidocs' },
];

export const CTA = {
  pill: 'AVAILABLE FOR WORK',
  headline: ["Let's", 'ship', 'something', 'that', 'works.'],
  accentWord: 'works.',
  sub: 'AI engineering roles · contracts · open source · Islamabad, remote-friendly',
  button: 'Connect on LinkedIn',
  href: 'https://www.linkedin.com/in/amir-shahzad-hashmi/',
};

export const SOCIAL = [
  { key: 'linkedin', label: 'LinkedIn', sub: 'amir-shahzad-hashmi', href: 'https://www.linkedin.com/in/amir-shahzad-hashmi/', icon: 'linkedin-glyph', color: '#0A66C2' },
  { key: 'email', label: 'Email', sub: 'gmail · say hello', href: 'mailto:amirshahzadhashmi7145@gmail.com', icon: 'mail', color: '#EA4335' },
  { key: 'portfolio', label: 'Portfolio', sub: 'amirshahzadhashmi.com', href: 'https://amirshahzadhashmi.com', icon: 'globe', color: null },
  { key: 'leetcode', label: 'LeetCode', sub: 'daily problems', href: 'https://leetcode.com/amirshahzadhashmi7145/', icon: 'leetcode', color: '#FFA116' },
];
