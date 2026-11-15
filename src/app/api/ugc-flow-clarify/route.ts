import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export type VideoAiEngine =
  | "google-flow"
  | "leonardo-ai"
  | "dreamina-seedance"
  | "kling-ai"
  | "runway-gen3"
  | "luma-dream-machine"
  | "pika-labs"
  | "hailuo-minimax"
  | "wan-video"
  | "capcut-ai"
  | "llm-native";

export type LlmModelType = "gemini" | "claude" | "gpt" | "deepseek" | "kimi" | "grok";

export type TargetDurationOption =
  | "<=10s"
  | "<=40s"
  | "<=60s"
  | "<=120s"
  | ">120s"
  | "gemini-5clip"
  | "gemini-40s"
  | "longform-multiplier";

export type PacingMode = "normal" | "fast";

interface UgcFlowClarifyRequest {
  topic: string;
  targetDuration: TargetDurationOption;
  engineTarget: VideoAiEngine;
  llmModel?: LlmModelType;
  styleGenre: "hyper-real-ugc" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial" | "house-tour";
  hostType: "male-casual" | "female-pro" | "custom" | "none-faceless" | "cartoon-3d-animation";
  customHostDescription?: string;
  cameraArchetype?: string;
  pacingMode?: PacingMode;
  characterCount?: number;
  environmentCount?: number;
  objectCount?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: UgcFlowClarifyRequest = await req.json();
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
      characterCount = 0,
      environmentCount = 0,
      objectCount = 0,
    } = body;

    const rawApiKey = process.env.GEMINI_API_KEY || "";
    const apiKeys = rawApiKey
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 20);
    const isShortClip = targetDuration === "<=10s";
    const isGeminiChain =
      targetDuration === "gemini-5clip" ||
      targetDuration === "gemini-40s" ||
      targetDuration === "<=40s" ||
      (engineTarget === "llm-native" && llmModel === "gemini");
    const isLongFormMultiplier = targetDuration === "longform-multiplier";

    // Director Default Questions (Zero Failure / Clean Japandi Style)
    const defaultQuestions = [
      {
        id: "cameraManeuver",
        label: isGeminiChain
          ? "Struktur Gemini Session Pass (Maksimal 40 Detik • 4 Klip)"
          : isLongFormMultiplier
          ? "Rancangan A-Roll (Host Bicara) & B-Roll (Visual Aksi)"
          : "Sudut Pandang Kamera & Pergerakan Visual",
        question: isGeminiChain
          ? `Pilih formula alur 4 klip (maksimal 40 detik, tuntas 1 sesi Gemini) untuk "${topic || "topik ini"}":`
          : isLongFormMultiplier
          ? `Bagaimana komposisi selingan A-Roll (Host berbicara) dan B-Roll (Detail aksi/produk) yang diinginkan?`
          : isShortClip
          ? `Untuk klip singkat 10 detik tentang "${topic || "topik ini"}", gaya framing kamera apa yang paling memikat?`
          : `Gaya pergerakan kamera utama apa yang ingin difokuskan dalam video "${topic || "topik ini"}"?`,
        tip: isGeminiChain
          ? `Petunjuk: Dibatasi maksimal 40 detik (4 klip @ 10s) dengan pacing ${pacingMode === "fast" ? "Cepat (24–28 kata/adegan)" : "Normal (14–18 kata/adegan)"} agar selesai tuntas 1 sesi Gemini tanpa terpotong atau menunggu limit 5 jam.`
          : isLongFormMultiplier
          ? "Petunjuk: Kombinasi A-Roll & B-Roll memungkinkan video berdurasi 1-3 menit tanpa membuat penonton bosan."
          : isShortClip
          ? "Petunjuk: Klip 10 detik memerlukan framing instan yang langsung menonjolkan ekspresi subjek atau produk."
          : "Petunjuk: Bird-Eye Drone cocok untuk lanskap luas; Low-Angle memberi kesan megah.",
        options: isGeminiChain
          ? [
              "Formula Hook-Problem-Hero-Crunch-CTA: Hook heboh -> Kegalauan -> Solusi produk -> Pembuktian reaksi/kriuk -> Ajakan keranjang kuning",
              "Formula Before & After Transformation: Kondisi awal sebelum coba -> Penasaran rahasia -> Pemakaian langsung -> Hasil memukau -> Rekomendasi jujur",
              "Formula Honest Review & Unboxing: Tampilan kemasan -> Buka & impresi pertama -> Uji coba tekstur/rasa -> Kelebihan utama -> Kesimpulan akhir",
              "Formula Storytime & Edukasi Cepat: Cerita pengalaman pribadi -> Momen sadar kesalahan -> Solusi praktis -> Tips penggunaan -> Penutup berkesan",
            ]
          : isLongFormMultiplier
          ? [
              "50% A-Roll + 50% B-Roll (Seimbang): Host bicara diselingi aksi close-up memotong/mencoba produk",
              "30% A-Roll + 70% B-Roll (Visual-Heavy): Lebih banyak aksi estetik sinematik, host hanya sebagai narator pembuka & penutup",
              "Step-by-Step Tutorial: Setiap poin penjelasan host langsung diikuti B-roll cara mempraktekkannya",
            ]
          : isShortClip
          ? [
              "Selfie Close-Up UGC: Presenter berbicara langsung ke kamera HP dengan gestur tangan antusias",
              "Dynamic Macro Reveal: Kamera maju cepat dari detail produk ke wajah presenter yang tersenyum",
              "First-Person POV: Kamera bergerak alami seolah penonton yang memegang atau mencoba langsung",
              "Low-Angle Heroic: Kamera sedikit dari bawah menonjolkan subjek dan latar belakang",
            ]
          : [
              "Bird-Eye Drone to Eye-Level: Drone meluncur turun dari ketinggian dan melambat halus di depan presenter",
              "Low-Angle Heroic Pedestal: Kamera setinggi lutut mendongak ke atas menonjolkan arsitektur dan wibawa subjek",
              "Continuous 360 Orbit Arc: Kamera melingkari presenter & objek secara mulus dengan latar berputar",
              "First-Person POV & Whip-Pan: Kamera bergerak dinamis seperti sudut pandang orang pertama",
              "Dutch Angle & High-Tension Tracking: Kamera miring 15 derajat mengikuti langkah dinamis presenter",
            ],
        defaultChoice: isGeminiChain
          ? "Formula Hook-Problem-Hero-Crunch-CTA: Hook heboh -> Kegalauan -> Solusi produk -> Pembuktian reaksi/kriuk -> Ajakan keranjang kuning"
          : isLongFormMultiplier
          ? "50% A-Roll + 50% B-Roll (Seimbang): Host bicara diselingi aksi close-up memotong/mencoba produk"
          : isShortClip
          ? "Selfie Close-Up UGC: Presenter berbicara langsung ke kamera HP dengan gestur tangan antusias"
          : "Bird-Eye Drone to Eye-Level: Drone meluncur turun dari ketinggian dan melambat halus di depan presenter",
      },
      {
        id: "visualLensAndLighting",
        label: "Karakter Lensa & Tata Cahaya (Lighting Continuity)",
        question: "Suasana pencahayaan yang akan dikunci identik di semua klip?",
        tip: "Petunjuk: Mengunci pencahayaan yang sama persis mencegah warna video melompat saat klip disambung di CapCut.",
        options: [
          "Natural Warm Daylight: Cahaya jendela alami yang lembut, warna kulit segar dan autentik",
          "Golden Hour Glow + Soft Bokeh: Cahaya sore keemasan hangat dengan latar belakang estetik",
          "Crisp High-Key Clean: Sangat jernih dan terang, menonjolkan tekstur asli material dan detail",
          "Moody Cinematic Editorial: Kontras bayangan lembut dan elegan bergaya majalah modern",
        ],
        defaultChoice: "Natural Warm Daylight: Cahaya jendela alami yang lembut, warna kulit segar dan autentik",
      },
      {
        id: "heroObjectOrFeature",
        label: "Pilar Konsistensi Produk & Hand-off Gerakan",
        question: "Bagaimana interaksi fisik host dengan produk yang ingin dijaga konsisten?",
        tip: "Petunjuk: Objek (@hero_object) dan busana host (@host_anchor) akan dikunci agar tidak berubah bentuk.",
        options: [
          "Produk di Tangan Host: Diperlihatkan dengan jelas ke kamera saat bicara dan dicoba langsung",
          "Produk di Meja + Interaksi Tangan: Produk diletakkan estetik di meja dan diambil saat giliran adegan",
          "Fokus Aksi Fisik & Rasa: Menekankan tekstur (kriuk/lembut/oles) dengan sinkronisasi suara 100%",
          "NONE: Bebas Berganti-ganti Tanpa Produk Spesifik",
        ],
        defaultChoice: "Produk di Tangan Host: Diperlihatkan dengan jelas ke kamera saat bicara dan dicoba langsung",
      },
      {
        id: "paceAndVoiceTone",
        label: "Nada Bicara & Gaya Bahasa Presenter",
        question: "Gaya penyampaian seperti apa yang paling sesuai untuk audiens Anda?",
        tip: "Petunjuk: Gaya Percakapan Akrab sangat cocok untuk TikTok/Reels; Gaya Profesional cocok untuk profil brand dan komersial.",
        options: [
          "Percakapan Akrab & Energik: Ramah, santai, dan antusias seperti teman yang berbagi rekomendasi",
          "Elegan & Berwibawa: Tenang, artikulatif, dengan jeda napas yang teratur dan meyakinkan",
          "Storyteller Penasaran: Intim, memancing rasa ingin tahu audiens dari detik awal",
          "Informatif & Ringkas: Lugas langsung ke poin inti tanpa bertele-tele",
        ],
        defaultChoice: "Percakapan Akrab & Energik: Ramah, santai, dan antusias seperti teman yang berbagi rekomendasi",
      },
    ];

    if (apiKeys.length > 0) {
      for (const apiKey of apiKeys) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemPrompt = `Anda adalah Creative Video Director & Prompt Architect kelas dunia.
Tugas: Buat 4 pertanyaan klarifikasi pilihan ganda yang cerdas, tajam, dan membantu kreator video memilih arah produksi klip ${targetDuration} untuk ${engineTarget}.

WAJIB SERTAKAN:
- label: Judul singkat aspek video
- question: Pertanyaan terarah
- tip: Petunjuk ramah yang menjelaskan manfaat tiap pilihan
- options: 4 opsi pilihan ganda
- defaultChoice: Opsi rekomendasi terbaik

Format Output JSON:
{
  "questions": [
    {
      "id": "string",
      "label": "string",
      "question": "string",
      "tip": "string",
      "options": ["opsi 1", "opsi 2", ...],
      "defaultChoice": "opsi 1"
    }
  ]
}`;

          const prompt = `Topik: "${topic}"
Durasi: ${targetDuration}
Engine Target: ${engineTarget} ${engineTarget === "llm-native" ? `(${llmModel})` : ""}
Genre: ${styleGenre}
Host: ${hostType} ${customHostDescription}
Preferensi Kamera: ${cameraArchetype}

Buatkan 4 pertanyaan klarifikasi terstruktur dalam JSON.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          });

          const text = response.text || "";
          const parsed = JSON.parse(text);
          if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            return NextResponse.json({ success: true, questions: parsed.questions, engine: "gemini-3.5-flash" });
          }
        } catch (geminiErr) {
          console.warn("Gemini dynamic clarify notice on key, trying next:", geminiErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      questions: defaultQuestions,
      engine: "built-in-director-rules",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
