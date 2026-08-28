"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

interface Idea {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: string;
  category: string;
  submitter_name: string;
  cgo_priority: string;
  estimated_impact: string;
  view_count: number;
  created_at: string;
}

const CATEGORY_TABS = [
  { id: "All", label: "All Categories" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Logistics", label: "Logistics" },
  { id: "Real Estate", label: "Real Estate" },
  { id: "AI Automation", label: "AI Automation" },
];

export default function IdeasPage() {
  const { showToast } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Submission Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [category, setCategory] = useState("Healthcare");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [activeCategory]);

  async function fetchIdeas() {
    try {
      setLoading(true);
      const url = activeCategory === "All" ? "/api/public/ideas" : `/api/public/ideas?category=${activeCategory}`;
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

  async function handleSubmitIdea(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/public/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          problem_statement: problemStatement,
          proposed_solution: proposedSolution,
          target_audience: targetAudience,
          category,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Idea Submitted!", message: "Your idea has entered the CGO intake queue for validation.", type: "success" });
        setTitle("");
        setSummary("");
        setProblemStatement("");
        setProposedSolution("");
        setTargetAudience("");
        setModalOpen(false);
        fetchIdeas();
      } else {
        showToast({ title: "Submission Error", message: data.error || "Please check your submission inputs.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to submit idea. Please check connection.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredIdeas = ideas.filter(
    (i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Intake & Ideation Queue
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Community Innovation Explorer</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            Explore submitted problems and solutions progressing through CGO triage, CFO financial analysis, and CEO project signoff.
          </p>
        </div>

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Submit Problem / Idea
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Tabs tabs={CATEGORY_TABS} activeTab={activeCategory} onChange={setActiveCategory} />
        <div className="w-full md:w-72">
          <Input
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span className="text-sm">🔍</span>}
          />
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredIdeas.length === 0 ? (
        <EmptyState
          title="No Ideas Found"
          description="No innovation ideas match the current category. Be the first to submit one!"
          actionLabel="+ Submit an Idea"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {idea.category}
                  </span>
                  <StatusBadge status={idea.status} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-cyan-300 transition-colors">
                  <Link href={`/ideas/${idea.slug || idea.id}`}>{idea.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{idea.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>By {idea.submitter_name}</span>
                <Link href={`/ideas/${idea.slug || idea.id}`} className="text-cyan-400 font-semibold hover:underline">
                  Inspect Lifecycle →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Idea Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit an Innovation Idea / Problem" maxWidth="lg">
        <form onSubmit={handleSubmitIdea} className="space-y-4 pt-2">
          <Input
            label="Idea Title"
            placeholder="e.g. Autonomous EHR Clinical Transcription Assistant"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "Healthcare", label: "Healthcare & Life Sciences" },
              { value: "Logistics", label: "Logistics & Supply Chain" },
              { value: "Real Estate", label: "Real Estate & Construction" },
              { value: "AI Automation", label: "Enterprise AI Automation" },
              { value: "E-commerce", label: "E-commerce & Retail" },
            ]}
          />

          <Textarea
            label="Brief Summary"
            placeholder="One paragraph overview of the breakthrough..."
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />

          <Textarea
            label="Problem Statement"
            placeholder="Describe the friction, costs, or bottlenecks currently experienced..."
            rows={3}
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            required
          />

          <Textarea
            label="Proposed AI Solution"
            placeholder="Describe the agentic framework, model capabilities, or workflow automation needed..."
            rows={3}
            value={proposedSolution}
            onChange={(e) => setProposedSolution(e.target.value)}
            required
          />

          <Input
            label="Target Audience / Beneficiaries"
            placeholder="e.g. Outpatient Clinics, Radiologists, Hospital Administrators"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Submit to CGO Queue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
