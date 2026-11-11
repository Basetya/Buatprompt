"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  ArrowLeft,
  Printer
} from "lucide-react";

export default function ColoringBookPage() {
  const [theme, setTheme] = useState("Dinosaurus Petualang");
  const [age, setAge] = useState("Balita & PAUD (3–5 Tahun) - Garis Tebal & Objek Besar");
  const [pageCount, setPageCount] = useState("10");
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
          type: "coloring-book",
          theme,
          age,
          pageCount,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan prompt buku mewarnai.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses data.");
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-mono font-medium text-yellow-400 mb-2">
          <BookOpen className="h-3.5 w-3.5" />
          <span>PRINTABLE PDF COLORING BOOK CREATOR</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Buku Mewarnai Anak
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Buat prompt buku mewarnai anak lengkap 10–16 halaman (cover berwarna + sketsa line-art tebal tanpa fill) yang siap cetak atau langsung di-download sebagai PDF KDP.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TEMA BUKU
              </label>
              <input
                type="text"
                required
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Contoh: Hewan Lucu Bawah Laut"
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
                <option value="Balita & PAUD (3–5 Tahun) - Garis Tebal & Objek Besar">
                  PAUD (3–5 Thn) - Garis Tebal
                </option>
                <option value="Anak SD (6–8 Tahun) - Detail Sedang & Menarik">
                  SD (6–8 Thn) - Detail Sedang
                </option>
                <option value="Anak (9–12 Tahun) - Pola Rumit & Menantang">
                  9–12 Thn - Pola Variatif
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                JUMLAH HALAMAN
              </label>
              <select
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="10">10 Halaman (1 Cover + 9 Sketsa)</option>
                <option value="12">12 Halaman (1 Cover + 11 Sketsa)</option>
                <option value="16">16 Halaman (1 Cover + 15 Sketsa)</option>
              </select>
            </div>
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
                <span>Menyusun Prompt Buku Mewarnai...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Prompt Buku Mewarnai PDF</span>
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
                  Prompt Buku Mewarnai Siap Pakai
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
              💡 Salin prompt ini dan paste ke Gemini Canvas, Claude Artifacts, atau ChatGPT untuk langsung mendapatkan file HTML utuh yang bisa dibuka di browser dan disimpan sebagai PDF (Ctrl+P).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
