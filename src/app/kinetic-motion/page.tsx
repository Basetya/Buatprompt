"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  VolumeX,
  Music,
  Clock,
  FileText,
  Lightbulb,
  Scissors,
  BookOpen,
  Shuffle,
  Database,
  Users,
  User,
} from "lucide-react";
import {
  extractTimedPhrases,
  playProceduralSFX,
  ProceduralLoFiBGM,
  fetchAndDecodeTTS,
  drawVoxelAvatar,
} from "@/lib/mographEngine";

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
    foleyCue: "0:00 Fast Whoosh + Heavy Sub-Bass Thud",
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
    foleyCue: "0:10 Camera Shutter Snap + Low Vinyl Scratch",
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
    foleyCue: "0:25 Harmonic Synth Swell + Crisp Cash Chime",
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
    foleyCue: "0:40 Clean Glass Bell Ding + Ambient Fade Out",
  },
];

export default function KineticMotionPage() {
  const [mode, setMode] = useState<"multi" | "single">("multi");
  const [creationTab, setCreationTab] = useState<"idea" | "script">("idea");
  const [durationTarget, setDurationTarget] = useState<"55s" | "26s">("55s");
  const [targetNiche, setTargetNiche] = useState("General Creator");
  const [vaultDomain, setVaultDomain] = useState("stoic_motivation");
  const [variantSeed, setVariantSeed] = useState(0);
  const [activeVaultInfo, setActiveVaultInfo] = useState<{
    id: string;
    name: string;
    badge: string;
    quoteSnippet?: string;
    authorSnippet?: string;
  } | null>(null);
  const [topicIdea, setTopicIdea] = useState("Kenapa 99% orang gagal menabung & cara memperbaikinya");
  const [rawScriptInput, setRawScriptInput] = useState("");
  const [scenes, setScenes] = useState<StoryScene[]>(DEFAULT_SCENES);
  const [activeSceneTab, setActiveSceneTab] = useState(0);
  const [showMascot, setShowMascot] = useState(true);
  const [showUpperCard, setShowUpperCard] = useState(true);

  // Audio Engine State
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [characterLayout, setCharacterLayout] = useState<"single" | "duo">("single");
  const [voiceActor, setVoiceActor] = useState<"id-ID-ArdiNeural" | "id-ID-GadisNeural">("id-ID-ArdiNeural");
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Single mode state
  const [singleHeadline, setSingleHeadline] = useState("90% ORANG GAGAL KARENA HAL INI");
  const [singleMetric, setSingleMetric] = useState("+340%");
  const [singleSubtext, setSingleSubtext] = useState("Bukan karena kurang modal, tapi karena salah eksekusi di detik awal.");
  const [singleDuration, setSingleDuration] = useState(6);

  const [motionStyle, setMotionStyle] = useState<
    "apple-keynote" | "fintech-alpha" | "cyber-hud" | "stoic-gold" | "swiss-minimalist" | "retro-arcade"
  >("apple-keynote");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Web Audio Graph References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const loFiBgmRef = useRef<ProceduralLoFiBGM | null>(null);
  const audioBuffersRef = useRef<Record<number, AudioBuffer>>({});
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lastSceneIndexRef = useRef<number>(-1);

  // Word count & pacing calculation
  const currentAnalyzedText = creationTab === "script" ? rawScriptInput : topicIdea;
  const textWords = currentAnalyzedText.trim()
    ? currentAnalyzedText.trim().split(/\s+/).filter((w) => w.length > 0)
    : [];
  const wordCount = textWords.length;
  const estimatedSeconds = Math.round(wordCount / 2.4);
  const isPacingOverLimit = creationTab === "script" && (wordCount > 135 || estimatedSeconds > 55);

  const totalDurationSec =
    mode === "multi" ? scenes.reduce((acc, s) => acc + s.durationSec, 0) : singleDuration;

  // Initialize or resume Web Audio context
  const getOrCreateAudioEngine = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const dest = ctx.createMediaStreamDestination();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;

      audioCtxRef.current = ctx;
      audioDestRef.current = dest;
      analyserRef.current = analyser;

      loFiBgmRef.current = new ProceduralLoFiBGM(ctx, [ctx.destination, dest]);
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, dest: audioDestRef.current! };
  }, []);

  // Pre-fetch Microsoft Azure / Edge Neural TTS audio for all scenes
  const prefetchTTSForScenes = useCallback(
    async (sceneList: StoryScene[], voice: string = voiceActor) => {
      try {
        setIsAudioLoading(true);
        const { ctx } = getOrCreateAudioEngine();
        for (let i = 0; i < sceneList.length; i++) {
          const s = sceneList[i];
          const spokenText = `${s.headline}. ${s.subtext}`;
          const buf = await fetchAndDecodeTTS(ctx, spokenText, {
            voice,
            emotion: s.characterEmotion || "normal",
          });
          if (buf) {
            audioBuffersRef.current[i] = buf;
          }
        }
      } catch (err) {
        console.warn("Audio prefetch notice:", err);
      } finally {
        setIsAudioLoading(false);
      }
    },
    [getOrCreateAudioEngine, voiceActor]
  );

  // Trigger audio prefetch when scenes or voice actor change
  useEffect(() => {
    audioBuffersRef.current = {};
    prefetchTTSForScenes(scenes, voiceActor);
  }, [scenes, voiceActor, prefetchTTSForScenes]);

  // Handle BGM playback based on state
  useEffect(() => {
    if (bgmEnabled && isPlaying && !isRecording) {
      if (audioCtxRef.current && loFiBgmRef.current) {
        loFiBgmRef.current.start();
      }
    } else {
      if (loFiBgmRef.current) {
        loFiBgmRef.current.stop();
      }
    }
  }, [bgmEnabled, isPlaying, isRecording]);

  // Auto Arrange & Script Breakdown Handler
  const handleGenerateStory = async (
    overrideTab?: "idea" | "script",
    customScript?: string,
    seedOffset?: number
  ) => {
    const activeTab = overrideTab || creationTab;
    const targetScript = customScript !== undefined ? customScript : rawScriptInput;
    const targetText = activeTab === "script" ? targetScript.trim() : topicIdea.trim();
    if (!targetText) return;

    const currentSeed = seedOffset !== undefined ? seedOffset : variantSeed;

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
          vaultDomain,
          variantSeed: currentSeed,
          motionStyle,
          durationTarget,
        }),
      });

      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
        if (data.vaultUsed) {
          setActiveVaultInfo(data.vaultUsed);
        }
        if (data.warningNotice) {
          setWarningMessage(data.warningNotice);
        }
        startTimeRef.current = Date.now(); // reset animation to 0
        lastSceneIndexRef.current = -1;
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

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 720;
    const H = 1280;
    canvas.width = W;
    canvas.height = H;

    // Embers / particles state for Stoic & Retro
    const particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.2,
      });
    }

    const render = () => {
      const now = Date.now();
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      const loopTime = elapsed % totalDurationSec;
      const globalProgress = loopTime / totalDurationSec;

      // Determine active scene
      let sceneIndex = 0;
      let currentHeadline = singleHeadline;
      let currentSubtext = singleSubtext;
      let currentMetric = singleMetric;
      let currentHighlight = "";
      let sceneBadge = "● BUATPROMPT KINETIC";
      let sceneLocalProgress = globalProgress;
      let currentEmotion: "shocked" | "skeptical" | "celebrate" | "point-cta" = "shocked";

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
            sceneBadge = `SCENE ${i + 1}/${scenes.length} • ${s.stageName}`;
            const timeInScene = loopTime - accumulatedTime;
            sceneLocalProgress = timeInScene / s.durationSec;
            break;
          }
          accumulatedTime += s.durationSec;
        }
      }

      // Check for scene transition to trigger Foley & Voiceover Audio
      if (sceneIndex !== lastSceneIndexRef.current) {
        lastSceneIndexRef.current = sceneIndex;

        // Play Foley Whoosh on scene entry
        if (sfxEnabled && audioCtxRef.current && audioDestRef.current) {
          playProceduralSFX(
            audioCtxRef.current,
            [audioCtxRef.current.destination, audioDestRef.current],
            "whoosh"
          );
        }

        // Play Voiceover AudioBuffer for this scene
        if (audioEnabled && audioCtxRef.current && audioDestRef.current) {
          if (activeAudioSourceRef.current) {
            try {
              activeAudioSourceRef.current.stop();
            } catch (_) {}
          }

          const buf = audioBuffersRef.current[sceneIndex];
          if (buf) {
            try {
              const src = audioCtxRef.current.createBufferSource();
              src.buffer = buf;
              if (analyserRef.current) {
                src.connect(analyserRef.current);
              }
              src.connect(audioCtxRef.current.destination);
              src.connect(audioDestRef.current);
              src.start();
              activeAudioSourceRef.current = src;
            } catch (err) {
              console.warn("Buffer playback notice:", err);
            }
          }
        }
      }

      // Real-time acoustic vocal volume for natural lip-sync (closed when silent)
      let currentVocalVolume = 0;
      if (analyserRef.current) {
        const freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(freqData);
        let sum = 0;
        const speechBins = Math.min(freqData.length, 32);
        for (let i = 2; i < speechBins; i++) {
          sum += freqData[i];
        }
        currentVocalVolume = sum / Math.max(speechBins - 2, 1);
      }

      // Spring physics calculation
      const springT = Math.min(sceneLocalProgress * 3.5, 1);
      const springBounce = 0.88 + Math.sin(springT * Math.PI) * 0.14 * Math.exp(-springT * 2);
      const enterEase = Math.min(sceneLocalProgress / 0.14, 1);
      const exitEase = sceneLocalProgress > 0.88 ? (1 - sceneLocalProgress) / 0.12 : 1;
      const transitionScale = 0.95 + springBounce * 0.05 * exitEase;
      const transitionAlpha = Math.min(enterEase * exitEase * 1.5, 1);

      // 1. BACKGROUND RENDERING BASED ON ARCHETYPE
      if (motionStyle === "apple-keynote") {
        ctx.fillStyle = "#08090d";
        ctx.fillRect(0, 0, W, H);
        const radial = ctx.createRadialGradient(W / 2, H * 0.28, 20, W / 2, H * 0.28, W * 0.75);
        radial.addColorStop(0, "rgba(255, 255, 255, 0.07)");
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, W, H);
      } else if (motionStyle === "fintech-alpha") {
        ctx.fillStyle = "#070c14";
        ctx.fillRect(0, 0, W, H);
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
        ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
        for (let y = 0; y < H; y += 4) {
          ctx.fillRect(0, y, W, 2);
        }
      } else if (motionStyle === "stoic-gold") {
        ctx.fillStyle = "#0c0d11";
        ctx.fillRect(0, 0, W, H);
        particles.forEach((p) => {
          p.y -= p.speed;
          if (p.y < 0) p.y = H;
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * (1 - p.y / H)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (motionStyle === "swiss-minimalist") {
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
        ctx.lineWidth = 1;
        for (let x = 60; x < W; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 60; y < H; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        const cross = (cx: number, cy: number) => {
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy);
          ctx.lineTo(cx + 8, cy);
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx, cy + 8);
          ctx.stroke();
        };
        cross(50, 110);
        cross(W - 50, 110);
        cross(50, H - 70);
        cross(W - 50, H - 70);
      } else if (motionStyle === "retro-arcade") {
        ctx.fillStyle = "#0a0718";
        ctx.fillRect(0, 0, W, H);
        const horizonY = H * 0.72;
        ctx.strokeStyle = "rgba(236, 72, 153, 0.18)";
        ctx.lineWidth = 1.5;
        for (let x = -W; x <= W * 2; x += 70) {
          ctx.beginPath();
          ctx.moveTo(W / 2, horizonY);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        const gridOffset = (elapsed * 35) % 25;
        for (let y = horizonY; y < H; y += 25) {
          const actualY = y + gridOffset;
          if (actualY <= H) {
            ctx.beginPath();
            ctx.moveTo(0, actualY);
            ctx.lineTo(W, actualY);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(139, 92, 246, 0.03)";
        for (let y = 0; y < H; y += 3) {
          ctx.fillRect(0, y, W, 1);
        }
      }

      // 2. TOP HEADER BAR & SCENE BADGE
      ctx.save();
      ctx.font = "700 16px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText("BUATPROMPT STUDIO", 60, 68);

      ctx.textAlign = "right";
      ctx.fillStyle = motionStyle === "fintech-alpha"
        ? "#10b981"
        : motionStyle === "stoic-gold"
        ? "#f59e0b"
        : motionStyle === "swiss-minimalist"
        ? "#ef4444"
        : motionStyle === "retro-arcade"
        ? "#ec4899"
        : "#38bdf8";
      ctx.fillText(sceneBadge, W - 60, 68);
      ctx.restore();

      // 3. ZONE 1: UPPER SHOWCASE STAGE (Y: 100 to 350)
      if (showUpperCard) {
        ctx.save();
        ctx.globalAlpha = transitionAlpha;
        const cardY = 100;
        const cardW = W - 120;
        const cardH = 250;
        const cardX = 60;

        ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 20);
        ctx.fill();
        ctx.stroke();

        if (sceneIndex === 0) {
          // Scene 1: Focused Topic Showcase (Content-Driven, NO Dev Leak)
          ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
          ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cardX + 20, cardY + 20, 160, 30, 8);
          ctx.fill();
          ctx.stroke();

          ctx.font = "800 12px monospace";
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "center";
          ctx.fillText("💡 TOPIK UTAMA", cardX + 100, cardY + 39);

          // Category Badge
          ctx.textAlign = "right";
          ctx.font = "600 12px monospace";
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.fillText(`NICHE: ${targetNiche.toUpperCase()}`, cardX + cardW - 20, cardY + 39);

          // Content Topic Title (Auto-wrap clean 2 lines if needed)
          ctx.textAlign = "left";
          ctx.fillStyle = "#ffffff";
          ctx.font = "800 20px sans-serif";
          const displayTopic = topicIdea.trim() || currentHeadline;
          const words = displayTopic.split(" ");
          let line1 = "";
          let line2 = "";
          for (let w of words) {
            if ((line1 + " " + w).length < 28) {
              line1 = (line1 + " " + w).trim();
            } else {
              line2 = (line2 + " " + w).trim();
            }
          }
          ctx.fillText(`"${line1}`, cardX + 24, cardY + 95);
          if (line2) {
            ctx.fillText(`${line2}"`, cardX + 24, cardY + 128);
          } else {
            ctx.fillText('"', cardX + 24 + ctx.measureText(`"${line1}`).width, cardY + 95);
          }

          // Sub highlight pill
          ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
          ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cardX + 20, cardY + 168, cardW - 40, 48, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#10b981";
          ctx.font = "700 14px monospace";
          ctx.fillText("● Analisis & Fakta Terbuka Tanpa Sensor", cardX + 38, cardY + 198);
        } else if (sceneIndex === 1) {
          // Scene 2: Critical Facts & Pain Points (Content-Driven)
          ctx.font = "800 16px sans-serif";
          ctx.fillStyle = "#ef4444";
          ctx.textAlign = "left";
          ctx.fillText("⚠️ TITIK KRITIS YANG HARUS DIPERHATIKAN:", cardX + 24, cardY + 40);

          const painPoints = [
            { tag: "🛑 MASALAH 1", desc: "Pola kebiasaan yang terus berulang tanpa disadari" },
            { tag: "📉 DAMPAKNYA", desc: "Hasil tidak maksimal & tenaga terbuang sia-sia" },
            { tag: "⏱️ JEBAKANNYA", desc: "Banyak orang baru tersadar saat terlambat" },
          ];

          painPoints.forEach((p, idx) => {
            const itemY = cardY + 62 + idx * 54;
            ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cardX + 20, itemY, cardW - 40, 44, 10);
            ctx.fill();
            ctx.stroke();

            ctx.font = "700 12px monospace";
            ctx.fillStyle = "#f43f5e";
            ctx.fillText(p.tag, cardX + 32, itemY + 27);

            ctx.font = "500 13px sans-serif";
            ctx.fillStyle = "#e2e8f0";
            ctx.fillText(p.desc, cardX + 140, itemY + 27);
          });
        } else if (sceneIndex === 2) {
          // Scene 3: Solution Blueprint (Content-Driven)
          ctx.font = "800 16px sans-serif";
          ctx.fillStyle = "#10b981";
          ctx.textAlign = "left";
          ctx.fillText("✨ FORMULA SOLUSI TERUJI & TERVALIDASI:", cardX + 24, cardY + 40);

          const solutionSteps = [
            { icon: "🎯", step: "LANGKAH 1", desc: "Identifikasi kebocoran & ubah sudut pandang" },
            { icon: "⚡", step: "LANGKAH 2", desc: "Terapkan formula teruji secara disiplin" },
            { icon: "💎", step: "HASIL AKHIR", desc: "Kondisi stabil & hasil terukur berkelanjutan" },
          ];

          solutionSteps.forEach((s, idx) => {
            const itemY = cardY + 62 + idx * 54;
            const isHighlight = idx === 1;

            ctx.fillStyle = isHighlight ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.04)";
            ctx.strokeStyle = isHighlight ? "rgba(16, 185, 129, 0.5)" : "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = isHighlight ? 1.5 : 1;
            ctx.beginPath();
            ctx.roundRect(cardX + 20, itemY, cardW - 40, 44, 10);
            ctx.fill();
            ctx.stroke();

            ctx.font = "16px sans-serif";
            ctx.fillText(s.icon, cardX + 32, itemY + 28);

            ctx.font = "700 12px monospace";
            ctx.fillStyle = isHighlight ? "#10b981" : "#94a3b8";
            ctx.fillText(s.step, cardX + 62, itemY + 27);

            ctx.font = "500 13px sans-serif";
            ctx.fillStyle = isHighlight ? "#ffffff" : "#cbd5e1";
            ctx.fillText(s.desc, cardX + 155, itemY + 27);
          });
        } else {
          // Scene 4: Conclusion & Action Call
          ctx.font = "800 16px sans-serif";
          ctx.fillStyle = "#38bdf8";
          ctx.textAlign = "left";
          ctx.fillText("📌 KESIMPULAN & TINDAKAN LANGSUNG:", cardX + 24, cardY + 40);

          const actions = [
            { icon: "💾", label: "Simpan video ini agar bisa dipelajari ulang kapan saja" },
            { icon: "🚀", label: "Bagikan ke rekan terdekat yang menghadapi hal serupa" },
          ];

          actions.forEach((a, idx) => {
            const itemY = cardY + 65 + idx * 50;
            ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.beginPath();
            ctx.roundRect(cardX + 20, itemY, cardW - 40, 42, 8);
            ctx.fill();
            ctx.stroke();

            ctx.font = "16px sans-serif";
            ctx.fillText(a.icon, cardX + 32, itemY + 26);

            ctx.fillStyle = "#e2e8f0";
            ctx.font = "600 13px sans-serif";
            ctx.fillText(a.label, cardX + 60, itemY + 26);
          });

          // Action Pulse Button
          const btnY = cardY + 175;
          ctx.fillStyle = "rgba(16, 185, 129, 0.22)";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(cardX + 20, btnY, cardW - 40, 48, 12);
          ctx.fill();
          ctx.stroke();

          ctx.font = "800 15px monospace";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText("✓ TONTON ULANG DARI AWAL", cardX + cardW / 2, btnY + 29);
          ctx.textAlign = "left";
        }
        ctx.restore();
      }

      // 4. ZONE 2: DYNAMIC CENTER KINETIC TYPOGRAPHY (Rapid Karaoke Pop-In)
      ctx.save();
      ctx.globalAlpha = transitionAlpha;
      const timedPhrases = extractTimedPhrases(
        currentHeadline,
        currentSubtext,
        currentHighlight,
        currentMetric
      );

      // Active phrase based on scene local progress
      const activePhrase =
        timedPhrases.find((p) => sceneLocalProgress >= p.startPct && sceneLocalProgress < p.endPct) ||
        timedPhrases[timedPhrases.length - 1];

      const phraseDuration = Math.max(activePhrase.endPct - activePhrase.startPct, 0.08);
      const phraseProgress = (sceneLocalProgress - activePhrase.startPct) / phraseDuration;
      const phraseBounce =
        0.94 + Math.sin(Math.min(phraseProgress * 3.5, 1) * Math.PI) * 0.12;

      // Positioned comfortably in the center focal zone
      const phraseCenterY = showUpperCard ? 670 : 590;
      ctx.translate(W / 2, phraseCenterY);
      ctx.scale(phraseBounce, phraseBounce);

      const accentColor =
        motionStyle === "fintech-alpha"
          ? "#10b981"
          : motionStyle === "stoic-gold"
          ? "#f59e0b"
          : motionStyle === "swiss-minimalist"
          ? "#ef4444"
          : motionStyle === "retro-arcade"
          ? "#ec4899"
          : "#38bdf8";

      // Render Badge if present
      if (activePhrase.badge) {
        ctx.font = "800 18px monospace";
        ctx.fillStyle = accentColor;
        ctx.textAlign = "center";
        ctx.fillText(`[ ${activePhrase.badge} ]`, 0, -45);
      }

      // Font Family based on Archetype
      const fontFamily =
        motionStyle === "stoic-gold"
          ? "serif"
          : motionStyle === "cyber-hud" || motionStyle === "retro-arcade"
          ? "monospace"
          : "sans-serif";

      // Dynamic font auto-scaler with strict boundary protection so text NEVER truncates
      const pText = activePhrase.phraseText;
      const maxAllowedWidth = W - 140; // 580px max
      let fontSize = 48;
      ctx.font = `800 ${fontSize}px ${fontFamily}`;
      let textWidth = ctx.measureText(pText).width;

      while (textWidth > maxAllowedWidth && fontSize > 26) {
        fontSize -= 2;
        ctx.font = `800 ${fontSize}px ${fontFamily}`;
        textWidth = ctx.measureText(pText).width;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const hasHighlightWord =
        activePhrase.highlightWord && pText.includes(activePhrase.highlightWord);

      // Clamped highlight box so it NEVER clips on borders
      const boxW = Math.min(textWidth + 36, W - 80);
      const boxH = fontSize + 24;

      if (hasHighlightWord) {
        ctx.fillStyle = `${accentColor}25`;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 18;
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
      }

      ctx.fillText(pText, 0, 0);
      ctx.restore();

      // 5. ZONE 3: BOTTOM LIVING 3D VOXEL AVATAR (Anchored at Y: 1140, Scale: 0.74)
      if (showMascot) {
        ctx.save();
        ctx.globalAlpha = transitionAlpha;

        const isTalking =
          isPlaying && sceneLocalProgress > 0.02 && sceneLocalProgress < 0.94;

        if (characterLayout === "single") {
          // Single character anchored at center bottom with acoustic lip-sync
          drawVoxelAvatar(ctx, {
            cx: W / 2,
            cy: 1140,
            scale: 0.74,
            emotion: currentEmotion,
            isTalking,
            vocalVolume: currentVocalVolume,
            elapsed,
            outfit: "beanie-striped",
          });
        } else {
          // Duo character layout (Host on Left, Friend on Right)
          drawVoxelAvatar(ctx, {
            cx: W * 0.30,
            cy: 1140,
            scale: 0.64,
            emotion: currentEmotion,
            isTalking: isTalking && sceneLocalProgress < 0.5,
            vocalVolume: sceneLocalProgress < 0.5 ? currentVocalVolume : 0,
            elapsed,
            outfit: "beanie-striped",
          });

          drawVoxelAvatar(ctx, {
            cx: W * 0.70,
            cy: 1140,
            scale: 0.64,
            emotion: currentEmotion === "shocked" ? "skeptical" : currentEmotion,
            isTalking: isTalking && sceneLocalProgress >= 0.5,
            vocalVolume: sceneLocalProgress >= 0.5 ? currentVocalVolume : 0,
            elapsed,
            outfit: "hoodie-glasses",
          });
        }
        ctx.restore();
      }

      // 6. GLOBAL TIMELINE PROGRESS LINE AT BOTTOM
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(80, H - 50, W - 160, 6);

      ctx.fillStyle =
        motionStyle === "fintech-alpha"
          ? "#10b981"
          : motionStyle === "stoic-gold"
          ? "#f59e0b"
          : motionStyle === "swiss-minimalist"
          ? "#ef4444"
          : motionStyle === "retro-arcade"
          ? "#ec4899"
          : "#ffffff";
      ctx.fillRect(80, H - 50, (W - 160) * globalProgress, 6);
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
  }, [
    mode,
    scenes,
    singleHeadline,
    singleMetric,
    singleSubtext,
    motionStyle,
    totalDurationSec,
    isPlaying,
    showMascot,
    showUpperCard,
    characterLayout,
    audioEnabled,
    sfxEnabled,
    topicIdea,
    activeVaultInfo,
  ]);

  // In-Browser Native Video Recorder WITH EMBEDDED AUDIO
  const recordAndDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordProgress(0);

    // Initialize & resume audio engine
    const { ctx, dest } = getOrCreateAudioEngine();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    // Start BGM during recording if enabled
    if (bgmEnabled && loFiBgmRef.current) {
      loFiBgmRef.current.start();
    }

    // Reset loop timing to 0
    startTimeRef.current = Date.now();
    lastSceneIndexRef.current = -1;

    // Capture canvas visual stream at 30fps
    const canvasStream = (canvas as any).captureStream(30);

    // Grab audio tracks from Web Audio destination node
    const audioTracks = dest.stream.getAudioTracks();

    // Mux video and audio into a single stream
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);

    let mimeType = "video/webm;codecs=vp9,opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm;codecs=vp8,opus";
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 8000000, // 8 Mbps high quality HD
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      if (chunks.length === 0) {
        console.warn("Recording yielded empty buffer");
        setIsRecording(false);
        return;
      }
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `buatprompt-kinetic-${mode}-${totalDurationSec}s-audio.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setRecordProgress(100);
    };

    // Emit timeslice chunks every 250ms for reliable, non-truncated webm output
    recorder.start(250);

    // Track recording progress
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
          <span>MULTI-SCENE KINETIC DIRECTOR & OPUSCAR AFTER EFFECTS ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Scene Kinetic Video Studio
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          Hasil sekelas biro iklan internasional! Dilengkapi **Showcase Card Interaktif**, **Tipografi Kinetik Tengah Berpegas (*karaoke-style*)**, **Karakter 3D Voxel dengan Mulut Bergerak Bicara (*lip-sync*)**, serta **Full Audio Muxing (Voiceover + SFX + BGM)** langsung terunduh ke file video tanpa CapCut!
        </p>
      </div>

      {/* Mode & Audio Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
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
            <span>FULL 4-SCENE STORY MOVIE ({totalDurationSec}s)</span>
            <span className="bg-emerald-500/20 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ml-1">
              Rekomendasi
            </span>
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
            <span>SINGLE HOOK CLIP (6s)</span>
          </button>
        </div>

        {/* Audio & Character Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Voiceover Toggle */}
          <button
            type="button"
            onClick={() => {
              getOrCreateAudioEngine();
              setAudioEnabled(!audioEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border transition-colors cursor-pointer ${
              audioEnabled
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-white/10 bg-black/40 text-zinc-500 hover:text-white"
            }`}
          >
            {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>Voiceover: {audioEnabled ? "AKTIF ✓" : "MUTE"}</span>
          </button>

          {/* Microsoft Azure Neural Voice Selector */}
          <div className="flex items-center gap-1 rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => {
                getOrCreateAudioEngine();
                setVoiceActor("id-ID-ArdiNeural");
              }}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                voiceActor === "id-ID-ArdiNeural"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🎙️ Ardi (Pria)
            </button>
            <button
              type="button"
              onClick={() => {
                getOrCreateAudioEngine();
                setVoiceActor("id-ID-GadisNeural");
              }}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                voiceActor === "id-ID-GadisNeural"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🎙️ Gadis (Wanita)
            </button>
          </div>

          {/* Lo-Fi BGM Toggle */}
          <button
            type="button"
            onClick={() => {
              getOrCreateAudioEngine();
              setBgmEnabled(!bgmEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border transition-colors cursor-pointer ${
              bgmEnabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-black/40 text-zinc-500 hover:text-white"
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            <span>BGM Lo-Fi: {bgmEnabled ? "ON ✓" : "OFF"}</span>
          </button>

          {/* Character Layout Toggle */}
          <button
            type="button"
            onClick={() => setCharacterLayout(characterLayout === "single" ? "duo" : "single")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border border-white/10 bg-black/40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {characterLayout === "single" ? <User className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5 text-emerald-400" />}
            <span>Avatar: {characterLayout === "single" ? "1 Host" : "Duo"}</span>
          </button>

          {/* Showcase Card Toggle */}
          <button
            type="button"
            onClick={() => setShowUpperCard(!showUpperCard)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border transition-colors cursor-pointer ${
              showUpperCard
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-black/40 text-zinc-500 hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Showcase: {showUpperCard ? "ON ✓" : "OFF"}</span>
          </button>

          {/* Character Mascot Toggle */}
          <button
            type="button"
            onClick={() => setShowMascot(!showMascot)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs border transition-colors cursor-pointer ${
              showMascot
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-black/40 text-zinc-500 hover:text-white"
            }`}
          >
            <Smile className="h-3.5 w-3.5" />
            <span>Maskot: {showMascot ? "ON ✓" : "OFF"}</span>
          </button>
        </div>
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
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isPacingOverLimit ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {isPacingOverLimit ? "TERLALU PANJANG (>55s)" : "RETENSI OPTIMAL ✓"}
                </span>
              </>
            ) : (
              <>
                <span className="text-emerald-300 font-bold">AI Idea-to-Script Mode</span>
                <span className="text-zinc-500 mx-2">•</span>
                <span className="text-zinc-400">Target Durasi: </span>
                <span className="text-cyan-300 font-bold">
                  {durationTarget === "55s" ? "52-55 Detik (Golden Sweet Spot)" : "26 Detik (Express Quick Hook)"}
                </span>
                {isAudioLoading && (
                  <>
                    <span className="text-zinc-500 mx-2">•</span>
                    <span className="text-amber-300 animate-pulse">⏳ Prefetching Audio...</span>
                  </>
                )}
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
            {warningMessage ||
              `Naskah Anda (${wordCount} kata / ~${estimatedSeconds} detik) melebihi batas retensi optimal 55-60 detik.`}
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

                  {/* Target Duration & Knowledge Vault Selector */}
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
                        AIR-GAP KNOWLEDGE VAULT
                      </label>
                      <select
                        value={vaultDomain}
                        onChange={(e) => {
                          setVaultDomain(e.target.value);
                          setTargetNiche(e.target.value);
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="stoic_motivation">🏛️ Stoic & Motivasi (Marcus Aurelius)</option>
                        <option value="financial_wealth">📈 Finansial & Wealth (Buffett, 50/30/20)</option>
                        <option value="affiliate_conversion">💼 Affiliate (Cialdini, Persuasi)</option>
                        <option value="culinary_coffee">☕ Kuliner & Kopi (Ekstraksi 90°C)</option>
                        <option value="skincare_beauty">✨ Skincare & Beauty (Dermatologi)</option>
                        <option value="tech_productivity">⚡ Tech & Productivity (Steve Jobs, 80/20)</option>
                      </select>
                    </div>
                  </div>

                  {activeVaultInfo && (
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono space-y-1 animate-in fade-in">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Database className="h-3.5 w-3.5" />
                          <span>VAULT LOKAL: {activeVaultInfo.name.toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AIR-GAP DETERMINISTIC
                        </span>
                      </div>
                      {activeVaultInfo.quoteSnippet && (
                        <p className="text-[11px] text-zinc-300 italic leading-relaxed">
                          {activeVaultInfo.quoteSnippet}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleGenerateStory("idea")}
                      disabled={isGeneratingStory || !topicIdea.trim()}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-lg hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingStory ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>MENYUSUN 4 SCENE LENGKAP...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3.5 w-3.5" />
                          <span>🪄 BUAT NASKAH LENGKAP & SUSUN 4 SCENE OTOMATIS</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      title="Acak variasi kombinasi naskah (Combinatorial Seed)"
                      onClick={() => {
                        const newSeed = variantSeed + 1;
                        setVariantSeed(newSeed);
                        handleGenerateStory("idea", undefined, newSeed);
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
                    >
                      <Shuffle className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">VARIASI</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* TAB 2: PASTE CUSTOM SCRIPT */
                <div className="space-y-3 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold text-zinc-300">
                      PASTE ARTIKEL / NASKAH PANJANG ANDA
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Akan dibedah presisi jadi 4 Babak
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={rawScriptInput}
                    onChange={(e) => setRawScriptInput(e.target.value)}
                    placeholder="Contoh: Salin draf materi konten atau artikel Anda di sini... Sistem akan otomatis menghitung jumlah kata dan durasi bicaranya."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none font-mono font-medium leading-relaxed"
                  />
                  <div className="flex gap-2 pt-1">
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
                </div>
              </div>
            </div>
          ) : (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "apple-keynote", name: "Apple Keynote Luxury" },
                { id: "fintech-alpha", name: "Wall St / FinTech Alpha" },
                { id: "cyber-hud", name: "Cyberpunk Tech HUD" },
                { id: "stoic-gold", name: "Dark Stoic & Warm Ember" },
                { id: "swiss-minimalist", name: "Swiss Bauhaus Minimalist" },
                { id: "retro-arcade", name: "Retro Arcade & Neon Synth" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setMotionStyle(st.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                    motionStyle === st.id
                      ? "border-emerald-400 bg-emerald-500/10 text-white font-bold shadow-md shadow-emerald-500/10"
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
                    <span>MEREKAM CANVAS + FULL AUDIO ({recordProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>
                      {mode === "multi"
                        ? `REKAM & DOWNLOAD FULL ${totalDurationSec}s VIDEO + AUDIO (9:16 HD)`
                        : `REKAM & DOWNLOAD CLIP ${totalDurationSec}s (9:16 HD)`}
                    </span>
                  </>
                )}
              </button>
              <p className="text-[11px] font-mono text-zinc-400 text-center mt-2">
                ⚡ 100% In-Browser. Voiceover + Foley SFX + Lo-Fi BGM otomatis termuxing ke file video. Siap posting tanpa CapCut.
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
              <canvas ref={canvasRef} className="w-full h-full object-cover" />

              {/* Recording Overlay Tag */}
              {isRecording && (
                <div className="absolute top-6 left-4 flex items-center gap-2 bg-rose-500/90 text-white font-mono text-[10px] px-2.5 py-1 rounded-full shadow-lg z-30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC + AUDIO {recordProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-zinc-400">
            <button
              onClick={() => {
                getOrCreateAudioEngine();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>{isPlaying ? "Pause Preview" : "Play Preview"}</span>
            </button>
            <span className="text-zinc-600">|</span>
            <span className="text-[11px] text-zinc-400">
              Durasi: {totalDurationSec}s • 720 × 1280 (9:16 HD)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
