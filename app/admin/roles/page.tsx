"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/roles");
      const json = await res.json();
      if (json.success && json.data?.roles) {
        setRoles(json.data.roles);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Platform Role-Based Access Control (RBAC)</h1>
        <p className="text-xs text-slate-400 mt-1">Audit the 8 canonical platform roles, domain authorities, and explicit permission boundaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r, i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-base font-bold text-white font-mono">{r.role}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-rose-400 border border-slate-700 text-xs font-mono font-bold">
                {r.type}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Granted Permissions:</span>
              <div className="flex flex-wrap gap-1.5">
                {r.permissions?.map((p: string, j: number) => (
                  <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
