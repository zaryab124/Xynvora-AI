"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  progress: number;
  client?: string;
  repo_url?: string;
  live_url?: string;
}

const CATEGORY_TABS = [
  { id: "All", label: "All Solutions" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Logistics", label: "Logistics" },
  { id: "AI Automation", label: "AI Automation" },
  { id: "Real Estate", label: "Real Estate" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const url = activeCategory === "All" ? "/api/public/projects" : `/api/public/projects?category=${activeCategory}`;
        const res = await fetch(url);
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
    fetchProjects();
  }, [activeCategory]);

  const filtered = projects.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Production Solutions & Case Studies
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Active AI Projects</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            Inspect autonomous agents and enterprise intelligence platforms built by our engineering squads for industry partners.
          </p>
        </div>

        <Link href="/contact">
          <Button variant="primary">
            Request Custom Solution
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Tabs tabs={CATEGORY_TABS} activeTab={activeCategory} onChange={setActiveCategory} />
        <div className="w-full md:w-72">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span className="text-sm">🔍</span>}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description="No projects match the selected category filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <Card key={proj.id} glow glowColor="emerald" className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <StatusBadge status={proj.status} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-emerald-300 transition-colors">
                  <Link href={`/projects/${proj.slug || proj.id}`}>{proj.name}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{proj.description}</p>

                {/* Progress bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Engineering Progress</span>
                    <span className="text-emerald-400 font-semibold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                {proj.client && <span>Client: {proj.client}</span>}
                <Link href={`/projects/${proj.slug || proj.id}`} className="text-emerald-400 font-semibold hover:underline ml-auto">
                  View Architecture →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
