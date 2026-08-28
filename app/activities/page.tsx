"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PublicActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/activities");
        const json = await res.json();
        if (json.success && json.data?.activities) {
          setActivities(json.data.activities);
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
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={600} top="-100px" right="-150px" opacity={0.12} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider uppercase">
            COMMUNITY & COMPANY INITIATIVES
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Xynvora AI Activities & Sprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            Join public AI agent hackathons, community town halls, technical workshops, and global innovation sprints.
          </p>
        </div>

        <Link href="/community">
          <Button variant="primary" size="sm">
            🚀 Join Community Hub →
          </Button>
        </Link>
      </div>

      {/* Activities Feed */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((act) => (
            <Card key={act.id} glow glowColor="cyan" className="p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {act.type === 'hackathon' ? '⚡' : act.type === 'town_hall' ? '🏛️' : '🔬'}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{act.title}</h3>
                    <span className="text-xs text-slate-400">Host: <strong className="text-cyan-400">{act.host}</strong></span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
                  {act.status}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{act.description}</p>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>📅 {new Date(act.date).toLocaleDateString()}</span>
                  <span>📍 {act.location}</span>
                  <span>👥 {act.attendees_count} Registered</span>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Register for Activity →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
