"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function DeveloperProjectWorkspacePage() {
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // New Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [creatingTask, setCreatingTask] = useState(false);

  // Sprint Transition State
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/developer/projects/${id}`);
        const json = await res.json();
        if (json.success && json.data?.project) {
          setProject(json.data.project);
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

  async function handleSprintTransition(newStatus: string) {
    try {
      setTransitioning(true);
      const res = await fetch(`/api/developer/projects/${id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: "Sprint Status Updated",
          message: `Project progressed to ${newStatus.replace('_', ' ').toUpperCase()}.`,
          type: "success",
        });
        setProject((prev: any) => ({ ...prev, status: newStatus.toLowerCase() }));
      } else {
        showToast({ title: "Transition Failed", message: data.error || "Error updating sprint", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error during sprint transition.", type: "error" });
    } finally {
      setTransitioning(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskTitle) return;

    try {
      setCreatingTask(true);
      const res = await fetch("/api/developer/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project.id,
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Task Created", message: `Task "${taskTitle}" added to sprint board.`, type: "success" });
        setProject((prev: any) => ({
          ...prev,
          tasks: [
            ...(prev.tasks || []),
            {
              id: data.data?.id || "task_" + Date.now(),
              title: taskTitle,
              description: taskDesc,
              status: "todo",
              priority: taskPriority,
              assignee_name: "Me",
            }
          ]
        }));
        setShowTaskModal(false);
        setTaskTitle("");
        setTaskDesc("");
      } else {
        showToast({ title: "Failed", message: data.error || "Could not create task", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error creating task", type: "error" });
    } finally {
      setCreatingTask(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Project Workspace Unavailable" message="You may not have squad clearance for this project, or the project ID is invalid." />
      </div>
    );
  }

  const tasks = project.tasks || [];
  const todoTasks = tasks.filter((t: any) => t.status === "todo");
  const inProgressTasks = tasks.filter((t: any) => t.status === "in_progress");
  const reviewTasks = tasks.filter((t: any) => t.status === "review");
  const doneTasks = tasks.filter((t: any) => t.status === "done");

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/developer/projects" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Assigned Projects
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">My Role: <strong className="text-cyan-400 uppercase">{project.current_user_role}</strong></span>
          <StatusBadge status={project.status} size="md" />
        </div>
      </div>

      {/* Overview Card */}
      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Engineering Sprint Workspace</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{project.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {project.status === 'planning' && (
              <Button variant="primary" size="sm" onClick={() => handleSprintTransition('in_development')} isLoading={transitioning}>
                🚀 Start Development →
              </Button>
            )}
            {project.status === 'in_development' && (
              <Button variant="primary" size="sm" onClick={() => handleSprintTransition('testing')} isLoading={transitioning} className="bg-amber-600 hover:bg-amber-500">
                🧪 Submit to Testing Phase →
              </Button>
            )}
            {project.status === 'testing' && (
              <Button variant="primary" size="sm" onClick={() => handleSprintTransition('production_review')} isLoading={transitioning} className="bg-purple-600 hover:bg-purple-500">
                🛡️ Request Production Review →
              </Button>
            )}
            {project.status === 'production_review' && (
              <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
                Awaiting Final CEO Production Signoff
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>

        {/* Progress bar */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Sprint Milestone Completion</span>
            <span className="font-bold text-cyan-400 font-mono">{project.progress || 45}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${project.progress || 45}%` }} />
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Sprint Task Board
          </h2>
          <Button variant="primary" size="sm" onClick={() => setShowTaskModal(true)}>
            + Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TODO Column */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>To Do ({todoTasks.length})</span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((t: any) => (
                <Card key={t.id} className="p-4 space-y-2 text-xs">
                  <Link href={`/developer/tasks/${t.id}`} className="font-bold text-white hover:text-cyan-300 block">
                    {t.title}
                  </Link>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{t.assignee_name || "Unassigned"}</span>
                    <span className="uppercase text-amber-400 font-mono">{t.priority}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* IN_PROGRESS Column */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-cyan-400 uppercase">
              <span>In Progress ({inProgressTasks.length})</span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((t: any) => (
                <Card key={t.id} glow glowColor="cyan" className="p-4 space-y-2 text-xs">
                  <Link href={`/developer/tasks/${t.id}`} className="font-bold text-white hover:text-cyan-300 block">
                    {t.title}
                  </Link>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{t.assignee_name || "Unassigned"}</span>
                    <span className="uppercase text-cyan-400 font-mono">{t.priority}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* REVIEW Column */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-purple-400 uppercase">
              <span>In Review ({reviewTasks.length})</span>
            </div>
            <div className="space-y-3">
              {reviewTasks.map((t: any) => (
                <Card key={t.id} className="p-4 space-y-2 text-xs">
                  <Link href={`/developer/tasks/${t.id}`} className="font-bold text-white hover:text-purple-300 block">
                    {t.title}
                  </Link>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{t.assignee_name || "Unassigned"}</span>
                    <span className="uppercase text-purple-400 font-mono">{t.priority}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* DONE Column */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-400 uppercase">
              <span>Done ({doneTasks.length})</span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((t: any) => (
                <Card key={t.id} className="p-4 space-y-2 text-xs opacity-80">
                  <Link href={`/developer/tasks/${t.id}`} className="font-bold text-slate-300 hover:text-emerald-300 block line-through">
                    {t.title}
                  </Link>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{t.assignee_name || "Unassigned"}</span>
                    <span className="text-emerald-400 font-mono">✓ Verified</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card glow glowColor="cyan" className="max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create Sprint Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <Input
                label="Task Title *"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Implement WebSocket Streaming Layer"
                required
              />
              <Textarea
                label="Task Technical Scope"
                rows={3}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Acceptance criteria and architecture details..."
              />
              <Select
                label="Priority"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowTaskModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={creatingTask}>Create Task</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
