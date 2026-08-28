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

const CGO_STATUS_TABS = [
  { id: "All", label: "All Proposals" },
  { id: "submitted", label: "Awaiting Triage" },
  { id: "cgo_review", label: "Active Validation" },
  { id: "needs_changes", label: "Needs Changes" },
  { id: "ceo_review", label: "Routed to CEO" },
  { id: "rejected", label: "Rejected" },
];

export default function CgoIdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadIdeas() {
      try {
        setLoading(true);
        const url = activeTab === "All" ? "/api/ideas" : `/api/ideas?status=${activeTab}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success && json.data?.ideas) {
          setIdeas(json.data.ideas);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, [activeTab]);

  const filtered = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.submitter_name && i.submitter_name.toLowerCase().includes(search.toLowerCase())) ||
      (i.category_name && i.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to CGO Command Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CGO Innovation Triage Workbench</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review problem statements, validate market feasibility, request revisions, and route high-impact solutions to CEO.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Tabs tabs={CGO_STATUS_TABS} activeTab={activeTab} onChange={setActiveTab} />
        <div className="w-full md:w-72">
          <Input
            placeholder="Search proposals or submitter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span className="text-sm">🔍</span>}
          />
        </div>
      </div>

      {/* Ideas Table / Grid */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Proposals in this Queue"
          description="There are currently no idea submissions matching the selected triage filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((idea) => (
            <Card key={idea.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {idea.category_name || "General"}
                  </span>
                  <StatusBadge status={idea.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-300 transition-colors">
                  <Link href={`/cgo/ideas/${idea.slug || idea.id}`}>{idea.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {idea.short_description || idea.problem_statement}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>By: <strong className="text-slate-200">{idea.submitter_name || "Innovator"}</strong></span>
                  <span>Impact: <strong className="text-cyan-400 uppercase">{idea.expected_impact || "Medium"}</strong></span>
                </div>
                <Link href={`/cgo/ideas/${idea.slug || idea.id}`} className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    ⚡ Open Triage Workbench →
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
