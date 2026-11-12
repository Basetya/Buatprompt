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
  Upload,
  Image as ImageIcon,
  Cpu,
  Trash2,
  Star,
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

  const [motionStyle, setMotionStyle] = useState<MotionStyleId>("apple-keynote");
  const [favoriteStyles, setFavoriteStyles] = useState<MotionStyleId[]>([
    "editorial-light",
    "kataaungg-slate",
    "apple-keynote",
  ]);
  const [styleFilter, setStyleFilter] = useState<"all" | "favorites">("all");
  const [avatarEngine, setAvatarEngine] = useState<"human-rigged" | "photo-cutout" | "voxel">("human-rigged");
  const [humanPreset, setHumanPreset] = useState<Human2DPresetId>("tech-creator");
  const [voxelPreset, setVoxelPreset] = useState<VoxelPresetId>("beanie-striped");
  const [avatarPhotos, setAvatarPhotos] = useState<Record<number, string>>({});
  const avatarImgElementsRef = useRef<Record<number, HTMLImageElement>>({});
  const [localGpuInfo, setLocalGpuInfo] = useState<{
    gpuAvailable: boolean;
    gpuName: string | null;
    note: string;
  } | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
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
  const lastSceneIndexRef = useRef<number>(-1);
  const playedSceneAudioRef = useRef<number>(-1);
  const scene0PromiseRef = useRef<Promise<void> | null>(null);
  const pausedElapsedRef = useRef<number>(0);

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

      if (activeAudioSourceRef.current) {
        try {
          activeAudioSourceRef.current.stop();
        } catch (_) {}
      }

      if (offsetSec < buf.duration - 0.15) {
        try {
          const src = audioCtxRef.current.createBufferSource();
          src.buffer = buf;
          if (analyserRef.current) {
            src.connect(analyserRef.current);
          }
          src.connect(audioCtxRef.current.destination);
          src.connect(audioDestRef.current);
          src.start(0, Math.max(0, offsetSec));
          activeAudioSourceRef.current = src;
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
      .catch(() => {});

    try {
      const savedFavs = localStorage.getItem("buatprompt_favorite_archetypes");
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavoriteStyles(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const toggleFavoriteStyle = (id: MotionStyleId) => {
    setFavoriteStyles((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("buatprompt_favorite_archetypes", JSON.stringify(next));
      } catch (_) {}
      return next;
    });
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

      // Check for scene transition to trigger Foley SFX
      if (sceneIndex !== lastSceneIndexRef.current) {
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

      // Trigger Voiceover AudioBuffer as soon as buffer is ready AND AudioContext is running
      if (
        audioEnabled &&
        isPlaying &&
        sceneIndex !== playedSceneAudioRef.current &&
        audioCtxRef.current &&
        audioDestRef.current &&
        audioCtxRef.current.state === "running"
      ) {
        const buf = audioBuffersRef.current[sceneIndex];
        if (buf) {
          if (activeAudioSourceRef.current) {
            try {
              activeAudioSourceRef.current.stop();
            } catch (_) {}
          }
          if (timeInScene < buf.duration - 0.15) {
            try {
              const src = audioCtxRef.current.createBufferSource();
              src.buffer = buf;
              if (analyserRef.current) {
                src.connect(analyserRef.current);
              }
              src.connect(audioCtxRef.current.destination);
              src.connect(audioDestRef.current);
              src.start(0, Math.max(0, timeInScene));
              activeAudioSourceRef.current = src;
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

      if (motionStyle === "apple-keynote" || motionStyle === "hormozi-punch") {
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
        // Subtle editorial paper grid (ClassAI / Kataaungg Light style)
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
      } else if (motionStyle === "fintech-alpha" || motionStyle === "kataaungg-slate") {
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
          // SCENE 1: Big "01" Number + Large Topic Title + Tilted White Sticker Callout (Classai + Kataaungg style)
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

          // Tilted White Sticker Callout (like Classai "Lisensi MIT • gratis")
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

      // Positioned closer above the avatar head for tight speaker-caption cohesion
      const phraseCenterY = showUpperCard ? 760 : 640;

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
          isPlaying && speechProgress < 0.99 && sceneLocalProgress > 0.01;

        const customPhotoImg =
          avatarImgElementsRef.current[sceneIndex] || avatarImgElementsRef.current[0];

        if (avatarEngine === "photo-cutout" && customPhotoImg) {
          // Multi-Pose Human Photo Cutout (Kataaungg style)
          drawHumanCutoutAvatar(ctx, {
            img: customPhotoImg,
            cx: W / 2,
            bottomY: H,
            maxHeight: 430,
            maxWidth: 460,
            vocalVolume: isTalking ? currentVocalVolume : 0,
            elapsed,
            accentColor,
            sceneProgress: sceneLocalProgress,
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
    avatarEngine,
    humanPreset,
    voxelPreset,
    avatarPhotos,
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
  const stopRecordingEarly = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.requestData();
      } catch (_) {}
      mediaRecorderRef.current.stop();
    }
  };

  const recordAndDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setRecordError("Canvas belum siap. Refresh halaman dan coba lagi.");
      return;
    }

    try {
      setRecordError(null);
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
        setRecordedVideoUrl(null);
      }

      setIsPlaying(true);
      setIsRecording(true);
      setRecordProgress(0);

      // Initialize & resume audio engine
      const { ctx, dest } = getOrCreateAudioEngine();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Ensure Scene 0 voiceover buffer is ready before starting recording
      if (audioEnabled && !audioBuffersRef.current[0]) {
        const waitStart = Date.now();
        while (!audioBuffersRef.current[0] && Date.now() - waitStart < 4500) {
          await new Promise((r) => setTimeout(r, 150));
        }
      }

      // Start BGM during recording if enabled
      if (bgmEnabled && loFiBgmRef.current) {
        loFiBgmRef.current.start();
      }

      // Reset loop timing to 0
      startTimeRef.current = Date.now();
      lastSceneIndexRef.current = -1;
      playedSceneAudioRef.current = -1;

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
        setRecordError("Gagal merekam stream video/audio di browser.");
        setIsRecording(false);
        if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }
      };

      recorder.onstop = () => {
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
        const filename = `buatprompt-kinetic-${mode}-${totalDurationSec}s-audio.webm`;

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
            } catch (_) {}
            recorder.stop();
          }
        }
      }, 150);
    } catch (err: any) {
      console.error("recordAndDownloadVideo exception:", err);
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
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] border ${
                    localGpuInfo.gpuAvailable
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
                      if (g) setVoiceActor(g === "female" ? "id-ID-GadisNeural" : "id-ID-ArdiNeural");
                    } else if (eng.id === "voxel") {
                      const g = VOXEL_3D_PRESETS[voxelPreset]?.gender;
                      if (g) setVoiceActor(g === "female" ? "id-ID-GadisNeural" : "id-ID-ArdiNeural");
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                    avatarEngine === eng.id
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
                        setVoiceActor(char.gender === "female" ? "id-ID-GadisNeural" : "id-ID-ArdiNeural");
                      }}
                      className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                        humanPreset === char.id
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
                        setVoiceActor(vox.gender === "female" ? "id-ID-GadisNeural" : "id-ID-ArdiNeural");
                      }}
                      className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                        voxelPreset === vox.id
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

            {/* Multi-Pose Photo Uploader (Always accessible or auto-switches to Foto Sendiri) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Upload Foto Manusia (PNG Transparan / Foto Pose, 1–4 Pose):</span>
                <span className="text-emerald-400">Auto-Float & Vocal Bounce</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { idx: 0, label: "Pose 1 (Utama)" },
                  { idx: 1, label: "Pose 2 (Masalah)" },
                  { idx: 2, label: "Pose 3 (Solusi)" },
                  { idx: 3, label: "Pose 4 (CTA)" },
                ].map((slot) => {
                  const imgUrl = avatarPhotos[slot.idx];
                  return (
                    <div
                      key={slot.idx}
                      className="relative rounded-xl border border-dashed border-white/15 bg-black/40 p-2 flex flex-col items-center justify-center min-h-[88px] hover:border-emerald-400/50 transition-colors"
                    >
                      {imgUrl ? (
                        <>
                          <img
                            src={imgUrl}
                            alt={slot.label}
                            className="h-14 w-14 object-contain rounded"
                          />
                          <span className="text-[10px] font-mono text-emerald-300 mt-1 truncate max-w-full">
                            {slot.label}
                          </span>
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
              {localGpuInfo && (
                <p className="text-[10px] font-mono text-zinc-500">
                  💡 {localGpuInfo.note}
                </p>
              )}
            </div>
          </div>

          {/* 12 Hype Visual Archetypes Selector with Favorite Cluster */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-3 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-mono font-semibold text-zinc-300">
                GAYA VISUAL ARSITEKTUR ({Object.keys(MOTION_PALETTES).length} ARCHETYPES)
              </label>

              {/* Cluster Filter Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setStyleFilter("all")}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    styleFilter === "all"
                      ? "bg-white/15 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Semua ({Object.keys(MOTION_PALETTES).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStyleFilter("favorites")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    styleFilter === "favorites"
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
                        className={`relative p-2.5 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer select-none ${
                          motionStyle === st.id
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
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              isFav
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

            {/* In-Browser Native Video Download Action */}
            <div className="pt-3 space-y-2.5">
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
                <a
                  href={recordedVideoUrl}
                  download={recordedFileName}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-3 font-mono text-xs font-bold text-emerald-300 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>✅ VIDEO SIAP! KLIK DI SINI JIKA FILE BELUM TERUNDUH OTOMATIS ({recordedFileName})</span>
                </a>
              )}

              <p className="text-[11px] font-mono text-zinc-400 text-center">
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

          <div className="mt-4 w-full max-w-[340px] space-y-2 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={async () => {
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
                    } catch (_) {}
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
                  setIsPlaying(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play dari Awal</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  const { ctx } = getOrCreateAudioEngine();
                  if (ctx.state === "suspended") {
                    await ctx.resume();
                  }
                  if (isPlaying) {
                    pausedElapsedRef.current = Date.now() - startTimeRef.current;
                    if (activeAudioSourceRef.current) {
                      try {
                        activeAudioSourceRef.current.stop();
                      } catch (_) {}
                    }
                    playedSceneAudioRef.current = -1;
                    setIsPlaying(false);
                  } else {
                    startTimeRef.current = Date.now() - pausedElapsedRef.current;
                    playedSceneAudioRef.current = -1;
                    setIsPlaying(true);
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isPlaying ? "Pause" : "Lanjut"}</span>
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
