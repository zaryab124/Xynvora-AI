"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CgoCommunityPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/cgo/community/members");
        const json = await res.json();
        if (json.success && json.data?.members) {
          setMembers(json.data.members);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to CGO Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Community & Member Roster</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global innovator network, track engagement, and oversee contributor recognition.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          members.map((m: any) => (
            <Card key={m.id} glow glowColor="cyan" className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center font-bold">
                  {m.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{m.full_name}</h4>
                  <p className="text-[10px] text-cyan-400 font-mono">{m.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{m.company || "Independent Innovator"}</p>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
                <span>Reputation: <strong className="text-cyan-400 font-mono">{m.reputation_score || 100}</strong></span>
                <span>{m.email}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
