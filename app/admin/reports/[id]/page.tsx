"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function AdminReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [action, setAction] = useState("HIDE_CONTENT");
  const [notes, setNotes] = useState("Content violates community marketing policy. Item has been hidden.");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/reports/${id}`);
        const json = await res.json();
        if (json.success && json.data?.report) {
          setReport(json.data.report);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleResolve(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResolving(true);
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resolution_notes: notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Incident Resolved", message: `Action ${action} executed successfully.`, type: "success" });
        router.push("/admin/reports");
      } else {
        showToast({ title: "Error", message: data.error || "Resolution failed", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error resolving report.", type: "error" });
    } finally {
      setResolving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Report Not Found" message="Could not locate the requested moderation report." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/admin/reports" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Reports Queue
        </Link>
        <span className="px-2.5 py-1 rounded text-xs font-mono uppercase font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          Status: {report.status}
        </span>
      </div>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-rose-400 font-bold uppercase">Target Entity: {report.entity_type} ({report.entity_id})</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{report.reason}</h1>
          <p className="text-xs text-slate-400 mt-1">Reported by: {report.reporter_name || "Community Member"} • Date: {new Date(report.created_at).toLocaleString()}</p>
        </div>

        {report.details && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">Reporter Commentary:</span>
            <p className="text-sm text-slate-200">{report.details}</p>
          </div>
        )}

        <form onSubmit={handleResolve} className="space-y-6 pt-2">
          <Select
            label="Moderation Resolution Action *"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            options={[
              { value: "HIDE_CONTENT", label: "Hide Content (Conceal from public and member feeds)" },
              { value: "REMOVE_CONTENT", label: "Remove Content (Permanently delete violating entity)" },
              { value: "RESTRICT_USER", label: "Restrict User (Temporarily suspend account)" },
              { value: "ESCALATE", label: "Escalate to Executive Team" },
              { value: "DISMISS", label: "Dismiss Report (No violation found)" },
            ]}
          />

          <Textarea
            label="Resolution Rationale & Incident Notes *"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/reports")}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={resolving}>
              Execute Moderation Decision →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
