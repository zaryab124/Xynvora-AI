"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/reports");
        const json = await res.json();
        if (json.success && json.data?.reports) {
          setReports(json.data.reports);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Community Moderation & Incident Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Review reported posts, abusive comments, user restrictions, and policy escalations.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{r.reason}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-rose-400 font-mono uppercase text-[10px]">
                    Target: {r.entity_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${r.status === 'pending' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-slate-400">Reporter: <strong className="text-slate-200">{r.reporter_name || "Community Member"}</strong></p>
                {r.details && <p className="text-slate-300 text-[11px] pt-1">{r.details}</p>}
              </div>

              <Link href={`/admin/reports/${r.id}`}>
                <Button variant="danger" size="sm" className="text-xs">
                  Review & Resolve →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
