"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useToast } from "@/components/ui/Toast";

export default function PartnersPage() {
  const { showToast } = useToast();
  const [applicantName, setApplicantName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [partnershipType, setPartnershipType] = useState("enterprise_client");
  const [proposalSummary, setProposalSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/public/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: applicantName,
          company_name: companyName,
          email,
          phone,
          website,
          partnership_type: partnershipType,
          proposal_summary: proposalSummary,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        showToast({
          title: "Application Received!",
          message: "Our Chief Growth Officer (CGO) team will review your proposal.",
          type: "success",
        });
      } else {
        showToast({ title: "Submission Error", message: data.error || "Please check inputs.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to submit. Please check network connection.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Strategic Ecosystem
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Partner With <span className="gradient-text">Xynvora AI</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
          We collaborate with forward-looking enterprises, academic institutions, technology providers, and growth affiliates to build and deploy high-impact AI systems.
        </p>
      </div>

      {/* Partnership Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Enterprise Client",
            desc: "Co-develop and deploy customized autonomous AI agent systems across your organizational workflows.",
            icon: "🏢",
            type: "enterprise_client",
          },
          {
            title: "Technology Partner",
            desc: "Integrate your cloud, LLM, or vector database infrastructure directly into our engineering pipeline.",
            icon: "⚡",
            type: "technology",
          },
          {
            title: "Academic & Research",
            desc: "Joint grants, student innovation sponsorship, and shared benchmarking on state-of-the-art agent models.",
            icon: "🎓",
            type: "academic_research",
          },
          {
            title: "Growth & Affiliate",
            desc: "Introduce enterprise clients and earn recurring technology integration referral compensation.",
            icon: "📈",
            type: "growth_affiliate",
          },
        ].map((track, i) => (
          <Card key={i} glow glowColor="cyan" className="p-6 space-y-3">
            <div className="text-3xl">{track.icon}</div>
            <h3 className="text-lg font-bold text-white">{track.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{track.desc}</p>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      <div className="max-w-2xl mx-auto">
        <Card glow glowColor="cyan" className="p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white">Application Successfully Submitted</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for applying to partner with Xynvora AI. Our CGO Mahad Aziz and executive partnership team will review your proposal within 2 business days.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Application
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white">Partnership Application Form</h3>
                <p className="text-xs text-slate-400 mt-1">Directly reviewed by the Chief Growth Officer (CGO) department.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name"
                  placeholder="e.g. John Doe"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                />
                <Input
                  label="Company / Institution"
                  placeholder="e.g. Acme Health Systems"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business Email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone / WhatsApp"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Website / Portfolio URL"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <Select
                  label="Partnership Track"
                  value={partnershipType}
                  onChange={(e) => setPartnershipType(e.target.value)}
                  options={[
                    { value: "enterprise_client", label: "Enterprise Client Solution" },
                    { value: "technology", label: "Technology / Cloud Provider" },
                    { value: "academic_research", label: "Academic / Research Partner" },
                    { value: "growth_affiliate", label: "Growth / Referral Affiliate" },
                  ]}
                />
              </div>

              <Textarea
                label="Proposal Summary & Collaboration Objectives"
                placeholder="Describe your organization's goals, problem space, and what you would like to build with Xynvora AI..."
                rows={4}
                value={proposalSummary}
                onChange={(e) => setProposalSummary(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
                Submit Partnership Proposal to CGO
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
