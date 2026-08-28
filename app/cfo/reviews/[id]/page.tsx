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

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/cfo/reviews" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to CFO Reviews
        </Link>
        <StatusBadge status={idea.status} size="md" />
      </div>

      {/* Overview Card */}
      <Card className="p-7 space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold uppercase">
            {idea.category_name || "Healthcare"}
          </span>
          <span className="text-xs text-slate-400">Impact: <strong className="text-white uppercase">{idea.expected_impact || "Critical"}</strong></span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{idea.title}</h1>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">{idea.short_description}</p>
      </Card>

      {/* Financial Modeling Form */}
      <Card glow glowColor="purple" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
            CFO UNIT ECONOMICS & VALUATION DESK
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Financial Modeling & Capital Feasibility</h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleFinancialDecision("APPROVE"); }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Estimated Development Cost ($) *"
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(parseFloat(e.target.value))}
              required
            />
            <Input
              label="Projected Annualized Revenue ($) *"
              type="number"
              value={estimatedRevenue}
              onChange={(e) => setEstimatedRevenue(parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Financial Risk Assessment *"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              options={[
                { value: "low", label: "Low Risk (High Feasibility)" },
                { value: "medium", label: "Medium Risk (Moderate Feasibility)" },
                { value: "high", label: "High Risk (Requires Capital Cushion)" },
                { value: "critical", label: "Critical Risk (Extreme Exposure)" },
              ]}
            />
            <Input
              label="Sustainability Score (1-100) *"
              type="number"
              min={1}
              max={100}
              value={sustainabilityScore}
              onChange={(e) => setSustainabilityScore(parseInt(e.target.value, 10))}
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
            label="CFO Evaluation Notes"
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
            >
              📝 Request Financial Revisions
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              ✓ Approve & Validate for CEO Commissioning →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
