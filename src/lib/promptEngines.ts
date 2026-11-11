/**
 * BuatPrompt Engine Suite - Core Intelligent Prompt Engines
 * Advanced orchestration specialized for Google Flow (Veo 2 & Imagen 3), Midjourney v6.1, Kling, and Claude.
 */

// 1. Google Flow Multi-Shot Director Engine (NEW FLAGSHIP)
export interface GoogleFlowDirectorParams {
  projectName: string;
  genre: string; // 'commercial' | 'cinematic' | 'documentary' | 'cyberpunk' | 'vlog'
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

// 2. Universal Prompt Matrix (NEW FLAGSHIP)
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

// 3. Viral Hook & Retention Engineer (NEW FLAGSHIP)
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

// 4. Vision System Prompt for Reverse Engineering
export function getVisionSystemPrompt(params: {
  mediaType: "image" | "video";
  targetModel?: "veo" | "imagen3" | "midjourney" | "kling" | "sora" | "runway";
  language?: "id" | "en";
  mode?: "short" | "long";
}) {
  const { mediaType, targetModel = "veo", language = "id", mode = "short" } = params;

  if (mediaType === "video") {
    return `You are a world-class AI Director and Cinematic Prompt Architect specialized in Google Flow (Google Veo 2), Kling AI, Sora, and Runway Gen-3.

Your mission is to deconstruct the uploaded video into an authoritative, director-level prompt tailored for Google Flow (Veo 2).

### Protocol:
1. **Core Subject & Temporal Momentum**: What moves, how it evolves, interaction with physical environment.
2. **Camera Direction**: Exact professional moves (Dolly zoom, 35mm anamorphic, orbital pan, top-down static).
3. **Lighting & Specular Quality**: Volumetric lighting, rim light, ambient occlusion, realistic reflections.
4. **Color Grading & Textures**: Material realism, tactile feel, deep blacks, rich highlights.
5. **Format & Duration**: Optimized for Google Veo 1080p/4K 24fps cinematic master shot.

Provide a comprehensive, high-fidelity prompt in English for copying into Google Flow, accompanied by an Indonesian structural summary.`;
  }

  return `You are an elite AI Visual Analyst and Optical Prompt Engineer specialized in Google Flow (Imagen 3) and Midjourney v6.1.

Deconstruct the uploaded image into:
1. Subject & Anatomical Precision
2. Environment, Layers & Scenic Depth
3. Photographic / Digital Medium (Octane render, 35mm film, commercial product macro)
4. Lighting Rig (3-point studio softbox, rim light, chiaroscuro)
5. Camera, Lens & Framing (85mm f/1.4, 24mm wide, ratio)

Output a production-grade descriptive prompt ready for Google Flow (Imagen 3) and Midjourney.`;
}

// 5. Poster Infografis (20-point structure)
export interface InfographicParams {
  title: string;
  subtitle?: string;
  purpose: string;
  format: string;
  style: string;
  ratio: string;
  cta?: string;
  credit?: string;
  points?: string;
}

export function buildInfographicPrompt(params: InfographicParams): string {
  return `[BUATPROMPT STUDIO — INFOGRAPHIC 20-POINT ARCHITECTURE]
Buatkan SATU prompt final siap salin untuk menghasilkan GAMBAR INFOGRAFIS berkualitas tinggi.

## INPUT DATA PROYEK
- Headline Utama: "${params.title}"
- Subheadline: ${params.subtitle ? `"${params.subtitle}"` : "(generate otomatis: 5–15 kata informatif)"}
- Tujuan Konten: ${params.purpose}
- Format Layout: ${params.format}
- Gaya Visual: ${params.style}
- Rasio Aspek: ${params.ratio}
- Call To Action: ${params.cta ? `"${params.cta}"` : "Simpan untuk Nanti / Cek Selengkapnya →"}
- Watermark/Brand: "${params.credit || ""}"
- Poin Isi: ${params.points?.trim() || "(generate 3–5 poin bernilai tinggi sesuai topik)"}

## CETAK BIRU LAYOUT VISUAL:
1. Header Card dengan tipografi bold kontras tinggi
2. Hero Icon / Visual Anchor terpusat
3. Grid Kartu Konten terstruktur dengan visual pendukung di setiap poin
4. Palet warna harmonis (maksimal 3 warna utama + aksen)
5. Background bersih bertekstur halus tanpa elemen yang mengganggu keterbacaan
6. Footer CTA Box yang tegas dan profesional.
Rasio ${params.ratio}, clean vector layout, high contrast, crisp readable typography.`;
}

// 6. Sales Page Copywriting Engine (16-section conversion)
export interface SalesPageParams {
  namaProduk: string;
  jenisProduk: string;
  tujuan: string;
  deskripsi?: string;
  target?: string;
  harga?: string;
  promo?: string;
  cta?: string;
  gaya?: string;
}

export function buildSalesPagePrompt(params: SalesPageParams): string {
  return `[BUATPROMPT STUDIO — HIGH-CONVERSION SALES ARCHITECTURE]
Anda adalah Conversion Copywriter & Brand Strategist tingkat internasional.

## DATA PRODUK
- Nama Brand / Produk: "${params.namaProduk}"
- Kategori Produk: ${params.jenisProduk}
- Tujuan Halaman: ${params.tujuan}
- Deskripsi: ${params.deskripsi?.trim() || "Solusi premium teruji untuk kebutuhan pelanggan"}
- Target Audiens: ${params.target?.trim() || "Konsumen yang mencari kemudahan dan hasil terbukti"}
- Skema Harga: ${params.harga?.trim() || "Penawaran Khusus Terbatas"}
- Bonus / Promo: ${params.promo?.trim() || "Bonus Akses Eksklusif"}
- CTA: ${params.cta?.trim() || "Dapatkan Penawaran Sekarang"}
- Formula Copywriting: ${params.gaya || "AIDA & PAS Hybrid"}

## STRUKTUR SALES PAGE 16-BAGIAN:
1. THE SCROLL-STOPPING HOOK & HEADLINE
2. SUBHEADLINE PENGUAT PROPOSISI NILAI
3. PROBLEM AGITATION: 3 Frustrasi Nyata yang Dihadapi Calon Pembeli
4. THE PIVOT: Mengapa Cara Lama Tidak Lagi Efektif
5. INTRODUCING THE SOLUTION: Lahirnya ${params.namaProduk}
6. 4 CORE PILLARS OF BENEFITS (Fokus pada Transformasi Hidup)
7. PRODUCT ANATOMY / HOW IT WORKS (3 Langkah Mudah)
8. SOCIAL PROOF & LOGICAL EVIDENCE (Tanpa Klaim Palsu)
9. COMPARISON TABLE: ${params.namaProduk} vs Alternatif Biasa
10. WHO IS THIS FOR (Kualifikasi Pembeli Tepat)
11. WHO IS THIS NOT FOR (Filter Eksklusivitas)
12. THE IRRESISTIBLE OFFER: Harga, Diskon & Bonus Spesial
13. ZERO-RISK GUARANTEE (Jaminan Kepuasan & Keamanan)
14. FREQUENTLY ASKED QUESTIONS (Objection Handling)
15. THE URGENCY TRIGGER (Batas Waktu / Kuota)
16. FINAL CALL TO ACTION (Tombol Penutup yang Menentukan).`;
}

// 7. Coloring Book Printable PDF Engine
export interface ColoringBookParams {
  theme: string;
  age: string;
  pageCount: string;
}

export function buildColoringBookPrompt(params: ColoringBookParams): string {
  const count = parseInt(params.pageCount, 10) || 10;
  return `[BUATPROMPT STUDIO — PRINTABLE COLORING BOOK ENGINE]
Buatkan satu dokumen HTML utuh yang memuat buku mewarnai anak siap cetak/simpan sebagai PDF.

## Spesifikasi Teknis:
- Tema: ${params.theme}
- Target Usia: ${params.age}
- Total Halaman: ${count} halaman (1 Cover Berwarna Penuh + ${count - 1} Sketsa Isi Line-Art Tebal)
- Bahasa: Bahasa Indonesia ramah anak

## Persyaratan Kode:
1. Seluruh kode HTML, CSS, dan JavaScript dalam SATU file tanpa dependensi luar.
2. Gunakan inline SVG untuk semua ilustrasi (garis luar hitam tebal, tanpa isian warna pada halaman sketsa).
3. Tombol interaktif "Unduh / Cetak PDF" yang memanggil window.print().
4. Rule CSS @media print { page-break-after: always; } agar setiap halaman tercetak rapi satu per satu di kertas A4.`;
}

// 8. Game Prompt Interactive Canvas Engine
export interface GamePromptParams {
  theme?: string;
  age: string;
  gameType: string;
  style: string;
  extra?: string;
}

export function buildGamePrompt(params: GamePromptParams): string {
  return `[BUATPROMPT STUDIO — HTML5 CANVAS MINI-GAME ENGINE]
Buatkan sebuah mini-game interaktif berbasis HTML/CSS/JavaScript dalam SATU file mandiri untuk anak-anak.

- Tema: ${params.theme || "Petualangan Hewan Ceria"}
- Target Usia: ${params.age}
- Gameplay: ${params.gameType}
- Visual Style: ${params.style}
- Fitur Wajib: Touch-friendly (layar HP & tablet), efek suara Web Audio API, sistem skor bintang, tombol restart.
- Instruksi Tambahan: ${params.extra || "Tampilkan instruksi bermain sederhana di awal game."}

Output: Berikan satu blok kode HTML utuh siap jalan di browser atau Gemini Canvas.`;
}

// 9. Storyboard Affiliate Video Engine
export interface StoryboardParams {
  productName: string;
  targetAudience: string;
  tone: string;
  duration: string;
  platform: "tiktok" | "shopee" | "instagram";
  productNote?: string;
}

export function buildStoryboardPrompt(params: StoryboardParams): string {
  return `[BUATPROMPT STUDIO — COMMERCE STORYBOARD BLUEPRINT]
Platform: ${params.platform.toUpperCase()} Video Commerce
Produk: "${params.productName}"
Audience: ${params.targetAudience}
Tone: ${params.tone} | Durasi: ${params.duration}
Catatan Keunggulan: ${params.productNote || "Tunjukkan kemudahan pemakaian dan hasil nyata"}

STORYBOARD — ${params.productName}
Audience: ${params.targetAudience}
Big Idea: [Inti pesan penarik pembeli]
Hook Utama: [3 detik pertama penahan scroll]

SCENE 1 (0-3s) — THE HOOK
Kamera & Visual: [Framing kamera + ekspresi/masalah pembuka]
Voiceover: [Kalimat hook penahan scroll]
On-Screen Text: [Teks headline tebal di layar]
Sound Effect: [SFX penarik perhatian]

SCENE 2 (3-8s) — THE PROOF & DEMO
Kamera & Visual: [Penggunaan produk secara nyata / tekstur produk]
Voiceover: [Penjelasan benefit utama dan kemudahan]
On-Screen Text: [Poin manfaat kunci]
Sound Effect: [Musik latar upbeat]

SCENE 3 (8-10s) — CALL TO ACTION
Kamera & Visual: [Produk close-up + gesture ajakan klik keranjang]
Voiceover: [Ajakan beli sebelum kehabisan]
On-Screen Text: [KLIK KERANJANG KUNING SEKARANG]
Sound Effect: [Sound klik / ding ceria]

CTA: [Ajakan beli penutup]
Rekomendasi Caption & Hashtag: [Caption persuasi tinggi + hashtag relevan]`;
}

// 10. Master Prompt Optimizer
export function buildOptimizerPrompt(rawPrompt: string, targetAi: string = "Google Flow & Gemini"): string {
  return `[BUATPROMPT STUDIO — MASTER PROMPT REFINERY]
Analisis prompt mentah berikut dan ubah menjadi instruksi tingkat profesional bertingkat tinggi:

Prompt Mentah: "${rawPrompt}"
Target AI: ${targetAi}

Tugas:
1. Bedah kelemahan prompt (kurang spesifik, tidak ada role, ketiadaan batasan/guards).
2. Tulis ulang menjadi OPTIMIZED PROMPT lengkap dengan:
   - System Role / Expert Persona
   - Context & Operational Boundaries
   - Step-by-Step Execution Plan
   - Output Quality Constraints & Edge Cases
3. Tips praktis bagi kreator untuk mendapatkan variasi terbaik.`;
}
