"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <span className="font-extrabold text-cyan-400 text-base">X</span>
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white">
                XYNVORA <span className="text-cyan-400 font-normal">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier innovation and enterprise AI company connecting community innovators, C-suite executives, and specialized engineering squads to solve real-world problems.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Innovation Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/ideas" className="hover:text-cyan-400 transition-colors">Idea Intake Queue</Link></li>
              <li><Link href="/projects" className="hover:text-cyan-400 transition-colors">Active Solutions</Link></li>
              <li><Link href="/community" className="hover:text-cyan-400 transition-colors">Community Forum</Link></li>
              <li><Link href="/activities" className="hover:text-cyan-400 transition-colors">Hackathons & Sprints</Link></li>
              <li><Link href="/members" className="hover:text-cyan-400 transition-colors">Innovator Directory</Link></li>
            </ul>
          </div>

          {/* Solutions & Business */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Enterprise</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/business" className="hover:text-cyan-400 transition-colors">Industry Solutions</Link></li>
              <li><Link href="/business/healthcare" className="hover:text-cyan-400 transition-colors">Healthcare AI</Link></li>
              <li><Link href="/business/logistics" className="hover:text-cyan-400 transition-colors">Logistics Intelligence</Link></li>
              <li><Link href="/knowledge" className="hover:text-cyan-400 transition-colors">AI Research & Whitepapers</Link></li>
              <li><Link href="/partners" className="hover:text-cyan-400 transition-colors">Partner Ecosystem</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Story & Values</Link></li>
              <li><Link href="/about#leadership" className="hover:text-cyan-400 transition-colors">Leadership & Governance</Link></li>
              <li><Link href="/careers" className="hover:text-cyan-400 transition-colors">Careers & Engineering</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact Enterprise Sales</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Xynvora AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Ethical AI Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
