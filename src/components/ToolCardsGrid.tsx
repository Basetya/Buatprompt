"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_TOOLS, ToolItem } from "@/data/tools";
import {
  Sparkles,
  ArrowRight,
  Video,
  Film,
  Camera,
  Layers,
  Flame,
  LayoutGrid,
  ShoppingBag,
  Wand2,
  Palette,
  BookOpen,
  Gamepad2,
  Image as ImageIcon
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Video: Video,
  Layers: Layers,
  Flame: Flame,
  Image: ImageIcon,
  Camera: Camera,
  Film: Film,
  Clapperboard: Film,
  LayoutGrid: LayoutGrid,
  ShoppingBag: ShoppingBag,
  Wand2: Wand2,
  Sparkles: Sparkles,
  Palette: Palette,
  BookOpen: BookOpen,
  Gamepad2: Gamepad2,
};

const CATEGORIES = [
  { id: "all", label: "Semua Tool (14)" },
  { id: "google-flow", label: "Google Flow Special" },
  { id: "cinematic-video", label: "Video Sinematik" },
  { id: "visual-art", label: "Visual & Art" },
  { id: "commerce-growth", label: "Commerce & Viral" },
  { id: "interactive-lab", label: "Interactive Lab" },
];

export default function ToolCardsGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = activeCategory === "all"
    ? ALL_TOOLS
    : ALL_TOOLS.filter((t) => t.category === activeCategory);

  return (
    <section id="tools" className="py-12 md:py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>14 DEDICATED ORCHESTRATION ENGINES</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Arsitektur Prompt Lengkap <br className="hidden sm:block" />
            <span className="text-gradient">Dalam Satu Ekosistem Studio</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Dari sutradara multi-shot Google Flow, matriks 4-engine simultan, naskah konversi TikTok Shop, hingga mini-game HTML5 mandiri. Pilih engine yang Anda butuhkan.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const IconComp = ICON_MAP[tool.icon] || Sparkles;

            return (
              <div
                key={tool.id}
                className="relative rounded-2xl border border-white/10 bg-[#0d1017] p-6 flex flex-col justify-between group hover:border-indigo-500/40 hover:bg-[#10141e] transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.iconBg} ${tool.color} border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    {tool.badge && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold border ${tool.badgeColor || "bg-white/10 text-cyan-300 border-white/10"}`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-mono text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {tool.description}
                  </p>

                  {/* Sample Chips */}
                  {tool.samples && tool.samples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Penerapan Produksi:
                      </span>
                      {tool.samples.map((sample, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                          <span className="h-1 w-1 rounded-full bg-cyan-400" />
                          <span className="line-clamp-1">{sample}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <Link
                    href={tool.path}
                    className="flex items-center justify-between w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-mono font-semibold text-zinc-200 group-hover:studio-btn-primary group-hover:border-transparent transition-all duration-200"
                  >
                    <span>Luncurkan Engine</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
