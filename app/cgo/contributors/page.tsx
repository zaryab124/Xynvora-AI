"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CgoContributorsPage() {
  const [contributors, setContributors] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cgo/contributors");
      const json = await res.json();
      if (json.success && json.data?.contributors) {
        setContributors(json.data.contributors);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CGO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Top Innovators Leaderboard</h1>
        <p className="text-xs text-slate-400 mt-1">Recognize high-value contributors submitting breakthrough problem spaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contributors.map((c: any, i: number) => (
          <Card key={i} glow glowColor="cyan" className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 font-bold flex items-center justify-center">
                #{i + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{c.full_name}</h4>
                <p className="text-[10px] text-cyan-400 font-mono">{c.role}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">{c.company || "Independent Innovator"}</p>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Proposals: <strong className="text-white font-mono">{c.ideas_count || 1}</strong></span>
              <span>Reputation: <strong className="text-cyan-400 font-mono">{c.reputation_score || 100}</strong></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
