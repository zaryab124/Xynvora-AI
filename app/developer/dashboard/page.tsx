"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DeveloperDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/developer/dashboard");
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
    assigned_projects: 2,
    assigned_tasks: 7,
    in_progress: 3,
    completed: 3,
    blocked: 1,
    due_soon: 2,
  };

  const projects = data?.assignedProjects || [];
  const tasks = data?.assignedTasks || [];
  const milestones = data?.milestones || [];
  const updates = data?.recentUpdates || [];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* ─── 1. DEVELOPER HEADER ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              ENGINEERING SQUAD WORKSPACE
            </span>
            <span className="text-xs text-slate-400">Core Developer Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering Sprints & Task Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build AI agent systems, progress sprint tasks, submit compliance benchmarks, and request production reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/developer/tasks">
            <Button variant="primary" size="sm">
              ⚡ My Tasks ({metrics.assigned_tasks})
            </Button>
          </Link>
          <Link href="/developer/projects">
            <Button variant="outline" size="sm">
              📁 Assigned Projects ({metrics.assigned_projects})
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. METRICS RIBBON ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card glow glowColor="cyan" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned Projects</span>
          <div className="text-2xl font-extrabold text-white font-mono">{metrics.assigned_projects}</div>
          <span className="text-[10px] text-cyan-400">Active Squads</span>
        </Card>

        <Card glow glowColor="cyan" className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Progress Tasks</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{metrics.in_progress}</div>
          <span className="text-[10px] text-slate-400">Active Sprint</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Due Soon</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{metrics.due_soon}</div>
          <span className="text-[10px] text-amber-400">&lt; 3 days</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Blocked Tasks</span>
          <div className="text-2xl font-extrabold text-red-400 font-mono">{metrics.blocked}</div>
          <span className="text-[10px] text-red-400">Attention Required</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{metrics.completed}</div>
          <span className="text-[10px] text-slate-400">Passed QA</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Sprint Tasks</span>
          <div className="text-2xl font-extrabold text-white font-mono">{metrics.assigned_tasks}</div>
          <span className="text-[10px] text-slate-400">Backlog</span>
        </Card>
      </div>

      {/* ─── 3. ASSIGNED PROJECTS GRID ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🚀</span> Assigned Engineering Projects
          </h2>
          <Link href="/developer/projects" className="text-xs text-cyan-400 hover:underline font-semibold">
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj: any) => (
            <Card key={proj.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    Role: {proj.project_role || "Developer"}
                  </span>
                  <StatusBadge status={proj.status} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
                  <Link href={`/developer/projects/${proj.slug || proj.id}`}>{proj.name}</Link>
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">{proj.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Sprint Completion</span>
                  <span className="font-bold text-cyan-400 font-mono">{proj.progress || 45}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${proj.progress || 45}%` }} />
                </div>

                <div className="pt-2 flex justify-end">
                  <Link href={`/developer/projects/${proj.slug || proj.id}`} className="w-full">
                    <Button variant="primary" size="sm" className="w-full text-xs">
                      Open Project Workspace →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ─── 4. ACTIVE TASKS & MILESTONES ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tasks */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Task Queue</h3>
            <Link href="/developer/tasks" className="text-xs text-cyan-400 hover:underline">All Tasks →</Link>
          </div>
          <div className="space-y-3">
            {tasks.map((t: any) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <Link href={`/developer/tasks/${t.id}`} className="font-bold text-white hover:text-cyan-300 transition-colors">
                    {t.title}
                  </Link>
                  <StatusBadge status={t.status} size="sm" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{t.project_name}</span>
                  <span className="font-mono text-amber-400 uppercase">Priority: {t.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Milestones & Updates */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Milestones & Updates</h3>
            <Link href="/developer/milestones" className="text-xs text-cyan-400 hover:underline">Roadmap →</Link>
          </div>
          <div className="space-y-3">
            {milestones.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{m.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{m.status}</span>
                </div>
                <p className="text-[11px] text-slate-400">Project: {m.project_name} • Due: {m.due_date || "Sprint Target"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── 5. DEVELOPER NAVIGATION TILES ─────────────────────── */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Developer Navigation Suite</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Assigned Projects", link: "/developer/projects", icon: "📁" },
            { label: "Task Workbench", link: "/developer/tasks", icon: "⚡" },
            { label: "Milestones Roadmap", link: "/developer/milestones", icon: "🏆" },
            { label: "Technical Files", link: "/developer/files", icon: "📄" },
            { label: "Squad Roster", link: "/developer/team", icon: "👥" },
            { label: "Sprint Alerts", link: "/developer/notifications", icon: "🔔" },
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
