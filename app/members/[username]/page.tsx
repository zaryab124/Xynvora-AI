"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function MemberProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchMember() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/members/${username}`);
        const json = await res.json();
        if (json.success && json.data?.member) {
          setMember(json.data.member);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (username) fetchMember();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 space-y-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="Member Not Found" message="Could not locate the requested community profile." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <Link href="/members" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Members Directory
      </Link>

      {/* Profile Header */}
      <Card glow glowColor="cyan" className="p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-cyan-400">
              {member.full_name.charAt(0)}
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{member.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                {member.role}
              </span>
            </div>
            <p className="text-sm text-cyan-300 font-medium">{member.position || member.role} at {member.company || "Xynvora AI"}</p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">{member.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500">Reputation Score</span>
            <p className="text-base font-extrabold text-cyan-400 font-mono">{member.reputation_score || 250}</p>
          </div>
          <div>
            <span className="text-slate-500">Member Since</span>
            <p className="text-base font-semibold text-white">{new Date(member.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-slate-500">Contributions</span>
            <p className="text-base font-semibold text-white">Active</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
