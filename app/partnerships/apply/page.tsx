"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams?.get("type") || "enterprise_client";
  const { showToast } = useToast();

  const [applicantName, setApplicantName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [partnershipType, setPartnershipType] = useState(defaultType);
  const [proposal, setProposal] = useState("");
  const [impact, setImpact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!applicantName || !companyName || !email || !proposal) {
      showToast({ title: "Validation Error", message: "Please fill in all mandatory fields.", type: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/partnerships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: applicantName,
          company_name: companyName,
          email,
          phone,
          website,
          partnership_type: partnershipType,
          proposal_summary: proposal,
          estimated_impact: impact,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({
          title: "Application Received!",
          message: "Your partnership proposal has been submitted to the CGO and Executive Leadership team.",
          type: "success",
        });
        router.push("/partnerships");
      } else {
        showToast({ title: "Error", message: data.error || "Failed to submit application", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error submitting application.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card glow glowColor="cyan" className="p-8 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
          PARTNERSHIP APPLICATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Submit Enterprise & Tech Partnership Proposal</h1>
        <p className="text-xs text-slate-400 mt-1">Our Chief Growth Officer, CEO, and CFO will conduct market validation, strategic review, and commercial modeling.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Applicant Full Name *"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="e.g. Dr. Ayesha Siddiqui"
            required
          />
          <Input
            label="Company / Institution Name *"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Apex Global Health Network"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Business Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Company Website / GitHub"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />
          <Select
            label="Partnership Track *"
            value={partnershipType}
            onChange={(e) => setPartnershipType(e.target.value)}
            options={[
              { value: "enterprise_client", label: "Enterprise Solutions & Pilots" },
              { value: "technology", label: "Technology & Infrastructure Co-Dev" },
              { value: "academic_research", label: "Academic & Scientific Research" },
              { value: "growth_affiliate", label: "Growth & Ecosystem Affiliates" },
            ]}
          />
        </div>

        <Textarea
          label="Proposal Summary & Collaboration Scope *"
          rows={4}
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          placeholder="Describe your use case, technical requirements, pilot objectives, and timeline..."
          required
        />

        <Input
          label="Projected Impact, Volume or Budget Scale"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="e.g. 50,000 patient records / month, $150k annual software budget"
        />

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={() => router.push("/partnerships")}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            🚀 Submit Partnership Application →
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function PartnershipApplyPage() {
  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <Link href="/partnerships" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Partnerships Hub
      </Link>

      <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading application desk...</div>}>
        <ApplyForm />
      </Suspense>
    </div>
  );
}
