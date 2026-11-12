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
  ShieldAlert,
  Send,
  Boxes,
  Eye,
  Download,
} from "lucide-react";

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
  googleFlowOperatorGuide: string[];
}

export default function UgcFlowStudioPage() {
  // Step 1: Core Inputs
  const [topic, setTopic] = useState("Seaside Resort Luxury Project — Masterplan & Private Villa Showcase");
  const [targetDuration, setTargetDuration] = useState<"60s" | "90s" | "120s">("60s");
  const [styleGenre, setStyleGenre] = useState<
    "hyper-real-ugc" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial"
  >("cinematic-resort");
  const [hostType, setHostType] = useState<"male-casual" | "female-pro" | "custom" | "cartoon-3d-animation">("female-pro");
  const [customHostDescription, setCustomHostDescription] = useState("");
  const [cameraArchetype, setCameraArchetype] = useState<
    "auto" | "bird-eye-drone" | "low-angle-heroic" | "orbit-360" | "dutch-angle" | "pov-first-person"
  >("auto");

  // Workflow State: 1 = Input, 2 = Clarification, 3 = Master Directive Result
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(1);
  const [isLoadingClarify, setIsLoadingClarify] = useState(false);
  const [clarifyQuestions, setClarifyQuestions] = useState<ClarifyQuestion[]>([]);
  const [clarifyAnswers, setClarifyAnswers] = useState<Record<string, string>>({});

  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const [masterResult, setMasterResult] = useState<MasterDirectiveData | null>(null);
  const [activeBoardTab, setActiveBoardTab] = useState<"storyboard" | "character" | "environment" | "guide">("storyboard");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Voiceover Preview State
  const [playingSceneAudio, setPlayingSceneAudio] = useState<number | null>(null);
  const [audioLoadingScene, setAudioLoadingScene] = useState<number | null>(null);

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

  // STEP 2 -> STEP 3: Generate 100% Zero-Correction Master Directive
  const handleGenerateFinalDirective = async () => {
    setIsGeneratingFinal(true);
    try {
      const res = await fetch("/api/ugc-flow-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          targetDuration,
          styleGenre,
          hostType,
          customHostDescription,
          cameraArchetype,
          clarificationAnswers: clarifyAnswers,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setMasterResult(data.data);
        setWorkflowStep(3);
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
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans text-zinc-100">
      {/* Studio Header Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Studio Suite</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-mono font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PITCH-READY ARCHITECTURE</span>
          </span>
        </div>
      </div>

      {/* Main Title Hero */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e131f] via-[#090d16] to-black p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-medium text-indigo-300 mb-3">
          <Video className="h-3.5 w-3.5" />
          <span>GOOGLE FLOW (VEO 2) ALL-IN-ONE UGC DIRECTOR (1-2 MENIT)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          AI UGC & Cinematic Video Multi-Shot Producer
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Dirancang khusus untuk kebutuhan pitching tingkat tinggi: merakit naskah narasi profesional, kontrol sudut kamera ekstrim (<span className="text-indigo-300 font-mono">/camera bird-eye crane</span>), konsistensi karakter (<span className="text-emerald-300 font-mono">@host_anchor</span>), objek hero (<span className="text-amber-300 font-mono">@hero_object</span>), serta storyboard siap paste tanpa revisi.
        </p>

        {/* Workflow Progress Steps */}
        <div className="mt-6 flex items-center gap-2 sm:gap-4 border-t border-white/10 pt-4">
          <div className={`flex items-center gap-2 text-xs font-mono ${workflowStep >= 1 ? "text-indigo-400 font-bold" : "text-zinc-600"}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${workflowStep >= 1 ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-500"}`}>1</span>
            <span>Konsep & Kamera</span>
          </div>
          <span className="text-zinc-600 font-mono">→</span>
          <div className={`flex items-center gap-2 text-xs font-mono ${workflowStep >= 2 ? "text-indigo-400 font-bold" : "text-zinc-600"}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${workflowStep >= 2 ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-500"}`}>2</span>
            <span>Klarifikasi Nol-Koreksi</span>
          </div>
          <span className="text-zinc-600 font-mono">→</span>
          <div className={`flex items-center gap-2 text-xs font-mono ${workflowStep === 3 ? "text-emerald-400 font-bold" : "text-zinc-600"}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${workflowStep === 3 ? "bg-emerald-500 text-black font-bold" : "bg-zinc-800 text-zinc-500"}`}>3</span>
            <span>Master Directive Boards</span>
          </div>
        </div>
      </div>

      {/* STEP 1: INITIAL PARAMETER FORM */}
      {workflowStep === 1 && (
        <form onSubmit={handleStartClarification} className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 sm:p-7 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-200 mb-2">
                1. TOPIK PROYEK / BRIEF PRODUK (BEBAS & FLEKSIBEL) *
              </label>
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Seaside Resort Luxury Project — Masterplan & Private Villa Showcase, kamera dari udara melayang turun ke depan presenter..."
                className="w-full rounded-xl border border-white/10 bg-[#161b26] p-4 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
              <p className="mt-1.5 text-[11px] text-zinc-400 font-mono">
                💡 Reviewer menguji topik kartun 3D, UGC TikTok, atau resort sinematik? Ketikkan saja di sini; mesin akan beradaptasi otomatis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 mb-2">
                  2. TARGET DURASI VIDEO
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["60s", "90s", "120s"] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setTargetDuration(dur)}
                      className={`rounded-xl py-2.5 text-xs font-mono font-bold transition-all ${
                        targetDuration === dur
                          ? "bg-indigo-600 text-white border border-indigo-400 shadow-md shadow-indigo-600/30"
                          : "bg-[#161b26] text-zinc-400 border border-white/5 hover:border-white/20"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
                <span className="block mt-1 text-[10px] font-mono text-zinc-500">
                  {targetDuration === "60s" ? "6 Scene Multi-Shot" : targetDuration === "90s" ? "8 Scene Multi-Shot" : "10 Scene Deep Multi-Shot"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 mb-2">
                  3. GENRE & VISUAL STYLE
                </label>
                <select
                  value={styleGenre}
                  onChange={(e: any) => setStyleGenre(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="cinematic-resort">Cinematic High-End Resort / Drone Master</option>
                  <option value="hyper-real-ugc">Hyper-Realistic Social UGC (iPhone Raw 4K)</option>
                  <option value="luxury-commercial">Luxury Commercial (National Geographic/Vogue)</option>
                  <option value="tech-review">Tech & Gadget Precision Review</option>
                  <option value="cartoon-3d-animation">Stylized 3D Character Animation (Pixar/Disney)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 mb-2">
                  4. KARAKTER PRESENTER (DEFAULT & CUSTOM)
                </label>
                <select
                  value={hostType}
                  onChange={(e: any) => setHostType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="female-pro">Sarah — Wanita Profesional (Luxury / Resort)</option>
                  <option value="male-casual">Bimo — Pria Smart-Casual (Arsitek / Tech UGC)</option>
                  <option value="cartoon-3d-animation">Stylized 3D Animated Host (Kartun)</option>
                  <option value="custom">Kustomisasi Sendiri (Tulis deskripsi)</option>
                </select>
              </div>
            </div>

            {hostType === "custom" && (
              <div>
                <label className="block text-xs font-mono font-bold text-indigo-300 mb-1.5">
                  DESKRIPSI FISIK & OUTFIT KARAKTER KUSTOM
                </label>
                <input
                  type="text"
                  value={customHostDescription}
                  onChange={(e) => setCustomHostDescription(e.target.value)}
                  placeholder="Contoh: Pria berumur 35 tahun, setelan linen putih, kacamata hitam klasik, aksen Mediterania..."
                  className="w-full rounded-xl border border-indigo-500/30 bg-[#161b26] p-3 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Special Camera Maneuver Selector */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">
                    Preferensi Awal Sudut & Gaya Kamera (/camera slash command)
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Pilih gaya dasar sekarang, atau biarkan sistem menanyakan detail & rekomendasi angle di tahap klarifikasi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {[
                  { id: "auto", label: "Auto / Tanyakan di Klarifikasi" },
                  { id: "bird-eye-drone", label: "Bird-Eye Drone to Eye-Level" },
                  { id: "low-angle-heroic", label: "Low-Angle Heroic Pedestal" },
                  { id: "orbit-360", label: "Continuous 360 Orbit Arc" },
                  { id: "dutch-angle", label: "Dutch Angle 15° High-Tension" },
                  { id: "pov-first-person", label: "First-Person POV Walking" },
                ].map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setCameraArchetype(cam.id as any)}
                    className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border ${
                      cameraArchetype === cam.id
                        ? "bg-indigo-600/40 border-indigo-400 text-white font-bold"
                        : "bg-[#161b26] border-white/5 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>{cam.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingClarify || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-mono text-sm font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoadingClarify ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Menganalisis Kebutuhan Pitching & Menyiapkan Klarifikasi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Lanjutkan: Siapkan Pertanyaan Klarifikasi Nol-Koreksi →</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: CLARIFICATION INTERVIEW (NOL KOREKSI) */}
      {workflowStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1017] p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-mono text-amber-300 mb-2 font-bold">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>KLARIFIKASI PRE-GENERATION (KUNCI BEBAS REVISI SAAT PITCHING)</span>
                </span>
                <h3 className="text-xl font-bold text-white">
                  Kunci 4 Detail Penting Sesuai Ekspektasi Tim Reviewer
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Pilih opsi di bawah untuk memastikan Google Flow menghasilkan visual dan naskah yang 100% pas tanpa ada miskomunikasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWorkflowStep(1)}
                className="text-xs font-mono text-zinc-400 hover:text-white underline"
              >
                Ubah Brief
              </button>
            </div>

            <div className="space-y-5">
              {clarifyQuestions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-white/10 bg-[#161b26] p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-mono font-bold text-white">{q.label}</h4>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans">{q.question}</p>
                  {q.tip && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[11px] font-mono text-emerald-300">
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
                            ? "bg-indigo-600/30 border-indigo-400 text-white font-semibold"
                            : "bg-[#0f131c] border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                        }`}
                      >
                        <span className="block">{opt}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Manual Input Field for each question */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-400">Atau ketik kustom sendiri:</span>
                    </div>
                    <input
                      type="text"
                      placeholder={`Ketik spesifikasi kustom untuk ${q.label.toLowerCase()}...`}
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
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#0c0f17] p-2.5 text-xs font-mono text-indigo-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setWorkflowStep(1)}
                className="px-4 py-3 rounded-xl border border-white/10 text-xs font-mono text-zinc-300 hover:text-white"
              >
                ← Kembali ke Pengaturan Awal
              </button>

              <button
                type="button"
                onClick={handleGenerateFinalDirective}
                disabled={isGeneratingFinal}
                className="flex items-center gap-2 rounded-xl px-8 py-3.5 font-mono text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-black shadow-lg shadow-emerald-500/25 cursor-pointer transition-all disabled:opacity-50"
              >
                {isGeneratingFinal ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Merakit Master Directive & Multi-Boards...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-black" />
                    <span>Generate Master Directive Google Flow (Siap Pitching!) →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: MASTER DIRECTIVE RESULT & MULTI-BOARDS */}
      {workflowStep === 3 && masterResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Bar */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#0d1017] p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white font-mono">
                  {masterResult.projectTitle}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Total: {masterResult.totalDuration} • {masterResult.scenes.length} Scene Terkoordinasi • Siap Eksekusi ke Google Flow
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  copyText(JSON.stringify(masterResult, null, 2), "all-json")
                }
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161b26] px-3.5 py-2 text-xs font-mono text-zinc-300 hover:text-white"
              >
                {copiedKey === "all-json" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "all-json" ? "JSON Disalin!" : "Export JSON"}</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkflowStep(2)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161b26] px-3.5 py-2 text-xs font-mono text-zinc-300 hover:text-white"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Sesuaikan Klarifikasi</span>
              </button>
            </div>
          </div>

          {/* Board Navigation Tabs */}
          <div className="flex border-b border-white/10 gap-2">
            {[
              { id: "storyboard", label: `1. Storyboard & Audio (${masterResult.scenes.length} Scenes)`, icon: Film },
              { id: "character", label: `2. Character Board (@host)`, icon: Users },
              { id: "environment", label: `3. Environment & Object Board`, icon: Boxes },
              { id: "guide", label: `4. Panduan Eksekusi Flow`, icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBoardTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-4 font-mono text-xs font-bold border-b-2 transition-all ${
                    activeBoardTab === tab.id
                      ? "border-emerald-400 text-emerald-400 bg-emerald-500/5"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: STORYBOARD & AUDIO PER SCENE */}
          {activeBoardTab === "storyboard" && (
            <div className="space-y-4">
              {masterResult.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 sm:p-6 shadow-xl space-y-4 hover:border-emerald-500/30 transition-all"
                >
                  {/* Scene Title Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-black text-sm">
                        {scene.sceneNumber}
                      </span>
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                          {scene.stageName}
                        </h4>
                        <span className="text-[11px] font-mono text-zinc-400">
                          Timeline: {scene.timeRange} • {scene.keyVisualBeat}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Live TTS Button */}
                      <button
                        onClick={() => handlePlayVoice(scene.sceneNumber, scene.voiceoverScriptId)}
                        disabled={audioLoadingScene === scene.sceneNumber}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                          playingSceneAudio === scene.sceneNumber
                            ? "bg-emerald-500 text-black font-bold"
                            : "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50"
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
                            ? "Memuat Audio..."
                            : playingSceneAudio === scene.sceneNumber
                            ? "Memutar Suara..."
                            : "Dengarkan Suara"}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          copyText(
                            `${scene.cameraDirective}\n\n${scene.flowVisualPrompt}`,
                            `scene-${scene.sceneNumber}`
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161b26] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white"
                      >
                        {copiedKey === `scene-${scene.sceneNumber}` ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedKey === `scene-${scene.sceneNumber}` ? "Disalin!" : "Salin Prompt"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Naskah Suara (Indonesian) */}
                  <div className="rounded-xl border border-white/5 bg-[#121620] p-4">
                    <span className="block text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
                      Naskah Voiceover (Bahasa Indonesia)
                    </span>
                    <p className="text-sm font-sans text-zinc-100 leading-relaxed font-medium">
                      “{scene.voiceoverScriptId}”
                    </p>
                  </div>

                  {/* Camera Command & Visual Prompt Box */}
                  <div className="space-y-2">
                    <div className="rounded-lg border border-indigo-500/30 bg-black/70 p-3 font-mono text-xs text-indigo-300">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                        Camera Operator & Flow Slash Command:
                      </span>
                      {scene.cameraDirective}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-all">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                        Master Visual Prompt (Google Flow / Veo 2 Ready):
                      </span>
                      {scene.flowVisualPrompt}
                    </div>
                  </div>

                  {/* Soundscape & Foley */}
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                    <Volume2 className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Soundscape: {scene.audioSoundscapePrompt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CHARACTER BOARD */}
          {activeBoardTab === "character" && (
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span>Character Consistency Anchor ({masterResult.hostProfile.anchorTag})</span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Kunci konsistensi fisik agar wajah, ekspresi, warna kulit, dan busana presenter tidak berubah antar shot.
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyText(masterResult.hostProfile.masterCharacterPrompt, "host-prompt")
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-mono font-bold text-white hover:bg-indigo-500"
                >
                  {copiedKey === "host-prompt" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Salin Character Prompt</span>
                </button>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-zinc-400 block mb-2">
                  MASTER CHARACTER POSITIVE PROMPT:
                </span>
                <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-all">
                  {masterResult.hostProfile.masterCharacterPrompt}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-rose-400 block mb-2">
                  ANTI-HALLUCINATION NEGATIVE CONSTRAINTS:
                </span>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 font-mono text-xs text-rose-200 leading-relaxed select-all">
                  {masterResult.hostProfile.negativePrompt}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENVIRONMENT & OBJECT BOARD */}
          {activeBoardTab === "environment" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-emerald-400" />
                    <span>Environment Anchor ({masterResult.environmentProfile.anchorTag})</span>
                  </h4>
                  <button
                    onClick={() =>
                      copyText(masterResult.environmentProfile.masterSettingPrompt, "env-prompt")
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-[#161b26] border border-white/10 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white"
                  >
                    {copiedKey === "env-prompt" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Salin Setting</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-all">
                  {masterResult.environmentProfile.masterSettingPrompt}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Eye className="h-4 w-4 text-amber-400" />
                    <span>Hero Object / Landmark ({masterResult.objectProfile.anchorTag})</span>
                  </h4>
                  <button
                    onClick={() =>
                      copyText(masterResult.objectProfile.masterObjectPrompt, "obj-prompt")
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-[#161b26] border border-white/10 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white"
                  >
                    {copiedKey === "obj-prompt" ? <Check className="h-3.5 w-3.5 text-amber-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Salin Object</span>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-all">
                  {masterResult.objectProfile.masterObjectPrompt}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPERATOR GUIDE */}
          {activeBoardTab === "guide" && (
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 space-y-5">
              <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-400" />
                <span>Langkah Eksekusi Live Saat Pitching di Hadapan Reviewer</span>
              </h4>

              <div className="space-y-3">
                {masterResult.googleFlowOperatorGuide.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#161b26] p-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-mono text-zinc-200 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs font-mono text-indigo-200">
                ⭐ <strong className="text-white">Tips Rahasia Pitching:</strong> Tekankan bahwa sistem ini tidak hanya membuat naskah biasa, tapi menerjemahkannya langsung ke bahasa mesin Google Flow (Veo 2 syntax, multi-camera drone coordinates, dan semantic tag memory), sehingga tidak butuh prompt engineer manual tambahan di studio produksi.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

