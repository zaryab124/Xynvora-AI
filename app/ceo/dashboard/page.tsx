"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CeoDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/ceo/dashboard");
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
    total_members: 128,
    community_growth: "+38% MoM",
    awaiting_ceo_review: 2,
    approved_awaiting_commissioning: 3,
    active_projects: 4,
    projects_needing_attention: 1,
    cfo_evaluations_completed: 14,
    available_developers: 6,
    total_developers: 14,
  };

  const ceoQueue = data?.ceoQueue || [];
  const approvedQueue = data?.approvedQueue || [];
  const devWorkload = data?.developerWorkload || [];
  const strategicAlerts = data?.strategicAlerts || [];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      {/* ─── 1. EXECUTIVE HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
              CEO EXECUTIVE SUITE
            </span>
            <span className="text-xs text-slate-400">Chief Executive Officer • Zain ul Abideen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Strategic Direction & Venture Portfolio Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate CGO-validated problems, route for CFO financial modeling, and commission active developer squads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/ceo/ideas">
            <Button variant="primary" size="sm">
              👑 Review Queue ({metrics.awaiting_ceo_review})
            </Button>
          </Link>
          <Link href="/ceo/projects/create">
            <Button variant="outline" size="sm">
              🚀 Commission Project →
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. METRICS RIBBON ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card glow glowColor="cyan" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Awaiting CEO Review</span>
          <div className="text-2xl font-extrabold text-blue-400 font-mono">{metrics.awaiting_ceo_review}</div>
          <span className="text-[10px] text-amber-400">Action Required</span>
        </Card>

        <Card glow glowColor="purple" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ready to Commission</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.approved_awaiting_commissioning}</div>
          <span className="text-[10px] text-slate-400">CFO Approved</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Projects</span>
          <div className="text-2xl font-extrabold text-white font-mono">{metrics.active_projects}</div>
          <span className="text-[10px] text-cyan-400">In Sprints</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ecosystem Growth</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.community_growth}</div>
          <span className="text-[10px] text-slate-400">{metrics.total_members} Members</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">CFO Signoffs</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{metrics.cfo_evaluations_completed}</div>
          <span className="text-[10px] text-slate-400">Evaluated</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dev Squads</span>
          <div className="text-2xl font-extrabold text-white font-mono">{metrics.available_developers}/{metrics.total_developers}</div>
          <span className="text-[10px] text-cyan-400">Available</span>
        </Card>
      </div>

      {/* ─── 3. CEO STRATEGIC TRIAGE DESK ──────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> CGO-Validated Proposals Awaiting CEO Decision
          </h2>
          <Link href="/ceo/ideas" className="text-xs text-cyan-400 hover:underline font-semibold">
            View All Proposals →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ceoQueue.map((idea: any) => (
            <Card key={idea.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {idea.category_name || "Enterprise AI"}
                  </span>
                  <StatusBadge status={idea.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-300 transition-colors">
                  <Link href={`/ceo/ideas/${idea.slug || idea.id}`}>{idea.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submitter: <strong className="text-slate-300">{idea.submitter_name}</strong> • Impact: <strong className="text-cyan-400 uppercase">{idea.estimated_impact}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">{new Date(idea.created_at).toLocaleDateString()}</span>
                <Link href={`/ceo/ideas/${idea.slug || idea.id}`}>
                  <Button variant="primary" size="sm" className="text-xs">
                    Strategic Review →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── 4. SQUAD WORKLOAD & STRATEGIC ALERTS ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Developer Squad Workload */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engineering Squad Capacity</h3>
            <Link href="/ceo/developers" className="text-xs text-cyan-400 hover:underline">Squad Matrix →</Link>
          </div>
          <div className="space-y-3">
            {devWorkload.map((sw: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white">{sw.squad}</span>
                  <p className="text-[11px] text-slate-400">Lead: {sw.lead} • {sw.active_sprints} active sprints</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  {sw.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategic Alerts */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Executive Strategic Alerts</h3>
            <Link href="/ceo/approvals" className="text-xs text-cyan-400 hover:underline">Approvals Desk →</Link>
          </div>
          <div className="space-y-3">
            {strategicAlerts.map((sa: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{sa.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">HIGH PRIORITY</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sa.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── 5. CEO PORTAL NAVIGATION TILES ────────────────────── */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">CEO Navigation Suite</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Review Workbench", link: "/ceo/ideas", icon: "👑" },
            { label: "Executive Approvals", link: "/ceo/approvals", icon: "⚡" },
            { label: "Project Portfolio", link: "/ceo/projects", icon: "🚀" },
            { label: "Developer Squads", link: "/ceo/developers", icon: "💻" },
            { label: "Venture Analytics", link: "/ceo/analytics", icon: "📊" },
            { label: "Governance Audit", link: "/ceo/audit-logs", icon: "🛡️" },
          ].map((tile, i) => (
            <Link key={i} href={tile.link} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">{tile.icon}</span>
              <p className="text-xs font-semibold text-white">{tile.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
