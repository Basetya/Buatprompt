/**
 * BuatPrompt Engine Suite - Core Intelligent Prompt Engines
 * Advanced orchestration specialized for Google Flow (Veo 2 & Imagen 3), Midjourney v6.1, Kling, and Claude.
 */

// 1. AI Character & Object Anchor Studio (NEW GAME-CHANGER)
export interface CharacterAnchorParams {
  characterName: string;
  genderAndAge: string;
  ethnicityOrStyle: string;
  hairAndFace: string;
  outfitAndAccessories: string;
  signatureColors: string;
  targetModel?: "veo" | "imagen3" | "midjourney";
}

export function buildCharacterAnchorPrompt(params: CharacterAnchorParams): {
  turnaroundSheet: string;
  anchorToken: string;
  sceneIntegrationExample: string;
} {
  const { characterName, genderAndAge, ethnicityOrStyle, hairAndFace, outfitAndAccessories, signatureColors } = params;

  const anchorToken = `[CHARACTER ANCHOR: "${characterName}", ${genderAndAge}, ${ethnicityOrStyle}, ${hairAndFace}, wearing ${outfitAndAccessories}, color scheme: ${signatureColors}, locked facial landmarks, identical appearance continuity]`;

  const turnaroundSheet = `[BUATPROMPT STUDIO — MULTI-ANGLE CHARACTER TURNAROUND SHEET]
Subject: ${characterName}
Profile: ${genderAndAge}, ${ethnicityOrStyle}
Features: ${hairAndFace}
Attire: ${outfitAndAccessories}
Color Palette: ${signatureColors}

PROMPT FOR 4-ANGLE TURNAROUND SHEET (Generate in Imagen 3 / Midjourney):
"Character turnaround reference model sheet of ${characterName}, showing 4 distinct sequential angles side-by-side on a clean neutral gray studio background:
1. Full front view
2. 3/4 left perspective
3. 90-degree right side profile
4. Full back view
${hairAndFace}, wearing ${outfitAndAccessories} in ${signatureColors}. Crisp anatomical lines, photorealistic textures, studio three-point neutral softbox lighting, ultra-sharp 8k resolution, character concept sheet, master reference photography --ar 16:9 --style raw --v 6.1"`;

  const sceneIntegrationExample = `CONTOH PENERAPAN DI GOOGLE FLOW (VEO 2 & IMAGEN 3):
Setiap kali Anda membuat scene baru di Google Flow, tempelkan ANCHOR TOKEN ini di awal prompt:
"${anchorToken} sitting at a modern café table, drinking coffee, looking towards the window with natural morning light streaming in, slow cinematic dolly-in tracking shot on 50mm f/1.8 lens."`;

  return {
    turnaroundSheet,
    anchorToken,
    sceneIntegrationExample,
  };
}

// 2. Image-to-Video (I2V) Motion Director (NEW GAME-CHANGER)
export interface I2VMotionParams {
  primarySubject: string;
  desiredAction: string;
  cameraMovement: "dolly-in" | "dolly-out" | "orbit-pan" | "static-subtle" | "fpv-tracking";
  physicsDetails?: string; // e.g. "hair flutter, steam rising"
  pacingSpeed: "slow-cinematic" | "medium-dynamic" | "fast-impact";
}

export function buildI2VMotionPrompt(params: I2VMotionParams): string {
  const { primarySubject, desiredAction, cameraMovement, physicsDetails, pacingSpeed } = params;

  const cameraDescriptions: Record<string, string> = {
    "dolly-in": "Camera executes a steady, silky-smooth push-in dolly movement along the central optical axis (speed: 1.2x), increasing visual intimacy without distorting facial proportions.",
    "dolly-out": "Camera gently glides backwards in a subtle slow pull-out dolly, revealing environmental context while maintaining focus on the subject.",
    "orbit-pan": "Camera performs a subtle 15-degree orbital pan from left to right around the subject, creating realistic parallax depth between the foreground and background.",
    "static-subtle": "Camera remains static on a heavy studio tripod with micro handheld breathing motion (zero erratic shake).",
    "fpv-tracking": "Dynamic forward tracking motion following the movement trajectory with subtle lens motion blur."
  };

  return `[BUATPROMPT STUDIO — IMAGE-TO-VIDEO (I2V) MOTION DIRECTIVE FOR GOOGLE VEO 2 & KLING]
Target Input: Static Hero Frame

MOTION SEGMENTATION & PHYSICS PROTOCOL:
1. STATIC ANCHORS (DO NOT DEFORM):
   - Structural geometry, background architecture, facial bone structure, core clothing shape, and primary environmental layout remain rigidly locked.

2. DYNAMIC MICRO-PHYSICS (NATURAL ORGANIC MOTION):
   - ${desiredAction}
   - Secondary Dynamics: ${physicsDetails || "Subtle natural eye blink, gentle fabric wave, fluid surface shimmer, realistic hair strands reacting to subtle atmospheric breeze."}
   - Pacing: ${pacingSpeed.toUpperCase()} tempo with natural physical inertia (acceleration and smooth deceleration).

3. CAMERA OPTICS & VECTOR:
   - ${cameraDescriptions[cameraMovement] || cameraDescriptions["dolly-in"]}
   - Lens Characteristics: 35mm cinema lens, realistic optical motion blur on fast movements, zero warping or AI rubber-banding artifacts.

4. NEGATIVE MOTION GUARDS:
   - erratic jitter, melting limbs, morphing facial identity, unnatural body stretching, teleporting background objects, flicker, sudden geometry distortion.

COPY-PASTE I2V MOTION PROMPT:
"${desiredAction}. ${cameraDescriptions[cameraMovement]} Secondary micro-motion: ${physicsDetails || "natural eye blink and gentle clothing wave"}. Hyper-realistic physical motion dynamics, 24fps cinematic stability, flawless temporal coherence."`;
}

// 3. Full Cinema Production Bible (NEW GAME-CHANGER)
export interface CinemaPipelineParams {
  storyTitle: string;
  logline: string;
  genre: string;
  protagonist: string;
  totalShots?: number;
}

export function buildCinemaPipelinePrompt(params: CinemaPipelineParams): string {
  const { storyTitle, logline, genre, protagonist, totalShots = 3 } = params;

  return `[BUATPROMPT STUDIO — COMPLETE CINEMA PRODUCTION BIBLE]
========================================================================
PROJECT TITLE: "${storyTitle.toUpperCase()}"
LOGLINE: ${logline}
GENRE: ${genre.toUpperCase()} | TARGET FORMAT: 4K 24fps (Google Flow & Veo 2 Pipeline)
========================================================================

## MASTER ASSET LOCKS (BIBLE)
1. PROTAGONIST ANCHOR:
   - Descriptor: ${protagonist}
   - Master Token: [ANCHOR: "${protagonist}", locked facial landmarks, consistent wardrobe & lighting response]

2. WORLD ENVIRONMENT ANCHOR:
   - Visual Tone: High-contrast cinematic atmosphere, 35mm anamorphic aspect ratio, photorealistic color grading.

========================================================================
## SHOT-BY-SHOT PRODUCTION BREAKDOWN

--- [SHOT 1: THE HOOK / ESTABLISHING] (0:00 - 0:04) ---
• Shot Classification: Wide Establishing Shot | Lens: 24mm Anamorphic f/2.8
• Imagen 3 / Midjourney Still Frame Prompt (Frame 1):
  "Wide cinematic establishing shot of ${logline}, showing ${protagonist} in the distance, dramatic atmospheric lighting, volumetric depth, photorealistic, 8k --ar 16:9 --style raw"
• Google Veo 2 Motion Prompt (Image-to-Video):
  "Slow cinematic drone glide forward over the environment, wind gently moving atmospheric dust, protagonist turns slowly into the light. Smooth temporal motion, 24fps."
• Voiceover (VO) Script:
  "[INDONESIA]: Di tengah kesunyian ini, satu pilihan akan mengubah segalanya."
• Foley & Sound Design:
  "Ambient room tone, low sub-bass frequency drone, distant wind resonance."

--- [SHOT 2: THE CONFLICT / ACTION] (0:04 - 0:08) ---
• Shot Classification: Medium Over-The-Shoulder Dynamic Shot | Lens: 50mm Prime f/1.8
• Imagen 3 / Midjourney Still Frame Prompt (Frame 1):
  "Medium shot of ${protagonist} interacting with the central plot element, intense focused expression, high micro-contrast, studio rim light, cinematic chiaroscuro --ar 16:9 --style raw"
• Google Veo 2 Motion Prompt (Image-to-Video):
  "Handheld dynamic tracking shot, protagonist executes primary action with fluid natural speed, camera maintains tight focus on hands and face, realistic motion blur."
• Voiceover (VO) Script:
  "[INDONESIA]: Ketika waktu tidak lagi berpihak, keberanian adalah satu-satunya senjata."
• Foley & Sound Design:
  "Tactile mechanical click, rising strings crescendo, impactful audio riser."

--- [SHOT 3: THE CLIMAX / RESOLUTION] (0:08 - 0:12) ---
• Shot Classification: Hero Macro Close-Up | Lens: 85mm Prime f/1.4
• Imagen 3 / Midjourney Still Frame Prompt (Frame 1):
  "Hero close-up portrait of ${protagonist}, eyes reflecting golden cinematic light, razor sharp focal plane, creamy background bokeh, emotional intensity --ar 16:9 --style raw"
• Google Veo 2 Motion Prompt (Image-to-Video):
  "Ultra slow-motion push-in dolly zoom, protagonist looks directly into the lens with subtle breathing and micro-eyelash flutter, lighting flare glints softly across lens."
• Voiceover (VO) Script:
  "[INDONESIA]: Dan kini, saatnya kita membuktikannya sekarang juga."
• Foley & Sound Design:
  "Tonal release, sub-bass impact hit, acoustic reverb decay."

========================================================================
WORKFLOW EKSEKUSI DI GOOGLE FLOW:
Langkah 1: Salin "Imagen 3 Still Frame Prompt" untuk men-generate foto awal di Imagen 3.
Langkah 2: Masukkan foto hasil render ke Google Veo 2.
Langkah 3: Masukkan "Google Veo 2 Motion Prompt" ke box motion prompt Veo 2.
Hasilnya: Video sinematik berkesinambungan 100% konsisten tanpa distorsi!`;
}

// 4. Visual Forensic Inspector 2.0 (NEW GAME-CHANGER)
export interface ForensicInspectorParams {
  imageBase64: string;
}

export function buildForensicInspectorData() {
  return {
    cameraAndLens: {
      estimatedLens: "85mm Prime Anamorphic",
      aperture: "f/1.4 (Shallow Depth of Field)",
      sensorFormat: "35mm Full-Frame Cinema Sensor",
      framing: "Medium Close-Up (Cinematic Rule of Thirds)",
      distortion: "Zero spherical distortion, subtle anamorphic oval bokeh"
    },
    lightingRig: {
      keyLight: "45-degree Softbox Diffused (5600K Daylight)",
      fillLight: "Subtle bounce board (1:4 contrast ratio)",
      rimLight: "High-contrast Electric Violet / Cyan edge separation",
      ambientOcclusion: "Deep, pristine shadow roll-off with rich blacks"
    },
    hexPalette: [
      { hex: "#07080c", label: "Obsidian Deep Base" },
      { hex: "#6366f1", label: "Electric Indigo Key" },
      { hex: "#06b6d4", label: "Radiant Cyan Rim" },
      { hex: "#f8fafc", label: "Specular Highlight" }
    ],
    cameraMotionVector: {
      trajectory: "Linear Push-in Dolly Zoom (Z-Axis Forward)",
      speed: "1.2m/s Smooth Deceleration",
      angleChange: "15-degree orbital tilt"
    },
    prompts: {
      exactReplica: "Master commercial photograph of the hero subject, illuminated by 45-degree diffused key softbox and vibrant cyan rim lighting, shot on Hasselblad H6D-100c with 85mm f/1.4 lens, creamy circular bokeh, sharp micro-contrast, 8k resolution, award-winning lighting --ar 16:9 --style raw --v 6.1",
      commercialRemix: "Modern luxury commercial advertisement featuring high-end styling, floating weightless dynamic particles, atmospheric haze, volumetric violet edge lighting, pristine acrylic reflections, 8k hyper-realism",
      negativeGuards: "blur, low resolution, warped hands, oversaturated colors, flat lighting, digital noise, cartoon drawing, deformed eyes"
    }
  };
}

// 5. Existing Google Flow Multi-Shot Director Engine
export interface GoogleFlowDirectorParams {
  projectName: string;
  genre: string;
  characterAnchor?: string;
  setting: string;
  lightingTheme: string;
  pacing: string;
  includeAudio?: boolean;
}

export function buildGoogleFlowDirectorPrompt(params: GoogleFlowDirectorParams): string {
  const { projectName, genre, characterAnchor, setting, lightingTheme, pacing, includeAudio = true } = params;

  return `[BUATPROMPT STUDIO — GOOGLE FLOW (VEO 2) MULTI-SHOT MASTER DIRECTIVE]
Project: "${projectName}"
Visual Genre: ${genre.toUpperCase()} | Pacing: ${pacing}
Environment Setting: ${setting}
Master Lighting Setup: ${lightingTheme}
${characterAnchor ? `Character / Subject Anchor: ${characterAnchor} (Maintain strict physical consistency across all shots)` : ""}

=======================================================
SHOT 1 — THE ESTABLISHING FRAME (0:00 - 0:03)
Shot Type: Wide Cinematic Establishing Shot | Lens: 24mm Anamorphic Prime (f/2.8)
Camera Dynamics: Slow high-angle push-in tracking shot gliding smoothly towards the focal area.
Visual Staging: ${setting}, drenched in ${lightingTheme}. Volumetric atmospheric depth with soft dust motes and subtle motion in the background.
${characterAnchor ? `Focal Action: ${characterAnchor} emerges into frame, establishing presence with confident, natural momentum.` : "Focal Action: The environment awakens with subtle natural elements moving in continuous physical realism."}
${includeAudio ? `Synchronized Soundscape: Deep resonant ambient sub-bass drone layered with authentic environmental room tone and subtle wind resonance.` : ""}

=======================================================
SHOT 2 — THE ACTION & REACTION (0:03 - 0:07)
Shot Type: Medium Tracking Shot (Over-the-Shoulder / 45-degree angle) | Lens: 50mm Prime (f/1.8)
Camera Dynamics: Dynamic orbital pan maintaining tight synchronization with the primary movement, gradual acceleration.
Visual Staging: Sharp depth of field. Highlighting realistic textures, reflective surfaces, and specular highlights consistent with ${lightingTheme}.
${characterAnchor ? `Focal Action: ${characterAnchor} executes primary decisive action; hands and facial micro-expressions captured in high-fidelity motion.` : "Focal Action: The core event unfolds with heightened mechanical/fluid dynamics and dynamic particle motion."}
${includeAudio ? `Synchronized Soundscape: Crisp foley sound effects, tactile mechanical clicks/fluid splashes, rising harmonic synth swell.` : ""}

=======================================================
SHOT 3 — THE CLIMACTIC RESOLUTION & DETAIL (0:07 - 0:10)
Shot Type: Tight Cinematic Macro / Hero Close-Up | Lens: 85mm Prime (f/1.4)
Camera Dynamics: Ultra-smooth slow-motion dolly zoom (Vertigo effect) with creamy circular bokeh in background.
Visual Staging: Extreme close-up on the hero subject. High micro-contrast, subsurface scattering on skin/materials, pristine optical reflections.
Focal Action: Climax of the motion sequence, settling into a powerful, iconic, memorable resting frame.
${includeAudio ? `Synchronized Soundscape: Climax tonal release, pristine acoustic decay, reverberant impactful bass hit.` : ""}

=======================================================
NEGATIVE PROMPT & RENDER GUARDS (FOR GOOGLE FLOW):
blur, low resolution, warped hands, erratic camera jerkiness, floating artifacts, digital noise, unnatural face deformation, overexposed blown highlights, watermark, oversaturated colors.

OUTPUT RESOLUTION: 4K Ultra-HD 24fps, Aspect Ratio 16:9 Cinematic, Master Director Grade.`;
}

// 6. Universal Prompt Matrix
export interface PromptMatrixResult {
  googleFlow: string;
  midjourney: string;
  klingAi: string;
  claudeGpt: string;
}

export function buildUniversalPromptMatrix(concept: string, visualMood: string = "Cinematic Hyper-Realistic"): PromptMatrixResult {
  const cleanConcept = concept.trim();

  return {
    googleFlow: `[GOOGLE FLOW (VEO & IMAGEN 3) NATIVE DIRECTIVE]
Subject & Motion: ${cleanConcept}, meticulously detailed with physical motion dynamics.
Optics & Camera: Shot on 35mm anamorphic cinema lens, slow cinematic push-in dolly movement with smooth motion blur and subtle handheld authenticity.
Lighting: Volumetric studio rim lighting paired with soft diffused fill light, natural reflections and specular highlights.
Atmosphere: ${visualMood}, 8k UHD, rich cinematic color grade with deep obsidian shadows and warm specular highlights. Clean, photorealistic commercial masterpiece.`,

    midjourney: `/imagine prompt: ${cleanConcept}, ${visualMood}, master commercial photography, shot on Hasselblad H6D-100c, 85mm f/1.4 lens, dynamic rim lighting, dramatic chiaroscuro, volumetric haze, hyper-detailed textures, award winning composition --ar 16:9 --style raw --v 6.1 --stylize 250`,

    klingAi: `[KLING AI & RUNWAY GEN-3 MOTION PROMPT]
Camera Movement: Slow forward dolly tracking, camera orbit 15 degrees.
Motion Intensity: 6/10 (smooth natural flow without deformation).
Prompt: ${cleanConcept}, continuous physical motion, ${visualMood}, realistic physics, steady lighting continuity, 4K 60fps cinematic render.`,

    claudeGpt: `You are an elite creative director and visual architect.
Role: Produce a world-class production brief based on: "${cleanConcept}".
Format: Provide (1) Scene Concept, (2) Camera Framing & Lenses, (3) Color Grading Palette, and (4) Emotional Resonance for modern digital audiences.`
  };
}

// 7. Viral Hook & Retention Engineer
export interface ViralHookParams {
  productOrTopic: string;
  targetPlatform: "tiktok" | "reels" | "shorts";
  hookStyle: "curiosity-gap" | "pattern-interrupt" | "controversy" | "transformation";
}

export function buildViralHookPrompt(params: ViralHookParams): string {
  const { productOrTopic, targetPlatform, hookStyle } = params;

  return `[BUATPROMPT STUDIO — VIRAL RETENTION & HOOK BLUEPRINT]
Target Platform: ${targetPlatform.toUpperCase()}
Topic / Product: "${productOrTopic}"
Selected Hook Strategy: ${hookStyle.toUpperCase()}

=======================================================
VARIASI 1: THE CURIOSITY GAP (Penahan Scroll 0-3 Detik)
- Hook Verbal (Voiceover): "Kebanyakan orang salah mengira [masalah umum], padahal rahasianya ada di sini..."
- Visual Action (Frame 1): Kamera zoom-in mendadak ke ekspresi terkejut / objek yang disembunyikan di balik tangan.
- On-Screen Text (Bold Typography): "JANGAN SCROLL DULU! 🛑"
- Sound Design: Sound effect 'Record Scratch' atau 'Whoosh Sub-Bass'.
- Mengapa Efektif: Membuka 'open-loop' di otak audiens sehingga mereka terdorong menonton hingga terjawab di detik 10.

=======================================================
VARIASI 2: THE PATTERN INTERRUPT (Anti-Boring Visual)
- Hook Verbal (Voiceover): "Stop buang-buang uang untuk ${productOrTopic} sebelum kamu tahu trik ini!"
- Visual Action (Frame 1): Aksi dramatis yang tidak biasa (misal: melempar produk lama ke keranjang, atau gesture tangan 'stop' langsung ke lensa).
- On-Screen Text (Neon Text): "STOP KETIPU LAGI! ⚠️"
- Sound Design: Sound effect 'Glitch' atau 'Impact Thud'.
- Mengapa Efektif: Menghentikan refleks jempol pengguna yang terbiasa scroll cepat dengan visual kontras tinggi.

=======================================================
VARIASI 3: THE BEFORE/AFTER TRANSFORMATION
- Hook Verbal (Voiceover): "Dari kondisi kayak gini... jadi kayak gini cuma dalam hitungan hari?!"
- Visual Action (Frame 1): Layar split-screen tajam menunjukkan kontras problem vs hasil nyata.
- On-Screen Text: "HASILNYA BIKIN KAGET 😱"
- Sound Design: Sound effect 'Ting!' ceria di detik kedua.
- Call To Action (Detik 10-15): "Cek link keranjang kuning sekarang sebelum kehabisan batch hari ini!"`;
}

// 8. Vision System Prompt
export function getVisionSystemPrompt(params: {
  mediaType: "image" | "video";
  targetModel?: "veo" | "imagen3" | "midjourney" | "kling" | "sora" | "runway";
  language?: "id" | "en";
  mode?: "short" | "long";
}) {
  const { mediaType, targetModel = "veo", language = "id", mode = "short" } = params;

  if (mediaType === "video") {
    return `You are a world-class AI Director and Cinematic Prompt Architect specialized in Google Flow (Google Veo 2), Kling AI, Sora, and Runway Gen-3.
Deconstruct the video into:
1. Core Subject & Continuous Physical Motion
2. Camera Optics & Exact Movement
3. Lighting Setup & Specular Reflections
4. Color Grade & Visual Textures
5. Output Director Prompt in English and Indonesian summary.`;
  }

  return `You are an elite AI Visual Analyst and Optical Prompt Engineer specialized in Google Flow (Imagen 3) and Midjourney v6.1.
Deconstruct the image into:
1. Subject Anatomical Precision & Materials
2. Environment Depth & Composition
3. Photographic Lens & Framing (e.g. 85mm f/1.4)
4. Lighting Rig (3-point studio softbox, rim light)
5. Production-ready prompt for Google Flow and Midjourney.`;
}

// 9. Infographic & Sales Page & Storyboard Engines
export function buildInfographicPrompt(params: any): string {
  return `[BUATPROMPT STUDIO — INFOGRAPHIC 20-POINT ARCHITECTURE]
Headline: "${params.title}"
Subjudul: ${params.subtitle || "(generate otomatis)"}
Tujuan: ${params.purpose} | Format: ${params.format} | Gaya: ${params.style} | Rasio: ${params.ratio}
CTA: ${params.cta || "Simpan untuk Nanti →"}
Poin Isi: ${params.points || "(generate 3–5 poin bernilai tinggi)"}
Hasilkan SATU prompt gambar infografis 20-poin siap salin dengan header, hero icon, content cards, palet warna harmonis, dan footer CTA box.`;
}

export function buildSalesPagePrompt(params: any): string {
  return `[BUATPROMPT STUDIO — HIGH-CONVERSION SALES ARCHITECTURE]
Produk: "${params.namaProduk}" | Kategori: ${params.jenisProduk} | Tujuan: ${params.tujuan}
Deskripsi: ${params.deskripsi || "Solusi premium teruji"}
Target: ${params.target || "Konsumen modern"} | Harga: ${params.harga || "Penawaran Terbaik"} | CTA: ${params.cta || "Dapatkan Sekarang"}
Buatkan naskah sales page 16 bagian lengkap (Hook, Agitation, Solution, Benefits, Proof, FAQ, CTA).`;
}

export function buildStoryboardPrompt(params: any): string {
  return `[BUATPROMPT STUDIO — COMMERCE STORYBOARD BLUEPRINT]
Produk: "${params.productName}" | Platform: ${params.platform.toUpperCase()} | Tone: ${params.tone} | Durasi: ${params.duration}
Buatkan storyboard 3-beat (Scene 1 Hook 0-3s, Scene 2 Demo 3-8s, Scene 3 CTA 8-10s) lengkap dengan arahan visual kamera, teks voiceover, on-screen text, dan caption/hashtag viral.`;
}

export function buildColoringBookPrompt(params: any): string {
  return `[BUATPROMPT STUDIO — PRINTABLE COLORING BOOK ENGINE]
Tema: ${params.theme} | Usia: ${params.age} | Halaman: ${params.pageCount} hal.
Buatkan satu dokumen HTML utuh (HTML/CSS/JS) dengan inline SVG sketsa hitam-putih tebal siap cetak/unduh PDF (@media print).`;
}

export function buildGamePrompt(params: any): string {
  return `[BUATPROMPT STUDIO — HTML5 CANVAS MINI-GAME ENGINE]
Tema: ${params.theme} | Usia: ${params.age} | Gameplay: ${params.gameType}
Buatkan satu file HTML utuh mini-game interaktif ramah sentuh dengan audio Web Audio API, skor, dan pesan menang.`;
}

export function buildOptimizerPrompt(rawPrompt: string, targetAi: string = "Google Flow & Gemini"): string {
  return `[BUATPROMPT STUDIO — MASTER PROMPT REFINERY]
Prompt Mentah: "${rawPrompt}" | Target: ${targetAi}
Tulis ulang menjadi OPTIMIZED PROMPT lengkap dengan Persona, Context, Action Steps, dan Negative Constraints.`;
}
