"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DeveloperProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/developer/projects");
        const json = await res.json();
        if (json.success && json.data?.projects) {
          setProjects(json.data.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/developer/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Developer Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Assigned Engineering Projects</h1>
        <p className="text-xs text-slate-400 mt-1">Access architecture briefs, task boards, milestone tracking, and sprint controls.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Card key={p.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    Role: {p.project_role || "Squad Lead"}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
                  <Link href={`/developer/projects/${p.slug || p.id}`}>{p.name}</Link>
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Sprint Completion</span>
                  <span className="font-bold text-cyan-400 font-mono">{p.progress || 45}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${p.progress || 45}%` }} />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Tasks: {p.completed_tasks || 0}/{p.total_tasks || 0} Done</span>
                  <span>Spent: ${p.spent?.toLocaleString() || 0}</span>
                </div>

                <Link href={`/developer/projects/${p.slug || p.id}`} className="block pt-1">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Open Engineering Workspace →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
