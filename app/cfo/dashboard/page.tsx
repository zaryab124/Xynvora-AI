"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CfoDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/cfo/dashboard");
        const json = await res.json();
        if (json.success && json.data?.dashboard) {
          setData(json.data.dashboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    awaiting_financial_review: 2,
    total_evaluations: 14,
    total_allocated_budget: 185000,
    total_projected_revenue: 740000,
    total_estimated_costs: 135000,
    avg_sustainability_score: 88,
  };

  const reviewsQueue = data?.reviewsQueue || [];
  const riskBreakdown = data?.riskBreakdown || [];
  const economics = data?.partnershipEconomics || [];
  const alerts = data?.financialAlerts || [];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      {/* ─── 1. EXECUTIVE HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              CFO FINANCIAL SUITE
            </span>
            <span className="text-xs text-slate-400">Chief Financial Officer • Sara Malik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Financial Engineering & Capital Allocation Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conduct unit economics modeling, establish R&D project budgets, and evaluate enterprise commercial terms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/cfo/reviews">
            <Button variant="primary" size="sm">
              📊 Financial Evaluation Queue ({metrics.awaiting_financial_review})
            </Button>
          </Link>
          <Link href="/cfo/budgets">
            <Button variant="outline" size="sm">
              💰 Capital Budgets
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. METRICS RIBBON ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card glow glowColor="cyan" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Awaiting Review</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{metrics.awaiting_financial_review}</div>
          <span className="text-[10px] text-slate-400">Valuation Required</span>
        </Card>

        <Card glow glowColor="purple" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Allocated Capital</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">${(metrics.total_allocated_budget / 1000).toFixed(0)}k</div>
          <span className="text-[10px] text-slate-400">R&D Projects</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projected Revenue</span>
          <div className="text-2xl font-extrabold text-white font-mono">${(metrics.total_projected_revenue / 1000).toFixed(0)}k</div>
          <span className="text-[10px] text-cyan-400">Model Pipeline</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Costs</span>
          <div className="text-2xl font-extrabold text-slate-300 font-mono">${(metrics.total_estimated_costs / 1000).toFixed(0)}k</div>
          <span className="text-[10px] text-slate-400">Development Spend</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Evaluations</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{metrics.total_evaluations}</div>
          <span className="text-[10px] text-slate-400">Completed</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Sustainability</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{metrics.avg_sustainability_score}/100</div>
          <span className="text-[10px] text-emerald-400">High Health</span>
        </Card>
      </div>

      {/* ─── 3. CFO FINANCIAL EVALUATION QUEUE ─────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Proposals Awaiting CFO Financial Modeling
          </h2>
          <Link href="/cfo/reviews" className="text-xs text-cyan-400 hover:underline font-semibold">
            View All Financial Reviews →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsQueue.map((idea: any) => (
            <Card key={idea.id} glow glowColor="purple" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                    {idea.category_name || "Healthcare"}
                  </span>
                  <StatusBadge status={idea.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-purple-300 transition-colors">
                  <Link href={`/cfo/reviews/${idea.slug || idea.id}`}>{idea.title}</Link>
                </h3>
                <p className="text-xs text-slate-400">
                  Submitter: <strong className="text-slate-200">{idea.submitter_name}</strong> • Impact: <strong className="text-cyan-400 uppercase">{idea.estimated_impact}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">{new Date(idea.created_at).toLocaleDateString()}</span>
                <Link href={`/cfo/reviews/${idea.slug || idea.id}`}>
                  <Button variant="primary" size="sm" className="text-xs bg-purple-600 hover:bg-purple-500">
                    Conduct Valuation →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── 4. RISK BREAKDOWN & PARTNERSHIP ECONOMICS ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Breakdown */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Capital Risk Exposure</h3>
            <Link href="/cfo/reports" className="text-xs text-cyan-400 hover:underline">Risk Modeling →</Link>
          </div>
          <div className="space-y-3">
            {riskBreakdown.map((rb: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{rb.level}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono">{rb.count} initiatives</span>
                  <span className="font-bold text-emerald-400 font-mono">{rb.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Partnership Economics */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Enterprise Commercial Terms</h3>
            <Link href="/cfo/partnerships" className="text-xs text-cyan-400 hover:underline">Contracts →</Link>
          </div>
          <div className="space-y-3">
            {economics.map((ec: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{ec.partner}</span>
                  <span className="text-emerald-400 font-mono font-bold">{ec.estimated_mrr} / mo</span>
                </div>
                <p className="text-[11px] text-slate-400">Structure: {ec.model} • Status: <strong className="text-cyan-400">{ec.status}</strong></p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── 5. CFO PORTAL NAVIGATION TILES ────────────────────── */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">CFO Navigation Suite</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Financial Desk", link: "/cfo/reviews", icon: "📊" },
            { label: "Capital Budgets", link: "/cfo/budgets", icon: "💰" },
            { label: "Project Health", link: "/cfo/projects", icon: "🚀" },
            { label: "Partnership Terms", link: "/cfo/partnerships", icon: "🤝" },
            { label: "Feasibility Reports", link: "/cfo/reports", icon: "📈" },
            { label: "Dashboard Hub", link: "/cfo/dashboard", icon: "🏛️" },
          ].map((tile, i) => (
            <Link key={i} href={tile.link} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">{tile.icon}</span>
              <p className="text-xs font-semibold text-white">{tile.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
