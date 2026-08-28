"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CeoAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ceo/audit-logs");
      const json = await res.json();
      if (json.success && json.data?.auditLogs) {
        setLogs(json.data.auditLogs);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/ceo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CEO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">CEO Governance & Decision Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">Immutable ledger of project commissioning, CFO financial handoffs, and strategic endorsements.</p>
      </div>

      <Card className="p-6 space-y-3">
        <div className="space-y-3">
          {logs.map((l: any) => (
            <div key={l.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-400">{l.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{l.entity}</span>
                </div>
                <p className="text-[11px] text-slate-400">Actor: {l.actor_name || "Executive User"} ({l.actor_role || "SYSTEM"})</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{new Date(l.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
