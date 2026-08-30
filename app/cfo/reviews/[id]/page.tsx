"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function CfoReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form State
  const [estimatedCost, setEstimatedCost] = useState(45000);
  const [estimatedRevenue, setEstimatedRevenue] = useState(180000);
  const [businessModel, setBusinessModel] = useState("B2B SaaS subscription per hospital node ($2,500/mo) + consumption tiers");
  const [riskLevel, setRiskLevel] = useState("low");
  const [sustainabilityScore, setSustainabilityScore] = useState(90);
  const [conditions, setConditions] = useState("MVP deliverables must stay capped within $45,000 before scaling multi-region nodes.");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        setLoading(true);
        const res = await fetch(`/api/ideas/${id}`);
        const json = await res.json();
        if (json.success && json.data?.idea) {
          const d = json.data.idea;
          setIdea(d);

          // Check if previous evaluation exists
          try {
            const evalRes = await fetch(`/api/cfo/evaluations/${d.id}`);
            const evalJson = await evalRes.json();
            if (evalJson.success && evalJson.data?.evaluation) {
              const ev = evalJson.data.evaluation;
              if (ev.estimated_cost) setEstimatedCost(ev.estimated_cost);
              if (ev.estimated_revenue) setEstimatedRevenue(ev.estimated_revenue);
              if (ev.business_model) setBusinessModel(ev.business_model);
              if (ev.financial_risk_level) setRiskLevel(ev.financial_risk_level);
              if (ev.sustainability_score) setSustainabilityScore(ev.sustainability_score);
              if (ev.conditions) setConditions(ev.conditions);
              if (ev.notes) setNotes(ev.notes);
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

  async function handleFinancialDecision(recommendation: "APPROVE" | "REVISE" | "REJECT") {
    try {
      setSubmitting(true);
      const res = await fetch("/api/cfo/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: idea.id,
          estimated_cost: estimatedCost,
          estimated_revenue: estimatedRevenue,
          business_model: businessModel,
          financial_risk_level: riskLevel,
          sustainability_score: sustainabilityScore,
          recommendation,
          conditions,
          notes,
          auto_transition: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: `Financial Decision: ${recommendation}`,
          message: recommendation === "APPROVE"
            ? "Proposal approved and validated for CEO development commissioning!"
            : `Proposal updated to ${recommendation === "REVISE" ? "NEEDS_CHANGES" : "REJECTED"}.`,
          type: recommendation === "APPROVE" ? "success" : "info",
        });
        router.push("/cfo/reviews");
      } else {
        showToast({ title: "Submission Failed", message: data.error || "Error recording evaluation", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to record financial evaluation.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
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
  const calculatedRoi = Math.round(((estimatedRevenue - estimatedCost) / Math.max(1, estimatedCost)) * 100);
  const netMargin = estimatedRevenue - estimatedCost;

  const PIPELINE_STEPS = [
    { label: "1. Submitter", active: true },
    { label: "2. CGO Validated", active: true },
    { label: "3. CEO Endorsed", active: true },
    { label: "4. CFO Valuation", active: currentStatus === "CFO_REVIEW", current: currentStatus === "CFO_REVIEW" },
    { label: "5. Approved", active: currentStatus === "APPROVED", current: currentStatus === "APPROVED" },
    { label: "6. Dev Squad", active: ["DEVELOPMENT_PLANNING", "IN_DEVELOPMENT", "TESTING", "LAUNCHED"].includes(currentStatus) },
  ];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.15} />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/cfo/reviews" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to CFO Pending Queue
        </Link>
        <StatusBadge status={idea.status} size="md" />
      </div>

      {/* Pipeline Stepper Progress Bar */}
      <Card className="p-4 bg-slate-900/90 border-slate-700/70">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {PIPELINE_STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold ${
                step.current
                  ? "bg-purple-500 text-white shadow-md shadow-purple-500/40 font-bold"
                  : step.active
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}>
                {step.label}
              </span>
              {idx < PIPELINE_STEPS.length - 1 && <span className="text-slate-600">→</span>}
            </div>
          ))}
        </div>
      </Card>

      {/* CFO 1-Click Action & Live Unit Economics Summary */}
      <Card glow glowColor="purple" className="p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-purple-500/40 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                CFO FINANCIAL VALUATION & CAPITAL DESK
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Approve Budget & Send to CEO for Launch</h2>
            <p className="text-xs text-slate-300 mt-1">
              Evaluator: <strong className="text-white">Muhammad Ismail (CFO)</strong> • Capital Risk: <strong className="text-emerald-400 uppercase">{riskLevel}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentStatus === "CFO_REVIEW" && (
              <Button
                variant="primary"
                size="md"
                onClick={() => handleFinancialDecision("APPROVE")}
                isLoading={submitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 px-6 py-2.5 text-sm"
              >
                💰 1-Click Approve & Forward to CEO →
              </Button>
            )}

            {currentStatus === "APPROVED" && (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <span>✓</span> Financial Evaluation Approved & Sent Forward to CEO
              </span>
            )}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-purple-500/20">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Budget Allocated</span>
            <p className="text-lg font-bold text-white font-mono mt-0.5">${estimatedCost.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Projected Annual Rev</span>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">${estimatedRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Estimated ROI</span>
            <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">+{calculatedRoi}%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Net Operating Margin</span>
            <p className="text-lg font-bold text-purple-300 font-mono mt-0.5">+${netMargin.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Overview Card */}
      <Card className="p-7 space-y-4 bg-slate-900/90 border-slate-700/70">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/40 text-xs font-semibold uppercase">
            {idea.category_name || "Healthcare"}
          </span>
          <span className="text-xs text-slate-300">Impact: <strong className="text-white uppercase font-bold">{idea.expected_impact || "Critical"}</strong></span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{idea.title}</h1>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">{idea.short_description}</p>
      </Card>

      {/* Financial Modeling Form */}
      <Card glow glowColor="purple" className="p-8 space-y-6 bg-slate-900/90 border-slate-700/70">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
            DETAILED UNIT ECONOMICS MODELING
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Capital Feasibility & Milestone Terms</h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleFinancialDecision("APPROVE"); }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Estimated Development Budget ($) *"
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Projected Annualized Revenue ($) *"
              type="number"
              value={estimatedRevenue}
              onChange={(e) => setEstimatedRevenue(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Financial Risk Assessment *"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              options={[
                { value: "low", label: "🟢 Low Risk (High Feasibility)" },
                { value: "medium", label: "🟡 Medium Risk (Moderate Feasibility)" },
                { value: "high", label: "🟠 High Risk (Requires Capital Cushion)" },
                { value: "critical", label: "🔴 Critical Risk (Extreme Exposure)" },
              ]}
            />
            <Input
              label="Sustainability Score (1-100) *"
              type="number"
              min={1}
              max={100}
              value={sustainabilityScore}
              onChange={(e) => setSustainabilityScore(parseInt(e.target.value, 10) || 85)}
              required
            />
          </div>

          <Textarea
            label="Monetization Architecture & Business Model *"
            rows={3}
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value)}
            placeholder="e.g. Enterprise monthly SaaS license per department node..."
            required
          />

          <Textarea
            label="Financial Conditions & Milestone Caps"
            rows={2}
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="Budget milestone release criteria..."
          />

          <Textarea
            label="CFO Evaluation Notes for CEO Strategic Signoff"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal financial commentary for CEO strategic decision..."
          />

          <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <Button
              type="button"
              variant="danger"
              onClick={() => handleFinancialDecision("REJECT")}
              isLoading={submitting}
            >
              ✕ Reject Financially
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleFinancialDecision("REVISE")}
              isLoading={submitting}
              className="border-slate-700 text-slate-300"
            >
              📝 Request Financial Revisions
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-600/30"
            >
              ✓ Approve & Send to CEO for Project Commissioning →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
