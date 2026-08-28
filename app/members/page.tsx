"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface Member {
  id: string;
  username?: string;
  full_name: string;
  role: string;
  position?: string;
  company?: string;
  bio?: string;
  reputation_score?: number;
  avatar_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
}

const ROLE_TABS = [
  { id: "All", label: "All Members" },
  { id: "CEO", label: "Leadership" },
  { id: "DEVELOPER", label: "Developers" },
  { id: "COMMUNITY_MEMBER", label: "Innovators" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const url = activeRole === "All" ? "/api/public/members" : `/api/public/members?role=${activeRole}`;
        const res = await fetch(url);
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
    fetchMembers();
  }, [activeRole]);

  const filtered = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (m.position && m.position.toLowerCase().includes(search.toLowerCase())) ||
      (m.bio && m.bio.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Innovator Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Community Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            Meet the engineers, researchers, C-suite executives, and innovators building solutions across the Xynvora AI ecosystem.
          </p>
        </div>

        <Link href="/register">
          <Button variant="primary">
            Join the Network
          </Button>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <Tabs tabs={ROLE_TABS} activeTab={activeRole} onChange={setActiveRole} />
        <div className="w-full md:w-72">
          <Input
            placeholder="Search innovators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span className="text-sm">🔍</span>}
          />
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Members Found"
          description="No community innovators matched your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => {
            const username = member.username || member.full_name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Card key={member.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base font-bold text-cyan-400">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                        <Link href={`/members/${username}`}>{member.full_name}</Link>
                      </h3>
                      <p className="text-xs text-cyan-400 font-semibold">{member.position || member.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {member.bio || "Active contributor and innovator participating in Xynvora AI initiatives."}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Reputation: <strong className="text-cyan-400 font-mono">{member.reputation_score || 100}</strong></span>
                  <Link href={`/members/${username}`} className="text-cyan-400 font-semibold hover:underline">
                    View Portfolio →
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
