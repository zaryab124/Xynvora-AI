"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Likes state
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // New Comment state
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Report Modal State
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Spam or Advertising");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/community/posts/${id}`);
        const json = await res.json();
        if (json.success && json.data?.post) {
          setPost(json.data.post);
          setLiked(json.data.post.has_liked || false);
          setLikesCount(json.data.post.likes_count || 0);
          setEditTitle(json.data.post.title);
          setEditContent(json.data.post.content);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  async function handleAppreciate() {
    try {
      const res = await fetch("/api/community/appreciate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_type: "post", entity_id: post.id }),
      });
      const data = await res.json();

      if (data.success) {
        setLiked(data.data.liked);
        setLikesCount(data.data.likes_count);
        showToast({
          title: data.data.liked ? "Post Appreciated!" : "Appreciation Removed",
          message: data.data.message,
          type: "success",
        });
      } else {
        showToast({ title: "Action Failed", message: data.error || "Please sign in.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to process appreciation.", type: "error" });
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await fetch(`/api/community/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Comment Added!", message: "Your reply is visible in the thread.", type: "success" });
        setPost((prev: any) => ({
          ...prev,
          comments: [...(prev.comments || []), data.data],
        }));
        setCommentContent("");
      } else {
        showToast({ title: "Comment Failed", message: data.error || "Please sign in to comment.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to post comment.", type: "error" });
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleEditPost(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingEdit(true);
      const res = await fetch(`/api/community/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Post Updated!", message: "Your changes have been saved.", type: "success" });
        setPost((prev: any) => ({
          ...prev,
          title: editTitle,
          content: editContent,
        }));
        setEditOpen(false);
      } else {
        showToast({ title: "Update Failed", message: data.error || "Forbidden", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to update post.", type: "error" });
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeletePost() {
    if (!confirm("Are you sure you want to delete this discussion post?")) return;
    try {
      const res = await fetch(`/api/community/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast({ title: "Post Deleted", message: "Discussion post has been removed.", type: "info" });
        router.push("/community");
      }
    } catch {
      showToast({ title: "Error", message: "Failed to delete post.", type: "error" });
    }
  }

  async function handleReportPost(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmittingReport(true);
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: "post",
          entity_id: post.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Report Submitted", message: "Moderators have been notified for review.", type: "info" });
        setReportOpen(false);
        setReportDetails("");
      }
    } catch {
      showToast({ title: "Error", message: "Failed to submit report.", type: "error" });
    } finally {
      setSubmittingReport(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Discussion Not Found" message="Could not locate the requested community discussion." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation & Controls */}
      <div className="flex items-center justify-between">
        <Link href="/community" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Community Forum
        </Link>
        <div className="flex items-center gap-2">
          {post.is_owner && (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                ✏️ Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeletePost}>
                🗑️ Delete
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => setReportOpen(true)} className="text-xs text-slate-400">
            🚩 Report
          </Button>
        </div>
      </div>

      {/* Post Main Body */}
      <Card glow glowColor="cyan" className="p-8 space-y-6">
        {/* Author Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              {post.author_name?.charAt(0) || "A"}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-none">{post.author_name}</h4>
              <span className="text-[11px] text-cyan-400 font-mono">{post.author_role}</span>
            </div>
          </div>
          <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        {/* Title & Content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Action Bar (Appreciate) */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant={liked ? "primary" : "outline"}
            size="sm"
            onClick={handleAppreciate}
            className="flex items-center gap-2"
          >
            <span>{liked ? "❤️ Appreciated" : "🤍 Appreciate"}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-xs font-mono">{likesCount}</span>
          </Button>

          <span className="text-xs text-slate-400">
            💬 {post.comments?.length || 0} Replies
          </span>
        </div>
      </Card>

      {/* Comments Thread */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Discussion Thread</h3>

        {/* Add Comment Box */}
        <Card className="p-6">
          <form onSubmit={handleAddComment} className="space-y-3">
            <Textarea
              placeholder="Join the discussion... Share technical benchmarks, counter-arguments, or questions."
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm" isLoading={submittingComment}>
                Post Reply →
              </Button>
            </div>
          </form>
        </Card>

        {/* Comments List */}
        {(!post.comments || post.comments.length === 0) ? (
          <p className="text-xs text-slate-400 text-center py-6">No replies yet. Be the first to share an insight!</p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((c: any) => (
              <Card key={c.id} className="p-5 space-y-3 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                      {c.author_name?.charAt(0) || "U"}
                    </span>
                    <span className="font-bold text-white">{c.author_name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">({c.author_role})</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                  {c.content}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Discussion Post" maxWidth="md">
        <form onSubmit={handleEditPost} className="space-y-4 pt-2">
          <Input
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <Textarea
            label="Content"
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={savingEdit}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report Content to Moderation Queue" maxWidth="sm">
        <form onSubmit={handleReportPost} className="space-y-4 pt-2">
          <Select
            label="Reason for Report"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            options={[
              { value: "Spam or Advertising", label: "Spam or Advertising" },
              { value: "Harassment or Abusive Behavior", label: "Harassment or Abusive Behavior" },
              { value: "Misinformation or Harmful Code", label: "Misinformation or Harmful Code" },
              { value: "Copyright Violation", label: "Copyright Violation" },
            ]}
          />
          <Textarea
            label="Additional Details (optional)"
            placeholder="Explain context for our moderation team..."
            rows={3}
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger" isLoading={submittingReport}>Submit Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
