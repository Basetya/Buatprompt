"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Sparkles, Zap, HelpCircle, ShieldCheck, ArrowRight, Layers } from "lucide-react";

// Sembunyikan pricing sementara untuk akses free internal circle (ganti ke true saat ingin mulai berbayar)
const SHOW_PRICING = false;

const FAQS = [
  {
    q: "Apa itu BuatPrompt Studio dan mengapa berbeda dari AI prompt generator biasa?",
    a: "BuatPrompt adalah Production Studio komprehensif yang ditenagai oleh 29 AI Engine khusus, dirancang dari awal untuk sutradara, kreator konten, dan tim agensi kreatif. Platform biasa umumnya hanya memberikan satu baris teks pasif yang sering menghasilkan video acak atau karakter berubah-ubah. BuatPrompt mengorkestrasi alur produksi sinematik end-to-end: mulai dari dekonstruksi visual video, penjagaan konsistensi karakter & produk, hingga transisi tanpa cacat (*zero-morphing*) antar adegan."
  },
  {
    q: "Bagaimana cara kerja Global Asset Vault & Brand Folders?",
    a: "Global Asset Vault adalah brankas memori terpusat untuk menyimpan Character Sheets, Product Sheets, Voice Profiles, hingga rekaman ruang 360° (Environment). Setiap aset dapat dikelompokkan ke dalam Brand / Project Folder (seperti Skincare, Properti, Kuliner, dll). Anda hanya perlu mendaftarkan aset satu kali, lalu aset tersebut dapat langsung dipanggil secara visual di seluruh 29 engine tanpa perlu mendeskripsikan ulang detailnya."
  },
  {
    q: "Bagaimana BuatPrompt menjaga karakter, produk, dan ruangan tetap konsisten antar scene?",
    a: "Kami menggunakan teknologi Frame Boundary Hand-Off dan Multi-Card Anchor. Frame penutup dari suatu adegan secara otomatis dijadikan acuan spasial dan pencahayaan untuk adegan berikutnya. Ditambah dengan Character Lock di Asset Vault, wajah aktor, pakaian, logo produk, hingga tata letak ruangan tetap 100% konsisten dari detik awal hingga penutup tanpa distorsi (*zero-morphing*)."
  },
  {
    q: "Bagaimana cara kerja fitur Prompt Optimizer 8 Dimensi?",
    a: "Prompt Optimizer di BuatPrompt menganalisis prompt mentah Anda menggunakan 8 dimensi evaluasi terstruktur: Objective Clarity (20%), Context (15%), Task Specification (15%), Output Format (15%), Constraints (10%), Target Audience (10%), Instruction Detail (10%), dan Success Criteria (5%). Sistem akan mengidentifikasi kelemahan, asumsi tersembunyi, dan secara otomatis merekonstruksi prompt Anda agar siap dieksekusi dengan presisi maksimal di LLM dan AI Video generator."
  },
  {
    q: "Model AI video dan image generator apa saja yang didukung oleh BuatPrompt?",
    a: "BuatPrompt mendukung seluruh engine terdepan di industri saat ini, antara lain: Google Veo 2 (Google Flow), OpenAI Sora, Kling AI, Luma Dream Machine, Runway Gen-3, Midjourney v6.1, FLUX.1, dan Imagen 3. Melalui Universal Prompt Matrix, satu konsep kreatif langsung diformulasikan ke dalam sintaks dan dialek teknis masing-masing model secara simultan."
  },
  {
    q: "Apakah BuatPrompt bisa digunakan untuk campaign komersial, affiliate TikTok/Shopee, dan YouTube?",
    a: "Sangat bisa! Kami menyediakan engine khusus seperti UGC Flow Studio (skrip 3-beat TikTok/Shopee), Viral Hook Splitter, Safe-Zone Optics (menjamin elemen visual tidak tertutup tombol like/komen TikTok dan Reels), Audio Director (penyutradaraan emosi suara), hingga Foley Soundscape untuk audio efek yang realistis."
  },
  {
    q: "Apakah BuatPrompt dapat diakses dengan nyaman melalui smartphone (HP) atau tablet?",
    a: "100% Ya! Seluruh arsitektur UI BuatPrompt dibangun dengan prinsip mobile-first. Anda dapat melakukan dekonstruksi video, mengatur folder aset di vault, hingga menyalin prompt sutradara hanya dengan satu sentuhan jari di layar ponsel."
  }
];

export default function PricingAndFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="py-16 md:py-24 space-y-20">
      {/* Pricing Section (Controlled by SHOW_PRICING flag) */}
      {SHOW_PRICING ? (
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
              Akses instan ke seluruh 29 engine tanpa biaya tersembunyi. Tingkatkan skala produksi konten Anda kapan saja.
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
                href="/ugc-flow-studio"
                className="mt-8 flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* Pro Director (Best Value) */}
            <div className="rounded-2xl border-2 border-indigo-500 bg-[#0d1017] p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-black shadow-md">
                Paling Diminati
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  PRO DIRECTOR
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-extrabold text-white">Rp 49.000</span>
                  <span className="text-xs text-zinc-500">/ bulan</span>
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  Untuk kreator mandiri, affiliate creator, dan desainer prompt komersial.
                </p>
                <ul className="mt-6 space-y-3 text-xs font-mono text-zinc-200">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Akses Penuh 29 Engine BuatPrompt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-400" />
                    <span>Global Asset Vault & Brand Folders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-rose-400" />
                    <span>Prompt Optimizer 8 Dimensi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>UGC Flow Studio & Frame Boundary Hand-Off</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/ugc-flow-studio"
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
                href="/ugc-flow-studio"
                className="mt-8 flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Pilih Paket Agency
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* Early Circle Free VIP Pass Banner (Disembunyikan informasi berbayar) */
        <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0d141e] via-[#0d1017] to-[#120f24] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-300 mb-4 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>BETA ACCESS CIRCLE — FREE STUDIO PASS</span>
              </div>
              <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Akses Penuh Seluruh <span className="text-gradient">29 Engine Produksi</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                BuatPrompt Studio saat ini dibuka secara bebas dan gratis untuk lingkaran kreator & mitra terpilih. Nikmati seluruh fitur tingkat lanjut termasuk Global Asset Vault, Prompt Optimizer 8 Dimensi, dan UGC Flow Studio tanpa batasan kuota.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/ugc-flow-studio"
                  className="rounded-xl studio-btn-primary px-6 py-3 text-xs sm:text-sm font-mono font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <span>Mulai Eksekusi Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/asset-vault"
                  className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs sm:text-sm font-mono font-semibold text-zinc-200 transition-colors flex items-center gap-2"
                >
                  <Layers className="h-4 w-4 text-amber-300" />
                  <span>Buka Global Asset Vault</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section id="faqs" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>FAQ & PANDUAN STUDIO</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Pelajari bagaimana ekosistem 29 engine BuatPrompt membantu Anda memproduksi aset visual dan naskah AI berstandar sinematik.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#0d1017] overflow-hidden transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-mono text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed text-zinc-400 font-sans border-t border-white/5 pt-3">
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
