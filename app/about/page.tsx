"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SectionTitle } from "@/components/ui/SectionTitle";

const LEADERS = [
  {
    name: "Muhammad Zaryab Hassan",
    role: "Chief Executive Officer",
    image: "/images/ceo xynvoraai.jpeg",
    bio: "Visionary executive leading the global development of autonomous enterprise AI systems, high-assurance architecture, and enterprise digital strategy.",
    responsibilities: ["Corporate Vision", "Strategic Direction", "Capital Allocation"],
    linkedin: "https://linkedin.com",
    tag: "CEO",
  },
  {
    name: "Muhammad Ismail",
    role: "Chief Financial Officer",
    image: "/images/cfo.jpg",
    bio: "Financial architect directing capital discipline, ROI feasibility modeling, and financial risk mitigation across the entire innovation portfolio.",
    responsibilities: ["Financial Feasibility", "Budget Allocation", "Enterprise Risk"],
    linkedin: "https://linkedin.com",
    tag: "CFO",
  },
  {
    name: "Mahad Aziz",
    role: "Chief Growth Officer",
    image: "/images/cgo.jpg",
    bio: "Growth executive heading community innovation intake, problem validation, contributor ecosystems, and strategic enterprise partnerships.",
    responsibilities: ["Idea Intake & Triage", "Community Growth", "Partnership Strategy"],
    linkedin: "https://linkedin.com",
    tag: "CGO",
  },
];

const VALUES = [
  {
    title: "Relentless Innovation",
    desc: "We don't settle for incremental tweaks. We architect transformative autonomous systems that fundamentally alter how businesses operate.",
    icon: "⚡",
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Community-Led Breakthroughs",
    desc: "The most vital solutions emerge from real practitioners. We empower community members to bring real-world problems directly into production.",
    icon: "🤝",
    color: "from-teal-500/20 to-emerald-500/20",
  },
  {
    title: "Executive Governance & Integrity",
    desc: "Every initiative undergoes stringent technical validation by CGO, financial modeling by CFO, and strategic signoff by CEO.",
    icon: "🛡️",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Engineering Excellence",
    desc: "Zero compromise on reliability. We build low-latency, scalable, and secure systems tested against rigorous enterprise benchmarks.",
    icon: "🔬",
    color: "from-amber-500/20 to-orange-500/20",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />
      <GlowOrb color="#7c3aed" size={500} top="50%" left="-150px" opacity={0.08} />

      {/* ─── 1. HERO & STORY ───────────────────────────────────── */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
          The Xynvora AI Story
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Architecting The Future of <span className="gradient-text">Autonomous Intelligence</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          Founded on the principle that transformative AI must solve tangible, high-impact problems, Xynvora AI represents a new paradigm in software engineering: an open innovation ecosystem governed by disciplined corporate leadership.
        </p>
      </section>

      {/* ─── 2. MISSION & VISION ───────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card glow glowColor="cyan" className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
            🎯
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            To bridge the gap between grassroots community innovation and enterprise execution by providing the governance, capital, and engineering muscle required to transform raw ideas into reliable, production-ready AI products.
          </p>
        </Card>

        <Card glow glowColor="purple" className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl">
            🔭
          </div>
          <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            A globally connected intelligence grid where any organization, practitioner, or developer can collaborate seamlessly to deploy autonomous AI agents that eliminate friction, maximize human potential, and accelerate human progress.
          </p>
        </Card>
      </section>

      {/* ─── 3. CORE VALUES ────────────────────────────────────── */}
      <section className="space-y-12">
        <SectionTitle
          badge="Guiding Principles"
          title="What Drives Every Decision"
          subtitle="Our core values ensure we remain agile, ethical, and relentlessly focused on delivering compounding value."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val, i) => (
            <Card key={i} className="p-6 space-y-3 hover:border-slate-700 transition-all">
              <div className="text-3xl">{val.icon}</div>
              <h3 className="text-lg font-bold text-white">{val.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{val.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 4. EXECUTIVE LEADERSHIP ───────────────────────────── */}
      <section id="leadership" className="space-y-12 pt-8 border-t border-slate-800/60">
        <SectionTitle
          badge="Executive Team"
          title="Leadership & Governance"
          subtitle="Experienced technology executives providing strategic, financial, and growth leadership."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LEADERS.map((leader, i) => (
            <Card key={i} glow glowColor="cyan" className="p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Photo */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg bg-slate-950">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-[10px] font-extrabold tracking-wider">
                    {leader.tag}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{leader.role}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{leader.bio}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Key Focus Areas:</p>
                <div className="flex flex-wrap gap-1.5">
                  {leader.responsibilities.map((resp, rIdx) => (
                    <span key={rIdx} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-medium text-slate-300">
                      {resp}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 5. JOIN US CTA ────────────────────────────────────── */}
      <section className="text-center py-12 border-t border-slate-800/60 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Join Our Mission</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          We are constantly looking for talented AI researchers, full-stack engineers, and forward-thinking industry partners.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/careers">
            <Button variant="primary" size="md">
              View Open Roles
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="md">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
