"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Video,
  ArrowLeft,
  Film,
  Camera,
  Play
} from "lucide-react";

export default function ShortsVideoCinematicsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [targetModel, setTargetModel] = useState<string>("veo");
  const [cameraPreference, setCameraPreference] = useState<string>("auto");
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
          mode: "short",
          cameraPreference,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan prompt video. Silakan coba kembali.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses video.");
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
        <span>Kembali ke Studio</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-300 mb-2">
          <Film className="h-3.5 w-3.5" />
          <span>CINEMATIC SHORTS EXTRACTOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Shorts Video Cinematics
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Urai aksi gerak fisik, pergerakan kamera sinematik, dan tata cahaya dari klip video pendek menjadi instruksi sutradara terstruktur untuk{" "}
          <span className="text-cyan-300 font-bold">Google Flow (Veo 2)</span> dan Kling AI.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Card */}
        <div
          onClick={() => !selectedVideo && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
            selectedVideo
              ? "border-white/20 bg-[#0d1017]"
              : "border-white/15 bg-[#0d1017]/80 hover:border-emerald-500/50 cursor-pointer"
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
              <div className="relative max-h-72 w-auto rounded-xl overflow-hidden border border-white/15 shadow-xl mb-4 bg-black">
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
                Ganti Cuplikan Video
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 mb-4">
                <Film className="h-7 w-7" />
              </div>
              <p className="font-mono text-sm font-semibold text-white">
                Upload video klip pendek atau screenshot frame
              </p>
              <p className="mt-1 text-xs text-zinc-500 font-mono">
                Mendukung MP4, WEBM, MOV hingga 30MB
              </p>
            </div>
          )}
        </div>

        {/* Options Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                TARGET VIDEO ENGINE
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetModel("veo")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    targetModel === "veo"
                      ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Google Veo 2</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetModel("kling")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    targetModel === "kling"
                      ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Kling / Sora</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                PERGERAKAN KAMERA
              </label>
              <select
                value={cameraPreference}
                onChange={(e) => setCameraPreference(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-2.5 text-xs font-mono text-zinc-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="auto">Auto Detect dari Video (Rekomendasi)</option>
                <option value="dolly">Slow Push-in Dolly Zoom</option>
                <option value="orbit">Orbital 360 Degree Pan</option>
                <option value="topdown">Top-Down Overhead Static</option>
                <option value="tracking">Dynamic Tracking / Handheld</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedVideo || isLoading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              !selectedVideo || isLoading
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-indigo-500/20 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Mengekstrak Prompt Sutradara Video (Google Veo)...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Ekstrak Naskah Sinematik Google Veo</span>
              </>
            )}
          </button>
        </div>

        {/* Results Container */}
        {resultPrompt && (
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0d1017] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Hasil Rekonstruksi Prompt Sutradara (Google Veo)
                </h3>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500 text-black font-bold"
                    : "studio-btn-primary shadow-md"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Disalin!" : "Salin Prompt"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-96 overflow-y-auto">
              {resultPrompt}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Dioptimalkan khusus untuk video generator Google Flow (Veo)</span>
              <span className="text-emerald-400 font-bold">Director Grade</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
