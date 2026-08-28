"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CfoProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ceo/projects");
      const json = await res.json();
      if (json.success && json.data?.projects) {
        setProjects(json.data.projects);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cfo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CFO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Project Financial Health & Burn Rate</h1>
        <p className="text-xs text-slate-400 mt-1">Audit active engineering spend, milestone budgets, and capital efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p: any) => (
          <Card key={p.id} glow glowColor="purple" className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-slate-400">{new Date(p.created_at).toLocaleDateString()}</span>
                <StatusBadge status={p.status} size="sm" />
              </div>
              <h3 className="text-lg font-bold text-white hover:text-purple-300 transition-colors">
                <Link href={`/cfo/projects/${p.slug || p.id}`}>{p.name}</Link>
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Allocated: <strong className="text-emerald-400 font-mono">${p.budget?.toLocaleString()}</strong></span>
                <span>Spent: <strong className="text-amber-400 font-mono">${p.spent?.toLocaleString() || 0}</strong></span>
              </div>
              <Link href={`/cfo/projects/${p.slug || p.id}`} className="block">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Financial Ledger →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
