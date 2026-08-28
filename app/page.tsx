"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Card3D } from "@/components/ui/Card3D";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { SOLUTIONS, STATS } from "@/data";

interface PublicIdea {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: string;
  category: string;
  submitter_name: string;
  cgo_priority: string;
  view_count: number;
}

interface PublicProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  category: string;
  progress: number;
  repo_url: string;
  live_url: string;
  client?: string;
  tech_stack?: string[];
}

export default function HomePage() {
  const [ideas, setIdeas] = useState<PublicIdea[]>([]);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ideasRes, projectsRes] = await Promise.all([
          fetch("/api/public/ideas").then((r) => r.json()),
          fetch("/api/public/projects").then((r) => r.json()),
        ]);

        if (ideasRes.success && ideasRes.data?.ideas) {
          setIdeas(ideasRes.data.ideas.slice(0, 3));
        }
        if (projectsRes.success && projectsRes.data?.projects) {
          setProjects(projectsRes.data.projects.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load homepage live data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Ambient Glows */}
      <GlowOrb color="#00d4ff" size={550} top="-100px" left="-150px" opacity={0.12} />
      <GlowOrb color="#7c3aed" size={600} top="40%" right="-200px" opacity={0.1} />
      <GlowOrb color="#10b981" size={500} bottom="10%" left="-100px" opacity={0.08} />

      {/* ─── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          The Innovation & Enterprise AI Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Transforming Breakthrough <span className="gradient-text">Community Ideas</span> Into Enterprise AI Solutions
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
          Xynvora AI connects curious minds, elite engineering squads, and C-suite leadership to intake real-world problems, validate feasibility, and deploy mission-critical intelligent systems.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/ideas">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Submit an Idea / Problem
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Live Solutions
            </Button>
          </Link>
          <Link href="/partners">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-slate-300">
              Partner With Us →
            </Button>
          </Link>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. LIFECYCLE INNOVATION PIPELINE ───────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <SectionTitle
          badge="End-to-End Pipeline"
          title="How Xynvora AI Solves Real Problems"
          subtitle="From visitor curiosity to enterprise-grade AI production deployment with full executive governance."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              step: "01",
              title: "Community & Idea Intake",
              desc: "Anyone in the community can submit unsolved real-world challenges or opportunities across healthcare, logistics, and commerce.",
              icon: "💡",
              color: "text-cyan-400",
              border: "hover:border-cyan-500/50",
            },
            {
              step: "02",
              title: "CGO Validation & Routing",
              desc: "Our Chief Growth Officer (CGO) reviews intake, categorizes market urgency, matches contributors, and routes to executive leadership.",
              icon: "🎯",
              color: "text-teal-400",
              border: "hover:border-teal-500/50",
            },
            {
              step: "03",
              title: "CEO & CFO Governance",
              desc: "CFO models ROI feasibility and allocates budget; CEO provides strategic signoff to commission development teams.",
              icon: "⚖️",
              color: "text-purple-400",
              border: "hover:border-purple-500/50",
            },
            {
              step: "04",
              title: "Squad Engineering & Launch",
              desc: "Specialized developer squads build, test, and deploy production AI solutions into enterprise partner workflows.",
              icon: "🚀",
              color: "text-emerald-400",
              border: "hover:border-emerald-500/50",
            },
          ].map((item, idx) => (
            <Card key={idx} className={`p-6 transition-all duration-300 ${item.border}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 ${item.color}`}>
                  PHASE {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 3. FEATURED IDEAS (LIVE DATA) ─────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-3">
              Community Submissions
            </div>
            <h2 className="text-3xl font-extrabold text-white">Active Innovation Intake</h2>
          </div>
          <Link href="/ideas">
            <Button variant="outline" size="sm">
              View All Ideas →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} glow glowColor="cyan" className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      {idea.category}
                    </span>
                    <StatusBadge status={idea.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    <Link href={`/ideas/${idea.slug || idea.id}`} className="hover:text-cyan-300 transition-colors">
                      {idea.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {idea.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span>By {idea.submitter_name}</span>
                  <Link href={`/ideas/${idea.slug || idea.id}`} className="text-cyan-400 font-semibold hover:underline">
                    Inspect Lifecycle →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─── 4. FEATURED PROJECTS (LIVE DATA) ──────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
              Production Solutions
            </div>
            <h2 className="text-3xl font-extrabold text-white">Deployed Enterprise Systems</h2>
          </div>
          <Link href="/projects">
            <Button variant="outline" size="sm">
              Explore All Projects →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Card key={proj.id} glow glowColor="emerald" className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <StatusBadge status={proj.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    <Link href={`/projects/${proj.slug || proj.id}`} className="hover:text-emerald-300 transition-colors">
                      {proj.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {proj.description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>Development Completion</span>
                      <span className="text-emerald-400 font-semibold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  {proj.client && <span className="text-slate-500">Client: {proj.client}</span>}
                  <Link href={`/projects/${proj.slug || proj.id}`} className="text-emerald-400 font-semibold hover:underline ml-auto">
                    View Case Study →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. CORE TECHNOLOGY & ARCHITECTURE ─────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <SectionTitle
          badge="Technology Stack"
          title="Architected for Uncompromising Scale"
          subtitle="Built on state-of-the-art agentic foundation models, low-latency streaming infrastructure, and resilient data layers."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {[
            { label: "Agentic AI", desc: "LangChain & Custom Planners", icon: "🧠" },
            { label: "Multi-Modal", desc: "Vision, Voice & OCR", icon: "👁️" },
            { label: "PostgreSQL", desc: "ACID Relational Storage", icon: "🐘" },
            { label: "Realtime", desc: "Sub-50ms WebSockets", icon: "⚡" },
            { label: "Cloud Scale", desc: "AWS, GCP & Supabase", icon: "☁️" },
            { label: "Enterprise Security", desc: "RBAC & HIPAA Compliance", icon: "🛡️" },
          ].map((tech, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{tech.icon}</div>
              <h4 className="text-sm font-bold text-white mb-1">{tech.label}</h4>
              <p className="text-[11px] text-slate-400">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. PARTNER & COMMUNITY CTA ───────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Ready to Build the Future of AI With Us?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you are an enterprise seeking bespoke AI automation, an innovator with a game-changing problem to solve, or an engineer wanting to contribute — Xynvora AI is your launchpad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Join Innovation Community
              </Button>
            </Link>
            <Link href="/partners">
              <Button variant="outline" size="lg">
                Explore Enterprise Partnership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
