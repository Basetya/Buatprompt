"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  ShieldAlert,
  Layers,
  Eye,
  CheckCheck
} from "lucide-react";

export default function SafeZoneOpticsPage() {
  const [subjectConcept, setSubjectConcept] = useState("Seorang barista sedang menuangkan latte art berbentuk angsa di kafe modern berpencahayaan hangat");
  const [targetPlatform, setTargetPlatform] = useState<"tiktok-9-16" | "reels-9-16" | "shorts-9-16">("tiktok-9-16");
  const [visualAtmosphere, setVisualAtmosphere] = useState("Cinematic commercial photography, warm tungsten lighting, shallow depth of field");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectConcept.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "safe-zone-optics",
          subjectConcept,
          targetPlatform,
          visualAtmosphere,
        }),
      });

      const data = await res.json();
      if (data.safeZoneEngineeredPrompt) {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-300 mb-2">
          <Smartphone className="h-3.5 w-3.5" />
          <span>ANTI-OBSTRUCTION OPTICS ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          TikTok & Reels Safe-Zone Optics Architect
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Kunci komposisi visual 9:16 agar subjek utama dan teks **tidak pernah tertutup** tombol Like/Komentar di kanan atau judul akun & keranjang kuning di bawah.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              KONSEP SUBJEK VISUAL *
            </label>
            <input
              type="text"
              required
              value={subjectConcept}
              onChange={(e) => setSubjectConcept(e.target.value)}
              placeholder="Contoh: Barista menuangkan latte art angsa di cangkir keramik"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TARGET PLATFORM (9:16)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["tiktok-9-16", "reels-9-16", "shorts-9-16"] as const).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setTargetPlatform(plat)}
                    className={`rounded-xl border py-2 text-[11px] font-mono font-semibold uppercase transition-colors ${
                      targetPlatform === plat
                        ? "border-emerald-400 bg-emerald-500/20 text-white"
                        : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {plat.replace("-9-16", "")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                ATMOSFER / LIGHTING THEME
              </label>
              <input
                type="text"
                value={visualAtmosphere}
                onChange={(e) => setVisualAtmosphere(e.target.value)}
                placeholder="Contoh: Cinematic neon cyberpunk / Soft daylight"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>MENGHITUNG ZONA AMAN OPTIK 9:16...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE SAFE-ZONE MASTER PROMPT</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Viewport Visualization Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs font-bold mb-3">
                <ShieldAlert className="h-4 w-4" />
                <span>ALOKASI ZONA AMAN LAYAR HP (SAFE-ZONE ARCHITECTURE)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">ZONA ATAS (10%)</span>
                  <span className="text-emerald-300 font-semibold">{resultData.viewportAllocation.topHeaderMargin}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-zinc-400 block text-[10px]">GOLDEN CENTER (60%)</span>
                  <span className="text-white font-bold">{resultData.viewportAllocation.upperFocalZone}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-zinc-400 block text-[10px]">MARGIN KANAN (15%)</span>
                  <span className="text-cyan-300 font-semibold">{resultData.viewportAllocation.rightInteractionClearance}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-rose-500/30">
                  <span className="text-zinc-400 block text-[10px]">NEGATIVE SPACE BAWAH (25%)</span>
                  <span className="text-rose-300 font-semibold">{resultData.viewportAllocation.bottomNegativeSpace}</span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-zinc-300 mt-3 border-t border-white/10 pt-2">
                ⚠️ <span className="font-semibold text-amber-300">Catatan Anti-Gagal:</span> {resultData.antiObstructionDirective}
              </p>
            </div>

            {/* Generated Master Prompt */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  SAFE-ZONE DIRECTIVE (GOOGLE FLOW & MIDJOURNEY)
                </span>
                <button
                  onClick={() => copyToClipboard("safe-prompt", resultData.safeZoneEngineeredPrompt)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {copiedKey === "safe-prompt" ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-cyan-300" />
                      <span>TERSALIN!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>SALIN PROMPT</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <pre className="font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {resultData.safeZoneEngineeredPrompt}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

