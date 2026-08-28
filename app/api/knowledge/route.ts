// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — SCALABLE KNOWLEDGE REPOSITORY API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';

export const dynamic = 'force-dynamic';

const KNOWLEDGE_ARTICLES = [
  {
    id: "art_1",
    title: "Deterministic State Graphs in Multi-Agent Autonomous Topologies",
    slug: "deterministic-state-graphs-multi-agent",
    category: "Artificial Intelligence",
    author: "Ahmed Khan",
    author_role: "AI Systems Architect",
    date: "2026-03-15",
    read_time: "8 min read",
    difficulty: "Advanced",
    summary: "Mathematical foundations and transactional state checkpoints in orchestrating distributed LangGraph agent fleets.",
    content: "Autonomous multi-agent systems require formal convergence guarantees to prevent cyclical infinite loops and non-deterministic state divergence. In this paper, we demonstrate how directed acyclic state graphs with checkpoint rollback primitives enable robust self-healing agent architectures.",
    tags: ["Agentic AI", "State Machines", "LangGraph", "Distributed Systems"]
  },
  {
    id: "art_2",
    title: "Sub-50ms Event Streaming for High-Throughput Enterprise APIs",
    slug: "sub-50ms-event-streaming-apis",
    category: "Technology",
    author: "Bilal Akhtar",
    author_role: "Principal Infrastructure Lead",
    date: "2026-03-10",
    read_time: "6 min read",
    difficulty: "Intermediate",
    summary: "Architecture patterns for processing 10,000+ simultaneous webhook events using Redis streams and Go microservices.",
    content: "Scalable enterprise automation requires low-latency ingestion pipelines capable of absorbing massive burst traffic. We evaluate Redis Streams versus Apache Kafka for webhook ingestion with sub-50ms response SLAs.",
    tags: ["High Throughput", "Redis Streams", "Go", "Microservices"]
  },
  {
    id: "art_3",
    title: "Protein Folding Prediction & Biomolecular Target Discovery",
    slug: "protein-folding-prediction-biomolecular",
    category: "Science",
    author: "Dr. Elena Rostova",
    author_role: "Computational Biology Lead",
    date: "2026-02-28",
    read_time: "12 min read",
    difficulty: "Advanced",
    summary: "Leveraging 3D structural embeddings and deep transformer architectures for de novo small molecule candidate generation.",
    content: "Deep generative transformers have revolutionized molecular docking and affinity estimation. This research explores equivariant graph neural networks for atomic coordinate modeling.",
    tags: ["Computational Biology", "AlphaFold", "Molecular Docking", "GenAI"]
  },
  {
    id: "art_4",
    title: "Deep Space Telemetry Processing via Autonomous Edge Compute",
    slug: "deep-space-telemetry-edge-compute",
    category: "Space/Cosmos",
    author: "Zain ul Abideen",
    author_role: "Founder & Chief Executive Officer",
    date: "2026-02-14",
    read_time: "10 min read",
    difficulty: "Intermediate",
    summary: "Resilient satellite payload telemetry filtering using quantized neural network models under extreme bandwidth constraints.",
    content: "Interplanetary signal propagation delays necessitate autonomous onboard anomaly detection. We present an 8-bit quantized transformer running on radiation-hardened RISC-V edge silicon.",
    tags: ["Space Tech", "Edge AI", "Satellite Payloads", "Quantization"]
  },
  {
    id: "art_5",
    title: "Open-Access AI Literacy and Adaptive Curriculum Generation",
    slug: "open-access-ai-literacy-curriculum",
    category: "Education",
    author: "Hassan Raza",
    author_role: "Chief Growth Officer",
    date: "2026-01-30",
    read_time: "5 min read",
    difficulty: "Beginner",
    summary: "Empowering underserved youth communities with localized, dynamic STEM learning pathways driven by LLMs.",
    content: "Educational disparities can be narrowed through culturally aligned and dynamically generated learning modules that adjust pacing based on real-time comprehension signals.",
    tags: ["EdTech", "Community Growth", "AI Literacy", "Social Good"]
  },
  {
    id: "art_6",
    title: "Decentralized Venture Incubation & Innovation Pipelines",
    slug: "decentralized-venture-incubation",
    category: "Innovation",
    author: "Sara Malik",
    author_role: "Chief Financial Officer",
    date: "2026-01-18",
    read_time: "7 min read",
    difficulty: "Intermediate",
    summary: "A capital-efficient framework for vetting, funding, and spinning out grassroots community AI initiatives.",
    content: "Traditional venture incubation suffers from bureaucratic bottlenecks and misaligned founder incentives. We outline the mathematical unit economics of community-driven innovation pipelines.",
    tags: ["Venture Architecture", "Unit Economics", "Innovation Pipeline", "Startups"]
  },
  {
    id: "art_7",
    title: "Algorithmic Fairness and Clinical Bias Elimination in EHR Intake",
    slug: "algorithmic-fairness-clinical-bias-ehr",
    category: "Social Impact",
    author: "Amina Farooq",
    author_role: "Lead Ethics & AI Safety Researcher",
    date: "2026-01-05",
    read_time: "9 min read",
    difficulty: "Advanced",
    summary: "Auditing multi-lingual healthcare triage models to eliminate demographic diagnostic disparities.",
    content: "Healthcare machine learning models trained on historical electronic health records often perpetuate systemic socioeconomic diagnostic disparities. We introduce an adversarial debiasing framework.",
    tags: ["AI Safety", "Healthcare Equity", "Ethics", "Social Impact"]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let results = KNOWLEDGE_ARTICLES;

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

    return apiSuccess({ articles: results, categories: [
      "Artificial Intelligence",
      "Technology",
      "Science",
      "Space/Cosmos",
      "Education",
      "Innovation",
      "Social Impact"
    ] });
  } catch (error) {
    return handleApiError(error, 'KnowledgeGET');
  }
}
