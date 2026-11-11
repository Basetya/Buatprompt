import Link from "next/link";
import {
  ArrowRight,
  Video,
  Layers,
  Sparkles,
  CheckCircle2,
  Film,
  Zap,
  Play
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-white/[0.05]">
      {/* Subtle organic studio vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag: Artisan Production Suite */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono font-medium text-zinc-300 mb-6 backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-white font-semibold">BUATPROMPT STUDIO</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">Cinematic Engine & Motion Suite</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Bukan Sekadar Prompt AI. <br className="hidden sm:inline" />
          <span className="text-gradient">
            Studio Orkestrasi Konten & Sutradara Sinematik
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Tinggalkan hasil generik murahan. Bangun video komersial kelas bioskop dengan optik kamera nyata, karakter 100% konsisten di <strong className="text-zinc-200">Google Flow (Veo 2 & Imagen 3)</strong>, naskah audio berjiwa, hingga video Kinetic Motion Graphic instan.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link
            href="/kinetic-motion"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl studio-btn-primary px-6 py-3.5 text-xs font-mono font-bold shadow-lg"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Kinetic Motion Studio</span>
            <span className="bg-emerald-500/20 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ml-1">New</span>
          </Link>
          <Link
            href="/batch-angles"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl studio-btn-accent px-6 py-3.5 text-xs font-mono font-semibold"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>5 Viral Angles Multiplier</span>
          </Link>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
            <span>Zero AI-Slop Guarantees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
            <span>4-Angle Character Anchor</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
            <span>The Holy Trinity Export</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
            <span>In-Browser 9:16 Video Exporter</span>
          </div>
        </div>
      </div>
    </section>
  );
}
