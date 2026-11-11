"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_TOOLS } from "@/data/tools";
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowRight,
  Video,
  Film,
  Camera,
  Layers,
  Flame,
  LayoutGrid,
  ShoppingBag,
  BookOpen,
  Wand2,
  Gamepad2,
  Palette,
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

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07080c]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo: BuatPrompt */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#07080c]">
              <Sparkles className="h-4 w-4 text-cyan-300 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 font-mono tracking-wider font-extrabold text-base text-white">
              <span>BUAT</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
                PROMPT
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-1">
              AI Studio & Foundry
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium text-zinc-300">
          {/* Products Dropdown */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors py-2 cursor-pointer uppercase tracking-wider"
            >
              <span>STUDIO TOOLS (14)</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[520px] rounded-2xl border border-white/10 bg-[#0d1017]/95 p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                onMouseEnter={() => setDropdownOpen(true)}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2 px-1">
                  <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
                    BuatPrompt Suite
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    Google Flow Ready
                  </span>
                </div>

                <div className="max-h-[420px] overflow-y-auto pr-1 space-y-1">
                  {ALL_TOOLS.map((tool) => {
                    const IconComp = ICON_MAP[tool.icon] || Sparkles;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-white/[0.06] transition-colors group/item"
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tool.iconBg} ${tool.color} border border-white/5`}>
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-zinc-200 group-hover/item:text-cyan-300 transition-colors">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span className={`rounded-full px-2 py-0.2 text-[9px] font-mono font-medium border ${tool.badgeColor || "bg-white/10 text-zinc-300"}`}>
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-1 text-[11px] text-zinc-400 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link href="/google-flow-director" className="hover:text-indigo-300 transition-colors flex items-center gap-1 text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>FLOW DIRECTOR</span>
          </Link>
          <Link href="/prompt-matrix" className="hover:text-cyan-300 transition-colors">
            PROMPT MATRIX
          </Link>
          <Link href="#gallery" className="hover:text-zinc-100 transition-colors">
            GALERI HASIL
          </Link>
          <Link href="#pricing" className="hover:text-zinc-100 transition-colors">
            PAKET AKSES
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/prompt-matrix"
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-300 hover:bg-white/10 transition-all"
          >
            LOGIN
          </Link>
          <Link
            href="/google-flow-director"
            className="flex items-center gap-1.5 rounded-xl studio-btn-primary px-4 py-1.5 text-xs font-mono font-bold shadow-lg shadow-indigo-500/20"
          >
            <span>BUKA STUDIO</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 md:hidden hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#07080c] px-4 pt-3 pb-6 md:hidden max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1 text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>Studio Tools Suite</span>
              <span className="text-zinc-500">14 Engines</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {ALL_TOOLS.map((tool) => {
                const IconComp = ICON_MAP[tool.icon] || Sparkles;
                return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/5 text-zinc-300"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tool.iconBg} ${tool.color}`}>
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono text-xs font-medium text-zinc-200">{tool.name}</span>
                    {tool.badge && (
                      <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-mono text-cyan-300">
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="my-2 border-t border-white/10 pt-3 flex flex-col gap-2">
              <Link
                href="/google-flow-director"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl studio-btn-primary py-3 font-mono text-xs font-bold shadow-lg"
              >
                <span>BUKA GOOGLE FLOW DIRECTOR</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
