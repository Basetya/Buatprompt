"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";

export default function SalesPageGeneratorPage() {
  const [namaProduk, setNamaProduk] = useState("");
  const [jenisProduk, setJenisProduk] = useState("Produk Fisik / Retail");
  const [tujuan, setTujuan] = useState("Penjualan Langsung (Checkout)");
  const [deskripsi, setDeskripsi] = useState("");
  const [target, setTarget] = useState("");
  const [harga, setHarga] = useState("");
  const [promo, setPromo] = useState("");
  const [cta, setCta] = useState("");
  const [gaya, setGaya] = useState("Modern & Persuasif (AIDA)");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sales-page",
          namaProduk,
          jenisProduk,
          tujuan,
          deskripsi,
          target,
          harga,
          promo,
          cta,
          gaya,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menghasilkan naskah sales page. Silakan coba kembali.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses sales page.");
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
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-400 mb-2">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>HIGH-CONVERSION COPYWRITING ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Sales Page Generator
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ubah info produk dasar Anda menjadi sales page lengkap berorientasi konversi: headline, hook, pain-points, benefits, USP, FAQ hingga penawaran CTA.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#12141a] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NAMA PRODUK / LAYANAN *
              </label>
              <input
                type="text"
                required
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
                placeholder="Contoh: E-Course Mahir Google Flow & Veo"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                JENIS PRODUK
              </label>
              <select
                value={jenisProduk}
                onChange={(e) => setJenisProduk(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Produk Digital / Course">Produk Digital / Course / Template</option>
                <option value="Produk Fisik / Retail">Produk Fisik (Skincare, Fashion, Gadget)</option>
                <option value="Jasa / Agensi Profesional">Jasa Profesional / Konsultan</option>
                <option value="Kuliner / Makanan">Kuliner / Minuman</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TUJUAN SALES PAGE
              </label>
              <select
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Penjualan Langsung (Direct Checkout)">Penjualan Langsung (Direct Checkout)</option>
                <option value="Chat WhatsApp / Konsultasi">Chat WhatsApp / Konsultasi Admin</option>
                <option value="Lead Generation (Download Gratis)">Lead Generation / Formulir Registrasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GAYA COPYWRITING
              </label>
              <select
                value={gaya}
                onChange={(e) => setGaya(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 focus:border-[#d4f933] focus:outline-none"
              >
                <option value="Modern & Persuasif (AIDA)">Modern & Persuasif (AIDA Formula)</option>
                <option value="Solusi Emosional (PAS - Pain Agitate Solve)">Solusi Emosional (PAS Formula)</option>
                <option value="Elegan & Eksklusif">Elegan & Eksklusif (Premium Feel)</option>
                <option value="Direct Urgent Flash Sale">Direct Urgent Flash Sale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              DESKRIPSI SINGKAT & KEUNGGULAN PRODUK
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan apa itu produk, untuk siapa, dan hasil apa yang akan didapatkan pengguna..."
              className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                HARGA NORMAL / CORET
              </label>
              <input
                type="text"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="Contoh: Rp 499.000 jadi Rp 199.000"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PROMO / BONUS KHUSUS
              </label>
              <input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Contoh: Bonus 100 Template Prompt Siap Pakai"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                CALL TO ACTION (CTA)
              </label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="Contoh: Ambil Promo Sekarang"
                className="w-full rounded-xl border border-white/10 bg-[#1a1c24] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-[#d4f933] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !namaProduk.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !namaProduk.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "bg-[#d4f933] text-black hover:bg-[#e2fb5f] shadow-[#d4f933]/20"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menyusun Naskah Sales Page Persuasif...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Naskah Sales Page Lengkap</span>
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
                  Naskah Sales Page Siap Copy-Paste
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

