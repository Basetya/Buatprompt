import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VideoAiEngine, LlmModelType, TargetDurationOption, PacingMode } from "../ugc-flow-clarify/route";

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
  settingRefTag?: string; // e.g. "@setting_1"
  characterRefTag?: string; // e.g. "@character_1"
  objectRefTag?: string; // e.g. "@object_1"
}

interface UgcFlowGenerateRequest {
  topic: string;
  targetDuration: TargetDurationOption;
  engineTarget: VideoAiEngine;
  llmModel?: LlmModelType;
  styleGenre: "hyper-real-ugc" | "house-tour" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial";
  hostType: string;
  customHostDescription?: string;
  cameraArchetype?: string;
  pacingMode?: PacingMode;
  clarificationAnswers: Record<string, string>;
  // Legacy single image
  hostImage?: string | null;
  productImage?: string | null;
  settingImage?: string | null;
  // Multi-file sheets
  characterImages?: SheetImageItem[];
  objectImages?: SheetImageItem[];
  environmentImages?: SheetImageItem[];
  // Execution architecture: isolated (default, anti-stall) vs chained
  clipMode?: "isolated" | "chained";
}

export async function POST(req: NextRequest) {
  try {
    const body: UgcFlowGenerateRequest = await req.json();
    const {
      topic = "",
      targetDuration = "gemini-40s",
      engineTarget = "google-flow",
      llmModel = "gemini",
      styleGenre = "hyper-real-ugc",
      hostType = "female-pro",
      customHostDescription = "",
      cameraArchetype = "auto",
      pacingMode = "normal",
      clipMode = "isolated",
      clarificationAnswers = {},
      hostImage = null,
      productImage = null,
      settingImage = null,
      characterImages = [],
      objectImages = [],
      environmentImages = [],
    } = body;

    const rawApiKey = process.env.GEMINI_API_KEY || "";
    const apiKeys = rawApiKey
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 20);

    // Normalizing image arrays (multi-file sheet support)
    const normalizedCharacters: SheetImageItem[] = [...characterImages];
    if (normalizedCharacters.length === 0 && hostImage) {
      normalizedCharacters.push({ id: "char-1", url: hostImage, label: "Host Utama" });
    }

    const normalizedObjects: SheetImageItem[] = [...objectImages];
    if (normalizedObjects.length === 0 && productImage) {
      normalizedObjects.push({ id: "obj-1", url: productImage, label: "Hero Object" });
    }

    const normalizedEnvironments: SheetImageItem[] = [...environmentImages];
    if (normalizedEnvironments.length === 0 && settingImage) {
      normalizedEnvironments.push({ id: "env-1", url: settingImage, label: "Ruangan / Latar Utama" });
    }

    const isShortClip = targetDuration === "<=10s";
    const isGemini40s =
      targetDuration === "gemini-40s" ||
      targetDuration === "<=40s" ||
      (engineTarget === "llm-native" && llmModel === "gemini" && targetDuration !== "longform-multiplier");
    const isGeminiLegacy5 = targetDuration === "gemini-5clip";
    const isLongFormMultiplier = targetDuration === "longform-multiplier";

    // Adaptive scene count calculation
    // RULE 1: Max 40 seconds per topic/session in Gemini (4 clips x 10s = 40s)
    let sceneCount = 4;
    let durPerScene = 10;

    if (isShortClip) {
      sceneCount = 1;
      durPerScene = 10;
    } else if (isGeminiLegacy5) {
      sceneCount = 5;
      durPerScene = 5;
    } else if (isGemini40s) {
      sceneCount = 4;
      durPerScene = 10;
    } else if (isLongFormMultiplier || targetDuration === "<=120s" || targetDuration === ">120s") {
      // RULE 3: If topic exceeds 4 videos (>40s), split into 2 connected parts of 4 clips each (8 clips total)
      sceneCount = 8;
      durPerScene = 10;
    } else if (targetDuration === "<=60s") {
      sceneCount = 6;
      durPerScene = 10;
    } else {
      sceneCount = 4;
      durPerScene = 10;
    }

    // Host description
    let hostName = "Presenter Utama";
    let hostVisualPrompt = "";
    if (normalizedCharacters.length > 0) {
      hostName = normalizedCharacters.length === 1
        ? `Custom Creator (${normalizedCharacters[0].label || "Host Terlampir"})`
        : `Multi-Character Host (${normalizedCharacters.length} Karakter/Host)`;
      hostVisualPrompt =
        normalizedCharacters.length === 1
          ? "UGC Creator strictly matching the attached reference photo [@character_1 / @host_anchor], preserving identical facial structure, hairstyle, skin tone, eye shape, and clothing style across all scenes."
          : `Multi-Character cast (${normalizedCharacters.map((c, i) => `@character_${i + 1} (${c.label || "Cast"})`).join(", ")}). Maintain strict visual fidelity for each character in their respective scenes.`;
    } else if (hostType === "male-casual") {
      hostName = "Bimo — Smart Casual";
      hostVisualPrompt =
        "Indonesian male creator in late 20s, natural groomed short black hair, casual smart navy linen shirt, silver watch, authentic friendly smile, natural skin micro-texture, visible pores, medically accurate facial anatomy, professional soft daylight.";
    } else if (hostType === "female-pro") {
      hostName = "Sarah — Modern Professional";
      hostVisualPrompt =
        "Indonesian female creator in late 20s, elegant modern beige linen blazer over silk top, subtle minimalist jewelry, natural polished ponytail hair, warm articulate expression, natural skin subsurface scattering, realistic eye catchlights, flawless anatomy.";
    } else if (hostType === "cartoon-3d-animation") {
      hostName = "Stylized 3D Character Host";
      hostVisualPrompt =
        "Charming stylized 3D animated character host, Pixar-quality subsurface scattering, soft studio lighting, expressive facial mechanics, vibrant textured fabric clothing, friendly large expressive eyes.";
    } else if (hostType === "none-faceless") {
      hostName = "Faceless First-Person POV";
      hostVisualPrompt =
        "First-person perspective, authentic human hands interacting with objects, dynamic environmental focus, no face shown.";
    } else {
      hostName = "Custom Host";
      hostVisualPrompt = customHostDescription || "Professional on-camera presenter with authentic human realism.";
    }

    const clarificationSummary = Object.entries(clarificationAnswers)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const isLlmNative = engineTarget === "llm-native";

    // RULE 2: Speech pacing word budgets
    const wordBudgetGuidance =
      pacingMode === "fast"
        ? "BATAS KATA NASKAH (PACING CEPAT / PADAT TIKTOK KINETIC): Wajib antara 24 HINGGA 28 KATA PER ADEGAN (maksimal 28 kata per klip 10 detik). Padat informasi, energik, hook cepat tanpa basa-basi."
        : "BATAS KATA NASKAH (PACING SEDANG / NORMAL): Wajib antara 14 HINGGA 18 KATA PER ADEGAN (maksimal 18 kata per klip 10 detik). Santai, artikulatif, natural dengan jeda napas [pause] yang elegan.";

    // Multi-part instruction (RULE 3)
    const multiPartInstruction =
      !isLlmNative
        ? `STRUKTUR MULTI-SHOT KHUSUS ${engineTarget.toUpperCase()}:
- Susun ${sceneCount} shot video berkualitas tinggi tanpa instruksi percakapan chat LLM.
- Gunakan format teknis resmi ${engineTarget.toUpperCase()}: slash commands (/camera, /lighting, /motion), tag aset multimodal (@character_1, @setting_1), dialog, dan foley soundscape.`
        : sceneCount > 4
        ? `STRUKTUR 2 TOPIK BERURUTAN (MULTI-PART SPLITTER):
- Karena durasi melebihi 4 video (>40 detik), bagilah video menjadi 2 TOPIK / BAGIAN YANG SALING NYAMBUNG:
  * BAGIAN 1 (Adegan 1–4, Sesi Gemini 1, Maks 40s): Hook viral, pengenalan masalah/properti utama, eksplorasi highlight awal, dan diakhiri dengan CLIFFHANGER penasaran ("Mau tahu area rahasia yang bikin rumah ini bisa bayar cicilannya sendiri? Lanjut di Part 2!").
  * BAGIAN 2 (Adegan 5–8, Sesi Gemini 2, Maks 40s): Pembuka jembatan kontinuitas ("Melanjutkan dari Part 1..."), pengungkapan fitur rahasia/kos-kosan/passive income, pembuktian nyata, dan Call To Action penutup yang kuat.`
        : `STRUKTUR 1 TOPIK TUNTAS (MAKSIMAL 40 DETIK / 4 KLIP):
- Semua 4 adegan harus menyelesaikan satu topik secara tuntas dalam durasi total maksimal 40 detik, siap dijalankan dalam 1 sesi Gemini tanpa terpotong atau terkena kuota batas 5 jam.`;

    // Multi-sheet mapping instruction (RULE 4)
    const multiSheetInstruction = `MULTI-IMAGE SHEET MAPPING:
${
  normalizedEnvironments.length > 0
    ? `- Disediakan ${normalizedEnvironments.length} foto referensi ruangan/properti nyata (@setting_1 s/d @setting_${normalizedEnvironments.length}). Distribusikan foto-foto ini ke tiap adegan secara logis (misal Adegan 1 menggunakan @setting_1, Adegan 2 menggunakan @setting_2, dst). Tuliskan settingRefTag "@setting_X" di setiap adegan agar visual AI mematuhi arsitektur foto tersebut tanpa halusinasi!`
    : "- Setting: Pertahankan konsistensi arsitektur dan pencahayaan latar."
}
${
  normalizedCharacters.length > 1
    ? `- Disediakan ${normalizedCharacters.length} karakter/host (@character_1 s/d @character_${normalizedCharacters.length}). Petakan karakter yang tampil di tiap adegan dengan characterRefTag "@character_X".`
    : ""
}
${
  normalizedObjects.length > 1
    ? `- Disediakan ${normalizedObjects.length} objek referensi (@object_1 s/d @object_${normalizedObjects.length}). Petakan objek yang tampil di tiap adegan dengan objectRefTag "@object_X".`
    : ""
}`;

    const systemPrompt = `Anda adalah Master Creative Video Director & Multi-Engine Prompt Architect kelas dunia (Hyper-Smart AI Video Director).
Tugas: Hasilkan rancangan video UGC terstruktur yang 100% SIAP EKSEKUSI SEKALI PROMPT LANGSUNG JADI tanpa perlu revisi manual untuk format ${targetDuration} (${sceneCount} adegan @ ${durPerScene}s).
Target Engine Pilihan Kreator: ${engineTarget.toUpperCase()} ${isLlmNative ? `(LLM: ${llmModel.toUpperCase()})` : ""}

${wordBudgetGuidance}

${multiPartInstruction}

${multiSheetInstruction}

EMPAT PILAR KONSISTENSI VISUAL MUTLAK & GUARDRAIL REALITAS:
1. PILAR 1 - STRICT GROUNDED REALITY & ANTI-CATFISH GUARDRAIL (ANTI-HALUSINASI ARSITEKTUR):
   - WAJIB 100% MEMATUHI ELEMEN FISIK FOTO REFERENSI (@setting_X): Bentuk bangunan asli, material dinding, jenis lantai, kondisi halaman/pekarangan, dan lingkungan sekitar HARUS identik dengan foto nyata yang dilampirkan.
   - PANTANGAN MUTLAK / DILARANG KERAS MENGARANG:
     * DILARANG menambahkan pilar istana Romawi, kolam renang mewah fiktif, lantai marmer kerajaan, taman bunga Eropa, gerbang istana, atau mengubah rumah sederhana/asri 1 lantai menjadi mansion megah!
     * Calon pembeli yang datang ke lokasi TIDAK BOLEH merasa tertipu iklan video (ZERO CATFISHING).
   - TEKNIK ESTETIKA TANPA NGARANG (CINEMATIC GROUNDED VARIATION):
     * Jadikan video indah dan sinematik BUKAN dengan mengubah atau mempercantik bangunan secara palsu, melainkan dengan VARIASI ANGLE & PERGERAKAN KAMERA PROFESIONAL terhadap objek yang BENAR-BENAR ADA di foto:
       1) Ken Burns effect (slow push-in, subtle pull-out, smooth drift zoom)
       2) Smooth eye-level gimbal glide & parallax tracking (kamera meluncur halus sejajar mata)
       3) Dynamic foreground depth (misal dedaunan pohon buah asli menjadi foreground alami)
       4) Pencahayaan alami sinematik: Golden hour, soft morning sunbeams, warm ambient glow yang memperindah tekstur asli.
2. PILAR 2 - LIGHTING CONTINUITY ANCHOR:
   - Seluruh adegan WAJIB memiliki kondisi tata cahaya yang konsisten dan alami (misal: "Natural soft morning daylight, 45-degree warm key light with subtle rim reflection"). Dilarang mengubah sumber cahaya mendadak antar klip agar warna tidak melompat saat digabung di CapCut.
3. PILAR 3 - WARDROBE & PROP LOCK ANCHOR:
   - Pakaian, gaya hijab/rambut, kacamata, dan aksesori @character_1 serta wujud fisik @hero_object harus 100% TERKUNCI identik di setiap scene sesuai foto referensi tanpa deviasi.
4. PILAR 4 - AUDIO-ACTION SYNC ANCHOR (ZERO PHANTOM SFX):
   - Efek suara foley (seperti langkah kaki, desau angin dedaunan, gemerisik pohon, ketukan pintu) WAJIB terlihat aksi fisik penyebabnya secara nyata di layar pada detik tersebut! DILARANG KERAS memunculkan suara foley fiktif yang aksinya tidak ada di video.
5. FRAME BOUNDARY HAND-OFF (KONSISTENSI SAMBUNGAN KLIP):
   - Setiap adegan (terutama adegan 2 ke atas) WAJIB mencantumkan "startingFrame" yang menyambung persis dari posisi akhir (endingFrame) adegan sebelumnya, sehingga ketika dieksekusi di sesi Gemini atau digabung di CapCut, pergerakannya mengalir mulus tanpa patah (*seamless cut*).

ATURAN NASKAH & PENGETAHUAN LOKASI:
- Jika topik menyebut tempat/produk/properti nyata: masukkan fakta asli lokasi tersebut secara natural dan meyakinkan.
- Gaya bahasa: Alami, mengalir, penuh antusiasme kreator UGC sejati. Hindari bahasa kaku/skripsi formal.
- Berikan penanda intonasi dan jeda napas: [excited], [warm], [curious], [whisper], [pause].

STRUKTUR OUTPUT JSON:
{
  "projectTitle": "string",
  "overview": "string",
  "totalDuration": "${targetDuration}",
  "engineTarget": "${engineTarget}",
  "llmModel": "${llmModel}",
  "pacingMode": "${pacingMode}",
  "hostProfile": {
    "name": "${hostName}",
    "anchorTag": "@character_1",
    "masterCharacterPrompt": "string",
    "negativePrompt": "string"
  },
  "environmentProfile": {
    "name": "Setting & Ambience Anchor",
    "anchorTag": "@setting_1",
    "masterSettingPrompt": "string",
    "negativePrompt": "string"
  },
  "objectProfile": {
    "name": "Hero Object / Product Detail",
    "anchorTag": "@object_1",
    "masterObjectPrompt": "string"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "timeRange": "00:00 - 00:10",
      "stageName": "string",
      "rollType": "A-Roll atau B-Roll",
      "startingFrame": "string (Pose awal yang menyambung adegan sebelumnya)",
      "endingFrame": "string (Pose akhir sebagai titik sambung ke adegan berikutnya)",
      "lightingAnchor": "string (Tata cahaya konsisten)",
      "voiceoverScriptId": "string (Wajib patuhi ${pacingMode === "fast" ? "24-28 kata" : "14-18 kata"})",
      "cameraDirective": "string (/camera command atau instruksi framing)",
      "flowVisualPrompt": "string (Prompt visual hiper-sinkron dengan referensi @setting_X)",
      "audioSoundscapePrompt": "string (Sound effect foley yang sinkron persis dengan aksi visual)",
      "keyVisualBeat": "string",
      "capcutEditNote": "string (Rekomendasi titik potong di CapCut)",
      "settingRefTag": "@setting_1",
      "characterRefTag": "@character_1",
      "objectRefTag": "@object_1"
    }
  ],
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "Part 1 (Sesi 1): Topik Bagian 1",
      "duration": "Maksimal 40 Detik (4 Klip)",
      "sessionAdvice": "Jalankan 4 klip ini di Sesi Gemini 1 sampai tuntas.",
      "sceneIndices": [0, 1, 2, 3]
    }
  ],
  "capcutAssemblyGuide": [
    "Langkah 1: ...",
    "Langkah 2: ..."
  ],
  "geminiChainPrompts": [
    "Prompt Klip 1...",
    "Prompt Klip 2..."
  ],
  "engineDirectPrompt": "string"
}`;

    const userPromptContent = `TOPIK: "${topic}"
DURASI: ${targetDuration}
ENGINE TARGET: ${engineTarget} (${llmModel})
PACING: ${pacingMode.toUpperCase()} (${pacingMode === "fast" ? "24–28 kata/adegan" : "14–18 kata/adegan"})
GENRE: ${styleGenre}
HOST: ${hostName} (${hostVisualPrompt})

FOTO REFERENSI TERLAMPIR:
- Karakter: ${normalizedCharacters.length} foto (${normalizedCharacters.map((c, i) => `@character_${i + 1}: ${c.label || "Host"}`).join(", ") || "Tidak ada"})
- Produk: ${normalizedObjects.length} foto (${normalizedObjects.map((o, i) => `@object_${i + 1}: ${o.label || "Objek"}`).join(", ") || "Tidak ada"})
- Ruangan/Environment: ${normalizedEnvironments.length} foto (${normalizedEnvironments.map((e, i) => `@setting_${i + 1}: ${e.label || "Ruangan"}`).join(", ") || "Tidak ada"})

PILIHAN KLARIFIKASI KREATOR:
${clarificationSummary}

Hasilkan JSON produksi utuh sekarang.`;

    if (apiKeys.length > 0) {
      for (const apiKey of apiKeys) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const userParts: any[] = [];

          // Attach multi-character images
          normalizedCharacters.forEach((char, idx) => {
            const cleanBase64 = char.url.replace(/^data:[^;]+;base64,/, "");
            const mimeMatch = char.url.match(/^data:([^;]+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
            userParts.push({
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            });
            userParts.push({
              text: `[FOTO REFERENSI KARAKTER ${idx + 1}: @character_${idx + 1} (${char.label || "Host"})]: Kunci ciri wajah, rambut, dan busana karakter ini secara konsisten.`,
            });
          });

          // Attach multi-object images
          normalizedObjects.forEach((obj, idx) => {
            const cleanBase64 = obj.url.replace(/^data:[^;]+;base64,/, "");
            const mimeMatch = obj.url.match(/^data:([^;]+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
            userParts.push({
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            });
            userParts.push({
              text: `[FOTO REFERENSI OBJEK ${idx + 1}: @object_${idx + 1} (${obj.label || "Produk"})]: Kunci bentuk kemasan, label, dan warna produk ini.`,
            });
          });

          // Attach multi-environment images (e.g. 10 property photos)
          normalizedEnvironments.forEach((env, idx) => {
            const cleanBase64 = env.url.replace(/^data:[^;]+;base64,/, "");
            const mimeMatch = env.url.match(/^data:([^;]+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
            userParts.push({
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            });
            userParts.push({
              text: `[FOTO REFERENSI RUANGAN/ENVIRONMENT ${idx + 1}: @setting_${idx + 1} (${env.label || `Area ${idx + 1}`})]: Kunci tata ruang, furnitur jati, dan arsitektur foto ini persis tanpa halusinasi pada adegan yang menggunakan @setting_${idx + 1}.`,
            });
          });

          userParts.push({
            text: userPromptContent,
          });

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              {
                role: "user",
                parts: userParts,
              },
            ],
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json",
              temperature: 0.35,
            },
          });

          const text = response.text || "";
          const parsed = JSON.parse(text);
          if (parsed.scenes && Array.isArray(parsed.scenes)) {
            // Attach sheet arrays and fallback single images
            parsed.characterImages = normalizedCharacters;
            parsed.objectImages = normalizedObjects;
            parsed.environmentImages = normalizedEnvironments;
            parsed.hostImage = normalizedCharacters[0]?.url || hostImage;
            parsed.productImage = normalizedObjects[0]?.url || productImage;
            parsed.settingImage = normalizedEnvironments[0]?.url || settingImage;
            parsed.pacingMode = pacingMode;

            // Hyper-Smart Audio-Visual Causality & Physical Action Lock
            enforceAudioVisualCausality(parsed.scenes, topic);

            // Build Parts if scenes > 4 or if target is longform
            if (parsed.scenes.length > 4 && (!parsed.parts || !Array.isArray(parsed.parts) || parsed.parts.length === 0)) {
              parsed.parts = buildSmartMultiParts(parsed);
            }

            // Populate Gemini Chain Prompts
            parsed.clipMode = clipMode;
            parsed.geminiChainPrompts = buildGeminiChainPrompts({ ...parsed, clipMode });

            // Populate CapCut Assembly Guide
            if (!parsed.capcutAssemblyGuide || !Array.isArray(parsed.capcutAssemblyGuide) || parsed.capcutAssemblyGuide.length === 0) {
              parsed.capcutAssemblyGuide = buildCapcutAssemblyGuide(parsed);
            }

            // Master Direct Prompt
            if (!parsed.engineDirectPrompt || parsed.engineDirectPrompt.length < 80) {
              parsed.engineDirectPrompt = buildEngineDirectPrompt(parsed, topic, hostName, engineTarget, llmModel);
            }

            return NextResponse.json({ success: true, data: parsed, engine: "gemini-3.5-flash" });
          }
        } catch (geminiErr) {
          console.warn("Gemini key attempt failed, trying next key:", geminiErr);
        }
      }
    }

    // High-End Clean Fallback
    const fallbackData: any = generateCleanStudioFallback({
      topic,
      targetDuration,
      engineTarget,
      llmModel,
      styleGenre,
      hostName,
      hostVisualPrompt,
      sceneCount,
      durPerScene,
      pacingMode,
      clarificationAnswers,
      characterImages: normalizedCharacters,
      objectImages: normalizedObjects,
      environmentImages: normalizedEnvironments,
      hostImage: normalizedCharacters[0]?.url || hostImage,
      productImage: normalizedObjects[0]?.url || productImage,
      settingImage: normalizedEnvironments[0]?.url || settingImage,
    });

    fallbackData.characterImages = normalizedCharacters;
    fallbackData.objectImages = normalizedObjects;
    fallbackData.environmentImages = normalizedEnvironments;
    fallbackData.hostImage = normalizedCharacters[0]?.url || hostImage;
    fallbackData.productImage = normalizedObjects[0]?.url || productImage;
    fallbackData.settingImage = normalizedEnvironments[0]?.url || settingImage;
    fallbackData.pacingMode = pacingMode;

    enforceAudioVisualCausality(fallbackData.scenes, topic);

    return NextResponse.json({ success: true, data: fallbackData, engine: "director-clean-base" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * Splits scenes > 4 into 2 connected parts/topics (max 40s each)
 */
function buildSmartMultiParts(data: any): VideoPart[] {
  const scenes: UgcScene[] = data.scenes || [];
  const projectTitle = data.projectTitle || "Proyek UGC";

  if (scenes.length <= 4) {
    return [
      {
        partNumber: 1,
        partTitle: `Part 1 (Sesi 1): ${projectTitle} (Tuntas 40 Detik)`,
        duration: "Maksimal 40 Detik (4 Klip @ 10s)",
        sessionAdvice: "Jalankan 4 klip ini dalam 1 sesi Gemini sampai selesai 100% tanpa kena batas kuota 5 jam.",
        sceneIndices: scenes.map((_, i) => i),
        chainPrompts: buildGeminiChainPrompts({ ...data, scenes }),
      },
    ];
  }

  // Split into Part 1 (first 4 scenes) and Part 2 (scenes 4..min(8, scenes.length))
  const part1Scenes = scenes.slice(0, 4);
  const part2Scenes = scenes.slice(4, Math.min(8, scenes.length));

  return [
    {
      partNumber: 1,
      partTitle: `Part 1 (Topik 1 / Sesi 1): Hook & Eksplorasi Utama (Maks 40s)`,
      duration: "Maksimal 40 Detik (4 Klip @ 10s)",
      sessionAdvice: "Eksekusi Klip 1 s/d 4 di Sesi Gemini 1. Klip ke-4 diakhiri dengan cliffhanger memikat penonton ke Part 2.",
      sceneIndices: [0, 1, 2, 3],
      chainPrompts: buildGeminiChainPrompts({ ...data, scenes: part1Scenes, partNumber: 1 }),
    },
    {
      partNumber: 2,
      partTitle: `Part 2 (Topik 2 / Sesi 2): Area Rahasia & Potensi Cuan (Maks 40s)`,
      duration: "Maksimal 40 Detik (4 Klip @ 10s)",
      sessionAdvice: "Buka chat sesi Gemini baru (atau setelah jeda kuota) untuk mengeksekusi Klip 5 s/d 8 sampai Call to Action tuntas.",
      sceneIndices: [4, 5, 6, 7].slice(0, part2Scenes.length),
      chainPrompts: buildGeminiChainPrompts({ ...data, scenes: part2Scenes, partNumber: 2, offset: 4 }),
    },
  ];
}

/**
 * Builds sequential prompts for Gemini chat conversation thread
 * Includes explicit reference photo mapping, 10-second duration, and pacing details.
 */
function buildGeminiChainPrompts(data: any): string[] {
  const scenes: UgcScene[] = data.scenes || [];
  const projectTitle = data.projectTitle || "Proyek UGC";
  const pacingMode: PacingMode = data.pacingMode || "normal";
  const clipMode: "isolated" | "chained" = data.clipMode || "isolated";
  const envImages: SheetImageItem[] = data.environmentImages || [];
  const charImages: SheetImageItem[] = data.characterImages || [];
  const objImages: SheetImageItem[] = data.objectImages || [];
  const partNumber: number | undefined = data.partNumber;
  const offset: number = data.offset || 0;

  return scenes.map((s: UgcScene, idx: number) => {
    const globalIdx = offset + idx;
    const isFirstClipInSession = idx === 0;

    // Setting mapping badge
    const settingIndex = envImages.length > 0 ? (globalIdx % envImages.length) + 1 : 1;
    const settingLabel = envImages.length > 0 ? envImages[settingIndex - 1]?.label || `Area ${settingIndex}` : "Ruangan Nyata";
    const settingDirective = envImages.length > 0
      ? `* Latar / Ruangan: Gunakan [FOTO RUANGAN ${settingIndex}: @setting_${settingIndex} (${settingLabel})]. Kunci arsitektur, ukuran, dan kondisi asli foto ini 100% persis tanpa halusinasi.`
      : `* Latar / Ruangan: @setting_1 (Kunci tata letak, ukuran, dan tata cahaya identik dengan foto asli).`;

    // Character mapping badge
    const charIndex = charImages.length > 0 ? (globalIdx % charImages.length) + 1 : 1;
    const charLabel = charImages.length > 0 ? charImages[charIndex - 1]?.label || `Host ${charIndex}` : "Host Kreator";
    const charDirective = charImages.length > 0
      ? `* Karakter Host: Gunakan [FOTO HOST ${charIndex}: @character_${charIndex} (${charLabel})]. Kunci wajah, hijab/rambut, dan pakaian.`
      : `* Karakter Host: @character_1 (Wajah dan busana konsisten 100%).`;

    // Object mapping badge
    const objDirective = objImages.length > 0
      ? `* Objek / Produk: Gunakan [FOTO PRODUK 1: @object_1 (${objImages[0]?.label || "Hero Object"})]. Kunci warna dan kemasan.`
      : `* Objek / Produk: @object_1 konsisten.`;

    const pacingWordLimit = pacingMode === "fast" ? "24–28 kata (Tempo Cepat / Padat TikTok)" : "14–18 kata (Tempo Normal / Artikulatif)";

    // ISOLATED / MODULAR GENERATION MODE (ANTI-STALL ON CLIP 3)
    if (clipMode === "isolated") {
      return `=== KLIP ${globalIdx + 1}: ${s.stageName.toUpperCase()} (${s.timeRange}) [STANDALONE / TERISOLASI] ===
Format: Video 10 Detik Mandiri (Anti-Macet • Gabung di CapCut)
Proyek: ${projectTitle}
Pacing Naskah: ${pacingWordLimit}

[GUARDRAIL REALITAS & ANTI-HALUSINASI (ZERO CATFISH / STRICT PHOTO FIDELITY)]:
- STRICT GROUNDED REALITY: Replikasi 100% arsitektur, bentuk bangunan asli, material lantai/dinding, dan kondisi lingkungan persis seperti foto referensi (@setting_${settingIndex}).
- DILARANG MENGARANG: Dilarang menambahkan pilar istana Romawi, kolam renang palsu, marmer mewah fiktif, taman Eropa palsu, atau mengubah rumah sederhana/asri menjadi istana mewah! Calon pembeli yang datang ke lokasi tidak boleh merasa tertipu video.
- TEKNIK SINEMATIK RESMI: Buat video indah murni melalui variasi kamera sinematik (Ken Burns subtle zoom in/out, smooth eye-level gimbal glide, dynamic parallax) dan tata cahaya alami (soft morning sunlight / golden hour glow) pada aset yang BENAR-BENAR ADA di foto!
  ${charDirective}
  ${settingDirective}
  ${objDirective}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight, 45-degree key light"} di seluruh adegan.
- Aksi Fisik Nyata: Efek suara foley wajib terlihat aksi fisiknya di layar (zero phantom sound).
- Batas Durasi: 10 Detik pas. Penggabungan mulus dilakukan di timeline CapCut.

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP ${globalIdx + 1}]:
${s.flowVisualPrompt}

[NASKAH DIALOG (${pacingWordLimit})]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX (ACTION-COUPLED)]:
${s.audioSoundscapePrompt}

[CATATAN EDIT CAPCUT]:
${s.capcutEditNote || "Potong halus 0.2 detik awal/akhir dan gabungkan langsung (hard cut) di CapCut."}`;
    }

    if (isFirstClipInSession) {
      return `=== KLIP ${globalIdx + 1}: ${s.stageName.toUpperCase()} (${s.timeRange}) ===
Format: Video 10 Detik ${partNumber ? `(Sesi Part ${partNumber} Gemini)` : "(Gemini 40s Session Pass)"}
Proyek: ${projectTitle}
Pacing Naskah: ${pacingWordLimit}

[GUARDRAIL REALITAS & MEMORI KONSISTENSI GEMINI (ANTI-CATFISH)]:
- STRICT GROUNDED REALITY: Replikasi 100% kondisi fisik dari foto referensi yang terlampir. DILARANG menambahkan pilar Romawi, kolam renang, atau ornamen istana fiktif!
- Gunakan foto referensi yang terlampir di chat ini:
  ${charDirective}
  ${settingDirective}
  ${objDirective}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight, 45-degree key light"} di seluruh adegan.
- Kausallitas Nyata: Efek suara foley wajib ada aksi fisik penyebabnya di layar (zero phantom sound).
- Batas Durasi: 10 Detik pas agar selesai dalam 1 sesi 40 detik.

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP ${globalIdx + 1}]:
${s.flowVisualPrompt}

[NASKAH DIALOG (${pacingWordLimit})]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX]:
${s.audioSoundscapePrompt}

[ENDING POSE TITIK SAMBUNG]:
${s.endingFrame || "@character_1 menyelesaikan pengantar dengan gestur mengarahkan kamera ke adegan berikutnya."}`;
    }

    return `=== KLIP ${globalIdx + 1}: ${s.stageName.toUpperCase()} (${s.timeRange}) ===
Format: Video 10 Detik (Sambungan Langsung di Sesi Gemini yang Sama)
Pacing Naskah: ${pacingWordLimit}

[INSTRUKSI SAMBUNGAN GEMINI (FRAME BOUNDARY HAND-OFF & ZERO CATFISH)]:
- Lanjutkan video sebelumnya di dalam satu utas percakapan ini.
- JANGAN UBAH WAJAH, RAMBUT/HIJAB, ATAU BAJU KARAKTER.
- STRICT GROUNDED REALITY: Pertahankan arsitektur asli foto @setting_${settingIndex} tanpa menambah elemen mewah palsu.
  ${settingDirective}
- Starting Frame: ${s.startingFrame || `Melanjutkan persis dari frame terakhir Klip ${globalIdx} tanpa jeda.`}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight"} identik dengan klip sebelumnya.

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP ${globalIdx + 1}]:
${s.flowVisualPrompt}

[NASKAH DIALOG (${pacingWordLimit})]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX (ZERO PHANTOM)]:
${s.audioSoundscapePrompt}

[ENDING POSE TITIK SAMBUNG]:
${s.endingFrame || "@character_1 menyelesaikan aksi dengan ekspresi puas dan bersiap untuk adegan selanjutnya."}`;
  });
}

function buildCapcutAssemblyGuide(data: any): string[] {
  const scenes = data.scenes || [];
  const hasParts = Boolean(data.parts && data.parts.length > 1);

  return [
    `LANGKAH 1: PERSIAPAN MEDIA DI CAPCUT
- Buka aplikasi CapCut (Desktop atau Mobile).
- Buat proyek baru dan impor seluruh file video hasil unduhan dari Gemini (Klip 1 s/d Klip ${scenes.length}).
- Atur rasio kanvas: 9:16 (untuk TikTok/Shorts/Reels) atau 16:9 (untuk YouTube horizontal).`,

    `LANGKAH 2: PENATAAN TIMELINE ${hasParts ? "(MULTI-PART 40S FLOW)" : "(URUTAN KONTINUITAS)"}
- Susun klip di timeline utama secara berurutan: Klip 1 -> Klip 2 -> Klip 3 -> ... -> Klip ${scenes.length}.
${hasParts ? "- Part 1 (Klip 1–4): Potong klip ke-4 tepat di cliffhanger untuk dijadikan Video 1 di TikTok/Reels.\n- Part 2 (Klip 5–8): Gunakan sebagai kelanjutan Video Part 2 untuk menggandakan view & retensi profil." : "- Gunakan sambungan langsung (hard cut) antar klip tanpa efek transisi berlebihan agar kesan UGC alami tetap terjaga."}`,

    `LANGKAH 3: PEMOTONGAN CEPAT (TRIMMING DENGAN METODE J-CUT / L-CUT)
- Potong sekitar 0.2 hingga 0.4 detik pada awal atau akhir setiap klip jika ada bagian yang gerakannya lambat sebelum aksi dimulai.
- Hubungkan naskah bicara agar ritme napas antar adegan terasa gesit dan tidak ada momen hening ('dead air').`,

    `LANGKAH 4: SPEED RAMP & SINEMATIK B-ROLL
- Untuk adegan detail ruangan jati, fasad, atau produk: ubah kecepatan (Speed) menjadi 0.8x dengan opsi 'Smooth Optical Flow' untuk memberi kesan visual mewah layaknya iklan TV komersial.`,

    `LANGKAH 5: SINKRONISASI SOUND EFFECT & TEKS OTOMATIS
- Tarik sound effect foley tepat di bawah frame tempat aksi fisik terjadi di layar (100% sinkron).
- Gunakan fitur 'Auto Captions' (Teks Otomatis) bahasa Indonesia di CapCut, pilih template teks animasi satu-per-satu kata (Word-by-word) dengan highlight warna kuning/oranye untuk memaksimalkan retensi penonton!`
  ];
}

function buildEngineDirectPrompt(parsed: any, topic: string, hostName: string, engineTarget: string, llmModel: string): string {
  const isLlmNative = engineTarget === "llm-native";
  if (isLlmNative) {
    return (
      `=== MASTER PROMPT UGC LENGKAP SIAP PAKAI KE ${llmModel.toUpperCase()} ===\n\nTopik: ${parsed.projectTitle || topic}\nDurasi Total: ${parsed.totalDuration} (${parsed.scenes.length} Adegan @ 10s)\nHost: ${parsed.hostProfile?.name || hostName}\nPacing: ${parsed.pacingMode === "fast" ? "Cepat (24–28 kata/adegan)" : "Normal (14–18 kata/adegan)"}\n\n[GUARDRAIL REALITAS & ANTI-CATFISH]: Seluruh adegan WAJIB mereplikasi 100% arsitektur dan kondisi fisik foto referensi (@setting_X). DILARANG menambahkan pilar Romawi, kolam renang, atau ornamen mewah palsu. Keindahan sinematik dihasilkan lewat Ken Burns push/pull, gimbal tracking, dan pencahayaan alami.\n\n[ATURAN SINKRONISASI MUTLAK]: Seluruh efek suara foley WAJIB terlihat aksi fisiknya secara nyata di layar.\n\nDAFTAR ADEGAN & NASKAH LENGKAP:\n` +
      parsed.scenes
        .map(
          (s: any) =>
            `[Adegan ${s.sceneNumber} (${s.timeRange || ""}) - ${s.stageName || ""}]\n- Setting Ref: ${s.settingRefTag || "@setting_1"}\n- Naskah Dialog: "${s.voiceoverScriptId}"\n- Arahan Kamera: ${s.cameraDirective}\n- Visual Prompt: ${s.flowVisualPrompt}\n- Soundscape: ${s.audioSoundscapePrompt}`
        )
        .join("\n\n")
    );
  }

  if (engineTarget === "google-flow") {
    return (
      `=== MASTER PROMPT GOOGLE FLOW (VEO 3.1 / GEMINI OMNI FLASH) ===\n\n` +
      `Proyek: ${parsed.projectTitle || topic}\n` +
      `Karakter: ${parsed.hostProfile?.name || hostName} (@character_1)\n` +
      `Durasi Total: ${parsed.totalDuration} (${parsed.scenes.length} Shots)\n\n` +
      `[PANDUAN EKSEKUSI DI GOOGLE FLOW]:\n` +
      `- Buka Google Flow (https://flow.google)\n` +
      `- Buat canvas/timeline project baru\n` +
      `- Unggah foto referensi di Asset Manager (@character_1 untuk Host, @setting_1 untuk Ruangan/Properti)\n` +
      `- Tempelkan prompt per Shot di bawah ini ke masing-masing shot card/node\n` +
      `- Bebas batasan kuota chat, render langsung seluruh shot secara konsisten!\n\n` +
      `==================================================\n` +
      `URUTAN SHOT & PROMPT GOOGLE FLOW:\n` +
      `==================================================\n\n` +
      parsed.scenes
        .map(
          (s: any) =>
            `--- SHOT ${s.sceneNumber}: ${(s.stageName || "").toUpperCase()} (${s.timeRange || ""}) ---\n` +
            `[CAMERA & SLASH COMMAND]:\n` +
            `${(s.cameraDirective || "").startsWith("/") ? s.cameraDirective : `/camera ${s.cameraDirective || "handheld medium shot"}`}\n\n` +
            `[MASTER VISUAL PROMPT (GOOGLE FLOW)]:\n` +
            `${s.flowVisualPrompt}\n\n` +
            `[SPOKEN DIALOGUE]:\n` +
            `"${s.voiceoverScriptId}"\n\n` +
            `[SOUNDSCAPE & SFX (ACTION-COUPLED)]:\n` +
            `${s.audioSoundscapePrompt}`
        )
        .join("\n\n--------------------------------------------------\n\n")
    );
  }

  return (
    `=== MASTER PROMPT ${engineTarget.toUpperCase()} ===\n\nTopik: ${parsed.projectTitle || topic}\nKarakter: ${parsed.hostProfile?.name || hostName}\nDurasi Total: ${parsed.totalDuration}\n\n[ATURAN SINKRONISASI MUTLAK]: Zero Phantom SFX. Aksi visual fisik harus sinkron 100% dengan soundscape foley.\n\nURUTAN ADEGAN:\n` +
    parsed.scenes
      .map(
        (s: any) =>
          `[Shot ${s.sceneNumber} (${s.timeRange || ""}) - ${s.stageName || ""}]:\n- Visual Prompt: ${s.flowVisualPrompt}\n- Arahan Kamera: ${s.cameraDirective}\n- Dialog: "${s.voiceoverScriptId}"\n- Soundscape: ${s.audioSoundscapePrompt}`
      )
      .join("\n\n")
  );
}

/**
 * Fallback Studio Generator
 */
function generateCleanStudioFallback(params: any) {
  const {
    topic,
    targetDuration,
    engineTarget,
    llmModel,
    styleGenre,
    hostName,
    hostVisualPrompt,
    sceneCount,
    durPerScene,
    pacingMode,
    clarificationAnswers,
    environmentImages = [],
  } = params;

  const lensLighting = clarificationAnswers.visualLensAndLighting || "Natural Warm Daylight";
  const heroObject = clarificationAnswers.heroObjectOrFeature || "NONE: Tidak Ada Objek Terkunci";
  const isNoneObject = heroObject.includes("NONE");
  const isFood = /kentang|kue|snack|makan|food|crispy|renyah|krispi|goreng|kuliner|fries/i.test(topic);
  const isProperty = /rumah|kos|properti|tanah|villa|mansion|apartemen|kost|lantai/i.test(topic) || styleGenre === "house-tour";

  // Dynamic Fact Extractor to prevent any template hallucination
  const extractPropertyFacts = (text: string) => {
    let location = "kawasan strategis";
    if (/pondok\s*cabe|tangsel|pamulang|tangerang\s*selatan/i.test(text)) {
      location = "Pondok Cabe, Tangerang Selatan";
    } else if (/cakung|pulo\s*gebang/i.test(text)) {
      location = "Cakung, Jakarta Timur";
    } else {
      const locMatch = text.match(/#(tangsel|pondokcabe|jakarta\w*|bogor|depok|tangerang\w*|bekasi|bandung|surabaya|bali|jogja|semarang)/gi) ||
                       text.match(/(?:di|daerah|wilayah|lokasi)\s+([A-Z][a-zA-Z\s]{2,20})/i);
      if (locMatch) {
        location = locMatch[0].replace(/#/g, "").replace(/(?:di|daerah|wilayah|lokasi)\s+/i, "").trim();
      }
    }

    // Land area: prioritize "luas tanah" or "LT", otherwise match m2/m² (skip plain "meter" like 100 meter flyover)
    let landArea = "tanah luas";
    const ltMatch = text.match(/(?:luas\s*tanah|lt\.?)\s*(?:adalah|sebesar|:)?\s*(\d+[\.,]?\d*)\s*(?:m2|m²|meter\s*persegi)?/i);
    if (ltMatch) {
      landArea = ltMatch[1] + " m²";
    } else {
      const areaMatch = text.match(/(\d+[\.,]?\d*)\s*(?:m2|m²|meter\s*persegi)/i);
      if (areaMatch) landArea = areaMatch[1] + " m²";
    }

    const proximityItems: string[] = [];
    if (/kampus\s*ut|universitas\s*terbuka/i.test(text)) proximityItems.push("1 km dari Kampus Universitas Terbuka");
    if (/flyover/i.test(text)) proximityItems.push("100 meter dari Flyover");
    if (/tol|jorr/i.test(text)) proximityItems.push("1 km dari gerbang Tol JORR Pamulang-Depok");
    if (/walikota/i.test(text)) proximityItems.push("dekat Kantor Walikota");
    if (/stasiun|terminal/i.test(text)) proximityItems.push("dekat terminal bis terpadu");
    const proximityText = proximityItems.length > 0 ? proximityItems.join(", ") : "akses jalan 2 mobil bebas banjir";

    let specialFeature = "lingkungan asri & bangunan kokoh";
    if (/durian|alpokat|kebun|tanaman|rimpang/i.test(text)) {
      specialFeature = "halaman belakang kebun luas dengan aneka pohon buah produktif seperti durian dan alpokat";
    } else if (/kos|kost/i.test(text)) {
      specialFeature = "area kos-kosan aktif berpotensi passive income";
    } else if (/jati/i.test(text)) {
      specialFeature = "interior full kayu jati Grade A";
    }

    // Price: look for Rp or Milyar/Juta specifically
    let priceText = "harga terbaik";
    const priceMatch = text.match(/rp\.?\s*(\d+[\.,]?\d*)\s*(?:milyar|miliar|jt|juta|m\b)?/i)
      || text.match(/(\d+[\.,]?\d*)\s*(?:milyar|miliar)/i);
    if (priceMatch) {
      const num = priceMatch[1] || priceMatch[0].match(/\d+/)?.[0] || "";
      const isMiliar = /milyar|miliar|m\b/i.test(priceMatch[0]) || /milyar|miliar/i.test(text.slice(text.indexOf(num)));
      priceText = "Rp " + num + (isMiliar ? " Miliar" : "");
    }

    return {
      location,
      landArea,
      proximityText,
      specialFeature,
      priceText,
    };
  };

  const propFacts = extractPropertyFacts(topic);
  const scenes: UgcScene[] = [];

  // Pacing script generator helper
  const getScript = (normalText: string, fastText: string) => {
    return pacingMode === "fast" ? fastText : normalText;
  };

  if (targetDuration === "<=10s") {
    scenes.push({
      sceneNumber: 1,
      timeRange: "00:00 - 00:10",
      stageName: "10-SECOND VIRAL HOOK & REVEAL",
      rollType: "A-Roll",
      startingFrame: "@character_1 standing ready in front of camera with @object_1",
      endingFrame: "@character_1 gives a confident, delighted smile with thumbs up",
      lightingAnchor: lensLighting,
      voiceoverScriptId: isProperty
        ? getScript(
            `[excited] Cari rumah idaman di ${propFacts.location}? [pause] Halaman luas ${propFacts.landArea} dengan ${propFacts.specialFeature}!`,
            `[excited] Cari hunian asri di ${propFacts.location}? [pause] Rumah luas ${propFacts.landArea} ini super strategis cuma ${propFacts.proximityText} dan ditawarkan ${propFacts.priceText}!`
          )
        : isFood
        ? getScript(
            "[excited] Sumpah ini rahasianya! [pause] Cukup taburan maizena tipis sebelum digoreng, dijamin renyah tahan seharian!",
            "[excited] Jangan goreng kentang sebelum tahu trik ini! [pause] Cukup taburin maizena tipis merata sebelum masuk minyak panas, hasilnya super garing tahan renyah sampai malam!"
          )
        : getScript(
            `[excited] Kalau kalian lagi cari ${topic || "solusi terbaik"}, [pause] jujur ini bener-bener wajib dicoba!`,
            `[excited] Kalau kalian lagi cari ${topic || "solusi terbaik"}, [pause] ini bener-bener terbukti menghemat waktu dan hasilnya langsung terasa memuaskan sejak hari pertama dicoba!`
          ),
      cameraDirective: "Dynamic macro push-in 35mm to eye-level / soft ambient rim light",
      flowVisualPrompt: isProperty
        ? `@character_1 stands in front of @setting_1, pointing towards the property in ${propFacts.location}, warm daylight, crisp 4K fidelity.`
        : "@character_1 hooks audience looking directly into camera with engaging smile.",
      audioSoundscapePrompt: "Crisp clean vocal, subtle warm room ambience, light modern acoustic guitar chord swell.",
      keyVisualBeat: "Klip singkat 10 detik langsung memikat dengan ekspresi autentik.",
      capcutEditNote: "Potong 0.2 detik awal agar hook langsung dimulai tanpa jeda.",
      settingRefTag: "@setting_1",
      characterRefTag: "@character_1",
      objectRefTag: "@object_1",
    });
  } else {
    // 4 Scenes (for <=40s / gemini-40s) or 8 Scenes (for multi-part)
    const propertyTemplates = [
      {
        stage: "HOOK & FASAD PROPERTI ASLI",
        roll: "A-Roll",
        normal: `[excited] Cari tanah ${propFacts.landArea} di ${propFacts.location}? [pause] Halaman luas dengan akses jalan dua mobil!`,
        fast: `[excited] Siapa sangka di ${propFacts.location} masih ada properti seluas ${propFacts.landArea}? [pause] Suasananya adem, jalan depan 2 mobil, dan lokasinya super strategis!`,
        cam: "Cinematic Ken Burns slow push-in 35mm from front gate / driveway towards @character_1 at eye-level",
        visual: "@character_1 stands naturally in the front yard of the authentic residential house as shown in @setting_1, gesturing politely to the camera. Exact architectural match to @setting_1, natural morning daylight, realistic pavement texture, zero fake luxury additions.",
        settingTag: "@setting_1",
      },
      {
        stage: "EKSPLORASI RUANG & BANGUNAN ASLI",
        roll: "B-Roll",
        normal: `[warm] Bangunan permanen terawat, [pause] plus ${propFacts.specialFeature} yang super adem!`,
        fast: `[warm] Masuk ke dalam, bangunannya permanen dan nyaman dihuni. [pause] Ditambah ${propFacts.specialFeature}, pas banget buat hunian keluarga yang tenang!`,
        cam: "Smooth eye-level gimbal pan and slow drift zoom across the living area @setting_2",
        visual: "Smooth cinematic gimbal glide through the authentic interior room @setting_2, showcasing real furniture and natural tile flooring with soft morning sunlight streaming in, 100% faithful to @setting_2 reference photo.",
        settingTag: "@setting_2",
      },
      {
        stage: "KEBUN BELAKANG ASRI & AKSES LOKASI",
        roll: "B-Roll / A-Roll",
        normal: `[warm] Halaman belakang kebun buah luas, [pause] posisinya cuma ${propFacts.proximityText}!`,
        fast: `[warm] Yang paling istimewa halaman belakangnya super luas penuh pepohonan buah! [pause] Aksesnya strategis cuma ${propFacts.proximityText}!`,
        cam: "Low-angle tracking shot gliding gently across lush green lawn with tropical fruit trees @setting_3",
        visual: "Camera glides slowly across the authentic lush green backyard garden @setting_3 with mature fruit trees and natural grass, bathed in warm golden morning light, exact match to @setting_3 reference photo without artificial embellishments.",
        settingTag: "@setting_3",
      },
      {
        stage: "LEGALITAS SHM & CALL TO ACTION",
        roll: "A-Roll",
        normal: `[excited] Legalitas aman sertifikat SHM, ditawarkan ${propFacts.priceText}. [pause] Yuk survey sekarang!`,
        fast: `[excited] Legalitas aman sertifikat sudah SHM lengkap, harga ${propFacts.priceText} nego sampai jadi! [pause] Hubungi kami sekarang dan jadwalkan survey minggu ini!`,
        cam: "Subtle Ken Burns push-in 50mm portrait shot focusing on @character_1 with welcoming smile",
        visual: "@character_1 stands in the authentic front area @setting_1, giving an inviting warm smile and polite open hand gesture towards the camera, welcoming viewers to visit and survey the property directly.",
        settingTag: "@setting_1",
      },
      // Part 2 Scenes (for 8-scene multi-part)
      {
        stage: "BRIDGE PART 2 & EKSPLORASI DETAIL",
        roll: "A-Roll",
        normal: `[excited] Melanjutkan Part 1, mari kita eksplor lebih dalam! [pause] Ini dia detail keunggulan properti ini!`,
        fast: `[excited] Melanjutkan Part 1! Sekarang kita masuk ke area highlight kedua seluas ${propFacts.landArea} yang bikin properti ini beda dari yang lain!`,
        cam: "Cinematic Ken Burns slow pedestal shot revealing the wider courtyard @setting_4",
        visual: "@character_1 welcomes viewers into the authentic outdoor courtyard @setting_4, exact match to reference photo.",
        settingTag: "@setting_4",
      },
      {
        stage: "POTENSI NILAI INVESTASI & TANAH LUAS",
        roll: "B-Roll",
        normal: `[warm] Nilai tanah terus naik di ${propFacts.location}, [pause] cocok banget buat investasi jangka panjang!`,
        fast: `[warm] Kawasan ${propFacts.location} terus berkembang pesat setiap tahun. [pause] Beli unit ini bukan cuma dapet hunian asri, tapi juga tabungan investasi masa depan yang aman!`,
        cam: "Smooth horizontal tracking shot along the authentic property boundary @setting_4",
        visual: "Smooth tracking across authentic property grounds and trees as shown in @setting_4, realistic natural daylight.",
        settingTag: "@setting_4",
      },
      {
        stage: "FASILITAS SEKITAR & AKSESIBILITAS",
        roll: "A-Roll",
        normal: `[warm] Dekat ke berbagai fasilitas penting: [pause] ${propFacts.proximityText}!`,
        fast: `[warm] Dari pusat pendidikan sampai tol cuma hitungan menit: [pause] ${propFacts.proximityText}! Benar-benar memudahkan mobilitas harian Anda!`,
        cam: "Medium portrait 50mm / warm natural daylight with authentic property background",
        visual: "@character_1 explains with confident posture in front of @setting_1, faithful to real property.",
        settingTag: "@setting_1",
      },
      {
        stage: "CALL TO ACTION FINAL & KONTAK",
        roll: "A-Roll",
        normal: `[excited] Unit langka dengan harga ${propFacts.priceText}. [pause] Jangan sampai keduluan, hubungi sekarang!`,
        fast: `[excited] Kesempatan emas memiliki properti ${propFacts.landArea} di ${propFacts.location} dengan harga ${propFacts.priceText}! [pause] Langsung hubungi kami untuk info detail dan survey lokasi!`,
        cam: "Slow tracking in 35mm to confident inviting closing smile",
        visual: "@character_1 gives an inviting gesture with friendly smile in front of the real property @setting_1.",
        settingTag: "@setting_1",
      },
    ];

    const generalTemplates = [
      {
        stage: "HOOK & SETUP ANCHOR",
        roll: "A-Roll",
        normal: `[excited] Kalau kalian mau hasil yang maksimal buat ${topic || "kebutuhan ini"}, [pause] wajib tahu trik simpel ini!`,
        fast: `[excited] Mau tahu cara tercepat bikin ${topic || "hasil memukau"} tanpa ribet? [pause] Trik simpel ini udah terbukti bikin hasilnya konsisten dan jauh lebih efektif!`,
        cam: "Medium close-up 35mm handheld eye-level / smooth creator motion",
        visual: `@character_1 stands in @setting_1, looking directly into camera with high engagement, holding @object_1.`,
        settingTag: "@setting_1",
      },
      {
        stage: "AGITATION & REVEAL",
        roll: "A-Roll",
        normal: `[warm] Masalahnya seringkali kita salah langkah di awal. [pause] Padahal solusinya cuma ada di sini!`,
        fast: `[warm] Kebanyakan orang sering gagal karena salah paham di langkah pertama. [pause] Padahal rahasia utamanya cuma ada di formulasi presisi yang satu ini!`,
        cam: "Slow push-in 50mm portrait / shallow depth of field",
        visual: `@character_1 gestures towards @object_1, speaking warmly with natural expressions.`,
        settingTag: "@setting_2",
      },
      {
        stage: "HERO DEMO & B-ROLL",
        roll: "B-Roll",
        normal: `[curious] Perhatiin deh detail dan presisinya pas dipakai. [pause] Bener-bener beda kelas!`,
        fast: `[curious] Perhatiin detail tekstur dan responsnya pas diaplikasikan langsung. [pause] Kualitas materialnya kerasa banget beda kelasnya dibanding yang biasa!`,
        cam: "Macro 85mm close-up / slow tilt-down over details",
        visual: `Extreme macro close-up of @object_1 in @setting_1, showcasing pristine craftsmanship and texture.`,
        settingTag: "@setting_1",
      },
      {
        stage: "CALL TO ACTION / PART 1 CLIFFHANGER",
        roll: "A-Roll",
        normal: `[excited] Buruan cek link di bio sebelum kehabisan ya guys! [pause] Rasain sendiri bedanya!`,
        fast: `[excited] Penasaran sama hasil tes lanjutannya? [pause] Jangan lupa like, share, dan lanjut tonton video Part 2 sekarang juga buat lihat pembuktian lengkapnya!`,
        cam: "Medium shot 35mm / gentle tracking out to eye-level",
        visual: `@character_1 points warmly towards camera with an enthusiastic smile.`,
        settingTag: "@setting_1",
      },
      // Scenes 5-8 if needed
      {
        stage: "BRIDGE PART 2 & DEEPER REVEAL",
        roll: "A-Roll",
        normal: `[excited] Melanjutkan video sebelumnya, sekarang kita kupas tuntas [pause] fitur tersembunyi yang bikin takjub!`,
        fast: `[excited] Sesuai janji di Part 1, sekarang kita langsung bedah fitur rahasianya! [pause] Bagian ini yang paling banyak bikin orang kaget karena efisiensinya luar biasa!`,
        cam: "Medium 50mm eye-level handheld",
        visual: `@character_1 reintroduces the topic with energetic welcoming posture.`,
        settingTag: "@setting_2",
      },
      {
        stage: "SENSORY PROOF & TESTING",
        roll: "B-Roll",
        normal: `[pause] Dengerin dan perhatiin baik-baik pas diuji... [pause] Hasilnya sempurna banget kan?`,
        fast: `[pause] Perhatiin baik-baik reaksi fisiknya pas dites langsung di depan mata. [pause] Bener-bener presisi, tanpa cacat, dan langsung bekerja sesuai ekspektasi!`,
        cam: "Macro 85mm tripod locked shot",
        visual: `@character_1 visibly demonstrates the key functionality with tactile feedback.`,
        settingTag: "@setting_1",
      },
      {
        stage: "TESTIMONI & BENEFIT JANGKA PANJANG",
        roll: "A-Roll",
        normal: `[warm] Ini bukan cuma tren sesaat, [pause] tapi solusi investasi jangka panjang terbaik kalian!`,
        fast: `[warm] Banyak yang udah buktiin kalau ini solusi jangka panjang terbaik buat kalian. [pause] Nggak cuma hemat waktu, tapi juga kasih ketenangan pikiran setiap hari!`,
        cam: "Medium 35mm walking tracking shot",
        visual: `@character_1 walks leisurely in @setting_1 with warm, reliable demeanor.`,
        settingTag: "@setting_2",
      },
      {
        stage: "FINAL CALL TO ACTION",
        roll: "A-Roll",
        normal: `[excited] Langsung cobain sekarang juga sebelum promo berakhir! [pause] Cek link di bio ya!`,
        fast: `[excited] Buruan amankan sekarang juga mumpung slot dan penawarannya masih terbuka! [pause] Langsung klik keranjang kuning atau link di bio sebelum kehabisan ya guys!`,
        cam: "Close-up 50mm to inviting smile with thumbs up",
        visual: `@character_1 smiles warmly, pointing towards the link location.`,
        settingTag: "@setting_1",
      },
    ];

    const templateList = isProperty ? propertyTemplates : generalTemplates;

    for (let i = 0; i < sceneCount; i++) {
      const tmpl = templateList[i % templateList.length];
      const sStart = i * durPerScene;
      const sEnd = (i + 1) * durPerScene;
      const timeRange = `00:${sStart < 10 ? "0" + sStart : sStart} - 00:${sEnd < 10 ? "0" + sEnd : sEnd}`;

      // Mapping setting tag based on uploaded environment photos
      let actualSettingTag = tmpl.settingTag;
      if (environmentImages.length > 0) {
        const envIdx = (i % environmentImages.length) + 1;
        actualSettingTag = `@setting_${envIdx}`;
      }

      scenes.push({
        sceneNumber: i + 1,
        timeRange,
        stageName: tmpl.stage,
        rollType: tmpl.roll,
        startingFrame: i === 0
          ? "@character_1 standing facing the camera in full focus"
          : `Continues seamlessly from Scene ${i} ending position without cut`,
        endingFrame: `@character_1 completes action with natural posture preparing for next beat`,
        lightingAnchor: lensLighting,
        voiceoverScriptId: getScript(tmpl.normal, tmpl.fast),
        cameraDirective: tmpl.cam,
        flowVisualPrompt: tmpl.visual.replace(/@setting_1/g, actualSettingTag),
        audioSoundscapePrompt: "Clear articulated vocal, warm room acoustic, subtle engaging pop sound effect.",
        keyVisualBeat: tmpl.stage,
        capcutEditNote: "Hard cut langsung menyambung gerakan tangan tanpa jeda.",
        settingRefTag: actualSettingTag,
        characterRefTag: "@character_1",
        objectRefTag: "@object_1",
      });
    }
  }

  const parts = buildSmartMultiParts({
    scenes,
    projectTitle: topic || "Proyek Video UGC",
    pacingMode,
    environmentImages,
  });

  return {
    projectTitle: `${topic || "Proyek Video UGC"} — Format ${engineTarget.toUpperCase()}`,
    overview: `Paket video UGC ${targetDuration} (${sceneCount} adegan @ ${durPerScene}s) dengan pacing ${pacingMode === "fast" ? "Cepat (24–28 kata)" : "Normal (14–18 kata)"}.`,
    totalDuration: targetDuration,
    engineTarget,
    llmModel,
    pacingMode,
    hostProfile: {
      name: hostName,
      anchorTag: "@character_1",
      masterCharacterPrompt: `Master Character Reference: ${hostVisualPrompt} Natural human realism, documentary fidelity.`,
      negativePrompt: "cgi appearance, 3d render look, plastic smooth skin, distorted facial structure.",
    },
    environmentProfile: {
      name: "Setting & Ambience Anchor",
      anchorTag: "@setting_1",
      masterSettingPrompt: `Master Setting Reference: Aesthetic environment matching uploaded photos, natural ${lensLighting}, true-to-life textures.`,
      negativePrompt: "blurry background, flat lighting, distorted geometry.",
    },
    objectProfile: {
      name: isNoneObject ? "Objek Fleksibel" : "Hero Object",
      anchorTag: "@object_1",
      masterObjectPrompt: isNoneObject
        ? "Visual objek bebas berganti sesuai alur narasi."
        : `Master Object Reference: ${heroObject}, pristine details, realistic lighting reflections.`,
    },
    scenes,
    parts,
    geminiChainPrompts: buildGeminiChainPrompts({
      scenes,
      projectTitle: topic || "Proyek Video UGC",
      pacingMode,
      environmentImages,
      clipMode: params.clipMode || "isolated",
    }),
    capcutAssemblyGuide: buildCapcutAssemblyGuide({
      scenes,
      parts,
      projectTitle: topic || "Proyek Video UGC",
    }),
    engineDirectPrompt: buildEngineDirectPrompt({
      projectTitle: topic,
      totalDuration: targetDuration,
      scenes,
      pacingMode,
      hostProfile: { name: hostName },
    }, topic, hostName, engineTarget, llmModel),
    operatorGuide: engineTarget === "google-flow"
      ? [
          "1. Buka Google Flow (flow.google / Veo Studio) dan buat canvas project baru.",
          "2. Buka Asset Manager, unggah foto Host (@character_1) dan foto Properti/Ruangan (@setting_1).",
          "3. Salin dan tempelkan prompt masing-masing Shot (Shot 1 s/d 4) ke setiap timeline node / shot card.",
          "4. Klik Generate. Flow akan me-render seluruh shot tanpa batasan kuota chat 5 jam.",
        ]
      : engineTarget === "llm-native"
      ? [
          "1. Eksekusi Klip 1 s/d 4 di satu utas sesi Gemini yang sama.",
          "2. Lampirkan foto referensi yang sesuai.",
          "3. Jika ada Part 2, lanjutkan setelah kuota tersedia untuk menyelesaikan video kedua.",
        ]
      : [
          `1. Buka tools video ${engineTarget.toUpperCase()}.`,
          "2. Masukkan foto referensi karakter dan setting.",
          "3. Masukkan prompt per shot sesuai urutan storyboard.",
        ],
  };
}

/**
 * Hyper-Smart Audio-Visual Causality & Physical Action Lock
 */
function enforceAudioVisualCausality(scenes: any[], topic: string) {
  const isFoodTopic =
    /kentang|kue|snack|makan|food|crispy|renyah|krispi|goreng|kuliner|minum|kopi|coffee|drink|fries/i.test(
      topic
    );

  for (const scene of scenes) {
    const soundscape = (scene.audioSoundscapePrompt || "").toLowerCase();
    const visual = (scene.flowVisualPrompt || "").toLowerCase();

    // Food crunch check
    const hasFoodCrunchSFX =
      /crunch|kriuk|bite|gigit|snap|patah|chew|kunyah|crisp snap|sound effect 'kress'|kress/i.test(
        soundscape
      ) ||
      (isFoodTopic && /crunch|kriuk|kress/i.test(scene.voiceoverScriptId || ""));

    const hasBiteOrSnapAction =
      /bites|biting|takes a bite|snaps|snapping|in half|fractur|chews|menggigit|mematahkan/i.test(
        visual
      );

    if (hasFoodCrunchSFX && !hasBiteOrSnapAction) {
      scene.flowVisualPrompt = `${scene.flowVisualPrompt.trim()} [SYNCHRONIZED CAUSAL ACTION]: In macro close-up, @character_1 visibly snaps the ultra-crispy @object_1 in half (or takes a crisp bite into the mouth), with visible crust fracturing and subtle crumbs falling, directly triggering and synchronizing with the loud crunch sound.`;
      if (!scene.audioSoundscapePrompt.includes("synchronized")) {
        scene.audioSoundscapePrompt = `${scene.audioSoundscapePrompt.trim()} (synchronized directly with the visible physical bite/snap action on screen).`;
      }
    }

    // Drink sip check
    const hasDrinkSFX = /sip|slurp|teguk|drink|minum|swallow/i.test(soundscape);
    const hasDrinkAction = /sip|slurp|teguk|drink|minum|cup to mouth|glass to mouth/i.test(visual);
    if (hasDrinkSFX && !hasDrinkAction) {
      scene.flowVisualPrompt = `${scene.flowVisualPrompt.trim()} [SYNCHRONIZED CAUSAL ACTION]: @character_1 lifts the beverage to lips and takes a refreshing sip with visible throat movement, directly causing the drinking sound effect.`;
    }
  }
}
