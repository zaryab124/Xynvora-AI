"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CfoReportsPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cfo/reports");
      const json = await res.json();
      if (json.success && json.data?.financialReports) {
        setReports(json.data.financialReports);
      }
    }
    load();
  }, []);

  const r = reports || {
    quarterlyGrossMargin: "78.4%",
    monthlyRecurringRevenue: "$142,000",
    annualizedRunRate: "$1,704,000",
    blendedCAC: "$2,400",
    estimatedLTV: "$36,000",
    paybackPeriodMonths: 2.8,
    rAndDBurnRate: "$38,000 / mo",
    runwayMonths: 28,
    projections: [
      { quarter: "Q1 2026", revenue: 380000, expenses: 195000, ebitda: 185000 },
      { quarter: "Q2 2026", revenue: 520000, expenses: 240000, ebitda: 280000 },
      { quarter: "Q3 2026", revenue: 740000, expenses: 310000, ebitda: 430000 },
    ]
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cfo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CFO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Financial Feasibility & Unit Economics</h1>
        <p className="text-xs text-slate-400 mt-1">Audit venture margins, payback periods, LTV/CAC ratios, and cash runway projections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card glow glowColor="purple" className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Gross Margin</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{r.quarterlyGrossMargin}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Monthly Run Rate</span>
          <div className="text-2xl font-extrabold text-white font-mono">{r.monthlyRecurringRevenue}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">LTV : CAC</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">15.0x</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Treasury Runway</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{r.runwayMonths} Months</div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Quarterly Revenue vs R&D Expense Projections</h3>
        <div className="space-y-3">
          {r.projections?.map((p: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-white text-sm">{p.quarter}</span>
              <div className="flex items-center gap-6">
                <span>Revenue: <strong className="text-emerald-400 font-mono">${p.revenue.toLocaleString()}</strong></span>
                <span>Expenses: <strong className="text-amber-400 font-mono">${p.expenses.toLocaleString()}</strong></span>
                <span>EBITDA: <strong className="text-cyan-400 font-mono">${p.ebitda.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
