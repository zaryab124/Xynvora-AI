"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_name: string;
  author_role: string;
  likes_count?: number;
  comments_count?: number;
  is_pinned?: boolean;
  created_at: string;
}

export default function CommunityPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await fetch("/api/public/community");
      const json = await res.json();
      if (json.success && json.data?.posts) {
        setPosts(json.data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) {
      showToast({ title: "Validation Error", message: "Please enter both a title and content.", type: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/public/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Post Published!", message: "Your contribution is live in the community feed.", type: "success" });
        setTitle("");
        setContent("");
        setModalOpen(false);
        fetchPosts();
      } else {
        showToast({ title: "Submission Failed", message: data.error || "Please log in to publish a post.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to publish post. Please check your connection.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={500} top="50px" left="-150px" opacity={0.1} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Open Innovation Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Community Forum & Discussions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            Collaborate on agentic AI architectures, share technical insights, and debate breakthrough solutions with developers and executives worldwide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Start Discussion
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search discussions and topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<span className="text-sm">🔍</span>}
        />
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          title="No Discussions Found"
          description="Be the first to share an insight, ask a technical question, or start an AI discussion!"
          actionLabel="+ Create First Post"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xs font-bold">
                      {post.author_name.charAt(0)}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">{post.author_name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{post.author_role}</span>
                    </div>
                  </div>
                  {post.is_pinned && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                      PINNED
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{post.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">{new Date(post.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer">
                    👍 {post.likes_count || 0}
                  </span>
                  <span className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer">
                    💬 {post.comments_count || 0}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Community Discussion" maxWidth="md">
        <form onSubmit={handleCreatePost} className="space-y-4 pt-2">
          <Input
            label="Discussion Title"
            placeholder="e.g. Scaling autonomous LangChain agents with Redis streams"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Discussion Content"
            placeholder="Share context, architectural patterns, questions, or benchmarks..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Publish Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
