"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Sparkles, Zap, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Bagaimana cara kerja CariPrompt dengan Google Flow (Google Veo & Imagen 3)?",
    a: "CariPrompt secara spesifik dirancang untuk mengekstrak deskripsi visual menjadi bahasa sutradara (director's prompt) alami yang sangat disukai oleh Google Veo dan Imagen 3 di Google Flow. Kami mengekstrak aksi gerakan temporal (subject motion over time), pergerakan kamera (pan, tracking, dolly-in, focal length), pencahayaan (volumetric rim light, softbox), dan tekstur realistis."
  },
  {
    q: "Apakah prompt hasil ekstraksi bisa dipakai di Midjourney, Kling, dan Sora?",
    a: "Tentu saja! Setiap hasil ekstraksi video atau gambar menyertakan prompt dalam format sinematik universal Bahasa Inggris teknis dan Bahasa Indonesia. Anda tinggal menyalin prompt tersebut dan menempelkannya ke Google Flow, Midjourney (--v 6.1), Kling AI, Runway Gen-3, maupun OpenAI Sora."
  },
  {
    q: "Berapa lama proses pembuatan prompt dari video atau gambar?",
    a: "Hanya butuh 3–5 detik! Model AI vision kami langsung membaca frame media yang Anda unggah, membedah style visual, komposisi objek, palet warna, dan menyusun instruksi prompt tingkat lanjut."
  },
  {
    q: "Apakah saya perlu kemampuan prompt engineering yang rumit?",
    a: "Tidak perlu sama sekali! Anda cukup mengunggah gambar/video referensi atau memasukkan data produk sederhana. CariPrompt mengotomatisasi seluruh struktur prompt engineering secara profesional di latar belakang."
  },
  {
    q: "Apa saja 11 tools yang tersedia di platform ini?",
    a: "Cari Prompt Gambar, Shorts Video Prompt, Long Video Prompt, Storyboard Produk (TikTok/Shopee), Poster Infografis 20-Poin, Sales Page Generator, Buku Mewarnai (PDF printable), Game Interaktif (HTML5), Style Detection, Prompt Optimizer, dan Prompt to Image Studio."
  }
];

export default function PricingAndFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="py-16 md:py-24 space-y-20">
      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-medium text-[#d4f933] mb-3">
            <Zap className="h-3.5 w-3.5" />
            <span>PILIHAN PAKET TERBAIK</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
            Harga Fleksibel untuk <span className="text-[#d4f933]">Kreator & Pebisnis</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Mulai gratis sekarang dan tingkatkan paket kapan saja sesuai intensitas produksi konten Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Starter */}
          <div className="rounded-2xl border border-white/10 bg-[#12141a]/60 p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                STARTER
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-extrabold text-white">Rp 0</span>
                <span className="text-xs text-zinc-500">/ selamanya</span>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Cocok untuk eksplorasi dan mencoba kemampuan ekstraksi prompt AI.
              </p>
              <ul className="mt-6 space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>5x Generate Harian</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Akses Cari Prompt Gambar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Format Google Flow & Midjourney</span>
                </li>
              </ul>
            </div>
            <Link
              href="/gambar"
              className="mt-8 flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Coba Sekarang
            </Link>
          </div>

          {/* Pro Creator (Featured) */}
          <div className="relative rounded-2xl border border-[#d4f933] bg-[#141820] p-6 flex flex-col justify-between shadow-2xl shadow-[#d4f933]/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d4f933] px-3 py-0.5 text-[10px] font-mono font-black text-black uppercase tracking-wider">
              PALING POPULER
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#d4f933] uppercase tracking-wider">
                PRO CREATOR
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-extrabold text-white">Rp 49.000</span>
                <span className="text-xs text-zinc-400">/ bulan</span>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Pilihan utama affiliator TikTok Shop, kreator YouTube Shorts, dan video filmmaker.
              </p>
              <ul className="mt-6 space-y-3 text-xs font-mono text-zinc-200">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Akses Seluruh 11 AI Tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Google Flow Veo & Imagen 3 Specialist</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Storyboard TikTok Shop & Shopee</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Poster Infografis 20-Poin & Sales Page</span>
                </li>
              </ul>
            </div>
            <Link
              href="/gambar"
              className="mt-8 flex items-center justify-center rounded-xl bg-[#d4f933] py-2.5 text-xs font-mono font-bold text-black shadow-lg shadow-[#d4f933]/20 hover:bg-[#e2fb5f] transition-all"
            >
              Pilih Paket Pro
            </Link>
          </div>

          {/* Agency */}
          <div className="rounded-2xl border border-white/10 bg-[#12141a]/60 p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                STUDIO & AGENCY
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-extrabold text-white">Rp 129.000</span>
                <span className="text-xs text-zinc-500">/ bulan</span>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Solusi tanpa batas untuk tim agensi dan studio produksi video skala besar.
              </p>
              <ul className="mt-6 space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Unlimited Video & Image Extractions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Prioritas Antrian Pemrosesan Cepat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#d4f933]" />
                  <span>Akses Script HTML5 Game & Printable PDF</span>
                </li>
              </ul>
            </div>
            <Link
              href="/gambar"
              className="mt-8 flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Pilih Agency
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-medium text-[#d4f933] mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>TANYA JAWAB UMUM</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#12141a]/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-mono text-sm font-semibold text-white hover:text-[#d4f933] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs leading-relaxed text-zinc-400 font-sans border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
