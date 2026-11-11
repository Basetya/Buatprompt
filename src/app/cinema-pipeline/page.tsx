"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Film,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Clapperboard,
  BookOpen,
  Volume2,
  Camera,
  Play
} from "lucide-react";

export default function CinemaPipelinePage() {
  const [storyTitle, setStoryTitle] = useState("Chronicles of Neo Jakarta 2050");
  const [logline, setLogline] = useState("Seorang mekanik muda menemukan rahasia AI kuno di lorong bawah tanah kota metropolitan");
  const [genre, setGenre] = useState("Sci-Fi Cyberpunk Drama");
  const [protagonist, setProtagonist] = useState("Pria 28 tahun berwajah lelah dengan kacamata HUD transparan dan jaket teknis berdebu");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !logline.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cinema-pipeline",
          storyTitle,
          logline,
          genre,
          protagonist,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
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
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Kembali ke Studio</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono font-medium text-purple-300 mb-2">
          <Clapperboard className="h-3.5 w-3.5" />
          <span>END-TO-END VIDEO PRODUCTION PIPELINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Full Cinema Production Bible
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ubah 1 ide cerita menjadi **Cetak Biru Produksi Video Lengkap**: Kunci Karakter, Shot-by-Shot Table (Prompt Gambar Frame 1, Prompt Gerak Veo, Teks Voiceover, dan Efek Suara).
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                JUDUL PROYEK VIDEO *
              </label>
              <input
                type="text"
                required
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Contoh: The Last Barista of Kyoto"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GENRE & TONE SINEMATIK
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Contoh: Sci-Fi / Luxury Commercial / Thriller / Drama"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              LOGLINE / INTI CERITA (1-2 KALIMAT) *
            </label>
            <textarea
              rows={2}
              required
              value={logline}
              onChange={(e) => setLogline(e.target.value)}
              placeholder="Contoh: Kisah seorang pembuat roti legendaris yang mempertahankan resep leluhurnya di tengah era digital..."
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-purple-300 mb-1.5 flex items-center justify-between">
              <span>DESKRIPSI TOKOH UTAMA (PROTAGONIST ANCHOR)</span>
              <span className="text-[10px] text-zinc-500 font-normal">Kunci visual tokoh di seluruh scene</span>
            </label>
            <input
              type="text"
              value={protagonist}
              onChange={(e) => setProtagonist(e.target.value)}
              placeholder="Contoh: Wanita 25 tahun berkulit sawo matang, rambut dikuncir kuda, celemek kanvas cokelat"
              className="w-full rounded-xl border border-purple-500/30 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !storyTitle.trim() || !logline.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !storyTitle.trim() || !logline.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-purple-500/20 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menyusun Cetak Biru Produksi Lengkap (Shot 1 s/d Climax)...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Full Cinema Production Bible</span>
              </>
            )}
          </button>
        </form>

        {resultPrompt && (
          <div className="rounded-2xl border border-purple-500/30 bg-[#0d1017] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Cetak Biru Produksi Siap Eksekusi (Google Flow Pipeline)
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
                <span>{copied ? "Disalin!" : "Salin Seluruh Naskah Produksi"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/80 p-5 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {resultPrompt}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 gap-2">
              <span>💡 Gunakan Imagen 3 Still Frame Prompt untuk generate foto awal, lalu masukkan ke Veo 2 dengan Motion Prompt yang tersedia!</span>
              <span className="text-purple-400 font-bold">End-to-End Certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

