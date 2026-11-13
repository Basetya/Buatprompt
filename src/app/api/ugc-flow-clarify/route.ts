import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface UgcFlowClarifyRequest {
  topic: string;
  targetDuration: "<=10s" | "<=60s" | "<=120s" | ">120s";
  engineTarget: "llm-native" | "google-flow";
  llmModel?: "gemini" | "claude" | "gpt" | "deepseek" | "kimi" | "grok";
  styleGenre: "hyper-real-ugc" | "cinematic-resort" | "tech-review" | "cartoon-3d-animation" | "luxury-commercial";
  hostType: "male-casual" | "female-pro" | "custom" | "none-faceless" | "cartoon-3d-animation";
  customHostDescription?: string;
  cameraArchetype?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: UgcFlowClarifyRequest = await req.json();
    const {
      topic = "",
      targetDuration = "<=60s",
      engineTarget = "google-flow",
      llmModel = "gemini",
      styleGenre = "hyper-real-ugc",
      hostType = "female-pro",
      customHostDescription = "",
      cameraArchetype = "auto",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const isShortClip = targetDuration === "<=10s";

    // Director Default Questions (Zero Failure / Clean Japandi Style)
    const defaultQuestions = [
      {
        id: "cameraManeuver",
        label: "Sudut Pandang Kamera & Pergerakan Visual",
        question: isShortClip
          ? `Untuk klip singkat 10 detik tentang "${topic || "topik ini"}", gaya framing kamera apa yang paling memikat?`
          : `Gaya pergerakan kamera utama apa yang ingin difokuskan dalam video "${topic || "topik ini"}"?`,
        tip: isShortClip
          ? "Petunjuk: Klip 10 detik memerlukan framing instan yang langsung menonjolkan ekspresi subjek atau produk."
          : "Petunjuk: Bird-Eye Drone cocok untuk lanskap luas; Low-Angle memberi kesan megah; Dutch Angle memberi tensi sinematik dinamis.",
        options: isShortClip
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
        defaultChoice: isShortClip
          ? "Selfie Close-Up UGC: Presenter berbicara langsung ke kamera HP dengan gestur tangan antusias"
          : "Bird-Eye Drone to Eye-Level: Drone meluncur turun dari ketinggian dan melambat halus di depan presenter",
      },
      {
        id: "visualLensAndLighting",
        label: "Karakter Lensa & Tata Cahaya",
        question: "Suasana pencahayaan dan karakter warna apa yang ingin ditampilkan?",
        tip: "Petunjuk: Golden Hour memberi nuansa hangat bersahabat; Natural Daylight memberi kesan jujur dan autentik tanpa rekayasa.",
        options: [
          "Natural Warm Daylight: Pencahayaan alami yang lembut, warna kulit segar dan autentik",
          "Golden Hour Glow + Bokeh: Cahaya senja keemasan dengan latar belakang lembut nan estetik",
          "Crisp High-Key Clean: Sangat jernih dan terang, menonjolkan tekstur asli material dan detail",
          "Moody Editorial: Kontras bayangan lembut dan elegan bergaya visual majalah modern",
        ],
        defaultChoice: "Natural Warm Daylight: Pencahayaan alami yang lembut, warna kulit segar dan autentik",
      },
      {
        id: "heroObjectOrFeature",
        label: "Konsistensi Objek & Detail Utama",
        question: "Elemen fisik atau detail apa yang ingin difokuskan sepanjang video?",
        tip: "Petunjuk: Pilih 'NONE' bila visual berganti-ganti di tiap adegan, atau ketik manual jika ada produk spesifik.",
        options: [
          "NONE: Tidak Ada Objek Terkunci (Visual Tiap Adegan Bebas Berganti-ganti)",
          "Produk / Objek di Tangan Presenter (Diperlihatkan dengan jelas ke kamera)",
          "Latar Tempat / Arsitektur Ruangan yang Konsisten",
          "Fasilitas & Suasana Lingkungan Sekitar",
        ],
        defaultChoice: "NONE: Tidak Ada Objek Terkunci (Visual Tiap Adegan Bebas Berganti-ganti)",
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

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `Anda adalah Creative Video Director & Prompt Architect kelas dunia.
Tugas: Buat 4 pertanyaan klarifikasi pilihan ganda yang cerdas, tajam, dan membantu kreator video memilih arah produksi klip ${targetDuration} untuk ${engineTarget === "llm-native" ? `LLM prompt (${llmModel})` : "Google Flow multi-shot"}.

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
Engine: ${engineTarget} (${llmModel})
Genre: ${styleGenre}
Host: ${hostType} ${customHostDescription}
Preferensi Kamera: ${cameraArchetype}

Buatkan 4 pertanyaan klarifikasi terstruktur dalam JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
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
          return NextResponse.json({ success: true, questions: parsed.questions, engine: "gemini-3.5-flash-lite" });
        }
      } catch (geminiErr) {
        console.warn("Gemini dynamic clarify notice, using director rules:", geminiErr);
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
