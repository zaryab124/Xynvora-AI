"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function DeveloperFilesPage() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/developer/files");
      const json = await res.json();
      if (json.success && json.data?.files) {
        setFiles(json.data.files);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/developer/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Developer Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Technical Architecture Files & Artifacts</h1>
        <p className="text-xs text-slate-400 mt-1">Access architecture diagrams, schema specifications, and deployment configurations.</p>
      </div>

      <div className="space-y-4">
        {files.map((f: any) => (
          <Card key={f.id} glow glowColor="cyan" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-lg">
                📄
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{f.name}</h4>
                <p className="text-xs text-slate-400">{f.project} • {f.type} ({f.size})</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              ✓ Verified Spec
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
