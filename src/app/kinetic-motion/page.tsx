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
  Wand2,
  AlertTriangle,
  Smile,
  Zap,
  Volume2,
  Clock,
  FileText,
  Lightbulb,
  Scissors
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
  characterEmotion: "shocked" | "skeptical" | "celebrate" | "point-cta";
  kineticFx: string;
  foleyCue: string;
}

const SUGGESTED_TOPICS = [
  { label: "☕ Kopi Enak Tanpa Mesin", topic: "Rahasia seduh kopi seenak cafe tanpa mesin mahal", niche: "Kuliner & Kopi" },
  { label: "💰 Affiliate Tembus 10 Juta", topic: "Cara affiliate pemula tembus 10 juta pertama tanpa followers", niche: "Affiliate & Jualan" },
  { label: "🛑 Gaji Selalu Habis Tgl 10", topic: "Kenapa gaji berapapun selalu habis di tanggal 10 dan solusinya", niche: "Finansial & Investasi" },
  { label: "✨ Retinol Anti-Purging", topic: "Aturan pakai retinol malam hari agar glowing tanpa breakout", niche: "Skincare & Beauty" },
  { label: "📱 HP Murah Spek Dewa", topic: "Jangan beli HP flagship mahal kalau cuma buat medsos, ini solusinya", niche: "Gadget & Tech" },
];

const DEFAULT_SCENES: StoryScene[] = [
  {
    sceneNumber: 1,
    stageName: "THE SHOCK HOOK",
    timeRange: "0:00 - 0:10",
    headline: "KENAPA GAJI SELALU HABIS DI TANGGAL 10?",
    subtext: "Bukan karena penghasilan kamu kekecilan, tapi karena ada kebocoran halus di rekeningmu yang nggak pernah kamu catat.",
    metric: "STOP BOCOR! 🛑",
    highlightKeyword: "HABIS",
    durationSec: 10,
    characterEmotion: "shocked",
    kineticFx: "Spring Punch Scale 1.2x + Alert Aura Halo",
    foleyCue: "0:00 Fast Whoosh + Heavy Sub-Bass Thud"
  },
  {
    sceneNumber: 2,
    stageName: "THE PAIN AGITATION",
    timeRange: "0:10 - 0:25",
    headline: "LIFESTYLE INFLATION MENJEBAK TABUNGAN",
    subtext: "Gaji naik 1 juta, pengeluaran kopi dan nongkrong ikut naik 1.5 juta. Di akhir bulan saldo kembali nol dan kamu tetap merasa miskin.",
    metric: "-85% BOCOR",
    highlightKeyword: "JEBAKAN",
    durationSec: 15,
    characterEmotion: "skeptical",
    kineticFx: "Wipe Push Left + Floating Red Question Particles",
    foleyCue: "0:10 Camera Shutter Snap + Low Vinyl Scratch"
  },
  {
    sceneNumber: 3,
    stageName: "THE BREAKTHROUGH REVEAL",
    timeRange: "0:25 - 0:40",
    headline: "TERAPKAN SISTEM 3 REKENING OTOMATIS",
    subtext: "Begitu gajian masuk: 50% pos hidup, 30% investasi autodebet, 20% uang senang-senang. Rekening tabungan dikunci tanpa kartu debit fisik.",
    metric: "+300% AMAN",
    highlightKeyword: "AUTODEBET",
    durationSec: 15,
    characterEmotion: "celebrate",
    kineticFx: "Dynamic Glowing SVG Curve Path + Rocket Sparkles",
    foleyCue: "0:25 Harmonic Synth Swell + Crisp Cash Chime"
  },
  {
    sceneNumber: 4,
    stageName: "THE INFINITE LOOP CTA",
    timeRange: "0:40 - 0:52",
    headline: "SIMPAN VIDEO INI BIAR GAJI AMAN",
    subtext: "Biar kamu nggak panik lagi pas mulai awal bulan depan... Karena kalau kamu perhatikan lagi...",
    metric: "SAVE! ✨",
    highlightKeyword: "SIMPAN",
    durationSec: 12,
    characterEmotion: "point-cta",
    kineticFx: "Pulsating Bookmark Ring + Seamless Loop Match Cut",
    foleyCue: "0:40 Clean Glass Bell Ding + Ambient Fade Out"
  }
];

export default function KineticMotionPage() {
  const [mode, setMode] = useState<"multi" | "single">("multi");
  const [creationTab, setCreationTab] = useState<"idea" | "script">("idea");
  const [durationTarget, setDurationTarget] = useState<"55s" | "26s">("55s");
  const [targetNiche, setTargetNiche] = useState("General Creator");
  const [topicIdea, setTopicIdea] = useState("Kenapa 99% orang gagal menabung & cara memperbaikinya");
  const [rawScriptInput, setRawScriptInput] = useState("");
  const [scenes, setScenes] = useState<StoryScene[]>(DEFAULT_SCENES);
  const [activeSceneTab, setActiveSceneTab] = useState(0);
  const [showMascot, setShowMascot] = useState(true);

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
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Word count & pacing calculation
  const currentAnalyzedText = creationTab === "script" ? rawScriptInput : topicIdea;
  const textWords = currentAnalyzedText.trim()
    ? currentAnalyzedText.trim().split(/\s+/).filter((w) => w.length > 0)
    : [];
  const wordCount = textWords.length;
  const estimatedSeconds = Math.round(wordCount / 2.4);
  const isPacingOverLimit = creationTab === "script" && (wordCount > 135 || estimatedSeconds > 55);

  const totalDurationSec = mode === "multi"
    ? scenes.reduce((acc, s) => acc + s.durationSec, 0)
    : singleDuration;

  // Auto Arrange & Script Breakdown Handler
  const handleGenerateStory = async (overrideTab?: "idea" | "script", customScript?: string) => {
    const activeTab = overrideTab || creationTab;
    const targetScript = customScript !== undefined ? customScript : rawScriptInput;
    const targetText = activeTab === "script" ? targetScript.trim() : topicIdea.trim();
    if (!targetText) return;

    setIsGeneratingStory(true);
    setWarningMessage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "multi-scene-story",
          inputTab: activeTab,
          topicIdea: topicIdea || "Strategi Konten",
          rawScriptText: activeTab === "script" ? targetScript : "",
          targetNiche,
          motionStyle,
          durationTarget,
        }),
      });

      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
        if (data.warningNotice) {
          setWarningMessage(data.warningNotice);
        }
        startTimeRef.current = Date.now(); // reset animation to 0
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // 1-Click Auto-Truncate for Custom Script exceeding 55s
  const handleAutoTruncate = () => {
    if (creationTab === "script") {
      const trimmed = textWords.slice(0, 130).join(" ");
      setRawScriptInput(trimmed);
      handleGenerateStory("script", trimmed);
    }
  };

  // Canvas drawing loop with Mascot & Dynamic Kinetic Typography
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
      let currentEmotion: "shocked" | "skeptical" | "celebrate" | "point-cta" = "shocked";
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
            currentEmotion = s.characterEmotion || "shocked";
            sceneBadge = `SCENE ${i + 1}/${scenes.length}: ${s.stageName}`;
            const timeInScene = loopTime - accumulatedTime;
            sceneLocalProgress = timeInScene / s.durationSec;
            break;
          }
          accumulatedTime += s.durationSec;
        }
      }

      // Spring overshoot calculation for kinetic entrance
      const springT = Math.min(sceneLocalProgress * 3.5, 1);
      const springBounce = 0.88 + Math.sin(springT * Math.PI) * 0.14 * Math.exp(-springT * 2);
      const enterEase = Math.min(sceneLocalProgress / 0.14, 1);
      const exitEase = sceneLocalProgress > 0.88 ? (1 - sceneLocalProgress) / 0.12 : 1;
      const transitionScale = 0.95 + springBounce * 0.05 * exitEase;
      const transitionAlpha = Math.min(enterEase * exitEase * 1.5, 1);

      // 1. Background rendering based on style
      if (motionStyle === "apple-keynote") {
        ctx.fillStyle = "#08090d";
        ctx.fillRect(0, 0, W, H);

        const radial = ctx.createRadialGradient(W / 2, H * 0.35, 10, W / 2, H * 0.35, W * 0.7);
        radial.addColorStop(0, "rgba(255, 255, 255, 0.06)");
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

      // 2. Floating 3D Geometric Accents (After Effects Style)
      const rotAngle = elapsed * 0.8;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1.5;
      ctx.translate(W * 0.85, H * 0.22);
      ctx.rotate(rotAngle);
      ctx.strokeRect(-25, -25, 50, 50);
      ctx.restore();

      // 3. Top Scene Badge & Progress Indicator
      ctx.save();
      ctx.font = "600 18px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fillText(sceneBadge, 60, 95);

      if (motionStyle === "cyber-hud") {
        const timecode = `TC 00:0${Math.floor(elapsed)}:${Math.floor((elapsed % 1) * 30).toString().padStart(2, "0")}`;
        ctx.textAlign = "right";
        ctx.fillText(timecode, W - 60, 95);
      }
      ctx.restore();

      // 4. ANIMATED MASCOT / 3D VECTOR AVATAR (Interactive & Reactive)
      if (showMascot) {
        ctx.save();
        const mascotX = W / 2;
        // Floating hover bobbing motion
        const mascotBob = Math.sin(elapsed * 3.5) * 8;
        const mascotY = H * 0.25 + mascotBob;

        ctx.translate(mascotX, mascotY);
        ctx.globalAlpha = transitionAlpha;

        // Aura halo ring
        const auraColor = currentEmotion === "shocked"
          ? "rgba(244, 63, 94, 0.2)"
          : currentEmotion === "celebrate"
          ? "rgba(16, 185, 129, 0.25)"
          : currentEmotion === "point-cta"
          ? "rgba(245, 158, 11, 0.25)"
          : "rgba(56, 189, 248, 0.2)";

        ctx.beginPath();
        ctx.arc(0, 0, 68, 0, Math.PI * 2);
        ctx.fillStyle = auraColor;
        ctx.fill();

        // Mascot Head (Rounded Glass Capsule)
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        const headGrad = ctx.createLinearGradient(-30, -30, 30, 30);
        headGrad.addColorStop(0, "#232838");
        headGrad.addColorStop(1, "#12141d");
        ctx.fillStyle = headGrad;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Visor / Face Screen
        ctx.beginPath();
        ctx.roundRect(-36, -18, 72, 36, 12);
        ctx.fillStyle = "#08090f";
        ctx.fill();

        // Animated Eyes & Emotion Expressions
        const blinkPhase = Math.sin(elapsed * 2.2);
        const isBlinking = blinkPhase > 0.96;

        ctx.fillStyle = currentEmotion === "shocked"
          ? "#f43f5e"
          : currentEmotion === "celebrate"
          ? "#10b981"
          : currentEmotion === "point-cta"
          ? "#f59e0b"
          : "#38bdf8";

        if (isBlinking) {
          // Closed eye slits
          ctx.fillRect(-22, 0, 14, 3);
          ctx.fillRect(8, 0, 14, 3);
        } else if (currentEmotion === "shocked") {
          // Wide surprised eyes
          ctx.beginPath();
          ctx.arc(-15, 0, 7, 0, Math.PI * 2);
          ctx.arc(15, 0, 7, 0, Math.PI * 2);
          ctx.fill();
          // Exclamation Mark above mascot head
          ctx.font = "bold 28px sans-serif";
          ctx.fillStyle = "#f43f5e";
          ctx.textAlign = "center";
          ctx.fillText("!", 0, -68);
        } else if (currentEmotion === "skeptical") {
          // Narrow squinting eyes
          ctx.fillRect(-22, -2, 14, 4);
          ctx.fillRect(8, -2, 14, 4);
          // Question mark
          ctx.font = "bold 24px sans-serif";
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText("?", 25, -60);
        } else if (currentEmotion === "celebrate") {
          // Happy smiling arc eyes
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#10b981";
          ctx.beginPath();
          ctx.arc(-15, 2, 7, Math.PI, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(15, 2, 7, Math.PI, 0);
          ctx.stroke();
          // Floating stars
          ctx.fillStyle = "#facc15";
          ctx.font = "18px sans-serif";
          ctx.fillText("★", -35, -50);
          ctx.fillText("★", 35, -50);
        } else if (currentEmotion === "point-cta") {
          // Energetic open eyes
          ctx.beginPath();
          ctx.arc(-15, 0, 6, 0, Math.PI * 2);
          ctx.arc(15, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          // Bookmark/Save icon badge
          ctx.font = "22px sans-serif";
          ctx.fillText("🔖", 0, -62);
        }

        ctx.restore();
      }

      // 5. DYNAMIC KINETIC HEADLINE WITH WORD-BY-WORD HIGHLIGHT BOX
      ctx.save();
      ctx.translate(W / 2, showMascot ? H * 0.46 : H * 0.42);
      ctx.scale(transitionScale, transitionScale);
      ctx.globalAlpha = transitionAlpha;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (motionStyle === "stoic-gold") {
        ctx.font = "bold 48px serif";
      } else if (motionStyle === "cyber-hud") {
        ctx.font = "900 46px monospace";
      } else {
        ctx.font = "800 50px sans-serif";
      }

      // Word wrapping for headline
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
        const lineY = startY + idx * lineHeight;

        // Kinetic Highlight Box if line contains target keyword
        if (currentHighlight && lineText.includes(currentHighlight.toUpperCase())) {
          const textW = ctx.measureText(lineText).width;
          const boxH = 56;

          ctx.save();
          ctx.fillStyle = motionStyle === "fintech-alpha"
            ? "rgba(16, 185, 129, 0.18)"
            : motionStyle === "stoic-gold"
            ? "rgba(245, 158, 11, 0.2)"
            : "rgba(56, 189, 248, 0.2)";
          ctx.strokeStyle = motionStyle === "fintech-alpha"
            ? "rgba(16, 185, 129, 0.5)"
            : motionStyle === "stoic-gold"
            ? "rgba(245, 158, 11, 0.5)"
            : "rgba(56, 189, 248, 0.5)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-textW / 2 - 14, lineY - boxH / 2, textW + 28, boxH, 12);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = motionStyle === "fintech-alpha" ? "#10b981" : motionStyle === "stoic-gold" ? "#f59e0b" : "#38bdf8";
        } else {
          ctx.fillStyle = motionStyle === "cyber-hud" ? "#38bdf8" : "#ffffff";
        }

        ctx.fillText(lineText, 0, lineY);
      });
      ctx.restore();

      // 6. DYNAMIC METRIC COUNTER OR FINTECH CURVE
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
          const startGraphY = H * 0.69;
          ctx.moveTo(100, startGraphY);
          const currentGraphX = 100 + (W - 200) * sceneLocalProgress;
          const currentGraphY = startGraphY - Math.sin(sceneLocalProgress * Math.PI) * 110;
          ctx.quadraticCurveTo(W / 2, startGraphY - 130 * sceneLocalProgress, currentGraphX, currentGraphY);
          ctx.stroke();
        } else if (motionStyle === "stoic-gold") {
          ctx.fillStyle = "#f59e0b";
          ctx.shadowColor = "rgba(245, 158, 11, 0.3)";
          ctx.shadowBlur = 15;
        } else {
          ctx.fillStyle = "#38bdf8";
        }

        ctx.fillText(currentMetric, W / 2, H * 0.72);
        ctx.restore();
      }

      // 7. SUPPORTING SUBTEXT
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
          ctx.fillText(sl.trim(), W / 2, H * 0.82 + idx * 34);
        });
        ctx.restore();
      }

      // 8. GLOBAL TIMELINE PROGRESS LINE
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(80, H - 110, W - 160, 6);

      ctx.fillStyle = motionStyle === "fintech-alpha" ? "#10b981" : motionStyle === "stoic-gold" ? "#f59e0b" : "#ffffff";
      ctx.fillRect(80, H - 110, (W - 160) * globalProgress, 6);
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
  }, [mode, scenes, singleHeadline, singleMetric, singleSubtext, motionStyle, totalDurationSec, isPlaying, showMascot]);

  // In-Browser Native Video Recorder
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
          <Film className="h-3.5 w-3.5" />
          <span>MULTI-SCENE KINETIC DIRECTOR & AFTER EFFECTS ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Scene Kinetic Video Studio
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          Hasil sekelas biro iklan internasional! Lengkap dengan **Karakter Maskot 3D Animasi Responsif**, tipografi kinetic membesar-mengecil berpegas (*spring physics*), kalkulator durasi naskah otomatis, dan unduh langsung video 26 detik utuh tanpa CapCut.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
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

        {/* Mascot Toggle Button */}
        <button
          type="button"
          onClick={() => setShowMascot(!showMascot)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border transition-colors cursor-pointer ${
            showMascot
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
          }`}
        >
          <Smile className="h-3.5 w-3.5" />
          <span>Maskot 3D Avatar: {showMascot ? "AKTIF ✓" : "NONAKTIF"}</span>
        </button>
      </div>

      {/* Word Count & Duration Pacing Alert */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0d1017] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="text-xs font-mono">
            <span className="text-zinc-400">Status Studio: </span>
            {creationTab === "script" ? (
              <>
                <span className="text-white font-bold">{wordCount} Kata</span>
                <span className="text-zinc-500 mx-2">•</span>
                <span className="text-zinc-400">Estimasi Bicara: </span>
                <span className="text-emerald-300 font-bold">~{estimatedSeconds} Detik</span>
                <span className="text-zinc-500 mx-2">•</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isPacingOverLimit ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {isPacingOverLimit ? "TERLALU PANJANG (>55s)" : "RETENSI OPTIMAL ✓"}
                </span>
              </>
            ) : (
              <>
                <span className="text-emerald-300 font-bold">AI Idea-to-Script Mode</span>
                <span className="text-zinc-500 mx-2">•</span>
                <span className="text-zinc-400">Target Durasi: </span>
                <span className="text-cyan-300 font-bold">{durationTarget === "55s" ? "52-55 Detik (Golden Sweet Spot)" : "26 Detik (Express Quick Hook)"}</span>
              </>
            )}
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-500">
          Standar Shorts/TikTok: Maks. 135 kata (55s)
        </span>
      </div>

      {/* Warning Box if Script is too long */}
      {(isPacingOverLimit || warningMessage) && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>PANDUAN RETENSI ALGORITMA: OPTIMASI DURASI & NASKAH</span>
          </div>
          <p className="text-xs font-mono text-zinc-300 leading-relaxed">
            {warningMessage || `Naskah Anda (${wordCount} kata / ~${estimatedSeconds} detik) melebihi batas retensi optimal 55-60 detik. Menonton video vertikal terlalu lama berpotensi meningkatkan drop-off penonton.`}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleAutoTruncate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Scissors className="h-3.5 w-3.5" />
              <span>✂️ AUTO-TRUNCATE KE 130 KATA (52s MAKSIMAL)</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenerateStory("script")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>SUSUN ULANG KE 4 SCENE PADAT</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Scene Controls */}
        <div className="lg:col-span-6 space-y-6">
          {mode === "multi" ? (
            /* Multi-Scene Controls */
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-5 shadow-xl">
              {/* TWO TABS: IDEA-TO-SCRIPT VS CUSTOM SCRIPT */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10">
                <button
                  type="button"
                  onClick={() => setCreationTab("idea")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    creationTab === "idea"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>💡 BUAT NASKAH DARI IDE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreationTab("script")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    creationTab === "script"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>📝 MASUKKAN NASKAH SENDIRI</span>
                </button>
              </div>

              {/* TAB 1: GENERATE FROM IDEA */}
              {creationTab === "idea" ? (
                <div className="space-y-3 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-zinc-300">
                      KETIK TOPIK / IDE KONTEN ANDA *
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Otomatis Bikin Naskah 55s
                    </span>
                  </div>
                  <input
                    type="text"
                    value={topicIdea}
                    onChange={(e) => setTopicIdea(e.target.value)}
                    placeholder="Contoh: Rahasia kopi enak tanpa mesin mahal, Tips affiliate pemula..."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none font-mono font-medium"
                  />

                  {/* Quick Suggested Topics */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500">PILIHAN INSPIRASI CEPAT:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_TOPICS.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setTopicIdea(sug.topic);
                            setTargetNiche(sug.niche);
                          }}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors cursor-pointer"
                        >
                          {sug.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Duration & Niche Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        TARGET DURASI VIDEO
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDurationTarget("55s")}
                          className={`py-1.5 px-2 text-center rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                            durationTarget === "55s"
                              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                              : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                          }`}
                        >
                          52-55s (Deep Story)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDurationTarget("26s")}
                          className={`py-1.5 px-2 text-center rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                            durationTarget === "26s"
                              ? "border-cyan-500/40 bg-cyan-500/20 text-cyan-300"
                              : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                          }`}
                        >
                          26s (Express Hook)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        NICHE / TONE AUDIENS
                      </label>
                      <select
                        value={targetNiche}
                        onChange={(e) => setTargetNiche(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="General Creator">Umum & Edukasi</option>
                        <option value="Affiliate & Jualan">Affiliate & Jualan</option>
                        <option value="Finansial & Investasi">Finansial & Investasi</option>
                        <option value="Kuliner & Kopi">Kuliner & Kopi</option>
                        <option value="Skincare & Beauty">Skincare & Beauty</option>
                        <option value="Gadget & Tech">Gadget & Tech</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateStory("idea")}
                    disabled={isGeneratingStory || !topicIdea.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-3 font-mono text-xs font-bold text-white transition-opacity hover:opacity-95 cursor-pointer disabled:opacity-50 mt-2 shadow-lg shadow-emerald-950/40"
                  >
                    {isGeneratingStory ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>MENYUSUN NASKAH {durationTarget === "55s" ? "52-55s" : "26s"} & 4 SCENE...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>🪄 BUAT NASKAH LENGKAP & SUSUN 4 SCENE OTOMATIS</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* TAB 2: PASTE CUSTOM SCRIPT */
                <div className="space-y-3 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-zinc-300">
                      PASTE NASKAH MENTAH / ARTIKEL PANJANG *
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Pacing Guard Aktif
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={rawScriptInput}
                    onChange={(e) => setRawScriptInput(e.target.value)}
                    placeholder="Paste naskah Anda di sini... BuatPrompt akan menganalisis jumlah kata, mengestimasi durasi bicara, dan membedahnya ke dalam 4 scene beruntun."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none font-mono"
                  />

                  {/* Pacing Guard Info for Custom Script */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-zinc-400">Naskah:</span>
                      <span className="text-white font-bold">{wordCount} Kata</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-emerald-300 font-bold">~{estimatedSeconds}s</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isPacingOverLimit ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                    }`}>
                      {isPacingOverLimit ? "TERLALU PANJANG (>55s)" : "RETENSI PAS ✓"}
                    </span>
                  </div>

                  {/* Target Duration Selector for custom breakdown */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Durasi Alokasi:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDurationTarget("55s")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                          durationTarget === "55s" ? "border-cyan-400 bg-cyan-500/20 text-cyan-300" : "border-white/5 text-zinc-400"
                        }`}
                      >
                        52s (4 Scene)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDurationTarget("26s")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                          durationTarget === "26s" ? "border-cyan-400 bg-cyan-500/20 text-cyan-300" : "border-white/5 text-zinc-400"
                        }`}
                      >
                        26s (4 Scene)
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {isPacingOverLimit && (
                      <button
                        type="button"
                        onClick={handleAutoTruncate}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3 py-2.5 font-mono text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        <Scissors className="h-3.5 w-3.5" />
                        <span>✂️ AUTO-TRUNCATE 52s</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleGenerateStory("script")}
                      disabled={isGeneratingStory || !rawScriptInput.trim()}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 font-mono text-xs font-bold text-white transition-opacity hover:opacity-95 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingStory ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>MEMBEDAH NASKAH KE 4 SCENE...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          <span>⚡ BEDAH NASKAH & ADAPTASI JADI 4 SCENE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Scene Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-zinc-300">
                    EDITOR 4 SCENE STORYBOARD
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Total: {totalDurationSec}s • 4 Babak
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 mb-3">
                  {scenes.map((s, idx) => (
                    <button
                      key={s.sceneNumber}
                      type="button"
                      onClick={() => setActiveSceneTab(idx)}
                      className={`py-1.5 text-center rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${
                        activeSceneTab === idx
                          ? "bg-white text-black shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      SCENE {s.sceneNumber} ({s.durationSec}s)
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
                      HEADLINE TEKS (KINETIC POP-IN)
                    </label>
                    <textarea
                      rows={2}
                      value={scenes[activeSceneTab].headline}
                      onChange={(e) => updateSceneField(activeSceneTab, "headline", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        METRIC BADGE
                      </label>
                      <input
                        type="text"
                        value={scenes[activeSceneTab].metric}
                        onChange={(e) => updateSceneField(activeSceneTab, "metric", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
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
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-emerald-300 font-mono focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        EMOSI MASKOT
                      </label>
                      <select
                        value={scenes[activeSceneTab].characterEmotion || "shocked"}
                        onChange={(e) => updateSceneField(activeSceneTab, "characterEmotion", e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-2 py-1.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="shocked">😱 Kaget / Hook</option>
                        <option value="skeptical">🤔 Ragu / Masalah</option>
                        <option value="celebrate">🎉 Senang / Solusi</option>
                        <option value="point-cta">👉 Menunjuk / CTA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">
                        DURASI (DETIK)
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={30}
                        value={scenes[activeSceneTab].durationSec}
                        onChange={(e) => updateSceneField(activeSceneTab, "durationSec", Math.max(3, parseInt(e.target.value) || 5))}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-cyan-300 font-bold font-mono focus:border-emerald-400 focus:outline-none"
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

                  {/* Director Blueprint Metadata */}
                  <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                    <div>
                      <span className="text-zinc-500">FX Animasi:</span>{" "}
                      <span className="text-cyan-300">{scenes[activeSceneTab].kineticFx}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">SFX Audio:</span>{" "}
                      <span className="text-amber-300">{scenes[activeSceneTab].foleyCue}</span>
                    </div>
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
                    <span>MEREKAM CANVAS SECARA NATIVE ({recordProgress}%)...</span>
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
