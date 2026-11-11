"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  ArrowLeft,
  Sliders,
  Camera
} from "lucide-react";

export default function VisualPromptFoundryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [targetModel, setTargetModel] = useState<string>("imagen3");
  const [language, setLanguage] = useState<string>("id");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultPrompt(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultPrompt(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vision",
          mediaType: "image",
          imageBase64: selectedImage,
          targetModel,
          language,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal mendekonstruksi visual. Silakan coba kembali.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses gambar.");
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
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-300 mb-2">
          <Camera className="h-3.5 w-3.5" />
          <span>OPTICAL & LIGHTING DECONSTRUCTOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Visual Prompt Foundry
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Bedah gambar referensi menjadi parameter optik nyata (focal length, aperture, lighting rig, sensor digital, dan palet warna) siap eksekusi di{" "}
          <span className="text-cyan-300 font-bold">Google Flow (Imagen 3)</span> dan Midjourney v6.1.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Card */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !selectedImage && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
            selectedImage
              ? "border-white/20 bg-[#0d1017]"
              : "border-white/15 bg-[#0d1017]/80 hover:border-indigo-500/50 cursor-pointer"
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
              <div className="relative max-h-72 w-auto rounded-xl overflow-hidden border border-white/15 shadow-xl mb-4 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Uploaded Preview"
                  className="max-h-72 w-auto object-contain"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                  setResultPrompt(null);
                }}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 underline"
              >
                Ganti Gambar Referensi
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400 mb-4">
                <Upload className="h-7 w-7" />
              </div>
              <p className="font-mono text-sm font-semibold text-white">
                Upload atau drop foto referensi di sini
              </p>
              <p className="mt-1 text-xs text-zinc-500 font-mono">
                Mendukung JPG, PNG, WEBP resolusi tinggi hingga 25MB
              </p>
            </div>
          )}
        </div>

        {/* Options Bar */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                TARGET ENGINE (OPTIMIZED)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetModel("imagen3")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    targetModel === "imagen3"
                      ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Google Flow</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetModel("midjourney")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    targetModel === "midjourney"
                      ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Midjourney v6.1</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                BAHASA & STRUKTUR
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("id")}
                  className={`rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    language === "id"
                      ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  Indonesia + English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-xl p-2.5 text-xs font-mono font-semibold border transition-all ${
                    language === "en"
                      ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  Pure English Optics
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedImage || isLoading}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              !selectedImage || isLoading
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-indigo-500/20 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Mendekonstruksi Lensa, Lighting & Tekstur...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Dekomposisi Visual ke Prompt ({targetModel === "imagen3" ? "Google Flow" : "Midjourney"})</span>
              </>
            )}
          </button>
        </div>

        {/* Results Container */}
        {resultPrompt && (
          <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1017] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Hasil Dekonstruksi Optik & Gaya
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
              <span>Siap digunakan di Google Flow Imagen 3, Midjourney v6.1 & FLUX</span>
              <span className="text-cyan-400 font-bold">100% Fidelity</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
