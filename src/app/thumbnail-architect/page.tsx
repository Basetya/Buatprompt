"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Flame,
  Palette,
  Type,
  CheckCheck
} from "lucide-react";

export default function ThumbnailArchitectPage() {
  const [videoTopic, setVideoTopic] = useState("Kopi instan berbahaya yang masih banyak beredar di pasaran");
  const [targetCategory, setTargetCategory] = useState("Edukasi Kesehatan & Consumer Review");
  const [visualVibe, setVisualVibe] = useState<
    "hyper-contrast-pop" | "dark-enigmatic" | "curiosity-shock" | "luxury-prestige"
  >("curiosity-shock");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTopic.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "thumbnail-architect",
          videoTopic,
          targetCategory,
          visualVibe,
        }),
      });

      const data = await res.json();
      if (data.oneFrameMasterPrompt) {
        setResultData(data);
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
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-300 mb-2">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>CLICK-THROUGH RATE (CTR) ACCELERATOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          High-CTR Cover & Thumbnail Architect
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ciptakan gambar still 1-frame magnet klik untuk Cover TikTok & YouTube Shorts. Memaksimalkan kontras optik, dual rim lighting, psikologi warna penarik mata, dan saran judul 3-kata kapital.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              TOPIK / INTISARI VIDEO *
            </label>
            <input
              type="text"
              required
              value={videoTopic}
              onChange={(e) => setVideoTopic(e.target.value)}
              placeholder="Contoh: Kopi sachet berbahaya yang wajib dihindari"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                KATEGORI KONTEN
              </label>
              <input
                type="text"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                placeholder="Contoh: Edukasi, Skincare, Kuliner"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GAYA VISUAL THUMBNAIL
              </label>
              <select
                value={visualVibe}
                onChange={(e) => setVisualVibe(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
              >
                <option value="curiosity-shock">😱 Curiosity Shock (Ekspresi Penasaran)</option>
                <option value="hyper-contrast-pop">⚡ Hyper Contrast Pop (Warna Menjebol Layar)</option>
                <option value="dark-enigmatic">🌑 Dark Enigmatic (Misterius & Sinematik)</option>
                <option value="luxury-prestige">✨ Luxury Prestige (Elegan & Berkelas)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>MERANCANG THUMBNAIL MAGNET KLIK...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE HIGH-CTR THUMBNAIL PROMPT</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Suggested 3-Word Bold Headlines */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold mb-2.5">
                <Type className="h-4 w-4" />
                <span>PILIHAN HEADLINE 3-KATA BESAR (PENARIK MATA INSTAN)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {resultData.suggestedThreeWordHeadlines.map((hl: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => copyToClipboard(`hl-${i}`, hl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-amber-200 font-mono text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    <span>{hl}</span>
                    <span className="text-[10px] text-zinc-400">
                      {copiedKey === `hl-${i}` ? "✓" : "Salin"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-mono text-zinc-300 mt-3 border-t border-white/10 pt-2">
                💡 <span className="font-semibold text-amber-300">Posisi:</span> {resultData.opticalFramingAdvice}
              </p>
            </div>

            {/* Color Psychology Stack */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-200">
                <Palette className="h-4 w-4 text-amber-400" />
                <span>FORMULA PSIKOLOGI WARNA HIGH-CTR</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">AKSENS UTAMA</span>
                  <span className="text-amber-300 font-semibold">{resultData.colorPsychologyStack.primaryAccent}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">KONTRAS LATAR</span>
                  <span className="text-zinc-300 font-semibold">{resultData.colorPsychologyStack.backgroundContrast}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">MAGNET PANDANGAN</span>
                  <span className="text-cyan-300 font-semibold">{resultData.colorPsychologyStack.eyeMagnetColor}</span>
                </div>
              </div>
            </div>

            {/* 1-Frame Master Prompt */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-amber-400">
                  MASTER THUMBNAIL PROMPT (MIDJOURNEY V6.1 & GOOGLE IMAGEN 3)
                </span>
                <button
                  onClick={() => copyToClipboard("thumb-prompt", resultData.oneFrameMasterPrompt)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 px-3 py-1.5 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {copiedKey === "thumb-prompt" ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-300" />
                      <span>TERSALIN!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>SALIN PROMPT THUMBNAIL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <pre className="font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {resultData.oneFrameMasterPrompt}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

