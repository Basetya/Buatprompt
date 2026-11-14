import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import https from "https";
import util from "util";

const execPromise = util.promisify(exec);

// In-memory cache so repeated previews & default scenes respond in <5ms
const ttsMemoryCache = new Map<string, Buffer>();
const MAX_TTS_CACHE = 60;

// Gemini Free-tier cooldown tracker (avoids 8-second 429 delays when daily quota is exhausted)
let geminiQuotaExhaustedUntil = 0;

// Fallback to Google Translate TTS if offline or edge-tts fails
function fetchGoogleTTSFallback(text: string, lang: string = "id"): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`;

    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Fallback TTS error: ${res.statusCode}`));
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );

    req.on("error", (err) => reject(err));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error("Fallback TTS timed out"));
    });
  });
}

/**
 * Phonetic normalizer for Indonesian Neural TTS (id-ID-ArdiNeural / GadisNeural)
 * Uses clean, fluent Indonesian spelling WITHOUT hyphens or odd double letters
 * so Microsoft Azure Neural reads them seamlessly without awkward pauses or robotic glitches.
 */
function normalizeIndonesianEnglishTTS(input: string): string {
  const phoneticMap: Record<string, string> = {
    lifestyle: "laifstail",
    inflation: "inflasi",
    autodebet: "otodebet",
    save: "simpan",
    share: "bagikan",
    scroll: "skrol",
    followers: "folower",
    follower: "folower",
    affiliate: "afiliasi",
    skincare: "skinker",
    breakout: "brekaut",
    purging: "perjing",
    content: "konten",
    creator: "kreator",
    viral: "viral",
    hook: "huk",
    mindset: "mainset",
    cashflow: "kesflo",
    budget: "bajet",
    budgeting: "bajeting",
    gadget: "gadget",
    flagship: "flegsyip",
    upgrade: "apgreid",
    download: "unduh",
    passive: "pasif",
    income: "inkam",
    feedback: "umpan balik",
    branding: "brending",
    storytelling: "stori teling",
    closing: "klosing",
    checkout: "cekaut",
    review: "riviu",
    growth: "pertumbuhan",
    scale: "skeil",
    update: "apdeit",
    online: "online",
    offline: "offline",
    skill: "keahlian",
    agent: "agen",
    github: "githab",
    design: "desain",
    swipe: "geser",
    workflow: "workflo",
    deadline: "tenggat",
    freelance: "frilens",
    marketing: "marketing",
    personal: "personal",
    finance: "finansial",
    financial: "finansial",
    wealth: "kekayaan",
    profit: "profit",
    margin: "marjin",
    revenue: "pendapatan",
    engagement: "interaksi",
    algorithm: "algoritma",
    retention: "retensi",
    highlight: "sorotan",
    caption: "kepsyen",
    voiceover: "vois over",
  };

  return input.replace(/\b[a-zA-Z]+\b/g, (word) => {
    const lower = word.toLowerCase();
    return phoneticMap[lower] || word;
  });
}

/**
 * 100% Cost-Free Kang Suara Authentic Indonesian Voice Personas
 * Curated from Kang Suara Master Edition (D:\Projects\Canvas\Kang Suara Master.html).
 * Each persona has calibrated pitch and rate parameters matching Indonesian speech nuances.
 */
export interface KangSuaraPersona {
  id: string;
  name: string;
  gender: "male" | "female";
  roleDesc: string;
  azureVoice: "id-ID-ArdiNeural" | "id-ID-GadisNeural";
  rate: string;
  pitch: string;
  cast: string;
}

export const KANG_SUARA_PERSONAS: Record<string, KangSuaraPersona> = {
  "kang-sarah": {
    id: "kang-sarah",
    name: "Sarah",
    gender: "female",
    roleDesc: "Host Profesional & Edukatif",
    azureVoice: "id-ID-GadisNeural",
    rate: "+2%",
    pitch: "+0Hz",
    cast: "Aoede",
  },
  "kang-dimas": {
    id: "kang-dimas",
    name: "Mas Dimas",
    gender: "male",
    roleDesc: "Otoritatif & Tenang / Video Essay",
    azureVoice: "id-ID-ArdiNeural",
    rate: "-3%",
    pitch: "-2Hz",
    cast: "Charon",
  },
  "kang-bams": {
    id: "kang-bams",
    name: "Bang Bams",
    gender: "male",
    roleDesc: "UGC Hook Cepat, Nyolot & Energik",
    azureVoice: "id-ID-ArdiNeural",
    rate: "+12%",
    pitch: "+2Hz",
    cast: "Puck",
  },
  "kang-senja": {
    id: "kang-senja",
    name: "Nada Senja",
    gender: "female",
    roleDesc: "Storytelling Halus, Meditatif & Reflektif",
    azureVoice: "id-ID-GadisNeural",
    rate: "-15%",
    pitch: "-2Hz",
    cast: "Aoede",
  },
  "kang-bimo": {
    id: "kang-bimo",
    name: "Bimo",
    gender: "male",
    roleDesc: "Reviewer Santai & Gaul / Gadget",
    azureVoice: "id-ID-ArdiNeural",
    rate: "+6%",
    pitch: "+0Hz",
    cast: "Charon",
  },
  "kang-keisha": {
    id: "kang-keisha",
    name: "Keisha",
    gender: "female",
    roleDesc: "Gen-Z Aesthetic / Lifestyle / Skincare",
    azureVoice: "id-ID-GadisNeural",
    rate: "+4%",
    pitch: "+1Hz",
    cast: "Kore",
  },
  "kang-reno": {
    id: "kang-reno",
    name: "Reno",
    gender: "male",
    roleDesc: "Anak Muda Hype / Gamer Dinamis",
    azureVoice: "id-ID-ArdiNeural",
    rate: "+10%",
    pitch: "+2Hz",
    cast: "Puck",
  },
  "kang-hartono": {
    id: "kang-hartono",
    name: "Pak Hartono",
    gender: "male",
    roleDesc: "Bapak Bijak / Bisnis & Finansial",
    azureVoice: "id-ID-ArdiNeural",
    rate: "-3%",
    pitch: "-2Hz",
    cast: "Charon",
  },
  "kang-ratna": {
    id: "kang-ratna",
    name: "Ibu Ratna",
    gender: "female",
    roleDesc: "Keibuan, Hangat & Mengayomi",
    azureVoice: "id-ID-GadisNeural",
    rate: "-10%",
    pitch: "-2Hz",
    cast: "Aoede",
  },
  "kang-arka": {
    id: "kang-arka",
    name: "Arka",
    gender: "male",
    roleDesc: "Anak Cowok Penasaran & Lincah",
    azureVoice: "id-ID-ArdiNeural",
    rate: "+6%",
    pitch: "+1Hz",
    cast: "Puck",
  },
  "kang-naura": {
    id: "kang-naura",
    name: "Naura",
    gender: "female",
    roleDesc: "Anak Cewek Ceria & Imut",
    azureVoice: "id-ID-GadisNeural",
    rate: "+4%",
    pitch: "+2Hz",
    cast: "Kore",
  },
  "edge-bams": {
    id: "edge-bams",
    name: "Bang Bams (Edge)",
    gender: "male",
    roleDesc: "UGC Hook Cepat, Nyolot & Energik (Ardi +12%)",
    azureVoice: "id-ID-ArdiNeural",
    rate: "+12%",
    pitch: "+2Hz",
    cast: "Puck",
  },
  "edge-dimas": {
    id: "edge-dimas",
    name: "Mas Dimas (Edge)",
    gender: "male",
    roleDesc: "Otoritatif & Tenang (Ardi -3% / -2Hz)",
    azureVoice: "id-ID-ArdiNeural",
    rate: "-3%",
    pitch: "-2Hz",
    cast: "Charon",
  },
  "edge-bimo": {
    id: "edge-bimo",
    name: "Bimo (Edge)",
    gender: "male",
    roleDesc: "Reviewer Santai & Gaul (Ardi +6%)",
    azureVoice: "id-ID-ArdiNeural",
    rate: "+6%",
    pitch: "+0Hz",
    cast: "Charon",
  },
  "edge-sarah": {
    id: "edge-sarah",
    name: "Sarah (Edge)",
    gender: "female",
    roleDesc: "Host Profesional & Jelas (Gadis +2%)",
    azureVoice: "id-ID-GadisNeural",
    rate: "+2%",
    pitch: "+0Hz",
    cast: "Aoede",
  },
  "edge-senja": {
    id: "edge-senja",
    name: "Nada Senja (Edge)",
    gender: "female",
    roleDesc: "Storytelling Lembut & Syahdu (Gadis -25% / -2Hz)",
    azureVoice: "id-ID-GadisNeural",
    rate: "-25%",
    pitch: "-2Hz",
    cast: "Aoede",
  },
  "edge-keisha": {
    id: "edge-keisha",
    name: "Keisha (Edge)",
    gender: "female",
    roleDesc: "Gen-Z Aesthetic & Skincare (Gadis +4% / +1Hz)",
    azureVoice: "id-ID-GadisNeural",
    rate: "+4%",
    pitch: "+1Hz",
    cast: "Kore",
  },
};

/**
 * Authentic Kang Suara Acoustic Directives
 * Extracted from Kang Suara Master Edition (D:\Projects\Canvas\Kang Suara Master.html).
 * Injected as system directives into Gemini Studio Speech to elicit authentic human Indonesian
 * phrasing, natural breath pauses, and lifelike emotional cadence.
 */
export const KANG_SUARA_DIRECTIVES: Record<string, { cast: string; directive: string }> = {
  "kang-sarah": {
    cast: "Aoede",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, aksen lokal tulen tanpa cengkok asing.\n- Register Suara: Wanita dewasa muda, jernih, berwibawa, hangat dan ramah.\n- Gaya Akting: Artikulasi jernih dan santai seperti host profesional, jeda nafas alami.\n- Dinamika Melodi: Nada bersahabat, percaya diri, intonasi percakapan luwes.\n\n",
  },
  "kang-dimas": {
    cast: "Charon",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, aksen lokal tulen tanpa cengkok asing.\n- Register Suara: Pria dewasa bariton rendah, tenang dan berwibawa.\n- Gaya Akting: Tenang, edukatif, berbobot seperti narator video essay terpercaya.\n- Dinamika Melodi: Melodi tegas, artikulasi matang, intonasi meyakinkan.\n\n",
  },
  "kang-bams": {
    cast: "Puck",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, gaya kreator TikTok/Reels masa kini.\n- Register Suara: Pria muda energik, vokal renyah.\n- Gaya Akting: Cepat, punchy, ceplas-ceplos, gaya hook contrarian nyolot yang bikin penasaran.\n- Dinamika Melodi: Ritme cepat dinamis, intonasi naik di awal kalimat.\n\n",
  },
  "kang-senja": {
    cast: "Aoede",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, aksen lembut syahdu.\n- Register Suara: Wanita dewasa, desah nafas lembut, hangat dan menenangkan.\n- Gaya Akting: Storytelling meditatif, hipnotis, tempo teratur dengan kehangatan mendalam.\n- Dinamika Melodi: Melodi lembut mengalun perlahan, jeda nafas rileks.\n\n",
  },
  "kang-bimo": {
    cast: "Charon",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, gaya anak muda kota.\n- Register Suara: Pria muda, santai, vokal bersahabat.\n- Gaya Akting: Reviewer gadget santai, bahasa gaul kekinian, blak-blakan jujur.\n- Dinamika Melodi: Percakapan kasual santai seperti ngobrol di cafe.\n\n",
  },
  "kang-keisha": {
    cast: "Kore",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, gaya Gen-Z modern.\n- Register Suara: Remaja wanita ceria, vokal manis aesthetic.\n- Gaya Akting: Cerita skincare & lifestyle seru, antusias, ekspresif dan natural.\n- Dinamika Melodi: Intonasi ceria, artikulasi renyah penuh energi positif.\n\n",
  },
  "kang-reno": {
    cast: "Puck",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, gaya gamer/streamer hype.\n- Register Suara: Remaja pria energik, vokal cepat.\n- Gaya Akting: Semangat tinggi, hype, seru, interaktif mengajak penonton.\n- Dinamika Melodi: Dinamika cepat menghentak, penuh antusiasme.\n\n",
  },
  "kang-hartono": {
    cast: "Charon",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, aksen berwibawa.\n- Register Suara: Pria matang 50 tahun, vokal tenang dan berpengalaman.\n- Gaya Akting: Pengusaha sukses bijak, memberi nasihat karir & finansial mendalam.\n- Dinamika Melodi: Melodi stabil, tempo teratur, berwibawa.\n\n",
  },
  "kang-ratna": {
    cast: "Aoede",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, vokal keibuan hangat.\n- Register Suara: Wanita matang 50 tahun, ramah dan tulus.\n- Gaya Akting: Mengayomi, penuh kasih sayang, mendidik dengan sabar.\n- Dinamika Melodi: Mengalun hangat, nada ramah dan tulus.\n\n",
  },
  "kang-arka": {
    cast: "Puck",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, vokal anak-anak.\n- Register Suara: Anak cowok 8 tahun, lincah dan ceria.\n- Gaya Akting: Penuh rasa ingin tahu, polos, gembira mengeksplor hal baru.\n- Dinamika Melodi: Nada naik turun ceria khas anak-anak.\n\n",
  },
  "kang-naura": {
    cast: "Kore",
    directive:
      "[Arahan Akustik Sutradara Vokal]:\n- Target Vokal: Penutur asli bahasa Indonesia, vokal anak-anak.\n- Register Suara: Anak cewek 8 tahun, imut dan manis.\n- Gaya Akting: Ceria, ramah, menggemaskan dan penuh senyum.\n- Dinamika Melodi: Melodi riang gembira anak-anak.\n\n",
  },
};

/**
 * Generate Microsoft Azure / Edge Neural TTS with natural Indonesian prosody,
 * emotional inflection, and breathing pauses.
 */
async function generateMicrosoftNeuralTTS(
  text: string,
  voice: string = "id-ID-ArdiNeural",
  rate: string = "+0%",
  pitch: string = "+0Hz"
): Promise<Buffer> {
  const tempFile = path.join(os.tmpdir(), `tts_neural_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);
  
  // Clean text: strip quotes, brackets, and emojis, then normalize English loanwords
  const stripped = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/["\\`*_~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const clean = normalizeIndonesianEnglishTTS(stripped);
  const cacheKey = `${voice}|${rate}|${pitch}|${clean}`;
  const cached = ttsMemoryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const cmd = `edge-tts --voice ${voice} --rate="${rate}" --pitch="${pitch}" --text "${clean}" --write-media "${tempFile}"`;

  try {
    await execPromise(cmd, { timeout: 12000 });
    if (fs.existsSync(tempFile)) {
      const buffer = fs.readFileSync(tempFile);
      fs.unlinkSync(tempFile);
      if (buffer.length > 500) {
        if (ttsMemoryCache.size >= MAX_TTS_CACHE) {
          const firstKey = ttsMemoryCache.keys().next().value;
          if (firstKey) ttsMemoryCache.delete(firstKey);
        }
        ttsMemoryCache.set(cacheKey, buffer);
        return buffer;
      }
    }
    throw new Error("Neural TTS generated empty file");
  } catch (err) {
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (_) {}
    }
    throw err;
  }
}

function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000, numChannels: number = 1): Buffer {
  const header = Buffer.alloc(44);
  const dataLen = pcmBuffer.length;
  const fileLen = dataLen + 36;
  header.write("RIFF", 0);
  header.writeUInt32LE(fileLen, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * 2, 28);
  header.writeUInt16LE(numChannels * 2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataLen, 40);
  return Buffer.concat([header, pcmBuffer]);
}

/**
 * Ultra-Natural Human Studio Voice using Google Gemini Speech API (24kHz Studio Quality)
 * Cascades across 3.8-flash-lite-tts, 2.5-flash-preview-tts, 3.1-flash-tts-preview, 3.8-flash-tts, 2.5-pro-preview-tts.
 * Automatically respects quota cooldowns to prevent 8-second request hangs.
 */
async function generateGeminiTTS(text: string, voiceName: string = "Aoede"): Promise<Buffer> {
  const rawApiKey = process.env.GEMINI_API_KEY || "";
  const apiKeys = rawApiKey
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 20);
  if (apiKeys.length === 0) throw new Error("GEMINI_API_KEY is not configured");

  if (Date.now() < geminiQuotaExhaustedUntil) {
    throw new Error("Gemini daily TTS quota currently in cooldown, skipping to instant Neural fallback");
  }

  const clean = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/["\\`*_~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const cacheKey = `gemini|${voiceName}|${clean}`;
  const cached = ttsMemoryCache.get(cacheKey);
  if (cached) return cached;

  const ttsCandidateModels = [
    "gemini-2.5-flash-preview-tts",
    "gemini-2.5-pro-preview-tts",
    "gemini-3.1-flash-tts-preview",
    "gemini-3.8-flash-tts",
    "gemini-3.8-flash-lite-tts",
  ];

  let lastErr = null;
  let allKeysExhausted = true;

  for (let k = 0; k < apiKeys.length; k++) {
    const currentKey = apiKeys[k];
    let keyHitQuota = false;

    for (const modelName of ttsCandidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: clean }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName }
                }
              }
            }
          })
        });

        if (!res.ok) {
          if (res.status === 429) {
            keyHitQuota = true;
            break; // Skip to next API key if this key exceeded quota
          }
          const errText = await res.text();
          lastErr = new Error(`Gemini TTS API (${modelName}) error ${res.status}: ${errText}`);
          continue;
        }

        const data = await res.json();
        const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        const base64Audio = inlineData?.data;
        if (!base64Audio) {
          lastErr = new Error(`No audio inlineData returned by ${modelName}`);
          continue;
        }

        const mime = inlineData?.mimeType || "";
        const rawBuf = Buffer.from(base64Audio, "base64");
        const wav = mime.includes("wav") ? rawBuf : pcmToWav(rawBuf, 24000, 1);

        if (ttsMemoryCache.size >= MAX_TTS_CACHE) {
          const firstKey = ttsMemoryCache.keys().next().value;
          if (firstKey) ttsMemoryCache.delete(firstKey);
        }
        ttsMemoryCache.set(cacheKey, wav);
        return wav;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!keyHitQuota) {
      allKeysExhausted = false;
    }
  }

  if (allKeysExhausted) {
    geminiQuotaExhaustedUntil = Date.now() + 10 * 60 * 1000;
  }

  throw lastErr || new Error("All Gemini TTS models failed");
}

/**
 * 100% Offline Local Piper ONNX TTS using standalone D:\Projects\LocalVoiceEngine
 */
async function generatePiperLocalTTS(text: string): Promise<Buffer> {
  const speakScript = process.env.LOCAL_VOICE_SCRIPT || ["D:", "Projects", "LocalVoiceEngine", "speak.ps1"].join("\\");
  const tempWav = path.join(os.tmpdir(), `tts_piper_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`);
  const clean = normalizeIndonesianEnglishTTS(
    text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/["\\`*_~[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );

  try {
    await execPromise(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${speakScript}" -Text "${clean.replace(/"/g, "'")}" -OutFile "${tempWav}"`,
      { timeout: 10000 }
    );
    if (fs.existsSync(tempWav)) {
      const buffer = fs.readFileSync(tempWav);
      fs.unlinkSync(tempWav);
      if (buffer.length > 500) {
        return buffer;
      }
    }
    throw new Error("Piper generated empty WAV file");
  } catch (err) {
    if (fs.existsSync(tempWav)) {
      try { fs.unlinkSync(tempWav); } catch (_) {}
    }
    throw err;
  }
}

/**
 * Formats text for natural Indonesian neural speech phrasing:
 * - Converts ALL-CAPS headlines to natural sentence case with clean capitalization
 * - Inserts subtle breathing commas before Indonesian conjunctions for melodic pitch contours
 * - Cleans up multiple punctuation to avoid robotic stutter
 */
function formatNaturalSpeechProsody(input: string): string {
  // Expanded phonetics & acronyms for natural human Indonesian speech
  const acronyms: Record<string, string> = {
    KRL: "K R L",
    IPL: "I P L",
    CTA: "C T A",
    KPR: "K P R",
    KTP: "K T P",
    BBM: "B B M",
    UMKM: "U M K M",
    HRD: "H R D",
    FYP: "F Y P",
    AI: "A I",
    HP: "hape",
  };

  let out = input;
  for (const [acr, exp] of Object.entries(acronyms)) {
    const reg = new RegExp(`\\b${acr}\\b`, "g");
    out = out.replace(reg, exp);
  }

  // Lowercase all-caps words (>1 char) so Microsoft Neural doesn't spell them out mechanically
  out = out.replace(/\b[A-Z]{2,}\b/g, (w) => w.toLowerCase());

  // Capitalize sentence beginnings
  out = out.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

  // Insert natural breathing pauses before Indonesian conjunctions & discourse transitions
  out = out.replace(
    /([a-zA-Z0-9])\s+(tapi|tetapi|namun|karena|sehingga|supaya|agar|sedangkan|padahal|makanya|ternyata|bahkan|apalagi|jadinya)\b/gi,
    "$1, $2"
  );

  // Insert gentle breathing pause after Indonesian conversational opener words
  out = out.replace(
    /(^|[.!?]\s+)(Nah|Jujur|Bayangin|Coba deh|Ternyata|Faktanya|Menariknya|Kuncinya)\s+([a-zA-Z])/gi,
    "$1$2, $3"
  );

  // Normalize punctuation: avoid "..." which glitches Microsoft Neural TTS into robotic pauses
  out = out.replace(/\.{2,}/g, ", ");
  out = out.replace(/([?!])\s+/g, "$1 ");
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

/**
 * Voice-specific natural emotional prosody tuning:
 * Distinguishes female (Gadis) vs male (Ardi) accurately so Gadis is never distorted
 * by aggressive rate/pitch boosts.
 */
function getVoiceProsody(
  targetVoice: string,
  emotion: string = "normal",
  customRate?: string,
  customPitch?: string
): { rate: string; pitch: string } {
  if (customRate && customPitch) {
    return { rate: customRate, pitch: customPitch };
  }

  const isFemale =
    targetVoice.toLowerCase().includes("gadis") ||
    targetVoice.toLowerCase().includes("aoede") ||
    targetVoice.toLowerCase().includes("kore");

  if (isFemale) {
    // id-ID-GadisNeural: warm, natural, friendly creator tone
    switch (emotion) {
      case "shocked":
        return { rate: customRate || "+3%", pitch: customPitch || "+1Hz" };
      case "skeptical":
        return { rate: customRate || "-2%", pitch: customPitch || "-1Hz" };
      case "celebrate":
        return { rate: customRate || "+3%", pitch: customPitch || "+1Hz" };
      case "point-cta":
        return { rate: customRate || "+1%", pitch: customPitch || "+0Hz" };
      default:
        return { rate: customRate || "+1%", pitch: customPitch || "+0Hz" };
    }
  } else {
    // id-ID-ArdiNeural: lively, dynamic, confident podcast host tone
    switch (emotion) {
      case "shocked":
        return { rate: customRate || "+5%", pitch: customPitch || "+1Hz" };
      case "skeptical":
        return { rate: customRate || "-2%", pitch: customPitch || "-1Hz" };
      case "celebrate":
        return { rate: customRate || "+4%", pitch: customPitch || "+1Hz" };
      case "point-cta":
        return { rate: customRate || "+2%", pitch: customPitch || "+0Hz" };
      default:
        return { rate: customRate || "+2%", pitch: customPitch || "+0Hz" };
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      voice = "id-ID-ArdiNeural",
      emotion = "normal",
      customRate,
      customPitch,
    } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const formattedText = formatNaturalSpeechProsody(text.trim());

    // 1. Dedicated Edge Neural Personas (100% Unlimited RPD & Zero Cost with Kang Suara Pitch/Rate Calibration)
    const kangPersona = KANG_SUARA_PERSONAS[voice.toLowerCase()];
    if (voice.toLowerCase().startsWith("edge-") && kangPersona) {
      try {
        const neuralBuffer = await generateMicrosoftNeuralTTS(
          formattedText,
          kangPersona.azureVoice,
          customRate || kangPersona.rate,
          customPitch || kangPersona.pitch
        );
        return new NextResponse(new Uint8Array(neuralBuffer), {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": neuralBuffer.length.toString(),
            "X-TTS-Engine": `Kang-Suara-Edge-${kangPersona.name}`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      } catch (err) {
        console.warn(`Edge persona (${kangPersona.name}) error:`, err);
      }
    }

    // 2. Kang Suara Studio Personas (Powered by Studio Gemini 24kHz + Acoustic Directives)
    if (kangPersona) {
      const directiveInfo = KANG_SUARA_DIRECTIVES[voice.toLowerCase()];
      const targetCast = directiveInfo ? directiveInfo.cast : kangPersona.cast;
      const directivePrefix = directiveInfo ? directiveInfo.directive : "";
      const promptText = `${directivePrefix}${formattedText}`;

      // Try Studio Gemini Speech with Kang Suara's authentic voice cast & acoustic directive
      try {
        const geminiWav = await generateGeminiTTS(promptText, targetCast);
        return new NextResponse(new Uint8Array(geminiWav), {
          status: 200,
          headers: {
            "Content-Type": "audio/wav",
            "Content-Length": geminiWav.length.toString(),
            "X-TTS-Engine": `Kang-Suara-Studio-${kangPersona.name}`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      } catch (geminiErr) {
        console.warn(`Kang Suara Studio (${kangPersona.name}) quota exhausted, falling back to Azure Neural:`, (geminiErr as any)?.message || geminiErr);
        // Fallback to Azure Neural with calibrated prosody
        try {
          const neuralBuffer = await generateMicrosoftNeuralTTS(
            formattedText,
            kangPersona.azureVoice,
            customRate || kangPersona.rate,
            customPitch || kangPersona.pitch
          );
          return new NextResponse(new Uint8Array(neuralBuffer), {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": neuralBuffer.length.toString(),
              "X-TTS-Engine": `Kang-Suara-NeuralFallback-${kangPersona.name}`,
              "Cache-Control": "public, max-age=86400",
            },
          });
        } catch (_) {}
      }
    }

    // 2. Google Gemini Ultra-Natural Studio Voice Multi-Model Cascade
    const geminiVoiceMap: Record<string, string> = {
      "gemini-aoede": "Aoede",
      "aoede": "Aoede",
      "gemini-kore": "Kore",
      "kore": "Kore",
      "gemini-charon": "Charon",
      "charon": "Charon",
      "gemini-puck": "Puck",
      "puck": "Puck",
      "gemini-fenrir": "Fenrir",
      "fenrir": "Fenrir",
    };

    const isGeminiVoice = voice.toLowerCase().startsWith("gemini") || !!geminiVoiceMap[voice.toLowerCase()];
    if (isGeminiVoice) {
      const selectedGeminiVoice = geminiVoiceMap[voice.toLowerCase()] || "Aoede";
      try {
        const geminiWav = await generateGeminiTTS(formattedText, selectedGeminiVoice);
        return new NextResponse(new Uint8Array(geminiWav), {
          status: 200,
          headers: {
            "Content-Type": "audio/wav",
            "Content-Length": geminiWav.length.toString(),
            "X-TTS-Engine": `Google-Gemini-Speech-${selectedGeminiVoice}`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      } catch (geminiErr) {
        console.warn(`Gemini TTS (${selectedGeminiVoice}) fallback to Cloud Microsoft Azure Neural:`, (geminiErr as any)?.message || geminiErr);
        // Fall back to Microsoft Neural HD with matched gender & natural prosody
        const fallbackVoice = ["Aoede", "Kore"].includes(selectedGeminiVoice)
          ? "id-ID-GadisNeural"
          : "id-ID-ArdiNeural";
        const { rate, pitch } = getVoiceProsody(fallbackVoice, emotion, customRate, customPitch);
        try {
          const neuralBuffer = await generateMicrosoftNeuralTTS(formattedText, fallbackVoice, rate, pitch);
          return new NextResponse(new Uint8Array(neuralBuffer), {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": neuralBuffer.length.toString(),
              "X-TTS-Engine": `Microsoft-Azure-Neural-${fallbackVoice.includes("Gadis") ? "Gadis" : "Ardi"}-CloudFallback`,
              "Cache-Control": "public, max-age=86400",
            },
          });
        } catch (_) {}
      }
    }

    // 2. Microsoft Azure / Edge Neural TTS HD
    const neuralTargetVoice = voice.toLowerCase().includes("gadis") || voice.toLowerCase().includes("aoede") || voice.toLowerCase().includes("kore")
      ? "id-ID-GadisNeural"
      : "id-ID-ArdiNeural";
    const { rate, pitch } = getVoiceProsody(neuralTargetVoice, emotion, customRate, customPitch);

    try {
      const neuralBuffer = await generateMicrosoftNeuralTTS(formattedText, neuralTargetVoice, rate, pitch);
      return new NextResponse(new Uint8Array(neuralBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": neuralBuffer.length.toString(),
          "X-TTS-Engine": `Microsoft-Azure-Neural-${neuralTargetVoice.includes("Gadis") ? "Gadis" : "Ardi"}`,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (neuralErr) {
      console.warn("Microsoft Neural TTS unavailable, checking local Piper offline fallback:", neuralErr);
    }

    // 3. Local Piper ONNX Offline Fallback (if running on local PC with Piper binary)
    try {
      const piperWav = await generatePiperLocalTTS(formattedText);
      return new NextResponse(new Uint8Array(piperWav), {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": piperWav.length.toString(),
          "X-TTS-Engine": "Piper-ONNX-Offline",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (piperErr) {
      console.warn("Piper local TTS fallback failed:", piperErr);
    }

    // Never fallback to robotic Google Translate! Return graceful error
    return NextResponse.json(
      { error: "Audio engine temporarily unavailable. Please retry." },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";
  const voice = searchParams.get("voice") || "id-ID-ArdiNeural";
  const emotion = searchParams.get("emotion") || "normal";

  if (!text) {
    return NextResponse.json({ error: "Text query param is required" }, { status: 400 });
  }

  const formattedText = formatNaturalSpeechProsody(text.trim());

  const kangPersona = KANG_SUARA_PERSONAS[voice.toLowerCase()];
  if (kangPersona) {
    try {
      const neuralBuffer = await generateMicrosoftNeuralTTS(formattedText, kangPersona.azureVoice, kangPersona.rate, kangPersona.pitch);
      return new NextResponse(new Uint8Array(neuralBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": neuralBuffer.length.toString(),
          "X-TTS-Engine": `Kang-Suara-${kangPersona.name}`,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (_) {}
  }

  const targetVoice = voice.toLowerCase().includes("gadis") ? "id-ID-GadisNeural" : "id-ID-ArdiNeural";
  const { rate, pitch } = getVoiceProsody(targetVoice, emotion);

  try {
    const neuralBuffer = await generateMicrosoftNeuralTTS(formattedText, targetVoice, rate, pitch);
    return new NextResponse(new Uint8Array(neuralBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": neuralBuffer.length.toString(),
        "X-TTS-Engine": `Microsoft-Azure-Neural-${targetVoice.includes("Gadis") ? "Gadis" : "Ardi"}`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (_) {
    const fallbackBuffer = await fetchGoogleTTSFallback(formattedText, "id");
    return new NextResponse(new Uint8Array(fallbackBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": fallbackBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
}
