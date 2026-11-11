"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Shield,
  Layers,
  Key
} from "lucide-react";

export default function CharacterBoardPage() {
  const [characterName, setCharacterName] = useState("Elena Vance");
  const [genderAndAge, setGenderAndAge] = useState("Wanita 26 tahun, atletis ramping");
  const [ethnicityOrStyle, setEthnicityOrStyle] = useState("Asia Timur modern / Tech-wear aesthetic");
  const [hairAndFace, setHairAndFace] = useState("Rambut bob hitam lurus berponi asimetris, mata cokelat tajam, rahang tegas");
  const [outfitAndAccessories, setOutfitAndAccessories] = useState("Jaket bomber kulit hitam matte dengan aksen neon cyan di kerah, sarung tangan taktis");
  const [signatureColors, setSignatureColors] = useState("Hitam matte, neon cyan, dan abu-abu arang");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim()) return;

    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "character-board",
          characterName,
          genderAndAge,
          ethnicityOrStyle,
          hairAndFace,
          outfitAndAccessories,
          signatureColors,
        }),
      });

      const data = await res.json();
      if (data.anchorToken) {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-2">
          <Shield className="h-3.5 w-3.5" />
          <span>CONSISTENCY ENGINE & CHARACTER ANCHOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Character & Object Anchor Studio
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Kunci wajah, baju, dan proporsi karakter Anda agar **100% konsisten antar scene video** di Google Flow (Veo 2 & Imagen 3) dan Midjourney v6.1.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NAMA KARAKTER / HERO OBJECT *
              </label>
              <input
                type="text"
                required
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Contoh: Elena Vance / Botol Serum Glow"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PROFIL GENDER & USIA
              </label>
              <input
                type="text"
                value={genderAndAge}
                onChange={(e) => setGenderAndAge(e.target.value)}
                placeholder="Contoh: Pria 30 tahun, atletis tegap"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                ETNISITAS / GAYA VISUAL
              </label>
              <input
                type="text"
                value={ethnicityOrStyle}
                onChange={(e) => setEthnicityOrStyle(e.target.value)}
                placeholder="Contoh: Indonesia Modern / Nordic Casual / Anime Realism"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PALET WARNA KHAS (SIGNATURE COLORS)
              </label>
              <input
                type="text"
                value={signatureColors}
                onChange={(e) => setSignatureColors(e.target.value)}
                placeholder="Contoh: Hitam matte, navy blue, dan gold"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              FITUR WAJAH & GAYA RAMBUT (LOCKED LANDMARKS)
            </label>
            <input
              type="text"
              value={hairAndFace}
              onChange={(e) => setHairAndFace(e.target.value)}
              placeholder="Contoh: Rambut ikal sebahu cokelat tua, kacamata bingkai hitam tipis, tahi lalat di pipi kanan"
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              PAKAIAN & AKSESORI KHAS (LOCKED WARDROBE)
            </label>
            <input
              type="text"
              value={outfitAndAccessories}
              onChange={(e) => setOutfitAndAccessories(e.target.value)}
              placeholder="Contoh: Sweater rajut krem oversized, celana jeans biru pudar, jam tangan kulit cokelat"
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !characterName.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !characterName.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-indigo-500/25 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Mengunci Karakter & Menyusun Turnaround Sheet...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Kunci Karakter & Hasilkan Anchor Token</span>
              </>
            )}
          </button>
        </form>

        {resultData && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Box 1: Master Anchor Token */}
            <div className="rounded-2xl border border-cyan-500/40 bg-[#0d1017] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    LOCKED CHARACTER ANCHOR TOKEN
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard("token", resultData.anchorToken)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                    copiedKey === "token"
                      ? "bg-emerald-500 text-black font-bold"
                      : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30"
                  }`}
                >
                  {copiedKey === "token" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === "token" ? "Disalin!" : "Salin Token"}</span>
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-cyan-200 select-all whitespace-pre-wrap">
                {resultData.anchorToken}
              </div>

              <p className="mt-3 text-[11px] font-mono text-zinc-400">
                💡 <strong>Cara Pakai:</strong> Cukup tempelkan token ini di bagian awal prompt setiap kali Anda membuat scene video baru di Google Flow atau Midjourney. Wajah dan pakaian karakter akan terkunci stabil!
              </p>
            </div>

            {/* Box 2: Turnaround Sheet Prompt */}
            <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1017] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    PROMPT MULTI-ANGLE TURNAROUND SHEET (4 SUDUT)
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard("sheet", resultData.turnaroundSheet)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                    copiedKey === "sheet"
                      ? "bg-emerald-500 text-black font-bold"
                      : "studio-btn-primary shadow-md"
                  }`}
                >
                  {copiedKey === "sheet" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === "sheet" ? "Disalin!" : "Salin Prompt Sheet"}</span>
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-60 overflow-y-auto">
                {resultData.turnaroundSheet}
              </div>
            </div>

            {/* Box 3: Scene Integration Example */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xs text-zinc-300">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">
                CONTOH INTEGRASI DI GOOGLE FLOW (VEO 2 & IMAGEN 3)
              </span>
              <p className="text-zinc-300 leading-relaxed">{resultData.sceneIntegrationExample}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

