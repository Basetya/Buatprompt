"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  CalendarCheck2,
  Clock,
  Layers,
  CheckCheck
} from "lucide-react";

export default function ContentSprintPage() {
  const [channelNiche, setChannelNiche] = useState("Affiliate Gadget & Minimalist Desk Setup");
  const [heroProduct, setHeroProduct] = useState("Mikrofon Wireless Clip-on Noise Cancelling");
  const [isLoading, setIsLoading] = useState(false);
  const [sprintText, setSprintText] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelNiche.trim() || !heroProduct.trim()) return;

    setIsLoading(true);
    setSprintText(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "content-sprint",
          channelNiche,
          heroProduct,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setSprintText(data.prompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper to split sprint text into day blocks if possible
  const dayBlocks = sprintText
    ? sprintText.split(/HARI\s+(\d+):/i).filter(Boolean)
    : [];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Kembali ke Studio</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300 mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>7-DAY CONTENT ENGINE & ALGORITHM WARMING</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          7-Day Content Sprint & Bulk Calendar
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Cetak biru posting 1 minggu penuh (Senin s/d Minggu) dengan struktur psikologi yang bertahap: dari agitasi masalah, edukasi mitos, hero reveal, hingga flash sale urgency.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NICHE CHANNEL / KATEGORI *
              </label>
              <input
                type="text"
                required
                value={channelNiche}
                onChange={(e) => setChannelNiche(e.target.value)}
                placeholder="Contoh: Gadget & Tech, Skincare, Kuliner Kopi"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                HERO PRODUCT / TOPIK UTAMA *
              </label>
              <input
                type="text"
                required
                value={heroProduct}
                onChange={(e) => setHeroProduct(e.target.value)}
                placeholder="Contoh: Mikrofon Wireless Clip-on"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>MERANCANG SIKLUS SPRINT 7 HARI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE 7-DAY CONTENT SPRINT CALENDAR</span>
              </>
            )}
          </button>
        </form>

        {sprintText && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Header with full copy button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 backdrop-blur-xl">
              <div>
                <h3 className="font-mono text-lg font-bold text-white">
                  Kalender Sprint 7 Hari Siap Eksekusi!
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Target Niche: {channelNiche} | Hero: {heroProduct}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard("full-sprint", sprintText)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 font-mono text-xs font-bold text-white transition-colors shadow-md cursor-pointer shrink-0"
              >
                {copiedKey === "full-sprint" ? (
                  <>
                    <CheckCheck className="h-4 w-4 text-emerald-300" />
                    <span>SELURUH SPRINT TERSALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>SALIN SELURUH JADWAL (7 HARI)</span>
                  </>
                )}
              </button>
            </div>

            {/* Structured Sprint Content */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  STRUKTUR HARIAN PROTOKOL KONTEN
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  Senin s/d Minggu
                </span>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {sprintText}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

