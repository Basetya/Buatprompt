"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mic,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Sliders,
  Volume2,
  CheckCheck
} from "lucide-react";

export default function AudioDirectorPage() {
  const [rawScript, setRawScript] = useState(
    "Jangan bilang siapa-siapa ya. Rahasia ini baru kebongkar kemarin setelah gue ngobrol langsung sama suppliernya. Ternyata modal aslinya nggak sampai sepertiga dari harga di mall. Buruan cek sekarang sebelum videonya di-take down!"
  );
  const [toneStyle, setToneStyle] = useState<
    "curious-whisper" | "hyped-excitement" | "warm-storyteller" | "dramatic-suspense" | "luxury-monologue"
  >("curious-whisper");
  const [pacingSpeed, setPacingSpeed] = useState<"relaxed" | "natural" | "punchy-fast">("natural");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawScript.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "audio-director",
          rawScript,
          toneStyle,
          pacingSpeed,
        }),
      });

      const data = await res.json();
      if (data.formattedScriptWithTags) {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300 mb-2">
          <Mic className="h-3.5 w-3.5" />
          <span>ELEVENLABS CADENCE & EMOTION TUNER</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          ElevenLabs Emotion & Audio Director
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ubah teks datar menjadi naskah suara hidup berjiwa manusia. Dilengkapi tag emosi vokal <code className="text-cyan-300">[whisper]</code>, <code className="text-cyan-300">[pause 0.6s]</code>, dan rekomendasi slider ElevenLabs otomatis.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              NASKAH BICARA MENTAH *
            </label>
            <textarea
              required
              rows={4}
              value={rawScript}
              onChange={(e) => setRawScript(e.target.value)}
              placeholder="Tulis naskah yang ingin disuarakan..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GAYA EMOSI VOKAL
              </label>
              <select
                value={toneStyle}
                onChange={(e) => setToneStyle(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
              >
                <option value="curious-whisper">🤫 Conspiratorial Whisper (Bisikan Rahasia)</option>
                <option value="hyped-excitement">⚡ Hyped Excitement (Antusias & Hype)</option>
                <option value="dramatic-suspense">🎭 Dramatic Suspense (Tegang & Serius)</option>
                <option value="luxury-monologue">✨ Luxury Monologue (Elegan & Berwibawa)</option>
                <option value="warm-storyteller">📖 Warm Storyteller (Hangat & Mengalir)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TEMPO KECEPATAN (PACING)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["relaxed", "natural", "punchy-fast"] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPacingSpeed(spd)}
                    className={`rounded-xl border py-2 text-[11px] font-mono font-semibold uppercase transition-colors ${
                      pacingSpeed === spd
                        ? "border-cyan-400 bg-cyan-500/20 text-white"
                        : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {spd === "relaxed" ? "Santai" : spd === "natural" ? "Natural" : "Cepat ⚡"}
                  </button>
                ))}
              </div>
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
                <span>MENYUNTIKKAN EMOSI & CADENCE...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>GENERATE NASKAH ELEVENLABS & SLIDER TUNING</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Slider Settings Recommendation Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold mb-3">
                <Sliders className="h-4 w-4" />
                <span>REKOMENDASI PENGATURAN SLIDER ELEVENLABS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] font-mono text-zinc-400">STABILITY</span>
                  <span className="text-lg font-mono font-bold text-cyan-300">
                    {Math.round(resultData.sliderSettings.stability * 100)}%
                  </span>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] font-mono text-zinc-400">CLARITY</span>
                  <span className="text-lg font-mono font-bold text-indigo-300">
                    {Math.round(resultData.sliderSettings.claritySimilarity * 100)}%
                  </span>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] font-mono text-zinc-400">EXAGGERATION</span>
                  <span className="text-lg font-mono font-bold text-purple-300">
                    {Math.round(resultData.sliderSettings.styleExaggeration * 100)}%
                  </span>
                </div>
                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] font-mono text-zinc-400">SPEAKER BOOST</span>
                  <span className="text-lg font-mono font-bold text-emerald-300">ON ✓</span>
                </div>
              </div>
              <p className="text-[11px] font-mono text-zinc-300 mt-3">{resultData.pacingNotes}</p>
            </div>

            {/* Script with Tags */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  NASKAH DENGAN TAG EMOSI & JEDA DETIK (SIAP PASTE KE ELEVENLABS)
                </span>
                <button
                  onClick={() => copyToClipboard("script-tags", resultData.formattedScriptWithTags)}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {copiedKey === "script-tags" ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-300" />
                      <span>TERSALIN!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>SALIN NASKAH</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <p className="font-mono text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
                  {resultData.formattedScriptWithTags}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

