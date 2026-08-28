"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CgoGrowthPage() {
  const [growth, setGrowth] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cgo/growth");
      const json = await res.json();
      if (json.success && json.data?.growthMetrics) {
        setGrowth(json.data.growthMetrics);
      }
    }
    load();
  }, []);

  const g = growth || {
    monthlyActiveGrowth: "+38%",
    ideaIntakeVelocity: "14 ideas / week",
    validationCycleTime: "1.8 days",
    industryBreakdown: [
      { domain: "Healthcare AI", count: 12, share: "37.5%" },
      { domain: "Supply Chain & Logistics", count: 9, share: "28.1%" },
      { domain: "Enterprise Automation", count: 7, share: "21.9%" },
      { domain: "Real Estate Tech", count: 4, share: "12.5%" },
    ]
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CGO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Innovation Growth Telemetry</h1>
        <p className="text-xs text-slate-400 mt-1">Ecosystem expansion rate, submission velocities, and category market traction.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card glow glowColor="cyan" className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Monthly Ecosystem Growth</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{g.monthlyActiveGrowth}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Intake Velocity</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">{g.ideaIntakeVelocity}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Avg Validation Cycle</span>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">{g.validationCycleTime}</div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Industry Category Breakdown</h3>
        <div className="space-y-3">
          {g.industryBreakdown?.map((ind: any, i: number) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-white">{ind.domain}</span>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-mono">{ind.count} proposals</span>
                <span className="font-bold text-cyan-400 font-mono">{ind.share}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
