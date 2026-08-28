"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useToast } from "@/components/ui/Toast";

const OFFICE_INFO = [
  { icon: "📍", label: "Headquarters", value: "Lahore, Punjab, Pakistan" },
  { icon: "📞", label: "Enterprise Inquiries", value: "+92 300 1234567" },
  { icon: "✉️", label: "Direct Email", value: "hello@xynvora.ai" },
];

export default function ContactSection() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", service: "AI Agent Development", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        showToast({
          title: "Message Sent!",
          message: "Our enterprise AI team will contact you within 24 hours.",
          type: "success",
        });
      } else {
        showToast({ title: "Submission Failed", message: data.error || "Please check your inputs.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to send message. Please check connection.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <SectionTitle
        badge="Direct Enterprise Channel"
        title="Contact Xynvora AI"
        subtitle="Speak directly with our solutions architects to map out custom AI systems, integrations, or partnerships."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Office info */}
        <div className="space-y-6">
          <Card glow glowColor="cyan" className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Global Headquarters</h3>
            <div className="space-y-5">
              {OFFICE_INFO.map((item) => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-medium text-white">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-slate-900/40 text-center text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-white">Enterprise SLA Support</p>
            <p>24/7 dedicated incident response and architecture monitoring for active client deployments.</p>
          </Card>
        </div>

        {/* Contact form */}
        <Card glow glowColor="cyan" className="p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white">Inquiry Received</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. A senior Xynvora AI specialist will review your inquiry and get in touch within 24 hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-white pb-2 border-b border-slate-800">Send an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Zain"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
                <Input
                  label="Business Email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone / WhatsApp"
                  placeholder="+92 300 1234567"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <Input
                  label="Company Name"
                  placeholder="Company Ltd"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </div>

              <Textarea
                label="How Can We Help Your Organization?"
                placeholder="Describe your workflow challenges, timelines, or requirements..."
                rows={4}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
                Send Message →
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
