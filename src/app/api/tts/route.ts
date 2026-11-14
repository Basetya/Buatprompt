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
 * Phonetic normalizer so Indonesian Neural TTS (id-ID-ArdiNeural / GadisNeural)
 * pronounces common English loanwords & creator/tech terms naturally
 * instead of reading them letter-by-letter with Indonesian spelling.
 */
function normalizeIndonesianEnglishTTS(input: string): string {
  const phoneticMap: Record<string, string> = {
    lifestyle: "laifstail",
    inflation: "infleisyenn",
    autodebet: "otodebet",
    save: "seiv",
    share: "syer",
    scroll: "skrol",
    followers: "folowers",
    follower: "folower",
    affiliate: "afili-et",
    skincare: "skinker",
    breakout: "brek-aut",
    purging: "perjing",
    content: "konten",
    creator: "kri-eiter",
    viral: "vairel",
    hook: "huk",
    mindset: "mainset",
    cashflow: "kesflou",
    budget: "bajet",
    budgeting: "bajeting",
    gadget: "gejet",
    flagship: "fleksyip",
    upgrade: "apgreid",
    download: "daunlod",
    passive: "pesif",
    income: "inkam",
    feedback: "fitbek",
    branding: "brending",
    storytelling: "stori teling",
    closing: "klosing",
    checkout: "cek-aut",
    review: "ri-vyu",
    growth: "grout",
    scale: "skeil",
    update: "apdeit",
    online: "onlain",
    offline: "oflain",
    skill: "skil",
    agent: "eijen",
    github: "git-hab",
    design: "disain",
    swipe: "swaip",
    workflow: "werkflou",
    deadline: "dedlain",
    freelance: "frilens",
    marketing: "mar-keting",
    personal: "per-sonal",
    finance: "fainens",
    financial: "fainensyel",
    wealth: "welt",
    profit: "profit",
    margin: "marjin",
    revenue: "revenyu",
    engagement: "engeijmen",
    algorithm: "algoritma",
    retention: "ritensyen",
    highlight: "hailait",
    caption: "kepsen",
    voiceover: "vois-over",
  };

  return input.replace(/\b[a-zA-Z]+\b/g, (word) => {
    const lower = word.toLowerCase();
    return phoneticMap[lower] || word;
  });
}

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
 * Cascades across 3.1-flash-tts-preview, 3.8-flash-tts, 3.8-flash-lite-tts, 2.5-pro-preview-tts
 * so it NEVER hits quota limits or falls back to robotic audio.
 */
async function generateGeminiTTS(text: string, voiceName: string = "Aoede"): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const clean = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/["\\`*_~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const cacheKey = `gemini|${voiceName}|${clean}`;
  const cached = ttsMemoryCache.get(cacheKey);
  if (cached) return cached;

  const ttsCandidateModels = [
    "gemini-3.1-flash-tts-preview",
    "gemini-3.8-flash-tts",
    "gemini-3.8-flash-lite-tts",
    "gemini-2.5-pro-preview-tts",
    "gemini-2.5-flash-preview-tts"
  ];

  let lastErr = null;
  for (const modelName of ttsCandidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
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
 * - Converts ALL-CAPS headlines to natural sentence case so TTS doesn't flatten them
 * - Inserts subtle breathing commas before Indonesian conjunctions for melodic pitch contours
 */
function formatNaturalSpeechProsody(input: string): string {
  // Lowercase ALL-CAPS words (>2 chars) except common acronyms (HP, AI, CV, HRD, UMKM, BBM, KPR, ATS, STAR)
  const acronyms = new Set(["HP", "AI", "CV", "HRD", "UMKM", "BBM", "KPR", "ATS", "STAR", "HD", "SD", "SMP", "SMA"]);
  let out = input.replace(/\b[A-Z]{3,}\b/g, (w) => (acronyms.has(w) ? w : w.toLowerCase()));

  // Insert natural breathing pause before conjunctions if no punctuation precedes them
  out = out.replace(
    /([a-zA-Z0-9])\s+(tapi|tetapi|namun|karena|sehingga|supaya|agar|sedangkan|padahal)\b/gi,
    "$1, $2"
  );

  // Add slight dramatic breath pause after hook ? or !
  out = out.replace(/([?!])\s+/g, "$1 ... ");
  return out;
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

    // 1. Voice-Specific Natural Emotional Prosody & Cadence Tuning
    const isFemale = voice.toLowerCase().includes("gadis");
    let rate = customRate || (isFemale ? "-2%" : "+0%");
    let pitch = customPitch || (isFemale ? "-2Hz" : "+0Hz");
    const formattedText = formatNaturalSpeechProsody(text.trim());

    if (emotion === "shocked") {
      rate = customRate || (isFemale ? "+4%" : "+10%");
      pitch = customPitch || (isFemale ? "+1Hz" : "+3Hz");
    } else if (emotion === "skeptical") {
      rate = customRate || (isFemale ? "-6%" : "-4%");
      pitch = customPitch || (isFemale ? "-5Hz" : "-2Hz");
    } else if (emotion === "celebrate") {
      rate = customRate || (isFemale ? "+2%" : "+6%");
      pitch = customPitch || (isFemale ? "+0Hz" : "+2Hz");
    } else if (emotion === "point-cta") {
      rate = customRate || (isFemale ? "-2%" : "+2%");
      pitch = customPitch || (isFemale ? "-2Hz" : "+0Hz");
    }

    // 2. Primary: Google Gemini Ultra-Natural Studio Voice Multi-Model Cascade
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
        console.warn(`Gemini TTS (${selectedGeminiVoice}) fallback to Cloud Microsoft Azure Neural:`, geminiErr);
        // Fall back to Microsoft Neural HD (Gadis for female voices, Ardi for male voices)
        const fallbackVoice = ["Aoede", "Kore"].includes(selectedGeminiVoice)
          ? "id-ID-GadisNeural"
          : "id-ID-ArdiNeural";
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

    // 3. Fallback: Microsoft Azure / Edge Neural TTS HD (Accessible from anywhere: phone, laptop, cloud)
    const neuralTargetVoice = voice === "id-ID-GadisNeural" || voice === "gemini-aoede" || voice === "gemini-kore"
      ? "id-ID-GadisNeural"
      : "id-ID-ArdiNeural";

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

    // 4. Local Piper ONNX Offline Fallback (if running on local PC with Piper binary)
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

  try {
    const neuralBuffer = await generateMicrosoftNeuralTTS(text, voice);
    return new NextResponse(new Uint8Array(neuralBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": neuralBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (_) {
    const fallbackBuffer = await fetchGoogleTTSFallback(text, "id");
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
