"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  LayoutGrid,
  ArrowLeft,
  Sliders
} from "lucide-react";

export default function PosterInfografisPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [purpose, setPurpose] = useState("Edukasi & Tips Bermanfaat");
  const [format, setFormat] = useState("Listicle 3–5 Poin Kunci");
  const [style, setStyle] = useState("Vektor Modern 2D Flat & Clean");
  const [ratio, setRatio] = useState("9:16 (Story, Reels, TikTok)");
  const [cta, setCta] = useState("");
  const [credit, setCredit] = useState("");
  const [points, setPoints] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "infografis",
          title,
          subtitle,
          purpose,
          format,
          style,
          ratio,
          cta,
          credit,
          points,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan prompt infografis. Silakan coba kembali.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses data infografis.");
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-400 mb-2">
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>20-POINT INFOGRAPHIC ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Poster Infografis
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Buat prompt poster infografis siap pakai dengan format & struktur layout 20-poin otomatis untuk konten edukasi, marketing, dan UMKM.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                JUDUL (HEADLINE) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: 5 Rahasia Finansial Bebas Hutang"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                SUBJUDUL (OPSIONAL)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Panduan Praktis Khusus Pemula"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TUJUAN KONTEN
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Edukasi & Tips Bermanfaat">Edukasi & Tips Bermanfaat</option>
                <option value="Promosi Produk & Diskon">Promosi Produk / UMKM</option>
                <option value="Engagement & Diskusi">Engagement & Viralitas</option>
                <option value="Branding & Portofolio">Personal / Corporate Branding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                FORMAT LAYOUT
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Listicle 3–5 Poin Kunci">Listicle 3–5 Poin Kunci</option>
                <option value="Perbandingan Sebelum & Sesudah">Perbandingan (Split / Tabel)</option>
                <option value="Product Spotlight Center">Product Spotlight Center</option>
                <option value="Minimal Poster Quote">Minimal Poster Visual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                RASIO ASPEK
              </label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="9:16 (Story, Reels, TikTok)">9:16 (Vertikal Story & Reels)</option>
                <option value="4:5 (Instagram Feed)">4:5 (Instagram Portrait)</option>
                <option value="1:1 (Persegi Square)">1:1 (Persegi Standard)</option>
                <option value="16:9 (Landscape Banner)">16:9 (Landscape Banner)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GAYA VISUAL
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Vektor Modern 2D Flat & Clean">Vektor Modern 2D Flat & Clean</option>
                <option value="3D Isometrik Minimalist">3D Isometrik Modern</option>
                <option value="Bold Typography Minimalist">Bold Typography Minimalist</option>
                <option value="Hand-drawn Playful Illustration">Hand-drawn Playful Doodle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                CALL TO ACTION (CTA)
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="Contoh: Simpan Untuk Nanti / Pesan Sekarang →"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              POIN ISI KHUSUS (OPSIONAL — KOSONGKAN UNTUK AUTO-GENERATE OLEH AI)
            </label>
            <textarea
              rows={3}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Contoh: 1. Catat Pengeluaran, 2. Dana Darurat, 3. Hindari Hutang Konsumtif"
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !title.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menyusun Prompt Struktur Infografis 20-Poin...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Hasilkan Prompt Poster Infografis</span>
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
                  Prompt Infografis Siap Salin
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
