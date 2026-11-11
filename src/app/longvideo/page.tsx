"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Film,
  ArrowLeft,
  Clapperboard,
  Layers
} from "lucide-react";

export default function LongVideoPromptPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [targetModel, setTargetModel] = useState<string>("veo");
  const [sceneCount, setSceneCount] = useState<string>("3");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedVideo(reader.result as string);
        setResultPrompt(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedVideo) return;
    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vision",
          mediaType: "video",
          imageBase64: selectedVideo,
          targetModel,
          mode: "long",
          sceneCount,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan multi-scene prompt. Silakan coba kembali.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses long video.");
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono font-medium text-blue-400 mb-2">
          <Film className="h-3.5 w-3.5" />
          <span>MULTI-SCENE CINEMATIC EXTRACTOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Long Video Prompt
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ekstraksi scene demi scene dari video durasi panjang menjadi rangkaian prompt sinematik berkelanjutan untuk{" "}
          <span className="text-[#d4f933] font-bold">Google Veo (Flow)</span> dan Runway.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Card */}
        <div
          onClick={() => !selectedVideo && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
            selectedVideo
              ? "border-white/20 bg-[#12141a]"
              : "border-white/15 bg-[#12141a]/60 hover:border-[#d4f933]/50 cursor-pointer"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*,image/*"
            className="hidden"
          />

          {selectedVideo ? (
            <div className="flex flex-col items-center">
              <div className="relative max-h-72 w-auto rounded-xl overflow-hidden border border-white/10 shadow-lg mb-4 bg-black">
                <video
                  src={selectedVideo}
                  controls
                  playsInline
                  className="max-h-72 w-auto object-contain"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVideo(null);
                  setResultPrompt(null);
                }}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 underline"
              >
                Ganti Video
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4">
                <Clapperboard className="h-7 w-7" />
              </div>
              <p className="font-mono text-sm font-semibold text-white">
                Upload video durasi panjang atau klip narasi
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Mendukung MP4, WEBM, MOV hingga 50MB
              </p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="rounded-2xl border border-white/10 bg-[#12141a] p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                TARGET GENERATOR
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetModel("veo")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    targetModel === "veo"
                      ? "border-[#d4f933] bg-[#d4f933]/10 text-[#d4f933]"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Google Veo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetModel("runway")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    targetModel === "runway"
                      ? "border-[#d4f933] bg-[#d4f933]/10 text-[#d4f933]"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Runway Gen-3</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                JUMLAH SCENE BREAKDOWN
              </label>
              <select
                value={sceneCount}
                onChange={(e) => setSceneCount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-2.5 text-xs font-mono text-zinc-200 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="3">3 Scene (Opening, Climax, Closing)</option>
                <option value="4">4 Scene (Hook, Problem, Solution, CTA)</option>
                <option value="5">5 Scene Cinematic Sequence</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedVideo || isLoading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              !selectedVideo || isLoading
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Membedah Timeline & Breakdown Scene Sinematik...</span>
              </>
            ) : (
              <>
                <Layers className="h-4 w-4" />
                <span>Ekstrak Scene-by-Scene Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Results Container */}
        {resultPrompt && (
          <div className="rounded-2xl border border-white/15 bg-[#12141a] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#d4f933]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Hasil Rangkaian Multi-Scene Video Prompt
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

