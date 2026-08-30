// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — SCALABLE KNOWLEDGE & SOCIAL IMPACT REPOSITORY
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auth } from '@/lib/server/auth';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  author_role: string;
  date: string;
  read_time: string;
  difficulty: string;
  summary: string;
  content: string;
  image_url?: string;
  tags: string[];
}

// Global In-Memory Store for dynamically published articles
declare global {
  // eslint-disable-next-line no-var
  var _knowledgeArticles: KnowledgeArticle[] | undefined;
}

const DEFAULT_ARTICLES: KnowledgeArticle[] = [
  {
    id: "art_social_1",
    title: "AI for Universal Healthcare Access & Community Diagnostic Triage",
    slug: "ai-universal-healthcare-access-community-triage",
    category: "Social Impact",
    author: "Musfeera Kiran",
    author_role: "Community Moderator & Health Advocate",
    date: "2026-03-28",
    read_time: "7 min read",
    difficulty: "Intermediate",
    summary: "Deploying low-bandwidth clinical triage agents across rural medical outposts to reduce mortality rates and bridge critical diagnostic gaps.",
    content: "Healthcare disparities in rural and underserved regions can be dramatically reduced through localized edge AI models that operate entirely offline on solar-powered tablets. This initiative details our clinical triage framework deployed across 14 community health centers.",
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Healthcare Equity", "Rural Health", "Social Impact", "Edge AI"]
  },
  {
    id: "art_social_2",
    title: "Clean Energy Microgrids & Autonomous Climate Optimization",
    slug: "clean-energy-microgrids-autonomous-climate-optimization",
    category: "Social Impact",
    author: "Mahad Aziz",
    author_role: "Chief Growth Officer",
    date: "2026-03-20",
    read_time: "6 min read",
    difficulty: "Intermediate",
    summary: "Optimizing renewable energy distribution across decentralized municipal microgrids using predictive reinforcement learning agents.",
    content: "Climate resilience requires smart decentralized energy management. Our autonomous agent fleet balances battery storage, solar generation spikes, and municipal demand in real-time, reducing grid carbon footprints by up to 34%.",
    image_url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Clean Tech", "Renewable Energy", "Climate Action", "Sustainability"]
  },
  {
    id: "art_1",
    title: "Deterministic State Graphs in Multi-Agent Autonomous Topologies",
    slug: "deterministic-state-graphs-multi-agent",
    category: "Artificial Intelligence",
    author: "Mohib",
    author_role: "Software Head & Lead Architect",
    date: "2026-03-15",
    read_time: "8 min read",
    difficulty: "Advanced",
    summary: "Mathematical foundations and transactional state checkpoints in orchestrating distributed LangGraph agent fleets.",
    content: "Autonomous multi-agent systems require formal convergence guarantees to prevent cyclical infinite loops and non-deterministic state divergence. In this paper, we demonstrate how directed acyclic state graphs with checkpoint rollback primitives enable robust self-healing agent architectures.",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Agentic AI", "State Machines", "LangGraph", "Distributed Systems"]
  },
  {
    id: "art_2",
    title: "Embedded IoT Edge Compute for Real-Time Sensor Telemetry",
    slug: "embedded-iot-edge-compute-sensor-telemetry",
    category: "Technology",
    author: "Musab",
    author_role: "Embedded Technologies Head",
    date: "2026-03-10",
    read_time: "6 min read",
    difficulty: "Intermediate",
    summary: "Hardware acceleration patterns for microcontrollers running 8-bit quantized neural networks on edge sensors.",
    content: "Hardware-constrained embedded environments demand extreme power and memory efficiency. We evaluate ARM Cortex-M and RISC-V edge silicon processing sensor arrays with sub-5ms latency and zero cloud dependency.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tags: ["Embedded Tech", "IoT Edge", "Firmware", "Hardware"]
  },
  {
    id: "art_3",
    title: "Protein Folding Prediction & Biomolecular Target Discovery",
    slug: "protein-folding-prediction-biomolecular",
    category: "Science",
    author: "Dr. Elena Rostova",
    author_role: "Computational Biology Fellow",
    date: "2026-02-28",
    read_time: "12 min read",
    difficulty: "Advanced",
    summary: "Leveraging 3D structural embeddings and deep transformer architectures for de novo small molecule candidate generation.",
    content: "Deep generative transformers have revolutionized molecular docking and affinity estimation. This research explores equivariant graph neural networks for atomic coordinate modeling.",
    image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    tags: ["Computational Biology", "AlphaFold", "Molecular Docking", "GenAI"]
  },
  {
    id: "art_4",
    title: "Deep Space Telemetry Processing via Autonomous Edge Compute",
    slug: "deep-space-telemetry-edge-compute",
    category: "Space/Cosmos",
    author: "Muhammad Zaryab Hassan",
    author_role: "Founder & Chief Executive Officer",
    date: "2026-02-14",
    read_time: "10 min read",
    difficulty: "Intermediate",
    summary: "Resilient satellite payload telemetry filtering using quantized neural network models under extreme bandwidth constraints.",
    content: "Interplanetary signal propagation delays necessitate autonomous onboard anomaly detection. We present an 8-bit quantized transformer running on radiation-hardened RISC-V edge silicon.",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Space Tech", "Edge AI", "Satellite Payloads", "Quantization"]
  },
  {
    id: "art_5",
    title: "Open-Access AI Literacy and Adaptive Curriculum Generation",
    slug: "open-access-ai-literacy-curriculum",
    category: "Education",
    author: "Mahad Aziz",
    author_role: "Chief Growth Officer",
    date: "2026-01-30",
    read_time: "5 min read",
    difficulty: "Beginner",
    summary: "Empowering underserved youth communities with localized, dynamic STEM learning pathways driven by LLMs.",
    content: "Educational disparities can be narrowed through culturally aligned and dynamically generated learning modules that adjust pacing based on real-time comprehension signals.",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    tags: ["EdTech", "Community Growth", "AI Literacy", "Social Good"]
  },
  {
    id: "art_6",
    title: "Decentralized Venture Incubation & Innovation Pipelines",
    slug: "decentralized-venture-incubation",
    category: "Innovation",
    author: "Muhammad Ismail",
    author_role: "Chief Financial Officer",
    date: "2026-01-18",
    read_time: "7 min read",
    difficulty: "Intermediate",
    summary: "A capital-efficient framework for vetting, funding, and spinning out grassroots community AI initiatives.",
    content: "Traditional venture incubation suffers from bureaucratic bottlenecks and misaligned founder incentives. We outline the mathematical unit economics of community-driven innovation pipelines.",
    image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    tags: ["Venture Architecture", "Unit Economics", "Innovation Pipeline", "Startups"]
  }
];

if (!globalThis._knowledgeArticles) {
  globalThis._knowledgeArticles = [...DEFAULT_ARTICLES];
}

const PUBLISH_SCHEMA = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum([
    'Social Impact',
    'Artificial Intelligence',
    'Technology',
    'Science',
    'Space/Cosmos',
    'Education',
    'Innovation'
  ]),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  image_url: z.string().url('Valid image URL required').optional().or(z.literal('')),
  tags: z.array(z.string()).default(['Social Impact', 'Community']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let results = globalThis._knowledgeArticles || DEFAULT_ARTICLES;

    if (category && category !== 'All') {
      results = results.filter(
        (a) => a.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return apiSuccess({
      articles: results,
      categories: [
        "Social Impact",
        "Artificial Intelligence",
        "Technology",
        "Science",
        "Space/Cosmos",
        "Education",
        "Innovation"
      ]
    });
  } catch (error) {
    return handleApiError(error, 'KnowledgeGET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await auth(request.headers);
    const body = await request.json();
    const validated = await validateInputAsync(PUBLISH_SCHEMA, body);

    const newArticle: KnowledgeArticle = {
      id: 'art_' + Date.now(),
      title: validated.title,
      slug: validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: validated.category,
      author: user?.full_name || 'Community Contributor',
      author_role: user?.position || user?.role || 'Community Fellow',
      date: new Date().toISOString().split('T')[0],
      read_time: `${Math.max(3, Math.ceil(validated.content.split(' ').length / 150))} min read`,
      difficulty: validated.difficulty || 'Intermediate',
      summary: validated.summary,
      content: validated.content,
      image_url: validated.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      tags: (validated.tags && validated.tags.length > 0) ? validated.tags : ['Social Impact', 'Innovation'],
    };

    if (!globalThis._knowledgeArticles) {
      globalThis._knowledgeArticles = [...DEFAULT_ARTICLES];
    }
    globalThis._knowledgeArticles.unshift(newArticle);

    return apiSuccess({ article: newArticle, message: 'Article published successfully!' });
  } catch (error) {
    return handleApiError(error, 'KnowledgePOST');
  }
}
