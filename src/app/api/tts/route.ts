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

    // 1. Determine Natural Emotional Prosody & Cadence Tuning
    let rate = customRate || "+0%";
    let pitch = customPitch || "+0Hz";
    let formattedText = text.trim();

    if (emotion === "shocked") {
      // Hook: Intense, energetic, slightly higher pitch, dramatic pause before explanation
      rate = customRate || "+10%";
      pitch = customPitch || "+3Hz";
      formattedText = formattedText.replace(/([?!])\s+/g, "$1 ... ");
    } else if (emotion === "skeptical") {
      // Agitation: Serious, concerned, lower pitch, slightly slower pacing for gravity
      rate = customRate || "-4%";
      pitch = customPitch || "-2Hz";
    } else if (emotion === "celebrate") {
      // Solution: Confident, clear, bright, inspiring tempo
      rate = customRate || "+6%";
      pitch = customPitch || "+2Hz";
    } else if (emotion === "point-cta") {
      // CTA: Warm, friendly, conversational, clear call to action
      rate = customRate || "+2%";
      pitch = customPitch || "+0Hz";
    }

    // 2. Try Microsoft Azure / Edge Neural TTS first
    try {
      const neuralBuffer = await generateMicrosoftNeuralTTS(formattedText, voice, rate, pitch);
      return new NextResponse(new Uint8Array(neuralBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": neuralBuffer.length.toString(),
          "X-TTS-Engine": "Microsoft-Azure-Neural",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (neuralErr) {
      console.warn("Neural TTS unavailable, switching to fallback:", neuralErr);
    }

    // 3. Fallback to Google TTS if Neural is unreachable
    const fallbackBuffer = await fetchGoogleTTSFallback(formattedText, "id");
    return new NextResponse(new Uint8Array(fallbackBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": fallbackBuffer.length.toString(),
        "X-TTS-Engine": "Google-Translate-Legacy",
        "Cache-Control": "public, max-age=86400",
      },
    });
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
