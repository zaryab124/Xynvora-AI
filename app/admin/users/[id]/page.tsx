"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [role, setRole] = useState("COMMUNITY_MEMBER");
  const [fullName, setFullName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users/${id}`);
        const json = await res.json();
        if (json.success && json.data?.user) {
          const u = json.data.user;
          setUser(u);
          setRole(u.role || "COMMUNITY_MEMBER");
          setFullName(u.full_name || "");
          setIsActive(u.is_active !== false);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          full_name: fullName,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Account Updated", message: "User privileges and status updated.", type: "success" });
        setUser((prev: any) => ({ ...prev, role, full_name: fullName, is_active: isActive }));
      } else {
        showToast({ title: "Error", message: data.error || "Update failed", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error saving user.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState title="User Not Found" message="Could not locate the requested account record." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between">
        <Link href="/admin/users" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5">
          ← Back to Users
        </Link>
        <span className={`px-2.5 py-1 rounded text-xs font-bold ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
          {isActive ? 'ACTIVE ACCOUNT' : 'SUSPENDED'}
        </span>
      </div>

      <Card glow glowColor="cyan" className="p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-rose-400 font-bold uppercase">Account Privilege Desk</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{user.full_name || "Account Profile"}</h1>
          <p className="text-xs text-slate-400">{user.email} • ID: {user.id}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Select
              label="Platform Role *"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: "COMMUNITY_MEMBER", label: "COMMUNITY_MEMBER" },
                { value: "DEVELOPER", label: "DEVELOPER" },
                { value: "COMMUNITY_MODERATOR", label: "COMMUNITY_MODERATOR" },
                { value: "CGO", label: "CGO (Chief Growth Officer)" },
                { value: "CEO", label: "CEO (Chief Executive Officer)" },
                { value: "CFO", label: "CFO (Chief Financial Officer)" },
                { value: "ADMIN", label: "ADMIN (Technical Administrator)" },
              ]}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white">Account Status</span>
              <p className="text-[11px] text-slate-400">Suspend account to revoke API and platform login clearance.</p>
            </div>
            <Button
              type="button"
              variant={isActive ? "danger" : "primary"}
              size="sm"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? "Suspend Account" : "Re-activate Account"}
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Privilege Changes →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
