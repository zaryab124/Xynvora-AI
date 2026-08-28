// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PUBLIC PROJECTS API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

const DEFAULT_PROJECTS = [
  {
    id: "proj_1",
    name: "OmniHealth AI Clinical Agent",
    slug: "omnihealth-ai-clinical-agent",
    description: "Autonomous HIPAA-compliant triage assistant with multilingual patient intake and real-time EHR integration.",
    category: "Healthcare",
    status: "live",
    progress: 100,
    budget: 45000,
    spent: 42300,
    repo_url: "https://github.com/xynvora-ai/omnihealth-agent",
    live_url: "https://health.xynvora.ai",
    tech_stack: ["Next.js", "FastAPI", "GPT-4o", "PostgreSQL", "Tailwind CSS"],
    impact_metrics: "90% patient satisfaction, 4x faster intake triage",
    client: "MedCare Hospital Group",
    created_at: "2026-01-10T08:00:00Z"
  },
  {
    id: "proj_2",
    name: "OmniChannel WhatsApp Enterprise Bot",
    slug: "omnichannel-whatsapp-enterprise-bot",
    description: "Autonomous customer conversion and conversational order fulfillment engine powering retail and restaurant chains.",
    category: "AI Automation",
    status: "live",
    progress: 100,
    budget: 32000,
    spent: 30500,
    repo_url: "https://github.com/xynvora-ai/whatsapp-commerce",
    live_url: "https://wa.xynvora.ai",
    tech_stack: ["Node.js", "Express", "WhatsApp Cloud API", "LangChain", "Redis"],
    impact_metrics: "500+ daily queries resolved with zero human intervention",
    client: "FoodChain PK",
    created_at: "2026-01-22T11:00:00Z"
  },
  {
    id: "proj_3",
    name: "ShopPredict Demand Intelligence Engine",
    slug: "shoppredict-demand-intelligence-engine",
    description: "Real-time predictive retail analytics with multi-modal stock level forecasting and automatic supplier PO generation.",
    category: "Logistics",
    status: "in_development",
    progress: 78,
    budget: 60000,
    spent: 46800,
    repo_url: "https://github.com/xynvora-ai/shoppredict",
    live_url: "#",
    tech_stack: ["Python", "TensorFlow", "BigQuery", "React", "AWS"],
    impact_metrics: "35% reduction in dead inventory stock",
    client: "ShopSmart Ltd",
    created_at: "2026-02-05T13:30:00Z"
  },
  {
    id: "proj_4",
    name: "PropVision AI Matcher & Virtual Escrow",
    slug: "propvision-ai-matcher-virtual-escrow",
    description: "Property discovery engine combining geospatial computer vision with legal title deed verification.",
    category: "Real Estate",
    status: "in_development",
    progress: 65,
    budget: 50000,
    spent: 32500,
    repo_url: "https://github.com/xynvora-ai/propvision",
    live_url: "#",
    tech_stack: ["Next.js", "Python", "PyTorch", "GCP", "PostgreSQL"],
    impact_metrics: "3x faster property closing speed",
    client: "PropVision Real Estate",
    created_at: "2026-02-18T16:00:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    try {
      let queryStr = `
        SELECT p.id, p.name, p.slug, p.description, p.status, p.progress, p.budget, p.spent,
               p.repo_url, p.live_url, p.created_at, c.name as category
        FROM projects p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE 1=1
      `;
      const params: unknown[] = [];

      if (category && category !== 'All') {
        params.push(category);
        queryStr += ` AND (c.name ILIKE $${params.length} OR c.slug ILIKE $${params.length})`;
      }
      if (status && status !== 'All') {
        params.push(status);
        queryStr += ` AND p.status = $${params.length}`;
      }

      queryStr += ' ORDER BY p.created_at DESC LIMIT 50';

      const res = await query(queryStr, params);
      if (res.rows.length > 0) {
        return apiSuccess({ projects: res.rows });
      }
    } catch {
      // Fallback
    }

    let filtered = [...DEFAULT_PROJECTS];
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    return apiSuccess({ projects: filtered });
  } catch (error) {
    return handleApiError(error, 'PublicProjects');
  }
}
