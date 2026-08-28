"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CeoAnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ceo/analytics");
      const json = await res.json();
      if (json.success && json.data?.analytics) {
        setData(json.data.analytics);
      }
    }
    load();
  }, []);

  const a = data || {
    innovationThroughput: "8.4 ideas / sprint",
    cgoTriageEfficiency: "94.2%",
    cfoBudgetApprovalRate: "88%",
    sprintDeliveryVelocity: "96.5% on-time",
    ecosystemNPS: 78,
    activeEnterprisePilots: 3,
    pipelineValuation: "$2.4M projected enterprise impact",
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/ceo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CEO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Venture & Innovation Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Holistic strategic metrics across pipeline throughput, executive signoff velocity, and pilot deployment.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card glow glowColor="cyan" className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pipeline Valuation</span>
          <div className="text-2xl font-extrabold text-emerald-400">{a.pipelineValuation}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Throughput Velocity</span>
          <div className="text-2xl font-extrabold text-blue-400 font-mono">{a.innovationThroughput}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Sprint Delivery</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{a.sprintDeliveryVelocity}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">CGO Triage Efficiency</span>
          <div className="text-xl font-bold text-white font-mono">{a.cgoTriageEfficiency}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">CFO Signoff Rate</span>
          <div className="text-xl font-bold text-white font-mono">{a.cfoBudgetApprovalRate}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Active Enterprise Pilots</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">{a.activeEnterprisePilots} Live</div>
        </Card>
      </div>
    </div>
  );
}

