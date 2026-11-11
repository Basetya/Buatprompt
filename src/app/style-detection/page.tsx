"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ArrowLeft,
  Sliders,
  Palette
} from "lucide-react";

export default function StyleDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<number>(90);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedAttrs, setDetectedAttrs] = useState<any | null>(null);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setDetectedAttrs(null);
        setResultPrompt(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "style",
          imageBase64: selectedImage,
          similarity,
        }),
      });

      const data = await res.json();
      if (data.attributes) {
        setDetectedAttrs(data.attributes);
        setResultPrompt(data.prompt);
      }
    } catch (err) {
      console.error(err);
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono font-medium text-purple-400 mb-2">
          <Wand2 className="h-3.5 w-3.5" />
          <span>VISUAL ATTRIBUTE DETECTOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Style Detection
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Deteksi gaya visual, lighting, kamera, palet warna, dan mesin render dari gambar apa pun untuk menghasilkan prompt siap replikasi.
        </p>
      </div>

      <div className="space-y-6">
        <div
          onClick={() => !selectedImage && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
            selectedImage
              ? "border-white/20 bg-[#12141a]"
              : "border-white/15 bg-[#12141a]/60 hover:border-[#d4f933]/50 cursor-pointer"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {selectedImage ? (
            <div className="flex flex-col items-center">
              <div className="relative max-h-72 w-auto rounded-xl overflow-hidden border border-white/10 shadow-lg mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Style Upload"
                  className="max-h-72 w-auto object-contain"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                  setDetectedAttrs(null);
                  setResultPrompt(null);
                }}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 underline"
              >
                Ganti Gambar
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
                <Palette className="h-7 w-7" />
              </div>
              <p className="font-mono text-sm font-semibold text-white">
                Upload gambar untuk dideteksi gaya visualnya
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Mendukung JPG, PNG, WEBP
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="rounded-2xl border border-white/10 bg-[#12141a] p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-2">
              <span>TINGKAT KEMIRIPAN (SIMILARITY)</span>
              <span className="text-[#d4f933] font-bold">{similarity}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              value={similarity}
              onChange={(e) => setSimilarity(Number(e.target.value))}
              className="w-full accent-[#d4f933] cursor-pointer"
            />
          </div>

          <button
            onClick={handleDetect}
            disabled={!selectedImage || isLoading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              !selectedImage || isLoading
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Mendeteksi Lighting & Palette Warna...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Deteksi Visual Style & Hasilkan Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {detectedAttrs && (
          <div className="rounded-2xl border border-white/15 bg-[#12141a] p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#d4f933]" />
              <span>Atribut Visual Terdeteksi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-zinc-500 block text-[10px] mb-1">GAYA UTAMA</span>
                <span className="text-zinc-200 font-semibold">{detectedAttrs.style}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-zinc-500 block text-[10px] mb-1">LIGHTING SETUP</span>
                <span className="text-zinc-200 font-semibold">{detectedAttrs.lighting}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-zinc-500 block text-[10px] mb-1">KAMERA & LENSA</span>
                <span className="text-zinc-200 font-semibold">{detectedAttrs.camera}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="text-zinc-500 block text-[10px] mb-1">MOOD & ATMOSFIR</span>
                <span className="text-zinc-200 font-semibold">{detectedAttrs.mood}</span>
              </div>
            </div>

            {/* Palet Warna */}
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-2">PALET WARNA EKSTRAK:</span>
              <div className="flex items-center gap-3">
                {detectedAttrs.colorPalette?.map((c: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-lg border border-white/20 shadow-md"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-[11px] font-mono text-zinc-300">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reconstructed Prompt */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#d4f933]">
                  PROMPT HASIL REPLIKASI GAYA
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 rounded-lg bg-[#d4f933] px-3 py-1.5 text-xs font-mono font-bold text-black hover:bg-[#e2fb5f]"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Disalin!" : "Salin Prompt"}</span>
                </button>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap">
                {resultPrompt}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
