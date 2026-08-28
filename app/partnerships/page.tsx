"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

const PARTNERSHIP_TRACKS = [
  {
    title: "Enterprise Solutions & Pilots",
    type: "enterprise_client",
    icon: "🏢",
    description: "Deploy customized autonomous AI agents directly into your hospital EHR, logistics fleet, or customer support infrastructure.",
    benefits: ["Custom Agent Fine-Tuning", "SLA-Backed Production Deployments", "Dedicated AI Architect Support", "HIPAA & SOC-2 Compliance"],
  },
  {
    title: "Technology & Infrastructure Co-Dev",
    type: "technology",
    icon: "⚡",
    description: "Integrate vector databases, inference runtimes, hardware accelerators, and cloud compute nodes with Xynvora AI agent topologies.",
    benefits: ["Direct Kernel Optimization", "Joint Benchmarking & Case Studies", "High-Throughput API Gateways", "Ecosystem Co-Marketing"],
  },
  {
    title: "Academic & Scientific Research",
    type: "academic_research",
    icon: "🔬",
    description: "Collaborate on breakthrough open-source AI agent research, structural biology modeling, and algorithmic safety.",
    benefits: ["Compute Grant Allocation", "Joint Peer-Reviewed Publications", "Student Internship Pipelines", "Open-Source Repository Access"],
  },
  {
    title: "Growth & Ecosystem Affiliates",
    type: "growth_affiliate",
    icon: "🌐",
    description: "Scale regional innovation hubs, lead university AI chapters, and distribute Xynvora AI tools to developer communities worldwide.",
    benefits: ["Ecosystem Grant Incentives", "Ambassador Certification", "Event Sponsorship Support", "CGO Direct Mentorship"],
  },
];

export default function PartnershipsPage() {
  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <GlowOrb color="#00d4ff" size={600} top="-100px" right="-150px" opacity={0.15} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider uppercase">
          EXTERNAL BUSINESS ECOSYSTEM
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Partner with Xynvora AI
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Accelerate your enterprise transformation, co-develop next-generation AI infrastructure, and bring autonomous innovation to market.
        </p>
        <div className="pt-2">
          <Link href="/partnerships/apply">
            <Button variant="primary" size="lg" className="shadow-lg shadow-cyan-500/20">
              🤝 Apply for Partnership →
            </Button>
          </Link>
        </div>
      </div>

      {/* Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PARTNERSHIP_TRACKS.map((track, i) => (
          <Card key={i} glow glowColor="cyan" className="p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{track.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{track.title}</h3>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">Track 0{i + 1}</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{track.description}</p>
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase">Program Deliverables:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {track.benefits.map((b, j) => (
                    <li key={j} className="flex items-center gap-1.5">
                      <span className="text-cyan-400">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Link href={`/partnerships/apply?type=${track.type}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Apply for {track.title} →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
