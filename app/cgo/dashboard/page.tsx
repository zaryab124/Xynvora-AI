"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CgoDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCgoDashboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/cgo/dashboard");
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
    loadCgoDashboard();
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
    new_members: 24,
    active_members: 104,
    total_ideas: 32,
    awaiting_validation: 7,
    needs_changes: 3,
    validated: 16,
    routed_to_ceo: 9,
    rejected: 3,
  };

  const triageQueue = data?.triageQueue || [];
  const growingCategories = data?.growingCategories || [];
  const topContributors = data?.topContributors || [];
  const partnerships = data?.partnershipRecommendations || [];
  const devAvailability = data?.developerAvailability || { total_devs: 14, available_devs: 6 };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* ─── 1. EXECUTIVE HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              CGO EXECUTIVE PORTAL
            </span>
            <span className="text-xs text-slate-400">Chief Growth Officer • Mahad Aziz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Innovation Pipeline & Community Growth Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bridge between community members, problem validation, CGO triage, and executive routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/cgo/ideas">
            <Button variant="primary" size="sm">
              ⚡ Open Triage Workbench ({metrics.awaiting_validation})
            </Button>
          </Link>
          <Link href="/cgo/growth">
            <Button variant="outline" size="sm">
              📊 Growth Telemetry
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. METRICS RIBBON ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card glow glowColor="cyan" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Members</span>
          <div className="text-2xl font-extrabold text-white">{metrics.total_members}</div>
          <span className="text-[10px] text-emerald-400 font-medium">+{metrics.new_members} this week</span>
        </Card>

        <Card glow glowColor="cyan" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Awaiting Triage</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{metrics.awaiting_validation}</div>
          <span className="text-[10px] text-slate-400">Action Required</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Needs Changes</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{metrics.needs_changes}</div>
          <span className="text-[10px] text-slate-400">With Submitters</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Validated Ideas</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{metrics.validated}</div>
          <span className="text-[10px] text-slate-400">Triage Complete</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Routed to CEO</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.routed_to_ceo}</div>
          <span className="text-[10px] text-slate-400">In Executive Review</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Squad Availability</span>
          <div className="text-2xl font-extrabold text-white">{devAvailability.available_devs}/{devAvailability.total_devs}</div>
          <span className="text-[10px] text-cyan-400">Devs Available</span>
        </Card>
      </div>

      {/* ─── 3. ACTIVE TRIAGE WORKBENCH QUEUE ──────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Priority CGO Triage Queue
          </h2>
          <Link href="/cgo/ideas" className="text-xs text-cyan-400 hover:underline font-semibold">
            View All Proposals ({metrics.total_ideas}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {triageQueue.map((idea: any) => (
            <Card key={idea.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                  <StatusBadge status={idea.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-300 transition-colors">
                  <Link href={`/cgo/ideas/${idea.slug || idea.id}`}>{idea.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  Submitted by <strong className="text-slate-300">{idea.submitter_name}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Priority: <strong className="text-cyan-400 uppercase">{idea.cgo_priority || "Triage"}</strong></span>
                <Link href={`/cgo/ideas/${idea.slug || idea.id}`}>
                  <Button variant="primary" size="sm" className="text-xs">
                    Evaluate →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── 4. CGO ECOSYSTEM TELEMETRY ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growing Categories */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Growing Categories</h3>
            <Link href="/cgo/growth" className="text-xs text-cyan-400 hover:underline">Telemetry →</Link>
          </div>
          <div className="space-y-3">
            {growingCategories.map((c: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{c.category}</span>
                  <p className="text-[10px] text-slate-400">{c.active_proposals} active proposals</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">{c.growth}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Contributors */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Innovators</h3>
            <Link href="/cgo/contributors" className="text-xs text-cyan-400 hover:underline">Leaderboard →</Link>
          </div>
          <div className="space-y-3">
            {topContributors.map((tc: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{tc.name}</span>
                  <p className="text-[10px] text-slate-400">{tc.role}</p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{tc.reputation} Rep</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Partnership Intake */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Partnership Intake</h3>
            <Link href="/cgo/partnership-recommendations" className="text-xs text-cyan-400 hover:underline">Intake →</Link>
          </div>
          <div className="space-y-3">
            {partnerships.map((p: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{p.partner}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {p.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Track: {p.track}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── 5. CGO PORTAL NAVIGATION TILES ────────────────────── */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">CGO Navigation Suite</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Triage Workbench", link: "/cgo/ideas", icon: "⚡" },
            { label: "Community Roster", link: "/cgo/community/members", icon: "👥" },
            { label: "Initiatives & Sprints", link: "/cgo/community/initiatives", icon: "🏆" },
            { label: "Growth Analytics", link: "/cgo/growth", icon: "📈" },
            { label: "Developer Availability", link: "/cgo/developers", icon: "💻" },
            { label: "Audit Logs", link: "/cgo/audit-logs", icon: "🛡️" },
          ].map((tile, i) => (
            <Link key={i} href={tile.link} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">{tile.icon}</span>
              <p className="text-xs font-semibold text-white">{tile.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
