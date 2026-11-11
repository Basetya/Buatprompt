"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Wand2,
  Zap
} from "lucide-react";

export default function PromptOptimizerPage() {
  const [rawPrompt, setRawPrompt] = useState("");
  const [targetAi, setTargetAi] = useState("Google Gemini & ChatGPT");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPrompt.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "optimizer",
          rawPrompt,
          targetAi,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal mengoptimalkan prompt.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses prompt.");
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
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-mono font-medium text-teal-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PROMPT UPGRADE & REFINERY</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Prompt Optimizer
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Masukkan prompt sederhana, AI akan menganalisis kualitasnya lalu mengubahnya menjadi instruksi profesional bertingkat tinggi siap pakai di Gemini, ChatGPT, Claude, dan Google Flow.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleOptimize} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              PROMPT SEDERHANA KAMU *
            </label>
            <textarea
              rows={4}
              required
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              placeholder="Contoh: Buatkan saya ide konten TikTok untuk jualan baju gamis anak"
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              TARGET AI MODEL
            </label>
            <select
              value={targetAi}
              onChange={(e) => setTargetAi(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
            >
              <option value="Google Gemini & Google Flow">Google Gemini & Google Flow</option>
              <option value="ChatGPT (GPT-4o)">ChatGPT (OpenAI GPT-4o)</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="Midjourney & Generative Image">Midjourney v6.1 & Imagen 3</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !rawPrompt.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !rawPrompt.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menganalisis & Mengoptimalkan Struktur Prompt...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Optimalkan Prompt Jadi Standar Profesional</span>
              </>
            )}
          </button>
        </form>

        {resultPrompt && (
          <div className="rounded-2xl border border-white/15 bg-[#12141a] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#d4f933]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Hasil Prompt Teroptimasi (Production Ready)
                </h3>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-[#d4f933] text-black hover:bg-[#e2fb5f]"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Disalin!" : "Salin Prompt"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap">
              {resultPrompt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

