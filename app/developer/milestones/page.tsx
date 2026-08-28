"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function DeveloperMilestonesPage() {
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/developer/milestones");
      const json = await res.json();
      if (json.success && json.data?.milestones) {
        setMilestones(json.data.milestones);
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
        <h1 className="text-3xl font-extrabold text-white">Engineering Milestones & Roadmap</h1>
        <p className="text-xs text-slate-400 mt-1">Track key release deliverables, compliance checkpoints, and sprint gates.</p>
      </div>

      <div className="space-y-4">
        {milestones.map((m: any) => (
          <Card key={m.id} glow glowColor="cyan" className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{m.project_name}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{m.title}</h3>
                {m.description && <p className="text-xs text-slate-400 mt-1">{m.description}</p>}
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                {m.status?.toUpperCase()}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
              <span>Due: {m.due_date ? new Date(m.due_date).toLocaleDateString() : "Sprint Target"}</span>
              <span>{m.completed_at ? `Completed: ${new Date(m.completed_at).toLocaleDateString()}` : "In Progress"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
