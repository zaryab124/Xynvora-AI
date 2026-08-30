"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const KNOWLEDGE_CATEGORIES = [
  { id: "All", label: "All Insights" },
  { id: "Social Impact", label: "🌱 Social Impact" },
  { id: "Artificial Intelligence", label: "🤖 AI" },
  { id: "Technology", label: "💻 Technology" },
  { id: "Science", label: "🧬 Science" },
  { id: "Space/Cosmos", label: "🚀 Space" },
  { id: "Education", label: "📚 Education" },
  { id: "Innovation", label: "💡 Innovation" },
];

export default function KnowledgePage() {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Publish Modal State
  const [publishOpen, setPublishOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Social Impact");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("Social Impact, Community, Healthcare");
  const [publishing, setPublishing] = useState(false);

  // Sample quick image presets
  const IMAGE_PRESETS = [
    { label: "🏥 Health & Clinic", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" },
    { label: "🌱 Green & Solar", url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80" },
    { label: "🤖 AI Systems", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" },
    { label: "💻 Embedded IoT", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
    { label: "🚀 Deep Space", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" },
    { label: "📚 Education", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80" },
  ];

  async function loadArticles() {
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

  useEffect(() => {
    loadArticles();
  }, []);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !summary || !content) {
      showToast({ title: "Validation Error", message: "Please fill in title, summary and content.", type: "error" });
      return;
    }

    try {
      setPublishing(true);
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          summary,
          content,
          image_url: imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast({ title: "Article Published!", message: "Your Social Impact / Knowledge post is now live.", type: "success" });
        setPublishOpen(false);
        setTitle("");
        setSummary("");
        setContent("");
        setImageUrl("");
        loadArticles();
      } else {
        showToast({ title: "Error", message: json.error || "Failed to publish article", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network connection error.", type: "error" });
    } finally {
      setPublishing(false);
    }
  }

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <GlowOrb color="#00d4ff" size={600} top="-100px" right="-150px" opacity={0.15} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-slate-700/60">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider uppercase">
            COMMUNITY BLOG & KNOWLEDGE REPOSITORY
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            Social Impact & AI Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Real-world community initiatives, ethical AI frameworks, healthcare deployments, and technical research blueprints across 7 foundational innovation domains.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => setPublishOpen(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20">
            ✍️ Publish Social Impact Article
          </Button>
          <Link href="/partnerships/apply?type=academic_research">
            <Button variant="outline" size="sm">
              🔬 Research Collaboration →
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="space-y-4">
        <Tabs tabs={KNOWLEDGE_CATEGORIES} activeTab={activeCategory} onChange={setActiveCategory} />
        <div className="w-full md:w-80">
          <Input
            placeholder="Search articles, authors, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<span>🔍</span>}
          />
        </div>
      </div>

      {/* Articles Grid with High-Contrast Responsive Image Covers */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <Card key={art.id} glow glowColor="cyan" className="flex flex-col justify-between overflow-hidden group hover:border-cyan-500/60 transition-all duration-300">
              {/* Picture Cover */}
              <div
                className="relative w-full h-48 bg-slate-800 overflow-hidden cursor-pointer"
                onClick={() => setSelectedArticle(art)}
              >
                {art.image_url ? (
                  <Image
                    src={art.image_url}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-slate-900 text-3xl">
                    🌱
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                  {art.category}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700">
                  {art.read_time}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3
                    className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug cursor-pointer line-clamp-2"
                    onClick={() => setSelectedArticle(art)}
                  >
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {art.tags?.slice(0, 3).map((t: string, j: number) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white text-[11px]">{art.author}</p>
                      <p className="text-[10px] text-cyan-400 font-mono">{art.author_role}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-slate-700 hover:border-cyan-500" onClick={() => setSelectedArticle(art)}>
                      Read →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Article Modal */}
      <Modal isOpen={publishOpen} onClose={() => setPublishOpen(false)} title="Publish Social Impact / Knowledge Article" maxWidth="lg">
        <form onSubmit={handlePublish} className="space-y-4">
          <Input
            label="Article Title"
            placeholder="e.g. Autonomous Mobile Clinics for Underserved Rural Centers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "Social Impact", label: "🌱 Social Impact" },
                { value: "Artificial Intelligence", label: "🤖 Artificial Intelligence" },
                { value: "Technology", label: "💻 Technology" },
                { value: "Science", label: "🧬 Science" },
                { value: "Space/Cosmos", label: "🚀 Space/Cosmos" },
                { value: "Education", label: "📚 Education" },
                { value: "Innovation", label: "💡 Innovation" },
              ]}
            />

            <Input
              label="Tags (Comma-Separated)"
              placeholder="Healthcare, Solar, Clean Energy"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Picture Upload / URL Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Feature Picture / Cover Image URL</label>
            <Input
              placeholder="https://images.unsplash.com/... or choose preset below"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400">Quick Presets:</span>
              {IMAGE_PRESETS.map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUrl(p.url)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Picture Preview */}
            {imageUrl && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-700 mt-2">
                <Image
                  src={imageUrl}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 bg-black/70 text-emerald-400 font-mono rounded">
                  ✓ Image Preview Active
                </span>
              </div>
            )}
          </div>

          <Textarea
            label="Executive Summary"
            placeholder="A concise 2-sentence summary of the initiative and expected societal impact..."
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />

          <Textarea
            label="Full Article Content"
            placeholder="Detailed narrative, implementation milestones, architectural diagrams, and research methodology..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setPublishOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={publishing} className="bg-cyan-600 hover:bg-cyan-500">
              🚀 Publish to Knowledge Base
            </Button>
          </div>
        </form>
      </Modal>

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <Card glow glowColor="cyan" className="max-w-3xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col bg-slate-900 border-slate-700">
            {/* Header Image */}
            {selectedArticle.image_url && (
              <div className="relative w-full h-64 bg-slate-800 flex-shrink-0">
                <Image
                  src={selectedArticle.image_url}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border-slate-700 text-white"
                >
                  ✕ Close
                </Button>
              </div>
            )}

            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>Author: <strong className="text-white">{selectedArticle.author}</strong> ({selectedArticle.author_role})</span>
                  <span>•</span>
                  <span>Published: <strong className="text-slate-300">{selectedArticle.date}</strong></span>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono">{selectedArticle.read_time}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-200 font-medium">
                  💡 <strong>Summary:</strong> {selectedArticle.summary}
                </div>
                <div className="whitespace-pre-line leading-loose text-slate-300">
                  {selectedArticle.content}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedArticle.tags?.map((t: string, k: number) => (
                  <span key={k} className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Published by Xynvora AI Innovation Lab</span>
                <Button variant="primary" size="sm" onClick={() => setSelectedArticle(null)} className="bg-cyan-600 hover:bg-cyan-500">
                  Done Reading
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
