"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.data?.token) {
        showToast({ title: "Welcome Back!", message: `Logged in as ${data.data.user.full_name}`, type: "success" });
        const role = data.data.user.role;
        if (role === 'CEO') router.push('/ceo/dashboard');
        else if (role === 'CFO') router.push('/cfo/dashboard');
        else if (role === 'CGO') router.push('/cgo/dashboard');
        else if (role === 'DEVELOPER') router.push('/developer/dashboard');
        else if (role === 'ADMIN') router.push('/admin/dashboard');
        else if (role === 'COMMUNITY_MODERATOR') router.push('/admin/reports');
        else router.push('/dashboard');
      } else {
        showToast({ title: "Login Failed", message: data.error || "Invalid credentials.", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Failed to connect to authentication server.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <GlowOrb color="#00d4ff" size={500} top="10%" left="30%" opacity={0.15} />

      <Card glow glowColor="cyan" className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.4)] mx-auto">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-cyan-400 font-extrabold text-xl">
                X
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Log In to Xynvora AI</h1>
          <p className="text-xs text-slate-400">Access the innovation platform, idea queue, and community feed.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
            Sign In →
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-cyan-400 font-bold hover:underline">
            Join the Community
          </Link>
        </div>
      </Card>
    </div>
  );
}
