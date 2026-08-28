"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [maintenance, setMaintenance] = useState(false);
  const [allowReg, setAllowReg] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.success && json.data?.settings) {
        setSettings(json.data.settings);
        setMaintenance(json.data.settings.maintenanceMode || false);
        setAllowReg(json.data.settings.allowNewRegistrations !== false);
      }
    }
    load();
  }, []);

  function handleSave() {
    showToast({ title: "Configuration Saved", message: "System environment parameters updated.", type: "success" });
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="pb-4 border-b border-slate-800">
        <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
          ← Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white">System Configuration & Security Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure global application parameters, feature gates, and security headers.</p>
      </div>

      <Card className="p-8 space-y-6">
        <div className="space-y-4">
          <Input
            label="Platform Title"
            defaultValue="Xynvora AI Platform"
          />

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white">Maintenance Mode</span>
              <p className="text-xs text-slate-400">Lock non-admin access during scheduled platform upgrades.</p>
            </div>
            <Button
              type="button"
              variant={maintenance ? "danger" : "outline"}
              size="sm"
              onClick={() => setMaintenance(!maintenance)}
            >
              {maintenance ? "Disable Maintenance" : "Enable Maintenance"}
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white">Allow Public Registrations</span>
              <p className="text-xs text-slate-400">Enable new community members to sign up.</p>
            </div>
            <Button
              type="button"
              variant={allowReg ? "primary" : "outline"}
              size="sm"
              onClick={() => setAllowReg(!allowReg)}
            >
              {allowReg ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <Button variant="primary" onClick={handleSave}>
            Save System Settings →
          </Button>
        </div>
      </Card>
    </div>
  );
}
