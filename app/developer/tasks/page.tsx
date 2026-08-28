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

const TASK_TABS = [
  { id: "All", label: "All Tasks" },
  { id: "in_progress", label: "In Progress" },
  { id: "todo", label: "To Do" },
  { id: "review", label: "In Review" },
  { id: "done", label: "Completed" },
];

export default function DeveloperTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/developer/tasks");
        const json = await res.json();
        if (json.success && json.data?.tasks) {
          setTasks(json.data.tasks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = tasks.filter((t) => {
    const matchesTab = activeTab === "All" || t.status === activeTab;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.project_name && t.project_name.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/developer/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to Developer Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Sprint Tasks & Action Items</h1>
          <p className="text-xs text-slate-400 mt-1">Manage individual engineering tasks, submit pull requests, and track status.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Tabs tabs={TASK_TABS} activeTab={activeTab} onChange={setActiveTab} />
        <div className="w-full md:w-72">
          <Input
            placeholder="Search tasks..."
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
        <EmptyState title="No Tasks Found" description="There are currently no tasks matching the selected filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <Card key={t.id} glow glowColor="cyan" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">{t.project_name}</span>
                  <StatusBadge status={t.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                  <Link href={`/developer/tasks/${t.id}`}>{t.title}</Link>
                </h3>
                <p className="text-xs text-slate-400">
                  Assignee: <strong className="text-slate-300">{t.assignee_name || "Unassigned"}</strong> • Priority: <strong className="text-amber-400 uppercase font-mono">{t.priority}</strong>
                </p>
              </div>

              <Link href={`/developer/tasks/${t.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Open Task Workbench →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
