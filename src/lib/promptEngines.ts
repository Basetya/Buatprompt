/**
 * BuatPrompt Engine Suite - Core Intelligent Prompt Engines
 * Advanced orchestration specialized for Google Flow (Veo 2 & Imagen 3), Midjourney v6.1, Kling, and Claude.
 */

// 1. 1-Click Product to 5 Viral Angles (GAME CHANGER FOR SOLOPRENEURS)
export interface MultiAngleParams {
  productName: string;
  productBenefit: string;
  targetAudience?: string;
  targetPlatform?: "tiktok" | "reels" | "shorts";
}

export interface VideoAngleCard {
  angleName: string;
  psychologyHook: string;
  veoPrompt: string;
  elevenLabsVoiceover: string;
  capcutCaptions: string;
  tiktokCaptionAndTags: string;
}

export function buildMultiAngleCampaign(params: MultiAngleParams): {
  productName: string;
  angles: VideoAngleCard[];
} {
  const { productName, productBenefit, targetAudience = "Audiens umum pembeli online", targetPlatform = "tiktok" } = params;

  return {
    productName,
    angles: [
      {
        angleName: "ANGLE 1: THE SKEPTICAL REVIEWER (Rasa Ragu Menjadi Bukti)",
        psychologyHook: "Mengakomodasi keraguan audiens sebelum mereka skeptis duluan.",
        veoPrompt: `[GOOGLE FLOW (VEO 2) DIRECTIVE]
Subject: Real person in casual everyday clothes examining ${productName} with slight furrowed brow of skepticism, then expression relaxes into genuine pleasantly surprised smile.
Optics: 35mm cinema lens, handheld camera movement with subtle natural shake, switching to slow push-in dolly zoom.
Lighting: Natural daylight coming from side window, realistic skin texture and true-to-life reflections on ${productName}.
Action Pacing: Medium shot, subjek membuka kemasan, menguji penggunaan produk dengan teliti, mengangguk puas. 4K 24fps natural realism.`,
        elevenLabsVoiceover: `Jujur ya, awalnya gue mikir produk ini cuma overclaim kayak yang lain. Tapi setelah coba sendiri buat ${productBenefit}, hasilnya beneran di luar ekspektasi. Nggak nyesel sama sekali coba ini.`,
        capcutCaptions: `0:00 - AWALNYA SAYA PIKIR GIMMICK! 🤨
0:03 - COBAIN LANGSUNG BUAT ${productBenefit.toUpperCase()}
0:07 - TERNYATA HASILNYA SEBAGUS INI 😱
0:10 - LINK DI KERANJANG KUNING SEKARANG 👇`,
        tiktokCaptionAndTags: `Kira-kira beneran worth it nggak ya? 🤔 Ternyata ${productName} beneran nolong banget buat ${productBenefit}! Cobain deh mumpung masih ready batch ini. #RekomendasiProduk #ViralDiTikTok #ReviewJujur #TikTokShopIndo #RacunTikTok`
      },
      {
        angleName: "ANGLE 2: THE SHOCKING PATTERN INTERRUPT (Anti-Boring Penahan Scroll)",
        psychologyHook: "Menghentikan refleks scroll jempol audiens di detik pertama dengan peringatan darurat.",
        veoPrompt: `[GOOGLE FLOW (VEO 2) DIRECTIVE]
Subject: Sudden dynamic movement, hand sharply reaching out towards the lens gesturing 'STOP' with palm, then pulling back to reveal ${productName} floating in center frame.
Optics: 24mm wide angle lens with dramatic motion blur and high dynamic range.
Lighting: High-contrast dramatic studio lighting with vibrant neon rim light cutting across the silhouette of ${productName}.
Action Pacing: Fast snap zoom in frame 1, settling into smooth 360-degree orbital pan around the hero product. Master cinematic commercial, 4K 24fps.`,
        elevenLabsVoiceover: `Stop buang-buang uang kamu sebelum nonton video ini! Kalau kamu lagi cari solusi buat ${productBenefit}, jangan asal pilih sebelum kenal produk yang satu ini.`,
        capcutCaptions: `0:00 - STOP BUANG UANG! 🛑
0:03 - JANGAN ASAL BELI SEBELUM TAHU INI
0:07 - RAHASIA ${productBenefit.toUpperCase()} LEBIH CEPAT
0:10 - JANGAN SAMPAI NYESEL KEHABISAN ⚡`,
        tiktokCaptionAndTags: `Nyesel banget baru tahu sekarang! 😭 Jangan sampai salah pilih lagi ya guys. Cek keranjang kuning mumpung harganya lagi diskon! #TipsBermanfaat #HatiHatiBeli #WajibTahu #SolusiPraktis #PromoSpesial`
      },
      {
        angleName: "ANGLE 3: LUXURY AESTHETIC CINEMATIC B-ROLL (Sensori ASMR Visual)",
        psychologyHook: "Menyentuh kepuasan visual dan audio audiens dengan estetika komersial mewah.",
        veoPrompt: `[GOOGLE FLOW (VEO 2) DIRECTIVE]
Subject: Ultra-detailed macro commercial shot of ${productName} resting on a premium dark matte granite pedestal.
Optics: 85mm macro lens f/1.4, razor-sharp focal plane, creamy circular optical bokeh in the background.
Lighting: Volumetric golden hour studio softbox paired with delicate specular rim light accentuating textures and branding details.
Action Pacing: Ultra-smooth slow-motion glide forward (100fps slow-motion feel), subtle atmospheric mist and delicate dust motes catching the warm light. Pristine 4K cinematic luxury spot.`,
        elevenLabsVoiceover: `Ketenangan dimulai saat kamu memilih kualitas terbaik. Dibuat khusus untuk menyempurnakan hari kamu dengan ${productBenefit}. Rasakan perbedaannya sekarang.`,
        capcutCaptions: `0:00 - THE ART OF LUXURY ✨
0:03 - DIRANCANG KHUSUS UNTUK KUALITAS TERBAIK
0:07 - HASIL NYATA: ${productBenefit.toUpperCase()}
0:10 - UPGRADE SEKARANG JUGA 🛒`,
        tiktokCaptionAndTags: `Definisi ada harga ada kualitas ✨ Buat kamu yang selalu mengutamakan kesempurnaan. Cek detailnya di bio atau keranjang kuning ya! #AestheticVibes #LuxuryLifestyle #CinematicProduct #RekomendasiPremium #SelfCare`
      },
      {
        angleName: "ANGLE 4: RELATABLE POV DRAMA (Keseharian yang Terbantu)",
        psychologyHook: "Menghubungkan masalah sehari-hari yang dialami jutaan orang dengan solusi produk.",
        veoPrompt: `[GOOGLE FLOW (VEO 2) DIRECTIVE]
Subject: POV first-person perspective, hand picking up ${productName} from a busy work desk / kitchen counter amid morning routine.
Optics: 28mm natural eye-level lens, smooth organic camera movement simulating human perspective.
Lighting: Warm home ambient daylight, authentic cozy atmosphere without artificial studio flatness.
Action Pacing: Subject effortlessly uses ${productName}, visible sigh of relief and satisfaction, placing it down neatly. 4K 24fps authentic slice-of-life.`,
        elevenLabsVoiceover: `POV: Kamu akhirnya nemu satu barang yang bikin rutinitas harian nggak lagi bikin pusing. Ngebantu banget pas lagi butuh ${productBenefit}. Hidup jadi jauh lebih sat-set!`,
        capcutCaptions: `0:00 - POV: AKHIRNYA NEMU PENYELAMAT! 🥺
0:03 - RUTINITAS JADI LEBIH GAMPANG
0:07 - SOLUSI BUAT ${productBenefit.toUpperCase()}
0:10 - CEK DI LINK BIO / KERANJANG!`,
        tiktokCaptionAndTags: `Siapa yang relate banget sama masalah ini? 🙋‍♂️ Sekarang rutinitas harian jadi jauh lebih santai berkat ${productName}. Save video ini biar nggak lupa! #POVLife #LifeHacksIndo #TipsHarian #RutinitasPraktis #AnakKantor`
      },
      {
        angleName: "ANGLE 5: FLASH SALE URGENCY (Pemicu Keputusan Cepat)",
        psychologyHook: "Memicu FOMO (Fear of Missing Out) dengan batas waktu dan diskon kuota terbatas.",
        veoPrompt: `[GOOGLE FLOW (VEO 2) DIRECTIVE]
Subject: High-energy product showcase, hands rapidly packing ${productName} into sleek packaging with unboxing satisfaction, sticker label applied smoothly.
Optics: 35mm dynamic prime, fast rhythmic snap-cuts, energetic push-in transitions.
Lighting: Bright high-key commercial lighting, saturated vibrant highlights, clean modern pop aesthetic.
Action Pacing: Fast-paced rhythmic movement, product presented proudly directly to the lens with thumbs-up gesture. 4K high kinetic energy.`,
        elevenLabsVoiceover: `Pemberitahuan kilat! Stok ${productName} untuk promo kali ini sisa sedikit banget. Kalau kamu mau dapat diskon spesial buat ${productBenefit}, langsung amankan pesanan sekarang sebelum harga kembali normal.`,
        capcutCaptions: `0:00 - PROMO KILAT HARI INI! ⚡
0:03 - SISA STOK TERBATAS BANGET
0:07 - SPESIAL BUAT ${productBenefit.toUpperCase()}
0:10 - KLIK KERANJANG KUNING SEKARANG! 🏃‍♂️`,
        tiktokCaptionAndTags: `Jangan sampai gigit jari pas harga udah naik normal lagi! 🏃‍♂️ Amankan promo diskon ${productName} sekarang juga sebelum kehabisan slot. #FlashSale #DiskonSpesial #PromoTikTokShop #MurahBanget #BorongSekarang`
      }
    ]
  };
}

// 2. 7-Day Content Sprint & Bulk Calendar Engine
export interface SprintParams {
  channelNiche: string;
  heroProduct: string;
}

export function buildSevenDaySprint(params: SprintParams): string {
  const { channelNiche, heroProduct } = params;

  return `[BUATPROMPT STUDIO — 7-DAY CONTENT SPRINT CALENDAR]
NICHE: ${channelNiche.toUpperCase()} | HERO PRODUCT: "${heroProduct}"
STRATEGI: Siklus 1 Minggu Penuh Menghindari Shadowban & Memaksimalkan Penjualan

HARI 1: EDUKASI MASALAH (The Problem Agitator)
• Fokus: Mengupas 1 masalah utama yang dialami audiens tanpa langsung jualan hard-sell.
• Hook: "3 Kebiasaan sepele yang bikin [masalah] makin parah setiap hari..."
• Visual Prompt: 35mm cinema lens, close-up ekspresi audiens merasa terganggu dengan masalah, pencahayaan moody.
• Call to Action: "Tulis di kolom komentar, kamu sering ngalamin nomor berapa?"

HARI 2: DEBUNKING MITOS (The Truth Teller)
• Fokus: Membongkar salah kaprah umum di niche ${channelNiche}.
• Hook: "Stop percaya kalau mau [hasil] harus pakai cara ribet ini!"
• Visual Prompt: Split screen visual kontras antara cara lama yang gagal vs cara baru yang cerdas.
• Call to Action: "Share video ini ke temen kamu yang masih pakai cara lama!"

HARI 3: THE HERO REVEAL (Solusi Spotlight)
• Fokus: Memperkenalkan ${heroProduct} sebagai jawaban tuntas atas masalah Hari 1 & 2.
• Hook: "Ini barang yang bikin hidup gue jauh lebih santai 7 hari terakhir..."
• Visual Prompt: Macro 85mm f/1.4 commercial B-Roll, lighting studio lembut, demo pemakaian halus.
• Call to Action: "Cek keranjang kuning sekarang mumpung masih ready stock."

HARI 4: BEFORE / AFTER TRANSFORMATION (Social Proof)
• Fokus: Menampilkan bukti perubahan nyata sebelum dan sesudah menggunakan produk.
• Hook: "Dari kondisi kayak gini... jadi kayak gini cuma dalam hitungan hari?!"
• Visual Prompt: Visual transisi halus stop-motion atau match-cut sinematik 4K.
• Call to Action: "Jangan tunda lagi, buktikan sendiri perubahannya hari ini."

HARI 5: FLASH SALE URGENCY (Direct Hard Sell)
• Fokus: Menembak audiens yang sudah hangat dengan dorongan diskon / promo terbatas.
• Hook: "Khusus yang nonton video ini sebelum jam 12 malam nanti!"
• Visual Prompt: Energetic snap zoom, unboxing cepat, kemasan siap kirim, high-key commercial lighting.
• Call to Action: "Klik keranjang kuning sekarang sebelum promo ditutup otomatis!"

HARI 6: PRO TIP / SECRET HACK (Nilai Tambah Eksklusif)
• Fokus: Memberikan tips rahasia cara memaksimalkan pemakaian ${heroProduct}.
• Hook: "Rahasia memaksimalkan ${heroProduct} yang jarang orang tahu!"
• Visual Prompt: POV first-person perspective, detail tangan menggunakan fitur khusus produk.
• Call to Action: "Save video ini biar nggak lupa pas barangnya sampai di rumah!"

HARI 7: COMMUNITY Q&A (Interaksi & Engagement)
• Fokus: Menjawab pertanyaan umum dari calon pembeli yang masih ragu.
• Hook: "Banyak yang nanya di DM: 'Kak, ${heroProduct} beneran tahan lama nggak sih?'"
• Visual Prompt: Kamera handheld natural santai, uji ketahanan produk di depan kamera.
• Call to Action: "Masih ada pertanyaan? Tulis di komen, langsung gue jawab!"`;
}

// 3. AI Character & Object Anchor Studio
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

// 4. Image-to-Video (I2V) Motion Director
export interface I2VMotionParams {
  primarySubject: string;
  desiredAction: string;
  cameraMovement: "dolly-in" | "dolly-out" | "orbit-pan" | "static-subtle" | "fpv-tracking";
  physicsDetails?: string;
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

// 5. Full Cinema Production Bible
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

// 6. Visual Forensic Inspector 2.0
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

// 7. Google Flow Multi-Shot Director Engine
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

// 8. Universal Prompt Matrix
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

// 9. Viral Hook & Retention Engineer
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

VARIASI 1: THE CURIOSITY GAP (0-3s)
- Hook Verbal: "Kebanyakan orang salah mengira [masalah], padahal solusinya..."
- Visual Action: Zoom-in mendadak ke ekspresi terkejut di Frame 1.
- Text On Screen: "JANGAN SCROLL DULU! 🛑"

VARIASI 2: THE PATTERN INTERRUPT
- Hook Verbal: "Stop buang uang kamu buat ${productOrTopic} sebelum tahu ini!"
- Visual Action: Tangan bergerak tajam ke arah kamera 'STOP'.
- Text On Screen: "STOP KETIPU LAGI! ⚠️"

VARIASI 3: BEFORE / AFTER TRANSFORMATION
- Hook Verbal: "Dari kayak gini... jadi kayak gini cuma dalam hitungan hari?!"
- Visual Action: Split screen kontras problem vs hasil nyata.
- CTA: "Cek keranjang kuning sekarang mumpung batch promo masih ready!"`;
}

// 10. Vision System Prompt
export function getVisionSystemPrompt(params: {
  mediaType: "image" | "video";
  targetModel?: "veo" | "imagen3" | "midjourney" | "kling" | "sora" | "runway";
  language?: "id" | "en";
  mode?: "short" | "long";
}) {
  const { mediaType } = params;
  if (mediaType === "video") {
    return `You are a world-class AI Director specialized in Google Flow (Veo 2). Output camera moves, lighting, motion dynamics, and clean director prompt.`;
  }
  return `You are an elite AI Visual Analyst specialized in Google Flow (Imagen 3) and Midjourney v6.1. Deconstruct optics, lighting rig, framing, and master prompt.`;
}

// 11. Helper Prompts (Infografis, Sales Page, Storyboard, Coloring Book, Game, Optimizer)
export function buildInfographicPrompt(params: any): string {
  return `[BUATPROMPT STUDIO — INFOGRAPHIC 20-POINT ARCHITECTURE]
Headline: "${params.title}" | Format: ${params.format} | Gaya: ${params.style}
Poin: ${params.points || "(generate 3–5 poin bernilai tinggi)"}
Buatkan prompt gambar infografis 20-poin rapi siap salin.`;
}

export function buildSalesPagePrompt(params: any): string {
  return `[BUATPROMPT STUDIO — HIGH-CONVERSION SALES ARCHITECTURE]
Produk: "${params.namaProduk}" | Kategori: ${params.jenisProduk}
Buatkan naskah sales page 16 bagian lengkap (Hook, Agitation, Solution, Benefits, Proof, FAQ, CTA).`;
}

export function buildStoryboardPrompt(params: any): string {
  return `[BUATPROMPT STUDIO — COMMERCE STORYBOARD BLUEPRINT]
Produk: "${params.productName}" | Platform: ${params.platform}
Buatkan storyboard 3-beat (Hook, Demo, CTA) lengkap dengan visual kamera, voiceover, teks layar, dan hashtag.`;
}

export function buildColoringBookPrompt(params: any): string {
  return `[BUATPROMPT STUDIO — PRINTABLE COLORING BOOK ENGINE]
Tema: ${params.theme} | Usia: ${params.age}
Buatkan satu file HTML utuh dengan inline SVG sketsa hitam-putih tebal siap unduh PDF (@media print).`;
}

export function buildGamePrompt(params: any): string {
  return `[BUATPROMPT STUDIO — HTML5 CANVAS MINI-GAME ENGINE]
Tema: ${params.theme} | Gameplay: ${params.gameType}
Buatkan satu file HTML utuh mini-game interaktif anak siap main di browser.`;
}

export function buildOptimizerPrompt(rawPrompt: string, targetAi: string = "Google Flow & Gemini"): string {
  return `[BUATPROMPT STUDIO — MASTER PROMPT REFINERY]
Prompt: "${rawPrompt}" | Target: ${targetAi}
Tulis ulang menjadi OPTIMIZED PROMPT lengkap dengan Persona, Context, Action Steps, dan Negative Constraints.`;
}

// ============================================================================
// 12. WORLD-CLASS CREATOR DREAM SUITE (6 GROUNDBREAKING ENGINES)
// ============================================================================

// A. ElevenLabs Emotion & Audio Director
export interface ElevenLabsAudioParams {
  rawScript: string;
  toneStyle: "dramatic-suspense" | "hyped-excitement" | "warm-storyteller" | "curious-whisper" | "luxury-monologue";
  pacingSpeed: "relaxed" | "natural" | "punchy-fast";
}

export interface ElevenLabsAudioResult {
  formattedScriptWithTags: string;
  sliderSettings: {
    stability: number;
    claritySimilarity: number;
    styleExaggeration: number;
    speakerBoost: boolean;
  };
  pacingNotes: string;
}

export function buildElevenLabsEmotionPrompt(params: ElevenLabsAudioParams): ElevenLabsAudioResult {
  const { rawScript, toneStyle, pacingSpeed } = params;

  let tagsPrefix = "";
  let sliderSettings = { stability: 0.40, claritySimilarity: 0.85, styleExaggeration: 0.45, speakerBoost: true };

  switch (toneStyle) {
    case "curious-whisper":
      tagsPrefix = "[soft conspiratorial whisper, leaning close to mic] ";
      sliderSettings = { stability: 0.30, claritySimilarity: 0.90, styleExaggeration: 0.55, speakerBoost: true };
      break;
    case "hyped-excitement":
      tagsPrefix = "[energetic punch, rapid upbeat cadence] ";
      sliderSettings = { stability: 0.35, claritySimilarity: 0.80, styleExaggeration: 0.65, speakerBoost: true };
      break;
    case "luxury-monologue":
      tagsPrefix = "[deep velvety baritone, deliberate serene cadence] ";
      sliderSettings = { stability: 0.65, claritySimilarity: 0.95, styleExaggeration: 0.25, speakerBoost: true };
      break;
    case "dramatic-suspense":
      tagsPrefix = "[intense gravelly whisper, breathless pause] ";
      sliderSettings = { stability: 0.32, claritySimilarity: 0.88, styleExaggeration: 0.50, speakerBoost: true };
      break;
    default:
      tagsPrefix = "[warm engaging conversational tone, natural inflection] ";
      sliderSettings = { stability: 0.50, claritySimilarity: 0.85, styleExaggeration: 0.35, speakerBoost: true };
      break;
  }

  // Enrich sentences with cadence markers
  const sentences = rawScript
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  const enriched = sentences.map((s, idx) => {
    if (idx === 0) return `${tagsPrefix}${s} [pause: 0.5s]`;
    if (idx === 1 && toneStyle === "dramatic-suspense") return `[sudden realization, pitch drops] ${s} [pause: 0.7s]`;
    if (idx === sentences.length - 1) return `[confident punchy resolution, smile in voice] ${s}`;
    return `[natural breath] ${s} [pause: 0.4s]`;
  }).join("\n\n");

  return {
    formattedScriptWithTags: enriched,
    sliderSettings,
    pacingNotes: `Kecepatan Pacing: ${pacingSpeed.toUpperCase()} | Gunakan model ElevenLabs Multilingual v2 dengan Speaker Boost ON untuk menonjolkan frekuensi mikro vokal.`
  };
}

// B. Soundscape & Foley Cue-Sheet
export interface FoleySoundscapeParams {
  videoDuration: "15s" | "30s" | "60s";
  videoTheme: string;
  musicEnergy: "high-energy-phonk" | "dark-ambient-drone" | "cinematic-orchestral" | "upbeat-commercial-pop";
}

export interface FoleyCueItem {
  timestamp: string;
  category: "IMPACT" | "WHOOSH" | "FOLEY" | "UI / ALERT" | "RISER";
  soundName: string;
  searchKeyword: string;
  actionTrigger: string;
}

export interface FoleySoundscapeResult {
  bgmRecommendation: {
    genre: string;
    targetBpm: string;
    duckingAdvice: string;
  };
  cues: FoleyCueItem[];
}

export function buildFoleySoundscapePrompt(params: FoleySoundscapeParams): FoleySoundscapeResult {
  const { videoDuration, videoTheme, musicEnergy } = params;

  const bgmMap: Record<string, { genre: string; targetBpm: string; duckingAdvice: string }> = {
    "high-energy-phonk": {
      genre: "Drift Phonk / Aggressive Bass",
      targetBpm: "130 - 138 BPM",
      duckingAdvice: "Duck BGM ke -18dB saat ada naskah suara; dorong kembali ke -6dB pada jeda transisi hook."
    },
    "dark-ambient-drone": {
      genre: "Cinematic Low Frequency Mystery Drone",
      targetBpm: "80 - 90 BPM Ambient",
      duckingAdvice: "Volume stabil di -16dB, biarkan sub-bass 40Hz mengisi kekosongan naskah."
    },
    "cinematic-orchestral": {
      genre: "Modern Hybrid Hans Zimmer Braam & Strings",
      targetBpm: "110 - 120 BPM Building",
      duckingAdvice: "Automate volume perlahan naik (crescendo) di 5 detik terakhir video menuju klimaks."
    },
    "upbeat-commercial-pop": {
      genre: "Modern Minimalist Indie Pop Beat",
      targetBpm: "118 - 124 BPM",
      duckingAdvice: "Duck BGM ke -20dB di bawah dialog; beri aksen rimshot pada teks on-screen."
    }
  };

  const cues: FoleyCueItem[] = [
    {
      timestamp: "0:00",
      category: "IMPACT",
      soundName: "Deep Cinematic Sub-Bass Drop + Fast Whoosh",
      searchKeyword: "Bass Drop / Whoosh Hit",
      actionTrigger: "Detik ke-1 frame pembuka saat teks hook muncul menahan scroll."
    },
    {
      timestamp: "0:03",
      category: "FOLEY",
      soundName: "Crisp Camera Shutter Snap / Paper Rip",
      searchKeyword: "Camera Shutter / Paper Tear",
      actionTrigger: "Perubahan angle pertama atau saat foto/produk hero ditampilkan."
    },
    {
      timestamp: "0:07",
      category: "WHOOSH",
      soundName: "High-Velocity Swoosh Transition",
      searchKeyword: "Fast Swish / Whip Pan",
      actionTrigger: "Transisi cepat antara masalah ke demonstrasi solusi."
    },
    {
      timestamp: "0:11",
      category: "RISER",
      soundName: "Tension Synth Pitch Riser",
      searchKeyword: "Short Riser / Tension Swell",
      actionTrigger: "Membangun urgensi penonton sebelum instruksi Call to Action."
    },
    {
      timestamp: videoDuration === "15s" ? "0:13" : "0:25",
      category: "UI / ALERT",
      soundName: "Cash Register 'Ka-ching!' / Clean Glass Ding",
      searchKeyword: "Cash Register / Bell Ding",
      actionTrigger: "Kemunculan stiker keranjang kuning atau panah CTA."
    }
  ];

  return {
    bgmRecommendation: bgmMap[musicEnergy] || bgmMap["high-energy-phonk"],
    cues
  };
}

// C. TikTok & Reels Safe-Zone Optics Architect
export interface SafeZoneOpticsParams {
  subjectConcept: string;
  targetPlatform: "tiktok-9-16" | "reels-9-16" | "shorts-9-16";
  visualAtmosphere: string;
}

export interface SafeZoneOpticsResult {
  safeZoneEngineeredPrompt: string;
  viewportAllocation: {
    topHeaderMargin: string;
    upperFocalZone: string;
    rightInteractionClearance: string;
    bottomNegativeSpace: string;
  };
  antiObstructionDirective: string;
}

export function buildSafeZoneOpticsPrompt(params: SafeZoneOpticsParams): SafeZoneOpticsResult {
  const { subjectConcept, targetPlatform, visualAtmosphere } = params;

  return {
    safeZoneEngineeredPrompt: `[BUATPROMPT STUDIO — SAFE-ZONE OPTICS MASTER DIRECTIVE]
Platform: ${targetPlatform.toUpperCase()} Vertical Viewport (9:16 Aspect Ratio)
Subject Focal Point: ${subjectConcept}
Atmosphere: ${visualAtmosphere}

OPTICAL FRAMING RULES (ANTI-OBSTRUCTION ENFORCED):
- Viewport Composition: Hero subject locked strictly in the UPPER-MIDDLE 60% vertical frame (Z-plane centered, golden ratio optical elevation).
- Bottom Negative Space: The bottom 25% of the frame is rendered as clean, high-contrast dark negative space with subtle dark gradient falloff (to ensure TikTok captions, sound name, and shopping bag overlay NEVER obscure hero details).
- Right Side Clearance: 15% margin on the right edge kept deliberately clear of critical facial features or branded text (preventing collision with Like, Comment, Bookmark, and Share button columns).
- Optics & Lens: Shot on 35mm vertical cinema anamorphic lens, f/1.8 aperture, edge sharpness, no distortion on human anatomy.
- Target Model: Google Flow (Veo 2 & Imagen 3) vertical 9:16 master render --ar 9:16`,
    viewportAllocation: {
      topHeaderMargin: "10% Area Kosong Atas (Aman dari bar tab Following/For You)",
      upperFocalZone: "60% Golden Center (Lokasi Wajah / Produk Utama Bebas Halangan)",
      rightInteractionClearance: "15% Margin Kanan Bebas (Aman dari Tombol Like, Comment, Share)",
      bottomNegativeSpace: "25% Area Bawah Gelap / Minimalis (Aman dari Judul Akun, Teks Caption, dan Keranjang Kuning)"
    },
    antiObstructionDirective: "Hindari meletakkan teks grafis atau detail mikro penting di bawah koordinat Y=75% karena akan tertimpa antarmuka aplikasi media sosial."
  };
}

// D. Hook A/B Test Splitter (3 Pembuka Berbeda, 1 Isi Video)
export interface HookSplitterParams {
  coreTopicOrProduct: string;
  coreBenefitOrSecret: string;
}

export interface HookVariant {
  tag: string;
  hookType: string;
  openingVerbalScript: string;
  openingVisualPrompt: string;
  onScreenTextBadge: string;
}

export interface HookSplitterResult {
  hookVariants: HookVariant[];
  sharedBodyAndCta: {
    bodyTransition: string;
    bodyVerbal: string;
    ctaVerbal: string;
    ctaVisual: string;
  };
}

export function buildHookSplitterPrompt(params: HookSplitterParams): HookSplitterResult {
  const { coreTopicOrProduct, coreBenefitOrSecret } = params;

  return {
    hookVariants: [
      {
        tag: "HOOK A (VISUAL SHOCK & PATTERN INTERRUPT)",
        hookType: "Sensori Cepat Pembunuh Refleks Scroll",
        openingVerbalScript: "STOP scroll jempol kamu 3 detik! Jangan buang-buang uang sebelum kamu lihat rahasia ini.",
        openingVisualPrompt: `Extreme macro close-up, sharp sudden whip-pan towards the camera lens, hands dynamically presenting ${coreTopicOrProduct} with volumetric neon rim lighting, 4K high kinetic energy.`,
        onScreenTextBadge: "STOP BUANG UANG! 🛑"
      },
      {
        tag: "HOOK B (CONTRARIAN & DEBUNKING STATEMENT)",
        hookType: "Membalikkan Asumsi Umum Audiens",
        openingVerbalScript: "Hampir 90% orang salah mikir kalau mau hasil bagus harus repot, padahal cara rahasianya sesederhana ini...",
        openingVisualPrompt: `Split-screen visual: Sisi kiri orang tampak frustrasi dengan metode lama yang gagal, sisi kanan subjek tersenyum memegang ${coreTopicOrProduct} dengan pencahayaan hangat natural.`,
        onScreenTextBadge: "90% ORANG KETIPU?! 😱"
      },
      {
        tag: "HOOK C (THE CURIOSITY GAP & PERSONAL CONFESSION)",
        hookType: "Membuka Rahasia Eksklusif Bernilai Tinggi",
        openingVerbalScript: "Jujur gue baru berani buka rahasia ini sekarang, setelah coba sendiri buat ${coreBenefitOrSecret}...",
        openingVisualPrompt: `Low-angle intimate documentary camera framing, 35mm lens, subject leans forward toward camera speaking conspiratorially in cozy ambient room tone.`,
        onScreenTextBadge: "RAHASIA BARU KEBONGKAR 🤫"
      }
    ],
    sharedBodyAndCta: {
      bodyTransition: "Detik 0:03 - Masuk ke Bagian Isi Utama (Gunakan klip video yang sama untuk ketiga hook):",
      bodyVerbal: `Ternyata kuncinya ada di ${coreTopicOrProduct}. Beneran ngebantu banget terutama buat ${coreBenefitOrSecret}. Praktis, sat-set, dan hasilnya langsung kerasa nyata tanpa ribet.`,
      ctaVerbal: "Mumpung stok batch promo masih ada, langsung amankan di keranjang kuning sekarang sebelum kembali harga normal!",
      ctaVisual: "Hero product resting in center frame, smooth slow dolly zoom-out, thumbs-up gesture, clean lighting."
    }
  };
}

// E. Faceless Cash-Cow Storytelling Pipeline
export interface CashCowStoryParams {
  niche: "dark-psychology" | "stoic-philosophy" | "historical-mystery" | "sci-fi-lore" | "true-crime";
  storyTopic: string;
}

export interface CashCowAct {
  actName: string;
  timeRange: string;
  narrativeScript: string;
  cinematicVisualPrompt: string;
  soundscapeVibe: string;
}

export interface CashCowStoryResult {
  storyTitle: string;
  niche: string;
  loopRetentionScore: string;
  acts: CashCowAct[];
}

export function buildCashCowStoryPrompt(params: CashCowStoryParams): CashCowStoryResult {
  const { niche, storyTopic } = params;

  return {
    storyTitle: `The Enigma of: ${storyTopic}`,
    niche: niche.toUpperCase(),
    loopRetentionScore: "98.4% (Engineered for Infinite Retention Loop)",
    acts: [
      {
        actName: "ACT 1: THE INFINITE LOOP HOOK",
        timeRange: "0:00 - 0:06",
        narrativeScript: `Di tahun 1923, sebuah dokumen rahasia ditemukan terkunci di ruang bawah tanah... dan kalimat pertamanya mengatakan bahwa kamu yang mendengar ini sedang diperhatikan.`,
        cinematicVisualPrompt: `Dark moody atmospheric cinema shot, antique rusted iron safe slowly swinging open in a dusty candlelight cellar, volumetric dust motes, chiaroscuro lighting, shot on 35mm anamorphic prime lens, 8K hyper-realism.`,
        soundscapeVibe: "Deep resonant bass drone + distant metal screech"
      },
      {
        actName: "ACT 2: THE UNKNOWN DISCOVERY",
        timeRange: "0:06 - 0:20",
        narrativeScript: `Para ilmuwan awalnya mengabaikan catatan tersebut sebagai paranoia biasa. Sampai mereka menyadari... setiap nama yang tertulis di halaman itu mengalami fenomena yang persis sama.`,
        cinematicVisualPrompt: `Close-up macro shot of weathered aged parchment with handwritten cryptic symbols, flickering amber candlelight, extreme texture details, slow tracking camera push-in.`,
        soundscapeVibe: "Subtle vintage clock ticking + heartbeat thud"
      },
      {
        actName: "ACT 3: THE PARADOX ESCALATION",
        timeRange: "0:20 - 0:42",
        narrativeScript: `Aturannya hanya satu: begitu kamu mengetahui cara kerjanya, alam bawah sadarmu tidak akan pernah bisa melupakannya. Dan inilah bagian yang paling mengerikan...`,
        cinematicVisualPrompt: `Silhouette of a lone mysterious figure standing before an enormous obsidian obsidian monolith in foggy misty night, backlit by cold cyan rim light, eerie cinematic depth.`,
        soundscapeVibe: "Rising pitch dissonant synth strings"
      },
      {
        actName: "ACT 4: THE MIND-BENDING CLIMAX & SEAMLESS LOOP",
        timeRange: "0:42 - 0:60",
        narrativeScript: `Mereka mencoba memusnahkan semua salinannya. Tapi satu dokumen berhasil lolos dan tersimpan kembali... persis di tempat awal ceritanya dimulai...`,
        cinematicVisualPrompt: `The heavy iron vault door slams shut with explosive force in slow motion, returning to the exact shadowy opening frame. Ready to seamlessly replay from second 0:00.`,
        soundscapeVibe: "Heavy impact blast + sudden acoustic silence (creating instant loop addiction)"
      }
    ]
  };
}

// F. High-CTR Cover & Thumbnail Architect
export interface ThumbnailArchitectParams {
  videoTopic: string;
  targetCategory: string;
  visualVibe: "hyper-contrast-pop" | "dark-enigmatic" | "curiosity-shock" | "luxury-prestige";
}

export interface ThumbnailArchitectResult {
  oneFrameMasterPrompt: string;
  suggestedThreeWordHeadlines: string[];
  colorPsychologyStack: {
    primaryAccent: string;
    backgroundContrast: string;
    eyeMagnetColor: string;
  };
  opticalFramingAdvice: string;
}

export function buildThumbnailArchitectPrompt(params: ThumbnailArchitectParams): ThumbnailArchitectResult {
  const { videoTopic, targetCategory, visualVibe } = params;

  return {
    oneFrameMasterPrompt: `[BUATPROMPT STUDIO — HIGH-CTR THUMBNAIL MASTER PROMPT]
Subject: High-impact iconic visual representation of "${videoTopic}". Center-weighted hero composition with hyperbolic micro-details and dramatic silhouette separation.
Optics & Lighting: Shot on Hasselblad H6D-100c with 85mm f/1.4 lens, hyper-sharp foreground focal plane, creamy circular optical bokeh. Ultra-vibrant dual rim lighting (Electric Cyan on left, Radiant Amber on right) cutting against an obsidian dark backdrop.
Composition: Rule-of-thirds facial gaze looking slightly off-camera with intense intrigue, zero visual clutter, 8k resolution, award-winning commercial masterwork --ar 9:16 --v 6.1 --stylize 300`,
    suggestedThreeWordHeadlines: [
      "JANGAN BELI INI! 🛑",
      "TERNYATA PALSU?! 😱",
      "RAHASIA 10 DETIK ⚡",
      "STOP BIKIN GINI! ⚠️",
      "AWAS KETIPU LAGI! 🔥"
    ],
    colorPsychologyStack: {
      primaryAccent: "#FACC15 (Vibrant Warning Yellow — Memancing refleks perhatian instan)",
      backgroundContrast: "#07080C (Deep Cosmic Obsidian — Membuat objek meloncat keluar)",
      eyeMagnetColor: "#06B6D4 (Electric Cyan Rim Light — Memberikan kesan futuristik berkelas)"
    },
    opticalFramingAdvice: "Letakkan teks judul 3-kata di sepertiga atas gambar (Y: 20-35%) dengan font sans-serif ultra-bold ber-outline hitam tebal untuk keterbacaan 100% pada layar HP ukuran 5 inci."
  };
}

// G. Kinetic Motion Graphic Studio & In-Browser Video Exporter
export interface KineticMotionParams {
  headlineText: string;
  subText?: string;
  metricValue?: string;
  motionStyle: "apple-keynote" | "fintech-alpha" | "cyber-hud" | "stoic-gold";
  durationSec?: number;
}

export interface KineticMotionResult {
  headline: string;
  motionStyle: string;
  standaloneHtmlCode: string;
  designRationale: string;
  capcutOverlayGuide: string;
}

export function buildKineticMotionPrompt(params: KineticMotionParams): KineticMotionResult {
  const {
    headlineText,
    subText = "Formula rahasia yang tidak pernah dibagikan di kelas gratisan.",
    metricValue = "+340%",
    motionStyle,
    durationSec = 6
  } = params;

  const styleNames = {
    "apple-keynote": "Apple Keynote Minimalist (Pure Luxury & Typography Shift)",
    "fintech-alpha": "Wall Street / FinTech Alpha (Dynamic Live Chart & Counting Metric)",
    "cyber-hud": "Cyberpunk HUD Terminal (Typewriter Glitch & Data Scanlines)",
    "stoic-gold": "Dark Stoic & Warm Ember (Floating Organic Fireflies & Bronze Serif)"
  };

  const standaloneHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetic Motion Graphic - BuatPrompt</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #08090d;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .viewport-9-16 {
      width: 360px;
      height: 640px;
      background: radial-gradient(circle at 50% 30%, #151824 0%, #08090d 80%);
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,0.08);
      position: relative;
      overflow: hidden;
      padding: 36px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      font-size: 11px;
      font-family: monospace;
      color: #94a3b8;
      width: fit-content;
    }
    .headline {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: #ffffff;
      animation: kineticSlideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .metric {
      font-size: 48px;
      font-family: monospace;
      font-weight: 900;
      color: #10b981;
      text-shadow: 0 0 30px rgba(16,185,129,0.3);
      margin: 16px 0;
    }
    .subtext {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .progress-bar {
      height: 3px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #ffffff;
      width: 0%;
      animation: fillProgress ${durationSec}s linear forwards;
    }
    @keyframes kineticSlideUp {
      0% { opacity: 0; transform: translateY(30px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fillProgress {
      0% { width: 0%; }
      100% { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="viewport-9-16">
    <div class="badge">● BUATPROMPT KINETIC</div>
    <div>
      <h1 class="headline">${headlineText}</h1>
      <div class="metric">${metricValue}</div>
      <p class="subtext">${subText}</p>
    </div>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
  </div>
</body>
</html>`;

  return {
    headline: headlineText,
    motionStyle: styleNames[motionStyle] || motionStyle,
    standaloneHtmlCode: standaloneHtml,
    designRationale: "Menghilangkan kesan 'AI slop' dengan proporsi tipografi ketat, easing cubic-bezier mewah, dan elemen visual bertingkat yang menarik retensi mata penonton.",
    capcutOverlayGuide: "Untuk dijadikan overlay transparan di CapCut: gunakan blend mode 'Screen' atau 'Lighten' di atas klip video B-Roll Anda."
  };
}

// H. Multi-Scene Kinetic Video Story Engine (Full-Length 24-30s)
export interface MultiSceneStoryParams {
  topicIdea: string;
  targetNiche?: string;
  motionStyle?: "apple-keynote" | "fintech-alpha" | "cyber-hud" | "stoic-gold";
}

export interface KineticStoryScene {
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

export interface MultiSceneStoryResult {
  topic: string;
  wordCount: number;
  estimatedVoiceSeconds: number;
  isTooLong: boolean;
  warningNotice?: string;
  totalDurationSec: number;
  retentionFormula: string;
  scenes: KineticStoryScene[];
}

export function buildMultiSceneStoryPrompt(params: MultiSceneStoryParams & { rawScriptText?: string }): MultiSceneStoryResult {
  const { topicIdea, rawScriptText, targetNiche = "General Creator", motionStyle = "apple-keynote" } = params;

  // Word count & pacing calculation
  const textToAnalyze = rawScriptText && rawScriptText.trim().length > 0 ? rawScriptText.trim() : topicIdea.trim();
  const words = textToAnalyze.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  // Natural speaking rate is approx 2.4 words per second (140-150 words/min)
  const estimatedVoiceSeconds = Math.round(wordCount / 2.4);
  const isTooLong = wordCount > 135 || estimatedVoiceSeconds > 55;

  let warningNotice: string | undefined = undefined;
  if (isTooLong) {
    warningNotice = `⚠️ Naskah Anda terdeteksi ${wordCount} kata (~${estimatedVoiceSeconds} detik). Format video vertikal (Reels/Shorts/TikTok) memiliki batas toleransi retensi maksimal 55-60 detik. BuatPrompt telah otomatis meringkas dan menyusun ulang naskah Anda menjadi 4 Scene 26 Detik yang padat, tajam, dan memikat tanpa kehilangan esensi pesan.`;
  }

  // Smart keyword extractor or fallback
  const firstPhrase = words.slice(0, 6).join(" ").toUpperCase() || topicIdea.toUpperCase();

  return {
    topic: topicIdea,
    wordCount,
    estimatedVoiceSeconds,
    isTooLong,
    warningNotice,
    totalDurationSec: 26,
    retentionFormula: "3 Hukum Fisika Visual + Character Emotion Resonance + Word-by-Word Highlight",
    scenes: [
      {
        sceneNumber: 1,
        stageName: "THE SHOCK HOOK",
        timeRange: "0:00 - 0:06",
        headline: firstPhrase.length > 35 ? firstPhrase.slice(0, 35) + "..." : firstPhrase,
        subtext: "Hampir semua orang salah paham sebelum nonton video ini sampai habis.",
        metric: "STOP! 🛑",
        highlightKeyword: "SALAH",
        durationSec: 6,
        characterEmotion: "shocked",
        kineticFx: "Spring Punch Scale 1.2x + Alert Aura Halo",
        foleyCue: "0:00 Fast Whoosh + Heavy Sub-Bass Thud"
      },
      {
        sceneNumber: 2,
        stageName: "THE PAIN AGITATION",
        timeRange: "0:06 - 0:13",
        headline: "BUKAN KARENA GAYA HIDUP KAMU MEWAH",
        subtext: "Tapi karena sistem keuanganmu bocor halus tanpa pernah kamu catat.",
        metric: "-85% BOCOR",
        highlightKeyword: "BOCOR",
        durationSec: 7,
        characterEmotion: "skeptical",
        kineticFx: "Wipe Push Left + Floating Red Question Particles",
        foleyCue: "0:06 Camera Shutter Snap + Low Vinyl Scratch"
      },
      {
        sceneNumber: 3,
        stageName: "THE BREAKTHROUGH REVEAL",
        timeRange: "0:13 - 0:20",
        headline: "TERAPKAN ATURAN 50/30/20 OTOMATIS",
        subtext: "Pisahkan rekening di menit pertama gajian masuk. Tabungan aman 100%.",
        metric: "+300% AMAN",
        highlightKeyword: "OTOMATIS",
        durationSec: 7,
        characterEmotion: "celebrate",
        kineticFx: "Dynamic Glowing SVG Curve Path + Rocket Sparkles",
        foleyCue: "0:13 Harmonic Synth Swell + Crisp Cash Chime"
      },
      {
        sceneNumber: 4,
        stageName: "THE INFINITE LOOP CTA",
        timeRange: "0:20 - 0:26",
        headline: "SIMPAN VIDEO INI BIAR NGGAK LUPA",
        subtext: "Biar kamu nggak bingung lagi pas mulai awal bulan depan...",
        metric: "SAVE! ✨",
        highlightKeyword: "SIMPAN",
        durationSec: 6,
        characterEmotion: "point-cta",
        kineticFx: "Pulsating Bookmark Ring + Seamless Loop Match Cut",
        foleyCue: "0:20 Clean Glass Bell Ding + Ambient Fade Out"
      }
    ]
  };
}
