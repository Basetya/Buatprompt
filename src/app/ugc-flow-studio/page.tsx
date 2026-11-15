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
  Download,
  FileText,
} from "lucide-react";
import { VideoAiEngine, LlmModelType } from "../api/ugc-flow-clarify/route";
import AssetVaultPickerModal, { VaultPickerCategory } from "@/components/AssetVaultPickerModal";
import { addOrUpdateCharacter, addOrUpdateProduct, addOrUpdateEnvironment } from "@/lib/assetVault";

interface ClarifyQuestion {
  id: string;
  label: string;
  question: string;
  tip?: string;
  options: string[];
  defaultChoice: string;
}

export interface SheetImageItem {
  id: string;
  url: string; // base64 data url
  label?: string;
}

export interface VideoPart {
  partNumber: number;
  partTitle: string;
  duration: string;
  sessionAdvice: string;
  sceneIndices: number[];
  chainPrompts: string[];
}

export interface UgcScene {
  sceneNumber: number;
  timeRange: string;
  stageName: string;
  rollType?: string;
  startingFrame?: string;
  endingFrame?: string;
  lightingAnchor?: string;
  voiceoverScriptId: string;
  cameraDirective: string;
  flowVisualPrompt: string;
  audioSoundscapePrompt: string;
  keyVisualBeat: string;
  capcutEditNote?: string;
  settingRefTag?: string;
  characterRefTag?: string;
  objectRefTag?: string;
}

export interface MasterDirectiveData {
  projectTitle: string;
  overview: string;
  totalDuration: string;
  engineTarget: VideoAiEngine;
  llmModel?: string;
  pacingMode?: "normal" | "fast";
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
  parts?: VideoPart[];
  characterImages?: SheetImageItem[];
  objectImages?: SheetImageItem[];
  environmentImages?: SheetImageItem[];
  engineDirectPrompt?: string;
  operatorGuide: string[];
  hostImage?: string | null;
  productImage?: string | null;
  settingImage?: string | null;
  geminiChainPrompts?: string[];
  capcutAssemblyGuide?: string[];
}

const VIDEO_TOOLS: Array<{
  id: VideoAiEngine;
  label: string;
  desc: string;
  badge?: string;
  quotaInfo: string;
}> = [
  {
    id: "google-flow",
    label: "Google Flow (Veo 3.1)",
    desc: "Multi-shot /camera & tag @",
    badge: "Juara Mutlak",
    quotaInfo: "50 kredit/hari (~1.500/bln) • Veo 3.1 Lite & Omni Flash 720p",
  },
  {
    id: "leonardo-ai",
    label: "Leonardo.Ai",
    desc: "150 fast token/hari (~4.500/bln)",
    badge: "Top Free Tier",
    quotaInfo: "150 fast token/hari • Cukup 4-6 klip motion video 4 detik",
  },
  {
    id: "dreamina-seedance",
    label: "Dreamina (Seedance 2.0/2.5)",
    desc: "120 kredit/hari • Seedance Dynamic",
    badge: "Top Free Tier",
    quotaInfo: "120 kredit/hari • 1 klip Seedance 2.0 (85 kr) atau 3-4 klip Fast/Mini",
  },
  {
    id: "kling-ai",
    label: "Kling AI",
    desc: "High-fidelity motion & physics",
    quotaInfo: "Daily claim kredit • Real physics & natural micro-expressions",
  },
  {
    id: "runway-gen3",
    label: "Runway Gen-3 Alpha",
    desc: "Cinematic movement & lens",
    quotaInfo: "Free trial token • Sinematik f-stop & camera movement",
  },
  {
    id: "luma-dream-machine",
    label: "Luma Dream Machine",
    desc: "Camera trajectory & smooth flow",
    quotaInfo: "Free 30 generations/bln • Trayektori kamera mulus",
  },
  {
    id: "hailuo-minimax",
    label: "Hailuo AI (MiniMax)",
    desc: "Ekspresi manusia hiper-nyata",
    quotaInfo: "Free kredit harian • Sangat kuat pada mimik wajah & kain bergerak",
  },
  {
    id: "wan-video",
    label: "Wan2.1 (Wan Video)",
    desc: "Open-source aesthetic cinematic",
    quotaInfo: "Open access model • Estetika sinematik tajam & presisi",
  },
  {
    id: "capcut-ai",
    label: "CapCut AI Video",
    desc: "Beat-sync & media b-roll",
    quotaInfo: "Free script-to-video • Potongan otomatis per beat lagu",
  },
];

const LLM_MODELS: Array<{ id: LlmModelType; label: string }> = [
  { id: "gemini", label: "Gemini" },
  { id: "claude", label: "Claude" },
  { id: "gpt", label: "ChatGPT" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "kimi", label: "Kimi" },
  { id: "grok", label: "Grok" },
];

function compressImage(file: File, maxDim = 800, quality = 0.75): Promise<string> {
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

export type TargetDurationOption =
  | "<=10s"
  | "<=40s"
  | "<=60s"
  | "<=120s"
  | ">120s"
  | "gemini-5clip"
  | "gemini-40s"
  | "longform-multiplier";

export default function UgcFlowStudioPage() {
  // Step 1: Core Inputs
  const [topic, setTopic] = useState("");
  const [targetDuration, setTargetDuration] = useState<TargetDurationOption>("gemini-40s");
  const [pacingMode, setPacingMode] = useState<"normal" | "fast">("normal");
  const [engineCategory, setEngineCategory] = useState<"video-ai" | "llm-native">("video-ai");
  const [videoTool, setVideoTool] = useState<VideoAiEngine>("google-flow");
  const [llmModel, setLlmModel] = useState<LlmModelType>("gemini");

  const [styleGenre, setStyleGenre] = useState<
    "hyper-real-ugc" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial" | "house-tour"
  >("hyper-real-ugc");
  const [hostType, setHostType] = useState<"male-casual" | "female-pro" | "custom" | "none-faceless" | "cartoon-3d-animation">("female-pro");
  const [customHostDescription, setCustomHostDescription] = useState("");
  const [cameraArchetype, setCameraArchetype] = useState<
    "auto" | "bird-eye-drone" | "low-angle-heroic" | "orbit-360" | "dutch-angle" | "pov-first-person"
  >("auto");

  // Multi-file sheets for Character, Object, and Environment (Unlimited Files)
  const [characterImages, setCharacterImages] = useState<SheetImageItem[]>([]);
  const [objectImages, setObjectImages] = useState<SheetImageItem[]>([]);
  const [environmentImages, setEnvironmentImages] = useState<SheetImageItem[]>([]);

  // User uploaded reference images for backward compatibility
  const [hostImage, setHostImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [settingImage, setSettingImage] = useState<string | null>(null);
  const [customSettingDescription, setCustomSettingDescription] = useState("");

  // Workflow State: 1 = Input, 2 = Clarification, 3 = Result
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(1);
  const [isLoadingClarify, setIsLoadingClarify] = useState(false);
  const [clarifyQuestions, setClarifyQuestions] = useState<ClarifyQuestion[]>([]);
  const [clarifyAnswers, setClarifyAnswers] = useState<Record<string, string>>({});

  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const [masterResult, setMasterResult] = useState<MasterDirectiveData | null>(null);
  const [activeBoardTab, setActiveBoardTab] = useState<
    "storyboard" | "gemini-chain" | "capcut-guide" | "direct-prompt" | "character" | "environment" | "guide"
  >("gemini-chain");
  const [activePartTab, setActivePartTab] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedEngineTarget, setSelectedEngineTarget] = useState<VideoAiEngine>("google-flow");

  // Global Asset Vault Modal State
  const [isVaultPickerOpen, setIsVaultPickerOpen] = useState(false);
  const [vaultPickerCategory, setVaultPickerCategory] = useState<VaultPickerCategory>("characters");

  const handleOpenVaultPicker = (cat: VaultPickerCategory) => {
    setVaultPickerCategory(cat);
    setIsVaultPickerOpen(true);
  };

  // Upload handler for Characters
  const handleUploadCharacters = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: SheetImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = await compressImage(file, 800, 0.75);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      newItems.push({
        id: `char-${Date.now()}-${i}`,
        url: b64,
        label: cleanName.length > 25 ? cleanName.slice(0, 25) : cleanName,
      });
    }
    setCharacterImages((prev) => [...prev, ...newItems]);
    setHostType("custom");
    if (!hostImage && newItems[0]) setHostImage(newItems[0].url);
    e.target.value = "";
  };

  // Upload handler for Objects
  const handleUploadObjects = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: SheetImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = await compressImage(file, 800, 0.75);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      newItems.push({
        id: `obj-${Date.now()}-${i}`,
        url: b64,
        label: cleanName.length > 25 ? cleanName.slice(0, 25) : cleanName,
      });
    }
    setObjectImages((prev) => [...prev, ...newItems]);
    if (!productImage && newItems[0]) setProductImage(newItems[0].url);
    e.target.value = "";
  };

  // Upload handler for Environments (e.g. 10 property photos)
  const handleUploadEnvironments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: SheetImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = await compressImage(file, 800, 0.75);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      newItems.push({
        id: `env-${Date.now()}-${i}`,
        url: b64,
        label: cleanName.length > 25 ? cleanName.slice(0, 25) : cleanName,
      });
    }
    setEnvironmentImages((prev) => [...prev, ...newItems]);
    if (!settingImage && newItems[0]) setSettingImage(newItems[0].url);
    e.target.value = "";
  };

  const handleSaveHostToVault = (imgUrl?: string, label?: string) => {
    const targetUrl = imgUrl || hostImage;
    if (!targetUrl) return;
    addOrUpdateCharacter({
      id: `char-custom-${Date.now()}`,
      name: label || (customHostDescription ? customHostDescription.slice(0, 30) : "Host Unggahan UGC"),
      tag: "@character_1",
      role: "UGC Creator",
      visualPrompt: customHostDescription || "UGC creator strictly matching the uploaded reference photo, natural realism.",
      wardrobe: "Casual modern outfit",
      gender: "female",
      imageBase64: targetUrl,
      isCustom: true,
    });
    alert("Foto Karakter berhasil disimpan ke Brankas Aset Bersama!");
  };

  const handleSaveProductToVault = (imgUrl?: string, label?: string) => {
    const targetUrl = imgUrl || productImage;
    if (!targetUrl) return;
    addOrUpdateProduct({
      id: `prod-custom-${Date.now()}`,
      name: label || (topic ? topic.slice(0, 30) : "Produk Unggahan UGC"),
      tag: "@object_1",
      category: "other",
      visualPrompt: `Pristine detail of product from uploaded reference photo, realistic lighting reflections.`,
      material: "Commercial item",
      physicalInteraction: "Held and demonstrated naturally on camera",
      imageBase64: targetUrl,
      isCustom: true,
    });
    alert("Foto Objek berhasil disimpan ke Brankas Aset Bersama!");
  };

  const handleSaveSettingToVault = (imgUrl?: string, label?: string) => {
    const targetUrl = imgUrl || settingImage;
    if (!targetUrl) return;
    addOrUpdateEnvironment({
      id: `env-custom-${Date.now()}`,
      name: label || (customSettingDescription ? customSettingDescription.slice(0, 30) : (topic ? `Latar: ${topic.slice(0, 25)}` : "Latar Ruangan")),
      tag: "@setting_1",
      visualPrompt: customSettingDescription || "Aesthetic interior matching the real uploaded photograph, exact architectural geometry, materials, and lighting continuity.",
      spatialMap: "Exact architectural room layout and geometry matching reference photo",
      lightingCondition: "Natural ambient lighting matching reference photo, soft realistic reflections",
      imageBase64: targetUrl,
      isCustom: true,
    });
    alert("Foto Ruangan berhasil disimpan ke Brankas Aset Bersama!");
  };

  // Active engine computation
  const activeEngineTarget: VideoAiEngine = engineCategory === "llm-native" ? "llm-native" : videoTool;

  // Auto-switch engine when <=10s is selected
  const handleDurationChange = (dur: TargetDurationOption) => {
    setTargetDuration(dur);
    if (dur === "<=10s" && engineCategory !== "video-ai") {
      setEngineCategory("llm-native");
      setLlmModel("gemini");
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
          hostType: characterImages.length > 0 ? "custom" : hostType,
          customHostDescription,
          cameraArchetype,
          pacingMode,
          characterCount: characterImages.length,
          environmentCount: environmentImages.length,
          objectCount: objectImages.length,
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
          hostType: characterImages.length > 0 ? "custom-upload" : hostType,
          customHostDescription,
          cameraArchetype,
          pacingMode,
          clarificationAnswers: clarifyAnswers,
          hostImage: characterImages[0]?.url || hostImage,
          productImage: objectImages[0]?.url || productImage,
          settingImage: environmentImages[0]?.url || settingImage,
          characterImages,
          objectImages,
          environmentImages,
        }),
      });

      const data = await res.json();
      if (data.data) {
        data.data.characterImages = characterImages;
        data.data.objectImages = objectImages;
        data.data.environmentImages = environmentImages;
        data.data.hostImage = characterImages[0]?.url || hostImage;
        data.data.productImage = objectImages[0]?.url || productImage;
        data.data.settingImage = environmentImages[0]?.url || settingImage;
        data.data.pacingMode = pacingMode;
        setMasterResult(data.data);
        const resolvedEngine = data.data.engineTarget || activeEngineTarget || "google-flow";
        setSelectedEngineTarget(resolvedEngine);
        setWorkflowStep(3);

        // Intelligently select tab based on chosen engine
        if (engineCategory === "video-ai" || resolvedEngine !== "llm-native") {
          setActiveBoardTab("direct-prompt");
        } else {
          setActiveBoardTab("gemini-chain");
        }
        setActivePartTab(0);
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

  // Helper download file text (.txt)
  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate 100% Pure, Clean AI Master Prompt (Zero Human Meta-Instructions)
  const generateCleanAiMasterPrompt = (result: MasterDirectiveData) => {
    const hasHostImg = Boolean(result.hostImage);
    const hasProdImg = Boolean(result.productImage);

    let visualContinuitySection = "";
    if (hasHostImg || hasProdImg) {
      visualContinuitySection = `[MULTIMODAL ATTACHMENT CONTINUITY]:
- The attached reference image(s) define the visual ground truth for this project.
${hasHostImg ? "- @host_anchor: Maintain 100% strict visual consistency matching the attached Host image (facial structure, skin tone, eye shape, hairstyle, and outfit across all scenes)." : ""}
${hasProdImg ? "- @hero_object: Maintain 100% strict visual consistency matching the attached Product image (packaging shape, branding colors, labels, and physical material across all scenes)." : ""}\n\n`;
    }

    const header = `=== MASTER PROMPT: ${result.projectTitle.toUpperCase()} ===
Target Durasi: ${result.totalDuration} (${result.scenes.length} Adegan)
Engine Format: ${result.engineTarget.toUpperCase()}${result.llmModel ? ` (Model: ${result.llmModel.toUpperCase()})` : ""}

${visualContinuitySection}[VISUAL PROFILES & ANCHORS]:
- Karakter (@host_anchor): ${result.hostProfile.masterCharacterPrompt}
- Setting (@setting_anchor): ${result.environmentProfile.masterSettingPrompt}
- Objek Utama (@hero_object): ${result.objectProfile.masterObjectPrompt}

[HUKUM KAUSALITAS AUDIO-VISUAL (ZERO PHANTOM SFX)]:
1. Action-Coupled SFX: Seluruh efek suara foley (seperti kriuk makanan, patahan, tegukan, sentuhan) WAJIB disertai aksi fisik visual nyata di layar pada detik terjadinya suara.
2. Timeline Chronology: Aksi fisik dan dialog terbagi secara kronologis; ada jeda napas [pause] saat aksi fisik terjadi.

==================================================
DAFTAR ADEGAN & NASKAH LENGKAP:
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

  // Re-compose Prompt for any chosen Engine on the fly
  const formatEnginePrompt = (result: MasterDirectiveData, targetEngine: VideoAiEngine): string => {
    const hasHostImg = Boolean(result.hostImage);
    const hasProdImg = Boolean(result.productImage);

    let visualContinuitySection = "";
    if (hasHostImg || hasProdImg) {
      visualContinuitySection = `[MULTIMODAL ATTACHMENT REFERENCE]:
- The attached reference image(s) define the visual ground truth for this project.
${hasHostImg ? "- @host_anchor: Maintain 100% strict visual consistency matching the attached Host image (facial structure, skin tone, eye shape, hairstyle, and outfit across all scenes)." : ""}
${hasProdImg ? "- @hero_object: Maintain 100% strict visual consistency matching the attached Product image (packaging shape, branding colors, labels, and physical material across all scenes)." : ""}\n\n`;
    }

    if (targetEngine === "google-flow") {
      const envTagsList =
        result.environmentImages && result.environmentImages.length > 0
          ? result.environmentImages
              .map((env, i) => `  * @setting_${i + 1}: ${env.label || `Latar / Ruangan ${i + 1}`}`)
              .join("\n")
          : `  * @setting_1: ${result.environmentProfile.name || "Setting Properti / Ruangan"}`;

      const scenesText = result.scenes
        .map(
          (s) =>
            `--- SHOT ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ---
[CAMERA & SLASH COMMAND]:
${s.cameraDirective.startsWith("/") ? s.cameraDirective : `/camera ${s.cameraDirective}`} /lighting natural warm morning daylight /motion medium

[MASTER VISUAL PROMPT (GOOGLE FLOW)]:
${s.flowVisualPrompt}

[SPOKEN DIALOGUE]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX (ACTION-COUPLED)]:
${s.audioSoundscapePrompt}`
        )
        .join("\n\n--------------------------------------------------\n\n");

      return `=== MASTER PROMPT: ${result.projectTitle.toUpperCase()} ===
Engine Target: GOOGLE FLOW (VEO 3.1 / GEMINI OMNI FLASH)
Durasi: ${result.totalDuration} (${result.scenes.length} Shots)

[MULTIMODAL ASSET CONSISTENCY TAGS]:
- Character Tag (@host): ${result.hostProfile.anchorTag} -> ${result.hostProfile.masterCharacterPrompt}
- Environment Tags (@setting):
${envTagsList}
- Object Tag (@object): ${result.objectProfile.anchorTag} -> ${result.objectProfile.masterObjectPrompt}

[PANDUAN EKSEKUSI DI GOOGLE FLOW]:
1. Buka Google Flow (https://flow.google) dan buat timeline project baru.
2. Lampirkan foto referensi di Asset Manager (@character_1 untuk Host, @setting_1 s/d @setting_n untuk Ruangan/Properti).
3. Salin prompt Shot 1 s/d ${result.scenes.length} ke masing-masing node atau shot box.
4. Render langsung tanpa batas jeda kuota 5 jam.

==================================================
URUTAN SHOT & NASKAH LENGKAP:
==================================================

${scenesText}`;
    }

    if (targetEngine === "leonardo-ai") {
      const scenesText = result.scenes
        .map(
          (s) =>
            `--- GENERATION CLIP ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ---
[SPOKEN DIALOGUE / VOICEOVER]:
"${s.voiceoverScriptId}"

[LEONARDO MOTION SETTINGS]:
- Motion Strength: 4 (Natural dynamic movement)
- Camera Motion: Smooth pan & subtle push-in
- Aspect Ratio: 9:16 (Vertical UGC)

[LEONARDO VISUAL PROMPT]:
${s.flowVisualPrompt.replace(/@host_anchor/g, "the featured on-camera presenter").replace(/@hero_object/g, "the featured product").replace(/@setting_anchor/g, "the ambient setting")}

[AUDIO SOUNDSCAPE]:
${s.audioSoundscapePrompt}`
        )
        .join("\n\n");

      return `=== MASTER PROMPT: ${result.projectTitle.toUpperCase()} ===
Engine Target: LEONARDO.AI (MOTION GENERATION)
Durasi: ${result.totalDuration} (${result.scenes.length} Clips)
Free Tier: 150 fast tokens/hari (~4.500 token/bln)

${visualContinuitySection}[FOCAL SUBJECT & CONSISTENCY REFERENCE]:
Presenter: ${result.hostProfile.masterCharacterPrompt}
Environment: ${result.environmentProfile.masterSettingPrompt}
Hero Item: ${result.objectProfile.masterObjectPrompt}

[LEONARDO BEST PRACTICE]:
- Gunakan Image2Motion atau Motion Tool pada Leonardo.Ai
- Masukkan prompt visual per klip di bawah ini ke prompt box Leonardo.

==================================================
URUTAN KLIP LEONARDO.AI:
==================================================

${scenesText}`;
    }

    if (targetEngine === "dreamina-seedance") {
      const scenesText = result.scenes
        .map(
          (s) =>
            `--- SEEDANCE SHOT ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ---
[SPOKEN DIALOGUE]:
"${s.voiceoverScriptId}"

[SEEDANCE 2.0 / 2.5 DIRECTIVE]:
Action Dynamics: Continuous fluid motion, natural facial micro-expressions
Camera: ${s.cameraDirective.replace(/^\/camera\s*/i, "")}

[DREAMINA VISUAL PROMPT]:
${s.flowVisualPrompt.replace(/@host_anchor/g, "the presenter").replace(/@hero_object/g, "the product item").replace(/@setting_anchor/g, "the aesthetic background")}

[SOUNDSCAPE]:
${s.audioSoundscapePrompt}`
        )
        .join("\n\n");

      return `=== MASTER PROMPT: ${result.projectTitle.toUpperCase()} ===
Engine Target: DREAMINA (SEEDANCE 2.0 / 2.5)
Durasi: ${result.totalDuration} (${result.scenes.length} Shots)
Free Tier: 120 kredit/hari

${visualContinuitySection}[CORE SUBJECT DEFINITION]:
- Subject: ${result.hostProfile.masterCharacterPrompt}
- Environment: ${result.environmentProfile.masterSettingPrompt}
- Focus Item: ${result.objectProfile.masterObjectPrompt}

[DREAMINA SEEDANCE BEST PRACTICE]:
- Masukkan prompt di mode Seedance 2.0 Standard / Fast di Dreamina.
- Lampirkan foto referensi jika menggunakan mode Image-to-Video Seedance.

==================================================
DAFTAR KLIP DREAMINA SEEDANCE:
==================================================

${scenesText}`;
    }

    if (targetEngine === "kling-ai") {
      const scenesText = result.scenes
        .map(
          (s) =>
            `--- KLING SCENE ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ---
[DIALOGUE]: "${s.voiceoverScriptId}"
[KLING PARAMETERS]: Mode: Professional | Camera Movement: ${s.cameraDirective.replace(/^\/camera\s*/i, "")} | Motion Brush: Focus on hand interaction
[KLING PROMPT]:
${s.flowVisualPrompt.replace(/@host_anchor/g, "the presenter").replace(/@hero_object/g, "the product item")}
[SOUND EFFECT]: ${s.audioSoundscapePrompt}`
        )
        .join("\n\n");

      return `=== MASTER PROMPT: ${result.projectTitle.toUpperCase()} ===
Engine Target: KLING AI (v1.5 / v2 PRO)
Durasi: ${result.totalDuration} (${result.scenes.length} Scenes)

${visualContinuitySection}==================================================
URUTAN KLIP KLING AI:
==================================================

${scenesText}`;
    }

    if (targetEngine === "runway-gen3") {
      const scenesText = result.scenes
        .map(
          (s) =>
            `--- RUNWAY GEN-3 SHOT ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ---
[DIALOGUE]: "${s.voiceoverScriptId}"
[RUNWAY CAMERA]: ${s.cameraDirective.replace(/^\/camera\s*/i, "")}
[PROMPT]:
Cinematic UGC footage. ${s.flowVisualPrompt.replace(/@host_anchor/g, "the presenter").replace(/@hero_object/g, "the product item")}. 4k photorealistic, natural motion mechanics.
[SFX]: ${s.audioSoundscapePrompt}`
        )
        .join("\n\n");

      return `=== MASTER PROMPT: ${result.projectTitle.toUpperCase()} ===
Engine Target: RUNWAY GEN-3 ALPHA
Durasi: ${result.totalDuration} (${result.scenes.length} Shots)

${visualContinuitySection}==================================================
URUTAN SHOT RUNWAY GEN-3:
==================================================

${scenesText}`;
    }

    // Default to Universal Clean AI Prompt (Gemini / Claude / LLM)
    return generateCleanAiMasterPrompt(result);
  };

  // Format single clip prompt for Gemini 1-by-1 copy
  const formatGeminiSingleClipPrompt = (
    result: MasterDirectiveData,
    s: UgcScene,
    idx: number
  ) => {
    const envImages = result.environmentImages || [];
    const charImages = result.characterImages || [];
    const objImages = result.objectImages || [];
    const pacing = result.pacingMode || pacingMode;
    const pacingLabel =
      pacing === "fast"
        ? "24–28 kata (Tempo Cepat / Padat TikTok)"
        : "14–18 kata (Tempo Normal / Artikulatif)";

    const settingIndex = envImages.length > 0 ? (idx % envImages.length) + 1 : 1;
    const settingLabel =
      envImages.length > 0
        ? envImages[settingIndex - 1]?.label || `Area ${settingIndex}`
        : "Ruangan / Latar Nyata";

    const charIndex = charImages.length > 0 ? (idx % charImages.length) + 1 : 1;
    const charLabel =
      charImages.length > 0
        ? charImages[charIndex - 1]?.label || `Host ${charIndex}`
        : "Host Kreator";

    const objIndex = objImages.length > 0 ? (idx % objImages.length) + 1 : 1;
    const objLabel =
      objImages.length > 0
        ? objImages[objIndex - 1]?.label || `Produk ${objIndex}`
        : "Produk";

    if (idx === 0) {
      return `=== KLIP 1: ${s.stageName.toUpperCase()} (${s.timeRange}) ===
Format: Video 10 Detik (Gemini 40s Session Pass)
Proyek: ${result.projectTitle}
Pacing Naskah: ${pacingLabel}

[INSTRUKSI MEMORI & KONSISTENSI GEMINI]:
- Gunakan foto referensi yang saya lampirkan di chat ini:
  * Karakter Host: Gunakan [FOTO HOST ${charIndex}: @character_${charIndex} (${charLabel})]. Kunci wajah, ekspresi, dan pakaian 100% konsisten.
  * Setting Ruangan: Gunakan [FOTO RUANGAN ${settingIndex}: @setting_${settingIndex} (${settingLabel})]. Kunci arsitektur, kayu jati, dan tata ruang persis tanpa halusinasi!
  ${objImages.length > 0 ? `* Objek / Produk: Gunakan [FOTO PRODUK ${objIndex}: @object_${objIndex} (${objLabel})]. Kunci bentuk dan warna.` : ""}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight, 45-degree key light"} di seluruh adegan.
- Aksi Fisik Nyata: Efek suara foley wajib terlihat aksi fisiknya di layar (zero phantom sound).
- Batas Durasi: 10 Detik pas agar selesai dalam 1 sesi 40 detik.

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP 1]:
${s.flowVisualPrompt}

[NASKAH DIALOG (${pacingLabel})]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX]:
${s.audioSoundscapePrompt}

[ENDING POSE TITIK SAMBUNG]:
${s.endingFrame || "@character_1 menyelesaikan pengantar dengan gestur mengarahkan kamera ke adegan berikutnya."}`;
    }

    return `=== KLIP ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ===
Format: Video 10 Detik (Sambungan Langsung di Sesi Gemini yang Sama)
Pacing Naskah: ${pacingLabel}

[INSTRUKSI SAMBUNGAN GEMINI (FRAME BOUNDARY HAND-OFF)]:
- Lanjutkan video sebelumnya di dalam satu utas percakapan ini.
- JANGAN UBAH WAJAH, RAMBUT, ATAU BAJU KARAKTER.
- Setting Ruangan: Gunakan [FOTO RUANGAN ${settingIndex}: @setting_${settingIndex} (${settingLabel})]. Kunci arsitektur foto ini persis tanpa halusinasi.
- Starting Frame: ${s.startingFrame || `Melanjutkan persis dari frame terakhir Klip ${idx} tanpa jeda.`}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight"} identik dengan klip sebelumnya.

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP ${s.sceneNumber}]:
${s.flowVisualPrompt}

[NASKAH DIALOG (${pacingLabel})]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX (ZERO PHANTOM)]:
${s.audioSoundscapePrompt}

[ENDING POSE TITIK SAMBUNG]:
${s.endingFrame || "@character_1 menyelesaikan aksi dengan ekspresi puas dan bersiap untuk adegan selanjutnya."}`;
  };

  // Format single shot for dedicated AI Video tool (Google Flow, Kling, Runway, Leonardo, etc.)
  const formatSingleShotForTool = (
    result: MasterDirectiveData,
    s: UgcScene,
    tool: VideoAiEngine
  ): string => {
    if (tool === "google-flow") {
      const cam = s.cameraDirective.startsWith("/")
        ? s.cameraDirective
        : `/camera ${s.cameraDirective}`;
      return `${cam} /lighting natural warm morning interior daylight /motion medium
${s.flowVisualPrompt}

[SPOKEN DIALOGUE]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX (ACTION-COUPLED)]:
${s.audioSoundscapePrompt}`;
    }
    if (tool === "kling-ai") {
      const cleanVisual = s.flowVisualPrompt
        .replace(/@character_\d+/g, "featured host")
        .replace(/@setting_\d+/g, "luxurious architectural space")
        .replace(/@object_\d+/g, "featured object");
      return `${cleanVisual}

[KLING CAMERA]: ${s.cameraDirective.replace(/^\/camera\s*/i, "")}
[DIALOGUE]: "${s.voiceoverScriptId}"
[SOUND EFFECT]: ${s.audioSoundscapePrompt}`;
    }
    if (tool === "runway-gen3") {
      const cleanVisual = s.flowVisualPrompt
        .replace(/@character_\d+/g, "presenter")
        .replace(/@setting_\d+/g, "interior setting");
      return `Cinematic shot. ${s.cameraDirective}. ${cleanVisual}
Dialogue: "${s.voiceoverScriptId}"`;
    }
    // Universal format for Leonardo, Dreamina, Hailuo, Wan, CapCut
    const cam = s.cameraDirective.startsWith("/")
      ? s.cameraDirective
      : `/camera ${s.cameraDirective}`;
    return `[SHOT ${s.sceneNumber}: ${s.stageName.toUpperCase()}]
${cam}
${s.flowVisualPrompt}
[DIALOGUE]: "${s.voiceoverScriptId}"
[AUDIO]: ${s.audioSoundscapePrompt}`;
  };

  // Generate complete Gemini chain text file
  const generateFullGeminiChainText = (result: MasterDirectiveData) => {
    const hasParts = Boolean(result.parts && result.parts.length > 1);

    let partsContent = "";
    if (hasParts && result.parts) {
      partsContent = result.parts
        .map((p) => {
          const partScenes = p.sceneIndices.map((i) => result.scenes[i]).filter(Boolean);
          const prompts = partScenes.map((s, idx) =>
            formatGeminiSingleClipPrompt(result, s, p.sceneIndices[idx])
          );
          return `==================================================\n${p.partTitle.toUpperCase()} (${p.duration})\nPetunjuk Sesi: ${p.sessionAdvice}\n==================================================\n\n` +
            prompts.join("\n\n--------------------------------------------------\n\n");
        })
        .join("\n\n\n");
    } else {
      partsContent = result.scenes
        .map((s, idx) => formatGeminiSingleClipPrompt(result, s, idx))
        .join("\n\n--------------------------------------------------\n\n");
    }

    return `=== RANTAI PRODUKSI MULTI-KLIP GEMINI (FRAME BOUNDARY HAND-OFF) ===
Proyek: ${result.projectTitle}
Total Durasi: ${result.totalDuration} (${result.scenes.length} Klip @ 10 Detik)
Pacing: ${result.pacingMode === "fast" ? "Cepat (24–28 kata/klip)" : "Normal (14–18 kata/klip)"}

PETUNJUK EKSEKUSI DI GEMINI (BEBAS LIMIT 5 JAM):
1. Maksimal per topik/sesi adalah 40 Detik (4 klip @ 10s) sehingga 100% tuntas dalam 1 sesi Gemini tanpa menunggu 5 jam atau terpotong.
2. Buka satu utas percakapan chat di Gemini (https://gemini.google.com).
3. Lampirkan foto-foto referensi Anda di pesan pertama.
4. Kirim Prompt Klip 1.
5. Setelah Klip 1 selesai di-generate, JANGAN BUKA CHAT BARU. Cukup balas di chat yang sama dengan Prompt Klip 2, dst.
6. Jika ada Part 2, buka sesi baru setelah kuota siap untuk melanjutkan Part 2.

==================================================
DAFTAR PROMPT BERURUTAN:
==================================================

${partsContent}`;
  };

  // Generate CapCut Assembly Guide text file
  const generateFullCapcutGuideText = (result: MasterDirectiveData) => {
    const guideItems = result.capcutAssemblyGuide && result.capcutAssemblyGuide.length > 0
      ? result.capcutAssemblyGuide
      : [
          "LANGKAH 1: Impor seluruh klip video (Klip 1 s/d Klip " + result.scenes.length + ") ke timeline CapCut.",
          "LANGKAH 2: Susun di track utama secara berurutan. Gunakan hard cut langsung antar adegan.",
          "LANGKAH 3: Trim 0.2 - 0.4 detik di awal/akhir klip agar ritme video dinamis dan tanpa jeda kosong.",
          "LANGKAH 4: Berikan Speed 0.8x Smooth Optical Flow pada klip B-Roll detail produk untuk kesan mewah.",
          "LANGKAH 5: Sinkronkan sound effect foley persis pada milidetik aksi terjadi, lalu aktifkan Auto Captions.",
        ];

    const sceneNotes = result.scenes
      .map(
        (s) =>
          `[Klip ${s.sceneNumber} (${s.timeRange}) - ${s.stageName}]
- Tipe: ${s.rollType || "A-Roll"}
- Naskah: "${s.voiceoverScriptId}"
- Rekomendasi Edit CapCut: ${s.capcutEditNote || "Potong halus di awal/akhir untuk kontinuitas"}`
      )
      .join("\n\n");

    return `=== PANDUAN EDITING CAPCUT (SEAMLESS ASSEMBLY) ===
Proyek: ${result.projectTitle}
Total Klip: ${result.scenes.length} Klip (${result.totalDuration})

--------------------------------------------------
INSTRUKSI LANGKAH DEMI LANGKAH:
--------------------------------------------------
${guideItems.join("\n\n")}

--------------------------------------------------
CATATAN PEMOTONGAN PER ADEGAN:
--------------------------------------------------
${sceneNotes}
`;
  };

  // Generate Human Execution Guide (Separated from the pure AI prompt)
  const generateHumanExecutionGuide = (result: MasterDirectiveData) => {
    const hasHostImg = Boolean(result.hostImage);
    const hasProdImg = Boolean(result.productImage);

    return `=== PANDUAN EKSEKUSI PRODUKSI KONTEN ===
Proyek: ${result.projectTitle}
Target Durasi: ${result.totalDuration} (${result.scenes.length} Adegan)
Format Tool: ${result.engineTarget.toUpperCase()}${result.llmModel ? ` (${result.llmModel.toUpperCase()})` : ""}

--------------------------------------------------
LANGKAH 1: PERSIAPAN FILE & FOTO
--------------------------------------------------
${hasHostImg ? "✓ Gunakan Foto Host / Kreator yang telah Anda unggah (@host_anchor)\n" : ""}${hasProdImg ? "✓ Gunakan Foto Produk / Makanan yang telah Anda unggah (@hero_object)\n" : ""}
--------------------------------------------------
LANGKAH 2: EKSEKUSI DI AI (GEMINI / VIDEO ENGINE)
--------------------------------------------------
1. Buka aplikasi AI pilihan Anda:
   - Jika Gemini: Kunjungi https://gemini.google.com
   - Jika Google Flow / Runway / Kling / CapCut: Buka studio video masing-masing.
2. Lampirkan (Upload) file foto Host & Produk Anda ke chatbox Gemini.
3. Buka file atau salin teks dari 'PROMPT BERSIH' (master-prompt-ugc.txt).
4. Tempelkan (Paste) prompt bersih tersebut ke dalam chatbox dan kirim.
5. Gemini & AI Video akan membaca seluruh sekuens adegan secara konsisten mengikuti wajah dan produk asli Anda tanpa tertukar!

--------------------------------------------------
PANDUAN OPERATOR PER TAHAP:
--------------------------------------------------
${result.operatorGuide.map((g, idx) => `${idx + 1}. ${g}`).join("\n")}
`;
  };

  const generateFullScriptOnly = (result: MasterDirectiveData) => {
    return result.scenes
      .map(
        (s: UgcScene) =>
          `[Adegan ${s.sceneNumber} (${s.timeRange}) - ${s.stageName}]\n"${s.voiceoverScriptId}"`
      )
      .join("\n\n");
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
                  <span>Pilihan Format & Durasi Video</span>
                  <span className="text-[11px] text-[#8c857c] normal-case font-sans">
                    {targetDuration === "gemini-40s"
                      ? "Gemini 40s Session Pass (Maksimal 40 Detik • 4 Klip @ 10s • Tuntas 1 Sesi Tanpa Limit 5 Jam)"
                      : targetDuration === "longform-multiplier"
                      ? "Multi-Part Long-Form (8 Klip • Otomatis Dipecah Jadi 2 Sesi Terhubung Part 1 & Part 2 @ 40s)"
                      : targetDuration === "gemini-5clip"
                      ? "Gemini 5-Clip Legacy (5 Klip x 5s • Frame Boundary Hand-Off)"
                      : targetDuration === "<=10s"
                      ? "Klip singkat 10 detik (Hero Shot Langsung Jadi)"
                      : targetDuration === "<=60s"
                      ? "Short-form standar (6 Adegan)"
                      : targetDuration === "<=120s"
                      ? "Deep-story (8 Adegan)"
                      : "Epic Storyboard (12 Adegan)"}
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(
                    [
                      {
                        id: "gemini-40s" as const,
                        label: "Gemini 40s Session Pass (4 Klip)",
                        badge: "Juara Mutlak / Rekomendasi",
                        desc: "Maks 40 detik per topik (4 klip @ 10s) • Pas jatah 1 sesi Gemini tuntas tanpa nunggu 5 jam",
                      },
                      {
                        id: "longform-multiplier" as const,
                        label: "Multi-Part / Long-Form (8 Klip)",
                        badge: "Auto 2-Part Split",
                        desc: "Otomatis dipecah jadi 2 sesi terhubung (Part 1 & Part 2) @ 40s • YouTube & Series Ready",
                      },
                      {
                        id: "<=10s" as const,
                        label: "≤ 10 Detik (Hero Shot)",
                        desc: "Klip Singkat Instan • Aksi fisik & suara sinkron sekali generate",
                      },
                      {
                        id: "gemini-5clip" as const,
                        label: "Gemini 5-Clip Legacy (~25s)",
                        desc: "5 Klip x 5s • Sambungan mulus Frame Boundary Hand-Off",
                      },
                      {
                        id: "<=60s" as const,
                        label: "≤ 60 Detik (Shorts/Reels)",
                        desc: "Short-form standar 6 Adegan terstruktur",
                      },
                      {
                        id: "<=120s" as const,
                        label: "≤ 120 Detik (UGC Komplit)",
                        desc: "Deep review 8 Adegan eksplorasi",
                      },
                    ]
                  ).map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => handleDurationChange(dur.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        targetDuration === dur.id
                          ? "border-[#c29b74] bg-[#c29b74]/15 text-[#f5f1eb] shadow-sm"
                          : "border-[#2d2a27] bg-[#1a1b1f] text-[#8c857c] hover:border-[#423e3a] hover:text-[#c4bcb2]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="block text-xs font-mono font-bold">{dur.label}</span>
                        {"badge" in dur && (
                          <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-[#c29b74] text-[#121315] uppercase">
                            {dur.badge}
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-[#736d65] mt-1 leading-snug">{dur.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pacing Speed & Tempo Selector (Normal vs Fast) */}
              <div className="rounded-xl border border-[#2d2a27] bg-[#1a1b1f] p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-mono font-semibold text-[#f5f1eb] flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 text-[#c29b74]" />
                      <span>Tempo Naskah & Pacing Bicara (WPM)</span>
                    </h4>
                    <p className="text-[11px] text-[#8c857c] mt-0.5">
                      Pilih kecepatan berbicara presenter untuk menyesuaikan kepadatan materi video Anda.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#c29b74] bg-[#c29b74]/10 border border-[#c29b74]/20 px-2.5 py-1 rounded-full w-fit">
                    {pacingMode === "fast" ? "⚡ Tempo Cepat (24–28 kata/adegan)" : "🎙️ Tempo Normal (14–18 kata/adegan)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPacingMode("normal")}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      pacingMode === "normal"
                        ? "border-[#c29b74] bg-[#c29b74]/15 text-[#f5f1eb] shadow"
                        : "border-[#262422] bg-[#151619] text-[#8c857c] hover:border-[#3a3632]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#f5f1eb]">
                        Sedang / Normal (14–18 Kata / Klip)
                      </span>
                      {pacingMode === "normal" && <Check className="h-4 w-4 text-[#c29b74]" />}
                    </div>
                    <p className="text-[11px] font-sans text-[#a8a197] mt-1.5 leading-relaxed">
                      Tempo natural ~130 WPM, artikulatif dengan jeda napas santai [pause]. Cocok untuk house tour, review santai, dan edukasi elegan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPacingMode("fast")}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      pacingMode === "fast"
                        ? "border-[#c29b74] bg-[#c29b74]/15 text-[#f5f1eb] shadow"
                        : "border-[#262422] bg-[#151619] text-[#8c857c] hover:border-[#3a3632]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#f5f1eb]">
                        Cepat / Padat (24–28 Kata / Klip)
                      </span>
                      {pacingMode === "fast" && <Check className="h-4 w-4 text-[#c29b74]" />}
                    </div>
                    <p className="text-[11px] font-sans text-[#a8a197] mt-1.5 leading-relaxed">
                      Tempo TikTok kinetic ~180 WPM, padat informasi, hook intensif tanpa jeda kosong. Maksimal 28 kata per 10 detik agar pas ritme visual.
                    </p>
                  </button>
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
                    <option value="house-tour">House Tour & Arsitektur (Walkthrough Virtual Multi-Ruangan)</option>
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
                    {characterImages.length > 0 && (
                      <option value="custom">👤 Foto Host Terlampir ({characterImages.length} Karakter)</option>
                    )}
                    <option value="female-pro">Sarah — Modern Professional (Hangat & Artikulatif)</option>
                    <option value="male-casual">Bimo — Smart Casual (Ramah & Terbuka)</option>
                    <option value="none-faceless">Faceless / POV (Fokus Produk & Tangan)</option>
                    <option value="cartoon-3d-animation">Stylized 3D Animated Host (Karakter Kartun)</option>
                    <option value="custom">Kustomisasi Sendiri (Tulis deskripsi)</option>
                  </select>
                </div>
              </div>

              {/* Multi-File Sheets: Character Sheet, Object Sheet, & Environment Sheet */}
              <div className="rounded-2xl border border-[#2d2a27] bg-[#141518] p-4 sm:p-5 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262422] pb-3">
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-[#f5f1eb] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#c29b74]" />
                      Multi-File Consistency Sheets (Bebas Upload Banyak Foto)
                    </h3>
                    <p className="text-[11px] text-[#8c857c] font-sans mt-0.5">
                      Upload foto host, produk, atau banyak foto ruangan properti sekaligus. Sistem akan mendistribusikannya secara cerdas ke setiap adegan.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#c29b74]">
                    <span>Host: {characterImages.length}</span> • <span>Objek: {objectImages.length}</span> • <span>Ruangan: {environmentImages.length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 1. Character Sheet Gallery */}
                  <div className="rounded-xl border border-[#262422] bg-[#1a1b1f] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242220] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#c29b74]" />
                        <span className="text-xs font-mono font-semibold text-[#f5f1eb]">
                          Character Sheet ({characterImages.length} Foto)
                        </span>
                        <span className="text-[10px] font-mono text-[#8c857c] hidden sm:inline">
                          — Multi-Host / Podcast / Tamu
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenVaultPicker("characters")}
                          className="text-[11px] font-mono text-[#c29b74] hover:underline flex items-center gap-1 bg-[#c29b74]/10 px-2.5 py-1 rounded border border-[#c29b74]/20"
                        >
                          <Boxes className="h-3 w-3" /> Ambil dari Vault
                        </button>
                        <label className="text-[11px] font-mono font-semibold text-[#121315] bg-[#c29b74] hover:bg-[#d1aa82] px-2.5 py-1 rounded cursor-pointer flex items-center gap-1">
                          <Upload className="h-3 w-3" /> Tambah Foto Host
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadCharacters}
                          />
                        </label>
                      </div>
                    </div>

                    {characterImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {characterImages.map((char, cIdx) => (
                          <div
                            key={char.id}
                            className="relative group rounded-xl border border-[#2d2a27] bg-[#121315] p-2 space-y-1.5"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-[#383531]">
                              <img
                                src={char.url}
                                alt={char.label || `Host ${cIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCharacterImages((prev) => prev.filter((item) => item.id !== char.id));
                                }}
                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[#1e1313]/90 text-[#e06c75] hover:bg-[#e06c75] hover:text-white flex items-center justify-center text-xs transition-colors"
                                title="Hapus foto"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <span className="absolute bottom-1 left-1 bg-[#121315]/80 text-[#c29b74] px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                                @character_{cIdx + 1}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={char.label || ""}
                              placeholder={`Nama/Label @character_${cIdx + 1}`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCharacterImages((prev) =>
                                  prev.map((item) => (item.id === char.id ? { ...item, label: val } : item))
                                );
                              }}
                              className="w-full bg-[#18191d] border border-[#2b2724] rounded px-2 py-1 text-[11px] font-mono text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveHostToVault(char.url, char.label)}
                              className="w-full text-center text-[10px] font-mono text-[#8c857c] hover:text-[#d4af88] py-0.5 block"
                            >
                              💾 Simpan ke Vault
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border border-dashed border-[#2b2724] rounded-xl bg-[#121315]">
                        <p className="text-[11px] font-mono text-[#7d776f]">
                          Belum ada foto karakter diunggah. Klik "Tambah Foto Host" untuk upload foto wajah host.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Object Sheet Gallery */}
                  <div className="rounded-xl border border-[#262422] bg-[#1a1b1f] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242220] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-[#c29b74]" />
                        <span className="text-xs font-mono font-semibold text-[#f5f1eb]">
                          Object / Product Sheet ({objectImages.length} Foto)
                        </span>
                        <span className="text-[10px] font-mono text-[#8c857c] hidden sm:inline">
                          — Kemasan / Detail Objek / Varian
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenVaultPicker("products")}
                          className="text-[11px] font-mono text-[#c29b74] hover:underline flex items-center gap-1 bg-[#c29b74]/10 px-2.5 py-1 rounded border border-[#c29b74]/20"
                        >
                          <Boxes className="h-3 w-3" /> Ambil dari Vault
                        </button>
                        <label className="text-[11px] font-mono font-semibold text-[#121315] bg-[#c29b74] hover:bg-[#d1aa82] px-2.5 py-1 rounded cursor-pointer flex items-center gap-1">
                          <Upload className="h-3 w-3" /> Tambah Foto Objek
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadObjects}
                          />
                        </label>
                      </div>
                    </div>

                    {objectImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {objectImages.map((obj, oIdx) => (
                          <div
                            key={obj.id}
                            className="relative group rounded-xl border border-[#2d2a27] bg-[#121315] p-2 space-y-1.5"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-[#383531]">
                              <img
                                src={obj.url}
                                alt={obj.label || `Objek ${oIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setObjectImages((prev) => prev.filter((item) => item.id !== obj.id));
                                }}
                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[#1e1313]/90 text-[#e06c75] hover:bg-[#e06c75] hover:text-white flex items-center justify-center text-xs transition-colors"
                                title="Hapus foto"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <span className="absolute bottom-1 left-1 bg-[#121315]/80 text-[#c29b74] px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                                @object_{oIdx + 1}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={obj.label || ""}
                              placeholder={`Nama/Label @object_${oIdx + 1}`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setObjectImages((prev) =>
                                  prev.map((item) => (item.id === obj.id ? { ...item, label: val } : item))
                                );
                              }}
                              className="w-full bg-[#18191d] border border-[#2b2724] rounded px-2 py-1 text-[11px] font-mono text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveProductToVault(obj.url, obj.label)}
                              className="w-full text-center text-[10px] font-mono text-[#8c857c] hover:text-[#d4af88] py-0.5 block"
                            >
                              💾 Simpan ke Vault
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border border-dashed border-[#2b2724] rounded-xl bg-[#121315]">
                        <p className="text-[11px] font-mono text-[#7d776f]">
                          Belum ada foto objek diunggah. Klik "Tambah Foto Objek" untuk upload foto produk.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. Environment Sheet Gallery (Multi-Photo for Property / Room Tour) */}
                  <div className="rounded-xl border border-[#262422] bg-[#1a1b1f] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242220] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-[#c29b74]" />
                        <span className="text-xs font-mono font-semibold text-[#f5f1eb]">
                          Environment / Ruangan Sheet ({environmentImages.length} Foto)
                        </span>
                        <span className="text-[10px] font-mono text-[#c29b74] bg-[#c29b74]/10 border border-[#c29b74]/20 px-2 py-0.5 rounded hidden sm:inline">
                          House Tour Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenVaultPicker("environments")}
                          className="text-[11px] font-mono text-[#c29b74] hover:underline flex items-center gap-1 bg-[#c29b74]/10 px-2.5 py-1 rounded border border-[#c29b74]/20"
                        >
                          <Boxes className="h-3 w-3" /> Ambil dari Vault
                        </button>
                        <label className="text-[11px] font-mono font-semibold text-[#121315] bg-[#c29b74] hover:bg-[#d1aa82] px-2.5 py-1 rounded cursor-pointer flex items-center gap-1">
                          <Upload className="h-3 w-3" /> Upload Foto Properti (+ Multi-Select)
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadEnvironments}
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8c857c]">
                      Bisa pilih banyak foto sekaligus (misal 10 foto: fasad luar, ruang tamu kayu jati, kamar tidur, lemari jati, kos-kosan 10 pintu, halaman depan). AI akan memetakan foto yang tepat di setiap klip!
                    </p>

                    {environmentImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {environmentImages.map((env, eIdx) => (
                          <div
                            key={env.id}
                            className="relative group rounded-xl border border-[#2d2a27] bg-[#121315] p-2 space-y-1.5"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-[#383531]">
                              <img
                                src={env.url}
                                alt={env.label || `Area ${eIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEnvironmentImages((prev) => prev.filter((item) => item.id !== env.id));
                                }}
                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[#1e1313]/90 text-[#e06c75] hover:bg-[#e06c75] hover:text-white flex items-center justify-center text-xs transition-colors"
                                title="Hapus foto"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <span className="absolute bottom-1 left-1 bg-[#121315]/80 text-[#c29b74] px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                                @setting_{eIdx + 1}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={env.label || ""}
                              placeholder={`Label @setting_${eIdx + 1} (misal Fasad)`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEnvironmentImages((prev) =>
                                  prev.map((item) => (item.id === env.id ? { ...item, label: val } : item))
                                );
                              }}
                              className="w-full bg-[#18191d] border border-[#2b2724] rounded px-2 py-1 text-[11px] font-mono text-[#f5f1eb] focus:border-[#c29b74] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveSettingToVault(env.url, env.label)}
                              className="w-full text-center text-[10px] font-mono text-[#8c857c] hover:text-[#d4af88] py-0.5 block"
                            >
                              💾 Simpan ke Vault
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 border border-dashed border-[#2b2724] rounded-xl bg-[#121315]">
                        <p className="text-[11px] font-mono text-[#7d776f]">
                          Belum ada foto ruangan diunggah. Klik "Upload Foto Properti" untuk upload banyak foto house tour sekaligus.
                        </p>
                      </div>
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
                  <span className="text-[#c29b74] uppercase font-bold">{selectedEngineTarget}</span>
                  {selectedEngineTarget === "llm-native" && masterResult.llmModel && (
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
              {(engineCategory === "video-ai" || selectedEngineTarget !== "llm-native"
                ? [
                    {
                      id: "direct-prompt",
                      label: `Prompt Studio (${selectedEngineTarget.toUpperCase()})`,
                      icon: Sparkles,
                    },
                    { id: "storyboard", label: `Naskah & Storyboard (${masterResult.scenes.length})`, icon: Film },
                    { id: "capcut-guide", label: "Panduan Edit CapCut", icon: Film },
                    { id: "character", label: "Pilar Konsistensi (@host)", icon: Users },
                    { id: "environment", label: "Setting & Objek", icon: Boxes },
                    { id: "gemini-chain", label: `Gemini Chain (${masterResult.scenes.length} Klip)`, icon: MessageSquare },
                    { id: "guide", label: "Alur Eksekusi", icon: Compass },
                  ]
                : [
                    { id: "gemini-chain", label: `Gemini Chain (${masterResult.scenes.length} Klip)`, icon: Sparkles },
                    { id: "capcut-guide", label: "Panduan Edit CapCut", icon: Film },
                    { id: "storyboard", label: `Naskah & Adegan (${masterResult.scenes.length})`, icon: Film },
                    {
                      id: "direct-prompt",
                      label: `Master Prompt (${selectedEngineTarget.toUpperCase()})`,
                      icon: MessageSquare,
                    },
                    { id: "character", label: "Pilar Konsistensi (@host)", icon: Users },
                    { id: "environment", label: "Setting & Objek", icon: Boxes },
                    { id: "guide", label: "Alur Eksekusi", icon: Compass },
                  ]
              ).map((tab) => {
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

            {/* TAB: GEMINI MULTI-CLIP CHAINING */}
            {activeBoardTab === "gemini-chain" && (
              <div className="space-y-6">
                {/* Header Explainer Card */}
                <div className="rounded-2xl border border-[#c29b74]/40 bg-gradient-to-r from-[#171615] to-[#121315] p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#c29b74]" />
                      <h3 className="text-base font-semibold text-[#f5f1eb]">
                        Rantai Produksi Multi-Klip Gemini (Maksimal 40 Detik • 4 Klip @ 10s)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          downloadTextFile(
                            `rantai-gemini-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`,
                            generateFullGeminiChainText(masterResult)
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1d1e22] px-3 py-1.5 text-xs font-mono text-[#cfc8bf] hover:text-[#f5f1eb]"
                      >
                        <Download className="h-3.5 w-3.5 text-[#c29b74]" />
                        <span>Unduh Semua Klip (.txt)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(generateFullGeminiChainText(masterResult), "all-gemini-chain")
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                      >
                        {copiedKey === "all-gemini-chain" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedKey === "all-gemini-chain" ? "Tersalin!" : "Salin Seluruh Rantai"}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#a8a197] leading-relaxed">
                    Dirancang khusus untuk eksekusi video di <strong>Gemini (Maksimal 40 Detik / 4 Klip @ 10s per sesi)</strong>. Selesaikan 4 klip ini di <strong>SATU UTAS PERCAKAPAN GEMINI YANG SAMA</strong> sehingga 100% tuntas dalam satu sesi tanpa terpotong atau terkena batas kuota 5 jam!
                  </p>
                </div>

                {/* Smart Multi-Part Switcher if scenes > 4 */}
                {masterResult.parts && masterResult.parts.length > 1 && (
                  <div className="rounded-2xl border border-[#c29b74]/40 bg-[#151619] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#c29b74]" />
                        <span className="text-xs font-mono font-bold text-[#f5f1eb] uppercase tracking-wider">
                          Topik Dipecah Cerdas Menjadi 2 Sesi Gemini
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8c857c] mt-0.5">
                        Karena topik melebihi 4 klip, sistem otomatis membaginya menjadi 2 bagian terhubung (@ 40s) agar aman dari batas kuota 5 jam.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#101113] p-1 rounded-xl border border-[#2d2a27]">
                      {masterResult.parts.map((p, pIdx) => (
                        <button
                          key={p.partNumber}
                          type="button"
                          onClick={() => setActivePartTab(pIdx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            activePartTab === pIdx
                              ? "bg-[#c29b74] text-[#121315] font-bold shadow"
                              : "text-[#8c857c] hover:text-[#f5f1eb]"
                          }`}
                        >
                          Part {p.partNumber} ({p.sceneIndices.length} Klip)
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setActivePartTab(99)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          activePartTab === 99
                            ? "bg-[#c29b74] text-[#121315] font-bold shadow"
                            : "text-[#8c857c] hover:text-[#f5f1eb]"
                        }`}
                      >
                        Semua Klip ({masterResult.scenes.length})
                      </button>
                    </div>
                  </div>
                )}

                {/* Part Session Advice Banner */}
                {masterResult.parts && masterResult.parts[activePartTab] && activePartTab !== 99 && (
                  <div className="rounded-xl border border-[#33302c] bg-[#1a1b1f] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs font-mono">
                      <span className="text-[#c29b74] font-bold block">
                        {masterResult.parts[activePartTab].partTitle}
                      </span>
                      <span className="text-[#8c857c] text-[11px]">
                        {masterResult.parts[activePartTab].sessionAdvice}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetIndices = masterResult.parts![activePartTab].sceneIndices;
                        const partPrompts = targetIndices
                          .map((idx) => formatGeminiSingleClipPrompt(masterResult, masterResult.scenes[idx], idx))
                          .join("\n\n--------------------------------------------------\n\n");
                        copyText(partPrompts, `part-copy-${activePartTab + 1}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#c29b74] text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82] shrink-0"
                    >
                      {copiedKey === `part-copy-${activePartTab + 1}`
                        ? "Part Tersalin!"
                        : `Salin 4 Prompt Part ${activePartTab + 1}`}
                    </button>
                  </div>
                )}

                {/* Clip Cards List */}
                <div className="space-y-4">
                  {(masterResult.parts && masterResult.parts.length > 1 && activePartTab !== 99
                    ? masterResult.scenes.filter((_, idx) =>
                        masterResult.parts![activePartTab]?.sceneIndices.includes(idx)
                      )
                    : masterResult.scenes
                  ).map((scene, idx) => {
                    const actualIdx =
                      masterResult.parts && masterResult.parts.length > 1 && activePartTab !== 99
                        ? masterResult.parts[activePartTab].sceneIndices[idx]
                        : idx;

                    return (
                      <div
                        key={scene.sceneNumber}
                        className="rounded-2xl border border-[#282624] bg-[#151619] p-5 sm:p-6 space-y-4 transition-all hover:border-[#c29b74]/40"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242220] pb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c29b74] text-[#121315] font-mono font-bold text-xs">
                              {scene.sceneNumber}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-sans text-sm font-semibold text-[#f5f1eb]">
                                  Klip {scene.sceneNumber}: {scene.stageName}
                                </h4>
                                {scene.rollType && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#242220] text-[#c29b74] font-medium">
                                    {scene.rollType}
                                  </span>
                                )}
                                {scene.settingRefTag && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1b2229] text-[#70b0ff] border border-[#70b0ff]/20 font-medium">
                                    {scene.settingRefTag}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-[#7d776f]">
                                Durasi: 10 Detik ({scene.timeRange}) • Pacing:{" "}
                                <span className="text-[#d4af88]">
                                  {masterResult.pacingMode === "fast"
                                    ? "Cepat (24–28 kata)"
                                    : "Normal (14–18 kata)"}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                downloadTextFile(
                                  `klip-${scene.sceneNumber}-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`,
                                  formatGeminiSingleClipPrompt(masterResult, scene, actualIdx)
                                )
                              }
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1a1b1f] border border-[#2d2a27] text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                              title="Unduh prompt klip ini"
                            >
                              <Download className="h-3 w-3 text-[#c29b74]" />
                              <span className="hidden sm:inline">Unduh</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                copyText(
                                  formatGeminiSingleClipPrompt(masterResult, scene, actualIdx),
                                  `gemini-clip-${scene.sceneNumber}`
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c29b74] text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                            >
                              {copiedKey === `gemini-clip-${scene.sceneNumber}` ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                              <span>
                                {copiedKey === `gemini-clip-${scene.sceneNumber}`
                                  ? "Klip Tersalin!"
                                  : `Salin Prompt Klip ${scene.sceneNumber}`}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Boundary Hand-off Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          <div className="rounded-lg border border-[#282624] bg-[#121315] p-2.5">
                            <span className="text-[10px] uppercase text-[#6e6861] block mb-0.5">
                              🎬 Starting Frame (Titik Masuk):
                            </span>
                            <span className="text-[#cfc8bf] text-[11px]">
                              {scene.startingFrame || "Melanjutkan persis dari pose akhir klip sebelumnya"}
                            </span>
                          </div>
                          <div className="rounded-lg border border-[#282624] bg-[#121315] p-2.5">
                            <span className="text-[10px] uppercase text-[#6e6861] block mb-0.5">
                              🏁 Ending Frame (Titik Sambung):
                            </span>
                            <span className="text-[#cfc8bf] text-[11px]">
                              {scene.endingFrame || "Transisi ke posisi awal klip selanjutnya"}
                            </span>
                          </div>
                        </div>

                        {/* Ready-to-Paste Code Box */}
                        <div className="rounded-xl border border-[#262422] bg-[#111214] p-3.5 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                          {formatGeminiSingleClipPrompt(masterResult, scene, actualIdx)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: CAPCUT EDITING GUIDE */}
            {activeBoardTab === "capcut-guide" && (
              <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242220] pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#f5f1eb] flex items-center gap-2">
                      <Film className="h-4 w-4 text-[#c29b74]" />
                      Panduan Editing & Penggabungan CapCut (Seamless Assembly)
                    </h3>
                    <p className="text-xs text-[#8c857c] mt-0.5">
                      Cara menyambungkan klip 5 detik menjadi video utuh tanpa terasa melompat atau kaku.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          `panduan-capcut-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`,
                          generateFullCapcutGuideText(masterResult)
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1d1e22] px-3.5 py-1.5 text-xs font-mono text-[#cfc8bf] hover:text-[#f5f1eb]"
                    >
                      <Download className="h-3.5 w-3.5 text-[#c29b74]" />
                      <span>Unduh Panduan (.txt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(generateFullCapcutGuideText(masterResult), "capcut-guide")
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                    >
                      {copiedKey === "capcut-guide" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "capcut-guide" ? "Panduan Tersalin!" : "Salin Panduan"}</span>
                    </button>
                  </div>
                </div>

                {/* Step Cards */}
                <div className="grid grid-cols-1 gap-3">
                  {(masterResult.capcutAssemblyGuide && masterResult.capcutAssemblyGuide.length > 0
                    ? masterResult.capcutAssemblyGuide
                    : [
                        "LANGKAH 1: PERSIAPAN MEDIA - Buka CapCut, impor seluruh video (Klip 1 s/d " + masterResult.scenes.length + "). Atur rasio kanvas 9:16 untuk Shorts/TikTok/Reels atau 16:9 untuk YouTube horizontal.",
                        "LANGKAH 2: PENATAAN TIMELINE - Susun klip berurutan. Untuk klip B-Roll, posisikan sebagai Overlay di atas narasi suara host agar visual berganti dinamis tanpa jeda.",
                        "LANGKAH 3: TRIMMING & PACING - Potong 0.2-0.4s di awal/akhir klip yang gerakannya lambat sebelum aksi dimulai, agar ritme napas antar adegan terasa gesit.",
                        "LANGKAH 4: SPEED RAMP & SINEMATIK - Pada klip aksi estetik/tekstur produk, terapkan Speed 0.7x-0.8x dengan Smooth Optical Flow untuk visual mewah layaknya iklan TV.",
                        "LANGKAH 5: SOUND EFFECT & AUTO-CAPTIONS - Tarik sound effect foley persis di bawah frame aksi fisik terjadi, lalu aktifkan Auto Captions animasi per kata.",
                      ]
                  ).map((guideText, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#2b2926] bg-[#121315] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap"
                    >
                      {guideText}
                    </div>
                  ))}
                </div>

                {/* Scene-by-Scene Cut Cheat Sheet Table */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-semibold text-[#f5f1eb] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-[#c29b74]" />
                    Tabel Rekomendasi Titik Potong & Efek CapCut per Adegan:
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-[#282624]">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#1a1b1f] text-[#c29b74] border-b border-[#282624]">
                        <tr>
                          <th className="p-3">Klip</th>
                          <th className="p-3">Tipe</th>
                          <th className="p-3">Naskah Dialog</th>
                          <th className="p-3">Rekomendasi Aksi CapCut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#242220] bg-[#121315] text-[#cfc8bf]">
                        {masterResult.scenes.map((s) => (
                          <tr key={s.sceneNumber} className="hover:bg-[#16171b]">
                            <td className="p-3 font-bold text-[#f5f1eb] whitespace-nowrap">
                              Klip {s.sceneNumber} ({s.timeRange})
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-[#242220] text-[#c29b74]">
                                {s.rollType || "A-Roll"}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs truncate text-[11px] text-[#a8a197]">
                              "{s.voiceoverScriptId}"
                            </td>
                            <td className="p-3 text-[11px] text-[#d4af88]">
                              {s.capcutEditNote || "Hard cut langsung menyambung gerakan sebelumnya"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Salin Dialog Saja */}
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
                      <span>{copiedKey === "all-dialogues" ? "Dialog Tersalin" : "Salin Dialog"}</span>
                    </button>

                    {/* Unduh Prompt Bersih (.txt) */}
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          `prompt-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${selectedEngineTarget}.txt`,
                          formatEnginePrompt(masterResult, selectedEngineTarget)
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1d1e22] px-3 py-1.5 text-xs font-mono text-[#cfc8bf] hover:text-[#f5f1eb] hover:border-[#c29b74]/40"
                      title="Download file text prompt bersih 100% tanpa instruksi manusia, langsung siap tempel ke Gemini / ChatGPT"
                    >
                      <Download className="h-3.5 w-3.5 text-[#c29b74]" />
                      <span>Unduh Prompt ({selectedEngineTarget})</span>
                    </button>

                    {/* Unduh Panduan Terpisah (.txt) */}
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          `panduan-langkah-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`,
                          generateHumanExecutionGuide(masterResult)
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1d1e22] px-3 py-1.5 text-xs font-mono text-[#a8a197] hover:text-[#f5f1eb]"
                      title="Download panduan langkah penggunaan terpisah"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#a8a197]" />
                      <span>Unduh Panduan (.txt)</span>
                    </button>

                    {/* Salin Prompt Bersih Siap Copas */}
                    <button
                      type="button"
                      onClick={() =>
                        copyText(formatEnginePrompt(masterResult, selectedEngineTarget), "all-scenes-clean")
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                      title="Salin prompt bersih 100% siap tempel ke Gemini / ChatGPT (instruksi dipisah agar AI tidak bingung)"
                    >
                      {copiedKey === "all-scenes-clean" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === "all-scenes-clean" ? "Prompt Bersih Tersalin!" : "Salin Prompt Bersih"}</span>
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
            {activeBoardTab === "direct-prompt" && (
              <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-4">
                {/* Engine Selector Pills for On-the-Fly Re-composition */}
                <div className="space-y-2 border-b border-[#242220] pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#a8a197] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#c29b74]" />
                      Pilih Tool Video (Prompt Disusun Ulang Otomatis):
                    </span>
                    <span className="text-[11px] font-mono text-[#c29b74] font-medium">
                      {VIDEO_TOOLS.find((t) => t.id === selectedEngineTarget)?.quotaInfo || ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {VIDEO_TOOLS.map((tool) => {
                      const isSelected = selectedEngineTarget === tool.id;
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => setSelectedEngineTarget(tool.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? "bg-[#c29b74] text-[#121315] font-semibold border-[#c29b74] shadow-sm"
                              : "bg-[#141518] text-[#a8a197] border-[#2b2724] hover:border-[#c29b74]/40 hover:text-[#f5f1eb]"
                          }`}
                        >
                          <span>{tool.label}</span>
                          {tool.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-sans uppercase font-bold ${
                                isSelected
                                  ? "bg-[#121315] text-[#c29b74]"
                                  : "bg-[#252321] text-[#c29b74]"
                              }`}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242220] pb-3">
                  <div>
                    <h4 className="text-base font-semibold text-[#f5f1eb] font-sans flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#c29b74]" />
                      Master Prompt Bersih ({selectedEngineTarget.toUpperCase()})
                    </h4>
                    <p className="text-xs text-[#8c857c] font-sans mt-0.5">
                      Prompt 100% bersih tanpa instruksi manusia, langsung siap tempel ke AI (instruksi dipisahkan agar AI tidak bingung).
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          `prompt-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${selectedEngineTarget}.txt`,
                          formatEnginePrompt(masterResult, selectedEngineTarget)
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-[#383531] bg-[#1d1e22] px-3.5 py-1.5 text-xs font-mono text-[#cfc8bf] hover:text-[#f5f1eb] hover:border-[#c29b74]/40"
                    >
                      <Download className="h-3.5 w-3.5 text-[#c29b74]" />
                      <span>Unduh Prompt ({selectedEngineTarget})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyText(formatEnginePrompt(masterResult, selectedEngineTarget), "direct-prompt-clean")
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3.5 py-1.5 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82]"
                    >
                      {copiedKey === "direct-prompt-clean" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === "direct-prompt-clean" ? "Prompt Bersih Tersalin!" : "Salin Prompt Bersih"}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                  {formatEnginePrompt(masterResult, selectedEngineTarget)}
                </div>

                {/* Per-Shot Quick Copy Cards for Google Flow & Video AI Engines */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#242220] pt-4">
                    <div>
                      <h5 className="text-xs font-mono font-semibold text-[#f5f1eb] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#c29b74]" />
                        <span>Prompt Per-Shot ({selectedEngineTarget.toUpperCase()}):</span>
                      </h5>
                      <p className="text-[11px] text-[#8c857c] font-sans mt-0.5">
                        Salin satu-per-satu ke kolom prompt / node di {selectedEngineTarget.toUpperCase()} tanpa perlu salin manual seluruh teks.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-[#c29b74] bg-[#c29b74]/10 border border-[#c29b74]/20 px-2.5 py-1 rounded-full">
                      Total {masterResult.scenes.length} Shot
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {masterResult.scenes.map((scene) => {
                      const shotPrompt = formatSingleShotForTool(masterResult, scene, selectedEngineTarget);
                      const shotKey = `shot-tool-${scene.sceneNumber}`;
                      return (
                        <div key={scene.sceneNumber} className="rounded-xl border border-[#282624] bg-[#121315] p-4 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-[#f5f1eb] flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[#c29b74]" />
                              Shot {scene.sceneNumber}: {scene.stageName} ({scene.timeRange})
                            </span>
                            <button
                              type="button"
                              onClick={() => copyText(shotPrompt, shotKey)}
                              className="flex items-center gap-1.5 rounded-lg bg-[#c29b74] px-3 py-1 text-xs font-mono font-semibold text-[#121315] hover:bg-[#d1aa82] transition-colors"
                            >
                              {copiedKey === shotKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              <span>{copiedKey === shotKey ? "Shot Tersalin!" : `Salin Shot ${scene.sceneNumber} (${selectedEngineTarget.toUpperCase()})`}</span>
                            </button>
                          </div>
                          <div className="rounded-lg border border-[#22201e] bg-[#0b0c0d] p-3 text-xs font-mono text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                            {shotPrompt}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Callout Panduan Langkah Manusia Terpisah */}
                <div className="rounded-xl border border-[#2b2926] bg-[#141416] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#a8a197] flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#c29b74]" />
                      Panduan Langkah Eksekusi (Untuk Pengguna):
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          `panduan-langkah-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`,
                          generateHumanExecutionGuide(masterResult)
                        )
                      }
                      className="text-[11px] font-mono text-[#c29b74] hover:underline flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> Unduh Panduan (.txt)
                    </button>
                  </div>
                  <p className="text-xs font-sans text-[#7d776f] leading-relaxed">
                    Instruksi cara upload dan urutan eksekusi sengaja dipisahkan dari prompt utama di atas agar model LLM tidak bingung saat membaca arahan teknis.
                  </p>
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

                {/* Gallery of Characters */}
                {masterResult.characterImages && masterResult.characterImages.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-[#c29b74] font-medium block">
                      Daftar Karakter Terkunci ({masterResult.characterImages.length} Foto):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {masterResult.characterImages.map((c, cIdx) => (
                        <div key={c.id || cIdx} className="rounded-xl border border-[#c29b74]/30 bg-[#171614] p-2 space-y-1">
                          <img
                            src={c.url}
                            alt={c.label || `Host ${cIdx + 1}`}
                            className="aspect-square w-full rounded-lg object-cover border border-[#c29b74]/40"
                          />
                          <span className="text-[10px] font-mono text-[#c29b74] block font-bold">
                            @character_{cIdx + 1}
                          </span>
                          <span className="text-[11px] font-sans text-[#cfc8bf] block truncate">
                            {c.label || `Host ${cIdx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : masterResult.hostImage ? (
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
                ) : null}

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

                  {/* Multi-Environment Gallery */}
                  {masterResult.environmentImages && masterResult.environmentImages.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-[#c29b74] font-medium block">
                        Daftar Ruangan / Properti Terkunci ({masterResult.environmentImages.length} Foto):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {masterResult.environmentImages.map((env, eIdx) => (
                          <div key={env.id || eIdx} className="rounded-xl border border-[#c29b74]/30 bg-[#171614] p-2 space-y-1">
                            <img
                              src={env.url}
                              alt={env.label || `Area ${eIdx + 1}`}
                              className="aspect-square w-full rounded-lg object-cover border border-[#c29b74]/40"
                            />
                            <span className="text-[10px] font-mono text-[#c29b74] block font-bold">
                              @setting_{eIdx + 1}
                            </span>
                            <span className="text-[11px] font-sans text-[#cfc8bf] block truncate">
                              {env.label || `Area ${eIdx + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : masterResult.settingImage ? (
                    <div className="flex items-center gap-4 rounded-xl border border-[#c29b74]/30 bg-[#171614] p-4">
                      <img
                        src={masterResult.settingImage}
                        alt="Setting Reference"
                        className="h-20 w-20 rounded-xl object-cover border border-[#c29b74]/50 shrink-0"
                      />
                      <div>
                        <span className="inline-block rounded-md bg-[#c29b74]/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#c29b74] uppercase mb-1">
                          Foto Ruangan / Latar Nyata Aktif
                        </span>
                        <h5 className="text-sm font-semibold text-[#f5f1eb] font-sans">
                          Arsitektur & Geometri Ruang Terkunci
                        </h5>
                        <p className="text-xs text-[#a8a197] font-sans mt-0.5">
                          Semua shot mengikuti tata letak, pencahayaan alami, dan material dari foto referensi ini untuk mencegah halusinasi.
                        </p>
                      </div>
                    </div>
                  ) : null}

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

                  {masterResult.objectImages && masterResult.objectImages.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-[#c29b74] font-medium block">
                        Daftar Objek / Produk Terkunci ({masterResult.objectImages.length} Foto):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {masterResult.objectImages.map((obj, oIdx) => (
                          <div key={obj.id || oIdx} className="rounded-xl border border-[#c29b74]/30 bg-[#171614] p-2 space-y-1">
                            <img
                              src={obj.url}
                              alt={obj.label || `Objek ${oIdx + 1}`}
                              className="aspect-square w-full rounded-lg object-cover border border-[#c29b74]/40"
                            />
                            <span className="text-[10px] font-mono text-[#c29b74] block font-bold">
                              @object_{oIdx + 1}
                            </span>
                            <span className="text-[11px] font-sans text-[#cfc8bf] block truncate">
                              {obj.label || `Objek ${oIdx + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : masterResult.productImage ? (
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
                  ) : null}

                  <div className="rounded-xl border border-[#262422] bg-[#111214] p-4 font-mono text-xs text-[#cfc8bf] leading-relaxed whitespace-pre-wrap select-all">
                    {masterResult.objectProfile.masterObjectPrompt}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GUIDE */}
            {activeBoardTab === "guide" && (
              <div className="rounded-2xl border border-[#282624] bg-[#151619] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#242220] pb-3">
                  <h4 className="text-base font-semibold text-[#f5f1eb] font-sans">
                    Panduan Penggunaan ({masterResult.engineTarget.toUpperCase()})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        `panduan-eksekusi-${masterResult.projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`,
                        generateHumanExecutionGuide(masterResult)
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-[#2d2a27] bg-[#1a1b1f] px-3.5 py-1.5 text-xs font-mono text-[#c4bcb2] hover:text-[#f5f1eb]"
                  >
                    <Download className="h-3.5 w-3.5 text-[#c29b74]" />
                    <span>Unduh Panduan (.txt)</span>
                  </button>
                </div>
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

        {/* Universal Asset Vault Picker Modal */}
        <AssetVaultPickerModal
          isOpen={isVaultPickerOpen}
          initialCategory={vaultPickerCategory}
          onClose={() => setIsVaultPickerOpen(false)}
          onSelectCharacter={(char) => {
            setHostType("custom");
            setCustomHostDescription(char.visualPrompt);
            if (char.imageBase64) {
              setHostImage(char.imageBase64);
              setCharacterImages((prev) => [
                ...prev,
                { id: `char-vault-${Date.now()}`, url: char.imageBase64!, label: char.name || "Host Vault" },
              ]);
            }
          }}
          onSelectProduct={(prod) => {
            if (prod.imageBase64) {
              setProductImage(prod.imageBase64);
              setObjectImages((prev) => [
                ...prev,
                { id: `obj-vault-${Date.now()}`, url: prod.imageBase64!, label: prod.name || "Produk Vault" },
              ]);
            }
          }}
          onSelectEnvironment={(env) => {
            setCustomSettingDescription(env.visualPrompt);
            if (env.imageBase64) {
              setSettingImage(env.imageBase64);
              setEnvironmentImages((prev) => [
                ...prev,
                { id: `env-vault-${Date.now()}`, url: env.imageBase64!, label: env.name || "Ruangan Vault" },
              ]);
            }
          }}
        />
      </main>
    </div>
  );
}
