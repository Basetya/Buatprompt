"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Clapperboard,
  ArrowLeft,
  ShoppingBag,
  Send
} from "lucide-react";

export default function StoryboardPage() {
  const [productName, setProductName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("Santai & Menghibur (Viral Hook)");
  const [duration, setDuration] = useState("10-15 Detik (TikTok Shop Format)");
  const [platform, setPlatform] = useState<"tiktok" | "shopee" | "instagram">("tiktok");
  const [productNote, setProductNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "storyboard",
          productName,
          targetAudience: targetAudience || "Pengguna media sosial & pembeli online",
          tone,
          duration,
          platform,
          productNote,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan storyboard. Silakan coba kembali.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses storyboard.");
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-mono font-medium text-rose-400 mb-2">
          <Clapperboard className="h-3.5 w-3.5" />
          <span>AFFILIATE VIDEO SCRIPT ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Storyboard Produk
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Buat naskah video 3-beat scene-by-scene terarah (Hook, Demo, CTA) khusus affiliator TikTok Shop & Shopee Video.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Form Card */}
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NAMA PRODUK *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Contoh: Vaseline Lotion / Kopi Kapal Api"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TARGET AUDIENCE
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Contoh: Orang kulit kering / Pecinta kopi creamy"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PLATFORM
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="tiktok">TikTok Shop (Keranjang Kuning)</option>
                <option value="shopee">Shopee Video (Keranjang Oranye)</option>
                <option value="instagram">Instagram Reels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TONE VIDEO
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Santai & Menghibur (Viral Hook)">Santai & Menghibur (Viral Hook)</option>
                <option value="Review Jujur & Solutif (Pain to Gain)">Review Jujur & Solutif</option>
                <option value="Hard Selling Diskon/Promo">Hard Selling Flash Sale</option>
                <option value="Estetik & Sinematik">Estetik & Sinematik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                DURASI VIDEO
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="10-15 Detik (TikTok Format)">10-15 Detik (High Retention)</option>
                <option value="30 Detik (Full Story & Demo)">30 Detik (Full Story)</option>
                <option value="60 Detik (Deep Review)">60 Detik (Deep Review)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              CATATAN PRODUK / POIN KHUSUS (OPSIONAL)
            </label>
            <textarea
              rows={2}
              value={productNote}
              onChange={(e) => setProductNote(e.target.value)}
              placeholder="Contoh: Tekstur ringan tidak lengket, hasil terlihat dalam 5 hari"
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !productName.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !productName.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menyusun Script Storyboard 3-Beat...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Buat Storyboard Affiliasi ({platform.toUpperCase()})</span>
              </>
            )}
          </button>
        </form>

        {/* Results Container */}
        {resultPrompt && (
          <div className="rounded-2xl border border-white/15 bg-[#12141a] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#d4f933]" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Naskah Storyboard Siap Produksi
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
                <span>{copied ? "Disalin!" : "Salin Naskah"}</span>
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
