// ─────────────────────────────────────────────
// data/index.ts  –  All static site data
// ─────────────────────────────────────────────

export const STATS = [
  { value: "120+", label: "Projects Completed" },
  { value: "85+",  label: "Active Clients" },
  { value: "40+",  label: "AI Agents Deployed" },
  { value: "18",   label: "Team Members" },
];

export const SERVICES = [
  { icon: "🤖", title: "AI Agents",           desc: "Autonomous intelligent agents that handle complex workflows end-to-end.",     color: "#00d4ff" },
  { icon: "💬", title: "WhatsApp Automation", desc: "Smart bots that engage customers 24/7 across messaging platforms.",           color: "#25d366" },
  { icon: "🌐", title: "Website Development", desc: "High-performance web apps built with cutting-edge frameworks.",               color: "#7c3aed" },
  { icon: "☁️", title: "Cloud Deployment",    desc: "Scalable infrastructure on AWS, Azure and Google Cloud.",                    color: "#f59e0b" },
  { icon: "📊", title: "Data Analytics",      desc: "Turn raw data into actionable business intelligence.",                       color: "#ef4444" },
  { icon: "🧠", title: "AI Chatbots",         desc: "Context-aware conversational AI for seamless customer experiences.",         color: "#10b981" },
];

export const LEADERSHIP = [
  {
    name: "Zain ul Abideen",
    role: "Chief Executive Officer",
    emoji: "👨‍💼",
    colorFrom: "#06b6d4",
    colorTo: "#2563eb",
    message: "Our goal is to help businesses automate intelligently and grow efficiently through AI. We believe every company, regardless of size, deserves access to transformative technology.",
    responsibilities: ["Company Vision", "Strategic Direction", "Partnerships"],
  },
  {
    name: "Sara Malik",
    role: "Chief Financial Officer",
    emoji: "👩‍💼",
    colorFrom: "#a855f7",
    colorTo: "#db2777",
    message: "Financial discipline and operational excellence are the backbone of sustainable growth. We build systems that scale without compromising stability.",
    responsibilities: ["Finance", "Operations", "Risk Management"],
  },
  {
    name: "Hassan Raza",
    role: "Chief Growth Officer",
    emoji: "🧑‍💼",
    colorFrom: "#10b981",
    colorTo: "#0891b2",
    message: "Growth is not just about numbers — it is about building meaningful relationships and creating value that compounds over time.",
    responsibilities: ["Growth Strategy", "Business Development", "Marketing"],
  },
];

export const TEAM = [
  { name: "Ahmed Khan",      role: "AI Engineer",    skills: ["Python", "ML", "AWS"],              emoji: "👨‍💻", color: "#00d4ff" },
  { name: "Fatima Noor",     role: "Frontend Dev",   skills: ["React", "Tailwind", "Figma"],       emoji: "👩‍🎨", color: "#a855f7" },
  { name: "Bilal Akhtar",    role: "Backend Dev",    skills: ["Node.js", "Express", "PostgreSQL"], emoji: "👨‍🔧", color: "#f59e0b" },
  { name: "Ayesha Siddiqui", role: "Data Scientist", skills: ["TensorFlow", "Python", "BI"],       emoji: "👩‍🔬", color: "#10b981" },
  { name: "Umar Farooq",     role: "DevOps Engineer",skills: ["AWS", "Docker", "CI/CD"],           emoji: "👨‍🚀", color: "#ef4444" },
  { name: "Zara Ali",        role: "Product Manager",skills: ["Strategy", "Agile", "UX"],          emoji: "👩‍💼", color: "#ec4899" },
];

export const PORTFOLIO = [
  { title: "Restaurant AI Agent",      client: "FoodChain PK",   desc: "End-to-end WhatsApp ordering system with AI menu suggestions and order tracking.",            tech: ["Node.js", "WhatsApp API", "OpenAI"], result: "70% reduction in support workload", emoji: "🍽️", color: "#f59e0b", demoUrl: "#" },
  { title: "E-commerce Intelligence",  client: "ShopSmart Ltd",  desc: "Predictive analytics dashboard with demand forecasting and inventory optimization.",           tech: ["Python", "TensorFlow", "AWS"],       result: "35% increase in revenue",           emoji: "🛒", color: "#00d4ff", demoUrl: "#" },
  { title: "Healthcare Chatbot",       client: "MedCare Hospital",desc: "Appointment scheduling and symptom triage bot with multilingual support.",                   tech: ["GPT-4", "React", "PostgreSQL"],      result: "90% patient satisfaction",          emoji: "🏥", color: "#10b981", demoUrl: "#" },
  { title: "Real Estate Platform",     client: "PropVision",     desc: "AI-powered property matching and virtual tour recommendation engine.",                        tech: ["Next.js", "Python", "GCP"],          result: "3x faster lead conversion",         emoji: "🏢", color: "#a855f7", demoUrl: "#" },
];

export const SOLUTIONS = [
  { label: "Healthcare",  emoji: "🏥", color: "#10b981" },
  { label: "Education",   emoji: "🎓", color: "#3b82f6" },
  { label: "E-commerce",  emoji: "🛒", color: "#f59e0b" },
  { label: "Real Estate", emoji: "🏢", color: "#a855f7" },
  { label: "Restaurants", emoji: "🍽️", color: "#ef4444" },
  { label: "Logistics",   emoji: "🚚", color: "#06b6d4" },
];

export const RESEARCH = [
  { title: "Agentic AI: The Next Frontier",               category: "Agentic AI",      author: "Ahmed Khan",      date: "May 2025", emoji: "🧠", color: "#00d4ff" },
  { title: "LLM Fine-tuning for Business Use Cases",      category: "Machine Learning", author: "Ayesha Siddiqui", date: "Mar 2025", emoji: "⚙️", color: "#a855f7" },
  { title: "WhatsApp as a Business Intelligence Channel", category: "Automation",       author: "Zain ul Abideen",date: "Jan 2025", emoji: "💬", color: "#25d366" },
];

export const ROADMAP = [
  { quarter: "Q2 2025", tasks: [{ label: "Core AI Platform",     done: true  }, { label: "Client Onboarding Portal", done: true  }] },
  { quarter: "Q3 2026", tasks: [{ label: "WhatsApp AI Platform", done: false }, { label: "Client Dashboard",         done: false }] },
  { quarter: "Q4 2026", tasks: [{ label: "Voice AI Agent",       done: false }, { label: "AI CRM",                   done: false }, { label: "Mobile App",    done: false }] },
  { quarter: "Q1 2027", tasks: [{ label: "Global Expansion",     done: false }, { label: "Enterprise Tier",          done: false }] },
];

export const TESTIMONIALS = [
  { name: "Amjad Sheikh",      company: "FoodChain PK",    text: "Xynvora AI transformed our customer support. The WhatsApp bot handles 500+ queries daily without human intervention.", rating: 5 },
  { name: "Nadia Hussain",     company: "ShopSmart Ltd",   text: "Their analytics dashboard gave us insights we never knew existed. Revenue went up 35% in the first quarter after deployment.", rating: 5 },
  { name: "Dr. Tariq Mehmood", company: "MedCare Hospital",text: "The AI chatbot integration was seamless and patients love it. Appointment bookings increased by 60% since launch.", rating: 5 },
];

export const CAREERS = [
  { title: "AI Engineer",        type: "Full-time", location: "Lahore / Remote",  color: "#00d4ff" },
  { title: "Frontend Developer", type: "Full-time", location: "Lahore",           color: "#a855f7" },
  { title: "Sales Executive",    type: "Full-time", location: "Karachi / Remote", color: "#f59e0b" },
];

export const GALLERY_ITEMS = [
  { label: "Team Kickoff 2025", emoji: "🚀", color: "#00d4ff", cat: "Events"      },
  { label: "Client Workshop",   emoji: "📋", color: "#a855f7", cat: "Meetings"    },
  { label: "AI Demo Day",       emoji: "🤖", color: "#10b981", cat: "Conferences" },
  { label: "Office Setup",      emoji: "🏢", color: "#f59e0b", cat: "Office"      },
  { label: "Dev Sprint",        emoji: "💻", color: "#ef4444", cat: "Events"      },
  { label: "Strategy Session",  emoji: "🧩", color: "#06b6d4", cat: "Meetings"    },
];

export const NAV_LINKS = [
  { href: "/",             label: "Home"        },
  { href: "/about",        label: "About"       },
  { href: "/leadership",   label: "Leadership"  },
  { href: "/team",         label: "Team"        },
  { href: "/services",     label: "Services"    },
  { href: "/portfolio",    label: "Portfolio"   },
  { href: "/solutions",    label: "Solutions"   },
  { href: "/research",     label: "Research"    },
  { href: "/roadmap",      label: "Roadmap"     },
  { href: "/gallery",      label: "Gallery"     },
  { href: "/testimonials", label: "Reviews"     },
  { href: "/careers",      label: "Careers"     },
  { href: "/contact",      label: "Contact"     },
];
