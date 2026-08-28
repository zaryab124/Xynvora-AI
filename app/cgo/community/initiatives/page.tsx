"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CgoInitiativesPage() {
  const [initiatives, setInitiatives] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cgo/community/initiatives");
      const json = await res.json();
      if (json.success && json.data?.initiatives) {
        setInitiatives(json.data.initiatives);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#7c3aed" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to CGO Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Community Initiatives & Sprints</h1>
          <p className="text-xs text-slate-400 mt-1">Deploy hackathons, open problem challenges, and grant sponsorships.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initiatives.map((init: any) => (
          <Card key={init.id} glow glowColor="purple" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
                {init.initiative_type}
              </span>
              <span className="text-xs text-emerald-400 font-bold uppercase">{init.status}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{init.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{init.description || "Community-led problem solving sprint."}</p>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Budget Allocation: <strong className="text-cyan-400 font-mono">${init.budget_allocated || 10000}</strong></span>
              <span>Timeline: {init.starts_at || "Active"}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
