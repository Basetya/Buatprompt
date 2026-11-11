"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Sliders,
  Volume2,
  Film,
  Camera,
  Layers
} from "lucide-react";

export default function GoogleFlowDirectorPage() {
  const [projectName, setProjectName] = useState("Cyberpunk Midnight Pursuit");
  const [genre, setGenre] = useState("cinematic");
  const [characterAnchor, setCharacterAnchor] = useState("Young Asian female courier with metallic arm, wearing sleek neon-trimmed leather jacket");
  const [setting, setSetting] = useState("Rain-soaked futuristic alleyway with holographic billboards reflecting on wet asphalt");
  const [lightingTheme, setLightingTheme] = useState("Moody chiaroscuro with cyan & magenta neon rim glows");
  const [pacing, setPacing] = useState("Dynamic Acceleration (Slow build to high kinetic climax)");
  const [includeAudio, setIncludeAudio] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "google-flow-director",
          projectName,
          genre,
          characterAnchor,
          setting,
          lightingTheme,
          pacing,
          includeAudio,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      } else {
        setResultPrompt("Gagal menyusun master directive.");
      }
    } catch (err) {
      console.error(err);
      setResultPrompt("Terjadi kesalahan saat memproses data.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!resultPrompt) return;
    await navigator.clipboard.writeText(resultPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Kembali ke Studio</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-2">
          <Video className="h-3.5 w-3.5" />
          <span>EXCLUSIVE GOOGLE FLOW (VEO 2) STUDIO</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Google Flow Multi-Shot Director
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Rancang sekuens video 3-shot terkoordinasi dengan konsistensi karakter, pacing kamera sinematik, negative prompt guards, dan rancangan soundscape audio tersinkronisasi.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                NAMA PROYEK / JUDUL ADEGAN *
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Contoh: Coffee Commercial 4K Master"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                GENRE VISUAL
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="cinematic">Cinematic High-Budget Drama</option>
                <option value="commercial">Luxury Commercial / Product Spot</option>
                <option value="cyberpunk">Cyberpunk / Sci-Fi Futurism</option>
                <option value="documentary">National Geographic Documentary</option>
                <option value="vlog">Authentic Cinematic Travel Vlog</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-indigo-300 mb-1.5 flex items-center justify-between">
              <span>CHARACTER / SUBJECT ANCHOR (KUNCI KONSISTENSI FISIK)</span>
              <span className="text-[10px] text-zinc-500 font-normal">Menjaga objek/karakter konsisten antar shot</span>
            </label>
            <input
              type="text"
              value={characterAnchor}
              onChange={(e) => setCharacterAnchor(e.target.value)}
              placeholder="Contoh: Model pria Asia mengenakan setelan jas linen krem dan jam tangan perak vintage"
              className="w-full rounded-xl border border-indigo-500/30 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                SETTING & ENVIRONMENT
              </label>
              <input
                type="text"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                placeholder="Contoh: Bar kopi kayu minimalis dengan jendela kaca embun"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TATA CAHAYA (LIGHTING THEME)
              </label>
              <input
                type="text"
                value={lightingTheme}
                onChange={(e) => setLightingTheme(e.target.value)}
                placeholder="Contoh: Golden hour rim light dengan pantulan spekular lembut"
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PACING GERAKAN KAMERA
              </label>
              <select
                value={pacing}
                onChange={(e) => setPacing(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Dynamic Acceleration (Slow build to high kinetic climax)">
                  Dynamic Acceleration (Slow build ke Climax)
                </option>
                <option value="Ultra-Smooth Gliding (Elegant & Slow)">
                  Ultra-Smooth Gliding (Elegan & Tenang)
                </option>
                <option value="Fast Kinetic Shaky POV">
                  Kinetic Fast Pace (Aksi Cepat & Intensif)
                </option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4 sm:pt-0">
              <input
                type="checkbox"
                id="audioToggle"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-500 cursor-pointer"
              />
              <label htmlFor="audioToggle" className="text-xs font-mono text-zinc-300 cursor-pointer flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-indigo-400" />
                <span>Sertakan Soundscape & Audio Prompt Veo 2</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !projectName.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !projectName.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-indigo-500/25 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Mengorkestrasi Multi-Shot Master Directive...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Rancang Multi-Shot Master Directive (Google Flow)</span>
              </>
            )}
          </button>
        </form>

        {resultPrompt && (
          <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1017] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Master Directive Siap Pakai di Google Flow (Veo 2)
                </h3>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500 text-black font-bold"
                    : "studio-btn-primary shadow-md"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Disalin!" : "Salin Seluruh Naskah"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-96 overflow-y-auto">
              {resultPrompt}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 gap-2">
              <span>💡 Tempelkan langsung ke Google Flow prompt box untuk generate sekuens video profesional.</span>
              <span className="text-indigo-400 font-bold">4K 24fps Director Grade</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

