"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Split,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Flame,
  CheckCheck,
  GitBranch,
  Video,
  Mic
} from "lucide-react";

export default function HookSplitterPage() {
  const [coreTopicOrProduct, setCoreTopicOrProduct] = useState("Serum Retinol Botanical 1%");
  const [coreBenefitOrSecret, setCoreBenefitOrSecret] = useState("Menyamarkan garis halus dan flek hitam tanpa bikin kulit mengelupas perih");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreTopicOrProduct.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hook-splitter",
          coreTopicOrProduct,
          coreBenefitOrSecret,
        }),
      });

      const data = await res.json();
      if (data.hookVariants) {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-mono font-medium text-rose-300 mb-2">
          <Split className="h-3.5 w-3.5" />
          <span>ALGORITHM RETENTION A/B TESTING</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Viral Hook A/B Test Splitter
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Buat **3 pembuka 3-detik berbeda** (Visual Shock, Contrarian Debunk, Curiosity Loop) untuk **1 isi video yang sama**. Lipat gandakan peluang viral di multi-akun tanpa repot re-take video isi.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PRODUK / TOPIK UTAMA *
              </label>
              <input
                type="text"
                required
                value={coreTopicOrProduct}
                onChange={(e) => setCoreTopicOrProduct(e.target.value)}
                placeholder="Contoh: Serum Retinol Botanical"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                MANFAAT UTAMA / RAHASIA *
              </label>
              <input
                type="text"
                required
                value={coreBenefitOrSecret}
                onChange={(e) => setCoreBenefitOrSecret(e.target.value)}
                placeholder="Contoh: Menyamarkan kerutan tanpa perih"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>MEMECAH 3 VARIASI HOOK A/B...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE 3-IN-1 HOOK SPLIT TEST</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* 3 Hook Cards */}
            <div className="space-y-4">
              {resultData.hookVariants.map((h: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-rose-400">
                        {h.tag}
                      </span>
                      <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        Psikologi: {h.hookType}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-rose-300">
                      {h.onScreenTextBadge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">
                        🎙️ NASKAH BICARA (VOICEOVER 0-3 DETIK):
                      </span>
                      <p className="font-mono text-xs text-white font-semibold">
                        "{h.openingVerbalScript}"
                      </p>
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">
                        🎬 PROMPT VISUAL GOOGLE FLOW (VEO 2):
                      </span>
                      <p className="font-mono text-xs text-zinc-300">
                        {h.openingVisualPrompt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(`hook-vo-${idx}`, h.openingVerbalScript)}
                      className="text-[11px] font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-white/5 border border-white/5 transition-colors"
                    >
                      {copiedKey === `hook-vo-${idx}` ? "Disalin!" : "Salin Voiceover"}
                    </button>
                    <button
                      onClick={() => copyToClipboard(`hook-v-${idx}`, h.openingVisualPrompt)}
                      className="text-[11px] font-mono text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 transition-colors"
                    >
                      {copiedKey === `hook-v-${idx}` ? "Disalin!" : "Salin Prompt Visual"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shared Body & CTA Bridge */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 backdrop-blur-xl space-y-3">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300">
                <GitBranch className="h-4 w-4" />
                <span>JEMBATAN ISI UTAMA & CTA (DIGUNAKAN UNTUK SEMUA 3 HOOK)</span>
              </span>
              <p className="text-xs font-mono text-zinc-300">
                {resultData.sharedBodyAndCta.bodyTransition}
              </p>
              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-2">
                <p className="font-mono text-xs text-white">
                  <span className="text-indigo-400 font-bold">Isi Naskah:</span> {resultData.sharedBodyAndCta.bodyVerbal}
                </p>
                <p className="font-mono text-xs text-emerald-300">
                  <span className="text-emerald-400 font-bold">CTA:</span> {resultData.sharedBodyAndCta.ctaVerbal}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard("shared-body", `${resultData.sharedBodyAndCta.bodyVerbal}\n\n${resultData.sharedBodyAndCta.ctaVerbal}`)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {copiedKey === "shared-body" ? "Isi & CTA Tersalin!" : "Salin Naskah Isi & CTA Bersama"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

