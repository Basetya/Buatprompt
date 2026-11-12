import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface UgcFlowGenerateRequest {
  topic: string;
  targetDuration: "60s" | "90s" | "120s";
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
      topic = "Seaside Resort Luxury Project",
      targetDuration = "60s",
      styleGenre = "cinematic-resort",
      hostType = "female-pro",
      customHostDescription = "",
      cameraArchetype = "auto",
      clarificationAnswers = {},
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Jumlah scene berdasarkan durasi (60s = 6 scene, 90s = 8 scene, 120s = 10 scene)
    const sceneCount = targetDuration === "120s" ? 10 : targetDuration === "90s" ? 8 : 6;
    const durPerScene = Math.round(parseInt(targetDuration) / sceneCount);

    // Host description synthesis
    let hostName = "Presenter Utama";
    let hostVisualPrompt = "";
    if (hostType === "male-casual") {
      hostName = "Bimo / Male Casual Architect";
      hostVisualPrompt =
        "Indonesian male creator in late 20s, natural groomed short black hair, casual smart navy linen shirt, silver watch, authentic friendly smile, natural skin micro-texture, visible pores, medically accurate facial anatomy, professional documentary lighting.";
    } else if (hostType === "female-pro") {
      hostName = "Sarah / Female Luxury Presenter";
      hostVisualPrompt =
        "Indonesian female luxury host in late 20s, elegant modern beige blazer over silk top, subtle minimalist jewelry, natural polished ponytail hair, warm articulate expression, natural skin subsurface scattering, realistic eye catchlights, flawless anatomy.";
    } else if (hostType === "cartoon-3d-animation") {
      hostName = "Stylized 3D Character Host";
      hostVisualPrompt =
        "Charming stylized 3D animated character host, Pixar-quality subsurface scattering, soft studio lighting, expressive facial mechanics, vibrant textured fabric clothing, friendly large expressive eyes.";
    } else {
      hostName = "Custom Host";
      hostVisualPrompt = customHostDescription || "Professional on-camera presenter with authentic human realism.";
    }

    const clarificationSummary = Object.entries(clarificationAnswers)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const systemPrompt = `Anda adalah Master Executive Director Google Flow (Veo 2) dan Lead Scriptwriter AI Video kelas dunia.
Tugas Anda adalah menghasilkan master blueprint produksi 100% UTUH dan PRESISI TANPA KOREKSI untuk pitch pembuatan video UGC / Sinematik berdurasi ${targetDuration} (${sceneCount} scenes).

ATURAN WAJIB NASKAH & PENGETAHUAN LOKASI (GROUNDING):
- Jika topik menyebutkan tempat/hotel/proyek nyata (contoh: "The Ululani Bali" / "The Rich Prada" di Pecatu Indah Resort Bali dekat Pantai Dreamland/Balangan/Bingin dan New Kuta Golf):
  WAJIB masukkan FAKTA ASLI LOKASI TERSEBUT ke dalam naskah! Jangan buat naskah generik fiktif. Sebutkan nama tempat, suasana tebing Pecatu, akses pantai surfer, dan keunikan aslinya.
- GAYA BICARA UGC AUTENTIK & ANTUSIAS: Naskah harus terdengar seperti kreator/host UGC sungguhan yang antusias, cerdas, dan persuasif ("Kalian bayangin...", "Ini salah satu hidden-gem paling underrated di Uluwatu...", "View sunset dari tebing ini bener-bener magis!"). HINDARI BAHASA ROBOTIK/FORMAL SKRIPSI!
- Sertakan jeda napas [pause] dan emosi [warm], [excited], [curious], [whisper], [confident].

ATURAN STRUKTUR PROMPTING GOOGLE FLOW:
1. CHARACTER BOARD PROMPT (@host_anchor): Master Prompt anatomi ultra-realistis (visible pores, micro-details, 85mm portrait, zero AI plastic skin, anti-hallucination) dengan tag konsistensi @host_anchor.
2. OBJECT / ENVIRONMENT BOARD PROMPT (@setting_anchor / @hero_object): Konsistensi arsitektur, lanskap, material, pencahayaan sesuai klarifikasi user. Jika user memilih NONE untuk hero object, jelaskan bahwa adegan bebas berganti-ganti.
3. PER-SCENE STORYBOARD DIRECTIVE (${sceneCount} scenes):
   Tiap scene wajib menyertakan:
   - Durasi & Timing (misal Scene 1: 00:00 - 00:${durPerScene < 10 ? "0" + durPerScene : durPerScene})
   - Voiceover Script (Bahasa Indonesia hidup & antusias)
   - Flow Command & Camera Operator: Gunakan sintaks slash command resmi Google Flow (/camera, /lens, /motion, /lighting, @host_anchor, @hero_object). IMPLEMENTASIKAN SUDUT KAMERA & MANUVER YANG DIPILIH USER DI KLARIFIKASI SECARA DETAIL!
   - Master Visual Prompt (English untuk Veo 2 / Imagen 3) dengan kualitas 8K, cinematic lighting, photorealism.
   - Soundscape & Foley Prompt.
   - Negative Constraints.
5. STEP-BY-STEP FLOW OPERATOR GUIDE: Panduan copy-paste ke Google Flow / Gemini.

Keluarkan dalam format JSON:
{
  "projectTitle": "string",
  "overview": "string",
  "totalDuration": "${targetDuration}",
  "hostProfile": {
    "name": "${hostName}",
    "anchorTag": "@host_anchor",
    "masterCharacterPrompt": "string (ultra photorealistic English prompt for Imagen/Veo)",
    "negativePrompt": "string"
  },
  "environmentProfile": {
    "name": "Setting & Landscape Anchor",
    "anchorTag": "@setting_anchor",
    "masterSettingPrompt": "string",
    "negativePrompt": "string"
  },
  "objectProfile": {
    "name": "Hero Architecture / Product Object",
    "anchorTag": "@hero_object",
    "masterObjectPrompt": "string"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "timeRange": "string",
      "stageName": "HOOK",
      "voiceoverScriptId": "string (bahasa indonesia lengkap dengan intonasi)",
      "cameraDirective": "string (/camera command dll)",
      "flowVisualPrompt": "string (English ready to paste to Google Flow)",
      "audioSoundscapePrompt": "string",
      "keyVisualBeat": "string"
    }
  ],
  "googleFlowOperatorGuide": [
    "Langkah 1: ...",
    "Langkah 2: ...",
    "Langkah 3: ..."
  ]
}`;

    const userPromptContent = `TOPIC: "${topic}"
DURASI: ${targetDuration}
GENRE: ${styleGenre}
HOST: ${hostType} (${hostVisualPrompt})

HASIL KLARIFIKASI & PILIHAN KAMERA USER:
${clarificationSummary}

Hasilkan JSON produksi utuh sekarang juga.`;

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
        console.warn("Gemini live generation failed, fallback to offline director template:", geminiErr);
      }
    }

    // High-End Hardened Offline Template
    const fallbackData = generateGoldenMasterFallback({
      topic,
      targetDuration,
      styleGenre,
      hostName,
      hostVisualPrompt,
      sceneCount,
      durPerScene,
      clarificationAnswers,
    });

    return NextResponse.json({ success: true, data: fallbackData, engine: "director-golden-base" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function generateGoldenMasterFallback(params: any) {
  const {
    topic,
    targetDuration,
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
  const isOrbit = chosenCam.toLowerCase().includes("360 orbit");
  const isDutch = chosenCam.toLowerCase().includes("dutch angle");
  const isPOV = chosenCam.toLowerCase().includes("pov");

  const lensLighting =
    clarificationAnswers.visualLensAndLighting ||
    "Golden Hour Rim-Light + 85mm Prime Bokeh";
  const heroLandmark =
    clarificationAnswers.heroObjectOrFeature ||
    "Kompleks bangunan & infinity pool menghadap laut lepas";
  const voiceTone =
    clarificationAnswers.paceAndVoiceTone ||
    "Prestisius & Berwibawa [warm authoritative]";

  const scenes = [];
  const stages = [
    { name: "HOOK & SIGNATURE MANEUVER", desc: "Membuka adegan dengan manuver kamera sinematik utama" },
    { name: "PROBLEM / THE VISION GAP", desc: "Presenter berjalan menjelaskan nilai eksklusif" },
    { name: "ARCHITECTURAL HERO REVEAL", desc: "Kamera mengeksplorasi hero object & panorama" },
    { name: "INTERIOR LUXURY & DETAIL", desc: "Transisi ke dalam ruangan dengan pencahayaan halus" },
    { name: "PRIVATE AMENITIES & LIFESTYLE", desc: "Fasilitas premium dan lanskap lingkungan" },
    { name: "AUTHORITATIVE CTA & CLOSING", desc: "Presenter di titik terbaik mengundang tindakan eksklusif" },
  ];

  for (let i = 0; i < sceneCount; i++) {
    const stage = stages[i % stages.length];
    const sStart = i * durPerScene;
    const sEnd = (i + 1) * durPerScene;
    const timeRange = `00:${sStart < 10 ? "0" + sStart : sStart} - 00:${sEnd < 10 ? "0" + sEnd : sEnd}`;

    let camCmd = `/camera push-in 50mm smooth dolly | /motion natural walking | /lighting golden-hour rim-light`;
    let promptDetail = "";
    let voText = "";

    if (i === 0) {
      if (isLowAngle) {
        camCmd = `/camera low-angle knee-height pedestal-up 24mm wide /tilt +25-deg looking up at @host_anchor /lighting dramatic rim-light`;
        promptDetail = `Dramatic low-angle cinematic pedestal shot looking up from terrace level toward @host_anchor who stands tall against the monumental seaside architecture. Blue skies and sweeping ocean backdrop create a towering sense of prestige, 8K documentary realism.`;
      } else if (isOrbit) {
        camCmd = `/camera 360-orbit continuous fluid arc 35mm /radius 3m /elevation eye-level /motion presenter turning smoothly`;
        promptDetail = `Seamless 360-degree rotating arc shot circling @host_anchor who gestures gracefully as panoramic sea cliff view and infinity pool rotate smoothly in background, true-to-life reflections, ultra-high fidelity.`;
      } else if (isDutch) {
        camCmd = `/camera dutch-angle 15-deg tilt 35mm handheld tracking /shutter 1/120s high kinetic tension`;
        promptDetail = `Dynamic 15-degree Dutch angle tracking shot capturing @host_anchor striding confidently across modern cantilevered deck, dramatic angled horizon line, intense cinematic visual energy.`;
      } else if (isPOV) {
        camCmd = `/camera first-person POV 28mm forward walking /motion subtle organic breathing sway /interact presenter turns to greet`;
        promptDetail = `Immersive first-person POV shot stepping out through open glass doors onto sunset terrace, @host_anchor turns around to greet the viewer directly with a warm welcoming smile.`;
      } else {
        // Default: Bird-Eye Drone Descent
        camCmd = `/camera drone 150m high bird-eye descent -> continuous seamless crane tilt-down to eye-level 35mm /speed 1.2x to 0.8x deceleration`;
        promptDetail = `Extreme wide aerial drone shot descending rapidly from 150m above ocean waves over rocky sea cliff down to the front courtyard of modern seaside luxury resort, decelerating smoothly to eye-level medium-shot in front of @host_anchor who turns to camera with engaging confident expression. Golden hour sunlight reflecting off glass facades, natural ocean spray mist, ultra-realistic architectural render, 8K, documentary fidelity.`;
      }
      voText = `Pernahkah Anda membayangkan sebuah mahakarya yang menentang batas antara arsitektur dan alam liar? [pause] Selamat datang di babak baru seaside luxury.`;
    } else if (i === 1) {
      camCmd = `/camera tracking medium-shot 50mm walking backward with presenter /lighting warm soft fill 5600K`;
      promptDetail = `Medium-shot continuous tracking backward as @host_anchor walks gracefully along cantilevered teak wood terrace of @setting_anchor. In the background, panoramic infinity pool blends seamlessly with ocean horizon. Realistic cloth simulation, subtle sea breeze moving hair, true-to-life skin texture, visible pores, Leica Summilux lens bokeh.`;
      voText = `Bukan sekadar resor biasa, [curious] tapi sebuah konsep yang dirancang untuk mereka yang menolak standar rata-rata.`;
    } else if (i === 2) {
      camCmd = `/camera 360-orbit slow arc 35mm /elevation 15-degrees /lighting amber specular glint`;
      promptDetail = `Cinematic slow arc orbit shot showcasing @hero_object and multi-tier cascading infinity pool, crystal clear water with realistic caustics, modern brutalist stone and teak architecture, palm trees swaying gently, authentic sunset hues across tropical sky, National Geographic architectural standard.`;
      voText = `Setiap inci memperhitungkan arah datangnya cahaya alami, ketahanan material terhadap garam laut, dan privasi tanpa cela.`;
    } else if (i === 3) {
      camCmd = `/camera indoor glide through glass slider 24mm to 50mm transition /lighting interior ambient mood`;
      promptDetail = `Smooth indoor camera glide entering presidential villa suite, revealing custom Italian marble surfaces, floor-to-ceiling retractable glass doors opening to private sea terrace. @host_anchor lightly gestures toward the horizon view, natural fabric draping, hyper-detailed ambient shadows.`;
      voText = `Interior dirancang mengalir tanpa sekat. Ketika kaca panoramik digeser, ruang tamu dan cakrawala samudra menyatu sempurna.`;
    } else if (i === 4) {
      camCmd = `/camera low-angle pedestal rise 35mm /atmosphere ocean mist haze /lens anamorphic flare`;
      promptDetail = `Low-angle cinematic pedestal shot of cliffside private pier and sunset lounge. Gentle turquoise waves crashing against rocky shoreline below with realistic water physics and white foam spray. Luxury yacht anchored in the calm bay, photorealistic commercial masterpiece, 4K 24fps.`;
      voText = `Dermaga privat, helipad akses cepat, dan sunset lounge yang hanya bisa diakses oleh mereka yang memiliki kunci eksklusif ini.`;
    } else {
      camCmd = `/camera slow push-in close-up 85mm portrait /lighting golden hour rim highlight /depth shallow DOF`;
      promptDetail = `Intimate cinematic 85mm portrait shot of @host_anchor standing on oceanfront viewpoint with warm sunset glow on face and hair. Looking directly into lens with authoritative inviting smile. Perfect eye catchlights, micro skin wrinkles, physically accurate anatomy, elegant seaside background softly blurred.`;
      voText = `Unit tahap perdana ini hanya tersedia bagi sepuluh pemilik pertama. Hubungi tim kami hari ini untuk mengamankan private viewing Anda.`;
    }

    scenes.push({
      sceneNumber: i + 1,
      timeRange,
      stageName: stage.name,
      voiceoverScriptId: voText,
      cameraDirective: camCmd,
      flowVisualPrompt: promptDetail,
      audioSoundscapePrompt: `Ambient sound of rhythmic ocean swells, gentle coastal wind breeze, crisp footsteps on teak wood, distant seagull cries, subtle cinematic warm string cello swell.`,
      keyVisualBeat: stage.desc,
    });
  }

  return {
    projectTitle: `${topic} — Master Google Flow UGC Pitch Directive`,
    overview: `Paket directive produksi lengkap 100% konsisten untuk Google Flow (Veo 2) dengan kontrol pergerakan kamera ekstrim (${chosenCam || "/camera drone descent"}), konsistensi karakter (@host_anchor), objek hero (@hero_object), dan naskah persuasi bertempo tinggi.`,
    totalDuration: targetDuration,
    hostProfile: {
      name: hostName,
      anchorTag: "@host_anchor",
      masterCharacterPrompt: `Master Character Reference: ${hostVisualPrompt} Master positive photorealism foundation: Real human anatomy with medically accurate proportions, natural skin texture with visible pores and subtle micro-imperfections, realistic eye iris with catchlights, individual hair strands, physically plausible pose, 85mm portrait lens, DSLR 8K fidelity, documentary National Geographic realism.`,
      negativePrompt: `cgi appearance, 3d render look, plastic smooth skin, beauty filter, distorted face, asymmetrical eyes, missing fingers, extra limbs, unrealistic anatomy, oversaturated colors, watermark, text overlays.`,
    },
    environmentProfile: {
      name: "Seaside Resort Landscape Anchor",
      anchorTag: "@setting_anchor",
      masterSettingPrompt: `Master Environment Reference: Modern high-end luxury seaside resort built on dramatic rocky ocean cliffside, cascading infinity pool, floor-to-ceiling glass pavilions, warm weathered teak decking, native tropical coastal vegetation, panoramic azure sea meeting sunset horizon, ${lensLighting}, photorealistic architectural photography.`,
      negativePrompt: `blurry background, flat lighting, unrealistic water textures, cartoon architecture, bad perspective, jagged edges.`,
    },
    objectProfile: {
      name: "Hero Architecture & Masterplan",
      anchorTag: "@hero_object",
      masterObjectPrompt: `Master Object Reference: ${heroLandmark}, pristine finishing, ultra-sharp focus, true-to-life reflections and refraction.`,
    },
    scenes,
    googleFlowOperatorGuide: [
      "1. Buka Google Flow (flow.google / Veo 2 Studio).",
      "2. Daftarkan Anchor Board: Masukkan Character Prompt ke '@host_anchor', Environment ke '@setting_anchor', dan Hero Object ke '@hero_object'.",
      "3. Di prompt box, panggil sinematografi: Paste '/camera...' dan prompt scene yang sudah terintegrasi sudut manuver pilihan user.",
      "4. Generate per-scene. Gunakan konsistensi tag @ untuk menjaga bentuk tidak berubah antar scene.",
      "5. Putar preview voiceover di BuatPrompt untuk sinkronisasi audio naskah.",
    ],
  };
}
