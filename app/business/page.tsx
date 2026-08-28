"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SectionTitle } from "@/components/ui/SectionTitle";

const INDUSTRIES = [
  {
    slug: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: "🏥",
    color: "emerald",
    desc: "Autonomous clinical triage, EHR auto-transcription, patient intake bots, and medical diagnosis support.",
    metrics: "4x faster triage intake, 90% patient satisfaction",
    capabilities: ["HIPAA-Compliant Agentic Triage", "EHR Interoperability", "Real-time Medical Translation"],
  },
  {
    slug: "logistics",
    name: "Logistics & Supply Chain",
    icon: "🚚",
    color: "cyan",
    desc: "Dynamic freight allocation, multi-modal inventory demand forecasting, and predictive warehouse dispatch.",
    metrics: "35% reduction in dead stock, 28% lower freight transit costs",
    capabilities: ["Predictive Stock Replenishment", "Dynamic Freight Dispatch", "Automated Supplier POs"],
  },
  {
    slug: "ecommerce",
    name: "E-Commerce & Retail",
    icon: "🛒",
    color: "purple",
    desc: "Conversational WhatsApp checkout, personalized recommendation intelligence, and automated cart recovery.",
    metrics: "3.2x higher conversion rate, 70% lower support overhead",
    capabilities: ["WhatsApp Commerce Automation", "Personalized Recommendation", "24/7 AI Sales Agent"],
  },
  {
    slug: "real-estate",
    name: "Real Estate & Construction",
    icon: "🏢",
    color: "amber",
    desc: "Automated property matching, computer vision blueprint extraction, and digital escrow closing workflows.",
    metrics: "60% faster closing times, 3x higher lead conversion",
    capabilities: ["Zoning Document Intelligence", "Virtual Escrow Orchestration", "AI Property Matchmaker"],
  },
  {
    slug: "restaurants",
    name: "Restaurants & Hospitality",
    icon: "🍽️",
    color: "red",
    desc: "Multi-branch WhatsApp ordering, intelligent reservation bots, dynamic pricing, and inventory depletion alerts.",
    metrics: "500+ daily orders automated with zero human delay",
    capabilities: ["WhatsApp Menu Ordering", "Dynamic Kitchen Queueing", "Customer Loyalty Intelligence"],
  },
  {
    slug: "education",
    name: "Higher Education & EdTech",
    icon: "🎓",
    color: "blue",
    desc: "Adaptive student tutoring bots, automated assignment grading, and 24/7 campus administrative concierge.",
    metrics: "85% student retention boost, instant 24/7 query answers",
    capabilities: ["Personalized AI Tutor", "Campus Concierge Bot", "Automated Academic Triage"],
  },
];

export default function BusinessPage() {
  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <GlowOrb color="#7c3aed" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          Enterprise AI Practice
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Industry-Specific <span className="gradient-text">Enterprise Intelligence</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          We engineer domain-specialized AI agent architectures tailor-made to eliminate industry bottlenecks, reduce operating costs, and compound enterprise revenue.
        </p>
      </div>

      {/* Industry Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INDUSTRIES.map((ind) => (
          <Card key={ind.slug} glow glowColor="purple" className="p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{ind.icon}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                  ENTERPRISE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                <Link href={`/business/${ind.slug}`}>{ind.name}</Link>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">Proven ROI Metric:</span>
                <p className="text-xs text-slate-200 font-medium">{ind.metrics}</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Core Capabilities:</p>
                {ind.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 text-xs">✓</span>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <Link href={`/business/${ind.slug}`} className="text-xs font-bold text-cyan-400 hover:underline">
                Explore Architecture →
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Inquire
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Enterprise Consultation CTA */}
      <section className="rounded-3xl bg-slate-900/60 border border-slate-800 p-10 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Need a Bespoke AI Architecture?</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Schedule an executive discovery session with our CEO Zain ul Abideen and AI architects to map out high-ROI automation for your organization.
        </p>
        <Link href="/contact">
          <Button variant="primary" size="lg">
            Schedule Executive Discovery Call
          </Button>
        </Link>
      </section>
    </div>
  );
}
