"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

export default function EditIdeaPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [idea, setIdea] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("high");

  useEffect(() => {
    async function loadIdea() {
      try {
        setLoading(true);
        const res = await fetch(`/api/ideas/${id}`);
        const json = await res.json();
        if (json.success && json.data?.idea) {
          const d = json.data.idea;
          setIdea(d);
          setTitle(d.title || "");
          setShortDescription(d.short_description || "");
          setProblemStatement(d.problem_statement || "");
          setProposedSolution(d.proposed_solution || "");
          setTargetUsers(d.target_users || "");
          setExpectedImpact(d.expected_impact?.toLowerCase() || "high");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadIdea();
  }, [id]);

  async function handleSave(resubmitToCgo: boolean) {
    try {
      setSaving(true);
      const res = await fetch(`/api/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          short_description: shortDescription,
          problem_statement: problemStatement,
          proposed_solution: proposedSolution,
          target_users: targetUsers,
          expected_impact: expectedImpact,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        showToast({ title: "Update Failed", message: data.error || "Cannot edit in current status", type: "error" });
        return;
      }

      if (resubmitToCgo) {
        const transRes = await fetch(`/api/ideas/${id}/transition`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newStatus: "SUBMITTED",
            notes: "Revised proposal submitted by author.",
          }),
        });
        const transData = await transRes.json();
        if (transData.success) {
          showToast({ title: "Idea Submitted!", message: "Your revised proposal is now in CGO review queue.", type: "success" });
          router.push(`/ideas/${id}`);
          return;
        }
      }

      showToast({ title: "Changes Saved", message: "Idea updated successfully.", type: "success" });
      router.push(`/ideas/${id}`);
    } catch {
      showToast({ title: "Error", message: "Failed to update idea.", type: "error" });
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

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <Link href={`/ideas/${id}`} className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Idea Inspector
      </Link>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Status: {idea?.status?.toUpperCase()}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Edit Innovation Proposal</h1>
          <p className="text-xs text-slate-400 mt-1">Refine your problem statement and proposed solution based on reviewer feedback.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-5">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Short Summary"
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />

          <Textarea
            label="Problem Statement"
            rows={4}
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            required
          />

          <Textarea
            label="Proposed Solution"
            rows={4}
            value={proposedSolution}
            onChange={(e) => setProposedSolution(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Users"
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value)}
            />
            <Select
              label="Expected Impact"
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
              options={[
                { value: "critical", label: "Critical / Breakthrough" },
                { value: "high", label: "High Impact" },
                { value: "medium", label: "Medium Impact" },
                { value: "low", label: "Low Impact" },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(false)}
              isLoading={saving}
            >
              Save Draft Changes
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => handleSave(true)}
              isLoading={saving}
            >
              🚀 Save & Submit to CGO →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
