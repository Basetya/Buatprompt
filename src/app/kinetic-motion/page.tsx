"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Square,
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
  Upload,
  Image as ImageIcon,
  Cpu,
  Trash2,
  Palette,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  extractTimedPhrases,
  playProceduralSFX,
  ProceduralLoFiBGM,
  fetchAndDecodeTTS,
  drawVoxelAvatar,
  drawRiggedHumanHost,
  drawHumanCutoutAvatar,
  MOTION_PALETTES,
  HUMAN_2D_PRESETS,
  VOXEL_3D_PRESETS,
  type MotionStyleId,
  type Human2DPresetId,
  type VoxelPresetId,
} from "@/lib/mographEngine";
import { KNOWLEDGE_VAULT } from "@/lib/knowledgeVault";

export type PresenterPoseId =
  | "friendly-anchor"
  | "problem-shrug"
  | "secret-lean"
  | "explainer"
  | "eureka-point"
  | "chin-thinker"
  | "comparison"
  | "strong-cta";

export const PRESENTER_POSES: Record<
  PresenterPoseId,
  {
    id: PresenterPoseId;
    label: string;
    icon: string;
    desc: string;
    stance: "standing" | "seated";
    tiltDeg: number;
    scaleMultiplier: number;
    yOffset: number;
    badgeEmoji: string;
    badgeText: string;
    glowColor: string;
  }
> = {
  "friendly-anchor": {
    id: "friendly-anchor",
    label: "The Friendly Anchor",
    icon: "👋",
    desc: "Sapaan Hangat & Hook Pembuka",
    stance: "standing",
    tiltDeg: 0,
    scaleMultiplier: 1.0,
    yOffset: 0,
    badgeEmoji: "",
    badgeText: "",
    glowColor: "#38bdf8",
  },
  "problem-shrug": {
    id: "problem-shrug",
    label: "The Problem Shrug",
    icon: "🤷",
    desc: "Bingung / Mitos / Masalah Keras",
    stance: "standing",
    tiltDeg: -8,
    scaleMultiplier: 1.03,
    yOffset: -8,
    badgeEmoji: "❓",
    badgeText: "KENAPA YA?",
    glowColor: "#f87171",
  },
  "secret-lean": {
    id: "secret-lean",
    label: "The Secret Lean-In",
    icon: "🤫",
    desc: "Membocorkan Rahasia / Bisikan Eksklusif",
    stance: "standing",
    tiltDeg: 3,
    scaleMultiplier: 1.12,
    yOffset: -18,
    badgeEmoji: "🤫",
    badgeText: "BOCORAN RAHASIA",
    glowColor: "#a855f7",
  },
  "explainer": {
    id: "explainer",
    label: "The Explainer",
    icon: "📐",
    desc: "Menjelaskan Konsep Logika & Langkah",
    stance: "standing",
    tiltDeg: 2,
    scaleMultiplier: 1.02,
    yOffset: -4,
    badgeEmoji: "⚡",
    badgeText: "CARA KERJA",
    glowColor: "#38bdf8",
  },
  "eureka-point": {
    id: "eureka-point",
    label: "The Eureka Point",
    icon: "💡",
    desc: "Ide Cemerlang / Solusi Emas Terbongkar",
    stance: "standing",
    tiltDeg: -2,
    scaleMultiplier: 1.06,
    yOffset: -10,
    badgeEmoji: "💡",
    badgeText: "KUNCINYA INI!",
    glowColor: "#fbbf24",
  },
  "chin-thinker": {
    id: "chin-thinker",
    label: "The Chin Thinker",
    icon: "🤔",
    desc: "Merenung & Ajak Penonton Menganalisis",
    stance: "seated",
    tiltDeg: 5,
    scaleMultiplier: 1.04,
    yOffset: -6,
    badgeEmoji: "💭",
    badgeText: "COBA PIKIRKAN",
    glowColor: "#60a5fa",
  },
  "comparison": {
    id: "comparison",
    label: "The Comparison",
    icon: "⚖️",
    desc: "Bandingkan Cara Salah vs Cara Benar",
    stance: "standing",
    tiltDeg: 0,
    scaleMultiplier: 1.02,
    yOffset: -2,
    badgeEmoji: "⚖️",
    badgeText: "SALAH VS BENAR",
    glowColor: "#f97316",
  },
  "strong-cta": {
    id: "strong-cta",
    label: "The Strong CTA",
    icon: "🎯",
    desc: "Ajakan Mantap / Follow / Save",
    stance: "standing",
    tiltDeg: -1,
    scaleMultiplier: 1.08,
    yOffset: -12,
    badgeEmoji: "🔔",
    badgeText: "FOLLOW & SAVE!",
    glowColor: "#10b981",
  },
};

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
  suggestedPose?: PresenterPoseId;
  kineticFx: string;
  foleyCue: string;
}

const INITIAL_STUDIO_SCENES: StoryScene[] = [
  {
    sceneNumber: 1,
    stageName: "HOOK",
    timeRange: "0:00 - 0:08",
    headline: "TULIS TOPIK VIDEO ANDA DI PANEL KIRI",
    subtext: "Masukkan ide atau naskah Anda sendiri, lalu klik tombol Susun 4 Scene Otomatis.",
    metric: "SIAP MULAI",
    highlightKeyword: "TOPIK",
    durationSec: 8,
    characterEmotion: "shocked",
    suggestedPose: "friendly-anchor",
    kineticFx: "Spring Punch Scale",
    foleyCue: "0:00 Fast Whoosh",
  },
  {
    sceneNumber: 2,
    stageName: "MASALAH",
    timeRange: "0:08 - 0:16",
    headline: "OTOMATIS DETEKSI KONTEKS TOPIK",
    subtext: "Mesin sintesis akan menyesuaikan fakta dan alur cerita murni sesuai topik yang Anda ketik.",
    metric: "100% RELEVAN",
    highlightKeyword: "KONTEKS",
    durationSec: 8,
    characterEmotion: "skeptical",
    suggestedPose: "problem-shrug",
    kineticFx: "Slide-Up Masked Reveal",
    foleyCue: "0:08 Camera Snap",
  },
  {
    sceneNumber: 3,
    stageName: "SOLUSI",
    timeRange: "0:16 - 0:24",
    headline: "PILIH GAYA VISUAL DAN AVATAR",
    subtext: "Atur karakter Human 2D, Foto Sendiri, atau 3D Voxel beserta 12 gaya visual yang tersedia.",
    metric: "12 GAYA",
    highlightKeyword: "VISUAL",
    durationSec: 8,
    characterEmotion: "celebrate",
    suggestedPose: "eureka-point",
    kineticFx: "Editorial Sweep Underline",
    foleyCue: "0:16 Harmonic Swell",
  },
  {
    sceneNumber: 4,
    stageName: "AKSI",
    timeRange: "0:24 - 0:32",
    headline: "REKAM DAN UNDUH HASIL HD",
    subtext: "Klik tombol Rekam dan Download untuk menyimpan video vertikal lengkap dengan suara.",
    metric: "9:16 HD",
    highlightKeyword: "UNDUH",
    durationSec: 8,
    characterEmotion: "point-cta",
    suggestedPose: "strong-cta",
    kineticFx: "Spotlight Tilt",
    foleyCue: "0:24 Bell Ding",
  },
];

export default function KineticMotionPage() {
  const [mode, setMode] = useState<"multi" | "single">("multi");
  const [creationTab, setCreationTab] = useState<"idea" | "script">("idea");
  const [durationTarget, setDurationTarget] = useState<"55s" | "26s">("55s");
  const [targetNiche, setTargetNiche] = useState("auto");
  const [vaultDomain, setVaultDomain] = useState("auto");
  const [variantSeed, setVariantSeed] = useState(0);
  const [activeVaultInfo, setActiveVaultInfo] = useState<{
    id: string;
    name: string;
    badge: string;
    quoteSnippet?: string;
    authorSnippet?: string;
  } | null>(null);
  const [topicIdea, setTopicIdea] = useState("");
  const [rawScriptInput, setRawScriptInput] = useState("");
  const [scenes, setScenes] = useState<StoryScene[]>(INITIAL_STUDIO_SCENES);
  const [activeSceneTab, setActiveSceneTab] = useState(0);
  const [showMascot, setShowMascot] = useState(true);
  const [showUpperCard, setShowUpperCard] = useState(true);

  // Serialized Educational Multi-Part State (1-4 Parts)
  const [seriesCount, setSeriesCount] = useState<number>(1);
  const [seriesEpisodes, setSeriesEpisodes] = useState<
    Array<{ partNumber: number; partTitle: string; scenes: StoryScene[] }>
  >([]);
  const [activeSeriesPart, setActiveSeriesPart] = useState<number>(1);

  const selectSeriesPart = (partNum: number) => {
    const ep = seriesEpisodes.find((e) => e.partNumber === partNum);
    if (ep) {
      setActiveSeriesPart(partNum);
      setScenes(ep.scenes);
      setActiveSceneTab(0);
      startTimeRef.current = Date.now();
      pausedElapsedRef.current = 0;
      lastSceneIndexRef.current = -1;
      playedSceneAudioRef.current = -1;
    }
  };

  // Audio Engine State
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [characterLayout, setCharacterLayout] = useState<"single" | "duo">("single");
  const [voiceActor, setVoiceActor] = useState<string>("kang-sarah");
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Single mode state
  const [singleHeadline, setSingleHeadline] = useState("90% ORANG GAGAL KARENA HAL INI");
  const [singleMetric, setSingleMetric] = useState("+340%");
  const [singleSubtext, setSingleSubtext] = useState("Bukan karena kurang modal, tapi karena salah eksekusi di detik awal.");
  const [singleDuration, setSingleDuration] = useState(6);

  const [motionStyle, setMotionStyle] = useState<MotionStyleId>("apple-keynote");
  const [favoriteStyles, setFavoriteStyles] = useState<MotionStyleId[]>([
    "editorial-light",
    "midnight-slate",
    "apple-keynote",
  ]);
  const [styleFilter, setStyleFilter] = useState<"all" | "favorites">("all");
  const [avatarEngine, setAvatarEngine] = useState<"human-rigged" | "photo-cutout" | "voxel">("human-rigged");
  const [humanPreset, setHumanPreset] = useState<Human2DPresetId>("tech-creator");
  const [voxelPreset, setVoxelPreset] = useState<VoxelPresetId>("beanie-striped");
  const [avatarPhotos, setAvatarPhotos] = useState<Record<number, string>>({});
  const [avatarFraming, setAvatarFraming] = useState<"half-body" | "full-body">("half-body");
  const [showSafeZoneGuide, setShowSafeZoneGuide] = useState<boolean>(false);
  // Contextual Character Action Sheet (2x2 Grid Multi-Pose Workflow)
  const [uploadMode, setUploadMode] = useState<"sheet" | "manual">("sheet");
  const [personaDesc, setPersonaDesc] = useState<string>(
    "Wanita muda Indonesia berhijab rapi warna mocca, kemeja blazer marun elegan, celana bahan abu-abu, ramah dan profesional"
  );
  const [autoCutoutWhite, setAutoCutoutWhite] = useState<boolean>(true);
  const [isSlicingSheet, setIsSlicingSheet] = useState<boolean>(false);
  const [sheetSliceSuccess, setSheetSliceSuccess] = useState<boolean>(false);
  const [showPromptBox, setShowPromptBox] = useState<boolean>(true);
  const [sheetPromptCopied, setSheetPromptCopied] = useState<boolean>(false);
  const avatarImgElementsRef = useRef<Record<number, HTMLImageElement>>({});
  const [localGpuInfo, setLocalGpuInfo] = useState<{
    gpuAvailable: boolean;
    gpuName: string | null;
    note: string;
  } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedFileName, setRecordedFileName] = useState<string>("buatprompt-kinetic-video.webm");
  const [recordError, setRecordError] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Web Audio Graph References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const loFiBgmRef = useRef<ProceduralLoFiBGM | null>(null);
  const audioBuffersRef = useRef<Record<number, AudioBuffer>>({});
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const activeAudioGainRef = useRef<GainNode | null>(null);
  const lastSceneIndexRef = useRef<number>(-1);
  const playedSceneAudioRef = useRef<number>(-1);
  const scene0PromiseRef = useRef<Promise<void> | null>(null);
  const pausedElapsedRef = useRef<number>(0);
  const isRecordingRef = useRef<boolean>(false);
  const recordingSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const renderFrameRef = useRef<(() => void) | null>(null);
  const recordingTickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Play voiceover AudioBuffer immediately for a given scene & offset
  const playSceneVoiceNow = useCallback(
    (sceneIdx: number, offsetSec: number = 0) => {
      if (!audioEnabled || !audioCtxRef.current || !audioDestRef.current) return false;
      if (audioCtxRef.current.state !== "running") return false;
      const buf = audioBuffersRef.current[sceneIdx];
      if (!buf) return false;

      if (activeAudioSourceRef.current && activeAudioGainRef.current) {
        try {
          const t = audioCtxRef.current.currentTime;
          activeAudioGainRef.current.gain.setValueAtTime(activeAudioGainRef.current.gain.value, t);
          activeAudioGainRef.current.gain.linearRampToValueAtTime(0.001, t + 0.06);
          const oldSrc = activeAudioSourceRef.current;
          setTimeout(() => {
            try { oldSrc.stop(); oldSrc.disconnect(); } catch (_) { }
          }, 70);
        } catch (_) { }
      }

      if (offsetSec < buf.duration - 0.1) {
        try {
          const src = audioCtxRef.current.createBufferSource();
          const gain = audioCtxRef.current.createGain();
          src.buffer = buf;
          src.connect(gain);
          if (analyserRef.current) {
            gain.connect(analyserRef.current);
          }
          gain.connect(audioCtxRef.current.destination);
          gain.connect(audioDestRef.current);
          src.start(0, Math.max(0, offsetSec));
          activeAudioSourceRef.current = src;
          activeAudioGainRef.current = gain;
        } catch (err) {
          console.warn("Buffer playback notice:", err);
        }
      }
      playedSceneAudioRef.current = sceneIdx;
      return true;
    },
    [audioEnabled]
  );

  // Pre-fetch Scene 0 FIRST for instant playback, then remaining scenes in parallel
  const prefetchTTSForScenes = useCallback(
    async (sceneList: StoryScene[], voice: string = voiceActor) => {
      try {
        setIsAudioLoading(true);
        const { ctx } = getOrCreateAudioEngine();

        const fetchOne = async (s: StoryScene, i: number) => {
          const spokenText = `${s.headline}. ${s.subtext}`;
          const buf = await fetchAndDecodeTTS(ctx, spokenText, {
            voice,
            emotion: s.characterEmotion || "normal",
          });
          if (buf) {
            audioBuffersRef.current[i] = buf;
            // Auto-expand scene duration so speech is never clipped before sentence ends naturally
            const neededDuration = Math.ceil(buf.duration + 0.35);
            if (neededDuration > s.durationSec) {
              s.durationSec = neededDuration;
            }
            if (i === 0 && playedSceneAudioRef.current === 0) {
              playedSceneAudioRef.current = -1;
            }
          }
        };

        if (sceneList.length > 0) {
          const p0 = fetchOne(sceneList[0], 0);
          scene0PromiseRef.current = p0;
          await p0;
        }
        if (sceneList.length > 1) {
          await Promise.all(sceneList.slice(1).map((s, idx) => fetchOne(s, idx + 1)));
        }
      } catch (err) {
        console.warn("Audio prefetch notice:", err);
      } finally {
        setIsAudioLoading(false);
      }
    },
    [getOrCreateAudioEngine, voiceActor]
  );

  // Synchronous, Race-Condition-Free Preview Playback Engine (Anti-Regression Protocol)
  const handleStopPreview = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = 0;
    pausedElapsedRef.current = 0;
    lastSceneIndexRef.current = -1;
    playedSceneAudioRef.current = -1;

    // Immediately halt and disconnect voiceover audio
    if (activeAudioSourceRef.current) {
      try {
        activeAudioSourceRef.current.stop();
        activeAudioSourceRef.current.disconnect();
      } catch (_) { }
      activeAudioSourceRef.current = null;
    }
    if (loFiBgmRef.current) {
      try {
        loFiBgmRef.current.stop();
      } catch (_) { }
    }

    // Paint static frame 0.00s without restarting RAF loop
    if (renderFrameRef.current) {
      renderFrameRef.current();
    }
  }, []);

  const handlePausePreview = useCallback(() => {
    if (!isPlayingRef.current) return;
    if (startTimeRef.current) {
      pausedElapsedRef.current = Date.now() - startTimeRef.current;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Silence active voiceover immediately
    if (activeAudioSourceRef.current) {
      try {
        activeAudioSourceRef.current.stop();
        activeAudioSourceRef.current.disconnect();
      } catch (_) { }
      activeAudioSourceRef.current = null;
    }
    if (loFiBgmRef.current) {
      try {
        loFiBgmRef.current.stop();
      } catch (_) { }
    }
    playedSceneAudioRef.current = -1;

    // Paint static paused frame at exact paused time
    if (renderFrameRef.current) {
      renderFrameRef.current();
    }
  }, []);

  const handleStartOrResumePreview = useCallback(async () => {
    if (isRecordingRef.current) return;
    const { ctx } = getOrCreateAudioEngine();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    startTimeRef.current = Date.now() - (pausedElapsedRef.current || 0);
    playedSceneAudioRef.current = -1;
    if (bgmEnabled && loFiBgmRef.current) {
      loFiBgmRef.current.start();
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    if (renderFrameRef.current) {
      renderFrameRef.current();
    }
  }, [bgmEnabled, getOrCreateAudioEngine]);

  const handleReplayFromStart = useCallback(async () => {
    if (isRecordingRef.current) return;
    const { ctx } = getOrCreateAudioEngine();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (!audioBuffersRef.current[0] && scene0PromiseRef.current) {
      await scene0PromiseRef.current;
    }
    if (activeAudioSourceRef.current) {
      try {
        activeAudioSourceRef.current.stop();
        activeAudioSourceRef.current.disconnect();
      } catch (_) { }
      activeAudioSourceRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    startTimeRef.current = Date.now();
    pausedElapsedRef.current = 0;
    lastSceneIndexRef.current = 0;
    playedSceneAudioRef.current = -1;

    if (bgmEnabled && loFiBgmRef.current) {
      loFiBgmRef.current.start();
    }
    if (sfxEnabled && audioDestRef.current) {
      playProceduralSFX(ctx, [ctx.destination, audioDestRef.current], "whoosh");
    }

    playSceneVoiceNow(0, 0);
    isPlayingRef.current = true;
    setIsPlaying(true);

    if (renderFrameRef.current) {
      renderFrameRef.current();
    }
  }, [bgmEnabled, sfxEnabled, getOrCreateAudioEngine, playSceneVoiceNow]);

  // Trigger audio prefetch when scenes or voice actor change
  useEffect(() => {
    audioBuffersRef.current = {};
    prefetchTTSForScenes(scenes, voiceActor);
  }, [scenes, voiceActor, prefetchTTSForScenes]);

  // Check local GPU / Python AI Lip-Sync capability & load favorite archetypes
  useEffect(() => {
    fetch("/api/local-lipsync")
      .then((r) => r.json())
      .then((d) => setLocalGpuInfo(d))
      .catch(() => { });

    try {
      const savedFavs = localStorage.getItem("buatprompt_favorite_archetypes");
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavoriteStyles(parsed);
        }
      }
    } catch (_) { }
  }, []);

  const toggleFavoriteStyle = (id: MotionStyleId) => {
    setFavoriteStyles((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("buatprompt_favorite_archetypes", JSON.stringify(next));
      } catch (_) { }
      return next;
    });
  };

  const [isProcessingCutout, setIsProcessingCutout] = useState<Record<number, boolean>>({});

  // 100% In-Browser & Air-Gapped Intelligent Background Removal (Canvas Chroma & Edge Feathering)
  const removeBackgroundInBrowser = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(dataUrl);

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Sample corner pixels to calculate background color baseline
        const corners = [
          0,
          Math.min(4, w - 1) * 4,
          (w - 1) * 4,
          ((h - 1) * w) * 4,
          ((h - 1) * w + (w - 1)) * 4,
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        corners.forEach((idx) => {
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR = Math.round(bgR / corners.length);
        bgG = Math.round(bgG / corners.length);
        bgB = Math.round(bgB / corners.length);

        // Smart color distance thresholding with feathered alpha edge
        const threshold = 40;
        const feather = 20;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );

          if (dist < threshold) {
            data[i + 3] = 0; // Fully transparent
          } else if (dist < threshold + feather) {
            const alphaFactor = (dist - threshold) / feather;
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleAutoCutout = async (sceneIdx: number) => {
    const rawUrl = avatarPhotos[sceneIdx];
    if (!rawUrl) return;
    setIsProcessingCutout((prev) => ({ ...prev, [sceneIdx]: true }));
    try {
      const cutoutUrl = await removeBackgroundInBrowser(rawUrl);
      const img = new window.Image();
      img.onload = () => {
        avatarImgElementsRef.current[sceneIdx] = img;
        setAvatarPhotos((prev) => ({ ...prev, [sceneIdx]: cutoutUrl }));
      };
      img.src = cutoutUrl;
    } finally {
      setIsProcessingCutout((prev) => ({ ...prev, [sceneIdx]: false }));
    }
  };

  const applyPhotoToAllScenes = () => {
    const masterPhoto = avatarPhotos[0] || avatarPhotos[activeSceneTab];
    if (!masterPhoto) return;
    const masterImg = avatarImgElementsRef.current[0] || avatarImgElementsRef.current[activeSceneTab];

    const newPhotos: Record<number, string> = {};
    for (let i = 0; i < 4; i++) {
      newPhotos[i] = masterPhoto;
      if (masterImg) avatarImgElementsRef.current[i] = masterImg;
    }
    setAvatarPhotos(newPhotos);
    setAvatarEngine("photo-cutout");
  };

  // Handle Custom Human Photo Upload for Multi-Pose Cutout Avatar
  const handleAvatarUpload = (sceneIdx: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        avatarImgElementsRef.current[sceneIdx] = img;
        setAvatarPhotos((prev) => ({ ...prev, [sceneIdx]: dataUrl }));
        setAvatarEngine("photo-cutout");
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const removeAvatarPhoto = (sceneIdx: number) => {
    delete avatarImgElementsRef.current[sceneIdx];
    setAvatarPhotos((prev) => {
      const next = { ...prev };
      delete next[sceneIdx];
      return next;
    });
  };

  const PERSONA_PRESETS = [
    {
      label: "🧕 Hijab Elegan",
      desc: "Wanita muda Indonesia berhijab rapi warna mocca, kemeja blazer marun elegan, celana bahan abu-abu, ramah dan profesional",
    },
    {
      label: "👔 Pria Eksekutif",
      desc: "Pria muda Indonesia, rambut rapi klimis, kemeja putih berlapis rompi rajut navy modern, celana chino beige, ramah dan karismatik",
    },
    {
      label: "👕 Kreator Santai",
      desc: "Pria muda kasual, kaos oversized warna sage green, celana jeans gelap, jam tangan sporty, gaya tech YouTuber Indonesia",
    },
    {
      label: "👩 Wanita Modern",
      desc: "Wanita muda Indonesia, rambut sebahu rapi, kemeja linen broken white, celana kulot hitam, gaya minimalis aesthetic",
    },
    {
      label: "👨‍🍳 Kuliner / UMKM",
      desc: "Pemuda ramah Indonesia mengenakan celemek (apron) barista cokelat kulit dan kaos hitam, senyum hangat pemilik kedai",
    },
  ];

  // Generate Contextual 2x2 Character Action Sheet Prompt based on Script & Persona
  const generateActionSheetPrompt = useCallback(() => {
    const s1 = scenes[0] || { headline: "Hook Pembuka", subtext: "" };
    const s2 = scenes[1] || { headline: "Masalah / Frustasi", subtext: "" };
    const s3 = scenes[2] || { headline: "Solusi / Rekomendasi", subtext: "" };
    const s4 = scenes[3] || { headline: "Ajakan Bertindak (CTA)", subtext: "" };

    const getContextualAction = (headline: string, subtext: string, sceneNum: number) => {
      const text = `${headline} ${subtext}`.toLowerCase();
      if (sceneNum === 1) {
        if (text.includes("kopi") || text.includes("minum") || text.includes("cafe")) {
          return "holding a warm ceramic cup of coffee, welcoming eye contact and an inviting warm smile";
        }
        if (text.includes("hp") || text.includes("ponsel") || text.includes("smartphone") || text.includes("gadget")) {
          return "holding up a modern smartphone displaying a glowing screen towards the viewer, excited hook expression";
        }
        if (text.includes("uang") || text.includes("cuan") || text.includes("bisnis") || text.includes("omset") || text.includes("modal")) {
          return "holding a premium leather cardholder or credit card with an enthusiastic confident smile";
        }
        if (text.includes("makanan") || text.includes("kuliner") || text.includes("masak") || text.includes("resep")) {
          return "presenting a delicious culinary dish on a wooden tray, proud joyful expression";
        }
        return "standing confidently looking directly at the camera with engaging wide eyes, making an open-palm welcoming gesture";
      }

      if (sceneNum === 2) {
        if (text.includes("macet") || text.includes("lelah") || text.includes("pusing") || text.includes("stres")) {
          return "frustrated and overwhelmed, one hand gently pressing the temple or forehead, head slightly tilted with distressed relatable frown";
        }
        if (text.includes("rugi") || text.includes("mahal") || text.includes("gagal") || text.includes("bingung")) {
          return "scratching head in complete confusion with one hand, shrugging other shoulder with open helpless palm, puzzled expression";
        }
        if (text.includes("hp") || text.includes("laptop") || text.includes("komputer") || text.includes("koneksi")) {
          return "looking down at an unresponsive device with an annoyed and skeptical furrowed brow";
        }
        return "scratching back of head with right hand, shrugging left shoulder, skeptical and questioning facial expression";
      }

      if (sceneNum === 3) {
        if (text.includes("rahasia") || text.includes("trik") || text.includes("tips") || text.includes("cara")) {
          return "excited eureka revelation moment, holding up right index finger as if unveiling a brilliant secret, bright victorious smile";
        }
        if (text.includes("cepat") || text.includes("mudah") || text.includes("solusi") || text.includes("otomatis")) {
          return "relaxed and confident posture, holding the hero solution item proudly with two hands, radiant reassuring smile";
        }
        if (text.includes("cuan") || text.includes("untung") || text.includes("hemat") || text.includes("sukses")) {
          return "delighted cheerful celebration, giving an enthusiastic thumbs up with a glowing victorious look";
        }
        return "eureka moment of clarity, smiling brightly with eyes lit up, pointing index finger upward as the solution clicks, confident hero stance";
      }

      // Scene 4: CTA
      if (text.includes("link") || text.includes("bio") || text.includes("klik") || text.includes("bawah")) {
        return "pointing down and forward directly towards the viewer / link area with a charming smile and persuasive eye contact";
      }
      if (text.includes("komen") || text.includes("share") || text.includes("follow") || text.includes("simpan")) {
        return "pointing directly at the viewer with both index fingers, friendly wink, inspiring immediate engagement";
      }
      return "high-energy call-to-action pose, pointing directly at the camera with an encouraging wide smile and inviting posture";
    };

    const action1 = getContextualAction(s1.headline, s1.subtext, 1);
    const action2 = getContextualAction(s2.headline, s2.subtext, 2);
    const action3 = getContextualAction(s3.headline, s3.subtext, 3);
    const action4 = getContextualAction(s4.headline, s4.subtext, 4);

    return `A cohesive 2x2 character action sheet grid showing the EXACT SAME character in 4 distinct narrative poses and emotional states, on a pure solid white background (#FFFFFF).

CHARACTER IDENTITY (STRICT CONSISTENCY):
${personaDesc.trim()}
CRITICAL: The person's face, ethnicity, age, hair/hijab style, exact clothing colors, shoes, and realistic proportions must be 100% IDENTICAL across all 4 panels.

THE 4 PANELS (2x2 GRID LAYOUT):
1. Top-Left Panel (Scene 1 - Hook Intro):
   - Pose & Gesture: ${action1}
   - Emotion: Engaging, energetic, captivating eye contact.
   - Script Context: "${s1.headline}"

2. Top-Right Panel (Scene 2 - The Problem):
   - Pose & Gesture: ${action2}
   - Emotion: Skeptical, confused, puzzled frown, relatable frustration.
   - Script Context: "${s2.headline}"

3. Bottom-Left Panel (Scene 3 - The Solution):
   - Pose & Gesture: ${action3}
   - Emotion: Eureka moment, victorious bright smile, confident relief.
   - Script Context: "${s3.headline}"

4. Bottom-Right Panel (Scene 4 - Call To Action):
   - Pose & Gesture: ${action4}
   - Emotion: Persuasive, high energy, motivating, warm encouraging smile.
   - Script Context: "${s4.headline}"

COMPOSITION & BACKGROUND:
- Clean 2x2 grid layout with distinct white spacing between panels.
- Pure solid white background (#FFFFFF) with absolutely NO background objects, NO gradient, and NO floor shadows.
- Standing or 3/4 medium-shot framing, consistent camera distance across all panels.
- Studio lighting, crisp sharp edges for clean chroma key cutout, 8k resolution, cinematic commercial quality.
--ar 1:1`;
  }, [personaDesc, scenes]);

  const copyActionSheetPrompt = async () => {
    const text = generateActionSheetPrompt();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
    setSheetPromptCopied(true);
    setTimeout(() => setSheetPromptCopied(false), 2500);
  };

  // 1-Click Auto-Slice & Clean Chroma Cutout for 2x2 Action Sheet
  const handleGridSheetUpload = (file: File | null) => {
    if (!file) return;
    setIsSlicingSheet(true);
    setSheetSliceSuccess(false);

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const sheetImg = new window.Image();
      sheetImg.onload = async () => {
        try {
          const origW = sheetImg.naturalWidth;
          const origH = sheetImg.naturalHeight;
          const halfW = Math.floor(origW / 2);
          const halfH = Math.floor(origH / 2);

          const quadrantCoords = [
            { sx: 0, sy: 0 },         // Q0: Top-Left (Hook)
            { sx: halfW, sy: 0 },     // Q1: Top-Right (Masalah)
            { sx: 0, sy: halfH },     // Q2: Bottom-Left (Solusi)
            { sx: halfW, sy: halfH }, // Q3: Bottom-Right (CTA)
          ];

          const newPhotos: Record<number, string> = {};
          const loadedImgs: Record<number, HTMLImageElement> = {};

          for (let i = 0; i < 4; i++) {
            const { sx, sy } = quadrantCoords[i];
            const qCanvas = document.createElement("canvas");
            qCanvas.width = halfW;
            qCanvas.height = halfH;
            const qCtx = qCanvas.getContext("2d", { willReadFrequently: true });
            if (!qCtx) continue;

            // Draw this quadrant slice
            qCtx.drawImage(sheetImg, sx, sy, halfW, halfH, 0, 0, halfW, halfH);

            if (autoCutoutWhite) {
              // High-precision Pure White / Light Chroma Removal with feathered edges
              const imgData = qCtx.getImageData(0, 0, halfW, halfH);
              const d = imgData.data;

              // Sample quadrant corners to get ambient white level
              let bgR = 0, bgG = 0, bgB = 0, sCount = 0;
              const samplePts = [
                [3, 3],
                [halfW - 4, 3],
                [3, halfH - 4],
                [halfW - 4, halfH - 4],
                [Math.floor(halfW / 2), 3],
              ];
              for (const [px, py] of samplePts) {
                const idx = (py * halfW + px) * 4;
                bgR += d[idx];
                bgG += d[idx + 1];
                bgB += d[idx + 2];
                sCount++;
              }
              const avgBgR = sCount > 0 ? bgR / sCount : 255;
              const avgBgG = sCount > 0 ? bgG / sCount : 255;
              const avgBgB = sCount > 0 ? bgB / sCount : 255;
              const isWhiteLike = (avgBgR + avgBgG + avgBgB) / 3 > 215;

              if (isWhiteLike) {
                for (let p = 0; p < d.length; p += 4) {
                  const pr = d[p];
                  const pg = d[p + 1];
                  const pb = d[p + 2];
                  const lum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
                  const satDiff = Math.max(pr, pg, pb) - Math.min(pr, pg, pb);
                  const dist = Math.sqrt(
                    Math.pow(pr - avgBgR, 2) + Math.pow(pg - avgBgG, 2) + Math.pow(pb - avgBgB, 2)
                  );

                  if (lum >= 238 && satDiff <= 18) {
                    d[p + 3] = 0; // Pure white background removed
                  } else if (dist < 26) {
                    d[p + 3] = 0;
                  } else if (dist < 46) {
                    const factor = (dist - 26) / 20;
                    d[p + 3] = Math.round(d[p + 3] * factor);
                  }
                }
                qCtx.putImageData(imgData, 0, 0);
              }
            }

            const sliceDataUrl = qCanvas.toDataURL("image/png");
            newPhotos[i] = sliceDataUrl;

            // Preload Image element
            await new Promise<void>((res) => {
              const loaded = new window.Image();
              loaded.onload = () => {
                loadedImgs[i] = loaded;
                res();
              };
              loaded.onerror = () => res();
              loaded.src = sliceDataUrl;
            });
          }

          // Commit to state & refs
          for (let i = 0; i < 4; i++) {
            if (loadedImgs[i]) {
              avatarImgElementsRef.current[i] = loadedImgs[i];
            }
          }
          setAvatarPhotos(newPhotos);
          setAvatarEngine("photo-cutout");
          setSheetSliceSuccess(true);
        } finally {
          setIsSlicingSheet(false);
        }
      };
      sheetImg.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

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
          seriesCount,
        }),
      });

      const data = await res.json();
      if (data.episodes && Array.isArray(data.episodes) && data.episodes.length > 0) {
        setSeriesEpisodes(data.episodes);
        setScenes(data.episodes[0].scenes);
        setActiveSeriesPart(1);
        setActiveSceneTab(0);
      } else if (data.scenes && Array.isArray(data.scenes)) {
        setSeriesEpisodes([]);
        setScenes(data.scenes);
        setActiveSeriesPart(1);
        setActiveSceneTab(0);
      }
      if (data.vaultUsed) {
        setActiveVaultInfo(data.vaultUsed);
      }
      if (data.warningNotice) {
        setWarningMessage(data.warningNotice);
      }
      startTimeRef.current = Date.now(); // reset animation to 0
      lastSceneIndexRef.current = -1;
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

    // Subtle animated pixel/block grid (Reference 2 editorial motion style)
    const pixelBlocks: Array<{ col: number; row: number; phase: number; speed: number }> = [];
    const blockSize = 40;
    const cols = Math.ceil(W / blockSize);
    const rows = Math.ceil(H / blockSize);
    for (let i = 0; i < 36; i++) {
      pixelBlocks.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.4 + 0.6,
      });
    }

    const render = () => {
      try {
        const now = Date.now();
        if (isPlayingRef.current && !startTimeRef.current) {
          startTimeRef.current = now;
        }
        const elapsed = isPlayingRef.current
          ? (now - startTimeRef.current) / 1000
          : (pausedElapsedRef.current || 0) / 1000;

        // In Preview mode, when playback reaches the end of the video, cleanly auto-stop instead of infinite loop!
        if (!isRecordingRef.current && isPlayingRef.current && elapsed >= totalDurationSec) {
          handleStopPreview();
          return;
        }

        const loopTime = elapsed % Math.max(totalDurationSec, 1);
        const globalProgress = loopTime / Math.max(totalDurationSec, 1);

        // Determine active scene
        let sceneIndex = 0;
        let currentHeadline = singleHeadline;
        let currentSubtext = singleSubtext;
        let currentMetric = singleMetric;
        let currentHighlight = "";
        let currentSceneDuration = singleDuration;
        let timeInScene = loopTime;
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
              currentSceneDuration = s.durationSec;
              timeInScene = loopTime - accumulatedTime;
              sceneLocalProgress = timeInScene / s.durationSec;
              break;
            }
            accumulatedTime += s.durationSec;
          }
        }

        // Sync caption progression directly to actual TTS AudioBuffer duration so words NEVER lag after voice ends
        const activeAudioBuf = audioBuffersRef.current[sceneIndex];
        const speechDur = activeAudioBuf ? Math.max(activeAudioBuf.duration * 0.96, 1.0) : currentSceneDuration * 0.92;
        const speechProgress = Math.min(Math.max(timeInScene / speechDur, 0), 1);

        // Check for scene transition to trigger Foley SFX (Preview mode only, prevents duplicate SFX during recording)
        if (!isRecordingRef.current && sceneIndex !== lastSceneIndexRef.current) {
          lastSceneIndexRef.current = sceneIndex;
          playedSceneAudioRef.current = -1;

          if (sfxEnabled && audioCtxRef.current && audioDestRef.current && audioCtxRef.current.state === "running") {
            playProceduralSFX(
              audioCtxRef.current,
              [audioCtxRef.current.destination, audioDestRef.current],
              "whoosh"
            );
          }
        }

        // Trigger Voiceover AudioBuffer as soon as buffer is ready AND AudioContext is running (Preview Mode)
        if (
          audioEnabled &&
          isPlayingRef.current &&
          !isRecordingRef.current &&
          sceneIndex !== playedSceneAudioRef.current &&
          audioCtxRef.current &&
          audioDestRef.current &&
          audioCtxRef.current.state === "running"
        ) {
          const buf = audioBuffersRef.current[sceneIndex];
          if (buf) {
            if (activeAudioSourceRef.current && activeAudioGainRef.current) {
              try {
                const t = audioCtxRef.current.currentTime;
                activeAudioGainRef.current.gain.setValueAtTime(activeAudioGainRef.current.gain.value, t);
                activeAudioGainRef.current.gain.linearRampToValueAtTime(0.001, t + 0.06);
                const oldSrc = activeAudioSourceRef.current;
                setTimeout(() => {
                  try { oldSrc.stop(); oldSrc.disconnect(); } catch (_) { }
                }, 70);
              } catch (_) { }
            }
            if (timeInScene < buf.duration - 0.1) {
              try {
                const src = audioCtxRef.current.createBufferSource();
                const gain = audioCtxRef.current.createGain();
                src.buffer = buf;
                src.connect(gain);
                if (analyserRef.current) {
                  gain.connect(analyserRef.current);
                }
                gain.connect(audioCtxRef.current.destination);
                gain.connect(audioDestRef.current);
                src.start(0, Math.max(0, timeInScene));
                activeAudioSourceRef.current = src;
                activeAudioGainRef.current = gain;
              } catch (err) {
                console.warn("Buffer playback notice:", err);
              }
            }
            playedSceneAudioRef.current = sceneIndex;
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

        const theme = MOTION_PALETTES[motionStyle] || MOTION_PALETTES["apple-keynote"];
        const accentColor = theme.accentColor;

        // 1. BACKGROUND RENDERING BASED ON ARCHETYPE (12 Hype & Editorial Styles)
        ctx.fillStyle = theme.bgColor;
        ctx.fillRect(0, 0, W, H);

        if (motionStyle === "apple-keynote" || motionStyle === "viral-yellow") {
          const radial = ctx.createRadialGradient(W / 2, H * 0.28, 20, W / 2, H * 0.28, W * 0.75);
          radial.addColorStop(0, `${accentColor}1A`);
          radial.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radial;
          ctx.fillRect(0, 0, W, H);
        } else if (motionStyle === "glass-aurora") {
          const ox1 = W * 0.3 + Math.sin(elapsed * 0.7) * 90;
          const oy1 = H * 0.25 + Math.cos(elapsed * 0.5) * 60;
          const g1 = ctx.createRadialGradient(ox1, oy1, 20, ox1, oy1, 320);
          g1.addColorStop(0, "rgba(139, 92, 246, 0.35)");
          g1.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g1;
          ctx.fillRect(0, 0, W, H);

          const ox2 = W * 0.75 + Math.cos(elapsed * 0.6) * 80;
          const oy2 = H * 0.7 + Math.sin(elapsed * 0.8) * 60;
          const g2 = ctx.createRadialGradient(ox2, oy2, 20, ox2, oy2, 300);
          g2.addColorStop(0, "rgba(34, 211, 238, 0.28)");
          g2.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g2;
          ctx.fillRect(0, 0, W, H);
        } else if (motionStyle === "editorial-light" || motionStyle === "notion-clean") {
          // Subtle editorial paper grid
          ctx.strokeStyle = "rgba(15, 23, 42, 0.045)";
          ctx.lineWidth = 1;
          for (let x = 0; x < W; x += 48) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
          }
          for (let y = 0; y < H; y += 48) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
          }
        } else if (motionStyle === "neo-brutalism") {
          // Bold polka/grid dots
          ctx.fillStyle = "rgba(9, 9, 11, 0.08)";
          for (let x = 24; x < W; x += 36) {
            for (let y = 24; y < H; y += 36) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (motionStyle === "fintech-alpha" || motionStyle === "midnight-slate") {
          ctx.strokeStyle = `${accentColor}14`;
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
          ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
          for (let y = 0; y < H; y += 4) {
            ctx.fillRect(0, y, W, 2);
          }
        } else if (motionStyle === "stoic-gold") {
          particles.forEach((p) => {
            p.y -= p.speed;
            if (p.y < 0) p.y = H;
            ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * (1 - p.y / H)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (motionStyle === "swiss-minimalist") {
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
        }

        // 1B. ANIMATED PIXEL BLOCK GRID OVERLAY (Editorial Motion Texture)
        ctx.save();
        pixelBlocks.forEach((b) => {
          const pulseAlpha = (Math.sin(elapsed * b.speed + b.phase) * 0.5 + 0.5) * 0.055;
          ctx.fillStyle = theme.isLight
            ? `rgba(15, 23, 42, ${pulseAlpha.toFixed(3)})`
            : `rgba(255, 255, 255, ${pulseAlpha.toFixed(3)})`;
          ctx.fillRect(b.col * blockSize, b.row * blockSize, blockSize - 2, blockSize - 2);
        });
        ctx.restore();

        // 2. TOP HEADER BAR & 4-SEGMENT PILL PROGRESS INDICATOR
        ctx.save();
        ctx.fillStyle = theme.textColor;
        ctx.font = "800 16px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("BUATPROMPT", 60, 62);

        // Serial Educational Badge on Canvas (e.g. SERI 01 / 03)
        if (seriesCount > 1 || seriesEpisodes.length > 1) {
          ctx.save();
          ctx.fillStyle = `${accentColor}26`;
          ctx.strokeStyle = `${accentColor}88`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(185, 48, 105, 22, 11);
          ctx.fill();
          ctx.stroke();

          ctx.font = "800 11px sans-serif";
          ctx.fillStyle = accentColor;
          ctx.textAlign = "center";
          const currentPartDisplay = activeSeriesPart || 1;
          const totalPartsDisplay = seriesEpisodes.length > 0 ? seriesEpisodes.length : seriesCount;
          ctx.fillText(`SERI 0${currentPartDisplay} / 0${totalPartsDisplay}`, 237, 63);
          ctx.restore();
        }

        // 4-Segment Horizontal Progress Pills (Top Right)
        const segCount = mode === "multi" ? scenes.length : 1;
        const segW = 32;
        const segGap = 8;
        const totalSegW = segCount * segW + (segCount - 1) * segGap;
        const segStartX = W - 60 - totalSegW;

        for (let i = 0; i < segCount; i++) {
          const sx = segStartX + i * (segW + segGap);
          const sy = 53;
          ctx.fillStyle = theme.isLight ? "rgba(15, 23, 42, 0.14)" : "rgba(255, 255, 255, 0.16)";
          ctx.beginPath();
          ctx.roundRect(sx, sy, segW, 6, 3);
          ctx.fill();

          let fillRatio = 0;
          if (i < sceneIndex) fillRatio = 1;
          else if (i === sceneIndex) fillRatio = Math.min(Math.max(sceneLocalProgress, 0.05), 1);

          if (fillRatio > 0) {
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.roundRect(sx, sy, segW * fillRatio, 6, 3);
            ctx.fill();
          }
        }
        ctx.restore();

        // Helper: smart wrap into N lines without breaking decimal numbers or word order
        const wrapTextLines = (txt: string, maxCharsPerLine: number, maxLines: number): string[] => {
          const clean = txt.replace(/\s+/g, " ").trim();
          const tokens = clean.split(" ");
          const lines: string[] = [];
          let cur = "";
          for (const t of tokens) {
            const next = cur ? `${cur} ${t}` : t;
            if (next.length <= maxCharsPerLine) {
              cur = next;
            } else {
              if (cur) lines.push(cur);
              cur = t;
              if (lines.length >= maxLines) break;
            }
          }
          if (cur && lines.length < maxLines) lines.push(cur);
          if (lines.length === maxLines && tokens.join(" ").length > lines.join(" ").length) {
            lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,!?]*$/, "") + "…";
          }
          return lines;
        };

        // Smart sentence splitter that ignores decimal points like "1.5"
        const splitSentences = (txt: string): string[] =>
          txt
            .split(/(?<!\d)[.!?]+(?!\d)/)
            .map((s) => s.trim())
            .filter(Boolean);

        // 3. ZONE 1: MOBILE-FIRST EDITORIAL SHOWCASE STAGE (4 Distinct Choreographies, Large 18-26px Type)
        if (showUpperCard) {
          ctx.save();
          ctx.globalAlpha = transitionAlpha;
          const cardY = 92;
          const cardW = W - 100; // 620px wide
          const cardH = 310;
          const cardX = 50;

          if (motionStyle === "neo-brutalism") {
            ctx.fillStyle = "#09090b";
            ctx.beginPath();
            ctx.roundRect(cardX + 8, cardY + 8, cardW, cardH, 24);
            ctx.fill();
          }

          ctx.fillStyle = theme.cardBg;
          ctx.strokeStyle = theme.cardBorder;
          ctx.lineWidth = motionStyle === "neo-brutalism" ? 3 : 1.5;
          ctx.beginPath();
          ctx.roundRect(cardX, cardY, cardW, cardH, 24);
          ctx.fill();
          ctx.stroke();

          if (sceneIndex === 0) {
            // SCENE 1: Big "01" Number + Large Topic Title + Tilted White Sticker Callout
            ctx.font = "900 46px sans-serif";
            ctx.fillStyle = accentColor;
            ctx.textAlign = "left";
            ctx.fillText("01", cardX + 28, cardY + 62);

            // Pill badge next to 01
            ctx.fillStyle = `${accentColor}22`;
            ctx.strokeStyle = `${accentColor}88`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(cardX + 98, cardY + 28, 155, 34, 17);
            ctx.fill();
            ctx.stroke();

            ctx.font = "800 15px sans-serif";
            ctx.fillStyle = theme.cardText;
            ctx.textAlign = "center";
            ctx.fillText("TOPIK UTAMA", cardX + 175, cardY + 50);

            // Large mobile-readable topic (25px bold)
            ctx.textAlign = "left";
            ctx.fillStyle = theme.cardText;
            ctx.font = "800 25px sans-serif";
            const displayTopic = topicIdea.trim() || currentHeadline;
            const topicLines = wrapTextLines(displayTopic, 29, 3);
            topicLines.forEach((ln, idx) => {
              const prefix = idx === 0 ? "“" : "";
              const suffix = idx === topicLines.length - 1 ? "”" : "";
              ctx.fillText(`${prefix}${ln}${suffix}`, cardX + 28, cardY + 112 + idx * 34);
            });

            // Tilted White Sticker Callout
            ctx.save();
            const stickerSpring = Math.min(sceneLocalProgress * 4, 1);
            const stickerScale = 0.85 + Math.sin(stickerSpring * Math.PI * 0.5) * 0.15;
            ctx.translate(cardX + cardW - 145, cardY + 258);
            ctx.rotate(-0.045); // -2.6 deg tilt
            ctx.scale(stickerScale, stickerScale);

            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0,0,0,0.45)";
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.roundRect(-125, -24, 250, 48, 24);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.font = "800 17px sans-serif";
            ctx.fillStyle = "#0f172a";
            ctx.textAlign = "center";
            ctx.fillText(currentMetric || "WAJIB TAHU!", 0, 6);
            ctx.restore();
          } else if (sceneIndex === 1) {
            // SCENE 2: Big "02" + Large Problem Headline + Big High-Contrast Insight Box (Readable on Phone!)
            ctx.font = "900 44px sans-serif";
            ctx.fillStyle = "#ef4444";
            ctx.textAlign = "left";
            ctx.fillText("02", cardX + 28, cardY + 58);

            ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
            ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(cardX + 98, cardY + 26, 175, 34, 17);
            ctx.fill();
            ctx.stroke();

            ctx.font = "800 15px sans-serif";
            ctx.fillStyle = theme.isLight ? "#dc2626" : "#fca5a5";
            ctx.textAlign = "center";
            ctx.fillText("MASALAH UTAMA", cardX + 185, cardY + 48);

            // Headline (22px bold, 2 lines)
            ctx.textAlign = "left";
            ctx.font = "800 22px sans-serif";
            ctx.fillStyle = theme.cardText;
            const hLines = wrapTextLines(currentHeadline, 31, 2);
            hLines.forEach((ln, idx) => {
              ctx.fillText(ln, cardX + 28, cardY + 104 + idx * 30);
            });

            // Large readable fact box (19px!)
            const subSentences = splitSentences(currentSubtext);
            const factText = subSentences[0] || currentSubtext;
            const factLines = wrapTextLines(factText, 34, 3);

            ctx.fillStyle = "rgba(239, 68, 68, 0.12)";
            ctx.strokeStyle = "rgba(239, 68, 68, 0.38)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(cardX + 24, cardY + 168, cardW - 48, 118, 16);
            ctx.fill();
            ctx.stroke();

            ctx.font = "600 19px sans-serif";
            ctx.fillStyle = theme.cardText;
            factLines.forEach((ln, idx) => {
              ctx.fillText(ln, cardX + 42, cardY + 204 + idx * 28);
            });
          } else if (sceneIndex === 2) {
            // SCENE 3: Big "03" + Animated Metric Progress Bar + Large Solution Card
            ctx.font = "900 44px sans-serif";
            ctx.fillStyle = "#10b981";
            ctx.textAlign = "left";
            ctx.fillText("03", cardX + 28, cardY + 58);

            ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
            ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(cardX + 98, cardY + 26, 165, 34, 17);
            ctx.fill();
            ctx.stroke();

            ctx.font = "800 15px sans-serif";
            ctx.fillStyle = theme.isLight ? "#047857" : "#6ee7b7";
            ctx.textAlign = "center";
            ctx.fillText("SOLUSI TERUJI", cardX + 180, cardY + 48);

            // Big Metric Pill on Top Right
            ctx.textAlign = "right";
            ctx.font = "900 22px monospace";
            ctx.fillStyle = "#10b981";
            ctx.fillText(currentMetric || "+300%", cardX + cardW - 28, cardY + 50);

            // Headline (22px bold)
            ctx.textAlign = "left";
            ctx.font = "800 22px sans-serif";
            ctx.fillStyle = theme.cardText;
            const hLines = wrapTextLines(currentHeadline, 31, 2);
            hLines.forEach((ln, idx) => {
              ctx.fillText(ln, cardX + 28, cardY + 104 + idx * 30);
            });

            // Animated Progress Bar inside Card
            const barW = cardW - 56;
            const fillPct = Math.min(sceneLocalProgress * 1.4, 1);
            ctx.fillStyle = theme.isLight ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.1)";
            ctx.beginPath();
            ctx.roundRect(cardX + 28, cardY + 162, barW, 12, 6);
            ctx.fill();

            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.roundRect(cardX + 28, cardY + 162, barW * fillPct, 12, 6);
            ctx.fill();

            // Large readable solution detail (19px!)
            const subSentences = splitSentences(currentSubtext);
            const solText = subSentences[0] || currentSubtext;
            const solLines = wrapTextLines(solText, 34, 3);
            ctx.font = "600 19px sans-serif";
            ctx.fillStyle = theme.cardSubText;
            solLines.forEach((ln, idx) => {
              ctx.fillText(ln, cardX + 28, cardY + 206 + idx * 28);
            });
          } else {
            // SCENE 4: Big "04" + Clear Mobile-Readable CTA + Pulsing Action Button
            ctx.font = "900 44px sans-serif";
            ctx.fillStyle = accentColor;
            ctx.textAlign = "left";
            ctx.fillText("04", cardX + 28, cardY + 58);

            ctx.fillStyle = `${accentColor}22`;
            ctx.strokeStyle = `${accentColor}88`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(cardX + 98, cardY + 26, 170, 34, 17);
            ctx.fill();
            ctx.stroke();

            ctx.font = "800 15px sans-serif";
            ctx.fillStyle = theme.cardText;
            ctx.textAlign = "center";
            ctx.fillText("LANGKAH AKSI", cardX + 183, cardY + 48);

            // Big Headline
            ctx.textAlign = "left";
            ctx.font = "800 23px sans-serif";
            ctx.fillStyle = theme.cardText;
            const hLines = wrapTextLines(currentHeadline, 30, 2);
            hLines.forEach((ln, idx) => {
              ctx.fillText(ln, cardX + 28, cardY + 106 + idx * 32);
            });

            // Subtext (19px readable)
            const subSentences = splitSentences(currentSubtext);
            const ctaLines = wrapTextLines(subSentences[0] || currentSubtext, 34, 2);
            ctx.font = "500 18px sans-serif";
            ctx.fillStyle = theme.cardSubText;
            ctaLines.forEach((ln, idx) => {
              ctx.fillText(ln, cardX + 28, cardY + 178 + idx * 26);
            });

            // Big Pulsing Action Button
            const btnY = cardY + 236;
            const btnPulse = 1 + Math.sin(elapsed * 5) * 0.025;
            ctx.save();
            ctx.translate(cardX + cardW / 2, btnY + 26);
            ctx.scale(btnPulse, btnPulse);
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.roundRect(-(cardW - 56) / 2, -26, cardW - 56, 52, 14);
            ctx.fill();

            ctx.font = "900 18px sans-serif";
            ctx.fillStyle = "#06281e";
            ctx.textAlign = "center";
            ctx.fillText(`✓ ${currentMetric || "SIMPAN & PRAKTIKKAN"}`, 0, 6);
            ctx.restore();
            ctx.textAlign = "left";
          }
          ctx.restore();
        }

        // 4. ZONE 2: MULTI-STYLE DYNAMIC KARAOKE TYPOGRAPHY (4 Visual Choreographies)
        ctx.save();
        ctx.globalAlpha = transitionAlpha;
        const timedPhrases = extractTimedPhrases(
          currentHeadline,
          currentSubtext,
          currentHighlight,
          currentMetric
        );

        // Drive phrase selection from speechProgress so captions NEVER lag after voice stops
        const activePhrase =
          timedPhrases.find((p) => speechProgress >= p.startPct && speechProgress < p.endPct) ||
          timedPhrases[timedPhrases.length - 1];

        const phraseDuration = Math.max(activePhrase.endPct - activePhrase.startPct, 0.05);
        const phraseProgress = Math.min(Math.max((speechProgress - activePhrase.startPct) / phraseDuration, 0), 1);

        // Centered between the upper card and the presenter avatar for perfect zero-collision hierarchy
        const phraseCenterY = showUpperCard ? 560 : 500;

        // Render Metric Badge above the beat if present
        if (activePhrase.badge) {
          ctx.font = "800 18px monospace";
          ctx.fillStyle = accentColor;
          ctx.textAlign = "center";
          ctx.fillText(`[ ${activePhrase.badge} ]`, W / 2, phraseCenterY - 88);
        }

        const fontFamily = theme.fontFamily;

        const words = activePhrase.words && activePhrase.words.length > 0
          ? activePhrase.words
          : activePhrase.phraseText.split(" ");

        // Larger mobile-friendly font size (52px base, min 32px)
        const maxLineWidth = W - 120; // 600px max
        let fontSize = 52;
        const buildLines = (fSize: number) => {
          ctx.font = `900 ${fSize}px ${fontFamily}`;
          const spaceW = ctx.measureText(" ").width * 1.15;
          const lines: Array<Array<{ word: string; w: number; idx: number }>> = [[]];
          let curW = 0;

          words.forEach((word, idx) => {
            const w = ctx.measureText(word).width;
            if (lines[lines.length - 1].length > 0 && curW + spaceW + w > maxLineWidth) {
              lines.push([{ word, w, idx }]);
              curW = w;
            } else {
              lines[lines.length - 1].push({ word, w, idx });
              curW += (lines[lines.length - 1].length > 1 ? spaceW : 0) + w;
            }
          });
          return { lines, spaceW };
        };

        let layout = buildLines(fontSize);
        while (layout.lines.length > 2 && fontSize > 32) {
          fontSize -= 2;
          layout = buildLines(fontSize);
        }

        const activeWordFloat = phraseProgress * words.length;
        const activeWordIdx = Math.min(Math.floor(activeWordFloat), words.length - 1);
        const lineHeight = fontSize * 1.32;
        const startY = phraseCenterY - ((layout.lines.length - 1) * lineHeight) / 2;

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";

        layout.lines.forEach((line, lineIdx) => {
          const lineW =
            line.reduce((acc, item) => acc + item.w, 0) +
            Math.max(0, line.length - 1) * layout.spaceW;
          let cursorX = W / 2 - lineW / 2;
          const lineY = startY + lineIdx * lineHeight;

          line.forEach((item) => {
            const isSpoken = item.idx <= activeWordIdx;
            const isCurrentWord = item.idx === activeWordIdx;
            const isKeyword =
              activePhrase.highlightWord &&
              item.word.includes(activePhrase.highlightWord);

            const wordProgress = isCurrentWord ? activeWordFloat - activeWordIdx : 1;

            // Distinct per-scene choreography!
            let wordScale = 1;
            let wordOffsetY = 0;
            let wordRot = 0;

            if (sceneIndex === 0) {
              // Scene 1: High-Energy Spring Pop
              wordScale = isCurrentWord ? 1 + Math.sin(Math.min(wordProgress * 2.5, 1) * Math.PI) * 0.14 : 1;
            } else if (sceneIndex === 1) {
              // Scene 2: Slide-Up Masked Reveal
              wordOffsetY = isCurrentWord ? (1 - Math.min(wordProgress * 3, 1)) * 16 : 0;
              wordScale = isCurrentWord ? 1.06 : 1;
            } else if (sceneIndex === 2) {
              // Scene 3: Editorial Emphasis + Sweep Underline
              wordScale = isCurrentWord ? 1.08 : 1;
            } else {
              // Scene 4: Spotlight Tilt Pop
              wordScale = isCurrentWord ? 1.1 : 1;
              wordRot = isKeyword && isSpoken ? -0.03 : 0;
            }

            ctx.save();
            ctx.translate(cursorX + item.w / 2, lineY + wordOffsetY);
            ctx.rotate(wordRot);
            ctx.scale(wordScale, wordScale);
            ctx.font = `900 ${fontSize}px ${fontFamily}`;

            if (isKeyword && isSpoken) {
              const padX = 14;
              const padY = 8;
              ctx.fillStyle = `${accentColor}30`;
              ctx.strokeStyle = accentColor;
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.roundRect(-item.w / 2 - padX, -fontSize / 2 - padY / 2, item.w + padX * 2, fontSize + padY, 14);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = accentColor;
              ctx.shadowColor = accentColor;
              ctx.shadowBlur = 16;
            } else if (isCurrentWord) {
              ctx.fillStyle = sceneIndex === 1 ? "#f87171" : accentColor;
              ctx.shadowColor = sceneIndex === 1 ? "#ef4444" : accentColor;
              ctx.shadowBlur = 12;

              // Scene 3: Animated sweep underline under current word
              if (sceneIndex === 2) {
                const ulW = item.w * Math.min(wordProgress * 2.2, 1);
                ctx.fillRect(-item.w / 2, fontSize / 2 + 4, ulW, 5);
              }
            } else if (isSpoken) {
              ctx.fillStyle = theme.textColor;
              ctx.shadowBlur = 0;
            } else {
              ctx.fillStyle = theme.mutedTextColor;
              ctx.shadowBlur = 0;
            }

            ctx.fillText(item.word, -item.w / 2, 0);
            ctx.restore();

            cursorX += item.w + layout.spaceW;
          });
        });

        ctx.restore();

        // 5. ZONE 3: LIVING AVATAR ENGINE (Custom Human Photo Cutout / 2D Rigged Human / 3D Voxel)
        if (showMascot) {
          ctx.save();
          ctx.globalAlpha = transitionAlpha;

          const isTalking =
            isPlayingRef.current && speechProgress < 0.99 && sceneLocalProgress > 0.01;

          const customPhotoImg =
            avatarImgElementsRef.current[sceneIndex] || avatarImgElementsRef.current[0];

          const currentScene = scenes[sceneIndex];
          const activePoseId: PresenterPoseId = currentScene?.suggestedPose || (
            sceneIndex === 0 ? "friendly-anchor" :
              sceneIndex === 1 ? "problem-shrug" :
                sceneIndex === 2 ? "eureka-point" : "strong-cta"
          );
          const poseInfo = PRESENTER_POSES[activePoseId] || PRESENTER_POSES["friendly-anchor"];

          if (avatarEngine === "photo-cutout" && customPhotoImg) {
            // Multi-Pose Human Photo Cutout with Contextual Dynamic Poses (Air-Gapped)
            drawHumanCutoutAvatar(ctx, {
              img: customPhotoImg,
              cx: W / 2,
              bottomY: H,
              maxHeight: 360,
              maxWidth: 420,
              vocalVolume: isTalking ? currentVocalVolume : 0,
              elapsed,
              accentColor,
              sceneProgress: sceneLocalProgress,
              framing: avatarFraming,
              poseInfo: poseInfo,
            });
          } else if (avatarEngine === "human-rigged" || (avatarEngine === "photo-cutout" && !customPhotoImg)) {
            // 2D Rigged Human Creator Host (6-Phoneme Lip-Sync + Expressive Hands)
            drawRiggedHumanHost(ctx, {
              cx: W / 2,
              cy: 1125,
              scale: 0.86,
              emotion: currentEmotion,
              isTalking,
              vocalVolume: currentVocalVolume,
              elapsed,
              accentColor,
              presetId: humanPreset,
            });
          } else if (characterLayout === "single") {
            drawVoxelAvatar(ctx, {
              cx: W / 2,
              cy: 1140,
              scale: 0.74,
              emotion: currentEmotion,
              isTalking,
              vocalVolume: currentVocalVolume,
              elapsed,
              outfit: voxelPreset,
            });
          } else {
            drawVoxelAvatar(ctx, {
              cx: W * 0.30,
              cy: 1140,
              scale: 0.64,
              emotion: currentEmotion,
              isTalking: isTalking && sceneLocalProgress < 0.5,
              vocalVolume: sceneLocalProgress < 0.5 ? currentVocalVolume : 0,
              elapsed,
              outfit: voxelPreset,
            });

            drawVoxelAvatar(ctx, {
              cx: W * 0.70,
              cy: 1140,
              scale: 0.64,
              emotion: currentEmotion === "shocked" ? "skeptical" : currentEmotion,
              isTalking: isTalking && sceneLocalProgress >= 0.5,
              vocalVolume: sceneLocalProgress >= 0.5 ? currentVocalVolume : 0,
              elapsed,
              outfit: voxelPreset === "hoodie-glasses" ? "beanie-striped" : "hoodie-glasses",
            });
          }
          ctx.restore();
        }

        // Safe-Zone Optics Guide Overlay (TikTok / Instagram Reels / YouTube Shorts)
        if (showSafeZoneGuide && !isRecordingRef.current) {
          ctx.save();

          // 1. Top Danger / UI Zone (y: 0 to 110)
          ctx.fillStyle = "rgba(14, 165, 233, 0.14)";
          ctx.fillRect(0, 0, W, 110);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(0, 0, W, 110);

          ctx.fillStyle = "#38bdf8";
          ctx.font = "bold 13px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.setLineDash([]);
          ctx.fillText("⚠️ AREA ATAS: Search / Tab Following / Reels UI (0–110px)", W / 2, 60);

          // 2. Right Action Column (x: 620 to 720, y: 480 to 1020)
          ctx.fillStyle = "rgba(245, 158, 11, 0.14)";
          ctx.fillRect(620, 480, 100, 540);
          ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(620, 480, 100, 540);

          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 11px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.setLineDash([]);
          ctx.fillText("Like / Komen", 670, 680);
          ctx.fillText("Share / Disc", 670, 700);
          ctx.fillText("⚠️ SISI KANAN", 670, 730);

          // 3. Bottom Danger / Caption Zone (y: 1020 to 1280)
          ctx.fillStyle = "rgba(244, 63, 94, 0.16)";
          ctx.fillRect(0, 1020, W, 260);
          ctx.strokeStyle = "rgba(251, 113, 133, 0.9)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(0, 1020, W, 260);

          ctx.fillStyle = "#fb7185";
          ctx.font = "bold 13px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.setLineDash([]);
          ctx.fillText("⚠️ AREA BAWAH: Username, Keterangan Naskah & Audio Ticker", W / 2, 1075);
          ctx.font = "11px Inter, system-ui, sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillText("(Typography & Karakter Kinetic Motion selalu diatur aman di atas area ini)", W / 2, 1100);

          // 4. Safe Center Region Boundary
          ctx.strokeStyle = "rgba(34, 197, 94, 0.7)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(40, 115, W - 145, 900);
          ctx.setLineDash([]);

          ctx.fillStyle = "#4ade80";
          ctx.font = "900 11px Inter, system-ui, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("🛡️ 100% SAFE VIEWPORT (TIKTOK / REELS / SHORTS)", 50, 138);

          ctx.restore();
        }
      } catch (renderErr) {
        console.error("Canvas render frame notice:", renderErr);
      } finally {
        if (isPlayingRef.current) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
      }
    };

    renderFrameRef.current = render;
    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [
    mode,
    scenes,
    singleHeadline,
    singleMetric,
    singleSubtext,
    motionStyle,
    avatarEngine,
    humanPreset,
    voxelPreset,
    avatarPhotos,
    avatarFraming,
    showSafeZoneGuide,
    totalDurationSec,
    isPlaying,
    showMascot,
    showUpperCard,
    characterLayout,
    audioEnabled,
    sfxEnabled,
    topicIdea,
    activeVaultInfo,
    handleStopPreview,
  ]);

  // In-Browser Native Video Recorder WITH EMBEDDED AUDIO
  const stopRecordingEarly = () => {
    isRecordingRef.current = false;
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (recordingTickerRef.current) {
      clearInterval(recordingTickerRef.current);
      recordingTickerRef.current = null;
    }
    recordingSourcesRef.current.forEach((s) => {
      try { s.stop(); s.disconnect(); } catch (_) { }
    });
    recordingSourcesRef.current = [];

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.requestData();
      } catch (_) { }
      mediaRecorderRef.current.stop();
    }
    if (loFiBgmRef.current) {
      try { loFiBgmRef.current.stop(); } catch (_) { }
    }
    handleStopPreview();
  };

  const recordAndDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setRecordError("Canvas belum siap. Refresh halaman dan coba lagi.");
      return;
    }

    try {
      setRecordError(null);

      // 1. Immediately halt any active preview audio and canvas RAF loop to prevent cross-stream audio contamination
      handleStopPreview();

      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
        setRecordedVideoUrl(null);
      }

      // 2. Extra safety: guarantee activeAudioSourceRef and previous recordingSources are completely stopped
      if (activeAudioSourceRef.current) {
        try {
          activeAudioSourceRef.current.stop();
          activeAudioSourceRef.current.disconnect();
        } catch (_) { }
        activeAudioSourceRef.current = null;
      }
      recordingSourcesRef.current.forEach((s) => {
        try { s.stop(); s.disconnect(); } catch (_) { }
      });
      recordingSourcesRef.current = [];

      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordProgress(0);

      // Initialize & resume audio engine
      const { ctx, dest } = getOrCreateAudioEngine();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Ensure ALL scene voiceover buffers are completely loaded before starting recording
      const targetScenes = mode === "multi" ? scenes : [{ durationSec: singleDuration, headline: singleHeadline, subtext: singleSubtext } as StoryScene];
      if (audioEnabled) {
        const missingBuffers = targetScenes.some((_, idx) => !audioBuffersRef.current[idx]);
        if (missingBuffers) {
          await prefetchTTSForScenes(scenes, voiceActor);
        }
      }

      // Start BGM during recording if enabled
      if (bgmEnabled && loFiBgmRef.current) {
        loFiBgmRef.current.start();
      }

      // Continuous inaudible audio carrier to ensure browser audio encoder keeps active clock
      const silentOsc = ctx.createOscillator();
      const silentGain = ctx.createGain();
      silentGain.gain.setValueAtTime(0.00001, ctx.currentTime);
      silentOsc.connect(silentGain);
      silentGain.connect(dest);
      silentOsc.start();

      // Reset loop timing to 0
      startTimeRef.current = Date.now();
      lastSceneIndexRef.current = -1;
      playedSceneAudioRef.current = -1;

      // Initial Foley SFX
      if (sfxEnabled && audioDestRef.current) {
        playProceduralSFX(ctx, [ctx.destination, audioDestRef.current], "whoosh");
      }

      const audioStartTime = ctx.currentTime + 0.15; // 150ms safe stream handshake
      let sceneAccumTime = 0;

      for (let i = 0; i < targetScenes.length; i++) {
        const buf = audioBuffersRef.current[i];
        const sceneDur = targetScenes[i].durationSec;
        const atTime = audioStartTime + sceneAccumTime;
        const stopTime = atTime + sceneDur;

        if (buf && audioEnabled) {
          const src = ctx.createBufferSource();
          const gain = ctx.createGain();
          src.buffer = buf;
          src.connect(gain);
          gain.connect(dest);
          gain.connect(ctx.destination);
          if (analyserRef.current) gain.connect(analyserRef.current);

          src.start(atTime);

          // STRICT ANTI-COLLISION: Gain envelope stops voice from bleeding into the next scene
          const effectiveDur = Math.min(buf.duration, sceneDur);
          const fadeOutStart = Math.max(atTime, atTime + effectiveDur - 0.12);
          gain.gain.setValueAtTime(1.0, fadeOutStart);
          gain.gain.linearRampToValueAtTime(0.001, stopTime);
          src.stop(stopTime + 0.05);

          recordingSourcesRef.current.push(src);
        }

        // Schedule Foley SFX at scene boundary transitions
        if (sfxEnabled && i > 0) {
          const sfxDelay = sceneAccumTime;
          setTimeout(() => {
            if (isRecordingRef.current && audioCtxRef.current && audioDestRef.current) {
              playProceduralSFX(audioCtxRef.current, [audioCtxRef.current.destination, audioDestRef.current], "whoosh");
            }
          }, sfxDelay * 1000);
        }

        sceneAccumTime += targetScenes[i].durationSec;
      }

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
      let ext = "webm";

      if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a.40.2")) {
        mimeType = "video/mp4;codecs=avc1,mp4a.40.2";
        ext = "mp4";
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        mimeType = "video/mp4";
        ext = "mp4";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
        mimeType = "video/webm;codecs=vp9,opus";
        ext = "webm";
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
        mimeType = "video/webm;codecs=vp8,opus";
        ext = "webm";
      } else {
        mimeType = "video/webm";
        ext = "webm";
      }

      const recorderOptions: MediaRecorderOptions = MediaRecorder.isTypeSupported(mimeType)
        ? { mimeType, videoBitsPerSecond: 8000000 }
        : { videoBitsPerSecond: 8000000 };

      const recorder = new MediaRecorder(combinedStream, recorderOptions);
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onerror = (ev: any) => {
        console.error("MediaRecorder error:", ev);
        isRecordingRef.current = false;
        if (recordingTickerRef.current) {
          clearInterval(recordingTickerRef.current);
          recordingTickerRef.current = null;
        }
        recordingSourcesRef.current.forEach((s) => {
          try { s.stop(); s.disconnect(); } catch (_) { }
        });
        recordingSourcesRef.current = [];

        try {
          silentOsc.stop();
          silentOsc.disconnect();
        } catch (_) { }
        if (loFiBgmRef.current) {
          try { loFiBgmRef.current.stop(); } catch (_) { }
        }
        handleStopPreview();
        setRecordError("Gagal merekam stream video/audio di browser.");
        setIsRecording(false);
        if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }
      };

      recorder.onstop = () => {
        isRecordingRef.current = false;
        if (recordingTickerRef.current) {
          clearInterval(recordingTickerRef.current);
          recordingTickerRef.current = null;
        }
        recordingSourcesRef.current.forEach((s) => {
          try { s.stop(); s.disconnect(); } catch (_) { }
        });
        recordingSourcesRef.current = [];

        try {
          silentOsc.stop();
          silentOsc.disconnect();
        } catch (_) { }

        if (loFiBgmRef.current) {
          try { loFiBgmRef.current.stop(); } catch (_) { }
        }
        handleStopPreview();

        if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }

        if (chunks.length === 0) {
          setRecordError("Rekaman menghasilkan buffer kosong. Pastikan preview berjalan.");
          setIsRecording(false);
          return;
        }

        const actualType = recorder.mimeType || mimeType || "video/webm";
        const blob = new Blob(chunks, { type: actualType });
        const url = URL.createObjectURL(blob);
        const partLabel = seriesEpisodes.length > 1 ? `-seri-${activeSeriesPart}-dari-${seriesEpisodes.length}` : "";
        const filename = `buatprompt-kinetic-${mode}${partLabel}-${totalDurationSec}s-audio.${ext}`;

        setRecordedVideoUrl(url);
        setRecordedFileName(filename);
        setIsRecording(false);
        setRecordProgress(100);

        // Trigger download without revoking immediately (fixes Chrome/Edge canceled download bug)
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          if (a.parentNode) document.body.removeChild(a);
        }, 1000);
      };

      // Backup render interval (30fps) to keep canvas drawing even if tab is unfocused or backgrounded
      if (recordingTickerRef.current) clearInterval(recordingTickerRef.current);
      recordingTickerRef.current = setInterval(() => {
        if (renderFrameRef.current) {
          renderFrameRef.current();
        }
      }, 33);

      // Emit timeslice chunks every 250ms for reliable, non-truncated webm output
      recorder.start(250);

      // Track recording progress using wall-clock time so tab throttling doesn't stall
      const totalMs = totalDurationSec * 1000;
      const recStartMs = Date.now();

      recordTimerRef.current = setInterval(() => {
        const elapsedMs = Date.now() - recStartMs;
        const pct = Math.min(Math.round((elapsedMs / totalMs) * 100), 100);
        setRecordProgress(pct);

        if (elapsedMs >= totalMs) {
          if (recordTimerRef.current) {
            clearInterval(recordTimerRef.current);
            recordTimerRef.current = null;
          }
          if (recorder.state !== "inactive") {
            try {
              recorder.requestData();
            } catch (_) { }
            recorder.stop();
          }
        }
      }, 150);
    } catch (err: any) {
      console.error("recordAndDownloadVideo exception:", err);
      isRecordingRef.current = false;
      if (recordingTickerRef.current) {
        clearInterval(recordingTickerRef.current);
        recordingTickerRef.current = null;
      }
      setRecordError(err?.message || "Browser tidak mendukung perekaman canvas.");
      setIsRecording(false);
    }
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
          <span>MULTI-SCENE KINETIC MOTION STUDIO ENGINE</span>
        </div>
        <h1 className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Scene Kinetic Video Studio
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          Hasil sekelas biro iklan internasional! Dilengkapi **Showcase Card Interaktif**, **Tipografi Kinetik Tengah Berpegas (*karaoke-style*)**, **Karakter 3D Voxel dengan Mulut Bergerak Bicara (*lip-sync*)**, serta **Full Audio Muxing (Voiceover + SFX + BGM)** langsung terunduh ke file video tanpa CapCut!
        </p>
      </div>

      {/* 1. Mode & Format Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("multi")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${mode === "multi"
                ? "bg-white text-black shadow-lg"
                : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
              }`}
          >
            <Layers className="h-4 w-4" />
            <span>FULL 4-SCENE MOVIE ({totalDurationSec}s)</span>
            <span className="bg-emerald-500/20 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ml-1">
              Rekomendasi
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode("single")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${mode === "single"
                ? "bg-white text-black shadow-lg"
                : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
              }`}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>SINGLE HOOK CLIP (6s)</span>
          </button>
        </div>

        {/* Compact Toggle Strip */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => {
              getOrCreateAudioEngine();
              setAudioEnabled(!audioEnabled);
            }}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${audioEnabled ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" : "border-white/10 text-zinc-500"
              }`}
          >
            {audioEnabled ? "🎙️ Voice: ON" : "🎙️ Voice: MUTE"}
          </button>

          <button
            type="button"
            onClick={() => {
              getOrCreateAudioEngine();
              setBgmEnabled(!bgmEnabled);
            }}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${bgmEnabled ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-zinc-500"
              }`}
          >
            {bgmEnabled ? "🎵 BGM: ON" : "🎵 BGM: OFF"}
          </button>

          <button
            type="button"
            onClick={() => setSfxEnabled(!sfxEnabled)}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${sfxEnabled ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300" : "border-white/10 text-zinc-500"
              }`}
          >
            {sfxEnabled ? "🔊 SFX: ON" : "🔊 SFX: OFF"}
          </button>

          <button
            type="button"
            onClick={() => setShowMascot(!showMascot)}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${showMascot ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-zinc-500"
              }`}
          >
            {showMascot ? "🧑 Maskot: ON" : "🧑 Maskot: OFF"}
          </button>

          <button
            type="button"
            onClick={() => setShowUpperCard(!showUpperCard)}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${showUpperCard ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-zinc-500"
              }`}
          >
            {showUpperCard ? "📋 Card: ON" : "📋 Card: OFF"}
          </button>
        </div>
      </div>

      {/* 2. TOP QUICK ACCESS: 3 PRESET FAVORIT KREATOR (1-KLIK) */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d1017] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
          <span className="font-bold flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" /> 3 KOMBINASI FAVORIT KREATOR (1-KLIK SIAP PAKAI)
          </span>
          <span className="text-[10px] text-zinc-500">Paling rutin & instan dipakai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Preset 1: Apple Keynote + Human 2D + Sarah */}
          <button
            type="button"
            onClick={() => {
              setMotionStyle("apple-keynote");
              setAvatarEngine("human-rigged");
              setHumanPreset("tech-creator");
              setVoiceActor("kang-sarah");
            }}
            className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${motionStyle === "apple-keynote" && avatarEngine === "human-rigged" && voiceActor === "kang-sarah"
                ? "border-emerald-400 bg-emerald-500/15 text-white shadow-lg"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>🍏 Edukasi Elegan</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Apple Keynote • Human 2D • Suara Sarah
            </div>
          </button>

          {/* Preset 2: Viral Yellow + 3D Voxel + Bang Bams */}
          <button
            type="button"
            onClick={() => {
              setMotionStyle("viral-yellow");
              setAvatarEngine("voxel");
              setVoxelPreset("beanie-striped");
              setVoiceActor("kang-bams");
            }}
            className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${motionStyle === "viral-yellow" && avatarEngine === "voxel" && voiceActor === "kang-bams"
                ? "border-amber-400 bg-amber-500/15 text-white shadow-lg"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>⚡ Kreator Viral Hype</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Viral Yellow • 3D Voxel • Suara Bang Bams
            </div>
          </button>

          {/* Preset 3: Glass Aurora + Photo Cutout + Mas Dimas */}
          <button
            type="button"
            onClick={() => {
              setMotionStyle("glass-aurora");
              setAvatarEngine("photo-cutout");
              setVoiceActor("kang-dimas");
            }}
            className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${motionStyle === "glass-aurora" && avatarEngine === "photo-cutout" && voiceActor === "kang-dimas"
                ? "border-cyan-400 bg-cyan-500/15 text-white shadow-lg"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>🌌 Tech & Modern Aesthetic</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Glass Aurora • Foto Cutout • Suara Mas Dimas
            </div>
          </button>
        </div>
      </div>

      {/* 3. COMPACT MOBILE-FRIENDLY DROPDOWNS CONFIGURATION */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {/* Dropdown 1: Format Seri Edukasi (1-4 Parts) */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              📺 Format Seri Video:
            </label>
            <select
              value={seriesCount}
              onChange={(e) => setSeriesCount(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value={1}>1 Part (Single Video Standalone)</option>
              <option value={2}>2 Parts (Mini Seri 2 Episode)</option>
              <option value={3}>3 Parts (Golden Sweet Spot ⭐ Rekomendasi)</option>
              <option value={4}>4 Parts (Serial Lengkap 4 Episode)</option>
            </select>
          </div>

          {/* Dropdown 2: Target Durasi */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              ⏱️ Target Durasi per Video:
            </label>
            <select
              value={durationTarget}
              onChange={(e) => setDurationTarget(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="55s">52-55 Detik (Golden Sweet Spot)</option>
              <option value="26s">26 Detik (Express Quick Hook)</option>
            </select>
          </div>

          {/* Dropdown 3: Gaya Visual Archetype */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              🎨 Gaya Visual Arsitektur:
            </label>
            <select
              value={motionStyle}
              onChange={(e) => setMotionStyle(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
            >
              {Object.values(MOTION_PALETTES).map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 4: Suara Voiceover */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              🎙️ Karakter Suara:
            </label>
            <select
              value={voiceActor}
              onChange={(e) => {
                getOrCreateAudioEngine();
                setVoiceActor(e.target.value);
              }}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
            >
              <optgroup label="👑 Kang Suara Studio (Google Gemini 24kHz - Alami & Bernapas)">
                <option value="kang-sarah">👩‍💼 Sarah (Host Profesional & Jelas)</option>
                <option value="kang-dimas">👨‍🏫 Mas Dimas (Otoritatif & Tenang / Video Essay)</option>
                <option value="kang-bams">⚡ Bang Bams (UGC Hook Cepat, Nyolot & Energik)</option>
                <option value="kang-senja">🌙 Nada Senja (Storytelling Halus & Meditatif)</option>
                <option value="kang-bimo">📱 Bimo (Reviewer Santai & Gaul / Gadget)</option>
                <option value="kang-keisha">✨ Keisha (Gen-Z Aesthetic / Lifestyle)</option>
                <option value="kang-reno">🎮 Reno (Anak Muda Hype / Gamer Dinamis)</option>
                <option value="kang-hartono">👴 Pak Hartono (Bapak Bijak / Bisnis)</option>
                <option value="kang-ratna">🧕 Ibu Ratna (Keibuan, Hangat & Mengayomi)</option>
                <option value="gemini-aoede">✨ Aoede (Studio Ultra Wanita)</option>
                <option value="gemini-charon">✨ Charon (Studio Ultra Pria)</option>
              </optgroup>
              <optgroup label="⚡ Kang Suara Edge Neural (Ardi & Gadis - 100% Bebas Kuota / 0 Biaya)">
                <option value="edge-bams">⚡ Bang Bams (Ardi +12% Lincah & Energik)</option>
                <option value="edge-dimas">👨‍🏫 Mas Dimas (Ardi -3% / -2Hz Tenang & Berwibawa)</option>
                <option value="edge-bimo">📱 Bimo (Ardi +6% Reviewer Kasual)</option>
                <option value="edge-sarah">👩‍💼 Sarah (Gadis +2% Artikulasi Jelas)</option>
                <option value="edge-senja">🌙 Nada Senja (Gadis -25% / -2Hz Syahdu & Lembut)</option>
                <option value="edge-keisha">✨ Keisha (Gadis +4% Gen-Z Ceria)</option>
                <option value="id-ID-ArdiNeural">👨 Ardi Standar (+2% Podcast)</option>
                <option value="id-ID-GadisNeural">👩 Gadis Standar (+1% Kreator)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Presenter Engine & Persona Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              🧑 Model Presenter:
            </label>
            <select
              value={avatarEngine}
              onChange={(e) => setAvatarEngine(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="human-rigged">🧑 Human 2D Rigged (Lip-Sync 6 Fonem)</option>
              <option value="voxel">🧱 3D Voxel Sculpted (Animasi Kotak)</option>
              <option value="photo-cutout">📸 Foto Sendiri (Multi-Pose Cutout)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">
              {avatarEngine === "human-rigged"
                ? "Karakter Human 2D:"
                : avatarEngine === "voxel"
                  ? "Outfit 3D Voxel:"
                  : "Pose Foto Manusia:"}
            </label>
            {avatarEngine === "human-rigged" && (
              <select
                value={humanPreset}
                onChange={(e) => setHumanPreset(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
              >
                {Object.values(HUMAN_2D_PRESETS).map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.gender === "female" ? "👩" : "👨"} {h.name} — {h.niche}
                  </option>
                ))}
              </select>
            )}
            {avatarEngine === "voxel" && (
              <select
                value={voxelPreset}
                onChange={(e) => setVoxelPreset(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
              >
                {Object.values(VOXEL_3D_PRESETS).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.gender === "female" ? "👩" : "👨"} {v.name} — {v.niche}
                  </option>
                ))}
              </select>
            )}
            {avatarEngine === "photo-cutout" && (
              <div className="pt-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-zinc-400">
                <span>Upload foto di panel foto di bawah</span>
                <select
                  value={avatarFraming}
                  onChange={(e) => setAvatarFraming(e.target.value as "half-body" | "full-body")}
                  className="rounded-lg border border-white/10 bg-black/80 px-2 py-1 text-[11px] text-emerald-300 focus:outline-none cursor-pointer"
                  title="Pilih fokus cropping untuk foto full-body"
                >
                  <option value="half-body">👤 Setengah Badan (Fokus Wajah)</option>
                  <option value="full-body">🧍 Seluruh Badan (Full-Body)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. SERIAL PARTS NAVIGATION TAB BAR (Jika Konten Serial Aktif) */}
      {seriesEpisodes.length > 1 && (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Film className="h-4 w-4" /> SERIAL EDUKASI ({seriesEpisodes.length} EPISODE SIAP)
            </span>
            <span className="text-[10px] text-zinc-400">Pilih part untuk dipratinjau & diunduh</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
            {seriesEpisodes.map((ep) => {
              const isSelected = activeSeriesPart === ep.partNumber;
              return (
                <button
                  key={ep.partNumber}
                  type="button"
                  onClick={() => selectSeriesPart(ep.partNumber)}
                  className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                      ? "border-emerald-400 bg-emerald-500/20 text-white font-bold shadow-md shadow-emerald-500/10"
                      : "border-white/10 bg-black/40 text-zinc-400 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">
                      PART {ep.partNumber}
                    </span>
                    <span className="truncate max-w-[130px] sm:max-w-[200px]">{ep.partTitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPacingOverLimit ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
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
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${creationTab === "idea"
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
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${creationTab === "script"
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
                    placeholder="Ketik topik atau ide video kamu di sini..."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-400 focus:outline-none font-mono font-medium"
                  />

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
                          className={`py-1.5 px-2 text-center rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${durationTarget === "55s"
                            ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                            : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                            }`}
                        >
                          52-55s (Deep Story)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDurationTarget("26s")}
                          className={`py-1.5 px-2 text-center rounded-lg font-mono text-[10px] font-bold border transition-all cursor-pointer ${durationTarget === "26s"
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
                        PRESET TOPIK KONTEN ({Object.keys(KNOWLEDGE_VAULT).length} NICHE)
                      </label>
                      <select
                        value={vaultDomain}
                        onChange={(e) => {
                          setVaultDomain(e.target.value);
                          setTargetNiche(e.target.value);
                        }}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="auto">🤖 Auto-Deteksi Sesuai Topik (Recommended)</option>
                        {Object.values(KNOWLEDGE_VAULT).map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {activeVaultInfo && (
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono space-y-1 animate-in fade-in">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Database className="h-3.5 w-3.5" />
                          <span>PRESET AKTIF: {activeVaultInfo.name.toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          STUDIO SMART PRESET
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
                          <span>{seriesCount > 1 ? `AI MENYUSUN ${seriesCount} SERIAL NASKAH LENGKAP...` : "AI MENYUSUN 4 SCENE LENGKAP..."}</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3.5 w-3.5" />
                          <span>{seriesCount > 1 ? `🪄 BUAT ${seriesCount} SERIAL NASKAH & SUSUN OTOMATIS` : "🪄 BUAT NASKAH LENGKAP & SUSUN 4 SCENE OTOMATIS"}</span>
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
                      className={`py-1.5 text-center rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${activeSceneTab === idx
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
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                      <span>POSE GESTUR FOTO SCENE INI</span>
                      <span className="text-emerald-400 font-semibold text-[9px]">100% Air-Gapped</span>
                    </label>
                    <select
                      value={scenes[activeSceneTab].suggestedPose || (
                        activeSceneTab === 0 ? "friendly-anchor" :
                          activeSceneTab === 1 ? "problem-shrug" :
                            activeSceneTab === 2 ? "eureka-point" : "strong-cta"
                      )}
                      onChange={(e) => updateSceneField(activeSceneTab, "suggestedPose", e.target.value as any)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-emerald-300 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    >
                      {Object.values(PRESENTER_POSES).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.icon} {p.label} - {p.desc}
                        </option>
                      ))}
                    </select>
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

          {/* Avatar Engine & Custom Human Photo Upload */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-400" />
                <span>AVATAR & HUMAN PRESENTER ENGINE</span>
              </label>
              {localGpuInfo && (
                <span
                  title={localGpuInfo.note}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] border ${localGpuInfo.gpuAvailable
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                    }`}
                >
                  <Cpu className="h-3 w-3" />
                  <span>{localGpuInfo.gpuAvailable ? `GPU: ${localGpuInfo.gpuName}` : "Browser Real-Time"}</span>
                </span>
              )}
            </div>

            {/* 3 Avatar Engines */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "human-rigged", label: "🧑 Human 2D", desc: "6-Fonem & Gestur" },
                { id: "photo-cutout", label: "📸 Foto Sendiri", desc: "Multi-Pose Cutout" },
                { id: "voxel", label: "🧱 3D Voxel", desc: "Padat & Sculpted" },
              ].map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => {
                    setAvatarEngine(eng.id as any);
                    if (eng.id === "human-rigged") {
                      const g = HUMAN_2D_PRESETS[humanPreset]?.gender;
                      if (g) setVoiceActor(g === "female" ? "kang-sarah" : "kang-dimas");
                    } else if (eng.id === "voxel") {
                      const g = VOXEL_3D_PRESETS[voxelPreset]?.gender;
                      if (g) setVoiceActor(g === "female" ? "kang-sarah" : "kang-dimas");
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${avatarEngine === eng.id
                    ? "border-emerald-400 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                    }`}
                >
                  <div className="text-xs font-bold">{eng.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{eng.desc}</div>
                </button>
              ))}
            </div>

            {/* Persona Selector for Human 2D (6 Characters) */}
            {avatarEngine === "human-rigged" && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono text-zinc-400">
                  Pilih Karakter Human 2D (Suara otomatis mengikuti gender):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(HUMAN_2D_PRESETS).map((char) => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        setHumanPreset(char.id);
                        setVoiceActor(char.gender === "female" ? "kang-sarah" : "kang-dimas");
                      }}
                      className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${humanPreset === char.id
                        ? "border-emerald-400 bg-emerald-500/15 text-white"
                        : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: char.outerColor }}
                          />
                          <span className="text-[11px] font-bold truncate">{char.name}</span>
                        </div>
                        <span className="text-[9px] shrink-0">
                          {char.gender === "female" ? "👩" : "👨"}
                        </span>
                      </div>
                      <div className="text-[9px] text-zinc-400 mt-0.5 truncate">{char.niche}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Character Selector for 3D Voxel (6 Characters) */}
            {avatarEngine === "voxel" && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono text-zinc-400">
                  Pilih Karakter 3D Voxel (Suara otomatis mengikuti gender):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(VOXEL_3D_PRESETS).map((vox) => (
                    <button
                      key={vox.id}
                      type="button"
                      onClick={() => {
                        setVoxelPreset(vox.id);
                        setVoiceActor(vox.gender === "female" ? "kang-sarah" : "kang-dimas");
                      }}
                      className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${voxelPreset === vox.id
                        ? "border-emerald-400 bg-emerald-500/15 text-white"
                        : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: vox.shirtColor }}
                          />
                          <span className="text-[11px] font-bold truncate">{vox.name}</span>
                        </div>
                        <span className="text-[9px] shrink-0">
                          {vox.gender === "female" ? "👩" : "👨"}
                        </span>
                      </div>
                      <div className="text-[9px] text-zinc-400 mt-0.5 truncate">{vox.niche}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Pose Photo & AI Action Sheet Studio */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Studio Host & Presenter (Multi-Pose):</span>
                </span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  100% On-Device / Air-Gapped
                </span>
              </div>

              {/* Mode Toggle: Action Sheet 4-Grid (AI) vs Manual Per-Slot */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode("sheet")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${uploadMode === "sheet"
                      ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                    }`}
                >
                  <Scissors className="h-3.5 w-3.5" />
                  <span>✂️ Sheet 4-Pose (AI Grid)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("manual")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg font-bold transition-all cursor-pointer ${uploadMode === "manual"
                      ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                    }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>🖼️ Upload Manual (Slot 1–4)</span>
                </button>
              </div>

              {/* MODE 1: 2x2 ACTION SHEET WORKFLOW */}
              {uploadMode === "sheet" && (
                <div className="space-y-3 p-3 rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/40 border border-white/10 shadow-lg">
                  {/* Workflow Explanation Banner */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono leading-relaxed">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <strong className="text-white block font-sans text-xs">Workflow 1 Gambar = 4 Pose Konsisten Sesuai Naskah!</strong>
                      Salin prompt di bawah ke Gemini / Midjourney / Flux. Hasil 1 gambar grid 2x2 cukup di-drop di bawah, sistem otomatis memotong 4 kuadran pose & membersihkan background secara instan tanpa API!
                    </div>
                  </div>

                  {/* Persona Configuration */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      1. Karakter / Pakaian Host (Bisa Diedit):
                    </label>
                    <textarea
                      value={personaDesc}
                      onChange={(e) => setPersonaDesc(e.target.value)}
                      rows={2}
                      className="w-full text-xs font-mono p-2 rounded-xl bg-black/60 border border-white/10 text-zinc-200 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                      placeholder="Jelaskan penampilan presenter (wajah, busana, warna baju)..."
                    />
                    {/* Persona Presets */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {PERSONA_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setPersonaDesc(preset.desc)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-[10px] font-mono text-zinc-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contextual Prompt Box */}
                  <div className="rounded-xl border border-white/10 bg-black/60 overflow-hidden">
                    <div className="flex items-center justify-between p-2.5 bg-white/5 border-b border-white/10">
                      <button
                        type="button"
                        onClick={() => setShowPromptBox(!showPromptBox)}
                        className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-200 hover:text-white cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-emerald-400" />
                        <span>2. Prompt Action Sheet (Auto dari Naskah)</span>
                        {showPromptBox ? (
                          <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={copyActionSheetPrompt}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[11px] font-mono font-bold transition-all cursor-pointer shadow-sm"
                      >
                        {sheetPromptCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>✓ Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Salin Prompt AI</span>
                          </>
                        )}
                      </button>
                    </div>

                    {showPromptBox && (
                      <div className="p-2.5 space-y-2">
                        <pre className="text-[10px] font-mono text-zinc-300 bg-black/80 p-2.5 rounded-lg max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/5 select-all">
                          {generateActionSheetPrompt()}
                        </pre>
                        <p className="text-[9.5px] font-mono text-zinc-400 leading-tight">
                          💡 <strong>Tips:</strong> Buka <span className="text-zinc-200">Google Gemini</span>, <span className="text-zinc-200">Midjourney</span>, atau <span className="text-zinc-200">Flux</span> ➡️ Paste prompt ➡️ Simpan gambar hasil 2x2 grid ➡️ Drop di bawah!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropzone for 2x2 Grid Sheet */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>3. Upload Gambar Sheet 2x2:</span>
                      <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={autoCutoutWhite}
                          onChange={(e) => setAutoCutoutWhite(e.target.checked)}
                          className="rounded border-zinc-700 text-emerald-500 focus:ring-0 accent-emerald-500"
                        />
                        <span className="text-[9.5px]">Auto-Cutout Background Putih (#FFFFFF)</span>
                      </label>
                    </div>

                    <label className="relative border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => handleGridSheetUpload(e.target.files?.[0] || null)}
                      />
                      {isSlicingSheet ? (
                        <div className="flex flex-col items-center py-2">
                          <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin mb-1.5" />
                          <span className="text-xs font-mono font-bold text-emerald-300">
                            ✂️ Memotong 4 Kuadran & Membersihkan Background...
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                            Proses 100% lokal di browser Anda
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-1">
                          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Scissors className="h-5 w-5 text-emerald-400" />
                          </div>
                          <span className="text-xs font-mono font-bold text-zinc-200 group-hover:text-emerald-300 transition-colors">
                            Klik atau Drop File Gambar Sheet 2x2 di Sini
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 mt-1 max-w-sm">
                            Otomatis diiris menjadi 4 Pose: Hook (Kiri Atas), Masalah (Kanan Atas), Solusi (Kiri Bawah), CTA (Kanan Bawah).
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Sliced 4-Pose Status & Preview Card */}
                  {avatarPhotos[0] && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                          <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                          <span>4 Pose Berhasil Terpasang di Naskah:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            for (let i = 0; i < 4; i++) removeAvatarPhoto(i);
                            setSheetSliceSuccess(false);
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                        >
                          Hapus & Ulangi
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { idx: 0, label: "Scene 1: Hook", desc: "Kiri-Atas" },
                          { idx: 1, label: "Scene 2: Masalah", desc: "Kanan-Atas" },
                          { idx: 2, label: "Scene 3: Solusi", desc: "Kiri-Bawah" },
                          { idx: 3, label: "Scene 4: CTA", desc: "Kanan-Bawah" },
                        ].map((slot) => {
                          const imgUrl = avatarPhotos[slot.idx];
                          return (
                            <div
                              key={slot.idx}
                              className="relative rounded-xl border border-emerald-500/30 bg-black/50 p-2 flex flex-col items-center text-center shadow-sm"
                            >
                              {imgUrl ? (
                                <>
                                  <div className="h-14 w-14 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden p-1">
                                    <img
                                      src={imgUrl}
                                      alt={slot.label}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-emerald-300 mt-1">
                                    {slot.label}
                                  </span>
                                  <span className="text-[8.5px] font-mono text-zinc-400">
                                    {slot.desc}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-zinc-500 py-4">Kosong</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Instant Play Preview with Sliced Poses */}
                      <button
                        type="button"
                        onClick={handleReplayFromStart}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>▶️ PUTAR PREVIEW DENGAN 4 POSE INI</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: MANUAL PER-SLOT UPLOADER */}
              {uploadMode === "manual" && (
                <div className="space-y-2.5">
                  {/* 1-Click Distribute to All 4 Scenes with Dynamic Camera Director */}
                  {avatarPhotos[0] && (
                    <button
                      type="button"
                      onClick={applyPhotoToAllScenes}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-400/40 bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold hover:bg-emerald-500/25 transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>⚡ SEBAR 1 FOTO KE SEMUA SCENE (DYNAMIC CAMERA DIRECTOR)</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { idx: 0, label: "Pose 1 (Utama)" },
                      { idx: 1, label: "Pose 2 (Masalah)" },
                      { idx: 2, label: "Pose 3 (Solusi)" },
                      { idx: 3, label: "Pose 4 (CTA)" },
                    ].map((slot) => {
                      const imgUrl = avatarPhotos[slot.idx];
                      const isProcessing = isProcessingCutout[slot.idx];
                      return (
                        <div
                          key={slot.idx}
                          className="relative rounded-xl border border-dashed border-white/15 bg-black/40 p-2 flex flex-col items-center justify-center min-h-[96px] hover:border-emerald-400/50 transition-colors"
                        >
                          {imgUrl ? (
                            <>
                              <img
                                src={imgUrl}
                                alt={slot.label}
                                className="h-12 w-12 object-contain rounded"
                              />
                              <span className="text-[10px] font-mono text-emerald-300 mt-1 truncate max-w-full">
                                {slot.label}
                              </span>
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleAutoCutout(slot.idx)}
                                className="mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono transition-colors cursor-pointer"
                                title="Hapus background otomatis di browser"
                              >
                                {isProcessing ? (
                                  <>
                                    <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                                    <span>Cutout...</span>
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="h-2.5 w-2.5" />
                                    <span>🪄 Cutout</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAvatarPhoto(slot.idx)}
                                className="absolute top-1 right-1 p-1 rounded-md bg-rose-500/80 text-white hover:bg-rose-500 cursor-pointer"
                                title="Hapus foto"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-center">
                              <Upload className="h-4 w-4 text-zinc-400 mb-1" />
                              <span className="text-[10px] font-mono text-zinc-400 leading-tight">
                                {slot.label}
                              </span>
                              <input
                                type="file"
                                accept="image/png,image/webp,image/jpeg"
                                className="hidden"
                                onChange={(e) => handleAvatarUpload(slot.idx, e.target.files?.[0] || null)}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Framing Mode: Setengah Badan vs Seluruh Badan (Available in Both Modes) */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <span>📐 Format Penampilan:</span>
                </span>
                <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAvatarFraming("half-body")}
                    className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${avatarFraming === "half-body"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                      }`}
                    title="Foto otomatis difokuskan ke tubuh bagian atas & wajah agar ekspresif di layar smartphone"
                  >
                    👤 Setengah Badan (Fokus Wajah)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarFraming("full-body")}
                    className={`px-2.5 py-1 rounded-md text-[10px] transition-all cursor-pointer ${avatarFraming === "full-body"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                      }`}
                    title="Menampilkan proporsi utuh (berdiri/duduk) dari kepala hingga kaki"
                  >
                    🧍 Seluruh Badan (Full-Body)
                  </button>
                </div>
              </div>

              {localGpuInfo && (
                <p className="text-[10px] font-mono text-zinc-500">
                  💡 {localGpuInfo.note}
                </p>
              )}
            </div>
          </div>

          {/* 12 Hype Visual Archetypes Selector (Collapsible Accordion for Mobile-Friendliness) */}
          <details className="group rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-3 shadow-xl transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none font-mono text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-400" />
                <span>PALET VISUAL GRID ({Object.keys(MOTION_PALETTES).length} ARCHETYPES)</span>
                <span className="text-[10px] text-zinc-500 font-normal hidden sm:inline">(Klik untuk lihat kartu preview)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                  Aktif: {MOTION_PALETTES[motionStyle]?.name || motionStyle}
                </span>
                <span className="text-xs text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </div>
            </summary>

            <div className="pt-3 space-y-3 border-t border-white/5 mt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-400">
                  Pilih kartu archetype atau gunakan dropdown ringkas di atas:
                </span>

                {/* Cluster Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setStyleFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${styleFilter === "all"
                      ? "bg-white/15 text-white"
                      : "text-zinc-400 hover:text-white"
                      }`}
                  >
                    Semua ({Object.keys(MOTION_PALETTES).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyleFilter("favorites")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${styleFilter === "favorites"
                      ? "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                      : "text-zinc-400 hover:text-amber-300"
                      }`}
                  >
                    <Star className="h-3 w-3 fill-current" />
                    <span>Favorit ({favoriteStyles.length})</span>
                  </button>
                </div>
              </div>

              {styleFilter === "favorites" && favoriteStyles.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/10 bg-black/25 text-center font-mono text-xs text-zinc-400">
                  Belum ada archetype favorit. Klik ikon ⭐ di tab &quot;Semua&quot; untuk memasukkan style andalanmu ke Cluster Favorit!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(MOTION_PALETTES)
                    .filter((st) => styleFilter === "all" || favoriteStyles.includes(st.id))
                    .sort((a, b) => {
                      const aFav = favoriteStyles.includes(a.id) ? 0 : 1;
                      const bFav = favoriteStyles.includes(b.id) ? 0 : 1;
                      return aFav - bFav;
                    })
                    .map((st) => {
                      const isFav = favoriteStyles.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          onClick={() => setMotionStyle(st.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setMotionStyle(st.id);
                            }
                          }}
                          className={`relative p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer select-none ${motionStyle === st.id
                            ? "border-emerald-400 bg-emerald-500/10 text-white font-bold shadow-md shadow-emerald-500/10"
                            : isFav
                              ? "border-amber-500/30 bg-amber-500/5 text-zinc-200 hover:border-amber-400/50"
                              : "border-white/5 bg-black/30 text-zinc-400 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                                style={{ backgroundColor: st.bgColor, boxShadow: `inset 0 0 0 2px ${st.accentColor}` }}
                              />
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                                {st.tag}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavoriteStyle(st.id);
                              }}
                              title={isFav ? "Hapus dari Cluster Favorit" : "Simpan ke Cluster Favorit"}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${isFav
                                ? "text-amber-400 hover:text-amber-300"
                                : "text-zinc-600 hover:text-amber-300"
                                }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
                            </button>
                          </div>
                          <div className="truncate">{st.name}</div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </details>

          {/* In-Browser Native Video Download Action */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-3 shadow-xl">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isRecording}
                onClick={recordAndDownloadVideo}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 font-mono text-sm font-bold text-white shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
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

              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecordingEarly}
                  className="px-4 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 font-mono text-xs font-bold text-white shadow-lg transition-colors cursor-pointer shrink-0"
                >
                  ⏹️ STOP & SIMPAN
                </button>
              )}
            </div>

            {recordError && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-xs">
                ⚠️ {recordError}
              </div>
            )}

            {recordedVideoUrl && !isRecording && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    <span>Video & Audio Berhasil Direkam!</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {recordedFileName}
                  </span>
                </div>

                {/* Direct In-Browser Playback to verify audio */}
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                  <video
                    src={recordedVideoUrl}
                    controls
                    autoPlay={false}
                    playsInline
                    className="w-full max-h-56 object-contain bg-black"
                  />
                </div>

                <a
                  href={recordedVideoUrl}
                  download={recordedFileName}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2.5 font-mono text-xs font-bold text-emerald-300 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Ulang File ({recordedFileName})</span>
                </a>

                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                  💡 <strong className="text-zinc-200">Tips Pemutaran di Windows:</strong> Jika video diputar melalui pemutar bawaan Windows (Windows Media Player default), audio format WebM (Opus) mungkin tidak terdengar karena batasan codec bawaan Windows. Namun audio <strong className="text-emerald-300">100% terekam dan aktif</strong> saat diputar langsung di pemutar web di atas, di browser Google Chrome, VLC Player, CapCut, Premiere, Instagram, atau TikTok!
                </p>
              </div>
            )}

            <p className="text-[11px] font-mono text-zinc-400 text-center">
              ⚡ 100% In-Browser. Voiceover + Foley SFX + Lo-Fi BGM otomatis termuxing ke file video. Siap posting tanpa CapCut.
            </p>
          </div>
        </div>

        {/* Right Column: 9:16 Vertical Smartphone Viewport */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {/* Safe-Zone Guide Toggle */}
          <div className="w-full max-w-[320px] sm:max-w-[340px] mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">📱 Preview Layar 9:16</span>
            <button
              type="button"
              onClick={() => setShowSafeZoneGuide((prev) => !prev)}
              className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${showSafeZoneGuide
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              title="Tampilkan garis batas zona aman TikTok, Reels, dan YouTube Shorts"
            >
              <span>🛡️ Safe-Zone {showSafeZoneGuide ? "Aktif" : "Overlay"}</span>
            </button>
          </div>

          <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/16] rounded-[36px] p-3 bg-[#13151c] border-2 border-white/10 shadow-2xl overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-zinc-900 border border-white/10 mr-2" />
              <div className="w-10 h-1 bg-zinc-800 rounded-full" />
            </div>

            {/* The Actual HTML5 Canvas */}
            <div className="w-full h-full rounded-[26px] overflow-hidden relative bg-black">
              <canvas ref={canvasRef} className="w-full h-full object-cover" />

              {/* Interactive Screen Play/Pause Overlay */}
              <div
                onClick={() => {
                  if (isRecording) return;
                  if (isPlaying) {
                    handlePausePreview();
                  } else {
                    handleStartOrResumePreview();
                  }
                }}
                className="absolute inset-0 z-30 cursor-pointer"
              >
                {!isPlaying && !isRecording && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] group transition-all">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/95 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-emerald-400 transition-all">
                      <Play className="h-7 w-7 fill-current ml-1" />
                    </div>
                    <span className="mt-3 text-xs font-mono font-bold text-white tracking-wider">
                      {pausedElapsedRef.current ? "KLIK UNTUK LANJUTKAN" : "KLIK UNTUK PUTAR PREVIEW"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      Klik layar untuk jeda / putar kapan saja
                    </span>
                  </div>
                )}
              </div>

              {/* Recording Overlay Tag */}
              {isRecording && (
                <div className="absolute top-6 left-4 flex items-center gap-2 bg-rose-500/90 text-white font-mono text-[10px] px-2.5 py-1 rounded-full shadow-lg z-30 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC + AUDIO {recordProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 w-full max-w-[340px] space-y-2 font-mono text-xs">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={handleReplayFromStart}
                className="flex items-center justify-center gap-1 px-2.5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
                title="Putar ulang dari detik ke-0"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Ulang</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isPlaying) {
                    handlePausePreview();
                  } else {
                    handleStartOrResumePreview();
                  }
                }}
                className="flex items-center justify-center gap-1 px-2.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isPlaying ? "Pause" : "Lanjut"}</span>
              </button>

              <button
                type="button"
                onClick={handleStopPreview}
                className="flex items-center justify-center gap-1 px-2.5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-500/25 transition-colors cursor-pointer"
                title="Hentikan total pemutaran dan kembalikan ke awal"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-zinc-400">
              <span>{isAudioLoading ? "⏳ Menyiapkan suara..." : "🎙️ Suara siap instan"}</span>
              <span>{totalDurationSec}s • 720 × 1280 (9:16)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
