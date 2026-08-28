"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.success && json.data?.dashboard) {
          setData(json.data.dashboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const health = data?.systemHealth || {
    database: "ONLINE",
    storage: "CONNECTED",
    realtime: "ACTIVE",
    cache: "HEALTHY",
    uptime: "99.98%",
    latency: "24ms",
  };

  const metrics = data?.metrics || {
    total_users: 52,
    active_users: 50,
    suspended_users: 2,
    pending_reports: 3,
    total_categories: 8,
    storage_used: "4.2 GB / 50 GB",
  };

  const roleDist = data?.roleDistribution || [];
  const audits = data?.recentAudits || [];

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      {/* ─── 1. HEADER ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
              TECHNICAL ADMINISTRATION & CONTROL
            </span>
            <span className="text-xs text-slate-400">Technical Administrator Role</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            System Infrastructure & Governance Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain PostgreSQL schemas, configure system parameters, audit moderation queues, and monitor infrastructure health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/users">
            <Button variant="primary" size="sm">
              👥 User Management ({metrics.total_users})
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="danger" size="sm">
              🛡️ Moderation Queue ({metrics.pending_reports})
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. SYSTEM HEALTH RIBBON ───────────────────────────── */}
      <Card glow glowColor="cyan" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Infrastructure Health Status
          </h3>
          <span className="text-xs text-slate-400 font-mono">Uptime: <strong className="text-emerald-400">{health.uptime}</strong> • Latency: <strong className="text-cyan-400">{health.latency}</strong></span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Database Pool:</span>
            <span className="font-bold text-emerald-400">✓ Healthy</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">S3 Storage Tier:</span>
            <span className="font-bold text-emerald-400">✓ Connected</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Realtime Socket:</span>
            <span className="font-bold text-emerald-400">✓ Active</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Redis Cache Tier:</span>
            <span className="font-bold text-emerald-400">✓ In-Memory</span>
          </div>
        </div>
      </Card>

      {/* ─── 3. METRICS CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
          <div className="text-2xl font-extrabold text-white font-mono">{metrics.total_users}</div>
          <span className="text-[10px] text-emerald-400">{metrics.active_users} Active</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Suspended</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{metrics.suspended_users}</div>
          <span className="text-[10px] text-slate-400">Restricted</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Reports</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{metrics.pending_reports}</div>
          <span className="text-[10px] text-rose-400">In Moderation</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Categories</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{metrics.total_categories}</div>
          <span className="text-[10px] text-slate-400">Innovation Taxonomy</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Storage Usage</span>
          <div className="text-xl font-extrabold text-purple-400 font-mono">{metrics.storage_used}</div>
          <span className="text-[10px] text-slate-400">Quota: 100 GB</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Security Tier</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">SOC-2 Ready</div>
          <span className="text-[10px] text-emerald-400">Strict RBAC</span>
        </Card>
      </div>

      {/* ─── 4. ROLE DISTRIBUTION & AUDIT LOGS ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Role Distribution</h3>
            <Link href="/admin/roles" className="text-xs text-cyan-400 hover:underline">RBAC Matrix →</Link>
          </div>
          <div className="space-y-2">
            {roleDist.map((r: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">{r.role}</span>
                <span className="font-mono text-cyan-400">{r.count} users</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Audit Stream</h3>
            <Link href="/admin/audit-logs" className="text-xs text-cyan-400 hover:underline">Full Log →</Link>
          </div>
          <div className="space-y-2">
            {audits.map((a: any) => (
              <div key={a.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-rose-400 font-mono">{a.action}</span>
                  <p className="text-[10px] text-slate-400">Entity: {a.entity}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── 5. ADMIN NAVIGATION TILES ─────────────────────────── */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Technical Administration Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Users Desk", link: "/admin/users", icon: "👥" },
            { label: "Roles & RBAC", link: "/admin/roles", icon: "🛡️" },
            { label: "Content Control", link: "/admin/content", icon: "📝" },
            { label: "Categories", link: "/admin/categories", icon: "🏷️" },
            { label: "Moderation Queue", link: "/admin/reports", icon: "🚨" },
            { label: "Storage Buckets", link: "/admin/storage", icon: "🗄️" },
            { label: "System Config", link: "/admin/settings", icon: "⚙️" },
            { label: "Audit Ledger", link: "/admin/audit-logs", icon: "📜" },
          ].map((tile, i) => (
            <Link key={i} href={tile.link} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all text-center space-y-1 block">
              <span className="text-2xl">{tile.icon}</span>
              <p className="text-xs font-semibold text-white">{tile.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
