"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function AdminStoragePage() {
  const [storage, setStorage] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/storage");
      const json = await res.json();
      if (json.success && json.data?.storage) {
        setStorage(json.data.storage);
      }
    }
    load();
  }, []);

  const s = storage || {
    buckets: [
      { name: "avatars", files_count: 142, size: "128 MB", visibility: "public" },
      { name: "idea-attachments", files_count: 86, size: "1.4 GB", visibility: "private" },
      { name: "project-artifacts", files_count: 54, size: "2.6 GB", visibility: "private" },
      { name: "system-backups", files_count: 12, size: "8.2 GB", visibility: "restricted" },
    ],
    total_used: "12.3 GB",
    quota: "100 GB",
    provider: "Supabase S3 Storage Tier",
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Storage Buckets & Media Tier</h1>
        <p className="text-xs text-slate-400 mt-1">Audit S3 object storage usage, file retention policies, and bucket access controls.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Disbursed Storage</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{s.total_used}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Allocated Quota</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{s.quota}</div>
        </Card>
        <Card className="p-6 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Infrastructure Provider</span>
          <div className="text-lg font-bold text-white">{s.provider}</div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Active Object Buckets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {s.buckets?.map((b: any, i: number) => (
            <Card key={i} className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-bold text-white font-mono">{b.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase">
                  {b.visibility}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
                <span>Files: <strong>{b.files_count}</strong></span>
                <span>Size: <strong className="text-rose-400">{b.size}</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
