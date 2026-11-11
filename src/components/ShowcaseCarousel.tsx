"use client";

import { useState } from "react";
import { SHOWCASE_ITEMS, ShowcaseItem } from "@/data/showcase";
import {
  Copy,
  Check,
  Play,
  Pause,
  Sparkles,
  Maximize2,
  X,
  ChevronRight,
  Camera,
  Film
} from "lucide-react";

const ENGINE_LABELS: Record<string, string> = {
  "Shorts Video": "GOOGLE VEO 4K",
  "Long Video": "CINEMATIC 60FPS",
  "UGC Affiliate": "COMMERCE CONVERSION",
  "UGC Affliate": "COMMERCE CONVERSION",
  "Poster": "COMMERCIAL VECTOR",
};

export default function ShowcaseCarousel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ShowcaseItem | null>(null);
  const [activePlaying, setActivePlaying] = useState<Record<string, boolean>>({
    [SHOWCASE_ITEMS[0].id]: true
  });

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  const togglePlay = (id: string) => {
    setActivePlaying((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="gallery" className="py-12 md:py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>STUDIO MASTERPIECE GALLERY</span>
            </div>
            <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Karya Orisinil <span className="text-gradient">BuatPrompt Studio</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl">
              Eksplorasi hasil orkestrasi video sinematik dan artwork komersial berkualitas tinggi yang siap langsung dieksekusi di Google Flow (Veo & Imagen 3).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono text-zinc-400">
            <span>Geser untuk melihat rilisan</span>
            <ChevronRight className="h-4 w-4 text-cyan-400" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {SHOWCASE_ITEMS.map((item) => {
            const isCopied = copiedId === item.id;
            const isPlaying = activePlaying[item.id] ?? false;
            const engineTag = ENGINE_LABELS[item.label] || "GOOGLE FLOW DIRECTIVE";

            return (
              <div
                key={item.id}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start rounded-2xl border border-white/10 bg-[#0d1017] overflow-hidden flex flex-col group hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
              >
                {/* Media Container */}
                <div className="relative aspect-[9/13] w-full bg-zinc-950 overflow-hidden">
                  {item.media_type === "video" ? (
                    <video
                      src={item.media_url}
                      className="h-full w-full object-cover"
                      playsInline
                      muted
                      loop
                      autoPlay={isPlaying}
                      onClick={() => togglePlay(item.id)}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.media_url}
                      alt={item.label}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-black/50 pointer-events-none" />

                  {/* Engine Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{engineTag}</span>
                  </div>

                  {/* Expand Modal */}
                  <button
                    onClick={() => setActiveItem(item)}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 hover:bg-indigo-600 hover:text-white transition-colors"
                    title="Buka naskah sutradara"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Play / Pause Toggle */}
                  {item.media_type === "video" && (
                    <button
                      onClick={() => togglePlay(item.id)}
                      className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 backdrop-blur-md text-white border border-white/10 hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white ml-0.5" />}
                    </button>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-white/5 bg-[#0d1017]">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        DIRECTOR PREVIEW
                      </span>
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                        Google Flow Ready
                      </span>
                    </div>
                    <p className="line-clamp-3 text-xs leading-relaxed text-zinc-300 font-mono">
                      {item.prompt}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-mono font-semibold transition-all ${
                        isCopied
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "studio-btn-primary shadow-md shadow-indigo-500/15"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveItem(item)}
                      className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-zinc-300 hover:bg-white/10"
                    >
                      Bedah
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/15 bg-[#0d1017] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Media Column */}
            <div className="relative md:w-1/2 aspect-[9/13] md:aspect-auto bg-black flex items-center justify-center overflow-hidden">
              {activeItem.media_type === "video" ? (
                <video
                  src={activeItem.media_url}
                  className="h-full w-full object-contain max-h-[60vh] md:max-h-full"
                  controls
                  autoPlay
                  playsInline
                  loop
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeItem.media_url}
                  alt={activeItem.label}
                  className="h-full w-full object-contain max-h-[60vh] md:max-h-full"
                />
              )}
            </div>

            {/* Prompt & Info Column */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-indigo-300">
                      {ENGINE_LABELS[activeItem.label] || activeItem.label}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Format: {activeItem.media_type.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-zinc-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-mono text-xs font-bold text-white mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>Naskah Sutradara Siap Eksekusi:</span>
                  </h3>
                  <div className="rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {activeItem.prompt}
                  </div>
                </div>

                <div className="space-y-2 rounded-xl bg-white/5 p-3 text-[11px] font-mono text-zinc-400 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span>Target Engine Utama:</span>
                    <span className="text-cyan-300 font-bold">Google Flow (Veo 2 & Imagen 3)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Multi-Platform Support:</span>
                    <span className="text-zinc-300">Kling AI, Midjourney v6.1, Sora</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleCopy("modal-" + activeItem.id, activeItem.prompt)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-mono font-bold transition-all ${
                    copiedId === "modal-" + activeItem.id
                      ? "bg-emerald-500 text-black shadow-lg"
                      : "studio-btn-primary shadow-lg shadow-indigo-500/20"
                  }`}
                >
                  {copiedId === "modal-" + activeItem.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Prompt Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Salin Naskah Sutradara</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveItem(null)}
                  className="rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-xs font-mono text-zinc-300 hover:bg-white/10"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
