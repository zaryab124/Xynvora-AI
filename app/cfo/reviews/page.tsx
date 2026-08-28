"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const CFO_TABS = [
  { id: "All", label: "All Financial Reviews" },
  { id: "cfo_review", label: "Awaiting Valuation" },
  { id: "approved", label: "CFO Approved" },
  { id: "needs_changes", label: "Financial Revisions" },
];

export default function CfoReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/cfo/reviews");
        const json = await res.json();
        if (json.success && json.data?.reviews) {
          setReviews(json.data.reviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = reviews.filter((r) => {
    const matchesTab = activeTab === "All" || r.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.submitter_name && r.submitter_name.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#10b981" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/cfo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to CFO Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">CFO Financial Evaluation Desk</h1>
          <p className="text-xs text-slate-400 mt-1">Review unit economics, model venture ROI, and allocate capital budgets.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Tabs tabs={CFO_TABS} activeTab={activeTab} onChange={setActiveTab} />
        <div className="w-full md:w-72">
          <Input
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No Proposals in Queue" description="There are currently no proposals matching the selected financial status." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <Card key={r.id} glow glowColor="purple" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase">{r.category_name || "Enterprise AI"}</span>
                  <StatusBadge status={r.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-purple-300 transition-colors">
                  <Link href={`/cfo/reviews/${r.slug || r.id}`}>{r.title}</Link>
                </h3>
                <p className="text-xs text-slate-400">
                  Submitter: <strong className="text-slate-200">{r.submitter_name}</strong> • Impact: <strong className="text-cyan-400 uppercase">{r.estimated_impact}</strong>
                </p>
                {r.estimated_cost && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex justify-between text-slate-300">
                    <span>Cost: <strong className="text-amber-400 font-mono">${r.estimated_cost?.toLocaleString()}</strong></span>
                    <span>Rev: <strong className="text-emerald-400 font-mono">${r.estimated_revenue?.toLocaleString()}</strong></span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <Link href={`/cfo/reviews/${r.slug || r.id}`} className="w-full">
                  <Button variant="primary" size="sm" className="w-full bg-purple-600 hover:bg-purple-500">
                    📊 Conduct Valuation Desk →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
