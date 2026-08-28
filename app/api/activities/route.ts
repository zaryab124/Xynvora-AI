// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — ACTIVITIES & EVENTS API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const ACTIVITIES = [
  {
    id: "act_1",
    title: "Global AI Agent Hackathon 2026",
    slug: "global-ai-agent-hackathon-2026",
    type: "hackathon",
    visibility: "public",
    date: "2026-04-15",
    location: "Virtual & Discord Hub",
    attendees_count: 850,
    description: "48-hour virtual hackathon building autonomous multi-agent systems with \$25,000 in venture pilot grants.",
    host: "Xynvora AI Foundation",
    status: "upcoming"
  },
  {
    id: "act_2",
    title: "Community Innovation AMA with Founder & CEO",
    slug: "community-innovation-ama-ceo",
    type: "town_hall",
    visibility: "public",
    date: "2026-04-02",
    location: "Xynvora Live Stream",
    attendees_count: 420,
    description: "Open Q&A on our 2026 AI Agent roadmap, venture incubation model, and open research initiatives.",
    host: "Muhammad Zaryab Hassan (CEO)",
    status: "upcoming"
  },
  {
    id: "act_3",
    title: "Healthcare EHR Autonomous Integration Workshop",
    slug: "healthcare-ehr-autonomous-integration",
    type: "workshop",
    visibility: "public",
    date: "2026-03-20",
    location: "Virtual Engineering Lab",
    attendees_count: 310,
    description: "Deep dive into FHIR protocols, clinical triage accuracy benchmarks, and HIPAA-compliant agent pipelines.",
    host: "Ahmed Khan & Dr. Elena Rostova",
    status: "completed"
  },
  {
    id: "act_4",
    title: "CGO Ecosystem Ambassador Sprint Q2",
    slug: "cgo-ecosystem-ambassador-sprint-q2",
    type: "cgo_sprint",
    visibility: "internal_cgo",
    date: "2026-04-20",
    location: "CGO Command Center",
    attendees_count: 45,
    description: "Onboarding 30 university ambassadors and regional innovation catalysts.",
    host: "Mahad Aziz (CGO)",
    status: "upcoming"
  },
  {
    id: "act_5",
    title: "Executive Board & Enterprise Partner Summit",
    slug: "executive-board-enterprise-summit",
    type: "ceo_board_event",
    visibility: "internal_ceo",
    date: "2026-05-10",
    location: "Executive Briefing Center",
    attendees_count: 20,
    description: "Reviewing Q2 venture valuations, enterprise pilot deployments, and capital allocations.",
    host: "Muhammad Zaryab Hassan (CEO) & Muhammad Ismail (CFO)",
    status: "upcoming"
  }
];

export async function GET(request: NextRequest) {
  try {
    const user = await auth(request.headers);
    const isExecutive = user && ['CEO', 'CGO', 'CFO', 'ADMIN'].includes(user.role);

    // If public / not executive, strictly filter out internal items
    let results = ACTIVITIES;
    if (!isExecutive) {
      results = results.filter((a) => a.visibility === 'public');
    }

    return apiSuccess({ activities: results });
  } catch (error) {
    return handleApiError(error, 'ActivitiesGET');
  }
}
