"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Flame,
  Video,
  Mic,
  Subtitles,
  Hash,
  Share2,
  CheckCheck
} from "lucide-react";

interface AngleItem {
  angleName: string;
  psychologyHook: string;
  veoPrompt: string;
  elevenLabsVoiceover: string;
  capcutCaptions: string;
  tiktokCaptionAndTags: string;
}

export default function BatchAnglesPage() {
  const [productName, setProductName] = useState("Kopi Arabika Toraja Cold Brew Artisan");
  const [productBenefit, setProductBenefit] = useState("Bikin fokus kerja 10 jam tanpa asam lambung dan tanpa rasa mual");
  const [targetAudience, setTargetAudience] = useState("Freelancer, programmer, dan pekerja remote");
  const [targetPlatform, setTargetPlatform] = useState<"tiktok" | "reels" | "shorts">("tiktok");
  const [isLoading, setIsLoading] = useState(false);
  const [anglesData, setAnglesData] = useState<{ productName: string; angles: AngleItem[] } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productBenefit.trim()) return;

    setIsLoading(true);
    setAnglesData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "batch-angles",
          productName,
          productBenefit,
          targetAudience,
          targetPlatform,
        }),
      });

      const data = await res.json();
      if (data.angles) {
        setAnglesData(data);
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

  const copyAllAnglesBulk = async () => {
    if (!anglesData) return;
    let fullText = `=== BUATPROMPT STUDIO: 5 VIRAL ANGLES CAMPAIGN ===\nPRODUK: ${anglesData.productName}\n\n`;
    anglesData.angles.forEach((angle, idx) => {
      fullText += `--------------------------------------------------\n`;
      fullText += `[${angle.angleName}]\nHook Psikologi: ${angle.psychologyHook}\n\n`;
      fullText += `1. GOOGLE FLOW (VEO 2) PROMPT:\n${angle.veoPrompt}\n\n`;
      fullText += `2. ELEVENLABS VOICEOVER:\n${angle.elevenLabsVoiceover}\n\n`;
      fullText += `3. CAPCUT ON-SCREEN CAPTIONS:\n${angle.capcutCaptions}\n\n`;
      fullText += `4. TIKTOK SEO CAPTION & TAGS:\n${angle.tiktokCaptionAndTags}\n\n`;
    });
    await copyToClipboard("bulk-all", fullText);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
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
          <span>SOLOPRENEUR REMEDY & BATCH MULTIPLIER</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          1-Click Product to 5 Viral Angles
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          Solusi anti-shadowban untuk creator & affiliator. Masukkan 1 produk, dapatkan 5 video script dengan sudut pandang psikologi berbeda lengkap dengan **The Holy Trinity Export** (Veo 2, ElevenLabs, CapCut, TikTok SEO).
        </p>
      </div>

      <div className="space-y-6">
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NAMA PRODUK / BRAND *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Contoh: Kopi Toraja Cold Brew Artisan"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TARGET AUDIENS (OPSIONAL)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Contoh: Freelancer, Mahasiswa Skripsi"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              MANFAAT UTAMA & KEUNGGULAN PRODUK *
            </label>
            <input
              type="text"
              required
              value={productBenefit}
              onChange={(e) => setProductBenefit(e.target.value)}
              placeholder="Contoh: Bikin fokus kerja 10 jam tanpa asam lambung dan tanpa rasa mual"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              PLATFORM TARGET UTAMA
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["tiktok", "reels", "shorts"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTargetPlatform(p)}
                  className={`rounded-xl border py-2 text-xs font-mono font-semibold uppercase transition-colors ${
                    targetPlatform === p
                      ? "border-rose-400 bg-rose-500/20 text-white"
                      : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
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
                <span>MENGHASILKAN 5 SUDUT PANDANG VIRAL...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE 5 VIRAL ANGLES & THE HOLY TRINITY EXPORT</span>
              </>
            )}
          </button>
        </form>

        {/* Results View */}
        {anglesData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Bulk Action Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 backdrop-blur-xl">
              <div>
                <h3 className="font-mono text-lg font-bold text-white">
                  5 Sudut Pandang Konten Selesai Dirancang!
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  1 Produk, 5 angle berbeda untuk mencegah shadowban duplikasi konten TikTok & Reels.
                </p>
              </div>
              <button
                onClick={copyAllAnglesBulk}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 font-mono text-xs font-bold text-white transition-colors shadow-md cursor-pointer shrink-0"
              >
                {copiedKey === "bulk-all" ? (
                  <>
                    <CheckCheck className="h-4 w-4 text-emerald-300" />
                    <span>SEMUA 5 ANGLE TERSALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>SALIN SEMUA 5 ANGLE (BULK)</span>
                  </>
                )}
              </button>
            </div>

            {/* 5 Angle Cards */}
            <div className="space-y-6">
              {anglesData.angles.map((angle, index) => {
                const angleKey = `angle-${index}`;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Angle Title & Psychology */}
                    <div className="border-b border-white/10 pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-rose-400 tracking-wider">
                          {angle.angleName}
                        </span>
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-zinc-400">
                          Angle #{index + 1}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1.5">
                        <span className="text-rose-400 font-semibold font-mono">Hook Psikologi:</span>
                        <span>{angle.psychologyHook}</span>
                      </p>
                    </div>

                    {/* The Holy Trinity 4-Boxes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Box 1: Google Flow (Veo 2) */}
                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300">
                            <Video className="h-3.5 w-3.5 text-indigo-400" />
                            <span>1. GOOGLE FLOW (VEO 2) PROMPT</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${angleKey}-veo`, angle.veoPrompt)}
                            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                          >
                            {copiedKey === `${angleKey}-veo` ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>Copy Prompt</span>
                          </button>
                        </div>
                        <p className="text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 max-h-36 overflow-y-auto">
                          {angle.veoPrompt}
                        </p>
                      </div>

                      {/* Box 2: ElevenLabs Voiceover */}
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
                            <Mic className="h-3.5 w-3.5 text-cyan-400" />
                            <span>2. ELEVENLABS NASKAH SUARA</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${angleKey}-audio`, angle.elevenLabsVoiceover)}
                            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                          >
                            {copiedKey === `${angleKey}-audio` ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>Copy Audio</span>
                          </button>
                        </div>
                        <p className="text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 max-h-36 overflow-y-auto">
                          {angle.elevenLabsVoiceover}
                        </p>
                      </div>

                      {/* Box 3: CapCut On-Screen Captions */}
                      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-300">
                            <Subtitles className="h-3.5 w-3.5 text-yellow-400" />
                            <span>3. CAPCUT TEKS LAYAR (TIMESTAMPS)</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${angleKey}-capcut`, angle.capcutCaptions)}
                            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                          >
                            {copiedKey === `${angleKey}-capcut` ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>Copy Teks</span>
                          </button>
                        </div>
                        <p className="text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 max-h-36 overflow-y-auto">
                          {angle.capcutCaptions}
                        </p>
                      </div>

                      {/* Box 4: TikTok SEO Caption & Tags */}
                      <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-pink-300">
                            <Hash className="h-3.5 w-3.5 text-pink-400" />
                            <span>4. TIKTOK SEO CAPTION & HASHTAGS</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${angleKey}-tiktok`, angle.tiktokCaptionAndTags)}
                            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                          >
                            {copiedKey === `${angleKey}-tiktok` ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>Copy SEO</span>
                          </button>
                        </div>
                        <p className="text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 max-h-36 overflow-y-auto">
                          {angle.tiktokCaptionAndTags}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

