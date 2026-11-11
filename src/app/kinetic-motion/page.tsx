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
  Eye,
  Film,
  Layers,
  Wand2
} from "lucide-react";

interface StoryScene {
  sceneNumber: number;
  stageName: string;
  timeRange: string;
  headline: string;
  subtext: string;
  metric: string;
  highlightKeyword: string;
  durationSec: number;
}

const DEFAULT_SCENES: StoryScene[] = [
  {
    sceneNumber: 1,
    stageName: "THE SHOCK HOOK",
    timeRange: "0:00 - 0:06",
    headline: "KENAPA GAJI SELALU HABIS DI TANGGAL 10?",
    subtext: "Hampir semua orang salah paham sebelum nonton video ini sampai habis.",
    metric: "STOP! 🛑",
    highlightKeyword: "HABIS",
    durationSec: 6
  },
  {
    sceneNumber: 2,
    stageName: "THE PAIN AGITATION",
    timeRange: "0:06 - 0:13",
    headline: "BUKAN KARENA GAYA HIDUP KAMU MEWAH",
    subtext: "Tapi karena sistem keuanganmu bocor halus tanpa pernah kamu catat.",
    metric: "-85% BOCOR",
    highlightKeyword: "BOCOR",
    durationSec: 7
  },
  {
    sceneNumber: 3,
    stageName: "THE BREAKTHROUGH REVEAL",
    timeRange: "0:13 - 0:20",
    headline: "TERAPKAN ATURAN 50/30/20 OTOMATIS",
    subtext: "Pisahkan rekening di menit pertama gajian masuk. Tabungan aman 100%.",
    metric: "+300% AMAN",
    highlightKeyword: "OTOMATIS",
    durationSec: 7
  },
  {
    sceneNumber: 4,
    stageName: "THE INFINITE LOOP CTA",
    timeRange: "0:20 - 0:26",
    headline: "SAVE VIDEO INI BIAR NGGAK LUPA",
    subtext: "Biar kamu nggak bingung lagi pas mulai awal bulan depan...",
    metric: "SAVE! ✨",
    highlightKeyword: "SAVE",
    durationSec: 6
  }
];

export default function KineticMotionPage() {
  const [mode, setMode] = useState<"multi" | "single">("multi");
  const [topicIdea, setTopicIdea] = useState("Kenapa 99% orang gagal menabung & cara memperbaikinya");
  const [scenes, setScenes] = useState<StoryScene[]>(DEFAULT_SCENES);
  const [activeSceneTab, setActiveSceneTab] = useState(0);

  // Single mode state
  const [singleHeadline, setSingleHeadline] = useState("90% ORANG GAGAL KARENA HAL INI");
  const [singleMetric, setSingleMetric] = useState("+340%");
  const [singleSubtext, setSingleSubtext] = useState("Bukan karena kurang modal, tapi karena salah eksekusi di detik awal.");
  const [singleDuration, setSingleDuration] = useState(6);

  const [motionStyle, setMotionStyle] = useState<"apple-keynote" | "fintech-alpha" | "cyber-hud" | "stoic-gold">("apple-keynote");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Calculate total duration
  const totalDurationSec = mode === "multi"
    ? scenes.reduce((acc, s) => acc + s.durationSec, 0)
    : singleDuration;

  // Generate 4-Scene Story from 1 Idea
  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicIdea.trim()) return;

    setIsGeneratingStory(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "multi-scene-story",
          topicIdea,
          motionStyle,
        }),
      });

      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
        startTimeRef.current = Date.now(); // restart canvas
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingStory(false);
    }
  };

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
      const loopTime = elapsed % totalDurationSec;
      const globalProgress = loopTime / totalDurationSec; // 0 to 1

      // Determine active scene and local scene progress
      let currentHeadline = singleHeadline;
      let currentSubtext = singleSubtext;
      let currentMetric = singleMetric;
      let currentHighlight = "";
      let sceneBadge = "● BUATPROMPT KINETIC";
      let sceneLocalProgress = globalProgress;
      let sceneIndex = 0;

      if (mode === "multi") {
        let accumulatedTime = 0;
        for (let i = 0; i < scenes.length; i++) {
          const s = scenes[i];
          if (loopTime >= accumulatedTime && loopTime < accumulatedTime + s.durationSec) {
            sceneIndex = i;
            currentHeadline = s.headline;
            currentSubtext = s.subtext;
            currentMetric = s.metric;
            currentHighlight = s.highlightKeyword;
            sceneBadge = `SCENE ${i + 1}/${scenes.length}: ${s.stageName}`;
            const timeInScene = loopTime - accumulatedTime;
            sceneLocalProgress = timeInScene / s.durationSec;
            break;
          }
          accumulatedTime += s.durationSec;
        }
      }

      // Transition Ease Calculation (Fluid Ease-in / Ease-out across cuts)
      // When sceneLocalProgress is in the first 0.15, scale from 0.95 -> 1.0
      const enterEase = Math.min(sceneLocalProgress / 0.15, 1);
      const exitEase = sceneLocalProgress > 0.88 ? (1 - sceneLocalProgress) / 0.12 : 1;
      const transitionScale = 0.96 + enterEase * 0.04 * exitEase;
      const transitionAlpha = Math.min(enterEase * exitEase * 1.5, 1);

      // 1. Background rendering based on style
      if (motionStyle === "apple-keynote") {
        ctx.fillStyle = "#090a0f";
        ctx.fillRect(0, 0, W, H);

        const radial = ctx.createRadialGradient(W / 2, H * 0.4, 10, W / 2, H * 0.4, W * 0.7);
        radial.addColorStop(0, "rgba(255, 255, 255, 0.05)");
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, W, H);
      } else if (motionStyle === "fintech-alpha") {
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
        ctx.fillStyle = "#080911";
        ctx.fillRect(0, 0, W, H);

        // Scanlines
        ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
        for (let y = 0; y < H; y += 4) {
          ctx.fillRect(0, y, W, 2);
        }
      } else if (motionStyle === "stoic-gold") {
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

      // 2. Top Scene Badge & Progress Indicator
      ctx.save();
      ctx.font = "600 18px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(sceneBadge, 60, 100);

      if (motionStyle === "cyber-hud") {
        const timecode = `TC 00:0${Math.floor(elapsed)}:${Math.floor((elapsed % 1) * 30).toString().padStart(2, "0")}`;
        ctx.textAlign = "right";
        ctx.fillText(timecode, W - 60, 100);
      }
      ctx.restore();

      // 3. Dynamic Animated Headline with Word-by-Word Highlight
      ctx.save();
      ctx.translate(W / 2, H * 0.42);
      ctx.scale(transitionScale, transitionScale);
      ctx.globalAlpha = transitionAlpha;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (motionStyle === "stoic-gold") {
        ctx.font = "bold 52px serif";
      } else if (motionStyle === "cyber-hud") {
        ctx.font = "900 48px monospace";
      } else {
        ctx.font = "800 52px sans-serif";
      }

      // Split headline into lines
      const words = currentHeadline.toUpperCase().split(" ");
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

      const lineHeight = 66;
      const startY = -(lines.length * lineHeight) / 2;

      lines.forEach((l, idx) => {
        const lineText = l.trim();
        // Check if highlight keyword is in this line
        if (currentHighlight && lineText.includes(currentHighlight.toUpperCase())) {
          ctx.fillStyle = motionStyle === "fintech-alpha" ? "#10b981" : motionStyle === "stoic-gold" ? "#f59e0b" : "#38bdf8";
        } else {
          ctx.fillStyle = motionStyle === "cyber-hud" ? "#38bdf8" : "#ffffff";
        }
        ctx.fillText(lineText, 0, startY + idx * lineHeight);
      });
      ctx.restore();

      // 4. Dynamic Metric Counter or FinTech Trendline
      if (currentMetric.trim()) {
        ctx.save();
        ctx.globalAlpha = transitionAlpha;
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
          const currentGraphX = 100 + (W - 200) * sceneLocalProgress;
          const currentGraphY = startGraphY - Math.sin(sceneLocalProgress * Math.PI) * 120;
          ctx.quadraticCurveTo(W / 2, startGraphY - 140 * sceneLocalProgress, currentGraphX, currentGraphY);
          ctx.stroke();
        } else if (motionStyle === "stoic-gold") {
          ctx.fillStyle = "#f59e0b";
          ctx.shadowColor = "rgba(245, 158, 11, 0.3)";
          ctx.shadowBlur = 15;
        } else {
          ctx.fillStyle = "#38bdf8";
        }

        ctx.fillText(currentMetric, W / 2, H * 0.68);
        ctx.restore();
      }

      // 5. Supporting Subtext
      if (currentSubtext.trim()) {
        ctx.save();
        ctx.globalAlpha = transitionAlpha;
        ctx.font = "400 24px sans-serif";
        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "center";

        // Word wrap subtext
        const subWords = currentSubtext.split(" ");
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

      // 6. Global Timeline Progress Line (Bottom)
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(80, H - 120, W - 160, 6);

      ctx.fillStyle = motionStyle === "fintech-alpha" ? "#10b981" : motionStyle === "stoic-gold" ? "#f59e0b" : "#ffffff";
      ctx.fillRect(80, H - 120, (W - 160) * globalProgress, 6);
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
  }, [mode, scenes, singleHeadline, singleMetric, singleSubtext, motionStyle, totalDurationSec, isPlaying]);

  // In-Browser Native Video Recorder (Full Length 24-30s or Single Clip)
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
      a.download = `kinetic-${mode}-story-${totalDurationSec}s.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setRecordProgress(100);
    };

    recorder.start();

    // Track recording progress bar
    const totalMs = totalDurationSec * 1000;
    const intervalMs = 150;
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

  const updateSceneField = (index: number, field: keyof StoryScene, val: any) => {
    const updated = [...scenes];
    (updated[index] as any)[field] = val;
    setScenes(updated);
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
          <Film className="h-3.5 w-3.5" />
          <span>MULTI-SCENE KINETIC STORY DIRECTOR (FULL 26s MOVIE)</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Scene Kinetic Video Studio
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          Bukan cuma potongan 5 detik! Susun **alur cerita 4-scene komplit (Hook ➔ Agitasi ➔ Solusi ➔ CTA Loop)** berdurasi 26 detik penuh dengan transisi mulus, lalu rekam dan unduh langsung jadi 1 file video tanpa CapCut!
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setMode("multi")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            mode === "multi"
              ? "bg-white text-black shadow-lg"
              : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>FULL 4-SCENE STORY MOVIE (26 DETIK)</span>
          <span className="bg-emerald-500/20 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ml-1">Rekomendasi</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("single")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            mode === "single"
              ? "bg-white text-black shadow-lg"
              : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
          }`}
        >
          <Play className="h-4 w-4 fill-current" />
          <span>SINGLE HOOK CLIP (6 DETIK)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Scene Controls */}
        <div className="lg:col-span-6 space-y-6">
          {mode === "multi" ? (
            /* Multi-Scene Controls */
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-5 shadow-xl">
              {/* Auto Storyboard Form from 1 Idea */}
              <form onSubmit={handleGenerateStory} className="space-y-3 pb-4 border-b border-white/10">
                <label className="block text-xs font-mono font-semibold text-zinc-300">
                  MASUKKAN 1 IDE / TOPIK CERITA *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={topicIdea}
                    onChange={(e) => setTopicIdea(e.target.value)}
                    placeholder="Contoh: Kenapa 99% orang gagal nabung & solusinya"
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingStory}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 font-mono text-xs font-bold text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isGeneratingStory ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="h-3.5 w-3.5" />
                    )}
                    <span>SUSUN 4 SCENE</span>
                  </button>
                </div>
              </form>

              {/* Scene Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-zinc-300">
                    EDIT SCENE STORYBOARD
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Total Durasi: {totalDurationSec}s
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 mb-3">
                  {scenes.map((s, idx) => (
                    <button
                      key={s.sceneNumber}
                      type="button"
                      onClick={() => setActiveSceneTab(idx)}
                      className={`py-1.5 text-center rounded-lg font-mono text-[10px] font-bold transition-all ${
                        activeSceneTab === idx
                          ? "bg-white text-black shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      SCENE {s.sceneNumber}
                    </button>
                  ))}
                </div>

                {/* Active Scene Editor */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                    <span>{scenes[activeSceneTab].stageName}</span>
                    <span className="text-zinc-400">{scenes[activeSceneTab].timeRange}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                      HEADLINE TEKS (HURUF BESAR)
                    </label>
                    <textarea
                      rows={2}
                      value={scenes[activeSceneTab].headline}
                      onChange={(e) => updateSceneField(activeSceneTab, "headline", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        METRIC BADGE
                      </label>
                      <input
                        type="text"
                        value={scenes[activeSceneTab].metric}
                        onChange={(e) => updateSceneField(activeSceneTab, "metric", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        KATA PENUTUR KUNCI
                      </label>
                      <input
                        type="text"
                        value={scenes[activeSceneTab].highlightKeyword}
                        onChange={(e) => updateSceneField(activeSceneTab, "highlightKeyword", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-emerald-300 font-mono focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                      SUBTEXT PENJELASAN
                    </label>
                    <input
                      type="text"
                      value={scenes[activeSceneTab].subtext}
                      onChange={(e) => updateSceneField(activeSceneTab, "subtext", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-zinc-300 font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Single Clip Mode Controls */
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                  HEADLINE CLIP
                </label>
                <textarea
                  rows={2}
                  value={singleHeadline}
                  onChange={(e) => setSingleHeadline(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">METRIC</label>
                  <input
                    type="text"
                    value={singleMetric}
                    onChange={(e) => setSingleMetric(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">DURASI</label>
                  <select
                    value={singleDuration}
                    onChange={(e) => setSingleDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value={5}>5 Detik</option>
                    <option value={7}>7 Detik</option>
                    <option value={10}>10 Detik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">SUBTEXT</label>
                <input
                  type="text"
                  value={singleSubtext}
                  onChange={(e) => setSingleSubtext(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-300 font-mono"
                />
              </div>
            </div>
          )}

          {/* Style Selector */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-3 shadow-xl">
            <label className="block text-xs font-mono font-semibold text-zinc-300">
              GAYA VISUAL ARSITEKTUR
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "apple-keynote", name: "Apple Keynote Luxury" },
                { id: "fintech-alpha", name: "Wall St / FinTech Alpha" },
                { id: "cyber-hud", name: "Cyberpunk Tech HUD" },
                { id: "stoic-gold", name: "Dark Stoic & Warm Ember" }
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setMotionStyle(st.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                    motionStyle === st.id
                      ? "border-emerald-400 bg-emerald-500/10 text-white font-bold"
                      : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>

            {/* In-Browser Native Video Download Action */}
            <div className="pt-3">
              <button
                type="button"
                disabled={isRecording}
                onClick={recordAndDownloadVideo}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 font-mono text-sm font-bold text-white shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isRecording ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>MEREKAM FULL VIDEO ({recordProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>
                      {mode === "multi"
                        ? `REKAM & DOWNLOAD FULL ${totalDurationSec}s VIDEO (9:16 HD)`
                        : `REKAM & DOWNLOAD CLIP ${totalDurationSec}s (9:16 HD)`}
                    </span>
                  </>
                )}
              </button>
              <p className="text-[11px] font-mono text-zinc-400 text-center mt-2">
                ⚡ 100% Client-side. Tidak perlu OBS. Video utuh 4-scene langsung terunduh siap posting.
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
            <span className="text-[11px] text-zinc-400">
              Durasi Total: {totalDurationSec}s • 720 × 1280 (9:16)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
