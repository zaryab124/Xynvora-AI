"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CgoNotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success && json.data?.notifications) {
        setNotifs(json.data.notifications);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CGO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">CGO High-Priority Alert Stream</h1>
        <p className="text-xs text-slate-400 mt-1">Realtime notifications regarding incoming submissions, CEO reviews, and initiative milestones.</p>
      </div>

      <div className="space-y-3">
        {notifs.map((n: any) => (
          <Card key={n.id} glow={!n.is_read} glowColor="cyan" className="p-5 flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{n.title}</h4>
              <p className="text-xs text-slate-300">{n.message}</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{new Date(n.created_at).toLocaleDateString()}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
