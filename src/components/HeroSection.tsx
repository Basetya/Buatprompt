import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Cpu
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] bg-[#d4f933]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[200px] h-[200px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono font-medium text-zinc-300 mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-[#d4f933] animate-ping" />
          <span className="text-[#d4f933] font-bold">NEW:</span>
          <span>Google Flow (Veo & Imagen 3) Engine Integrated</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Ubah Gambar & Video Menjadi <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4f933] via-lime-300 to-cyan-400">
            Prompt AI Sinematik Presisi
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Unggah media apa pun dan dapatkan prompt teknis siap pakai untuk{" "}
          <span className="text-[#d4f933] font-semibold">Google Flow (Veo & Imagen 3)</span>, Kling, Midjourney, Sora, hingga naskah storyboard affiliasi TikTok Shop.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link
            href="/shortsvideo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#d4f933] px-6 py-3.5 text-sm font-mono font-bold text-black shadow-lg shadow-[#d4f933]/25 hover:bg-[#e2fb5f] hover:scale-105 transition-all"
          >
            <Video className="h-4 w-4" />
            <span>Ekstrak Video (Veo)</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
          <Link
            href="/gambar"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-mono font-semibold text-white hover:bg-white/10 hover:border-white/25 transition-all"
          >
            <ImageIcon className="h-4 w-4 text-[#d4f933]" />
            <span>Cari Prompt Gambar</span>
          </Link>
        </div>

        {/* Feature Highlights Pill Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#d4f933]" />
            <span>Google Flow (Veo) Director Prompts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#d4f933]" />
            <span>Midjourney v6.1 & Imagen 3 Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#d4f933]" />
            <span>11 Generator Kreatif Terintegrasi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
