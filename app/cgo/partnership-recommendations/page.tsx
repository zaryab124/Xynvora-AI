"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function CgoPartnershipRecommendationsPage() {
  const { showToast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [recommending, setRecommending] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cgo/partnership-recommendations");
      const json = await res.json();
      if (json.success && json.data?.recommendations) {
        setPartners(json.data.recommendations);
      }
    }
    load();
  }, []);

  async function handleRecommend(id: string) {
    const notes = notesMap[id] || "Strategic alignment verified. Recommended for enterprise co-development.";
    try {
      setRecommending((prev) => ({ ...prev, [id]: true }));
      const res = await fetch(`/api/cgo/partnerships/${id}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cgo_notes: notes }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Endorsement Submitted", message: "Partnership recommended to CEO for strategic signoff.", type: "success" });
        setPartners((prev) => prev.map((p) => p.id === id ? { ...p, status: 'cgo_recommended' } : p));
      } else {
        showToast({ title: "Failed", message: data.error || "Error recommending", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error submitting recommendation", type: "error" });
    } finally {
      setRecommending((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/cgo/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to CGO Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">CGO Partnership Recommendation Desk</h1>
        <p className="text-xs text-slate-400 mt-1">Screen incoming enterprise and technology partnership applications before routing to CEO.</p>
      </div>

      <div className="space-y-6">
        {partners.map((p: any) => (
          <Card key={p.id} glow glowColor="cyan" className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{p.partnership_type || "ENTERPRISE"}</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{p.company_name || p.partner}</h3>
                <p className="text-xs text-slate-400">{p.applicant_name ? `Contact: ${p.applicant_name} (${p.email})` : p.contact}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                {p.status?.toUpperCase() || "SUBMITTED"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              {p.proposal_summary || p.strategic_alignment}
            </p>

            {p.status !== 'cgo_recommended' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <Textarea
                  label="CGO Strategic Viability Assessment"
                  rows={2}
                  value={notesMap[p.id] || ""}
                  onChange={(e) => setNotesMap({ ...notesMap, [p.id]: e.target.value })}
                  placeholder="Enter market fit rationale for CEO review..."
                />
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRecommend(p.id)}
                    isLoading={recommending[p.id]}
                  >
                    ✓ Endorse & Route to CEO Review →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
