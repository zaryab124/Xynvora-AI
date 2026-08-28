"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

const INDUSTRY_DETAILS: Record<
  string,
  { name: string; icon: string; headline: string; overview: string; capabilities: string[]; stack: string[]; roi: string }
> = {
  healthcare: {
    name: "Healthcare & Clinical AI",
    icon: "🏥",
    headline: "Autonomous Clinical Triage & EHR Transcription",
    overview: "Built to combat clinician burnout and reduce emergency room delays, our healthcare intelligence suite automates pre-consultation patient intake, bilingual symptom triage, and real-time medical note synthesis.",
    capabilities: [
      "Conversational HIPAA-Compliant Symptom Scoring",
      "Epic & Cerner EHR Direct Bi-Directional Sync",
      "Multilingual Voice Transcription (Urdu, Arabic, English)",
      "Automated Insurance Pre-Authorization Triage"
    ],
    stack: ["FastAPI", "GPT-4o Medical Fine-Tuned", "PostgreSQL", "FHIR / HL7 Standards", "Docker"],
    roi: "4x faster patient intake velocity, 75% reduction in clinician documentation hours, 90% patient satisfaction."
  },
  logistics: {
    name: "Logistics & Supply Chain Intelligence",
    icon: "🚚",
    headline: "Predictive Demand Forecasting & Dynamic Freight Optimization",
    overview: "Transform static ERP replenishment into self-adapting inventory intelligence. Anticipate micro-regional demand spikes, avoid dead inventory, and automate freight carrier dispatch.",
    capabilities: [
      "Multi-Modal Regional Demand Prediction Engine",
      "Automated PO Generation & Supplier Negotiations",
      "Dynamic Fleet Dispatch & Real-Time Route Rerouting",
      "Cold-Chain IoT Sensor Telemetry & Anomaly Alerts"
    ],
    stack: ["Python", "TensorFlow", "PostgreSQL", "Kafka Streaming", "AWS Cloud"],
    roi: "35% decrease in obsolete inventory holding costs, 28% reduction in deadhead freight miles."
  },
  ecommerce: {
    name: "E-Commerce & Conversational Commerce",
    icon: "🛒",
    headline: "WhatsApp Automated Checkout & Predictive Merchandising",
    overview: "Turn messaging apps into your highest-converting revenue channel. Deploy autonomous sales bots that guide buyers from initial discovery to digital payment and tracking inside WhatsApp.",
    capabilities: [
      "Complete WhatsApp Cart & Checkout Orchestration",
      "Real-Time Inventory Sync & Payment Gateway Linking",
      "Automated Abandoned Cart Voice & Message Recovery",
      "Predictive Personalized Cross-Sell Recommendations"
    ],
    stack: ["Node.js", "WhatsApp Cloud API", "LangChain", "Redis", "Stripe / Local Pay"],
    roi: "3.2x higher conversion compared to traditional web carts, 70% decrease in manual customer support."
  },
  "real-estate": {
    name: "Real Estate & Construction Intelligence",
    icon: "🏢",
    headline: "Computer Vision Title Verification & Virtual Escrow",
    overview: "Accelerate property closings from months to days. Automate zoning document verification, mortgage rate matching, and escrow coordination through intelligent agents.",
    capabilities: [
      "Computer Vision Blueprint & Title Deed Extraction",
      "Dynamic Yield & Cap Rate ROI Calculators",
      "Automated Buyer-Seller Matchmaking Engine",
      "Digital Escrow Lifecycle Coordination"
    ],
    stack: ["Next.js", "PyTorch OCR", "PostgreSQL", "Google Cloud Platform"],
    roi: "60% reduction in escrow closing friction, 3x increase in qualified buyer conversions."
  },
  restaurants: {
    name: "Restaurant & Hospitality Automation",
    icon: "🍽️",
    headline: "Omni-Branch WhatsApp Ordering & Smart Kitchen Dispatch",
    overview: "Eliminate food delivery marketplace commission fees. Empower restaurant chains to take direct digital orders, manage reservations, and dispatch riders automatically.",
    capabilities: [
      "Dynamic Digital Menu with AI Upselling",
      "Kitchen Display System (KDS) Real-Time Routing",
      "Automated Third-Party Rider Dispatch",
      "Customer Loyalty & Re-Engagement Automation"
    ],
    stack: ["Node.js", "Express", "WhatsApp API", "Socket.IO", "PostgreSQL"],
    roi: "Over 500+ daily orders automated per branch with zero human lag and 0% aggregator commissions."
  },
  education: {
    name: "Education & Campus Intelligence",
    icon: "🎓",
    headline: "Personalized AI Tutoring & Administrative Concierge",
    overview: "Scale personalized education to thousands of students simultaneously. Deliver 24/7 subject tutoring, automated feedback, and administrative concierge assistance.",
    capabilities: [
      "Curriculum-Aligned Adaptive AI Tutoring",
      "Automated Code & Essay Rubric Grading",
      "24/7 Campus Admissions & Financial Aid Concierge",
      "Student Academic Attrition Early-Warning Alerts"
    ],
    stack: ["Next.js", "Python", "FastAPI", "Vector DB", "PostgreSQL"],
    roi: "85% boost in student course retention, instant answers to 10,000+ campus inquiries."
  }
};

export default function IndustryCategoryPage() {
  const params = useParams();
  const categoryKey = (params?.category as string) || "healthcare";
  const ind = INDUSTRY_DETAILS[categoryKey] || INDUSTRY_DETAILS["healthcare"];

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Breadcrumb */}
      <Link href="/business" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Industry Solutions
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{ind.icon}</span>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
            {ind.name}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {ind.headline}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {ind.overview}
        </p>
      </div>

      {/* ROI & Metrics */}
      <Card glow glowColor="purple" className="p-6 space-y-2 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900">
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">Target Enterprise ROI</h3>
        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">{ind.roi}</p>
      </Card>

      {/* Capabilities & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Core Capabilities</h3>
          <ul className="space-y-3">
            {ind.capabilities.map((cap, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Architectural Stack</h3>
          <div className="flex flex-wrap gap-2">
            {ind.stack.map((st, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300">
                {st}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="pt-6 text-center space-y-4 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white">Deploy This Solution For Your Enterprise</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Contact our enterprise engineering team to initiate architecture scoping and rapid prototyping.
        </p>
        <Link href="/contact">
          <Button variant="primary" size="lg">
            Request Architecture Discovery
          </Button>
        </Link>
      </div>
    </div>
  );
}
