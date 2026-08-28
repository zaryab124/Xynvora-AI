"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/dashboard");
        const json = await res.json();
        if (json.success && json.data?.dashboard) {
          setDashboard(json.data.dashboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const user = dashboard?.user || { full_name: "Community Innovator", role: "COMMUNITY_MEMBER" };
  const myIdeas = dashboard?.myIdeas || [];
  const recentDiscussions = dashboard?.recentDiscussions || [];
  const unreadNotifs = dashboard?.unreadNotificationsCount || 0;
  const completion = dashboard?.profileCompletion || 80;

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* ─── 1. WELCOME HEADER ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              {user.role}
            </span>
            <span className="text-xs text-slate-400">Authenticated Member Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user.full_name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your innovation submissions, engage in technical discussions, and review executive triage updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/ideas">
            <Button variant="primary" size="sm">
              + Submit Idea
            </Button>
          </Link>
          <Link href="/community/create">
            <Button variant="outline" size="sm">
              + Start Discussion
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. PROFILE COMPLETION & METRICS ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Completion Bar */}
        <Card glow glowColor="cyan" className="p-6 lg:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Profile Readiness</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{completion}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: `${completion}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your profile with skills, portfolio, and bio to increase your credibility across the innovation network.
            </p>
          </div>
          <Link href="/profile/edit">
            <Button variant="ghost" size="sm" className="text-xs text-cyan-400 p-0 hover:bg-transparent">
              Complete Profile Setup →
            </Button>
          </Link>
        </Card>

        {/* Unread Alerts */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Unread Alerts</span>
            <div className="text-3xl font-extrabold text-white">{unreadNotifs}</div>
          </div>
          <Link href="/notifications" className="text-xs text-cyan-400 font-semibold hover:underline">
            View Notifications Inbox →
          </Link>
        </Card>

        {/* Ideas Count */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Submitted Ideas</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">{myIdeas.length}</div>
          </div>
          <span className="text-[11px] text-slate-400">In CGO / CFO Pipeline</span>
        </Card>
      </div>

      {/* ─── 3. MY IDEAS & GOVERNANCE PIPELINE ───────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Submitted Innovation Ideas</h2>
          <Link href="/ideas" className="text-xs text-cyan-400 hover:underline font-semibold">
            Explore All Ideas →
          </Link>
        </div>

        {myIdeas.length === 0 ? (
          <EmptyState
            title="No Innovation Ideas Submitted"
            description="Have an AI automation proposal or industry problem? Submit it directly to CGO triage."
            actionLabel="+ Submit an Idea"
            onAction={() => window.location.href = "/ideas"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myIdeas.map((idea: any) => (
              <Card key={idea.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {new Date(idea.created_at).toLocaleDateString()}
                    </span>
                    <StatusBadge status={idea.status} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-300 transition-colors">
                    <Link href={`/ideas/${idea.slug || idea.id}`}>{idea.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{idea.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Priority: <strong className="text-cyan-400">{idea.cgo_priority || "Triage"}</strong></span>
                  <Link href={`/ideas/${idea.slug || idea.id}`} className="text-cyan-400 font-semibold hover:underline">
                    Track Lifecycle →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─── 4. RECENT COMMUNITY DISCUSSIONS & NOTIFICATIONS ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Discussions */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">My Community Discussions</h3>
            <Link href="/community/create" className="text-xs text-cyan-400 hover:underline">
              + New Post
            </Link>
          </div>

          {recentDiscussions.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">You haven&apos;t posted any community discussions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentDiscussions.map((d: any) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <Link href={`/community/post/${d.slug || d.id}`} className="text-xs font-semibold text-white hover:text-cyan-300 line-clamp-1">
                    {d.title}
                  </Link>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3">
                    {new Date(d.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links & Settings */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">Account Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/profile" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">👤</span>
              <p className="text-xs font-bold text-white">View Public Profile</p>
            </Link>
            <Link href="/profile/edit" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">✏️</span>
              <p className="text-xs font-bold text-white">Edit Profile</p>
            </Link>
            <Link href="/notifications" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">🔔</span>
              <p className="text-xs font-bold text-white">Notification Center</p>
            </Link>
            <Link href="/settings" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">⚙️</span>
              <p className="text-xs font-bold text-white">Privacy & Settings</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
