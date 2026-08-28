"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function CreateDiscussionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Discussion Published!", message: "Your post is live in the community feed.", type: "success" });
        router.push("/community");
      } else {
        showToast({ title: "Error", message: data.error || "Please check inputs.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to create post. Please check connection.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <Link href="/community" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Community Forum
      </Link>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            New Discussion Post
          </div>
          <h1 className="text-2xl font-extrabold text-white">Start a Technical Discussion</h1>
          <p className="text-xs text-slate-400 mt-1">
            Share architecture patterns, benchmark findings, AI workflows, or open challenges with the global innovator network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Discussion Title"
            placeholder="e.g. Scaling LangGraph Agent Checkpointing on PostgreSQL"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Discussion Content (Markdown supported)"
            placeholder="Describe the context, technical challenges, architectural diagrams, or questions in detail..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Link href="/community">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Publish Discussion Post →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
