"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CeoDevelopersPage() {
  const [devs, setDevs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ceo/developers");
      const json = await res.json();
      if (json.success && json.data?.developers) {
        setDevs(json.data.developers);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/ceo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CEO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Engineering Squad & Talent Allocation</h1>
        <p className="text-xs text-slate-400 mt-1">Direct view into core AI engineers, squad leads, and active sprint assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devs.map((d: any, i: number) => (
          <Card key={i} glow glowColor="cyan" className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-blue-400 font-bold flex items-center justify-center">
                💻
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{d.full_name}</h4>
                <p className="text-[10px] text-cyan-400 font-mono">{d.position || "Senior AI Architect"}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">Assigned Project: <strong className="text-slate-200">{d.current_project || "Sprint Backlog"}</strong></p>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Status: <strong className="text-emerald-400">Active</strong></span>
              <span>Rep: <strong className="text-cyan-400 font-mono">{d.reputation_score || 500}</strong></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

