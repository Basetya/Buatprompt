"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Volume2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Music,
  Clock,
  Radio,
  CheckCheck
} from "lucide-react";

export default function FoleySoundscapePage() {
  const [videoDuration, setVideoDuration] = useState<"15s" | "30s" | "60s">("15s");
  const [videoTheme, setVideoTheme] = useState("Iklan komersial luxury perfume dengan tetesan air makro dan botol kristal");
  const [musicEnergy, setMusicEnergy] = useState<
    "high-energy-phonk" | "dark-ambient-drone" | "cinematic-orchestral" | "upbeat-commercial-pop"
  >("high-energy-phonk");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTheme.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "foley-soundscape",
          videoDuration,
          videoTheme,
          musicEnergy,
        }),
      });

      const data = await res.json();
      if (data.cues) {
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

  const copyFullSheet = async () => {
    if (!resultData) return;
    let full = `=== CAPCUT FOLEY & SFX CUE-SHEET ===\n`;
    full += `BGM: ${resultData.bgmRecommendation.genre} (${resultData.bgmRecommendation.targetBpm})\n`;
    full += `Ducking: ${resultData.bgmRecommendation.duckingAdvice}\n\n`;
    full += `TIMELINE SFX CUE LIST:\n`;
    resultData.cues.forEach((c: any) => {
      full += `[${c.timestamp}] [${c.category}] ${c.soundName}\n`;
      full += `Keyword CapCut: "${c.searchKeyword}" | Trigger: ${c.actionTrigger}\n\n`;
    });
    await copyToClipboard("full-sheet", full);
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
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-2">
          <Volume2 className="h-3.5 w-3.5" />
          <span>CAPCUT SFX & SOUNDSCAPE ARCHITECT</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Soundscape & Foley Cue-Sheet
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Solusi video AI bisu: cue sheet sound effect (SFX) detik demi detik untuk CapCut, lengkap dengan keyword pencarian dan aturan audio ducking volume musik latar.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              KONSEP / TEMA VISUAL VIDEO *
            </label>
            <input
              type="text"
              required
              value={videoTheme}
              onChange={(e) => setVideoTheme(e.target.value)}
              placeholder="Contoh: Iklan parfum botol kristal dengan percikan air lambat"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                DURASI VIDEO
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["15s", "30s", "60s"] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setVideoDuration(dur)}
                    className={`rounded-xl border py-2 text-xs font-mono font-semibold uppercase transition-colors ${
                      videoDuration === dur
                        ? "border-indigo-400 bg-indigo-500/20 text-white"
                        : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GAYA ENERGI MUSIK (BGM)
              </label>
              <select
                value={musicEnergy}
                onChange={(e) => setMusicEnergy(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-indigo-400 focus:outline-none font-mono"
              >
                <option value="high-energy-phonk">🔥 High Energy Phonk (130-138 BPM)</option>
                <option value="dark-ambient-drone">🌑 Dark Ambient Drone (Misterius)</option>
                <option value="cinematic-orchestral">🎻 Cinematic Orchestral (Megah)</option>
                <option value="upbeat-commercial-pop">🎧 Upbeat Commercial Pop (Segar)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 font-mono text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>MERANCANG FOLEY & SFX TIMELINE...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE FOLEY CUE-SHEET & BGM GUIDE</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* BGM Recommendation */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300">
                  <Music className="h-4 w-4 text-indigo-400" />
                  <span>PANDUAN BACKGROUND MUSIC (BGM) & DUCKING</span>
                </span>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  {resultData.bgmRecommendation.targetBpm}
                </span>
              </div>
              <h3 className="font-mono text-sm font-bold text-white">
                {resultData.bgmRecommendation.genre}
              </h3>
              <p className="text-xs font-mono text-zinc-300 mt-1">
                {resultData.bgmRecommendation.duckingAdvice}
              </p>
            </div>

            {/* Cue Sheet Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-indigo-400">
                  DAFTAR TIMELINE SFX UNTUK CAPCUT / PREMIERE
                </span>
                <button
                  onClick={copyFullSheet}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {copiedKey === "full-sheet" ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-300" />
                      <span>TERSALIN!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>SALIN SEMUA CUE</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {resultData.cues.map((cue: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                        {cue.timestamp}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">
                            {cue.soundName}
                          </span>
                          <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400">
                            {cue.category}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                          Cari di CapCut: <span className="text-amber-300 font-semibold">"{cue.searchKeyword}"</span> • {cue.actionTrigger}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(`cue-${idx}`, cue.searchKeyword)}
                      className="text-[11px] font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-white/5 border border-white/5 transition-colors self-end sm:self-center"
                    >
                      {copiedKey === `cue-${idx}` ? "Disalin!" : "Salin Keyword"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

