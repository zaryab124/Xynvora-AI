"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CfoPartnershipsPage() {
  const [partnerships, setPartnerships] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cfo/partnerships");
      const json = await res.json();
      if (json.success && json.data?.partnerships) {
        setPartnerships(json.data.partnerships);
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
        <h1 className="text-3xl font-extrabold text-white">Commercial Terms & Partnership Economics</h1>
        <p className="text-xs text-slate-400 mt-1">Review enterprise client revenue sharing models, technology barter terms, and licensing contracts.</p>
      </div>

      <div className="space-y-4">
        {partnerships.map((p: any) => (
          <Card key={p.id} glow glowColor="purple" className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">{p.partnership_type}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{p.company_name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                {p.status?.toUpperCase()}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Commercial Structure:</span>
                <p className="font-bold text-white mt-0.5">{p.revenue_share || p.cost_reduction || "Standard Pilot Agreement"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Estimated MRR / Impact:</span>
                <p className="font-bold text-emerald-400 font-mono mt-0.5">{p.estimated_mrr ? `$${p.estimated_mrr.toLocaleString()} / mo` : "Cost Reduction Agreement"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
