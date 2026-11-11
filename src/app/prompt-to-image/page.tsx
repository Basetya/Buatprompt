"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Palette,
  ArrowLeft,
  ExternalLink,
  Download
} from "lucide-react";

export default function PromptToImagePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("imagen3");
  const [ratio, setRatio] = useState("1:1");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedCard(null);

    // Simulate generation synthesis & Google Flow Imagen 3 formatting
    setTimeout(() => {
      setGeneratedCard({
        prompt: prompt.trim(),
        model: model === "imagen3" ? "Google Flow (Imagen 3)" : "FLUX.1 High Quality",
        ratio,
        resolution: ratio === "16:9" ? "1920x1080" : ratio === "9:16" ? "1080x1920" : "1024x1024",
        flowCommand: `/generate model:${model} ratio:${ratio} prompt: "${prompt.trim()}, hyper-realistic 8k, award winning commercial lighting, cinematic depth of field"`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-mono font-medium text-fuchsia-400 mb-2">
          <Palette className="h-3.5 w-3.5" />
          <span>TEXT TO IMAGE STUDIO</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Prompt to Image Studio
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ubah deskripsi teks menjadi instruksi gambar AI berkualitas tinggi dengan preset optimal untuk{" "}
          <span className="text-[#d4f933] font-bold">Google Flow (Imagen 3)</span> dan FLUX.1.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              DESKRIPSI GAMBAR YANG INGIN DIBUAT *
            </label>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Secangkir matcha latte hangat dengan foam art daun clover di atas meja kayu kafe estetik, sinar matahari pagi lembut, foto makro 85mm f/1.4"
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                MODEL AI TARGET
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="imagen3">Google Flow (Google Imagen 3) - Default</option>
                <option value="flux">FLUX.1 Schnell / Dev</option>
                <option value="midjourney">Midjourney v6.1 (Photorealism)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                RASIO ASPEK (ASPECT RATIO)
              </label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="1:1">1:1 (Persegi - Instagram Feed / Profil)</option>
                <option value="9:16">9:16 (Vertikal - TikTok, Story, Shorts)</option>
                <option value="16:9">16:9 (Landscape - YouTube, Banner, Web)</option>
                <option value="4:5">4:5 (Portrait - Instagram Post)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !prompt.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menyusun Prompt Google Flow...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Sintesis Prompt Siap Eksekusi</span>
              </>
            )}
          </button>
        </form>

        {generatedCard && (
          <div className="rounded-2xl border border-white/15 bg-[#12141a] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#d4f933]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Instruksi Eksekusi ({generatedCard.model})
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(generatedCard.flowCommand)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-[#d4f933] text-black hover:bg-[#e2fb5f]"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Disalin!" : "Salin Command"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap">
              {generatedCard.flowCommand}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400 pt-2 border-t border-white/5">
              <span>Model: <strong className="text-zinc-200">{generatedCard.model}</strong></span>
              <span>Rasio: <strong className="text-zinc-200">{generatedCard.ratio}</strong></span>
              <span>Resolusi Est: <strong className="text-zinc-200">{generatedCard.resolution}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

