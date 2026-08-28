"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CgoActivitiesPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#7c3aed" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CGO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">CGO Activities & Sprints Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Ecosystem workshops, hackathons, and challenge tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glow glowColor="purple" className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl">🏆</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">UPCOMING</span>
          </div>
          <h3 className="text-xl font-bold text-white">Xynvora AI Global Hackathon 2026</h3>
          <p className="text-xs text-slate-400">Targeting 500+ global developers across Healthcare, Logistics, and E-commerce tracks.</p>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Lead: Mahad Aziz (CGO)</span>
            <span>$25,000 Grants</span>
          </div>
        </Card>

        <Card glow glowColor="purple" className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl">🎓</span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold">ACTIVE</span>
          </div>
          <h3 className="text-xl font-bold text-white">Multi-Agent Systems Masterclass</h3>
          <p className="text-xs text-slate-400">Interactive live training series on LangGraph architecture and PostgreSQL checkpoints.</p>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Lead: Ahmed Khan</span>
            <span>120 Registered</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
