"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function CreateIdeaPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("high");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [category, setCategory] = useState("Healthcare");
  const [submitting, setSubmitting] = useState(false);

  async function handleSave(asDraft: boolean) {
    if (!title || !shortDescription || !problemStatement || !proposedSolution) {
      showToast({ title: "Validation Required", message: "Please fill in all mandatory problem & solution fields.", type: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          short_description: shortDescription,
          detailed_description: detailedDescription,
          problem_statement: problemStatement,
          proposed_solution: proposedSolution,
          target_users: targetUsers,
          expected_impact: expectedImpact,
          visibility,
          category,
          as_draft: asDraft,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: asDraft ? "Draft Saved!" : "Idea Submitted!",
          message: asDraft ? "Your idea draft is saved in your member dashboard." : "Your innovation proposal has entered the CGO validation queue.",
          type: "success",
        });
        router.push("/dashboard");
      } else {
        showToast({ title: "Submission Error", message: data.error || "Please verify your inputs.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to connect to idea submission service.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <Link href="/ideas" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Ideas Explorer
      </Link>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Innovation Pipeline Intake
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Submit Innovation Idea / Problem</h1>
          <p className="text-xs text-slate-400 mt-1">
            Proposals are evaluated by Chief Growth Officer (CGO) Hassan Raza and routed to CEO/CFO for capital allocation and engineering execution.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-5">
          <Input
            label="Idea / Problem Title *"
            placeholder="e.g. Autonomous Multi-Branch Inventory Optimization Agent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Industry Domain"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "Healthcare", label: "Healthcare & Clinical AI" },
                { value: "Logistics", label: "Supply Chain & Logistics" },
                { value: "Real Estate", label: "Real Estate & Construction" },
                { value: "AI Automation", label: "Enterprise AI Automation" },
                { value: "E-Commerce", label: "E-Commerce & Retail" },
              ]}
            />

            <Select
              label="Expected Impact"
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
              options={[
                { value: "critical", label: "Critical / Breakthrough" },
                { value: "high", label: "High Impact" },
                { value: "medium", label: "Medium Impact" },
                { value: "low", label: "Low / Incremental" },
              ]}
            />

            <Select
              label="Visibility Level"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              options={[
                { value: "PUBLIC", label: "Public (Visible to All)" },
                { value: "MEMBERS_ONLY", label: "Members Only" },
                { value: "PRIVATE", label: "Private (Executive Only)" },
              ]}
            />
          </div>

          <Textarea
            label="Short Executive Summary *"
            placeholder="One paragraph elevator pitch summarizing the friction and solution..."
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
          />

          <Textarea
            label="Problem Statement & Current Friction *"
            placeholder="Detail the operational bottlenecks, wasted human hours, financial costs, or pain points currently experienced..."
            rows={4}
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            required
          />

          <Textarea
            label="Proposed Autonomous AI Solution *"
            placeholder="Describe the agent architecture, model capabilities, database integrations, or workflows required to solve this..."
            rows={4}
            value={proposedSolution}
            onChange={(e) => setProposedSolution(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Users / Organizations"
              placeholder="e.g. Regional Hospital Chains, Warehouse Operators"
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value)}
            />
            <Input
              label="Estimated Market Value / Efficiency Gains"
              placeholder="e.g. 40% reduction in inventory holding costs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(true)}
              isLoading={submitting}
            >
              💾 Save Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
            >
              🚀 Submit to CGO Queue →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
