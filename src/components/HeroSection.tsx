import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Video,
  Layers,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Clapperboard,
  Cpu
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[250px] h-[250px] bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-zinc-300 mb-6 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold">BUATPROMPT STUDIO:</span>
          <span>Google Flow (Veo 2 & Imagen 3) Engine Suite</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Bukan Sekadar Mencari Prompt. <br className="hidden sm:inline" />
          <span className="text-gradient">
            Rancang & Orkestrasi Video AI Sinematik Kelas Atas
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base lg:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Platform orkestrasi instruksi AI profesional untuk kreator video komersial dan filmmaker. Ditenagai secara khusus untuk ekosistem{" "}
          <strong className="text-indigo-300">Google Flow (Veo 2 & Imagen 3)</strong>, Midjourney v6.1, Kling AI, dan video commerce berkonversi tinggi.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
          <Link
            href="/google-flow-director"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl studio-btn-primary px-6 py-3.5 text-sm font-mono font-bold shadow-xl shadow-indigo-500/20"
          >
            <Video className="h-4 w-4" />
            <span>Google Flow Director</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
          <Link
            href="/prompt-matrix"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-3.5 text-sm font-mono font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <Layers className="h-4 w-4" />
            <span>Universal Prompt Matrix</span>
          </Link>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>Multi-Shot Character Anchoring</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>Simultaneous 4-Engine Matrix</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-rose-400" />
            <span>Viral Hook & Retention Blueprint</span>
          </div>
        </div>
      </div>
    </section>
  );
}
