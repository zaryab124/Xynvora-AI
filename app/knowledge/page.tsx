"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";

const KNOWLEDGE_CATEGORIES = [
  { id: "All", label: "All Insights" },
  { id: "Artificial Intelligence", label: "Artificial Intelligence" },
  { id: "Technology", label: "Technology" },
  { id: "Science", label: "Science" },
  { id: "Space/Cosmos", label: "Space/Cosmos" },
  { id: "Education", label: "Education" },
  { id: "Innovation", label: "Innovation" },
  { id: "Social Impact", label: "Social Impact" },
];

export default function KnowledgePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/knowledge");
        const json = await res.json();
        if (json.success && json.data?.articles) {
          setArticles(json.data.articles);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <GlowOrb color="#00d4ff" size={600} top="-100px" right="-150px" opacity={0.12} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider uppercase">
            SCALABLE KNOWLEDGE ARCHITECTURE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Xynvora AI Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
            Cutting-edge research, whitepapers, architectural blueprints, and societal frameworks across 7 foundational innovation domains.
          </p>
        </div>

        <Link href="/partnerships/apply?type=academic_research">
          <Button variant="outline" size="sm">
            🔬 Submit Research Collaboration →
          </Button>
        </Link>
      </div>

      {/* Category Tabs & Search */}
      <div className="space-y-4">
        <Tabs tabs={KNOWLEDGE_CATEGORIES} activeTab={activeCategory} onChange={setActiveCategory} />
        <div className="w-full md:w-80">
          <Input
            placeholder="Search across 7 knowledge pillars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <Card key={art.id} glow glowColor="cyan" className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {art.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    {art.read_time}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors leading-snug cursor-pointer" onClick={() => setSelectedArticle(art)}>
                  {art.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {art.tags?.map((t: string, j: number) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white text-[11px]">{art.author}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{art.author_role}</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedArticle(art)}>
                  Read Article →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card glow glowColor="cyan" className="max-w-2xl w-full p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">{selectedArticle.category}</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedArticle.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  By {selectedArticle.author} ({selectedArticle.author_role}) • {selectedArticle.read_time}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)}>✕ Close</Button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
              <p className="font-semibold text-white p-4 rounded-xl bg-slate-900 border border-slate-800">
                {selectedArticle.summary}
              </p>
              <p>{selectedArticle.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Published by Xynvora AI Research Lab</span>
              <Button variant="primary" size="sm" onClick={() => setSelectedArticle(null)}>Done Reading</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
