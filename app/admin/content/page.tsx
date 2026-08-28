"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function AdminContentPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/content");
      const json = await res.json();
      if (json.success && json.data?.posts) {
        setPosts(json.data.posts);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Community Content Moderation</h1>
        <p className="text-xs text-slate-400 mt-1">Audit active discussion threads, pin announcements, and lock violating posts.</p>
      </div>

      <div className="space-y-3">
        {posts.map((p) => (
          <Card key={p.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{p.title}</span>
                {p.is_pinned && <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">PINNED</span>}
                {p.is_locked && <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px]">LOCKED</span>}
              </div>
              <p className="text-slate-400">Author: <strong className="text-slate-200">{p.author_name}</strong></p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                {p.is_locked ? "Unlock Post" : "Lock Post"}
              </Button>
              <Button variant="danger" size="sm" className="text-xs">
                Remove Content
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
