"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function CeoCreateProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(50000);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadApprovedIdeas() {
      const res = await fetch("/api/ceo/ideas");
      const json = await res.json();
      if (json.success && json.data?.ideas) {
        const approved = json.data.ideas.filter((i: any) => ['approved', 'ceo_review'].includes(i.status));
        setIdeas(approved);
        if (approved.length > 0) {
          setSelectedIdeaId(approved[0].id);
          setName(approved[0].title);
          setDescription(approved[0].short_description || approved[0].problem_statement || "");
        }
      }
    }
    loadApprovedIdeas();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIdeaId || !name || !description) {
      showToast({ title: "Validation Error", message: "Please fill in all mandatory fields.", type: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/ceo/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: selectedIdeaId,
          name,
          description,
          budget,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Project Commissioned!", message: "Project created and assigned to Development Planning.", type: "success" });
        router.push("/ceo/projects");
      } else {
        showToast({ title: "Error", message: data.error || "Failed to create project", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error creating project.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <Link href="/ceo/projects" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Project Portfolio
      </Link>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
            CEO PROJECT COMMISSIONING
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Commission Project from Approved Proposal</h1>
          <p className="text-xs text-slate-400 mt-1">Authorize engineering squad sprint backlog, assign capital budget, and initiate development planning.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          {ideas.length > 0 ? (
            <Select
              label="Source Approved Proposal *"
              value={selectedIdeaId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedIdeaId(id);
                const found = ideas.find((i) => i.id === id);
                if (found) {
                  setName(found.title);
                  setDescription(found.short_description || "");
                }
              }}
              options={ideas.map((i) => ({ value: i.id, label: `${i.title} (${i.status.toUpperCase()})` }))}
            />
          ) : (
            <Input
              label="Source Idea ID *"
              value={selectedIdeaId}
              onChange={(e) => setSelectedIdeaId(e.target.value)}
              placeholder="e.g. idea_1"
              required
            />
          )}

          <Input
            label="Project Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Sprint Scope & Architecture Brief *"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Allocated Initial Budget ($) *"
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value))}
            required
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => router.push("/ceo/projects")}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              🚀 Authorize & Commission Project →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

