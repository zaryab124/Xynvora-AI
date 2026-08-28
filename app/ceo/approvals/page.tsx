"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CeoApprovalsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ceo/approvals");
      const json = await res.json();
      if (json.success && json.data?.approvals) {
        setData(json.data.approvals);
      }
    }
    load();
  }, []);

  const ideas = data?.ideas || [];
  const partnerships = data?.partnerships || [];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/ceo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CEO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Executive Pending Approvals Desk</h1>
        <p className="text-xs text-slate-400 mt-1">Single-pane view for strategic proposal decisions, CFO signoffs, and partner agreements.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Proposals Awaiting Strategic Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea: any) => (
            <Card key={idea.id} glow glowColor="cyan" className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-blue-400 font-bold">{idea.status}</span>
                <span className="text-xs text-slate-400">{idea.submitter_name}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{idea.title}</h3>
              {idea.estimated_cost && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between text-slate-300">
                  <span>Cost: <strong className="text-amber-400 font-mono">${idea.estimated_cost?.toLocaleString()}</strong></span>
                  <span>Revenue: <strong className="text-emerald-400 font-mono">${idea.estimated_revenue?.toLocaleString()}</strong></span>
                </div>
              )}
              <Link href={`/ceo/ideas/${idea.slug || idea.id}`} className="block">
                <Button variant="primary" size="sm" className="w-full">
                  Evaluate & Sign Off →
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white pt-4">Strategic Enterprise Partnerships</h2>
        <div className="space-y-4">
          {partnerships.map((p: any) => (
            <Card key={p.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{p.partnership_type}</span>
                <h4 className="text-lg font-bold text-white">{p.company_name}</h4>
                <p className="text-xs text-slate-400">{p.proposal_summary}</p>
              </div>
              <Button variant="primary" size="sm" className="whitespace-nowrap">
                Review Agreement →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

