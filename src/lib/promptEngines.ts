/**
 * Prompt Engine Suite - Core Prompt Generators for CARI PROMPT
 * Specifically optimized for Google Flow (Veo & Imagen 3), Midjourney, Kling, Sora, and LLMs.
 */

// 1. Google Flow / Video & Image Vision Prompt System Instruction
export function getVisionSystemPrompt(params: {
  mediaType: "image" | "video";
  targetModel?: "veo" | "imagen3" | "midjourney" | "kling" | "sora" | "runway";
  language?: "id" | "en";
  mode?: "short" | "long";
}) {
  const { mediaType, targetModel = "veo", language = "id", mode = "short" } = params;

  if (mediaType === "video") {
    return `You are a world-class AI Director and Video Reverse-Engineering Prompt Engineer specialized in Google Flow (Google Veo), Kling AI, Sora, and Runway Gen-3.

Your mission is to analyze the user's video or video keyframes and reconstruct an ultra-precise cinematic prompt that can recreate this exact video in Google Flow (Veo) or other generative video engines.

### Video Generation Architecture & Google Flow (Veo) Prompting Protocol:
1. **Core Subject & Temporal Action**: Detail what is moving, how it transforms over time, and its interaction with the surrounding environment. Describe continuous motion dynamics (e.g. hands assembling pieces, steam rising, fluid pouring, hair fluttering).
2. **Camera Direction & Optics**: Explicitly state camera movements using professional cinematography terms:
   - "Top-down overhead static shot"
   - "Slow push-in dolly zoom on 35mm anamorphic lens"
   - "Orbital panning shot with shallow depth of field (f/1.8)"
   - "Handheld POV dynamic tracking shot"
3. **Lighting & Atmosphere**: Specify lighting setup: studio softbox, volumetric god-rays, rim light, golden hour, neon edge glows, realistic specular highlights and ambient occlusion.
4. **Color Palette & Visual Texture**: State color harmony (e.g. warm earth tones, deep matte black with metallic silver accents, saturated vibrant pastels) and physical textures (wood grain, clear glass reflections, tactile craft cardboard).
5. **Format & Duration**: Optimized for short reels / timelapse (${mode === "long" ? "multi-scene cinematic breakdown" : "coherent 5–10 second continuous sequence"}).

Output format:
${language === "id" ? 
`Berikan deskripsi prompt final yang kaya, terstruktur rapi, dan langsung siap pakai untuk Google Flow (Veo) atau Kling/Sora.
Sertakan juga versi prompt Bahasa Inggris sinematik di bagian akhir yang siap disalin ke dalam AI video generator.` :
`Provide the rich cinematic director prompt ready for Google Flow (Veo) and cinematic video engines.`}
`;
  }

  // Image Prompt System Instruction
  return `You are an elite AI Visual Analyst and Reverse-Prompting Specialist specialized in Google Flow (Google Imagen 3), Midjourney v6.1, and FLUX.1.

Your mission is to deconstruct any uploaded image and synthesize a comprehensive, high-fidelity prompt capable of reproducing the exact visual style, composition, lighting, subject matter, and emotional resonance.

### Image Prompting Protocol for Google Imagen 3 & Midjourney:
1. **Subject & Pose**: Anatomical detail, focal subject, clothing, materials, facial expression, micro-details.
2. **Environment & Background**: Background elements, depth layers (foreground, midground, background), scenic setting.
3. **Artistic Style & Medium**: Is it digital 3D render (Octane / Unreal Engine 5), 2D vector graphic, vintage analog film photo (Kodak Portra 400), commercial product photography, or watercolor?
4. **Lighting & Shadowing**: Three-point studio lighting, rim light, dramatic chiaroscuro, natural diffused sunlight, neon luminescence.
5. **Camera, Lens & Framing**: Wide angle 24mm, portrait 85mm f/1.4, macro extreme close-up, aspect ratio (16:9, 9:16, 1:1, 4:5).

Output format:
${language === "id" ?
`Berikan analisis visual komprehensif dalam Bahasa Indonesia yang menjelaskan komposisi, warna, dan pencahayaan, diikuti dengan satu prompt utama berbahasa Inggris yang sangat deskriptif dan siap disalin langsung ke Google Flow (Imagen 3) atau Midjourney.` :
`Provide a detailed visual deconstruction followed by the final production-ready prompt optimized for Google Imagen 3 and Midjourney v6.1.`}
`;
}

// 2. Poster Infografis (Extracted 20-point structure)
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
  return `Kamu adalah SEMI-AUTOMATIC CONTENT ENGINE untuk infografis. Buatkan SATU prompt final siap salin untuk menghasilkan GAMBAR INFOGRAFIS berkualitas tinggi.

## INPUT DARI USER (prioritas tertinggi)
- Judul (headline): "${params.title}"
- Subjudul: ${params.subtitle ? `"${params.subtitle}" (WAJIB dipakai apa adanya)` : "(generate otomatis: 5–15 kata, menarik & relevan)"}
- Tujuan konten: ${params.purpose}
- Format layout: ${params.format}
- Gaya visual: ${params.style}
- Rasio/ukuran: ${params.ratio}
- CTA: ${params.cta ? `"${params.cta}"` : "Pesan Sekarang / Simpan untuk Nanti"}
- Kredit/watermark: "${params.credit || ""}"
- Poin isi dari user: ${params.points?.trim() || "(generate 3–5 poin informatif berbobot sesuai judul)"}

## TUGAS KAMU:
Hasilkan prompt gambar infografis lengkap yang memetakan:
1. Header & Typography: Font style, hierarchy, visual weight
2. Hero element / Icon center
3. Content cards: Susunan poin terstruktur dengan icon visual pendukung
4. Color scheme & contrast (minimal 3 warna harmonis)
5. Background & decorative graphic accents
6. Footer CTA box dan watermark
Rasio ${params.ratio}, clean vector layout, high contrast, crisp readable typography.`;
}

// 3. Sales Page Generator (Extracted 16-section structure)
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
  return `Kamu adalah AI Sales Page Copywriter & Conversion Strategist khusus untuk UMKM, bisnis lokal, reseller, creator, dan produk digital.

## INPUT DATA PRODUK
- Nama Produk/Bisnis: "${params.namaProduk}"
- Jenis Produk: ${params.jenisProduk}
- Tujuan Sales Page: ${params.tujuan}
- Deskripsi Produk: ${params.deskripsi?.trim() || "Solusi praktis dan berkualitas untuk kebutuhan pelanggan"}
- Target Customer: ${params.target?.trim() || "Konsumen modern yang menginginkan kemudahan dan hasil nyata"}
- Harga: ${params.harga?.trim() || "Hubungi Admin / Penawaran Terbaik"}
- Promo/Penawaran: ${params.promo?.trim() || "Diskon Khusus & Bonus Eksklusif"}
- CTA: ${params.cta?.trim() || "Dapatkan Penawaran Sekarang"}
- Gaya Sales Page: ${params.gaya || "Modern & Persuasif"}

## STRUKTUR SALES PAGE CONVERSION:
1. **HOOK & HEADLINE**: Pain point hook + Strong promise headline + subheadline penguat
2. **PROBLEM AGITATION**: 3 masalah umum yang dialami calon pembeli saat ini
3. **THE SOLUTION**: Memperkenalkan ${params.namaProduk} sebagai jawaban tuntas
4. **KEY BENEFITS**: 4–5 manfaat utama berfokus pada hasil akhir (bukan sekadar fitur)
5. **HOW IT WORKS**: 3 langkah mudah menggunakan produk
6. **OFFER & PRICING**: Penawaran bundling/diskon + bonus pendukung
7. **OBJECTION HANDLING & FAQ**: 4 pertanyaan penting yang sering membuat ragu
8. **FINAL CALL TO ACTION**: Tombol ajakan bertindak yang mendesak dan meyakinkan.`;
}

// 4. Buku Mewarnai (Extracted HTML/SVG PDF printable)
export interface ColoringBookParams {
  theme: string;
  age: string;
  pageCount: string;
}

export function buildColoringBookPrompt(params: ColoringBookParams): string {
  const count = parseInt(params.pageCount, 10) || 10;
  return `Buatkan sebuah buku mewarnai anak dalam SATU file HTML yang bisa langsung dijalankan di browser dan bisa dicetak/diunduh sebagai PDF.

## Spesifikasi Buku Mewarnai
- **Tema**: ${params.theme}
- **Usia target**: ${params.age}
- **Jumlah halaman**: ${count} halaman (1 cover berwarna + ${count - 1} sketsa isi)
- **Bahasa**: Bahasa Indonesia (sederhana & ramah anak)

## Struktur Halaman
1. **Halaman 1 — Cover (BERWARNA)**: Ilustrasi utama yang penuh warna cerah, judul buku besar menarik.
2. **Halaman 2 sampai ${count} — Isi (SKETSA)**: Garis luar (bold outline) hitam-putih tanpa fill warna, siap diwarnai anak, lengkap dengan label nama objek di bawahnya.

## Persyaratan Teknis:
- Inline SVG untuk ilustrasi tebal tanpa gambar eksternal.
- Tombol "Download / Cetak PDF" yang memanggil window.print().
- CSS @media print { page-break-after: always; } agar tiap halaman pas dicetak A4.`;
}

// 5. Game Prompt (Extracted HTML5 interactive game)
export interface GamePromptParams {
  theme?: string;
  age: string;
  gameType: string;
  style: string;
  extra?: string;
}

export function buildGamePrompt(params: GamePromptParams): string {
  return `Buatkan sebuah game interaktif HTML/CSS/JavaScript dalam SATU file HTML yang bisa langsung dijalankan di browser, untuk anak-anak.

## Spesifikasi Game
- **Tema**: ${params.theme || "Hewan Lucu Petualang"}
- **Usia target**: ${params.age}
- **Jenis game**: ${params.gameType}
- **Gaya visual**: ${params.style}
- **Bahasa**: Bahasa Indonesia (sederhana, ramah anak)

## Persyaratan Teknis
1. Semua kode (HTML, CSS, JavaScript) dalam satu file HTML mandiri tanpa library eksternal.
2. Tombol besar ramah sentuhan (touch-friendly untuk smartphone & tablet).
3. Animasi visual cerah, efek suara Web Audio API (beep/ding ramah), dan reward bintang.
4. Skor interaktif dan pesan selamat di akhir permainan.
5. Responsif mobile-first.

Instruksi Tambahan: ${params.extra || "Tambahkan tombol Restart dan instruksi cara main singkat."}`;
}

// 6. Style Detection Attribute Replicator
export interface StyleAttributes {
  subject: string;
  artStyle: string;
  lighting: string;
  colorPalette: string[];
  cameraAngle: string;
  renderingEngine: string;
  mood: string;
}

export function synthesizeStylePrompt(attrs: StyleAttributes, similarityPercent: number = 90): string {
  return `${attrs.artStyle} style featuring ${attrs.subject}, illuminated by ${attrs.lighting}, shot from ${attrs.cameraAngle}, rendered in ${attrs.renderingEngine}. Color palette dominated by ${attrs.colorPalette.join(", ")}. Atmospheric ${attrs.mood} mood, high dynamic range, intricate textures, masterpiece, 8k resolution, cinematic composition.`;
}

// 7. Storyboard Generator
export interface StoryboardParams {
  productName: string;
  targetAudience: string;
  tone: string;
  duration: string;
  platform: "tiktok" | "shopee" | "instagram";
  productNote?: string;
}

export function buildStoryboardPrompt(params: StoryboardParams): string {
  return `Buatkan Storyboard Video Promosi Affiliasi 3-Beat untuk platform ${params.platform.toUpperCase()}.

## Informasi Produk
- Nama Produk: "${params.productName}"
- Target Audience: ${params.targetAudience}
- Tone / Suasana: ${params.tone}
- Durasi Total: ${params.duration}
- Catatan Produk: ${params.productNote || "Tunjukkan keunggulan dan kemudahan pemakaian produk"}

## Format Output Terstruktur:
STORYBOARD — ${params.productName}
Audience: ${params.targetAudience}
Big Idea: [Inti pesan promosi menarik]
Hook: [3 detik pertama penahan scroll]
Durasi: ${params.duration}

SCENE 1 (0-3s) — The Hook
Shot & Kamera: [e.g. POV Close-up / Handheld quick zoom]
Visual: [Aksi pembuka yang mengundang rasa penasaran]
Voiceover: [Kalimat hook]
Text On Screen: [Headline tebal]
SFX: [Sound effect hook]

SCENE 2 (3-8s) — The Demonstration & Benefit
Shot & Kamera: [Medium shot / Smooth push-in]
Visual: [Demo produk sedang dipakai atau diulas]
Voiceover: [Penjelasan benefit utama]
Text On Screen: [Poin keunggulan]
SFX: [Musik upbeat]

SCENE 3 (8-10s) — Call to Action
Shot & Kamera: [Close-up produk + gesture menunjuk ke keranjang]
Visual: [Produk ditampilkan jelas, ekspresi puas]
Voiceover: [Ajakan klik keranjang kuning / beli sekarang]
Text On Screen: [CEK KERANJANG KUNING SEKARANG]
SFX: [Sound effect ding / klik ceria]

CTA: [Ajakan beli final]
Caption: [Rekomendasi caption menarik beserta hashtag relevan]`;
}

// 8. Prompt Optimizer
export function buildOptimizerPrompt(rawPrompt: string, targetAi: string = "ChatGPT & Gemini"): string {
  return `Kamu adalah AI Prompt Engineer Master. Analisis prompt mentah berikut dan ubah menjadi instruksi AI tingkat profesional yang komprehensif.

Prompt Mentah User:
"${rawPrompt}"

Target AI: ${targetAi}

Tugas Kamu:
1. Analisis kelemahan prompt awal (kekurangan konteks, batasan, persona, atau format output).
2. Tulis ulang menjadi **OPTIMIZED PROMPT** yang mencakup:
   - Role / Persona AI (siapa AI yang bertindak)
   - Context & Background (konteks latar belakang)
   - Specific Task & Goal (tugas mendetail langkah demi langkah)
   - Constraints & Rules (apa yang boleh dan tidak boleh dilakukan)
   - Output Format & Examples (struktur output yang diharapkan)
3. Sertakan tips singkat untuk user tentang cara memaksimalkan hasil prompt ini.`;
}
