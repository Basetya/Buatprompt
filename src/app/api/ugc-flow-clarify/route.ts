import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface UgcFlowClarifyRequest {
  topic: string;
  targetDuration: "60s" | "90s" | "120s";
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
      targetDuration = "60s",
      styleGenre = "cinematic-resort",
      hostType = "female-pro",
      customHostDescription = "",
      cameraArchetype = "auto",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Director Default Questions (Zero Failure / Offline Robust)
    const defaultQuestions = [
      {
        id: "cameraManeuver",
        label: "Pilihan Sudut Kamera & Manuver Sinematik (/camera command)",
        question: `Manuver kamera apa yang ingin difokuskan dalam video "${topic || "proyek ini"}"?`,
        tip: "Petunjuk: Pilih sesuai gaya yang diminta reviewer. Bird-Eye Drone cocok untuk lanskap luas; Low-Angle Heroic memberi kesan megah/berwibawa; Dutch Angle memberi tensi dramatis.",
        options: [
          "Bird-Eye Drone to Eye-Level: Drone 150m di atas samudra/proyek meluncur turun tajam dan berhenti mulus di depan presenter",
          "Low-Angle Heroic Pedestal: Kamera setinggi lutut mendongak ke atas menonjolkan kemewahan arsitektur dan wibawa presenter",
          "Continuous 360 Orbit Arc: Kamera melingkari presenter & objek utama secara mulus dengan latar pemandangan berputar",
          "First-Person POV & Whip-Pan: Kamera bergerak dinamis seperti sudut pandang orang pertama dengan transisi sapuan cepat",
          "Dutch Angle & High-Tension Tracking: Kamera miring 15 derajat mengikuti langkah cepat presenter (gaya trailer Hollywood)",
        ],
        defaultChoice: "Bird-Eye Drone to Eye-Level: Drone 150m di atas samudra/proyek meluncur turun tajam dan berhenti mulus di depan presenter",
      },
      {
        id: "visualLensAndLighting",
        label: "Karakteristik Lensa & Tata Cahaya (/lens & /lighting)",
        question: "Kombinasi lensa dan pencahayaan apa yang paling diinginkan?",
        tip: "Petunjuk: 85mm Prime memberi bokeh latar belakang sangat blur ala potret studio; Anamorphic 35mm memberi flare sinematik horizontal lebar.",
        options: [
          "Golden Hour Rim-Light + 85mm Prime Bokeh (Sinar matahari senja keemasan dengan latar lembut)",
          "Anamorphic 35mm Widescreen + High-Contrast Cyan/Amber (Gaya film bioskop Hollywood dengan flare horizontal)",
          "Crisp High-Key 5600K Architectural (Cahaya terang siang hari, sangat jernih dan tajam menonjolkan detail material)",
          "Moody Chiaroscuro & Soft Ambient Shadow (Kontras bayangan artistik ala majalah arsitektur Architectural Digest)",
        ],
        defaultChoice: "Golden Hour Rim-Light + 85mm Prime Bokeh (Sinar matahari senja keemasan dengan latar lembut)",
      },
      {
        id: "heroObjectOrFeature",
        label: "Konsistensi Objek Utama & Landmark (@hero_object)",
        question: "Elemen fisik atau detail apa yang WAJIB selalu konsisten di setiap adegan?",
        tip: "Petunjuk: Pilih 'Tidak Ada Objek Terkunci (Bebas Berganti)' bila visual per scene berbeda-beda (misal adegan pantai lalu mobil lalu kamar), atau ketik Custom bila reviewer meminta objek khusus.",
        options: [
          "Kompleks villa arsitektur tepi tebing & infinity pool cascading menghadap laut lepas",
          "Presenter memegang tablet arsitektur / blueprint digital dengan grafik menyala",
          "Detail material premium: lantai kayu jati (teak wood), kaca panoramik nir-bingkai, dan batu alam",
          "Fasilitas gaya hidup eksklusif: sunset lounge terbuka, dermaga privat, dan yacht mewah",
          "NONE: Tidak Ada Objek Terkunci (Visual Tiap Adegan Bebas Berganti-ganti)",
        ],
        defaultChoice: "Kompleks villa arsitektur tepi tebing & infinity pool cascading menghadap laut lepas",
      },
      {
        id: "paceAndVoiceTone",
        label: "Irama Pacing Narasi & Nada Suara Presenter",
        question: "Bagaimana nada bicara dan ritme perpindahan antar shot yang Anda inginkan?",
        tip: "Petunjuk: Berpengaruh langsung pada timing naskah dan tag intonasi [warm], [curious], atau [authoritative].",
        options: [
          "Prestisius & Berwibawa: Tempo tenang teratur dengan jeda napas elegan [warm authoritative]",
          "Dinamis & Menggugah (High-Energy Hook): Pembuka menghentak cepat lalu bertransisi ke presentasi meyakinkan",
          "Storyteller Intim & Eksklusif: Suara dekat mikrofon seperti membocorkan rahasia destinasi tersembunyi [intimate]",
          "Dokumenter Profesional: Gaya presenter National Geographic yang informatif, faktual, dan presisi",
        ],
        defaultChoice: "Prestisius & Berwibawa: Tempo tenang teratur dengan jeda napas elegan [warm authoritative]",
      },
    ];

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `Anda adalah Master Director Sinematografi & Prompt Engineer Google Flow (Veo 2).
Tugas Anda: Buat 4 pertanyaan klarifikasi pilihan ganda yang cerdas, tajam, dan edukatif untuk memastikan parameter kamera (/camera), lensa (/lens), tata cahaya (/lighting), konsistensi objek (@hero_object), dan pacing naskah 100% pas tanpa revisi.

WAJIB SERTAKAN di setiap pertanyaan:
- "label": Judul singkat aspek sinematografi
- "question": Pertanyaan terarah
- "tip": Petunjuk praktis yang membantu user/reviewer memilih opsi terbaik berdasarkan estetika film
- "options": 4-5 opsi pilihan ganda yang mencakup variasi (misal: Bird-Eye Drone, Low-Angle Heroic, 360 Orbit, Dutch Angle, POV)
- "defaultChoice": Opsi rekomendasi terbaik

Format Output JSON murni:
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

        const prompt = `Topik Proyek: "${topic}"
Durasi: ${targetDuration}
Genre: ${styleGenre}
Host: ${hostType} ${customHostDescription}
Preferensi Awal Kamera: ${cameraArchetype}

Buatkan 4 pertanyaan klarifikasi sinematografi lengkap dengan petunjuk memilih (tip) dalam format JSON.`;

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
        console.warn("Gemini dynamic clarify failed, using director default rules:", geminiErr);
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
