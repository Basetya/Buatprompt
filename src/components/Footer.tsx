import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#050608]">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </div>
              </div>
              <div className="font-mono tracking-wider font-extrabold text-white text-base">
                <span>BUAT</span>
                <span className="text-cyan-300">PROMPT</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400">
              Studio Orkestrasi & Rekayasa Prompt AI Sinematik #1. Menghubungkan visi kreatif kreator ke dalam parameter teknis siap eksekusi di Google Flow (Veo 2 & Imagen 3), Midjourney, dan ekosistem video AI global.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-mono text-indigo-300">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Google Flow Certified Architecture</span>
            </div>
          </div>

          {/* Tools Col 1: Google Flow & Video */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Google Flow & Video Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/google-flow-director" className="text-indigo-300 hover:text-white transition-colors font-semibold">
                  ★ Google Flow Multi-Shot Director
                </Link>
              </li>
              <li>
                <Link href="/prompt-matrix" className="text-cyan-300 hover:text-white transition-colors font-semibold">
                  ★ Universal Prompt Matrix (4 AI)
                </Link>
              </li>
              <li>
                <Link href="/shortsvideo" className="hover:text-cyan-300 transition-colors">
                  Shorts Video Cinematics (Veo)
                </Link>
              </li>
              <li>
                <Link href="/longvideo" className="hover:text-cyan-300 transition-colors">
                  Narrative Long Video Sequencer
                </Link>
              </li>
              <li>
                <Link href="/gambar" className="hover:text-cyan-300 transition-colors">
                  Visual Prompt Foundry (Imagen 3)
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Col 2: Commerce & Growth */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Commerce & Growth
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/viral-hook" className="text-rose-300 hover:text-white transition-colors font-semibold">
                  ★ Viral Hook & Retention Lab
                </Link>
              </li>
              <li>
                <Link href="/storyboard" className="hover:text-cyan-300 transition-colors">
                  Commerce Storyboard (TikTok/Shopee)
                </Link>
              </li>
              <li>
                <Link href="/sales-page" className="hover:text-cyan-300 transition-colors">
                  Sales Copy Architect (16-Section)
                </Link>
              </li>
              <li>
                <Link href="/poster-infografis" className="hover:text-cyan-300 transition-colors">
                  Infografis 20-Poin Studio
                </Link>
              </li>
              <li>
                <Link href="/prompt-optimizer" className="hover:text-cyan-300 transition-colors">
                  Master Prompt Refinery
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Col 3: Interactive Lab */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Creative Lab & Informasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/style-detection" className="hover:text-cyan-300 transition-colors">
                  Style & Lighting Scanner
                </Link>
              </li>
              <li>
                <Link href="/prompt-to-image" className="hover:text-cyan-300 transition-colors">
                  Imagen 3 Visualizer Studio
                </Link>
              </li>
              <li>
                <Link href="/coloring-book-prompt" className="hover:text-cyan-300 transition-colors">
                  Buku Mewarnai Printable PDF
                </Link>
              </li>
              <li>
                <Link href="/game-prompt" className="hover:text-cyan-300 transition-colors">
                  Game Interaktif Canvas HTML5
                </Link>
              </li>
              <li>
                <Link href="#faqs" className="hover:text-cyan-300 transition-colors">
                  FAQ & Panduan Studio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-8 text-xs text-zinc-500 gap-4">
          <p>© 2026 BUATPROMPT STUDIO. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Orchestrated for Next-Gen Video Directors</span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-400">Google Flow Specialist</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
