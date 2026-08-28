"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function DeveloperTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Editable Form State
  const [status, setStatus] = useState("in_progress");
  const [priority, setTaskPriority] = useState("high");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/developer/tasks/${id}`);
        const json = await res.json();
        if (json.success && json.data?.task) {
          const t = json.data.task;
          setTask(t);
          setStatus(t.status || "in_progress");
          setTaskPriority(t.priority || "high");
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`/api/developer/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          technical_notes: notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Task Updated", message: "Sprint progress updated successfully.", type: "success" });
        setTask((prev: any) => ({ ...prev, status, priority }));
      } else {
        showToast({ title: "Error", message: data.error || "Failed to update task", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error saving task.", type: "error" });
    } finally {
      setSaving(false);
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

  if (error || !task) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Task Not Found" message="Could not locate the requested engineering task." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/developer/tasks" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Tasks
        </Link>
        <StatusBadge status={task.status} size="md" />
      </div>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
            Project: {task.project_name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{task.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Assignee: {task.assignee_name || "Unassigned"} ({task.assignee_role || "DEVELOPER"})</p>
        </div>

        {task.description && (
          <p className="text-sm text-slate-300 leading-relaxed font-medium p-4 rounded-xl bg-slate-900 border border-slate-800">
            {task.description}
          </p>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Sprint Status *"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "in_progress", label: "In Progress" },
                { value: "review", label: "In Review" },
                { value: "done", label: "Completed (Done)" },
                { value: "blocked", label: "Blocked" },
              ]}
            />

            <Select
              label="Priority Level *"
              value={priority}
              onChange={(e) => setTaskPriority(e.target.value)}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
          </div>

          <Textarea
            label="Technical Progress Notes & PR References"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add pull request URLs, test coverage results, or architecture comments..."
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => router.push("/developer/tasks")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Progress →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
