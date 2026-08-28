"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CeoActivitiesPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/ceo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CEO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">CEO Activities & Board Sprints</h1>
        <p className="text-xs text-slate-400 mt-1">Strategic milestones, executive town halls, and investor briefings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glow glowColor="cyan" className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl">🏛️</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">UPCOMING</span>
          </div>
          <h3 className="text-xl font-bold text-white">Q2 Strategic Innovation Town Hall</h3>
          <p className="text-xs text-slate-400">Quarterly address to 120+ community innovators and enterprise partners.</p>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Host: Muhammad Zaryab Hassan (CEO)</span>
            <span>May 15, 2026</span>
          </div>
        </Card>

        <Card glow glowColor="cyan" className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl">🤝</span>
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold">ACTIVE</span>
          </div>
          <h3 className="text-xl font-bold text-white">Health System Enterprise Pilot Signoff</h3>
          <p className="text-xs text-slate-400">Finalizing 4-hospital autonomous EHR deployment with City General Hospital.</p>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Partners: CGO + CEO</span>
            <span>Live Review</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

