"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Sparkles, Zap, HelpCircle, ShieldCheck } from "lucide-react";

const FAQS = [
  {
    q: "Apa yang membuat BuatPrompt jauh lebih unggul dibanding platform pencari prompt biasa?",
    a: "Platform biasa umumnya hanya memberikan teks deskripsi pasif atau tag kata kunci terputus. BuatPrompt adalah studio orkestrasi aktif yang dirancang untuk sutradara dan kreator modern. Kami menyediakan multi-shot scene sequencing dengan Character Anchor (menjaga karakter tetap konsisten antar shot), rancangan audio soundscape sinkron untuk Google Veo, serta Universal Prompt Matrix yang mengonversi satu ide ke dalam 4 dialek mesin AI secara simultan."
  },
  {
    q: "Bagaimana cara kerja integrasi BuatPrompt dengan Google Flow (Google Veo & Imagen 3)?",
    a: "Google Veo 2 dan Imagen 3 di Google Flow bekerja paling optimal dengan deskripsi narasi berbobot sutradara (director's prompt). BuatPrompt menyusun kontinuitas gerak fisik (temporal momentum), pergerakan kamera nyata (35mm anamorphic, dolly-in, orbital pan), pencahayaan studio terkalibrasi, hingga negative prompt guardrails bawaan."
  },
  {
    q: "Apakah prompt untuk Midjourney v6.1 sudah siap pakai dengan parameter resmi?",
    a: "Ya! Universal Prompt Matrix kami otomatis menambahkan parameter teknis Midjourney v6.1 seperti rasio aspek (--ar 16:9), mode rendering (--style raw), dan bobot estetika (--stylize 250) sehingga hasil generate langsung konsisten tanpa perlu penyesuaian manual."
  },
  {
    q: "Mengapa ada fitur panduan Audio dan Soundscape pada video prompt?",
    a: "Generasi terbaru AI video seperti Google Veo 2 dan Sora kini mengintegrasikan pemahaman audio spasial. BuatPrompt menyertakan instruksi foley, room tone, dan tempo musik agar audio latar menyatu sempurna dengan dinamika visual adegan Anda."
  },
  {
    q: "Apakah seluruh 14 tools bisa diakses dari perangkat smartphone (HP)?",
    a: "100% Ya! BuatPrompt dibangun dengan arsitektur mobile-first. Seluruh proses dekonstruksi visual, copy prompt satu klik, hingga preview storyboard dirancang sangat ergonomis di layar ponsel."
  }
];

export default function PricingAndFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="py-16 md:py-24 space-y-20">
      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-3">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>AKSES PRODUKSI STUDIO</span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
            Investasi Terukur untuk <span className="text-gradient">Kreator & Sutradara</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Akses instan ke seluruh 14 engine tanpa biaya tersembunyi. Tingkatkan skala produksi konten Anda kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Creator Pass */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                CREATOR PASS
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-extrabold text-white">Rp 0</span>
                <span className="text-xs text-zinc-500">/ selamanya</span>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Ideal untuk pemula yang ingin mengeksplorasi kekuatan prompt sinematik.
              </p>
              <ul className="mt-6 space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>5x Generate Harian</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Akses Visual Prompt Foundry</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Akses Universal Prompt Matrix</span>
                </li>
              </ul>
            </div>
            <Link
              href="/prompt-matrix"
              className="mt-8 flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Studio Pro Director (Featured) */}
          <div className="relative rounded-2xl border border-indigo-500 bg-[#121622] p-6 flex flex-col justify-between shadow-2xl shadow-indigo-500/15">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-0.5 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
              PILIHAN SUTRADARA
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                STUDIO PRO DIRECTOR
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
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Akses Penuh 14 Engine BuatPrompt</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-400" />
                  <span>Google Flow Multi-Shot Director</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-400" />
                  <span>Viral Hook & Retention Blueprint</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Storyboard Commerce 3-Beat TikTok/Shopee</span>
                </li>
              </ul>
            </div>
            <Link
              href="/google-flow-director"
              className="mt-8 flex items-center justify-center rounded-xl studio-btn-primary py-2.5 text-xs font-mono font-bold shadow-lg shadow-indigo-500/25"
            >
              Buka Akses Pro Director
            </Link>
          </div>

          {/* Agency Unlimited */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                ENTERPRISE AGENCY
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-extrabold text-white">Rp 129.000</span>
                <span className="text-xs text-zinc-500">/ bulan</span>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Untuk agensi kreatif, rumah produksi, dan tim pemasaran skala tinggi.
              </p>
              <ul className="mt-6 space-y-3 text-xs font-mono text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Unlimited Video & Image Orchestrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Prioritas Antrian Pemrosesan Tercepat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Multi-Team License & Export API</span>
                </li>
              </ul>
            </div>
            <Link
              href="/google-flow-director"
              className="mt-8 flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Pilih Paket Agency
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>FAQ & PANDUAN TEKNIS</span>
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
                className="rounded-2xl border border-white/10 bg-[#0d1017] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-mono text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
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
