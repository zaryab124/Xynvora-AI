"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        const json = await res.json();
        if (json.success && json.data?.users) {
          setUsers(json.data.users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = users.filter((u) =>
    (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.role && u.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Platform User Administration</h1>
          <p className="text-xs text-slate-400 mt-1">Audit active accounts, role assignments, reputation metrics, and security status.</p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <Card key={u.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{u.full_name || "Unnamed User"}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                    {u.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
                <p className="text-slate-400">{u.email} • Rep: <strong className="text-cyan-400 font-mono">{u.reputation_score || 0}</strong></p>
              </div>

              <Link href={`/admin/users/${u.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Manage Account →
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
