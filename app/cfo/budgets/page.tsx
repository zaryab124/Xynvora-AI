"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CfoBudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cfo/budgets");
      const json = await res.json();
      if (json.success && json.data?.budgets) {
        setBudgets(json.data.budgets);
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
        <h1 className="text-3xl font-extrabold text-white">Capital Expenditure & Budget Ledgers</h1>
        <p className="text-xs text-slate-400 mt-1">Audit R&D capital commitments, allocated sprint funds, and remaining treasury reserves.</p>
      </div>

      <div className="space-y-4">
        {budgets.map((b: any) => (
          <Card key={b.id} glow glowColor="purple" className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">{b.name}</h3>
                <p className="text-xs text-slate-400">Status: <strong className="text-cyan-400 uppercase">{b.status}</strong></p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Allocated Budget</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono">${b.budget?.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Disbursed Spend:</span>
                <span className="font-bold text-amber-400 font-mono">${b.spent?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Available Balance:</span>
                <span className="font-bold text-emerald-400 font-mono">${(b.remaining_budget || b.budget - (b.spent || 0)).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
