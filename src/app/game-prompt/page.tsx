"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Gamepad2,
  ArrowLeft
} from "lucide-react";

export default function GamePromptPage() {
  const [theme, setTheme] = useState("Hewan Lucu Petualang");
  const [age, setAge] = useState("Anak Usia 4–7 Tahun");
  const [gameType, setGameType] = useState("Memory Match (Cocokkan Kartu)");
  const [style, setStyle] = useState("Ceria Penuh Warna & Ramah Anak");
  const [extra, setExtra] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "game",
          theme,
          age,
          gameType,
          style,
          extra,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan prompt game.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses prompt game.");
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 mb-2">
          <Gamepad2 className="h-3.5 w-3.5" />
          <span>HTML5 INTERACTIVE MINI-GAME CREATOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Game Interaktif Anak
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Buat prompt game interaktif anak dalam SATU file HTML utuh mandiri (HTML/CSS/JS) siap tempel ke Gemini Canvas, ChatGPT, Claude, atau Lovable.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TEMA GAME
              </label>
              <input
                type="text"
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Contoh: Belajar Berhitung Bersama Dinosaurus"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TARGET USIA
              </label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Balita & PAUD (3–5 Tahun)">PAUD (3–5 Tahun) - Tombol Besar & Ikon</option>
                <option value="Anak Usia 4–7 Tahun">Usia 4–7 Tahun - Interaktif Ringan</option>
                <option value="Anak SD (7–10 Tahun)">SD (7–10 Tahun) - Teka-Teki Logika</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                JENIS GAMEPLAY
              </label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Memory Match (Cocokkan Kartu)">Memory Match (Cocokkan Kartu)</option>
                <option value="Tebak Gambar & Suara">Tebak Gambar & Pilihan Ganda</option>
                <option value="Menangkap Objek Jatuh (Catch Game)">Catch Game (Tangkap Buah Jatuh)</option>
                <option value="Puzzle Susun Gambar">Puzzle Susun Gambar Sederhana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GAYA VISUAL
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Ceria Penuh Warna & Ramah Anak">Ceria Penuh Warna & Ramah Anak</option>
                <option value="Pastel Minimalis Lembut">Pastel Minimalis Lembut</option>
                <option value="Kartun Emoji Lucu">Kartun Emoji Lucu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              INSTRUKSI TAMBAHAN (OPSIONAL)
            </label>
            <input
              type="text"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Contoh: Tambahkan efek suara Web Audio API saat menang"
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !theme.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !theme.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menyusun Prompt Game HTML5...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Prompt Game HTML5</span>
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
                  Prompt Game HTML5 Mandiri
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

            <p className="mt-3 text-[11px] font-mono text-zinc-400">
              🎮 Tempelkan prompt ini ke Gemini Canvas atau Claude Artifacts untuk langsung melihat dan memainkan game di browser tanpa instalasi apa pun!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
