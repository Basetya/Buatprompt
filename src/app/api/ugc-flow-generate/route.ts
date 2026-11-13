import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VideoAiEngine, LlmModelType } from "../ugc-flow-clarify/route";

interface UgcFlowGenerateRequest {
  topic: string;
  targetDuration: "<=10s" | "<=60s" | "<=120s" | ">120s" | "gemini-5clip" | "longform-multiplier";
  engineTarget: VideoAiEngine;
  llmModel?: LlmModelType;
  styleGenre: "hyper-real-ugc" | "house-tour" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial";
  hostType: string;
  customHostDescription?: string;
  cameraArchetype?: string;
  clarificationAnswers: Record<string, string>;
  hostImage?: string | null;
  productImage?: string | null;
  settingImage?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body: UgcFlowGenerateRequest = await req.json();
    const {
      topic = "",
      targetDuration = "gemini-5clip",
      engineTarget = "google-flow",
      llmModel = "gemini",
      styleGenre = "hyper-real-ugc",
      hostType = "female-pro",
      customHostDescription = "",
      cameraArchetype = "auto",
      clarificationAnswers = {},
      hostImage = null,
      productImage = null,
      settingImage = null,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    const isShortClip = targetDuration === "<=10s";
    const isGeminiChain = targetDuration === "gemini-5clip";
    const isLongFormMultiplier = targetDuration === "longform-multiplier";

    // Menghitung jumlah scene secara adaptif
    let sceneCount = 6;
    let durPerScene = 10;
    if (isShortClip) {
      sceneCount = 1;
      durPerScene = 10;
    } else if (isGeminiChain) {
      sceneCount = 5;
      durPerScene = 5;
    } else if (isLongFormMultiplier) {
      sceneCount = 10;
      durPerScene = 6;
    } else if (targetDuration === "<=60s") {
      sceneCount = 6;
      durPerScene = 10;
    } else if (targetDuration === "<=120s") {
      sceneCount = 8;
      durPerScene = 15;
    } else {
      sceneCount = 12;
      durPerScene = 15;
    }

    // Host description
    let hostName = "Presenter Utama";
    let hostVisualPrompt = "";
    if (hostImage) {
      hostName = "Custom UGC Creator (Foto Referensi Anda)";
      hostVisualPrompt =
        "UGC Creator strictly matching the attached reference photo [IMAGE 1: @host_anchor], preserving identical facial structure, hairstyle, skin tone, eye shape, and clothing style across all scenes.";
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

    const isLlmNative = engineTarget === "llm-native" || targetDuration === "<=10s";

    // Engine syntax guidance helper
    let engineSpecificInstruction = "";
    if (engineTarget === "leonardo-ai") {
      engineSpecificInstruction =
        "Format prompt video untuk Leonardo.Ai (Motion Generation): Tuliskan visual cinematic dengan fokus tajam pada focal subject (@host_anchor), arah pergerakan kamera (pan/tilt/zoom), depth of field, dan sertakan rekomendasi parameter Motion Strength (3-5 untuk gerak natural).";
    } else if (engineTarget === "dreamina-seedance") {
      engineSpecificInstruction =
        "Format prompt video untuk Dreamina (Seedance 2.0 / 2.5): Tuliskan prompt visual dinamis, high dynamic range lighting, continuous physics, dan ekspresi realistis sesuai engine Seedance 2.0 / Fast.";
    } else if (engineTarget === "runway-gen3") {
      engineSpecificInstruction =
        "Format prompt video sesuai standar Runway Gen-3 Alpha: Gunakan deskripsi cinematic motion terperinci, camera speed/direction, lighting, dan f/stop lens. Hindari jargon teknis yang tidak didukung.";
    } else if (engineTarget === "kling-ai") {
      engineSpecificInstruction =
        "Format prompt video untuk Kling AI (v1.5/v2): Fokus pada dynamic motion prompt, high-fidelity real-world physics, micro-expressions, dan camera angle parameters.";
    } else if (engineTarget === "luma-dream-machine") {
      engineSpecificInstruction =
        "Format prompt video untuk Luma Dream Machine: Tuliskan keyframe awal hingga pergerakan akhir secara continuous natural flow dengan camera trajectory yang mulus.";
    } else if (engineTarget === "hailuo-minimax") {
      engineSpecificInstruction =
        "Format prompt video untuk Minimax Hailuo AI: Sangat kuat dalam emosi wajah manusia yang hiper-realistis dan fisika kain/rambut bergerak tertiup angin.";
    } else if (engineTarget === "capcut-ai") {
      engineSpecificInstruction =
        "Format prompt naskah untuk CapCut AI Script-to-Video: Buat transkrip scene yang mudah dipotong per beat musik, dengan keyword visual yang jelas untuk media b-roll.";
    } else if (engineTarget === "wan-video") {
      engineSpecificInstruction =
        "Format prompt video untuk Wan2.1 (Wan Video Open-Source): Berikan visual descriptive prompt yang kaya estetika dan kontrol kamera yang presisi.";
    } else {
      engineSpecificInstruction =
        "Format prompt untuk Google Flow (Veo 3.1 / Gemini Omni Flash): Gunakan slash command resmi (/camera, /lens, /motion, /lighting) serta tag konsistensi @host_anchor, @setting_anchor, dan @hero_object.";
    }

    const systemPrompt = `Anda adalah Master Creative Video Director & Multi-Engine Prompt Architect kelas dunia (Hyper-Smart AI Video Director).
Tugas: Hasilkan rancangan video UGC terstruktur yang 100% SIAP EKSEKUSI SEKALI PROMPT LANGSUNG JADI tanpa perlu revisi manual untuk format durasi ${targetDuration} (${sceneCount} scene).
Target Engine Pilihan Kreator: ${engineTarget.toUpperCase()} ${isLlmNative ? `(LLM: ${llmModel.toUpperCase()})` : ""}

PANDUAN KHUSUS ENGINE:
${engineSpecificInstruction}

TIGA PILAR KONSISTENSI VISUAL MUTLAK (THE THREE CONTINUITY PILLARS):
1. PILAR 1 - LIGHTING CONTINUITY ANCHOR:
   - Seluruh adegan WAJIB memiliki kondisi tata cahaya yang identik (misal: "Natural soft morning kitchen daylight, 45-degree warm key light with subtle rim reflection"). Dilarang mengubah sumber cahaya mendadak antar klip agar warna tidak melompat saat digabung di CapCut.
2. PILAR 2 - WARDROBE & PROP LOCK ANCHOR:
   - Pakaian, gaya rambut, dan aksesori @host_anchor serta wujud fisik kemasan/tekstur @hero_object harus 100% TERKUNCI identik di setiap scene tanpa deviasi.
3. PILAR 3 - AUDIO-ACTION SYNC ANCHOR (ZERO PHANTOM SFX):
   - Efek suara foley (seperti kriuk/gigitan/snap/tegukan/tuang) WAJIB terlihat aksi fisik penyebabnya secara nyata di layar pada detik tersebut! DILARANG KERAS memunculkan suara kriuk jika makanan tidak terlihat digigit atau dipatahkan secara fisik di video.
4. FRAME BOUNDARY HAND-OFF (KONSISTENSI SAMBUNGAN KLIP):
   - Setiap adegan (terutama adegan 2 ke atas) WAJIB mencantumkan "startingFrame" yang menyambung persis dari posisi akhir (endingFrame) adegan sebelumnya, sehingga ketika dieksekusi di sesi Gemini atau digabung di CapCut, pergerakannya mengalir mulus tanpa patah (*seamless cut*).
   ${isLongFormMultiplier ? "- KHUSUS MODE LONG-FORM MULTIPLIER: Bagi adegan secara seimbang antara A-Roll (Host berbicara ke kamera) dan B-Roll (Visual cutaway close-up aksi/tekstur/proses produk tanpa bicara)." : ""}

ATURAN NASKAH & PENGETAHUAN LOKASI:
- Jika topik menyebut tempat/produk/hotel nyata: masukkan fakta asli lokasi tersebut secara natural dan meyakinkan.
- Gaya bahasa: Alami, mengalir, penuh antusiasme kreator UGC sejati. Hindari bahasa kaku/skripsi formal.
- Berikan penanda intonasi dan jeda napas: [excited], [warm], [curious], [whisper], [pause].

STRUKTUR OUTPUT JSON:
{
  "projectTitle": "string",
  "overview": "string",
  "totalDuration": "${targetDuration}",
  "engineTarget": "${engineTarget}",
  "llmModel": "${llmModel}",
  "hostProfile": {
    "name": "${hostName}",
    "anchorTag": "@host_anchor",
    "masterCharacterPrompt": "string",
    "negativePrompt": "string"
  },
  "environmentProfile": {
    "name": "Setting & Ambience Anchor",
    "anchorTag": "@setting_anchor",
    "masterSettingPrompt": "string",
    "negativePrompt": "string"
  },
  "objectProfile": {
    "name": "Hero Object / Product Detail",
    "anchorTag": "@hero_object",
    "masterObjectPrompt": "string"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "timeRange": "string",
      "stageName": "string",
      "rollType": "A-Roll atau B-Roll",
      "startingFrame": "string (Pose awal yang menyambung adegan sebelumnya)",
      "endingFrame": "string (Pose akhir sebagai titik sambung ke adegan berikutnya)",
      "lightingAnchor": "string (Tata cahaya konsisten)",
      "voiceoverScriptId": "string (naskah bahasa indonesia hidup dengan jeda [pause])",
      "cameraDirective": "string (/camera command atau instruksi framing sesuai ${engineTarget})",
      "flowVisualPrompt": "string (Prompt visual hiper-sinkron dengan urutan kronologi aksi dan aksi fisik penyebab suara)",
      "audioSoundscapePrompt": "string (Sound effect foley yang sinkron persis dengan aksi visual)",
      "keyVisualBeat": "string",
      "capcutEditNote": "string (Rekomendasi titik potong, speed ramp, atau penempatan SFX di CapCut)"
    }
  ],
  "capcutAssemblyGuide": [
    "Langkah 1 (Timeline): ...",
    "Langkah 2 (Trimming & Pacing): ...",
    "Langkah 3 (Speed Ramp / B-Roll): ...",
    "Langkah 4 (Audio & SFX Sync): ..."
  ],
  "geminiChainPrompts": [
    "Prompt Klip 1 siap copas...",
    "Prompt Klip 2 siap copas...",
    "Prompt Klip 3 siap copas..."
  ],
  "engineDirectPrompt": "string (Prompt siap copy-paste langsung ke tools ${engineTarget})",
  "operatorGuide": [
    "Langkah 1: ...",
    "Langkah 2: ...",
    "Langkah 3: ..."
  ]
}`;

    const userPromptContent = `TOPIK: "${topic}"
DURASI: ${targetDuration}
ENGINE TARGET: ${engineTarget} (${llmModel})
GENRE: ${styleGenre}
HOST: ${hostType} (${hostVisualPrompt})

PILIHAN KLARIFIKASI KREATOR:
${clarificationSummary}

Hasilkan JSON produksi utuh sekarang.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const userParts: any[] = [];
        if (hostImage && typeof hostImage === "string") {
          const cleanBase64 = hostImage.replace(/^data:[^;]+;base64,/, "");
          const mimeMatch = hostImage.match(/^data:([^;]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
          userParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          });
          userParts.push({
            text: "[FOTO REFERENSI HOST / UGC CREATOR @host_anchor]: Amati foto orang ini. Ekstrak ciri wajah, potongan rambut, warna kulit, pakaian, dan pembawaannya secara detail. Tuliskan deskripsi akurat di hostProfile.masterCharacterPrompt dan kunci penampilannya 100% konsisten di setiap adegan.",
          });
        }

        if (productImage && typeof productImage === "string") {
          const cleanBase64 = productImage.replace(/^data:[^;]+;base64,/, "");
          const mimeMatch = productImage.match(/^data:([^;]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
          userParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          });
          userParts.push({
            text: "[FOTO REFERENSI PRODUK / HERO OBJECT @hero_object]: Amati foto produk ini. Ekstrak bentuk fisik, warna kemasan, label, dan tekstur produk. Tuliskan deskripsi akurat di objectProfile.masterObjectPrompt dan kunci wujud produk 100% konsisten di setiap adegan.",
          });
        }

        if (settingImage && typeof settingImage === "string") {
          const cleanBase64 = settingImage.replace(/^data:[^;]+;base64,/, "");
          const mimeMatch = settingImage.match(/^data:([^;]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
          userParts.push({
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          });
          userParts.push({
            text: "[FOTO REFERENSI RUANGAN / LATAR ASLI @setting_anchor]: Amati foto ruangan/properti ini dengan teliti. Ekstrak struktur arsitektur, warna dinding, perabot, pencahayaan jendela, dan lantai. Tuliskan deskripsi akurat di environmentProfile.masterSettingPrompt dan KUNCI arsitektur ruangan ini 100% konsisten di setiap adegan TANPA HALUSINASI!",
          });
        }

        userParts.push({
          text: userPromptContent,
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
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
          // Attach uploaded references back
          parsed.hostImage = hostImage;
          parsed.productImage = productImage;
          parsed.settingImage = settingImage;

          // Hyper-Smart Audio-Visual Causality & Physical Action Lock
          enforceAudioVisualCausality(parsed.scenes, topic);

          // Populate Gemini Chain Prompts and CapCut Assembly Guide if missing
          if (!parsed.geminiChainPrompts || !Array.isArray(parsed.geminiChainPrompts) || parsed.geminiChainPrompts.length === 0) {
            parsed.geminiChainPrompts = buildGeminiChainPrompts(parsed);
          }
          if (!parsed.capcutAssemblyGuide || !Array.isArray(parsed.capcutAssemblyGuide) || parsed.capcutAssemblyGuide.length === 0) {
            parsed.capcutAssemblyGuide = buildCapcutAssemblyGuide(parsed);
          }

          // Ensure engineDirectPrompt is richly populated with all dialogue & directives
          if (!parsed.engineDirectPrompt || parsed.engineDirectPrompt.length < 80) {
            parsed.engineDirectPrompt = isLlmNative
              ? `=== MASTER PROMPT UGC LENGKAP SIAP PAKAI KE ${llmModel.toUpperCase()} ===\n\nTopik: ${parsed.projectTitle || topic}\nDurasi Total: ${targetDuration} (${parsed.scenes.length} Adegan)\nHost: ${parsed.hostProfile?.name || hostName}\n\n[ATURAN SINKRONISASI MUTLAK]: Seluruh efek suara foley (seperti kriuk/gigitan/tegukan) WAJIB terlihat aksi fisiknya secara nyata di layar. Dilarang ada suara kriuk tanpa kentang/makanan digigit atau dipatahkan!\n\nDAFTAR ADEGAN & NASKAH LENGKAP:\n` +
                parsed.scenes
                  .map(
                    (s: any) =>
                      `[Adegan ${s.sceneNumber} (${s.timeRange || ""}) - ${s.stageName || ""}]\n- Naskah Dialog: "${s.voiceoverScriptId}"\n- Arahan Kamera: ${s.cameraDirective}\n- Visual Prompt: ${s.flowVisualPrompt}\n- Soundscape: ${s.audioSoundscapePrompt}`
                  )
                  .join("\n\n")
              : `=== MASTER PROMPT ${engineTarget.toUpperCase()} ===\n\nTopik: ${parsed.projectTitle || topic}\nKarakter: ${parsed.hostProfile?.name || hostName}\nDurasi Total: ${targetDuration}\n\n[ATURAN SINKRONISASI MUTLAK]: Zero Phantom SFX. Aksi visual fisik harus sinkron 100% dengan soundscape foley.\n\nURUTAN ADEGAN:\n` +
                parsed.scenes
                  .map(
                    (s: any) =>
                      `[Shot ${s.sceneNumber} (${s.timeRange || ""}) - ${s.stageName || ""}]:\n- Visual Prompt: ${s.flowVisualPrompt}\n- Arahan Kamera: ${s.cameraDirective}\n- Dialog: "${s.voiceoverScriptId}"\n- Soundscape: ${s.audioSoundscapePrompt}`
                  )
                  .join("\n\n");
          }
          return NextResponse.json({ success: true, data: parsed, engine: "gemini-3.5-flash-lite" });
        }
      } catch (geminiErr) {
        console.warn("Gemini dynamic generate notice, switching to internal builder:", geminiErr);
      }
    }

    // High-End Clean Fallback
    const fallbackData = generateCleanStudioFallback({
      topic,
      targetDuration,
      engineTarget,
      llmModel,
      styleGenre,
      hostName,
      hostVisualPrompt,
      sceneCount,
      durPerScene,
      clarificationAnswers,
      hostImage,
      productImage,
      settingImage,
    });

    fallbackData.hostImage = hostImage;
    fallbackData.productImage = productImage;
    fallbackData.settingImage = settingImage;

    enforceAudioVisualCausality(fallbackData.scenes, topic);

    return NextResponse.json({ success: true, data: fallbackData, engine: "director-clean-base" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

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
    clarificationAnswers,
  } = params;

  const chosenCam = clarificationAnswers.cameraManeuver || "";
  const isBirdEye = chosenCam.toLowerCase().includes("bird-eye") || chosenCam.toLowerCase().includes("drone");
  const isLowAngle = chosenCam.toLowerCase().includes("low-angle") || chosenCam.toLowerCase().includes("pedestal");
  const isOrbit = chosenCam.toLowerCase().includes("orbit");
  const isDutch = chosenCam.toLowerCase().includes("dutch");
  const isSelfie = chosenCam.toLowerCase().includes("selfie") || chosenCam.toLowerCase().includes("close-up");

  const lensLighting = clarificationAnswers.visualLensAndLighting || "Natural Warm Daylight";
  const heroObject = clarificationAnswers.heroObjectOrFeature || "NONE: Tidak Ada Objek Terkunci (Bebas Berganti)";
  const isNoneObject = heroObject.includes("NONE");
  const isLlmNative = engineTarget === "llm-native" || targetDuration === "<=10s";

  const scenes = [];

  if (targetDuration === "<=10s") {
    const isFood = /kentang|kue|snack|makan|food|crispy|renyah|krispi|goreng|kuliner|fries/i.test(topic);

    scenes.push({
      sceneNumber: 1,
      timeRange: "00:00 - 00:10",
      stageName: "10-SECOND VIRAL HOOK & REVEAL",
      rollType: "A-Roll",
      startingFrame: "@host_anchor standing ready in front of camera with @hero_object",
      endingFrame: "@host_anchor gives a confident, delighted smile with thumbs up",
      lightingAnchor: lensLighting,
      voiceoverScriptId: isFood
        ? `[excited] Sumpah, ini rahasianya! [pause] Cukup taburan maizena tipis sebelum digoreng, [pause] dijamin renyah tahan seharian!`
        : `[excited] Kalau kalian lagi cari ${topic || "solusi terbaik"}, [pause] jujur ini bener-bener wajib dicoba! [warm] Cek info lengkapnya sekarang juga!`,
      cameraDirective: isSelfie
        ? `Handheld selfie macro close-up 28mm / subtle organic phone sway / natural warm daylight`
        : `Dynamic macro push-in 35mm to eye-level / soft ambient rim light`,
      flowVisualPrompt: isFood
        ? `[00:00-00:03]: @host_anchor presents the golden crispy @hero_object on @setting_anchor near camera with an excited smile. [00:03-00:06]: In macro close-up, @host_anchor brings @hero_object to her mouth and takes an authentic crisp bite (or snaps it in two with both hands), with visible golden crust fracturing and crumbs gently falling, perfectly causing and synchronizing with the loud food crunch sound. [00:06-00:10]: @host_anchor chews with a genuine delighted smile and gives an enthusiastic thumbs up to camera.`
        : `[00:00-00:03]: @host_anchor hooks the audience looking directly at the camera with an authentic, friendly smile. [00:03-00:07]: @host_anchor gestures towards @hero_object, showcasing its key benefit in organic lighting. [00:07-00:10]: Warm closing expression with call-to-action gesture.`,
      audioSoundscapePrompt: isFood
        ? `Loud, ultra-satisfying crisp food crunch sound effect synchronized exactly with the physical bite/snap action at 00:03-00:06, followed by soft warm acoustic guitar music and clear vocal.`
        : `Crisp clean vocal, subtle warm room ambience, light modern acoustic guitar chord swell.`,
      keyVisualBeat: "Klip singkat 10 detik langsung memikat dengan aksi fisik nyata dan ekspresi autentik.",
      capcutEditNote: "Gunakan pemotongan cepat di detik ke-6 saat gigitan terjadi untuk mempertahankan retensi tinggi.",
    });
  } else if (targetDuration === "gemini-5clip") {
    const isFood = /kentang|kue|snack|makan|food|crispy|renyah|krispi|goreng|kuliner|fries/i.test(topic);

    scenes.push(
      {
        sceneNumber: 1,
        timeRange: "00:00 - 00:05",
        stageName: "HOOK & SETUP ANCHOR",
        rollType: "A-Roll",
        startingFrame: "@host_anchor standing facing the camera with welcoming energy",
        endingFrame: "@host_anchor holds @hero_object up towards the lens at chest level with anticipation",
        lightingAnchor: lensLighting,
        voiceoverScriptId: isFood
          ? `[excited] Jangan goreng kentang dulu sebelum tahu rahasia ini! [pause] Dijamin hasilnya renyah seharian!`
          : `[excited] Kalau kalian mau hasil yang maksimal buat ${topic || "kebutuhan ini"}, [pause] wajib tahu trik simpel ini!`,
        cameraDirective: "Medium close-up 35mm handheld eye-level / smooth creator motion",
        flowVisualPrompt: `@host_anchor stands in @setting_anchor, looking directly into the camera with high engagement, holding @hero_object at chest level, warm ${lensLighting}, authentic skin texture.`,
        audioSoundscapePrompt: "Clear vocal, warm room acoustic, subtle engaging pop sound effect.",
        keyVisualBeat: "Hook pembuka 5 detik dengan ekspresi penasaran dan memegang produk.",
        capcutEditNote: "Potong 0.2 detik awal agar hook langsung dimulai tanpa jeda.",
      },
      {
        sceneNumber: 2,
        timeRange: "00:05 - 00:10",
        stageName: "AGITATION & REVEAL",
        rollType: "A-Roll",
        startingFrame: "Continues seamlessly from Scene 1: @host_anchor holding @hero_object at chest level, transitioning to gesturing with left hand",
        endingFrame: "@host_anchor points directly towards @hero_object with an insightful nod",
        lightingAnchor: lensLighting,
        voiceoverScriptId: isFood
          ? `[warm] Kesalahan kebanyakan orang itu langsung goreng pas basah. Kuncinya cuma satu taburan tipis ini!`
          : `[warm] Masalahnya seringkali kita salah langkah di awal. Padahal solusinya cuma ada di satu fitur kunci ini!`,
        cameraDirective: "Slow push-in 50mm portrait / shallow depth of field",
        flowVisualPrompt: `@host_anchor continues from previous frame, speaking warmly to the audience, gesturing towards @hero_object on @setting_anchor, maintaining identical outfit, hair, and soft ${lensLighting}.`,
        audioSoundscapePrompt: "Warm conversational vocal tone, subtle whoosh transition.",
        keyVisualBeat: "Membahas masalah umum dan memperkenalkan solusi produk.",
        capcutEditNote: "Hard cut langsung menyambung gerakan tangan dari adegan 1.",
      },
      {
        sceneNumber: 3,
        timeRange: "00:10 - 00:15",
        stageName: "HERO DEMO & MACRO B-ROLL",
        rollType: "B-Roll",
        startingFrame: "Continues from Scene 2: Camera transitions smoothly to macro view of @hero_object",
        endingFrame: "@host_anchor's hands lift @hero_object and prepare for the ultimate test",
        lightingAnchor: lensLighting,
        voiceoverScriptId: isFood
          ? `[whisper] Cukup balur maizena tipis merata sebelum masuk minyak panas. Lihat nih teksturnya...`
          : `[curious] Perhatiin deh detail dan presisinya pas dipakai langsung. Bener-bener beda kelas!`,
        cameraDirective: "Macro 85mm close-up / slow tilt-down over product details",
        flowVisualPrompt: `Extreme macro close-up of @hero_object on @setting_anchor, showing exquisite texture details, pristine quality, identical lighting reflections as previous scenes.`,
        audioSoundscapePrompt: "Crisp macro foley sound, gentle room tone, soft ambient acoustic rhythm.",
        keyVisualBeat: "Eksplorasi visual detail produk secara estetik tanpa distraksi.",
        capcutEditNote: "Terapkan Speed 0.8x Smooth Optical Flow untuk kesan mewah sinematik.",
      },
      {
        sceneNumber: 4,
        timeRange: "00:15 - 00:20",
        stageName: "SENSORY PROOF & AUDITORY SYNC",
        rollType: "A-Roll",
        startingFrame: "Continues from Scene 3: @host_anchor brings @hero_object to mouth / hands for the physical test",
        endingFrame: "@host_anchor smiles in genuine amazement after the physical bite/test",
        lightingAnchor: lensLighting,
        voiceoverScriptId: isFood
          ? `[pause] Dengerin baik-baik suaranya... [pause] Garing banget kan?!`
          : `[excited] Pas dicoba langsung... [pause] bener-bener mantap dan sesuai ekspektasi!`,
        cameraDirective: "Macro eye-level 50mm / locked tripod stability",
        flowVisualPrompt: isFood
          ? `@host_anchor visibly brings the crispy @hero_object to her mouth and takes an authentic crisp bite in macro view, fracturing the golden crust with tiny crumbs, physically causing and synchronizing with the loud crunch sound, followed by a delighted smile.`
          : `@host_anchor demonstrates the active function of @hero_object with natural hand mechanics, visibly proving its capability, followed by an enthusiastic smile.`,
        audioSoundscapePrompt: isFood
          ? "Ultra-crisp satisfying food crunch sound effect synchronized exactly with the physical bite, followed by a relieved vocal chuckle."
          : "Satisfying tactile click sound effect synchronized with the physical action, followed by energetic vocal.",
        keyVisualBeat: "Bukti nyata kausalitas audio-visual: aksi fisik memicu suara secara tepat.",
        capcutEditNote: "Pasang sound effect foley tepat di milidetik kentang/produk digigit/dites.",
      },
      {
        sceneNumber: 5,
        timeRange: "00:20 - 00:25",
        stageName: "CALL TO ACTION & SEAMLESS LOOP",
        rollType: "A-Roll",
        startingFrame: "Continues from Scene 4: @host_anchor holding @hero_object, giving thumbs up",
        endingFrame: "@host_anchor in a friendly welcoming pose matching Scene 1 starting position for infinite loop",
        lightingAnchor: lensLighting,
        voiceoverScriptId: isFood
          ? `[excited] Yuk cobain resep rahasia ini sekarang juga, dan tag aku pas kalian bikin ya!`
          : `[excited] Buruan cek link di bio atau keranjang kuning sebelum kehabisan ya guys!`,
        cameraDirective: "Medium shot 35mm / gentle tracking out to eye-level",
        flowVisualPrompt: `@host_anchor stands confidently holding @hero_object, pointing with a warm friendly gesture towards the camera, ending with an inviting smile that smoothly matches the starting posture of Scene 1.`,
        audioSoundscapePrompt: "Uplifting closing chord, clear voice, subtle chime bell SFX.",
        keyVisualBeat: "Penutup energik dengan ajakan aksi jelas dan pose yang bisa di-looping.",
        capcutEditNote: "Tambahkan teks animasi 'Cek Keranjang Kuning / Bio' dengan efek pop CapCut.",
      }
    );
  } else if (targetDuration === "longform-multiplier") {
    // 10 Scenes: 5 A-Roll & 5 B-Roll Interleaved for 1-3 Min YouTube / Long-form Content
    for (let i = 0; i < 10; i++) {
      const isARoll = i % 2 === 0;
      const sNum = i + 1;
      const sStart = i * 6;
      const sEnd = (i + 1) * 6;
      const timeRange = `00:${sStart < 10 ? "0" + sStart : sStart} - 00:${sEnd < 10 ? "0" + sEnd : sEnd}`;

      scenes.push({
        sceneNumber: sNum,
        timeRange,
        stageName: isARoll ? `A-ROLL (TALKING HEAD ${Math.floor(i / 2) + 1})` : `B-ROLL (MACRO ACTION ${Math.floor(i / 2) + 1})`,
        rollType: isARoll ? "A-Roll" : "B-Roll",
        startingFrame: i === 0
          ? "@host_anchor standing facing the camera in full focus"
          : `Continues seamlessly from Scene ${i} ending position`,
        endingFrame: isARoll
          ? "@host_anchor gestures towards the demonstration area"
          : "Smooth camera motion leading back to the host",
        lightingAnchor: lensLighting,
        voiceoverScriptId: isARoll
          ? `[warm] Di langkah ke-${Math.floor(i / 2) + 1} ini, kalian perhatikan gimana ${topic || "prosesnya"} berjalan dengan sangat rapi dan praktis.`
          : `[whisper] Lihat detailnya pas bagian ini bekerja... tekstur dan hasilnya benar-benar kelihatan nyata.`,
        cameraDirective: isARoll
          ? `Medium portrait 50mm / eye-level / soft directional ${lensLighting}`
          : `Macro 85mm slow slider tracking / crisp focus on @hero_object`,
        flowVisualPrompt: isARoll
          ? `@host_anchor delivers insightful guidance looking directly at camera, natural hand gestures, dressed in identical attire with consistent ${lensLighting}.`
          : `High-fidelity macro cutaway of @hero_object in @setting_anchor, showcasing active detail, materials, and motion mechanics.`,
        audioSoundscapePrompt: isARoll
          ? "Clear articulated vocal narration, gentle room atmosphere, soft lo-fi background beat."
          : "Satisfying foley sound effects matching the exact physical interaction, ambient sound.",
        keyVisualBeat: isARoll ? "Narasi edukatif host yang kredibel dan bersahabat." : "B-Roll sinematik yang memperkuat isi pembicaraan.",
        capcutEditNote: isARoll
          ? "Letakkan di Main Track CapCut sebagai landasan audio narasi."
          : "Letakkan di Overlay Track di atas klip A-Roll dengan transisi cut halus.",
      });
    }
  } else {
    const stages = [
      { name: "PEMBUKA / HOOK", desc: "Menyapa audiens dengan hook memikat" },
      { name: "REVEAL MASALAH & NILAI", desc: "Menjelaskan mengapa ini spesial" },
      { name: "EKSPLORASI DETAIL UTAMA", desc: "Menunjukkan detail visual produk atau tempat" },
      { name: "PENGALAMAN & AMBIENCE", desc: "Menghadirkan suasana nyata dan emosi" },
      { name: "FITUR UNGGULAN LAINNYA", desc: "Kelebihan yang membedakan dari lainnya" },
      { name: "AJAKAN / CALL TO ACTION", desc: "Menutup dengan ajakan bertindak yang jelas" },
    ];

    for (let i = 0; i < sceneCount; i++) {
      const stage = stages[i % stages.length];
      const sStart = i * durPerScene;
      const sEnd = (i + 1) * durPerScene;
      const timeRange = `00:${sStart < 10 ? "0" + sStart : sStart} - 00:${sEnd < 10 ? "0" + sEnd : sEnd}`;

      let camCmd = `Push-in 50mm smooth dolly | natural creator pacing`;
      let promptDetail = "";
      let voText = "";

      if (i === 0) {
        if (isBirdEye) {
          camCmd = `Drone aerial high view descending smoothly down to eye-level medium shot in front of @host_anchor`;
          promptDetail = `Sweeping bird-eye aerial shot descending gracefully down to eye-level medium shot in front of @host_anchor, lively engaging smile, natural sunlight, documentary realism.`;
        } else if (isLowAngle) {
          camCmd = `Low-angle pedestal-up 28mm wide looking up at @host_anchor with background landscape`;
          promptDetail = `Impressive low-angle shot framing @host_anchor standing confidently with background architecture, natural sky illumination, crisp 4K fidelity.`;
        } else {
          camCmd = `Eye-level handheld tracking 35mm / organic creator motion`;
          promptDetail = `Engaging eye-level tracking shot of @host_anchor addressing the audience warmly, organic creator movement, authentic skin texture.`;
        }
        voText = `[excited] Kalian bayangin... [pause] ada cara yang bener-bener bikin ${topic || "ini"} jauh lebih simpel dan hasilnya sempurna!`;
      } else if (i === 1) {
        camCmd = `Medium tracking backward 50mm / soft daylight`;
        promptDetail = `Medium shot following @host_anchor walking through the scene, natural gestures, true-to-life lighting.`;
        voText = `[warm] Banyak yang belum tahu, kuncinya ada di proses yang satu ini. Bener-bener game-changer!`;
      } else if (i === 2) {
        camCmd = `Slow 360-orbit arc 35mm / elevation eye-level`;
        promptDetail = `Smooth orbiting camera showcasing the surrounding ambiance and detailed craftsmanship, realistic material textures.`;
        voText = `[curious] Perhatiin deh setiap detailnya. Mulai dari tekstur sampai kualitasnya bener-bener berasa beda.`;
      } else if (i === 3) {
        camCmd = `Indoor glide 24mm / warm ambient lighting`;
        promptDetail = `Gentle camera glide exploring the interior details, comfortable aesthetic, soft shadow roll-off.`;
        voText = `[whisper] Gak cuma itu aja, ada satu rahasia lagi yang bikin semuanya terasa makin praktis.`;
      } else if (i === 4) {
        camCmd = `Wide establishing pedestal 35mm`;
        promptDetail = `Wide expansive shot capturing the complete surrounding landscape and premium facilities, true-to-life colors.`;
        voText = `[warm] Hasilnya konsisten dan tahan lama, cocok banget buat kebutuhan harian kalian.`;
      } else {
        camCmd = `Close-up portrait 85mm / shallow depth of field`;
        promptDetail = `Intimate 85mm portrait shot of @host_anchor looking warmly into the lens, inviting smile, soft bokeh background.`;
        voText = `[excited] Langsung cobain sekarang juga dan rasain sendiri bedanya. Cek link di bawah ya!`;
      }

      scenes.push({
        sceneNumber: i + 1,
        timeRange,
        stageName: stage.name,
        voiceoverScriptId: voText,
        cameraDirective: camCmd,
        flowVisualPrompt: promptDetail,
        audioSoundscapePrompt: `Clear spoken dialogue, gentle ambient room or nature sound, subtle melodic backing tone.`,
        keyVisualBeat: stage.desc,
      });
    }
  }

  // Direct prompt formatting based on chosen tool
  const engineDirectPrompt = isLlmNative
    ? `=== MASTER PROMPT UGC LENGKAP SIAP PAKAI KE ${llmModel.toUpperCase()} ===

Topik: ${topic || "Proyek Video UGC"}
Durasi Total: ${targetDuration} (${scenes.length} Adegan)
Host: ${hostName} (${hostVisualPrompt})
Gaya Kamera: ${chosenCam || "Handheld natural"}
Pencahayaan: ${lensLighting}

DAFTAR ADEGAN & NASKAH LENGKAP:
${scenes
  .map(
    (s) =>
      `[Adegan ${s.sceneNumber} (${s.timeRange}) - ${s.stageName}]
- Naskah Dialog: "${s.voiceoverScriptId}"
- Arahan Kamera: ${s.cameraDirective}
- Visual Prompt: ${s.flowVisualPrompt}
- Soundscape: ${s.audioSoundscapePrompt}`
  )
  .join("\n\n")}`
    : `=== MASTER PROMPT ${engineTarget.toUpperCase()} ===

Project: ${topic}
Visual Style: Authentic UGC, ${lensLighting}, 4K photorealism, natural motion mechanics.
Character Anchor: ${hostVisualPrompt}

URUTAN LENGKAP ADEGAN:
${scenes
  .map(
    (s) =>
      `[Shot ${s.sceneNumber} (${s.timeRange}) - ${s.stageName}]:
- Visual Prompt: ${s.flowVisualPrompt}
- Arahan Kamera: ${s.cameraDirective}
- Naskah Dialog: "${s.voiceoverScriptId}"
- Soundscape: ${s.audioSoundscapePrompt}`
  )
  .join("\n\n")}`;

  return {
    projectTitle: `${topic || "Proyek Video UGC"} — Format ${engineTarget.toUpperCase()}`,
    overview: `Paket panduan naskah dan arahan visual ${targetDuration} (${sceneCount} adegan) yang dioptimalkan khusus untuk engine ${engineTarget.toUpperCase()}.`,
    totalDuration: targetDuration,
    engineTarget,
    llmModel,
    hostProfile: {
      name: hostName,
      anchorTag: "@host_anchor",
      masterCharacterPrompt: `Master Character Reference: ${hostVisualPrompt} Natural human anatomy, authentic facial expressions, visible skin pores, natural hair texture, documentary-grade realism, zero plastic skin.`,
      negativePrompt: `cgi appearance, 3d render look, plastic smooth skin, distorted facial structure, artificial beauty filter, watermark, text blur.`,
    },
    environmentProfile: {
      name: "Setting & Ambience Anchor",
      anchorTag: "@setting_anchor",
      masterSettingPrompt: `Master Setting Reference: Beautiful aesthetic environment tailored for ${topic}, natural ${lensLighting}, true-to-life textures, cinematic photography.`,
      negativePrompt: `blurry background, flat lighting, unnatural saturation, distorted geometry.`,
    },
    objectProfile: {
      name: isNoneObject ? "Objek Fleksibel (Bebas Berganti)" : "Hero Object / Product Focus",
      anchorTag: "@hero_object",
      masterObjectPrompt: isNoneObject
        ? "Visual objek dan properti bebas berganti-ganti di tiap adegan sesuai alur narasi, tidak terkunci pada satu benda saja."
        : `Master Object Reference: ${heroObject}, pristine details, realistic lighting reflections.`,
    },
    scenes,
    engineDirectPrompt,
    hostImage: params.hostImage || null,
    productImage: params.productImage || null,
    settingImage: params.settingImage || null,
    geminiChainPrompts: buildGeminiChainPrompts({
      scenes,
      projectTitle: topic || "Proyek Video UGC",
      hostImage: params.hostImage,
      productImage: params.productImage,
      settingImage: params.settingImage,
    }),
    capcutAssemblyGuide: buildCapcutAssemblyGuide({
      scenes,
      projectTitle: topic || "Proyek Video UGC",
      totalDuration: targetDuration,
    }),
    operatorGuide: isLlmNative
      ? [
          `1. Salin prompt di tab 'Prompt Siap Pakai (${llmModel.toUpperCase()})'.`,
          `2. Buka aplikasi ${llmModel.toUpperCase()} pilihan Anda (Gemini, Claude, ChatGPT, DeepSeek, Kimi, atau Grok).`,
          `3. Tempelkan prompt ke chatbox untuk mendapatkan naskah dan variasi dialog seketika.`,
        ]
      : [
          `1. Buka studio AI Video pilihan Anda (${engineTarget.toUpperCase()}).`,
          `2. Salin Character Reference dan tempelkan ke slot karakter / face consistency jika didukung.`,
          `3. Masukkan arahan kamera dan visual prompt per scene yang sudah disesuaikan dengan format ${engineTarget.toUpperCase()}.`,
          `4. Putar preview audio di BuatPrompt untuk sinkronisasi ketukan suara.`,
        ],
  };
}

/**
 * Builds sequential prompts for Gemini's single chat conversation thread
 * using Frame Boundary Hand-off to ensure 100% character, prop, and motion continuity.
 */
function buildGeminiChainPrompts(data: any): string[] {
  const scenes = data.scenes || [];
  const projectTitle = data.projectTitle || "Proyek UGC";
  const hasHostImg = Boolean(data.hostImage);
  const hasProdImg = Boolean(data.productImage);
  const hasSettingImg = Boolean(data.settingImage);

  return scenes.map((s: any, idx: number) => {
    if (idx === 0) {
      return `=== KLIP 1 / ADEGAN 1: ${s.stageName.toUpperCase()} (${s.timeRange}) ===
Format: Video 5 Detik (Gemini Prompt Sesi 1)
Proyek: ${projectTitle}

[INSTRUKSI MEMORI & KONSISTENSI GEMINI]:
- Gunakan foto referensi yang saya lampirkan di chat ini:
  * ${hasHostImg ? "Foto wajah & busana host: Gunakan [IMAGE 1: @host_anchor]" : "@host_anchor: Wajah dan postur host tetap konsisten."}
  * ${hasProdImg ? "Foto produk: Gunakan [IMAGE 2: @hero_object]" : "@hero_object: Produk/kemasan konsisten."}
  * ${hasSettingImg ? "Foto ruangan/rumah asli: Gunakan [IMAGE 3: @setting_anchor] kunci arsitektur & perabot tanpa halusinasi." : "@setting_anchor: Latar ruangan tetap konsisten."}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight, 45-degree key light"} di seluruh adegan.
- Aksi Fisik Nyata: Efek suara foley wajib terlihat aksi fisiknya di layar (zero phantom sound).

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP 1]:
${s.flowVisualPrompt}

[NASKAH DIALOGUE]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX]:
${s.audioSoundscapePrompt}

[ENDING POSE TITIK SAMBUNG]:
${s.endingFrame || "@host_anchor memegang produk di depan kamera dengan senyum ramah dan gestur mengajak bicara."}`;
    }

    return `=== KLIP ${s.sceneNumber} / ADEGAN ${s.sceneNumber}: ${s.stageName.toUpperCase()} (${s.timeRange}) ===
Format: Video 5 Detik (Sambungan Langsung di Sesi Gemini yang Sama)

[INSTRUKSI SAMBUNGAN GEMINI (FRAME BOUNDARY HAND-OFF)]:
- Lanjutkan video sebelumnya di dalam satu utas percakapan ini.
- JANGAN UBAH WAJAH, RAMBUT, BAJU, ATAU RUANGAN. Pertahankan 100% konsisten dengan klip sebelumnya.
- Starting Frame: ${s.startingFrame || `Melanjutkan persis dari frame terakhir Klip ${idx} tanpa jeda.`}
- Kunci tata cahaya: ${s.lightingAnchor || "Natural soft daylight"} identik dengan klip sebelumnya.

[ARAHAN KAMERA]:
${s.cameraDirective}

[VISUAL PROMPT KLIP ${s.sceneNumber}]:
${s.flowVisualPrompt}

[NASKAH DIALOGUE]:
"${s.voiceoverScriptId}"

[SOUNDSCAPE & SFX (ZERO PHANTOM)]:
${s.audioSoundscapePrompt}

[ENDING POSE TITIK SAMBUNG]:
${s.endingFrame || "@host_anchor menyelesaikan aksi dengan ekspresi puas dan bersiap untuk adegan selanjutnya."}`;
  });
}

/**
 * Builds step-by-step CapCut editing instructions
 * for seamless assembly, trimming, speed ramp, and caption sync.
 */
function buildCapcutAssemblyGuide(data: any): string[] {
  const scenes = data.scenes || [];
  const projectTitle = data.projectTitle || "Proyek Video UGC";
  const isLongForm = data.totalDuration === "longform-multiplier" || scenes.length >= 8;

  return [
    `LANGKAH 1: PERSIAPAN MEDIA DI CAPCUT
- Buka aplikasi CapCut (Desktop atau Mobile).
- Buat proyek baru dan impor seluruh video hasil unduhan dari Gemini (Klip 1 s/d Klip ${scenes.length}).
- Atur rasio kanvas: 9:16 (untuk TikTok/Shorts/Reels) atau 16:9 (untuk YouTube horizontal).`,

    `LANGKAH 2: PENATAAN TIMELINE ${isLongForm ? "(A-ROLL & B-ROLL)" : "(URUTAN KONTINUITAS)"}
- Susun klip di timeline utama secara berurutan: Klip 1 -> Klip 2 -> Klip 3 -> ... -> Klip ${scenes.length}.
${isLongForm ? "- Untuk adegan B-Roll (cutaway aksi/detail): letakkan di track overlay di atas naskah bicara host (A-Roll) agar narasi tetap mengalir tanpa jeda hening." : "- Pastikan sambungan antar klip menggunakan sambungan langsung (hard cut) tanpa efek transisi berlebihan agar kesan UGC alami tetap terjaga."}`,

    `LANGKAH 3: PEMOTONGAN CEPAT (TRIMMING DENGAN METODE J-CUT / L-CUT)
- Potong sekitar 0.2 hingga 0.4 detik pada awal atau akhir setiap klip jika ada bagian yang gerakannya lambat sebelum aksi dimulai.
- Hubungkan naskah bicara agar ritme napas antar adegan terasa gesit dan tidak ada momen hening ('dead air').`,

    `LANGKAH 4: SPEED RAMP & SINEMATIK B-ROLL
- Untuk adegan detail produk atau makanan (misal: penuangan, pemotongan, atau tekstur kriuk): ubah kecepatan (Speed) menjadi 0.7x atau 0.8x dengan opsi 'Smooth Optical Flow' untuk memberi kesan visual mewah layaknya iklan TV komersial.`,

    `LANGKAH 5: SINKRONISASI SOUND EFFECT & TEKS OTOMATIS
- Tarik sound effect foley (kriuk/pop/snap) tepat di bawah frame tempat aksi fisik terjadi di layar (100% sinkron).
- Gunakan fitur 'Auto Captions' (Teks Otomatis) bahasa Indonesia di CapCut, pilih template teks animasi modern satu-per-satu kata (Word-by-word) dengan highlight warna kuning/oranye untuk memaksimalkan retensi penonton!`
  ];
}

/**
 * Hyper-Smart Audio-Visual Causality & Physical Action Lock
 * Ensures every Foley sound effect (crunch, bite, snap, chew, sip, click)
 * has an explicit, observable, physical cause-and-effect visual trigger.
 */
function enforceAudioVisualCausality(scenes: any[], topic: string) {
  const isFoodTopic =
    /kentang|kue|snack|makan|food|crispy|renyah|krispi|goreng|kuliner|minum|kopi|coffee|drink|fries/i.test(
      topic
    );

  for (const scene of scenes) {
    const soundscape = (scene.audioSoundscapePrompt || "").toLowerCase();
    const visual = (scene.flowVisualPrompt || "").toLowerCase();

    // Check for food crunch / bite / chewing sounds
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
      // Injects explicit, synchronized micro-action to prevent phantom sound
      if (
        scene.timeRange &&
        (scene.timeRange.includes("00:10") || scene.timeRange.includes("00:09"))
      ) {
        scene.flowVisualPrompt = `[00:00-00:03]: @host_anchor presents the golden crispy @hero_object near camera with lively smiling expression. [00:03-00:06]: In macro close-up, @host_anchor brings the crispy @hero_object to her mouth and takes an authentic crisp bite (or snaps it in two with both hands in front of the lens), with visible golden crust fracturing and crumbs gently falling, perfectly causing and synchronizing with the loud food crunch sound. [00:06-00:10]: @host_anchor chews with a genuine delighted smile and gives an enthusiastic thumbs up to camera.`;
      } else {
        scene.flowVisualPrompt = `${scene.flowVisualPrompt.trim()} [SYNCHRONIZED CAUSAL ACTION]: In macro close-up, @host_anchor visibly snaps the ultra-crispy @hero_object in half (or takes a crisp bite into the mouth), with visible crust fracturing and subtle crumbs falling, directly triggering and synchronizing with the loud crunch sound.`;
      }

      // Ensure soundscape also explicitly mentions the sync
      if (!scene.audioSoundscapePrompt.includes("synchronized")) {
        scene.audioSoundscapePrompt = `${scene.audioSoundscapePrompt.trim()} (synchronized directly with the visible physical bite/snap action on screen).`;
      }
    }

    // Check for drink / sip sounds
    const hasDrinkSFX = /sip|slurp|teguk|drink|minum|swallow/i.test(soundscape);
    const hasDrinkAction = /sip|slurp|teguk|drink|minum|cup to mouth|glass to mouth/i.test(visual);
    if (hasDrinkSFX && !hasDrinkAction) {
      scene.flowVisualPrompt = `${scene.flowVisualPrompt.trim()} [SYNCHRONIZED CAUSAL ACTION]: @host_anchor lifts the beverage to lips and takes a refreshing sip with visible throat movement, directly causing the drinking sound effect.`;
    }
  }
}
