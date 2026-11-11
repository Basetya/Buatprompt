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
  Cpu,
  Flame,
  Camera,
  Bot
} from "lucide-react";

export default function UniversalPromptMatrixPage() {
  const [concept, setConcept] = useState("Secangkir matcha latte hangat melayang di atas meja kayu dengan percikan cairan dinamis dan pencahayaan studio");
  const [visualMood, setVisualMood] = useState("Cinematic Hyper-Realistic Commercial");
  const [isLoading, setIsLoading] = useState(false);
  const [matrixData, setMatrixData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setIsLoading(true);
    setMatrixData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prompt-matrix",
          concept,
          visualMood,
        }),
      });

      const data = await res.json();
      if (data.matrix) {
        setMatrixData(data.matrix);
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
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Kembali ke Studio</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300 mb-2">
          <Layers className="h-3.5 w-3.5" />
          <span>SIMULTANEOUS OMNI-ENGINE ADAPTER</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Universal Prompt Matrix
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Masukkan 1 konsep kreatif, dan dapatkan 4 formulasi prompt spesifik untuk masing-masing mesin AI terkemuka secara simultan.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              KONSEP ATAU IDE KREATIF UTAMA *
            </label>
            <textarea
              rows={3}
              required
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Jelaskan objek, tema, aksi, atau produk yang ingin Anda buat..."
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              MOOD & ATMOSFIR VISUAL
            </label>
            <select
              value={visualMood}
              onChange={(e) => setVisualMood(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Cinematic Hyper-Realistic Commercial">Cinematic Commercial (Luxury & High-Definition)</option>
              <option value="Dramatic Chiaroscuro & Neon Glow">Dramatic Chiaroscuro & Neon Glow</option>
              <option value="Warm Natural Golden Hour Documentary">Natural Golden Hour (Warm & Earthy)</option>
              <option value="Futuristic Minimalist Octane 3D">Futuristic Minimalist 3D Render</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !concept.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !concept.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-indigo-500/25 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Mentranslasi Konsep ke 4 Dialek Mesin AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate 4-Engine Prompt Matrix</span>
              </>
            )}
          </button>
        </form>

        {/* 4 Engine Cards Grid */}
        {matrixData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 1. Google Flow Card */}
            <div className="rounded-2xl border border-indigo-500/40 bg-[#0d1017] p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Camera className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white">GOOGLE FLOW (VEO & IMAGEN)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("flow", matrixData.googleFlow)}
                    className="flex items-center gap-1 rounded-md bg-indigo-500/20 px-2 py-1 text-[11px] font-mono text-indigo-300 hover:bg-indigo-500/30"
                  >
                    {copiedKey === "flow" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "flow" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {matrixData.googleFlow}
                </div>
              </div>
              <span className="mt-3 text-[10px] font-mono text-indigo-400">Format: Natural Director-level prose</span>
            </div>

            {/* 2. Midjourney Card */}
            <div className="rounded-2xl border border-cyan-500/40 bg-[#0d1017] p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white">MIDJOURNEY v6.1</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("mj", matrixData.midjourney)}
                    className="flex items-center gap-1 rounded-md bg-cyan-500/20 px-2 py-1 text-[11px] font-mono text-cyan-300 hover:bg-cyan-500/30"
                  >
                    {copiedKey === "mj" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "mj" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {matrixData.midjourney}
                </div>
              </div>
              <span className="mt-3 text-[10px] font-mono text-cyan-400">Format: Parameters (--ar 16:9, --style raw, --v 6.1)</span>
            </div>

            {/* 3. Kling AI / Runway Card */}
            <div className="rounded-2xl border border-emerald-500/40 bg-[#0d1017] p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Flame className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white">KLING AI & RUNWAY GEN-3</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("kling", matrixData.klingAi)}
                    className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-1 text-[11px] font-mono text-emerald-300 hover:bg-emerald-500/30"
                  >
                    {copiedKey === "kling" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "kling" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {matrixData.klingAi}
                </div>
              </div>
              <span className="mt-3 text-[10px] font-mono text-emerald-400">Format: Motion score & camera path tags</span>
            </div>

            {/* 4. Claude & ChatGPT Card */}
            <div className="rounded-2xl border border-purple-500/40 bg-[#0d1017] p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      <Bot className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white">CLAUDE 3.5 & CHATGPT</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("claude", matrixData.claudeGpt)}
                    className="flex items-center gap-1 rounded-md bg-purple-500/20 px-2 py-1 text-[11px] font-mono text-purple-300 hover:bg-purple-500/30"
                  >
                    {copiedKey === "claude" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "claude" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {matrixData.claudeGpt}
                </div>
              </div>
              <span className="mt-3 text-[10px] font-mono text-purple-400">Format: Persona & Creative Brief</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

