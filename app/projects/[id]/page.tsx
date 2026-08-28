"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/projects/${id}`);
        const json = await res.json();
        if (json.success && json.data?.project) {
          setProject(json.data.project);
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

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Project Not Found" message="Could not locate the requested solution." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/projects" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1.5">
          ← Back to Projects Showcase
        </Link>
        <StatusBadge status={project.status} size="md" />
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase">
            {project.category}
          </span>
          {project.client && <span className="text-xs text-slate-400">Client: <strong className="text-white">{project.client}</strong></span>}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {project.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          {project.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          {project.live_url && project.live_url !== "#" && (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm">
                Open Live System ↗
              </Button>
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                View Repository ↗
              </Button>
            </a>
          )}
          <Link href="/contact">
            <Button variant="ghost" size="sm">
              Inquire About Custom Deployment
            </Button>
          </Link>
        </div>
      </div>

      {/* Tech Stack & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engineering Architecture & Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {(project.tech_stack || ["Next.js", "FastAPI", "PostgreSQL", "Docker"]).map((tech: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
                  {tech}
                </span>
              ))}
            </div>
          </Card>

          {project.impact_metrics && (
            <Card glow glowColor="emerald" className="p-6 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Impact & Business Metrics</h3>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">{project.impact_metrics}</p>
            </Card>
          )}

          {project.milestones && (
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Milestones & Delivery Schedule</h3>
              <div className="space-y-3">
                {project.milestones.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-850/80 border border-slate-800">
                    <span className="text-xs font-semibold text-white">{m.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Progress</span>
                <span className="font-bold text-emerald-400">{project.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
