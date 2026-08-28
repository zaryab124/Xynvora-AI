"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function ProfileEditPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [skillsStr, setSkillsStr] = useState("AI Agents, TypeScript, Python");
  const [interestsStr, setInterestsStr] = useState("Healthcare AI, Multi-Agent Topologies");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");
        const json = await res.json();
        if (json.success && json.data?.profile) {
          const p = json.data.profile;
          setFullName(p.full_name || "");
          setBio(p.bio || "");
          setPosition(p.position || "");
          setCompany(p.company || "");
          setPhone(p.phone || "");
          setLinkedinUrl(p.linkedin_url || "");
          setGithubUrl(p.github_url || "");

          const metadata = typeof p.metadata === "string" ? JSON.parse(p.metadata || "{}") : p.metadata || {};
          if (metadata.skills) setSkillsStr(metadata.skills.join(", "));
          if (metadata.interests) setInterestsStr(metadata.interests.join(", "));
          if (metadata.portfolio_url) setPortfolioUrl(metadata.portfolio_url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const skills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
      const interests = interestsStr.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          bio,
          position,
          company,
          phone,
          skills,
          interests,
          linkedin_url: linkedinUrl || undefined,
          github_url: githubUrl || undefined,
          portfolio_url: portfolioUrl || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Profile Updated!", message: "Your changes have been saved to your public profile.", type: "success" });
        router.push("/profile");
      } else {
        showToast({ title: "Update Failed", message: data.error || "Please check inputs.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to save profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Navigation */}
      <Link href="/profile" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
        ← Back to Profile
      </Link>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-white">Edit Your Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Update your professional details and innovation interests.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Job Position / Title"
              placeholder="e.g. AI Research Engineer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company / Organization"
              placeholder="e.g. Acme AI Labs"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Phone Number"
              placeholder="+92 300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Textarea
            label="Biography"
            placeholder="Tell the community about your technical background and what you are building..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <Input
            label="Skills & Technologies (comma separated)"
            placeholder="AI Agents, Python, FastAPI, Next.js, Docker"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
          />

          <Input
            label="Innovation Interests (comma separated)"
            placeholder="Healthcare AI, Supply Chain, Autonomous Reasoning"
            value={interestsStr}
            onChange={(e) => setInterestsStr(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="LinkedIn Profile URL"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            <Input
              label="GitHub Profile URL"
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Link href="/profile">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Changes →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
