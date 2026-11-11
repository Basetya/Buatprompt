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
  Search,
  Image as ImageIcon,
  Video,
  Film,
  Clapperboard,
  LayoutGrid,
  ShoppingBag,
  BookOpen,
  Wand2,
  Gamepad2,
  Palette
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Image: ImageIcon,
  Video: Video,
  Film: Film,
  Clapperboard: Clapperboard,
  LayoutGrid: LayoutGrid,
  ShoppingBag: ShoppingBag,
  BookOpen: BookOpen,
  Wand2: Wand2,
  Gamepad2: Gamepad2,
  Sparkles: Sparkles,
  Palette: Palette,
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0c]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4f933] text-black shadow-lg shadow-[#d4f933]/20 group-hover:scale-105 transition-transform">
            <Search className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1 font-mono tracking-wider font-extrabold text-lg text-white">
            <span>CARI</span>
            <span className="text-[#d4f933]">PROMPT</span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          {/* Products Dropdown */}
          <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setDropdownOpen(true)}
              className="flex items-center gap-1.5 hover:text-[#d4f933] transition-colors py-2 cursor-pointer font-mono tracking-wide"
            >
              <span>PRODUK</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[460px] rounded-xl border border-white/10 bg-[#12141a]/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 grid grid-cols-1 gap-1"
                onMouseEnter={() => setDropdownOpen(true)}
              >
                <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-widest border-b border-white/5 mb-1 flex items-center justify-between">
                  <span>Suite Lengkap 11 AI Tools</span>
                  <span className="text-[#d4f933]">Google Flow & Midjourney Ready</span>
                </div>
                <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1">
                  {ALL_TOOLS.map((tool) => {
                    const IconComp = ICON_MAP[tool.icon] || Sparkles;
                    return (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/5 transition-colors group/item"
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${tool.iconBg} ${tool.color}`}>
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-zinc-200 group-hover/item:text-[#d4f933]">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-mono font-medium text-[#d4f933]">
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

          <Link href="#showcase" className="hover:text-[#d4f933] transition-colors font-mono">
            SHOWCASE
          </Link>
          <Link href="#pricing" className="hover:text-[#d4f933] transition-colors font-mono">
            HARGA
          </Link>
          <Link href="#faqs" className="hover:text-[#d4f933] transition-colors font-mono">
            FAQS
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/gambar"
            className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            MASUK
          </Link>
          <Link
            href="/gambar"
            className="flex items-center gap-1.5 rounded-lg bg-[#d4f933] px-4 py-1.5 text-xs font-mono font-bold text-black shadow-lg shadow-[#d4f933]/20 hover:bg-[#e2fb5f] transition-all"
          >
            <span>MULAI GRATIS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 md:hidden hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0f1115] px-4 pt-3 pb-6 md:hidden max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1 text-[11px] font-mono text-[#d4f933] uppercase tracking-wider">
              11 AI Prompt Tools
            </div>
            <div className="grid grid-cols-1 gap-1">
              {ALL_TOOLS.map((tool) => {
                const IconComp = ICON_MAP[tool.icon] || Sparkles;
                return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 text-zinc-300"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-md ${tool.iconBg} ${tool.color}`}>
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-mono text-xs font-medium text-zinc-200">{tool.name}</span>
                    {tool.badge && (
                      <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-[#d4f933]">
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="my-2 border-t border-white/10 pt-2 flex flex-col gap-2">
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-sm font-mono text-zinc-300 hover:bg-white/5"
              >
                HARGA & TOKEN
              </Link>
              <Link
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-sm font-mono text-zinc-300 hover:bg-white/5"
              >
                FAQS
              </Link>
              <Link
                href="/gambar"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#d4f933] py-2.5 font-mono text-xs font-bold text-black shadow-lg"
              >
                <span>BUKA GENERATOR PROMPT</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
