"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function IdeaDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/ideas/${id}`);
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
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Idea Not Found" message="Could not locate the requested innovation idea." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/ideas" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Ideas Explorer
        </Link>
        <StatusBadge status={idea.status} size="md" />
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase">
            {idea.category}
          </span>
          <span className="text-xs text-slate-400">Estimated Impact: <strong className="text-white uppercase">{idea.estimated_impact}</strong></span>
          <span className="text-xs text-slate-400">Priority: <strong className="text-white uppercase">{idea.cgo_priority}</strong></span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {idea.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          {idea.summary}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Submitted by <strong className="text-white">{idea.submitter_name}</strong></span>
          <span>•</span>
          <span>{new Date(idea.created_at).toLocaleDateString()}</span>
          <span>•</span>
          <span>👁️ {idea.view_count || 1} Views</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Problem & Solution */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-3">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <span>⚠️</span> The Problem & Friction
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {idea.problem_statement}
            </p>
          </Card>

          <Card glow glowColor="cyan" className="p-6 space-y-3">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <span>🧠</span> Proposed AI Solution
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {idea.proposed_solution}
            </p>
          </Card>

          {idea.target_audience && (
            <Card className="p-6 space-y-3">
              <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
                <span>🎯</span> Target Audience & Beneficiaries
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {idea.target_audience}
              </p>
            </Card>
          )}
        </div>

        {/* Right Col: Lifecycle Progress */}
        <div className="space-y-6">
          <Card glow glowColor="cyan" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Governance Timeline</h3>
            <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {[
                { status: "submitted", label: "Idea Intake", desc: "Submitted to public queue" },
                { status: "validated", label: "CGO Triage", desc: "Market validation & priority assigned" },
                { status: "financial_review", label: "CFO Modeling", desc: "ROI & budget feasibility check" },
                { status: "approved", label: "CEO Approval", desc: "Commissioned for squad engineering" },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-6">
                  <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-slate-950" />
                  <div>
                    <h5 className="text-xs font-bold text-white">{step.label}</h5>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full">
                  Inquire About This Solution
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
