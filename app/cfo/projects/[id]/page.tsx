"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CfoProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/ceo/projects");
        const json = await res.json();
        if (json.success && json.data?.projects) {
          const p = json.data.projects.find((item: any) => item.id === id || item.slug === id) || json.data.projects[0];
          setProject(p);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const p = project || {
    name: "Clinical Triage Autonomous EHR Agent",
    budget: 65000,
    spent: 22000,
    status: "in_development",
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/cfo/projects" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to CFO Project Portfolios
        </Link>
        <StatusBadge status={p.status} size="md" />
      </div>

      <Card glow glowColor="purple" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">CFO Financial Audit</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{p.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Budget</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">${p.budget?.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Capital Burned</span>
            <div className="text-lg font-bold text-amber-400 font-mono">${p.spent?.toLocaleString() || 0}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Capital Remaining</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">${(p.budget - (p.spent || 0)).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Burn Velocity</span>
            <div className="text-lg font-bold text-cyan-400 font-mono">34% of Budget</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
