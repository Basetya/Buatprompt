"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Film,
  Infinity,
  Layers,
  CheckCheck,
  Clapperboard
} from "lucide-react";

export default function FacelessPipelinePage() {
  const [niche, setNiche] = useState<
    "dark-psychology" | "stoic-philosophy" | "historical-mystery" | "sci-fi-lore" | "true-crime"
  >("historical-mystery");
  const [storyTopic, setStoryTopic] = useState("Catatan rahasia ruang bawah tanah Vatikan tentang peradaban sebelum manusia");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTopic.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "faceless-pipeline",
          niche,
          storyTopic,
        }),
      });

      const data = await res.json();
      if (data.acts) {
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

  const copyFullStory = async () => {
    if (!resultData) return;
    let full = `=== BUATPROMPT: FACELESS CASH-COW STORY BIBLE ===\n`;
    full += `Judul: ${resultData.storyTitle}\nNiche: ${resultData.niche} | Skor Retensi: ${resultData.loopRetentionScore}\n\n`;
    resultData.acts.forEach((act: any) => {
      full += `--------------------------------------------------\n`;
      full += `[${act.actName}] (${act.timeRange})\n`;
      full += `Naskah Narasi:\n"${act.narrativeScript}"\n\n`;
      full += `Prompt Visual Google Flow:\n${act.cinematicVisualPrompt}\n\n`;
      full += `Soundscape: ${act.soundscapeVibe}\n\n`;
    });
    await copyToClipboard("full-story", full);
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
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono font-medium text-purple-300 mb-2">
          <Infinity className="h-3.5 w-3.5" />
          <span>INFINITE RETENTION CASH-COW PIPELINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Faceless Cash-Cow Storytelling Pipeline
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Otomatisasi naskah video faceless 60 detik berretensi tinggi untuk YouTube Shorts & TikTok. Dari Loop Hook pembuka, misteri mendalam, hingga twist penutup yang menyambung sempurna ke detik pertama.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NICHE KONTEN FACELESS
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
              >
                <option value="historical-mystery">🏛️ Misteri Sejarah</option>
                <option value="dark-psychology">🧠 Dark Psychology</option>
                <option value="stoic-philosophy">🗿 Filosofi Stoik</option>
                <option value="sci-fi-lore">🚀 Sci-Fi Universe</option>
                <option value="true-crime">🕵️ Kasus Kriminal (True Crime)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TOPIK / PREMIS CERITA *
              </label>
              <input
                type="text"
                required
                value={storyTopic}
                onChange={(e) => setStoryTopic(e.target.value)}
                placeholder="Contoh: Dokumen rahasia perpustakaan kuno Alexandria"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>MERANCANG ALUR RETENSI LOOP 60 DETIK...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE 60-SEC FACELESS STORY BIBLE</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Header with full story copy */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 backdrop-blur-xl">
              <div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                  {resultData.niche} • {resultData.loopRetentionScore}
                </span>
                <h3 className="font-mono text-base font-bold text-white mt-1.5">
                  {resultData.storyTitle}
                </h3>
              </div>
              <button
                onClick={copyFullStory}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 font-mono text-xs font-bold text-white transition-colors shadow-md cursor-pointer shrink-0"
              >
                {copiedKey === "full-story" ? (
                  <>
                    <CheckCheck className="h-4 w-4 text-emerald-300" />
                    <span>SELURUH CERITA TERSALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>SALIN CERITA UTUH (BULK)</span>
                  </>
                )}
              </button>
            </div>

            {/* Acts Accordion / Cards */}
            <div className="space-y-4">
              {resultData.acts.map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-xs font-bold text-purple-300">
                      {act.actName}
                    </span>
                    <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {act.timeRange}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-zinc-400 block mb-1">
                        🎙️ NASKAH BICARA ELEVENLABS:
                      </span>
                      <p className="text-white italic leading-relaxed">
                        "{act.narrativeScript}"
                      </p>
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-zinc-400 block mb-1">
                        🎬 PROMPT VISUAL GOOGLE FLOW (VEO 2 & IMAGEN 3):
                      </span>
                      <p className="text-zinc-300 leading-relaxed">
                        {act.cinematicVisualPrompt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span>🔊 Soundscape: <span className="text-purple-300">{act.soundscapeVibe}</span></span>
                      <button
                        onClick={() => copyToClipboard(`act-prompt-${idx}`, act.cinematicVisualPrompt)}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 transition-colors"
                      >
                        {copiedKey === `act-prompt-${idx}` ? "Disalin!" : "Salin Prompt Visual"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

