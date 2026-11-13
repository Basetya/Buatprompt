import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface UgcFlowGenerateRequest {
  topic: string;
  targetDuration: "<=10s" | "<=60s" | "<=120s" | ">120s";
  engineTarget: "llm-native" | "google-flow";
  llmModel?: "gemini" | "claude" | "gpt" | "deepseek" | "kimi" | "grok";
  styleGenre: "hyper-real-ugc" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial";
  hostType: "male-casual" | "female-pro" | "custom" | "none-faceless" | "cartoon-3d-animation";
  customHostDescription?: string;
  cameraArchetype?: string;
  clarificationAnswers: Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const body: UgcFlowGenerateRequest = await req.json();
    const {
      topic = "",
      targetDuration = "<=60s",
      engineTarget = "google-flow",
      llmModel = "gemini",
      styleGenre = "hyper-real-ugc",
      hostType = "female-pro",
      customHostDescription = "",
      cameraArchetype = "auto",
      clarificationAnswers = {},
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Menghitung jumlah scene secara adaptif
    let sceneCount = 6;
    let durPerScene = 10;
    if (targetDuration === "<=10s") {
      sceneCount = 1;
      durPerScene = 10;
    } else if (targetDuration === "<=60s") {
      sceneCount = 6;
      durPerScene = 10;
    } else if (targetDuration === "<=120s") {
      sceneCount = 8;
      durPerScene = 15;
    } else {
      // > 120s (Epic Story)
      sceneCount = 12;
      durPerScene = 15;
    }

    // Host description
    let hostName = "Presenter Utama";
    let hostVisualPrompt = "";
    if (hostType === "male-casual") {
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

    const systemPrompt = `Anda adalah Master Creative Video Director & Prompt Architect kelas dunia.
Tugas: Hasilkan rancangan video UGC terstruktur yang siap pakai tanpa koreksi untuk format durasi ${targetDuration} (${sceneCount} scene).
Target Engine: ${isLlmNative ? `Prompt LLM Langsung (${llmModel.toUpperCase()})` : "Google Flow (Veo 2) Multi-Shot"}

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
    "masterCharacterPrompt": "string (deskripsi visual detail subjek)",
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
      "voiceoverScriptId": "string (naskah bahasa indonesia hidup)",
      "cameraDirective": "string (/camera command atau instruksi framing)",
      "flowVisualPrompt": "string (Prompt visual terstruktur siap pakai)",
      "audioSoundscapePrompt": "string",
      "keyVisualBeat": "string"
    }
  ],
  "llmDirectPrompt": "string (Prompt siap copy-paste langsung ke ${llmModel.toUpperCase()} bila ingin generate langsung)",
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
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: userPromptContent,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.35,
          },
        });

        const text = response.text || "";
        const parsed = JSON.parse(text);
        if (parsed.scenes && Array.isArray(parsed.scenes)) {
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
    });

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
    // 1 SCENE ULTRA-PUNCHY 10 DETIK
    scenes.push({
      sceneNumber: 1,
      timeRange: "00:00 - 00:10",
      stageName: "10-SECOND VIRAL HOOK",
      voiceoverScriptId: `[excited] Kalau kalian lagi cari ${topic || "rekomendasi terbaik"}, [pause] jujur ini bener-bener gak boleh kalian lewatin! [warm] Cek detail lengkapnya sekarang juga!`,
      cameraDirective: isSelfie
        ? `/camera handheld selfie close-up 28mm /motion dynamic head-nod & gestures /lighting natural soft daylight`
        : `/camera dynamic push-in 35mm /motion smooth walking /lighting golden-hour rim-light`,
      flowVisualPrompt: `Authentic UGC video clip of @host_anchor talking enthusiastically directly to phone camera in a naturally lit setting, lively facial expression, visible skin micro-texture, 4K social media organic quality, zero plastic look.`,
      audioSoundscapePrompt: `Crisp clean vocal, subtle warm room ambience, light modern acoustic guitar chord swell.`,
      keyVisualBeat: "Klip singkat 10 detik langsung memikat dengan ekspresi autentik.",
    });
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

      let camCmd = `/camera push-in 50mm smooth dolly | /motion natural walking`;
      let promptDetail = "";
      let voText = "";

      if (i === 0) {
        if (isBirdEye) {
          camCmd = `/camera drone bird-eye descent -> seamless crane to eye-level 35mm /speed decelerating`;
          promptDetail = `Sweeping bird-eye aerial shot descending gracefully down to eye-level medium shot in front of @host_anchor, lively engaging smile, natural sunlight, documentary realism.`;
        } else if (isLowAngle) {
          camCmd = `/camera low-angle pedestal-up 28mm wide looking up at @host_anchor /lighting dramatic natural rim-light`;
          promptDetail = `Impressive low-angle shot framing @host_anchor standing confidently with background architecture, natural sky illumination, crisp 4K fidelity.`;
        } else {
          camCmd = `/camera eye-level handheld tracking 35mm /motion natural creator cadence`;
          promptDetail = `Engaging eye-level tracking shot of @host_anchor addressing the audience warmly, organic creator movement, authentic skin texture.`;
        }
        voText = `[excited] Kalian bayangin... [pause] ada tempat yang bener-bener memadukan keindahan alam dan kenyamanan tanpa kompromi seperti ${topic || "ini"}!`;
      } else if (i === 1) {
        camCmd = `/camera medium tracking backward 50mm /lighting soft daylight`;
        promptDetail = `Medium shot following @host_anchor walking through the location, natural gestures, true-to-life lighting.`;
        voText = `[warm] Suasananya tuh tenang banget dan nyaman. Bener-bener pilihan tepat buat kalian yang mengutamakan kualitas.`;
      } else if (i === 2) {
        camCmd = `/camera slow 360-orbit arc 35mm /elevation eye-level`;
        promptDetail = `Smooth orbiting camera showcasing the surrounding ambiance and detailed craftsmanship, realistic material textures.`;
        voText = `[curious] Perhatiin deh setiap sudutnya. Mulai dari pemilihan material sampai pencahayaan alaminya dirancang sangat matang.`;
      } else if (i === 3) {
        camCmd = `/camera indoor glide 24mm /lighting warm ambient`;
        promptDetail = `Gentle camera glide exploring the interior details, comfortable aesthetic, soft shadow roll-off.`;
        voText = `[whisper] Begitu masuk ke area dalamnya, suasananya langsung bikin rileks seketika.`;
      } else if (i === 4) {
        camCmd = `/camera wide establishing pedestal 35mm`;
        promptDetail = `Wide expansive shot capturing the complete surrounding landscape and premium facilities, true-to-life colors.`;
        voText = `[warm] Akses mudah, fasilitas lengkap, dan pemandangan yang gak bakal kalian temuin di tempat lain.`;
      } else {
        camCmd = `/camera close-up portrait 85mm /depth shallow DOF`;
        promptDetail = `Intimate 85mm portrait shot of @host_anchor looking warmly into the lens, inviting smile, soft bokeh background.`;
        voText = `[excited] Jangan sampai kelewatan kesempatan ini. Cek info selengkapnya sekarang dan rasakan sendiri pengalamannya!`;
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

  // LLM Direct Prompt for Gemini / Claude / GPT / DeepSeek / Kimi / Grok
  const llmDirectPrompt = `PROMPT SIAP COPY-PASTE KE ${llmModel.toUpperCase()}:

Anda adalah kreator UGC profesional. Buatkan naskah video ${targetDuration} tentang: "${topic}".
Karakter Host: ${hostName} (${hostVisualPrompt})
Gaya Kamera: ${chosenCam || "Handheld natural"}
Pencahayaan: ${lensLighting}
Format: Bahasa Indonesia percakapan santai, penuh energi dan ketulusan, lengkap dengan penanda emosi [excited], [warm], [pause].`;

  return {
    projectTitle: `${topic || "Proyek Video UGC"} — Panduan Produksi ${targetDuration}`,
    overview: `Paket panduan naskah dan arahan visual ${targetDuration} (${sceneCount} adegan) dengan alur terkoordinasi dan gaya percakapan yang alami.`,
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
      masterSettingPrompt: `Master Setting Reference: Beautiful aesthetic environment tailored for ${topic}, natural ${lensLighting}, true-to-life textures, cinematic architectural photography.`,
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
    llmDirectPrompt,
    operatorGuide: isLlmNative
      ? [
          `1. Salin prompt di tab 'Prompt LLM Langsung (${llmModel.toUpperCase()})'.`,
          `2. Buka aplikasi ${llmModel.toUpperCase()} pilihan Anda (Gemini, Claude, ChatGPT, DeepSeek, Kimi, atau Grok).`,
          `3. Tempelkan prompt ke chatbox untuk mendapatkan variasi naskah atau visual klip singkat seketika.`,
        ]
      : [
          "1. Buka Google Flow (flow.google / Veo 2 Studio).",
          "2. Masukkan Character Anchor ke '@host_anchor' dan Setting ke '@setting_anchor'.",
          "3. Tempelkan arahan kamera (/camera...) dan prompt scene di kotak input per adegan.",
          "4. Dengarkan audio naskah di BuatPrompt untuk memandu intonasi suara.",
        ],
  };
}
