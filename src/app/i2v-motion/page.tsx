"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Camera,
  Film,
  Zap,
  ShieldAlert
} from "lucide-react";

export default function I2VMotionDirectorPage() {
  const [primarySubject, setPrimarySubject] = useState("Wanita duduk santai memegang cangkir kopi di dekat jendela kaca");
  const [desiredAction, setDesiredAction] = useState("Subjek perlahan menoleh ke arah kamera, tersenyum lembut sambil menyesap kopi hangat");
  const [cameraMovement, setCameraMovement] = useState<any>("dolly-in");
  const [physicsDetails, setPhysicsDetails] = useState("Uap kopi mengepul tipis ke atas, rambut halus bergerak ditiup angin sepoi-sepoi, kedipan mata alami");
  const [pacingSpeed, setPacingSpeed] = useState<any>("slow-cinematic");
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desiredAction.trim()) return;

    setIsLoading(true);
    setResultPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "i2v-motion",
          primarySubject,
          desiredAction,
          cameraMovement,
          physicsDetails,
          pacingSpeed,
        }),
      });

      const data = await res.json();
      if (data.prompt) {
        setResultPrompt(data.prompt);
      }
    } catch (err) {
      console.error(err);
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
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-300 mb-2">
          <Play className="h-3.5 w-3.5 fill-emerald-300" />
          <span>I2V MOTION ENGINEERING & ANTI-DEFORMATION</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Image-to-Video (I2V) Motion Director
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ubah foto still dari Imagen 3 atau Midjourney menjadi video bergerak realistis di **Google Veo 2 / Kling** tanpa distorsi wajah meleleh atau objek patah-patah.
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleGenerate} className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              OBJEK / SUBJEK UTAMA PADA FOTO *
            </label>
            <input
              type="text"
              required
              value={primarySubject}
              onChange={(e) => setPrimarySubject(e.target.value)}
              placeholder="Contoh: Model pria mengenakan jam tangan mewah / Botol skincare di atas marmer"
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-emerald-300 mb-1.5 flex items-center justify-between">
              <span>GERAKAN UTAMA YANG DIINGINKAN (ACTION VECTOR) *</span>
              <span className="text-[10px] text-zinc-500 font-normal">Fokus aksi alami tanpa memicu deformasi</span>
            </label>
            <textarea
              rows={2}
              required
              value={desiredAction}
              onChange={(e) => setDesiredAction(e.target.value)}
              placeholder="Contoh: Tangan mengangkat botol ke atas, cairan di dalam botol bergelombang halus dengan pantulan cahaya..."
              className="w-full rounded-xl border border-emerald-500/30 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PERGERAKAN KAMERA (CINEMATIC AXIS)
              </label>
              <select
                value={cameraMovement}
                onChange={(e) => setCameraMovement(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="dolly-in">Slow Push-In Dolly Zoom (Elegan & Intim)</option>
                <option value="dolly-out">Slow Pull-Out Dolly (Mengungkap Lingkungan)</option>
                <option value="orbit-pan">15° Orbital Pan (Efek Parallax 3D Halus)</option>
                <option value="static-subtle">Static Tripod dengan Micro-Breathing</option>
                <option value="fpv-tracking">Dynamic Forward Tracking (Aksi Berkelanjutan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                TEMPO & KECEPATAN GERAK
              </label>
              <select
                value={pacingSpeed}
                onChange={(e) => setPacingSpeed(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="slow-cinematic">Slow Cinematic (Gerakan Lembut 24fps)</option>
                <option value="medium-dynamic">Medium Dynamic (Pacing Iklan Komersial)</option>
                <option value="fast-impact">Fast Impact (Transisi Cepat)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
              DETAIL MIKRO FISIKA (ORGANIC DYNAMICS)
            </label>
            <input
              type="text"
              value={physicsDetails}
              onChange={(e) => setPhysicsDetails(e.target.value)}
              placeholder="Contoh: Hembusan angin pada kain sutra, kedipan mata natural, riak air halus"
              className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !desiredAction.trim()}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-bold transition-all shadow-lg ${
              isLoading || !desiredAction.trim()
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                : "studio-btn-primary shadow-emerald-500/20 cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Menghitung Vektor Gerak Fisika & Proteksi Deformasi...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Rancang Motion Prompt I2V Anti-Deformasi</span>
              </>
            )}
          </button>
        </form>

        {resultPrompt && (
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0d1017] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Naskah Motion I2V Siap Tempel ke Google Veo 2 / Kling
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
                <span>{copied ? "Disalin!" : "Salin Motion Prompt"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs leading-relaxed text-zinc-200 select-all whitespace-pre-wrap max-h-96 overflow-y-auto">
              {resultPrompt}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 gap-2">
              <span>💡 <strong>Cara Pakai:</strong> Upload foto Anda ke Google Veo 2 (Image-to-Video mode), lalu paste prompt ini ke dalam box motion.</span>
              <span className="text-emerald-400 font-bold">Zero-Warping Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
