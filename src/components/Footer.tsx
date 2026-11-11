import Link from "next/link";
import { Search, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07080a] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4f933] text-black font-bold">
                <Search className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="font-mono tracking-wider font-extrabold text-white text-base">
                <span>CARI</span>
                <span className="text-[#d4f933]">PROMPT</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400">
              Platform Reverse-Engineering Prompt AI #1 di Indonesia. Ekstraksi visual gambar dan video menjadi prompt siap pakai untuk Google Flow (Veo & Imagen 3), Midjourney, Kling, dan Sora.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-[#d4f933]">
              <Sparkles className="h-3 w-3" />
              <span>Google Flow Ready</span>
            </div>
          </div>

          {/* Tools Col 1 */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Video & Gambar AI
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/gambar" className="hover:text-[#d4f933] transition-colors">
                  Cari Prompt Gambar (Imagen 3 & Midjourney)
                </Link>
              </li>
              <li>
                <Link href="/shortsvideo" className="hover:text-[#d4f933] transition-colors">
                  Shorts Video Prompt (Google Veo & Kling)
                </Link>
              </li>
              <li>
                <Link href="/longvideo" className="hover:text-[#d4f933] transition-colors">
                  Long Video Cinematic Prompt
                </Link>
              </li>
              <li>
                <Link href="/prompt-to-image" className="hover:text-[#d4f933] transition-colors">
                  Prompt to Image Studio
                </Link>
              </li>
              <li>
                <Link href="/style-detection" className="hover:text-[#d4f933] transition-colors">
                  Style Detection & Synthesizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Col 2 */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Bisnis & Kreatif
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/poster-infografis" className="hover:text-[#d4f933] transition-colors">
                  Poster Infografis 20-Poin
                </Link>
              </li>
              <li>
                <Link href="/sales-page" className="hover:text-[#d4f933] transition-colors">
                  Sales Page Conversion Generator
                </Link>
              </li>
              <li>
                <Link href="/storyboard" className="hover:text-[#d4f933] transition-colors">
                  Storyboard TikTok & Shopee
                </Link>
              </li>
              <li>
                <Link href="/coloring-book-prompt" className="hover:text-[#d4f933] transition-colors">
                  Buku Mewarnai Printable PDF
                </Link>
              </li>
              <li>
                <Link href="/game-prompt" className="hover:text-[#d4f933] transition-colors">
                  Game Interaktif HTML5
                </Link>
              </li>
              <li>
                <Link href="/prompt-optimizer" className="hover:text-[#d4f933] transition-colors">
                  Prompt Optimizer Master
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Info */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-3">
              Informasi & Bantuan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#pricing" className="hover:text-[#d4f933] transition-colors">
                  Paket Harga & Token
                </Link>
              </li>
              <li>
                <Link href="#faqs" className="hover:text-[#d4f933] transition-colors">
                  Pertanyaan Sering Diajukan (FAQ)
                </Link>
              </li>
              <li>
                <a href="mailto:support@cariprompt.com" className="hover:text-[#d4f933] transition-colors">
                  Kontak Tim Dukungan
                </a>
              </li>
              <li>
                <span className="text-zinc-500">API Documentation (Segera)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-8 text-xs text-zinc-500 gap-4">
          <p>© 2026 CARI PROMPT. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Kreator Konten, Sutradara Video & Bisnis Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
