import Link from "next/link";
import { ALL_TOOLS } from "@/data/tools";
import {
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  Video,
  Film,
  Clapperboard,
  LayoutGrid,
  ShoppingBag,
  BookOpen,
  Wand2,
  Gamepad2,
  Palette
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Image: ImageIcon,
  Video: Video,
  Film: Film,
  Clapperboard: Clapperboard,
  LayoutGrid: LayoutGrid,
  ShoppingBag: ShoppingBag,
  BookOpen: BookOpen,
  Wand2: Wand2,
  Gamepad2: Gamepad2,
  Sparkles: Sparkles,
  Palette: Palette,
};

export default function ToolCardsGrid() {
  return (
    <section id="tools" className="py-12 md:py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-medium text-[#d4f933] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>11 REVOLUTIONARY AI PROMPT TOOLS</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Semua Generator Prompt <br className="hidden sm:block" />
            <span className="text-[#d4f933]">Dalam Satu Tempat</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Dari video sinematik Google Veo, iklan produk TikTok Shop, infografis 20-poin, hingga game HTML5 interaktif. Pilih tool yang Anda butuhkan dan biarkan AI bekerja.
          </p>
        </div>

        {/* 11 Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL_TOOLS.map((tool) => {
            const IconComp = ICON_MAP[tool.icon] || Sparkles;

            return (
              <div
                key={tool.id}
                className="relative rounded-2xl border border-white/10 bg-[#12141a]/80 p-6 flex flex-col justify-between group hover:border-[#d4f933]/40 hover:bg-[#14171f] transition-all duration-300 shadow-lg hover:shadow-[#d4f933]/5"
              >
                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.iconBg} ${tool.color} border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    {tool.badge && (
                      <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#d4f933]">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Tool Key */}
                  <h3 className="font-mono text-base font-bold text-white group-hover:text-[#d4f933] transition-colors">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {tool.description}
                  </p>

                  {/* Sample chips */}
                  {tool.samples && tool.samples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                        Contoh Kegunaan:
                      </span>
                      {tool.samples.map((sample, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                          <span className="h-1 w-1 rounded-full bg-[#d4f933]" />
                          <span className="line-clamp-1">{sample}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <Link
                    href={tool.path}
                    className="flex items-center justify-between w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-mono font-semibold text-zinc-200 group-hover:bg-[#d4f933] group-hover:text-black group-hover:border-[#d4f933] transition-all duration-200"
                  >
                    <span>Buka Tool</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
