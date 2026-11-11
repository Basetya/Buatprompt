"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Download,
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Sliders,
  Smartphone,
  Video,
  CheckCheck,
  Eye
} from "lucide-react";

export default function KineticMotionPage() {
  const [headlineText, setHeadlineText] = useState("90% ORANG GAGAL KARENA HAL INI");
  const [metricValue, setMetricValue] = useState("+340%");
  const [subText, setSubText] = useState("Bukan karena kurang modal, tapi karena salah eksekusi di detik awal.");
  const [motionStyle, setMotionStyle] = useState<"apple-keynote" | "fintech-alpha" | "cyber-hud" | "stoic-gold">("apple-keynote");
  const [durationSec, setDurationSec] = useState(5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Canvas drawing loop
  useEffect(() => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed internal resolution 720x1280 (HD 9:16)
    const W = 720;
    const H = 1280;
    canvas.width = W;
    canvas.height = H;

    // Embers / particles state
    const particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.2
      });
    }

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const loopTime = elapsed % durationSec;
      const progress = loopTime / durationSec; // 0 to 1

      // 1. Background rendering based on style
      if (motionStyle === "apple-keynote") {
        // Deep matte obsidian with subtle central glow
        ctx.fillStyle = "#090a0f";
        ctx.fillRect(0, 0, W, H);

        const radial = ctx.createRadialGradient(W / 2, H * 0.4, 10, W / 2, H * 0.4, W * 0.7);
        radial.addColorStop(0, "rgba(255, 255, 255, 0.05)");
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, W, H);
      } else if (motionStyle === "fintech-alpha") {
        // FinTech deep navy grid
        ctx.fillStyle = "#070c14";
        ctx.fillRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = "rgba(16, 185, 129, 0.07)";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
      } else if (motionStyle === "cyber-hud") {
        // Cyberpunk dark slate
        ctx.fillStyle = "#080911";
        ctx.fillRect(0, 0, W, H);

        // Scanlines
        ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
        for (let y = 0; y < H; y += 4) {
          ctx.fillRect(0, y, W, 2);
        }
      } else if (motionStyle === "stoic-gold") {
        // Dark Charcoal with warm ambient
        ctx.fillStyle = "#0c0d11";
        ctx.fillRect(0, 0, W, H);

        // Floating gold embers
        particles.forEach((p) => {
          p.y -= p.speed;
          if (p.y < 0) p.y = H;
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * (1 - p.y / H)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 2. Top Badge
      ctx.save();
      ctx.font = "600 20px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("● BUATPROMPT KINETIC", 60, 100);

      if (motionStyle === "cyber-hud") {
        const timecode = `TC 00:0${Math.floor(elapsed)}:${Math.floor((elapsed % 1) * 30).toString().padStart(2, "0")}`;
        ctx.textAlign = "right";
        ctx.fillText(timecode, W - 60, 100);
      }
      ctx.restore();

      // 3. Dynamic Animated Headline (Cubic-bezier scale up)
      const textProgress = Math.min(progress * 2.5, 1);
      // smooth easeOutCubic
      const ease = 1 - Math.pow(1 - textProgress, 3);

      ctx.save();
      ctx.translate(W / 2, H * 0.42);
      ctx.scale(0.94 + ease * 0.06, 0.94 + ease * 0.06);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (motionStyle === "stoic-gold") {
        ctx.font = "bold 52px serif";
        ctx.fillStyle = "#fef3c7";
      } else if (motionStyle === "cyber-hud") {
        ctx.font = "900 48px monospace";
        ctx.fillStyle = "#38bdf8";
      } else {
        ctx.font = "800 52px sans-serif";
        ctx.fillStyle = "#ffffff";
      }

      // Word wrapping for headline
      const words = headlineText.toUpperCase().split(" ");
      let line = "";
      const lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > W - 140 && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      ctx.globalAlpha = Math.min(ease * 1.2, 1);
      const lineHeight = 64;
      const startY = -(lines.length * lineHeight) / 2;
      lines.forEach((l, idx) => {
        ctx.fillText(l.trim(), 0, startY + idx * lineHeight);
      });
      ctx.restore();

      // 4. Dynamic Metric Counter or FinTech Trendline
      if (metricValue.trim()) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.font = "900 68px monospace";

        if (motionStyle === "fintech-alpha") {
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
          ctx.shadowBlur = 20;

          // Animated trendline SVG curve
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 4;
          ctx.beginPath();
          const startGraphY = H * 0.65;
          ctx.moveTo(100, startGraphY);
          const currentGraphX = 100 + (W - 200) * progress;
          const currentGraphY = startGraphY - Math.sin(progress * Math.PI) * 120;
          ctx.quadraticCurveTo(W / 2, startGraphY - 140 * progress, currentGraphX, currentGraphY);
          ctx.stroke();
        } else if (motionStyle === "stoic-gold") {
          ctx.fillStyle = "#f59e0b";
          ctx.shadowColor = "rgba(245, 158, 11, 0.3)";
          ctx.shadowBlur = 15;
        } else {
          ctx.fillStyle = "#38bdf8";
        }

        ctx.fillText(metricValue, W / 2, H * 0.68);
        ctx.restore();
      }

      // 5. Supporting Subtext
      if (subText.trim()) {
        ctx.save();
        ctx.font = "400 24px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";

        // Word wrap subtext
        const subWords = subText.split(" ");
        let subLine = "";
        const subLines = [];
        for (let i = 0; i < subWords.length; i++) {
          const test = subLine + subWords[i] + " ";
          if (ctx.measureText(test).width > W - 180 && i > 0) {
            subLines.push(subLine);
            subLine = subWords[i] + " ";
          } else {
            subLine = test;
          }
        }
        subLines.push(subLine);

        subLines.forEach((sl, idx) => {
          ctx.fillText(sl.trim(), W / 2, H * 0.78 + idx * 34);
        });
        ctx.restore();
      }

      // 6. Bottom Retention Progress Line
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(80, H - 120, W - 160, 6);

      ctx.fillStyle = motionStyle === "fintech-alpha" ? "#10b981" : motionStyle === "stoic-gold" ? "#f59e0b" : "#ffffff";
      ctx.fillRect(80, H - 120, (W - 160) * progress, 6);
      ctx.restore();

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [headlineText, metricValue, subText, motionStyle, durationSec, isPlaying]);

  // In-Browser Native Video Recorder (MediaRecorder API)
  const recordAndDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordProgress(0);
    startTimeRef.current = Date.now(); // reset cycle to frame 0

    // Capture canvas stream at 30fps
    const stream = (canvas as any).captureStream(30);

    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000 // 8 Mbps high quality HD
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kinetic-motion-${motionStyle}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setRecordProgress(100);
    };

    recorder.start();

    // Track recording progress bar
    const totalMs = durationSec * 1000;
    const intervalMs = 100;
    let elapsedMs = 0;

    const timer = setInterval(() => {
      elapsedMs += intervalMs;
      const pct = Math.min(Math.round((elapsedMs / totalMs) * 100), 100);
      setRecordProgress(pct);

      if (elapsedMs >= totalMs) {
        clearInterval(timer);
        recorder.stop();
      }
    }, intervalMs);
  };

  const copyToClipboard = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Kembali ke Studio</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-300 mb-2">
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>IN-BROWSER 9:16 VIDEO EXPORTER (NO SCREEN RECORDER NEEDED)</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Kinetic Motion Graphic Studio & Video Exporter
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          Tinggalkan video teks 2D datar murahan yang menjenuhkan. Rancang motion graphic 9:16 berkelas tinggi (Apple Keynote, FinTech Alpha, Cyber HUD, Stoic Gold), lalu **langsung rekam dan unduh file video .webm/.mp4** dari browser tanpa software screen recorder tambahan!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Motion Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                HEADLINE / HOOK UTAMA (HURUF BESAR) *
              </label>
              <textarea
                rows={2}
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                placeholder="Contoh: 90% ORANG GAGAL KARENA INI"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                  METRIC COUNTER (ANGKA / PERSEN)
                </label>
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  placeholder="Contoh: +340% atau Rp 10.000.000"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                  DURASI SIKLUS (DETIK)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 7, 10].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDurationSec(sec)}
                      className={`rounded-xl border py-2 text-xs font-mono font-semibold transition-colors ${
                        durationSec === sec
                          ? "border-emerald-400 bg-emerald-500/20 text-white"
                          : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                PENJELASAN SUBTEXT (PENDUKUNG)
              </label>
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="Contoh: Bukan karena modal, tapi salah eksekusi."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>

            {/* Motion Style Selection */}
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                PILIH ARSITEKTUR GAYA MOTION GRAPHIC
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: "apple-keynote",
                    name: "Apple Keynote Luxury",
                    desc: "Matte obsidian, tipografi skala cubic-bezier, elegan."
                  },
                  {
                    id: "fintech-alpha",
                    name: "Wall St / FinTech Alpha",
                    desc: "Grafik kurva SVG melesat, live metric counter hijau neon."
                  },
                  {
                    id: "cyber-hud",
                    name: "Cyberpunk Tech HUD",
                    desc: "Garis scanlines, running timecode, border cyan bercahaya."
                  },
                  {
                    id: "stoic-gold",
                    name: "Dark Stoic & Warm Ember",
                    desc: "Partikel debu emas melayang, font serif berwibawa."
                  }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setMotionStyle(st.id as any)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      motionStyle === st.id
                        ? "border-emerald-400 bg-emerald-500/10 text-white shadow-md shadow-emerald-500/10"
                        : "border-white/5 bg-black/30 text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <span className="block font-mono text-xs font-bold text-white mb-0.5">
                      {st.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      {st.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* In-Browser Native Video Download Action */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isRecording}
                onClick={recordAndDownloadVideo}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 font-mono text-sm font-bold text-white shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isRecording ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>MEREKAM CANVAS SECARA NATIVE ({recordProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>REKAM & DOWNLOAD VIDEO 9:16 (HD WEBM/MP4)</span>
                  </>
                )}
              </button>
              <p className="text-[11px] font-mono text-zinc-400 text-center mt-2">
                ⚡ 100% Client-side. Tidak perlu OBS / Screen Record. Video langsung tersimpan di laptop Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: 9:16 Vertical Smartphone Viewport */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/16] rounded-[36px] p-3 bg-[#13151c] border-2 border-white/10 shadow-2xl overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-900 border border-white/10 mr-2" />
              <div className="w-10 h-1 bg-zinc-800 rounded-full" />
            </div>

            {/* The Actual HTML5 Canvas */}
            <div className="w-full h-full rounded-[26px] overflow-hidden relative bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
              />

              {/* Recording Overlay Tag */}
              {isRecording && (
                <div className="absolute top-6 left-4 flex items-center gap-2 bg-rose-500/90 text-white font-mono text-[10px] px-2.5 py-1 rounded-full shadow-lg z-30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC {recordProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 font-mono text-xs text-zinc-400">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>{isPlaying ? "Pause Preview" : "Play Preview"}</span>
            </button>
            <span className="text-zinc-600">|</span>
            <span className="text-[11px] text-zinc-400">Resolusi Render: 720 × 1280 (9:16)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

