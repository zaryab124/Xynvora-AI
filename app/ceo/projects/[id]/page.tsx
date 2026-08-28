"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CeoProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
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
    if (id) loadProject();
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
    description: "Multilingual autonomous clinical intake assistant integrating directly into hospital EHR systems.",
    status: "in_development",
    budget: 65000,
    spent: 22000,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/ceo/projects" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Project Portfolio
        </Link>
        <StatusBadge status={p.status} size="md" />
      </div>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Executive Project Desk</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{p.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Capital Budget</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">${p.budget?.toLocaleString()}</div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{p.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Spent to Date</span>
            <div className="text-lg font-bold text-amber-400 font-mono">${p.spent?.toLocaleString() || 0}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Remaining Capital</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">${(p.budget - (p.spent || 0)).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Engineering Lead</span>
            <div className="text-lg font-bold text-white">Ahmed Khan</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

