"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");
        const json = await res.json();
        if (json.success && json.data?.profile) {
          setProfile(json.data.profile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const p = profile || {
    full_name: "Community Member",
    role: "COMMUNITY_MEMBER",
    bio: "Passionate AI practitioner exploring agentic workflow architectures and enterprise automation.",
    skills: ["AI Agents", "Python", "Next.js"],
    reputation_score: 120,
    company: "Autonomous AI Lab",
  };

  const metadata = typeof p.metadata === "string" ? JSON.parse(p.metadata || "{}") : p.metadata || {};
  const skills = metadata.skills || ["AI Agents", "Python", "Full Stack"];
  const interests = metadata.interests || ["Healthcare AI", "Autonomous Agents", "Supply Chain"];

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Member Dashboard
        </Link>
        <Link href="/profile/edit">
          <Button variant="primary" size="sm">
            ✏️ Edit Profile
          </Button>
        </Link>
      </div>

      {/* Header Card */}
      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-cyan-400">
              {p.full_name?.charAt(0) || "U"}
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{p.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                {p.role}
              </span>
            </div>
            <p className="text-sm text-cyan-300 font-medium">
              {p.position || p.role} {p.company ? `at ${p.company}` : ""}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              {p.bio || "No biography provided yet. Add your experience in profile settings."}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500">Reputation Score</span>
            <p className="text-lg font-extrabold text-cyan-400 font-mono">{p.reputation_score || 100}</p>
          </div>
          <div>
            <span className="text-slate-500">Email Address</span>
            <p className="text-xs font-semibold text-white truncate">{p.email || "Confidential"}</p>
          </div>
          <div>
            <span className="text-slate-500">Location</span>
            <p className="text-xs font-semibold text-white">Global Innovator</p>
          </div>
          <div>
            <span className="text-slate-500">Status</span>
            <p className="text-xs font-semibold text-emerald-400">Active Member</p>
          </div>
        </div>
      </Card>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skills & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-cyan-300">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Innovation Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-medium text-purple-300">
                {interest}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
