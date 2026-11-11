"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Camera,
  ArrowLeft,
  Scan,
  Sliders,
  Sun,
  Eye,
  ShieldCheck,
  Palette
} from "lucide-react";

export default function ForensicInspectorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forensicData, setForensicData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setForensicData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInspect = async () => {
    if (!selectedImage) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "forensic-inspector",
          imageBase64: selectedImage,
        }),
      });

      const data = await res.json();
      if (data.cameraAndLens) {
        setForensicData(data);
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
          <Scan className="h-3.5 w-3.5" />
          <span>FORENSIC OPTICAL & LIGHTING SCANNER 2.0</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Visual Forensic Inspector 2.0
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tingkat lanjut reverse-engineering: bedah foto referensi menjadi **Dashboard Spesifikasi Kamera, Blueprint Lighting Rig 3-Point, Palet HEX, dan Vektor Gerak**.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Container */}
        <div
          onClick={() => !selectedImage && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
            selectedImage
              ? "border-white/20 bg-[#0d1017]"
              : "border-white/15 bg-[#0d1017]/80 hover:border-cyan-500/50 cursor-pointer"
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
                  alt="Forensic Target"
                  className="max-h-72 w-auto object-contain"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                  setForensicData(null);
                }}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 underline"
              >
                Ganti Gambar Target
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 mb-4">
                <Scan className="h-7 w-7" />
              </div>
              <p className="font-mono text-sm font-semibold text-white">
                Upload gambar untuk pemindaian forensik optik
              </p>
              <p className="mt-1 text-xs text-zinc-500 font-mono">
                Menganalisis lensa, sensor, pencahayaan 3-point, dan palet HEX
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleInspect}
          disabled={!selectedImage || isLoading}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
            !selectedImage || isLoading
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
              : "studio-btn-primary shadow-cyan-500/20 cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Memindai Spektrum Optik, Sensor, dan Tata Cahaya...</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Jalankan Pemindaian Forensik Visual 2.0</span>
            </>
          )}
        </button>

        {/* Forensic Results Dashboard */}
        {forensicData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 1. Camera & Optics Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Camera className="h-4 w-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  1. ESTIMASI LENSA & SENSOR KAMERA
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="text-zinc-500 block text-[10px] mb-1">FOCAL LENGTH</span>
                  <span className="text-cyan-300 font-bold">{forensicData.cameraAndLens.estimatedLens}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="text-zinc-500 block text-[10px] mb-1">APERTURE / BOKEH</span>
                  <span className="text-zinc-200 font-bold">{forensicData.cameraAndLens.aperture}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="text-zinc-500 block text-[10px] mb-1">SENSOR FORMAT</span>
                  <span className="text-zinc-200 font-bold">{forensicData.cameraAndLens.sensorFormat}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="text-zinc-500 block text-[10px] mb-1">FRAMING RATIO</span>
                  <span className="text-zinc-200 font-bold">{forensicData.cameraAndLens.framing}</span>
                </div>
              </div>
            </div>

            {/* 2. Lighting Rig Blueprint */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Sun className="h-4 w-4 text-amber-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  2. BLUEPRINT TATA CAHAYA (3-POINT LIGHTING RIG)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <span className="text-amber-400 block text-[10px] uppercase font-bold mb-1">KEY LIGHT (UTAMA)</span>
                  <span className="text-zinc-200">{forensicData.lightingRig.keyLight}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <span className="text-cyan-400 block text-[10px] uppercase font-bold mb-1">RIM LIGHT (SEPARATOR)</span>
                  <span className="text-zinc-200">{forensicData.lightingRig.rimLight}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">FILL RATIO</span>
                  <span className="text-zinc-200">{forensicData.lightingRig.fillLight}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">SHADOW DEPTH</span>
                  <span className="text-zinc-200">{forensicData.lightingRig.ambientOcclusion}</span>
                </div>
              </div>
            </div>

            {/* 3. HEX Color Palette */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Palette className="h-4 w-4 text-purple-400" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  3. PALET WARNA DOMINAN (HEX HARMONY)
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {forensicData.hexPalette.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard("hex-" + idx, color.hex)}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors text-left"
                  >
                    <div
                      className="h-8 w-8 rounded-lg border border-white/20 shrink-0 shadow-md"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-mono font-bold text-white block">{color.hex}</span>
                      <span className="text-[10px] font-mono text-zinc-400 line-clamp-1">{color.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Three-Tier Generated Prompts */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#0d1017] p-6 shadow-2xl space-y-4">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>4. HASIL REKONSTRUKSI 3 TINGKATAN PROMPT</span>
              </h3>

              {/* Exact Replica */}
              <div className="rounded-xl border border-white/10 bg-black/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">TIER 1: EXACT 1-TO-1 REPLICA PROMPT</span>
                  <button
                    onClick={() => copyToClipboard("replica", forensicData.prompts.exactReplica)}
                    className="flex items-center gap-1 rounded bg-cyan-500/20 px-2 py-1 text-[11px] font-mono text-cyan-300 hover:bg-cyan-500/30"
                  >
                    {copiedKey === "replica" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "replica" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">{forensicData.prompts.exactReplica}</p>
              </div>

              {/* Commercial Remix */}
              <div className="rounded-xl border border-white/10 bg-black/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-300">TIER 2: LUXURY COMMERCIAL REMIX</span>
                  <button
                    onClick={() => copyToClipboard("remix", forensicData.prompts.commercialRemix)}
                    className="flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-1 text-[11px] font-mono text-indigo-300 hover:bg-indigo-500/30"
                  >
                    {copiedKey === "remix" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "remix" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">{forensicData.prompts.commercialRemix}</p>
              </div>

              {/* Negative Guards */}
              <div className="rounded-xl border border-white/10 bg-black/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">TIER 3: NEGATIVE PROMPT GUARDS</span>
                  <button
                    onClick={() => copyToClipboard("guards", forensicData.prompts.negativeGuards)}
                    className="flex items-center gap-1 rounded bg-rose-500/20 px-2 py-1 text-[11px] font-mono text-rose-300 hover:bg-rose-500/30"
                  >
                    {copiedKey === "guards" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === "guards" ? "Disalin!" : "Salin"}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-zinc-400 leading-relaxed">{forensicData.prompts.negativeGuards}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

