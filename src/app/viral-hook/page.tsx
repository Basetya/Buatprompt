"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Share2,
  TrendingUp,
  Target
} from "lucide-react";

export default function ViralHookPage() {
  const [productOrTopic, setProductOrTopic] = useState("Serum Pencerah Wajah Herbal");
  const [targetPlatform, setTargetPlatform] = useState<"tiktok" | "reels" | "shorts">("tiktok");
  const [hookStyle, setHookStyle] = useState<any>("curiosity-gap");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productOrTopic.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "viral-hook",
          productOrTopic,
          targetPlatform,
          hookStyle,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan hook blueprint.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses data.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!resultPrompt) return;
    await navigator.clipboard.writeText(resultPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-mono font-medium text-rose-300 mb-2">
          <Flame className="h-3.5 w-3.5" />
          <span>PSYCHOLOGICAL HOOK & RETENTION LAB</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Viral Hook & Retention Lab
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ciptakan hook 3 detik penahan scroll pertama berbasis psikologi atensi: Curiosity Gap, Pattern Interrupt, dan Transformation Staging untuk TikTok, Reels, dan Shorts.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              PRODUK ATAU TOPIK KONTEN *
            </label>
            <input
              type="text"
              required
              value={productOrTopic}
              onChange={(e) => setProductOrTopic(e.target.value)}
              placeholder="Contoh: Kopi Susu Creamy Praktis / Baju Gamis Lebaran"
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PLATFORM DISTRIBUSI
              </label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-rose-500 focus:outline-none"
              >
                <option value="tiktok">TikTok Video (High Retention & Commerce)</option>
                <option value="reels">Instagram Reels (Aesthetic & Social Proof)</option>
                <option value="shorts">YouTube Shorts (Direct & Fast Action)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                STRATEGI PSIKOLOGI HOOK
              </label>
              <select
                value={hookStyle}
                onChange={(e) => setHookStyle(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-rose-500 focus:outline-none"
              >
                <option value="curiosity-gap">Curiosity Gap (Membuka Open-Loop Otak)</option>
                <option value="pattern-interrupt">Pattern Interrupt (Anti-Boring Visual Action)</option>
                <option value="transformation">Before / After Transformation (Bukti Nyata)</option>
                <option value="controversy">Debunking Mitos / Fakta Kontroversial</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !productOrTopic.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !productOrTopic.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-indigo-500/25 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Merancang Variasi Hook Penahan Scroll...</span>
              </>
            ) : (
              <>
                <Flame className="h-4 w-4 text-rose-300" />
                <span>Rancang Formula Hook Viral 3 Detik</span>
              </>
            )}
          </button>
        </form>

        {resultPrompt && (
          <div className="rounded-2xl border border-rose-500/30 bg-[#0d1017] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Blueprint Hook & Audio Pacing Siap Syuting
                </h3>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500 text-black font-bold"
                    : "studio-btn-primary shadow-md"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Disalin!" : "Salin Blueprint"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-96 overflow-y-auto">
              {resultPrompt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
