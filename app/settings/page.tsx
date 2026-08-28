"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [ideaAlerts, setIdeaAlerts] = useState(true);
  const [replyAlerts, setReplyAlerts] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/user/settings");
        const json = await res.json();
        if (json.success && json.data?.settings) {
          const s = json.data.settings;
          setEmailNotifs(s.email_notifications ?? true);
          setIdeaAlerts(s.idea_status_alerts ?? true);
          setReplyAlerts(s.community_replies_alerts ?? true);
          setProfilePublic(s.profile_public ?? true);
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function loadBlocked() {
      try {
        const res = await fetch("/api/user/block");
        const json = await res.json();
        if (json.success && json.data?.blockedUsers) {
          setBlockedUsers(json.data.blockedUsers);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadSettings();
    loadBlocked();
  }, []);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_notifications: emailNotifs,
          idea_status_alerts: ideaAlerts,
          community_replies_alerts: replyAlerts,
          profile_public: profilePublic,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast({ title: "Settings Saved", message: "Your preferences have been updated.", type: "success" });
      } else {
        showToast({ title: "Error", message: data.error || "Failed to update.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleUnblock(userId: string) {
    try {
      const res = await fetch(`/api/user/block?user_id=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBlockedUsers((prev) => prev.filter((u) => u.blocked_user_id !== userId));
        showToast({ title: "User Unblocked", message: "User has been removed from your blocked list.", type: "info" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to unblock user.", type: "error" });
    }
  }

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Account & Privacy Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage notifications, discovery preferences, and safety controls.</p>
        </div>
        <Link href="/dashboard" className="text-xs text-cyan-400 hover:underline">
          ← Dashboard
        </Link>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Notification Preferences */}
        <Card glow glowColor="cyan" className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Notification Preferences</h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white">Email Digest & Alerts</span>
                <p className="text-[11px] text-slate-400">Receive weekly summaries of relevant research and project milestones.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white">Idea Governance Alerts</span>
                <p className="text-[11px] text-slate-400">Instant notification when CGO, CFO, or CEO triage your submitted ideas.</p>
              </div>
              <input
                type="checkbox"
                checked={ideaAlerts}
                onChange={(e) => setIdeaAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white">Community Discussion Replies</span>
                <p className="text-[11px] text-slate-400">Alerts when other members comment on or appreciate your posts.</p>
              </div>
              <input
                type="checkbox"
                checked={replyAlerts}
                onChange={(e) => setReplyAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
            </label>
          </div>
        </Card>

        {/* Privacy Controls */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Privacy & Visibility</h3>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-white">Public Profile Discovery</span>
              <p className="text-[11px] text-slate-400">Allow your innovator profile and reputation score to appear in the public directory.</p>
            </div>
            <input
              type="checkbox"
              checked={profilePublic}
              onChange={(e) => setProfilePublic(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
            />
          </label>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={saving}>
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Blocked Users Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Blocked Users</h3>
        <p className="text-xs text-slate-400">Blocked members cannot see your profile or interact with your posts.</p>

        {blockedUsers.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No blocked users.</p>
        ) : (
          <div className="space-y-2">
            {blockedUsers.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white">{b.blocked_name || "Blocked Member"}</span>
                  <p className="text-[10px] text-slate-500">Reason: {b.reason}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUnblock(b.blocked_user_id)}>
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
