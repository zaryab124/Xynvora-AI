"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success && json.data?.notifications) {
        setNotifications(json.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllRead() {
    try {
      const res = await fetch("/api/notifications", { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        showToast({ title: "Inbox Cleared", message: "All notifications marked as read.", type: "success" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to mark notifications.", type: "error" });
    }
  }

  async function handleNotificationClick(notif: Notification) {
    if (!notif.is_read) {
      fetch(`/api/notifications/${notif.id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
    }
  }

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.is_read : true));
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <GlowOrb color="#00d4ff" size={500} top="0" right="-150px" opacity={0.1} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Notifications Inbox</h1>
          <p className="text-xs text-slate-400 mt-1">
            Realtime alerts on idea status transitions, discussion replies, and executive decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            ✓ Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "all"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "unread"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description={filter === "unread" ? "You have no unread notifications." : "You're completely caught up!"}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => {
            const isIdea = notif.type.includes("IDEA");
            return (
              <Card
                key={notif.id}
                glow={!notif.is_read}
                glowColor="cyan"
                className={`p-5 transition-all cursor-pointer ${
                  notif.is_read ? "bg-slate-900/40 opacity-80" : "bg-slate-900 border-cyan-500/40"
                }`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{isIdea ? "💡" : "💬"}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="inline-block text-[11px] font-semibold text-cyan-400 hover:underline pt-1"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
