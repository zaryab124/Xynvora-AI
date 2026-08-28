"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function CgoIdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Review Modal State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewScore, setReviewScore] = useState(9);
  const [reviewPriority, setReviewPriority] = useState("urgent");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Action Loading State
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        setLoading(true);
        const res = await fetch(`/api/ideas/${id}`);
        const json = await res.json();
        if (json.success && json.data?.idea) {
          setIdea(json.data.idea);
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
          notes: notes || `Action executed by Chief Growth Officer (CGO).`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: "Transition Executed!",
          message: data.data?.message || `Idea status updated to ${targetStatus}`,
          type: "success",
        });
        setIdea((prev: any) => ({
          ...prev,
          status: targetStatus.toLowerCase(),
        }));
      } else {
        showToast({ title: "Transition Denied", message: data.error || "Forbidden", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to execute transition.", type: "error" });
    } finally {
      setTransitioning(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/ideas/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: reviewScore,
          priority: reviewPriority,
          feedback: reviewFeedback,
          recommendation: "PROCEED",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Review Recorded!", message: "CGO evaluation notes have been saved.", type: "success" });
        setReviewOpen(false);
        setReviewFeedback("");
        // Route to CEO automatically if chosen
        handleExecuteTransition("CEO_REVIEW", `Validated by CGO with score ${reviewScore}/10 and priority ${reviewPriority}.`);
      } else {
        showToast({ title: "Error", message: data.error || "Failed to record review.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Review submission failed.", type: "error" });
    } finally {
      setSubmittingReview(false);
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
        <ErrorState title="Proposal Not Found" message="Could not locate the requested proposal in CGO queue." />
      </div>
    );
  }

  const currentStatus = (idea.status as string).toUpperCase();

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/cgo/ideas" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to CGO Triage Workbench
        </Link>
        <StatusBadge status={idea.status} size="md" />
      </div>

      {/* CGO Action Banner */}
      <Card glow glowColor="cyan" className="p-6 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              CGO GOVERNANCE DESK
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Triage & Executive Routing Actions</h2>
            <p className="text-xs text-slate-400 mt-1">
              Current Owner: <strong className="text-white uppercase">{idea.current_owner_role || "CGO"}</strong> • Priority: <strong className="text-cyan-400 uppercase">{idea.cgo_priority || "Triage"}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentStatus === "SUBMITTED" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecuteTransition("CGO_REVIEW", "CGO accepted into active validation.")}
                isLoading={transitioning}
              >
                Accept for Validation →
              </Button>
            )}

            {(currentStatus === "CGO_REVIEW" || currentStatus === "SUBMITTED") && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setReviewOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  ✓ Validate & Route to CEO →
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const notes = prompt("Enter revision instructions for the submitter:");
                    if (notes) handleExecuteTransition("NEEDS_CHANGES", notes);
                  }}
                  isLoading={transitioning}
                >
                  📝 Request Changes
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to reject this proposal?")) {
                      handleExecuteTransition("REJECTED", "Rejected during CGO triage.");
                    }
                  }}
                  isLoading={transitioning}
                >
                  ✕ Reject
                </Button>
              </>
            )}

            {currentStatus === "CEO_REVIEW" && (
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                ✓ Routed to CEO for Strategic Signoff
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Main Proposal Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
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
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <span>⚠️</span> Problem Statement & Bottlenecks
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {idea.problem_statement}
            </p>
          </Card>

          <Card glow glowColor="cyan" className="p-7 space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span>🧠</span> Proposed AI Architecture & Solution
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {idea.proposed_solution}
            </p>
          </Card>
        </div>

        {/* Sidebar: Submitter Info & History */}
        <div className="space-y-6">
          {/* Submitter Box */}
          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitter Profile</h3>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center font-bold">
                {idea.submitter_name?.charAt(0) || "U"}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{idea.submitter_name || "Community Innovator"}</h4>
                <p className="text-[11px] text-cyan-400 font-mono">{idea.submitter_role || "COMMUNITY_MEMBER"}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Submitted on {new Date(idea.created_at).toLocaleDateString()}
            </p>
          </Card>

          {/* Status History Logs */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Status History Logs</h3>
            <div className="space-y-3 text-xs">
              {(idea.status_history || []).map((h: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-400 uppercase text-[10px]">{h.new_status}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(h.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{h.notes}</p>
                  {h.actor_name && <p className="text-[10px] text-slate-500">By: {h.actor_name} ({h.actor_role})</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Validate & Route Proposal to CEO" maxWidth="md">
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Feasibility Score (1-10)"
              type="number"
              min={1}
              max={10}
              value={reviewScore}
              onChange={(e) => setReviewScore(parseInt(e.target.value, 10))}
              required
            />
            <Select
              label="CGO Priority"
              value={reviewPriority}
              onChange={(e) => setReviewPriority(e.target.value)}
              options={[
                { value: "urgent", label: "Urgent Priority" },
                { value: "high", label: "High Priority" },
                { value: "medium", label: "Medium Priority" },
                { value: "low", label: "Low Priority" },
              ]}
            />
          </div>

          <Textarea
            label="CGO Market Validation & Endorsement Notes"
            placeholder="Outline market viability, expected enterprise demand, and why CEO should commission this..."
            rows={5}
            value={reviewFeedback}
            onChange={(e) => setReviewFeedback(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submittingReview}>
              Save Review & Route to CEO →
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
