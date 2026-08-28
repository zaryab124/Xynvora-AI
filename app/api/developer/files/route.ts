import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);

    return apiSuccess({
      files: [
        { id: "f_1", name: "clinical_triage_langgraph_spec.v2.pdf", size: "2.4 MB", type: "PDF Specification", project: "Clinical Triage Autonomous EHR Agent", uploaded_at: new Date().toISOString() },
        { id: "f_2", name: "fhir_hl7_adapter_schema.json", size: "48 KB", type: "JSON Schema", project: "Clinical Triage Autonomous EHR Agent", uploaded_at: new Date(Date.now() - 86400000).toISOString() },
        { id: "f_3", name: "pgvector_route_embeddings_config.yaml", size: "12 KB", type: "YAML Architecture", project: "Logistics Route Optimization Engine", uploaded_at: new Date(Date.now() - 172800000).toISOString() },
      ]
    });
  } catch (error) {
    return handleApiError(error, 'DeveloperFilesGET');
  }
}
