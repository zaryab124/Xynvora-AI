import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'ADMIN') return apiError('Forbidden', 403);

    return apiSuccess({
      roles: [
        {
          role: "VISITOR",
          type: "Public",
          description: "Unauthenticated guest with read-only access to public pages, research, and application forms.",
          permissions: ["read:public_pages", "read:knowledge", "apply:partnerships"]
        },
        {
          role: "COMMUNITY_MEMBER",
          type: "Member",
          description: "Authenticated platform innovator with profile creation, idea submission, and discussion privileges.",
          permissions: ["create:ideas", "create:posts", "comment", "appreciate", "report:content"]
        },
        {
          role: "CGO",
          type: "Executive",
          description: "Chief Growth Officer. Direct bridge to community, validates idea proposals, and reviews partnerships.",
          permissions: ["review:ideas", "triage:proposals", "endorse:partnerships", "manage:community_initiatives"]
        },
        {
          role: "CEO",
          type: "Executive",
          description: "Chief Executive Officer. Supreme strategic authority, project commissioning, and final partnership signoff.",
          permissions: ["commission:projects", "strategic_signoff:ideas", "authorize:production_launch", "sign:partnerships"]
        },
        {
          role: "CFO",
          type: "Executive",
          description: "Chief Financial Officer. Unit economics modeling, capital allocation, and commercial contract terms.",
          permissions: ["evaluate:unit_economics", "approve:budgets", "evaluate:commercial_terms"]
        },
        {
          role: "DEVELOPER",
          type: "Engineering",
          description: "Core AI engineering squad member. Implements sprint tasks, builds systems, submits benchmarks.",
          permissions: ["view:assigned_projects", "update:tasks", "transition:sprints", "upload:technical_files"]
        },
        {
          role: "COMMUNITY_MODERATOR",
          type: "Moderation",
          description: "Content safety and community policy enforcement.",
          permissions: ["review:reports", "hide:violating_content", "restrict:users", "escalate:violations"]
        },
        {
          role: "ADMIN",
          type: "Technical",
          description: "Technical systems administration, schema management, storage maintenance, and audit surveillance.",
          permissions: ["manage:users", "manage:system_settings", "manage:storage", "view:audit_logs", "view:health"]
        }
      ]
    });
  } catch (error) {
    return handleApiError(error, 'AdminRolesGET');
  }
}
