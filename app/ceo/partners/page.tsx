"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function CeoPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/ceo/partners");
      const json = await res.json();
      if (json.success && json.data?.applications) {
        setPartners(json.data.applications);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#3b82f6" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/ceo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CEO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Strategic Enterprise Partnerships</h1>
        <p className="text-xs text-slate-400 mt-1">Review CGO-recommended enterprise pilot applications and co-development contracts.</p>
      </div>

      <div className="space-y-4">
        {partners.map((p: any) => (
          <Card key={p.id} glow glowColor="cyan" className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{p.partnership_type}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{p.company_name}</h3>
                <p className="text-xs text-slate-400">Applicant: {p.applicant_name} ({p.email})</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                {p.status?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              {p.proposal_summary}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

