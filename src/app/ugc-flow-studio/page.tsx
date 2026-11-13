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
  Layers,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle,
  Play,
  ArrowRight,
  Boxes,
  Eye,
  Bot,
  Cpu,
  Clock,
  Sparkle,
  MessageSquare,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { VideoAiEngine, LlmModelType } from "../api/ugc-flow-clarify/route";

interface ClarifyQuestion {
  id: string;
  label: string;
  question: string;
  tip?: string;
  options: string[];
  defaultChoice: string;
}

interface UgcScene {
  sceneNumber: number;
  timeRange: string;
  stageName: string;
  voiceoverScriptId: string;
  cameraDirective: string;
  flowVisualPrompt: string;
  audioSoundscapePrompt: string;
  keyVisualBeat: string;
}

interface MasterDirectiveData {
  projectTitle: string;
  overview: string;
  totalDuration: string;
  engineTarget: VideoAiEngine;
  llmModel?: string;
  hostProfile: {
    name: string;
    anchorTag: string;
    masterCharacterPrompt: string;
    negativePrompt: string;
  };
  environmentProfile: {
    name: string;
    anchorTag: string;
    masterSettingPrompt: string;
    negativePrompt: string;
  };
  objectProfile: {
    name: string;
    anchorTag: string;
    masterObjectPrompt: string;
  };
  scenes: UgcScene[];
  engineDirectPrompt?: string;
  operatorGuide: string[];
  hostImage?: string | null;
  productImage?: string | null;
}

const VIDEO_TOOLS: Array<{ id: VideoAiEngine; label: string; desc: string }> = [
  { id: "google-flow", label: "Google Flow (Veo 2)", desc: "Multi-shot /camera & tag @" },
  { id: "runway-gen3", label: "Runway Gen-3 Alpha", desc: "Cinematic movement & lens" },
  { id: "kling-ai", label: "Kling AI", desc: "High-fidelity motion & physics" },
  { id: "luma-dream-machine", label: "Luma Dream Machine", desc: "Camera trajectory & smooth flow" },
  { id: "hailuo-minimax", label: "Hailuo AI (MiniMax)", desc: "Ekspresi manusia hiper-nyata" },
  { id: "wan-video", label: "Wan2.1 (Wan Video)", desc: "Open-source aesthetic cinematic" },
  { id: "capcut-ai", label: "CapCut AI Video", desc: "Beat-sync & media b-roll" },
];

const LLM_MODELS: Array<{ id: LlmModelType; label: string }> = [
  { id: "gemini", label: "Gemini" },
  { id: "claude", label: "Claude" },
  { id: "gpt", label: "ChatGPT" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "kimi", label: "Kimi" },
  { id: "grok", label: "Grok" },
];

function compressImage(file: File, maxDim = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UgcFlowStudioPage() {
  // Step 1: Core Inputs
  const [topic, setTopic] = useState("");
  const [targetDuration, setTargetDuration] = useState<"<=10s" | "<=60s" | "<=120s" | ">120s">("<=60s");
  const [engineCategory, setEngineCategory] = useState<"video-ai" | "llm-native">("video-ai");
  const [videoTool, setVideoTool] = useState<VideoAiEngine>("google-flow");
  const [llmModel, setLlmModel] = useState<LlmModelType>("gemini");

  const [styleGenre, setStyleGenre] = useState<
    "hyper-real-ugc" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial"
  >("hyper-real-ugc");
  const [hostType, setHostType] = useState<"male-casual" | "female-pro" | "custom" | "none-faceless" | "cartoon-3d-animation">("female-pro");
  const [customHostDescription, setCustomHostDescription] = useState("");
  const [cameraArchetype, setCameraArchetype] = useState<
    "auto" | "bird-eye-drone" | "low-angle-heroic" | "orbit-360" | "dutch-angle" | "pov-first-person"
  >("auto");

  // User uploaded reference images for 100% character and product consistency
  const [hostImage, setHostImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);

  // Workflow State: 1 = Input, 2 = Clarification, 3 = Result
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(1);
  const [isLoadingClarify, setIsLoadingClarify] = useState(false);
  const [clarifyQuestions, setClarifyQuestions] = useState<ClarifyQuestion[]>([]);
  const [clarifyAnswers, setClarifyAnswers] = useState<Record<string, string>>({});

  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const [masterResult, setMasterResult] = useState<MasterDirectiveData | null>(null);
  const [activeBoardTab, setActiveBoardTab] = useState<"storyboard" | "direct-prompt" | "character" | "environment" | "guide">("storyboard");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Voiceover Preview State
  const [playingSceneAudio, setPlayingSceneAudio] = useState<number | null>(null);
  const [audioLoadingScene, setAudioLoadingScene] = useState<number | null>(null);

  // Active engine computation
  const activeEngineTarget: VideoAiEngine = engineCategory === "llm-native" ? "llm-native" : videoTool;

  // Auto-switch engine when <=10s is selected
  const handleDurationChange = (dur: "<=10s" | "<=60s" | "<=120s" | ">120s") => {
    setTargetDuration(dur);
    if (dur === "<=10s") {
      setEngineCategory("llm-native");
    }
  };

  // STEP 1 -> STEP 2: Ask Clarification Questions
  const handleStartClarification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoadingClarify(true);
    try {
      const res = await fetch("/api/ugc-flow-clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          targetDuration,
          engineTarget: activeEngineTarget,
          llmModel,
          styleGenre,
          hostType,
          customHostDescription,
          cameraArchetype,
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setClarifyQuestions(data.questions);
        const defaults: Record<string, string> = {};
        data.questions.forEach((q: ClarifyQuestion) => {
          defaults[q.id] = q.defaultChoice || q.options[0];
        });
        setClarifyAnswers(defaults);
        setWorkflowStep(2);
      }
    } catch (err) {
      console.error("Clarify error:", err);
    } finally {
      setIsLoadingClarify(false);
    }
  };

  // STEP 2 -> STEP 3: Generate Clean Professional Master Directive
  const handleGenerateFinalDirective = async () => {
    setIsGeneratingFinal(true);
    try {
      const res = await fetch("/api/ugc-flow-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          targetDuration,
          engineTarget: activeEngineTarget,
          llmModel,
          styleGenre,
          hostType: hostImage ? "custom-upload" : hostType,
          customHostDescription,
          cameraArchetype,
          clarificationAnswers: clarifyAnswers,
          hostImage,
          productImage,
        }),
      });

      const data = await res.json();
      if (data.data) {
        data.data.hostImage = hostImage;
        data.data.productImage = productImage;
        setMasterResult(data.data);
        setWorkflowStep(3);
        setActiveBoardTab("storyboard");
      }
    } catch (err) {
      console.error("Final generation error:", err);
    } finally {
      setIsGeneratingFinal(false);
    }
  };

  // Copy helper
  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateFullProjectPrompt = (result: MasterDirectiveData) => {
    const isLlm = result.engineTarget === "llm-native" || result.totalDuration === "<=10s";
    const hasHostImg = Boolean(result.hostImage);
    const hasProdImg = Boolean(result.productImage);

    const multimodalGuide =
      hasHostImg || hasProdImg
        ? `\n[PANDUAN EKSEKUSI MULTIMODAL DI GEMINI / VIDEO AI]:
1. Buka Gemini (gemini.google.com) atau video generator favorit Anda.
2. Lampirkan/Upload foto referensi berikut ke chatbox:
   ${hasHostImg ? "-> [FOTO 1]: Foto Host / Karakter (@host_anchor)" : ""}
   ${hasProdImg ? "-> [FOTO 2]: Foto Produk / Objek (@hero_object)" : ""}
3. Tempelkan seluruh prompt ini. Gemini & Video AI akan mengunci konsistensi 100% wajah, pakaian, dan wujud produk di semua sekuens adegan berantai!\n`
        : "";

    const header = `=== PROYEK: ${result.projectTitle.toUpperCase()} ===
Durasi Total: ${result.totalDuration} (${result.scenes.length} Adegan)
Target Format: ${result.engineTarget.toUpperCase()}${result.llmModel ? ` (Model: ${result.llmModel.toUpperCase()})` : ""}
${multimodalGuide}
[REFERENSI KARAKTER & HOST]:
Tag: ${result.hostProfile.anchorTag}${hasHostImg ? " (MENGACU PADA FOTO REFERENSI HOST TERLAMPIR)" : ""}
Deskripsi: ${result.hostProfile.masterCharacterPrompt}

[REFERENSI SETTING & AMBIENCE]:
Tag: ${result.environmentProfile.anchorTag}
Deskripsi: ${result.environmentProfile.masterSettingPrompt}

[REFERENSI OBJEK / HERO DETAIL]:
Tag: ${result.objectProfile.anchorTag}${hasProdImg ? " (MENGACU PADA FOTO REFERENSI PRODUK TERLAMPIR)" : ""}
Deskripsi: ${result.objectProfile.masterObjectPrompt}

[HUKUM SINKRONISASI AI VIDEO (HYPER-SMART ONE-SHOT)]:
1. Causal Audio-Visual Lock: Seluruh efek suara foley (misal: bunyi kriuk makanan 'kress', patahan, tegukan) WAJIB disertai aksi fisik visual nyata di layar pada detik terjadinya suara (hindari suara kriuk tanpa kentang/makanan digigit atau dipatahkan).
2. Action Breakdown: Momen aksi fisik (menggigit/mematahkan) terjadi saat jeda bicara [pause], disusul ekspresi reaksi puas.

==================================================
DAFTAR ADEGAN, NASKAH DIALOG & ARAHAN PROMPT:
==================================================`;

    const scenesText = result.scenes
      .map(
        (s: UgcScene) =>
          `--- ADEGAN ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ---
[NASKAH VOICEOVER / DIALOG]:
"${s.voiceoverScriptId}"

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT]:
${s.flowVisualPrompt}

[SOUNDSCAPE]:
${s.audioSoundscapePrompt}`
      )
      .join("\n\n");

    return `${header}\n\n${scenesText}`;
  };

  const generateFullScriptOnly = (result: MasterDirectiveData) => {
    return result.scenes
      .map(
        (s: UgcScene) =>
          `[Adegan ${s.sceneNumber} (${s.timeRange}) - ${s.stageName}]\n"${s.voiceoverScriptId}"`
      )
      .join("\n\n");
  };

  // Play Real TTS Voiceover for scene script
  const handlePlayVoice = async (sceneNumber: number, scriptText: string) => {
    if (playingSceneAudio === sceneNumber) {
      setPlayingSceneAudio(null);
      return;
    }

    setAudioLoadingScene(sceneNumber);
    try {
      const voice = hostType === "female-pro" ? "id-ID-GadisNeural" : "id-ID-ArdiNeural";
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scriptText.replace(/\[.*?\]/g, ""),
          voice,
        }),
      });

      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      setPlayingSceneAudio(sceneNumber);
      audio.play();
      audio.onended = () => {
        setPlayingSceneAudio(null);
      };
    } catch (err) {
      console.error("Audio playback error:", err);
    } finally {
      setAudioLoadingScene(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#e3ded8] font-sans antialiased selection:bg-[#c29b74]/30 selection:text-white pb-20">
      {/* Japandi Top Navigation Bar */}
      <header className="border-b border-[#252321] bg-[#121315]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#a39e97] hover:text-[#e8dfd5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c29b74]/30 bg-[#c29b74]/10 px-3 py-0.5 text-[11px] font-mono text-[#d4af88]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af88]" />
            <span>STUDIO UGC & MULTI-TOOL DIRECTOR</span>
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Header Hero (Japandi Warm Minimalist) */}
        <section className="mb-8 rounded-2xl border border-[#2b2724] bg-[#151619] p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f5f1eb]">
            UGC & Cinematic Director
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#9e978f] leading-relaxed max-w-2xl">
            Rancang konsep narasi UGC dan sekuens video profesional. Mendukung beragam tools favorit editor: Google Flow, Runway, Kling, Luma, MiniMax, Wan, CapCut, hingga prompt langsung ke LLM.
          </p>

          {/* Clean Stepper */}
          <div className="mt-6 flex items-center gap-2 sm:gap-3 border-t border-[#262422] pt-4 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-md ${workflowStep >= 1 ? "bg-[#c29b74] text-[#121315] font-semibold" : "text-[#6b6660]"}`}>
              1. Brief & Tools
            </span>
            <span className="text-[#4a4642]">/</span>
            <span className={`px-2.5 py-1 rounded-md ${workflowStep >= 2 ? "bg-[#c29b74] text-[#121315] font-semibold" : "text-[#6b6660]"}`}>
              2. Detail Gaya
            </span>
            <span className="text-[#4a4642]">/</span>
            <span className={`px-2.5 py-1 rounded-md ${workflowStep === 3 ? "bg-[#c29b74] text-[#121315] font-semibold" : "text-[#6b6660]"}`}>
              3. Naskah & Prompts
            </span>
          </div>
        </section>

        {/* STEP 1: INITIAL PARAMETER FORM */}
        {workflowStep === 1 && (
          <form onSubmit={handleStartClarification} className="space-y-6">
            <div className="rounded-2xl border border-[#2b2724] bg-[#151619] p-6 sm:p-8 space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-xs font-mono font-medium text-[#c4bcb2] mb-2 uppercase tracking-wider">
                  Topik Video atau Deskripsi Produk *
                </label>
                <textarea
                  required
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ketik topik, ide konten, nama brand, produk, atau tempat yang ingin dibahas..."
                  className="w-full rounded-xl border border-[#2d2a27] bg-[#1a1b1f] p-4 text-sm text-[#f5f1eb] placeholder:text-[#5c5751] focus:border-[#c29b74] focus:outline-none leading-relaxed transition-colors"
                />
              </div>

              {/* Target Duration Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-[#c4bcb2] mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Pilihan Durasi Video</span>
                  <span className="text-[11px] text-[#8c857c] normal-case font-sans">
                    {targetDuration === "<=10s"
                      ? "Klip singkat 10 detik (Cocok langsung di LLM)"
                      : targetDuration === "<=60s"
                      ? "Short-form standar (6 Adegan)"
                      : targetDuration === "<=120s"
                      ? "Deep-story (8 Adegan)"
                      : "Epic Storyboard (12 Adegan)"}
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { id: "<=10s", label: "≤ 10 Detik", desc: "Klip Singkat Instan" },
                      { id: "<=60s", label: "≤ 60 Detik", desc: "Shorts & Reels" },
                      { id: "<=120s", label: "≤ 120 Detik", desc: "UGC Komplit" },
                      { id: ">120s", label: "> 120 Detik", desc: "Story Panjang" },
                    ] as const
                  ).map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => handleDurationChange(dur.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        targetDuration === dur.id
                          ? "border-[#c29b74] bg-[#c29b74]/15 text-[#f5f1eb]"
                          : "border-[#2d2a27] bg-[#1a1b1f] text-[#8c857c] hover:border-[#423e3a] hover:text-[#c4bcb2]"
                      }`}
                    >
                      <span className="block text-xs font-mono font-bold">{dur.label}</span>
                      <span className="block text-[10px] text-[#736d65] mt-0.5">{dur.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Tool Video & LLM Engine Selector */}
              <div className="rounded-xl border border-[#2d2a27] bg-[#1a1b1f] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262422] pb-3">
                  <div>
                    <h4 className="text-xs font-mono font-semibold text-[#f5f1eb] flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-[#c29b74]" />
                      <span>Target Engine Eksekusi Video</span>
                    </h4>
                    <p className="text-[11px] text-[#8c857c] mt-0.5">
                      Pilih software atau platform AI yang biasa Anda pakai untuk render video.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEngineCategory("video-ai")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        engineCategory === "video-ai"
                          ? "bg-[#c29b74] text-[#121315] font-bold"
                          : "bg-[#151619] border border-[#2d2a27] text-[#8c857c]"
                      }`}
                    >
                      Tools Video AI (7 Pilihan)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEngineCategory("llm-native")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        engineCategory === "llm-native"
                          ? "bg-[#c29b74] text-[#121315] font-bold"
                          : "bg-[#151619] border border-[#2d2a27] text-[#8c857c]"
                      }`}
                    >
                      Langsung di LLM (6 Model)
                    </button>
                  </div>
                </div>

                {/* Video AI Tools Grid */}
                {engineCategory === "video-ai" && (
                  <div className="space-y-2">
                    <span className="block text-[11px] font-mono text-[#a39e97]">
                      Pilih Tools Video Pilihan Editor:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {VIDEO_TOOLS.map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => setVideoTool(tool.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            videoTool === tool.id
                              ? "border-[#c29b74] bg-[#c29b74]/15 text-[#f5f1eb]"
                              : "border-[#262422] bg-[#151619] text-[#8c857c] hover:border-[#383531] hover:text-[#b8b0a5]"
                          }`}
                        >
                          <span className="block text-xs font-mono font-semibold">{tool.label}</span>
                          <span className="block text-[10px] text-[#706a62] mt-0.5">{tool.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LLM Models Grid */}
                {engineCategory === "llm-native" && (
                  <div className="space-y-2">
                    <span className="block text-[11px] font-mono text-[#a39e97]">
                      Pilih Model LLM untuk Eksekusi Langsung:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {LLM_MODELS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setLlmModel(m.id)}
                          className={`py-2 px-2 text-center rounded-lg text-xs font-mono border transition-all ${
                            llmModel === m.id
                              ? "border-[#c29b74] bg-[#c29b74]/20 text-[#f5f1eb] font-semibold"
                              : "border-[#282624] bg-[#151619] text-[#78726a] hover:text-[#b0a99f]"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Genre & Host Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#c4bcb2] mb-1.5 uppercase tracking-wider">
                    Gaya Visual & Suasana
                  </label>
                  <select
                    value={styleGenre}
                    onChange={(e: any) => setStyleGenre(e.target.value)}
                    className="w-full rounded-xl border border-[#2d2a27] bg-[#1a1b1f] p-3 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  >
                    <option value="hyper-real-ugc">Hyper-Realistic Social UGC (Autentik & Bersahabat)</option>
                    <option value="cinematic-resort">Cinematic High-End (Sinematik & Megah)</option>
                    <option value="luxury-commercial">Luxury Commercial (Editorial & Halus)</option>
                    <option value="tech-review">Tech & Product Precision (Fokus Detail Produk)</option>
                    <option value="cartoon-3d-animation">Stylized 3D Character (Karakter Animasi 3D)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#c4bcb2] mb-1.5 uppercase tracking-wider">
                    Persona Host / Presenter
                  </label>
                  <select
                    value={hostType}
                    onChange={(e: any) => setHostType(e.target.value)}
                    className="w-full rounded-xl border border-[#2d2a27] bg-[#1a1b1f] p-3 text-xs text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                  >
                    {hostImage && (
                      <option value="custom">👤 Foto Host Terlampir (Kreator Anda Sendiri)</option>
                    )}
                    <option value="female-pro">Sarah — Modern Professional (Hangat & Artikulatif)</option>
                    <option value="male-casual">Bimo — Smart Casual (Ramah & Terbuka)</option>
                    <option value="none-faceless">Faceless / POV (Fokus Produk & Tangan)</option>
                    <option value="cartoon-3d-animation">Stylized 3D Animated Host (Karakter Kartun)</option>
                    <option value="custom">Kustomisasi Sendiri (Tulis deskripsi)</option>
                  </select>
                </div>
              </div>

              {/* Upload Foto Referensi Karakter & Produk (Kunci Konsistensi 100%) */}
              <div className="rounded-2xl border border-[#2d2a27] bg-[#141518] p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-[#f5f1eb] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#c29b74]" />
                      Foto Referensi Host & Produk (Kunci Konsistensi 100%)
                    </h3>
                    <p className="text-[11px] text-[#8c857c] font-sans mt-0.5">
                      Upload foto wajah kreator & foto produk asli untuk mengunci penampilan karakter dan barang agar konsisten di setiap adegan (Gemini & Flow ready).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Foto Host / UGC Creator */}
                  <div className="rounded-xl border border-[#262422] bg-[#1a1b1f] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-[#c4bcb2] flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#c29b74]" />
                        Foto Host / Kreator (@host_anchor)
                      </span>
                      {hostImage && (
                        <button
                          type="button"
                          onClick={() => setHostImage(null)}
                          className="text-[10px] font-mono text-[#e06c75] hover:underline flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Hapus
                        </button>
                      )}
                    </div>

                    {hostImage ? (
                      <div className="flex items-center gap-3 bg-[#111214] p-2.5 rounded-lg border border-[#33302c]">
                        <img
                          src={hostImage}
                          alt="Host Reference"
                          className="h-16 w-16 rounded-lg object-cover border border-[#c29b74]/40"
                        />
                        <div className="text-xs">
                          <span className="font-mono text-[#c29b74] font-medium block">Foto Host Terlampir</span>
                          <span className="text-[11px] text-[#7d776f]">Wajah, rambut, & pakaian dikunci di semua adegan</span>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#33302c] hover:border-[#c29b74]/50 rounded-xl p-4 cursor-pointer transition-all bg-[#121315]">
                        <Upload className="h-5 w-5 text-[#8c857c] mb-1.5" />
                        <span className="text-xs font-mono text-[#c4bcb2]">Upload Foto Wajah / Kreator</span>
                        <span className="text-[10px] text-[#635d56] mt-0.5">JPG / PNG / WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const b64 = await compressImage(file);
                              setHostImage(b64);
                              setHostType("custom");
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Upload Foto Produk / Hero Object */}
                  <div className="rounded-xl border border-[#262422] bg-[#1a1b1f] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-[#c4bcb2] flex items-center gap-1.5">
                        <Boxes className="h-3.5 w-3.5 text-[#c29b74]" />
                        Foto Produk / Makanan (@hero_object)
                      </span>
                      {productImage && (
                        <button
                          type="button"
                          onClick={() => setProductImage(null)}
                          className="text-[10px] font-mono text-[#e06c75] hover:underline flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> Hapus
                        </button>
                      )}
                    </div>

                    {productImage ? (
                      <div className="flex items-center gap-3 bg-[#111214] p-2.5 rounded-lg border border-[#33302c]">
                        <img
                          src={productImage}
                          alt="Product Reference"
                          className="h-16 w-16 rounded-lg object-cover border border-[#c29b74]/40"
                        />
                        <div className="text-xs">
                          <span className="font-mono text-[#c29b74] font-medium block">Foto Produk Terlampir</span>
                          <span className="text-[11px] text-[#7d776f]">Kemasan, warna, & tekstur dikunci di semua adegan</span>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#33302c] hover:border-[#c29b74]/50 rounded-xl p-4 cursor-pointer transition-all bg-[#121315]">
                        <Upload className="h-5 w-5 text-[#8c857c] mb-1.5" />
                        <span className="text-xs font-mono text-[#c4bcb2]">Upload Foto Produk / Objek</span>
                        <span className="text-[10px] text-[#635d56] mt-0.5">JPG / PNG / WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const b64 = await compressImage(file);
                              setProductImage(b64);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {hostType === "custom" && (
                <div>
                  <label className="block text-xs font-mono font-medium text-[#c29b74] mb-1.5">
                    Deskripsi Karakter Kustom
                  </label>
                  <input
                    type="text"
                    value={customHostDescription}
                    onChange={(e) => setCustomHostDescription(e.target.value)}
                    placeholder="Tuliskan penampilan fisik, pakaian, atau karakter host yang diinginkan..."
                    className="w-full rounded-xl border border-[#c29b74]/30 bg-[#1a1b1f] p-3 text-xs text-[#f5f1eb] placeholder:text-[#5c5751] focus:border-[#c29b74] focus:outline-none"
                  />
                </div>
              )}

              {/* Camera Preference */}
              <div>
                <label className="block text-xs font-mono font-medium text-[#c4bcb2] mb-1.5 uppercase tracking-wider">
                  Preferensi Sudut Kamera Awal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "auto", label: "Auto (Rekomendasi Terbaik)" },
                    { id: "bird-eye-drone", label: "Bird-Eye Drone ke Eye-Level" },
                    { id: "low-angle-heroic", label: "Low-Angle Heroic" },
                    { id: "orbit-360", label: "Continuous 360 Orbit" },
                    { id: "dutch-angle", label: "Dutch Angle 15°" },
                    { id: "pov-first-person", label: "First-Person POV" },
                  ].map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraArchetype(cam.id as any)}
                      className={`p-2.5 rounded-lg text-left text-xs font-mono border transition-all ${
                        cameraArchetype === cam.id
                          ? "border-[#c29b74] bg-[#c29b74]/15 text-[#f5f1eb] font-semibold"
                          : "border-[#282624] bg-[#1a1b1f] text-[#7d776f] hover:text-[#b8b0a5]"
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingClarify || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-xs font-semibold bg-[#c29b74] hover:bg-[#d1aa82] text-[#121315] shadow-sm cursor-pointer transition-all disabled:opacity-40"
              >
                {isLoadingClarify ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Menyusun Rekomendasi Gaya...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjutkan ke Penyesuaian Detail →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CLARIFICATION STEP */}
        {workflowStep === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#2b2724] bg-[#151619] p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between border-b border-[#262422] pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#f5f1eb]">
                    Sesuaikan Nuansa & Detail Gaya
                  </h3>
                  <p className="text-xs text-[#9e978f] font-sans mt-1">
                    Pilih opsi yang paling mewakili karakter video Anda, atau ketik manual bila memiliki kebutuhan spesifik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWorkflowStep(1)}
                  className="text-xs font-mono text-[#a39e97] hover:text-[#f5f1eb] underline"
                >
                  Ubah Brief
                </button>
              </div>

              <div className="space-y-5">
                {clarifyQuestions.map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-[#282624] bg-[#1a1b1f] p-4 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c29b74]/20 text-[#c29b74] text-xs font-mono font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-mono font-semibold text-[#f5f1eb]">{q.label}</h4>
                    </div>
                    <p className="text-xs text-[#b8b1a7] font-sans">{q.question}</p>
                    {q.tip && (
                      <div className="rounded-lg bg-[#c29b74]/10 border border-[#c29b74]/20 px-3 py-1.5 text-[11px] font-sans text-[#d4af88]">
                        💡 {q.tip}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setClarifyAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt,
                            }))
                          }
                          className={`text-left p-3 rounded-lg text-xs font-sans transition-all border ${
                            clarifyAnswers[q.id] === opt
                              ? "bg-[#c29b74]/20 border-[#c29b74] text-[#f5f1eb] font-medium"
                              : "bg-[#151619] border-[#262422] text-[#8c857c] hover:border-[#3d3935] hover:text-[#c4bcb2]"
                          }`}
                        >
                          <span className="block">{opt}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <div className="pt-2">
                      <input
                        type="text"
                        placeholder={`Atau ketik kustom untuk ${q.label.toLowerCase()}...`}
                        value={
                          q.options.includes(clarifyAnswers[q.id])
                            ? ""
                            : clarifyAnswers[q.id] || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setClarifyAnswers((prev) => ({
                            ...prev,
                            [q.id]: val.trim() ? val : q.defaultChoice,
                          }));
                        }}
                        className="w-full rounded-lg border border-[#282624] bg-[#121315] p-2.5 text-xs text-[#f5f1eb] placeholder:text-[#524d47] focus:border-[#c29b74] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWorkflowStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-[#2b2724] text-xs font-mono text-[#a39e97] hover:text-[#f5f1eb]"
                >
                  ← Kembali
                </button>

                <button
                  type="button"
                  onClick={handleGenerateFinalDirective}
                  disabled={isGeneratingFinal}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-xs font-semibold bg-[#c29b74] hover:bg-[#d1aa82] text-[#121315] cursor-pointer transition-all disabled:opacity-40"
                >
                  {isGeneratingFinal ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Menyusun Naskah & Arahan Visual...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Hasilkan Naskah & Prompt Sempurna →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MASTER DIRECTIVE RESULT */}
        {workflowStep === 3 && masterResult && (
          <div className="space-y-6">
            {/* Project Overview Bar */}
            <div className="rounded-2xl border border-[#2b2724] bg-[#151619] p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#f5f1eb] font-sans">
                  {masterResult.projectTitle}
                </h3>
                <p className="text-xs text-[#8c857c] font-mono mt-0.5">
                  Durasi: {masterResult.totalDuration} • {masterResult.scenes.length} Adegan • Format Tool:{" "}
                  <span className="text-[#c29b74] uppercase font-bold">{masterResult.engineTarget}</span>
                  {masterResult.engineTarget === "llm-native" && masterResult.llmModel && (
                    <span> ({masterResult.llmModel.toUpperCase()})</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyText(JSON.stringify(masterResult, null, 2), "all-json")
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-[#2d2a27] bg-[#1a1b1f] px-3.5 py-2 text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                >
                  {copiedKey === "all-json" ? <Check className="h-3.5 w-3.5 text-[#c29b74]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === "all-json" ? "Tersalin" : "Salin JSON"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkflowStep(2)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2d2a27] bg-[#1a1b1f] px-3.5 py-2 text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Ubah Detail</span>
                </button>
              </div>
            </div>

            {/* Board Navigation Tabs */}
            <div className="flex border-b border-[#282624] gap-1 overflow-x-auto">
              {[
                { id: "storyboard", label: `Naskah & Adegan (${masterResult.scenes.length})`, icon: Film },
                {
                  id: "direct-prompt",
                  label: `Master Prompt (${masterResult.engineTarget.toUpperCase()})`,
                  icon: MessageSquare,
                },
                { id: "character", label: "Karakter (@host)", icon: Users },
                { id: "environment", label: "Setting & Objek", icon: Boxes },
                { id: "guide", label: "Panduan", icon: Compass },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBoardTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-4 font-mono text-xs border-b-2 transition-all whitespace-nowrap ${
                      activeBoardTab === tab.id
                        ? "border-[#c29b74] text-[#f5f1eb] font-semibold"
                        : "border-transparent text-[#7d776f] hover:text-[#b8b0a5]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB: STORYBOARD & SCENE SCRIPT */}
            {activeBoardTab === "storyboard" && (
              <div className="space-y-4">
                {/* Storyboard Top Quick Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#282624] bg-[#141518] p-3.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#c29b74]" />
                    <span className="text-xs font-mono text-[#cfc8bf]">
                      Total {masterResult.scenes.length} Adegan Terstruktur ({masterResult.totalDuration})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(generateFullScriptOnly(masterResult), "all-dialogues")
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-[#2d2a27] bg-[#1a1b1f] px-3 py-1.5 text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                      title="Salin seluruh naskah kata-kata / dialog saja tanpa arahan teknis"
                    >
                      {copiedKey === "all-dialogues" ? (
                        <Check className="h-3 w-3 text-[#c29b74]" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedKey === "all-dialogues" ? "Semua Dialog Tersalin" : "Salin Semua Dialog"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyText(generateFullProjectPrompt(masterResult), "all-scenes-full")
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                      title="Salin seluruh naskah + arahan kamera + visual prompt semua adegan sekaligus"
                    >
                      {copiedKey === "all-scenes-full" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "all-scenes-full" ? "Semua Adegan Tersalin!" : "Salin Seluruh Adegan (Lengkap)"}</span>
                    </button>
                  </div>
                </div>

                {masterResult.scenes.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="rounded-2xl border border-[#282624] bg-[#151619] p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242220] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#c29b74]/20 text-[#c29b74] font-mono font-bold text-xs">
                          {scene.sceneNumber}
                        </span>
                        <div>
                          <h4 className="font-sans text-sm font-semibold text-[#f5f1eb]">
                            {scene.stageName}
                          </h4>
                          <span className="text-[11px] font-mono text-[#7d776f]">
                            {scene.timeRange}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Audio Voiceover Button */}
                        <button
                          type="button"
                          onClick={() => handlePlayVoice(scene.sceneNumber, scene.voiceoverScriptId)}
                          disabled={audioLoadingScene === scene.sceneNumber}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            playingSceneAudio === scene.sceneNumber
                              ? "bg-[#c29b74] text-[#121315] font-semibold"
                              : "bg-[#1a1b1f] border border-[#2d2a27] text-[#c4bcb2] hover:text-[#f5f1eb]"
                          }`}
                        >
                          {audioLoadingScene === scene.sceneNumber ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : playingSceneAudio === scene.sceneNumber ? (
                            <Volume2 className="h-3 w-3 animate-pulse" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                          <span>
                            {audioLoadingScene === scene.sceneNumber
                              ? "Memuat..."
                              : playingSceneAudio === scene.sceneNumber
                              ? "Memutar..."
                              : "Dengar Suara"}
                          </span>
                        </button>

                        {/* Copy Dialog Only */}
                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              `"${scene.voiceoverScriptId}"`,
                              `dialog-${scene.sceneNumber}`
                            )
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a1b1f] border border-[#2d2a27] text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                          title="Salin Naskah Dialog Saja"
                        >
                          {copiedKey === `dialog-${scene.sceneNumber}` ? (
                            <Check className="h-3 w-3 text-[#c29b74]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedKey === `dialog-${scene.sceneNumber}` ? "Dialog Tersalin" : "Salin Dialog"}</span>
                        </button>

                        {/* Copy Full Scene Prompt */}
                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              `[NASKAH VOICEOVER]\n"${scene.voiceoverScriptId}"\n\n[ARAHAN KAMERA]\n${scene.cameraDirective}\n\n[VISUAL PROMPT]\n${scene.flowVisualPrompt}\n\n[SOUNDSCAPE]\n${scene.audioSoundscapePrompt}`,
                              `scene-${scene.sceneNumber}`
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#222328] border border-[#383531] text-xs font-mono text-[#f5f1eb] hover:bg-[#2b2c33]"
                          title="Salin Naskah + Arahan Kamera + Prompt Visual + Soundscape"
                        >
                          {copiedKey === `scene-${scene.sceneNumber}` ? (
                            <Check className="h-3 w-3 text-[#c29b74]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedKey === `scene-${scene.sceneNumber}` ? "Prompt Lengkap Tersalin" : "Salin Prompt Lengkap"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Indonesian Voiceover Script */}
                    <div className="rounded-xl border border-[#262422] bg-[#121315] p-4">
                      <span className="block text-[10px] font-mono font-medium text-[#c29b74] uppercase tracking-wider mb-1">
                        Naskah Dialog (Bahasa Indonesia)
                      </span>
                      <p className="text-sm font-sans text-[#f5f1eb] leading-relaxed">
                        “{scene.voiceoverScriptId}”
                      </p>
                    </div>

                    {/* Camera Directive & Visual Prompt */}
                    <div className="space-y-2">
                      <div className="rounded-lg border border-[#282624] bg-[#111214] p-3 font-mono text-xs text-[#d4af88]">
                        <span className="text-[10px] uppercase text-[#6e6861] block mb-0.5">
                          Arahan Kamera ({masterResult.engineTarget.toUpperCase()}):
                        </span>
                        {scene.cameraDirective}
                      </div>

                      <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                        <span className="text-[10px] uppercase text-[#6e6861] block mb-0.5">
                          Visual Prompt ({masterResult.engineTarget.toUpperCase()}):
                        </span>
                        {scene.flowVisualPrompt}
                      </div>
                    </div>

                    {/* Soundscape */}
                    <div className="text-[11px] font-mono text-[#7d776f] flex items-center gap-2">
                      <Volume2 className="h-3.5 w-3.5 text-[#5c5751]" />
                      <span>Soundscape: {scene.audioSoundscapePrompt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: DIRECT PROMPT READY FOR CHOSEN TOOL */}
            {activeBoardTab === "direct-prompt" && masterResult.engineDirectPrompt && (
              <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#242220] pb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#f5f1eb] font-sans">
                      Master Prompt Khusus {masterResult.engineTarget.toUpperCase()}
                    </h4>
                    <p className="text-xs text-[#8c857c] font-sans mt-0.5">
                      Diformat sesuai parameter spesifik dari {masterResult.engineTarget.toUpperCase()}. Salin dan langsung tempelkan ke tools favorit Anda.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyText(masterResult.engineDirectPrompt || "", "direct-prompt")
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                  >
                    {copiedKey === "direct-prompt" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Salin Prompt</span>
                  </button>
                </div>
                <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                  {masterResult.engineDirectPrompt}
                </div>
              </div>
            )}

            {/* TAB: CHARACTER BOARD */}
            {activeBoardTab === "character" && (
              <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#242220] pb-4">
                  <div>
                    <h4 className="text-base font-semibold text-[#f5f1eb] font-sans">
                      Konsistensi Karakter ({masterResult.hostProfile.anchorTag})
                    </h4>
                    <p className="text-xs text-[#8c857c] font-sans mt-0.5">
                      Kunci deskripsi fisik agar wajah, ekspresi, dan pakaian presenter tetap stabil antar adegan.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyText(masterResult.hostProfile.masterCharacterPrompt, "host-prompt")
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                  >
                    {copiedKey === "host-prompt" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Salin Prompt Karakter</span>
                  </button>
                </div>

                {masterResult.hostImage && (
                  <div className="flex items-center gap-4 rounded-xl border border-[#c29b74]/30 bg-[#171614] p-4">
                    <img
                      src={masterResult.hostImage}
                      alt="Host Reference"
                      className="h-20 w-20 rounded-xl object-cover border border-[#c29b74]/50 shrink-0"
                    />
                    <div>
                      <span className="inline-block rounded-md bg-[#c29b74]/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#c29b74] uppercase mb-1">
                        Foto Referensi Host Aktif
                      </span>
                      <h5 className="text-sm font-semibold text-[#f5f1eb] font-sans">
                        Identitas Wajah & Penampilan Terkunci
                      </h5>
                      <p className="text-xs text-[#a8a197] font-sans mt-0.5">
                        Karakter di setiap adegan dikunci mengikuti foto wajah dan pakaian ini secara 100% konsisten.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-mono font-medium text-[#a39e97] block mb-2">
                    Master Character Reference:
                  </span>
                  <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                    {masterResult.hostProfile.masterCharacterPrompt}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono font-medium text-[#b57a70] block mb-2">
                    Negative Constraints:
                  </span>
                  <div className="rounded-xl border border-[#362523] bg-[#1c1413] p-4 font-mono text-xs text-[#d69f96] leading-relaxed select-all">
                    {masterResult.hostProfile.negativePrompt}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ENVIRONMENT & OBJECT BOARD */}
            {activeBoardTab === "environment" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#242220] pb-3">
                    <h4 className="text-sm font-semibold text-[#f5f1eb] font-sans">
                      Setting & Latar ({masterResult.environmentProfile.anchorTag})
                    </h4>
                    <button
                      onClick={() =>
                        copyText(masterResult.environmentProfile.masterSettingPrompt, "env-prompt")
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#1a1b1f] border border-[#2d2a27] px-3 py-1.5 text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                    >
                      {copiedKey === "env-prompt" ? <Check className="h-3.5 w-3.5 text-[#c29b74]" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Salin Setting</span>
                    </button>
                  </div>
                  <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                    {masterResult.environmentProfile.masterSettingPrompt}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#242220] pb-3">
                    <h4 className="text-sm font-semibold text-[#f5f1eb] font-sans">
                      Objek Utama ({masterResult.objectProfile.anchorTag})
                    </h4>
                    <button
                      onClick={() =>
                        copyText(masterResult.objectProfile.masterObjectPrompt, "obj-prompt")
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#1a1b1f] border border-[#2d2a27] px-3 py-1.5 text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                    >
                      {copiedKey === "obj-prompt" ? <Check className="h-3.5 w-3.5 text-[#c29b74]" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>Salin Objek</span>
                    </button>
                  </div>

                  {masterResult.productImage && (
                    <div className="flex items-center gap-4 rounded-xl border border-[#c29b74]/30 bg-[#171614] p-4">
                      <img
                        src={masterResult.productImage}
                        alt="Product Reference"
                        className="h-20 w-20 rounded-xl object-cover border border-[#c29b74]/50 shrink-0"
                      />
                      <div>
                        <span className="inline-block rounded-md bg-[#c29b74]/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#c29b74] uppercase mb-1">
                          Foto Referensi Produk Aktif
                        </span>
                        <h5 className="text-sm font-semibold text-[#f5f1eb] font-sans">
                          Wujud & Kemasan Produk Terkunci
                        </h5>
                        <p className="text-xs text-[#a8a197] font-sans mt-0.5">
                          Bentuk kemasan, warna, logo, dan tekstur produk dikunci di setiap adegan mengikuti foto ini.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                    {masterResult.objectProfile.masterObjectPrompt}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GUIDE */}
            {activeBoardTab === "guide" && (
              <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-4">
                <h4 className="text-base font-semibold text-[#f5f1eb] font-sans">
                  Panduan Penggunaan ({masterResult.engineTarget.toUpperCase()})
                </h4>
                <div className="space-y-2.5">
                  {masterResult.operatorGuide.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl border border-[#262422] bg-[#1a1b1f] p-3.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c29b74]/20 text-[#c29b74] text-xs font-mono font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-sans text-[#cfc8bf] leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Gemini Chained Sequences Consistency Pro-Tip */}
                <div className="rounded-xl border border-[#c29b74]/30 bg-[#171614] p-4 space-y-2 mt-4">
                  <span className="text-xs font-mono font-semibold text-[#c29b74] uppercase tracking-wider block flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Cara Menghasilkan Rangkaian Klip Konsisten Langsung di Gemini:
                  </span>
                  <div className="text-xs font-sans text-[#cfc8bf] leading-relaxed space-y-1">
                    <p>1. Buka <strong>gemini.google.com</strong>.</p>
                    <p>2. Lampirkan/Upload foto Host dan foto Produk Anda ke dalam chat Gemini.</p>
                    <p>3. Salin <strong>Master Prompt</strong> dari tab Master Prompt dan tempelkan ke Gemini.</p>
                    <p>4. Gemini akan membaca kedua foto dan mengunci wajah karakter serta wujud produk di seluruh rangkaian adegan tanpa berganti-ganti wajah atau kemasan!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
