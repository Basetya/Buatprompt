import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VideoAiEngine, LlmModelType } from "../ugc-flow-clarify/route";

interface UgcFlowGenerateRequest {
  topic: string;
  targetDuration: "<=10s" | "<=60s" | "<=120s" | ">120s";
  engineTarget: VideoAiEngine;
  llmModel?: LlmModelType;
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

    // Engine syntax guidance helper
    let engineSpecificInstruction = "";
    if (engineTarget === "runway-gen3") {
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
        "Format prompt untuk Google Flow (Veo 2): Gunakan slash command resmi (/camera, /lens, /motion, /lighting) serta tag konsistensi @host_anchor dan @setting_anchor.";
    }

    const systemPrompt = `Anda adalah Master Creative Video Director & Multi-Engine Prompt Architect kelas dunia (Hyper-Smart AI Video Director).
Tugas: Hasilkan rancangan video UGC terstruktur yang 100% SIAP EKSEKUSI SEKALI PROMPT LANGSUNG JADI tanpa perlu revisi manual untuk format durasi ${targetDuration} (${sceneCount} scene).
Target Engine Pilihan Kreator: ${engineTarget.toUpperCase()} ${isLlmNative ? `(LLM: ${llmModel.toUpperCase()})` : ""}

PANDUAN KHUSUS ENGINE:
${engineSpecificInstruction}

HUKUM MUTLAK KAUSALITAS AUDIO-VISUAL & SINKRONISASI FISIK (ZERO PHANTOM SFX):
1. ZERO PHANTOM SFX: Dilarang keras memunculkan suara foley atau efek suara (seperti: bunyi gigitan, kriuk 'kress', patahan kentang, tegukan, decit, denting, tap layar) TANPA ADA AKSI FISIK VISUAL YANG JELAS terlihat di layar pada detik tersebut!
2. JIKA ADA SUARA MAKANAN (CRUNCH / KRIUK / MAKAN / MINUM):
   - Deskripsi visual prompt WAJIB menyebutkan aksi fisiknya secara eksplisit, nyata, dan kronologis:
     * Opsi A (Snapping): "@host_anchor snaps the golden crispy @hero_object in half directly in front of the macro lens with both hands, visibly fracturing the crunchy crust with subtle crumbs and steam, directly causing and synchronizing with the crisp crunch sound."
     * Opsi B (Biting): "@host_anchor brings the crispy @hero_object to her mouth, takes an authentic crisp bite into the food visibly fracturing the crust with tiny crumbs falling, followed by an ecstatic reaction of delight."
   - DILARANG KERAS hanya menulis "@host_anchor holding the food and smiling" jika soundscape berbunyi kriuk/gigitan! Penonton dan model video AI wajib melihat momen kentang digigit atau dipatahkan agar sinkron 100%.
3. KRONOLOGI BEAT PER DETIK (ACTION TIMELINE):
   - Terutama untuk durasi pendek (<=10s) atau adegan reveal/hook, deskripsi visual prompt HARUS memiliki urutan kronologis yang jelas:
     Misal: "[00:00-00:03]: Host shows @hero_object enthusiastically to camera. [00:03-00:06]: Host visibly snaps or bites @hero_object in macro close-up, triggering the loud crisp sound. [00:06-00:10]: Host smiles in satisfaction and delivers the warm punchline."
4. PEMISAHAN BICARA & AKSI FISIK (NO TALKING WHILE CHEWING):
   - Karakter tidak boleh digambarkan bicara panjang saat mulutnya sedang mengunyah makanan.
   - Gunakan jeda napas [pause] di naskah dialog saat aksi fisik gigit/patahkan terjadi.

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
      "voiceoverScriptId": "string (naskah bahasa indonesia hidup dengan jeda [pause])",
      "cameraDirective": "string (/camera command atau instruksi framing sesuai ${engineTarget})",
      "flowVisualPrompt": "string (Prompt visual hiper-sinkron dengan urutan kronologi aksi dan aksi fisik penyebab suara)",
      "audioSoundscapePrompt": "string (Sound effect foley yang sinkron persis dengan aksi visual)",
      "keyVisualBeat": "string"
    }
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
          // Hyper-Smart Audio-Visual Causality & Physical Action Lock
          enforceAudioVisualCausality(parsed.scenes, topic);

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
    });

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
