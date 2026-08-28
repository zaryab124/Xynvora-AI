"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { useToast } from "@/components/ui/Toast";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success && json.data?.categories) {
        setCategories(json.data.categories);
      }
    }
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      setCreating(true);
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });

      const data = await res.json();
      if (data.success) {
        showToast({ title: "Category Created", message: `Category "${name}" added to taxonomy.`, type: "success" });
        setCategories([...categories, { id: data.data?.id, name, slug, description }]);
        setShowModal(false);
        setName("");
        setSlug("");
        setDescription("");
      } else {
        showToast({ title: "Error", message: data.error || "Failed to create category", type: "error" });
      }
    } catch {
      showToast({ title: "Error", message: "Network error creating category.", type: "error" });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <GlowOrb color="#f43f5e" size={500} top="0" right="-150px" opacity={0.1} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Link href="/admin/dashboard" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 mb-2">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Innovation Taxonomy & Categories</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global industry verticals, tags, and classification taxonomies.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          + Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Card key={c.id} className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{c.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                /{c.slug}
              </span>
            </div>
            <p className="text-xs text-slate-400">{c.description || "Core platform category."}</p>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create Innovation Category</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Category Name *"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                }}
                required
              />
              <Input
                label="Category Slug *"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <Textarea
                label="Description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={creating}>Create Category</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
