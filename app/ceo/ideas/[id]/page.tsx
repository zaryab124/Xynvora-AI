"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function CeoIdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [idea, setIdea] = useState<any>(null);
  const [cfoEval, setCfoEval] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Commission Project Modal State
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectBudget, setProjectBudget] = useState(50000);
  const [commissioning, setCommissioning] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        setLoading(true);
        const res = await fetch(`/api/ideas/${id}`);
        const json = await res.json();
        if (json.success && json.data?.idea) {
          const d = json.data.idea;
          setIdea(d);
          setProjectName(d.title || "");
          setProjectDesc(d.short_description || "");

          // Check if there is a financial evaluation
          try {
            const evalRes = await fetch(`/api/cfo/evaluations/${d.id}`);
            const evalJson = await evalRes.json();
            if (evalJson.success && evalJson.data?.evaluation) {
              setCfoEval(evalJson.data.evaluation);
              if (evalJson.data.evaluation.estimated_cost) {
                setProjectBudget(evalJson.data.evaluation.estimated_cost);
              }
            }
          } catch {}
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadIdea();
  }, [id]);

  async function handleExecuteTransition(targetStatus: string, notes?: string) {
    try {
      setTransitioning(true);
      const res = await fetch(`/api/ideas/${id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatus: targetStatus,
          notes: notes || "Executive decision executed by CEO.",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: "Transition Executed!",
          message: data.data?.message || `Proposal status updated to ${targetStatus}`,
          type: "success",
        });
        setIdea((prev: any) => ({ ...prev, status: targetStatus.toLowerCase() }));
      } else {
        showToast({ title: "Transition Denied", message: data.error || "Forbidden", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to execute transition.", type: "error" });
    } finally {
      setTransitioning(false);
    }
  }

  async function handleCommissionProject(e: React.FormEvent) {
    e.preventDefault();
    try {
      setCommissioning(true);
      const res = await fetch("/api/ceo/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: idea.id,
          name: projectName,
          description: projectDesc,
          budget: projectBudget,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: "Project Commissioned!",
          message: `Project "${projectName}" created and assigned to Development Planning.`,
          type: "success",
        });
        setCommissionOpen(false);
        setIdea((prev: any) => ({ ...prev, status: "development_planning" }));
        router.push("/ceo/projects");
      } else {
        showToast({ title: "Commissioning Failed", message: data.error || "Error creating project", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to commission project.", type: "error" });
    } finally {
      setCommissioning(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Proposal Not Found" message="Could not locate the requested proposal." />
      </div>
    );
  }

  const currentStatus = (idea.status as string).toUpperCase();

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/ceo/ideas" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to CEO Review Workbench
        </Link>
        <StatusBadge status={idea.status} size="md" />
      </div>

      {/* CEO Action Banner */}
      <Card glow glowColor="cyan" className="p-6 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
              CEO STRATEGIC DECISION DESK
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Strategic Endorsement & Commissioning</h2>
            <p className="text-xs text-slate-400 mt-1">
              Current Owner: <strong className="text-white uppercase">{idea.current_owner_role || "CEO"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {currentStatus === "CEO_REVIEW" && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleExecuteTransition("CFO_REVIEW", "CEO endorsed strategic vision. Requested CFO financial feasibility modeling.")}
                  isLoading={transitioning}
                  className="bg-purple-600 hover:bg-purple-500"
                >
                  📊 Request CFO Financial Evaluation →
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const n = prompt("Enter revision instructions for submitter:");
                    if (n) handleExecuteTransition("NEEDS_CHANGES", n);
                  }}
                  isLoading={transitioning}
                >
                  📝 Request Changes
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm("Reject proposal?")) handleExecuteTransition("REJECTED", "Rejected by CEO.");
                  }}
                  isLoading={transitioning}
                >
                  ✕ Reject
                </Button>
              </>
            )}

            {currentStatus === "APPROVED" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCommissionOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                🚀 Commission to Development Planning →
              </Button>
            )}

            {currentStatus === "CFO_REVIEW" && (
              <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
                ⏳ Under CFO Financial Modeling (Sara Malik)
              </span>
            )}

            {currentStatus === "DEVELOPMENT_PLANNING" && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                ✓ Commissioned to Developer Squad
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase">
                {idea.category_name || "Healthcare"}
              </span>
              <span className="text-xs text-slate-400">Impact: <strong className="text-white uppercase">{idea.expected_impact || "Critical"}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{idea.title}</h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">{idea.short_description}</p>
          </Card>

          {/* Problem & Solution */}
          <Card className="p-7 space-y-3">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Problem Statement</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{idea.problem_statement}</p>
          </Card>

          <Card glow glowColor="cyan" className="p-7 space-y-3">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Proposed AI Solution</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{idea.proposed_solution}</p>
          </Card>
        </div>

        {/* Sidebar: Financial Signoff & History */}
        <div className="space-y-6">
          {/* CFO Evaluation Box */}
          <Card glow glowColor="purple" className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
              <span>CFO Financial Valuation</span>
              {cfoEval && <span className="text-emerald-400 text-[10px] font-mono">APPROVED</span>}
            </h3>
            {cfoEval ? (
              <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Development Cost:</span>
                  <span className="font-bold text-amber-400 font-mono">${cfoEval.estimated_cost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Revenue:</span>
                  <span className="font-bold text-emerald-400 font-mono">${cfoEval.estimated_revenue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sustainability Score:</span>
                  <span className="font-bold text-cyan-400 font-mono">{cfoEval.sustainability_score}/100</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-slate-200">Business Model:</strong> {cfoEval.business_model}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                Financial modeling pending CFO signoff. Click &quot;Request CFO Financial Evaluation&quot; above to route.
              </p>
            )}
          </Card>

          {/* Status History */}
          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Governance Timeline</h3>
            <div className="space-y-3 text-xs">
              {(idea.status_history || []).map((h: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-400 uppercase text-[10px]">{h.new_status}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{h.notes}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Commission Project Modal */}
      <Modal isOpen={commissionOpen} onClose={() => setCommissionOpen(false)} title="Commission Approved Idea into Active Project" maxWidth="md">
        <form onSubmit={handleCommissionProject} className="space-y-4 pt-2">
          <Input
            label="Project Name *"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />

          <Textarea
            label="Sprint Scope & Architecture Brief *"
            rows={4}
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            required
          />

          <Input
            label="Allocated Capital Budget ($) *"
            type="number"
            value={projectBudget}
            onChange={(e) => setProjectBudget(parseFloat(e.target.value))}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setCommissionOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={commissioning}>
              Authorize & Assign to Dev Squad →
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

