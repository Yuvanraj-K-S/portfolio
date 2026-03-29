export const siteConfig = {
  name: "Yuvanraj K S",
  role: "Full Stack Developer + ML Engineer",
  punchline: "I write code that ships and solve problems that stuck.",
  email: "yuvanraj.ks@gmail.com",
  github: "https://github.com/Yuvanraj-K-S",
  linkedin: "https://linkedin.com/in/Yuvanraj-K-S",
  codolio: "https://codolio.com/profile/yuvanraj",
  phone: "+91 9345160872",
  location: "Coimbatore, Tamil Nadu",
  resumeUrl: "/resume.pdf",
};

export const stats = [
  { value: 350,  suffix: "+", label: "Problems Solved" },
  { value: 8,    suffix: "",  label: "Projects Built" },
  { value: 1757, suffix: "",  label: "LeetCode Rating" },
  { value: 3,    suffix: "",  label: "Internships" },
];

export const bio = [
  "B.E. Computer Science (AI & ML specialization) at KIT, Coimbatore. CGPA 8.51. Currently interning at Schneider Electric building industrial document intelligence pipelines on Azure.",
  "I work across the full stack — React frontends, Node/FastAPI backends, ML models in PyTorch and TensorFlow, and cloud deployments on Azure and Vercel. I care about one thing: does it actually work in production?",
];

export const projects = [
  {
    id: "1",
    title: "ThreatLock",
    description: "Real-time malicious URL detector. Character-level CNN trained on labeled URL dataset. Deployed as a Flask REST API + Chrome Extension (MV3) that intercepts navigation and blocks threats within 100ms end-to-end.",
    tech: ["Python", "TensorFlow", "Flask", "Chrome Extension MV3"],
    purpose: "Built to protect everyday users from phishing and malware URLs without needing any manual intervention. The goal was sub-100ms detection so the browsing experience stays seamless.",
    category: "ML",
    github: "https://github.com/Yuvanraj-K-S",
    live: "",
    status: "Live",
  },
  {
    id: "2",
    title: "FairAI",
    description: "ML bias evaluation platform. Audits models for demographic parity, equal opportunity difference, and disparate impact. Multi-framework inference backend (PyTorch, TensorFlow, ONNX) secured with JWT + MongoDB.",
    tech: ["Python", "PyTorch", "TensorFlow", "ONNX", "React", "Flask", "MongoDB"],
    purpose: "Tackles the growing problem of algorithmic bias in production ML systems. Intended to help data scientists identify and fix unfairness in their models before deployment.",
    category: "ML",
    github: "https://github.com/Yuvanraj-K-S",
    live: "",
    status: "Live",
  },
  {
    id: "3",
    title: "CattleGuard",
    description: "AI livestock health monitor. Classifies health from physiological sensor data. 3-service Docker stack — ML API, Node.js + MongoDB backend, React frontend — with IoT layer for wearable cattle-collar sensors.",
    tech: ["Python", "Flask", "React", "Node.js", "MongoDB", "Docker", "Scikit-learn"],
    purpose: "Designed to reduce economic losses in livestock farming through early disease detection. Brings modern ML to agricultural IoT, helping farmers act before conditions worsen.",
    category: "Full Stack",
    github: "https://github.com/Yuvanraj-K-S",
    live: "",
    status: "Live",
  },
  {
    id: "4",
    title: "Industrial Document Intelligence",
    description: "End-to-end pipeline on Azure: ingests image batches or video, runs object detection, crops label regions, extracts structured text via Azure Document Intelligence. Replaced hours of manual work per batch.",
    tech: ["Azure", "Python", "Document Intelligence", "OpenAI"],
    purpose: "Eliminates repetitive manual data extraction from industrial equipment labels. A single pipeline run replaces hours of human effort per batch, improving accuracy and auditability.",
    category: "ML",
    github: "",
    live: "",
    status: "Production",
  },
  {
    id: "5",
    title: "RAG Internal Chatbot",
    description: "RAG-powered chatbot using Azure OpenAI and Azure AI Search. Lets engineers query plant manuals and compliance documents in plain English instead of searching through files manually.",
    tech: ["Azure OpenAI", "LangChain", "FAISS", "Python"],
    purpose: "Solves knowledge accessibility inside large industrial organizations. Engineers can query years of documentation in seconds rather than spending hours reading manuals.",
    category: "ML",
    github: "",
    live: "",
    status: "Production",
  },
  {
    id: "6",
    title: "LearnLogicify Web Apps",
    description: "Designed and delivered 2–3 responsive web applications with dynamic REST API integration. Built shared component libraries reused across projects, ensuring visual consistency.",
    tech: ["React", "JavaScript", "HTML", "CSS", "REST APIs"],
    purpose: "Delivered client-facing web products for an EdTech company. Focus was on reusable components and clean API integration that developers could extend without rework.",
    category: "Full Stack",
    github: "",
    live: "",
    status: "Delivered",
  },
];

export const skills = {
  Languages:  ["C", "C++", "Python", "Java", "JavaScript"],
  Frontend:   ["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  Backend:    ["Node.js", "FastAPI", "Flask", "REST APIs", "MongoDB"],
  "ML / AI":  ["PyTorch", "TensorFlow", "Scikit-learn", "ONNX", "HuggingFace"],
  NLP:        ["NLTK", "spaCy", "LangChain", "FAISS", "sentence-transformers"],
  Cloud:      ["Azure OpenAI", "Azure AI Search", "Cosmos DB", "Vercel", "Docker"],
};

export const experience = [
  {
    id: "1",
    role: "Intern",
    company: "Schneider Electric",
    location: "Coimbatore",
    duration: "Nov 2025 — Present",
    description: [
      "Built end-to-end industrial document intelligence pipeline on Azure — ingests image batches or video, runs object detection, crops label regions, extracts structured text via Azure Document Intelligence",
      "Automated confidence-scored audit report generation validating extracted text against ground-truth database — cut per-batch verification from hours to minutes",
      "Built RAG-powered internal chatbot using Azure OpenAI and Azure AI Search for querying plant manuals in plain English",
      "Wrote Excel macros to automate recurring data-extraction tasks across operational teams",
    ],
  },
  {
    id: "2",
    role: "Full Stack Development Intern",
    company: "LearnLogicify Technologies LLP",
    location: "Remote",
    duration: "Jun 2025",
    description: [
      "Designed and delivered 2–3 responsive web applications using React.js with dynamic REST API integration and mobile-friendly UI",
      "Built shared component libraries reused across projects, reducing redundant code and ensuring visual consistency",
    ],
  },
];

export const certifications = [
  { id: "1", name: "Get Started with Python",                    issuer: "Google",    year: "2024" },
  { id: "2", name: "Version Control with Git",                   issuer: "Atlassian", year: "2024" },
  { id: "3", name: "Exploratory Data Analysis with Seaborn",     issuer: "Coursera",  year: "2024" },
  { id: "4", name: "Python for Data Analysis: Pandas & NumPy",   issuer: "Coursera",  year: "2024" },
  { id: "5", name: "Introduction to Artificial Intelligence",    issuer: "IBM",        year: "2024" },
];

export const achievements = [
  { id: "1", title: "ABB Hackathon Finalist",              description: "Shortlisted among top teams out of hundreds in ABB's national-level engineering innovation hackathon.", date: "2025" },
  { id: "2", title: "1st Place — Coding Contest, KPRIET",  description: "Won first prize at the inter-college competitive programming contest.",                               date: "2025" },
  { id: "3", title: "1st Place — Code Debugging, Sri Shakthi", description: "First place in the debugging event across multiple competing colleges.",                        date: "2025" },
  { id: "4", title: "LeetCode Top 14%",                    description: "Rating 1757. Solved 350+ problems. Ranked top 14% globally among 500K+ active users. 3 badges.",    date: "2024" },
  { id: "5", title: "CodeChef 3 Star",                     description: "Rating 1629. Solved 200+ problems on CodeChef.",                                                     date: "2024" },
];

export const competitive = {
  leetcode: { handle: "YUVANRAJ_01", rating: 1757, solved: 350, rank: "Top 14%", badges: 3 },
  codechef: { handle: "kit23bam063", rating: 1629, stars: 3,    solved: 200 },
};
