import { NextRequest, NextResponse } from "next/server";
import https from "https";

function fetchGoogleTTSChunk(text: string, lang: string = "id"): Promise<Buffer> {
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
          reject(new Error(`TTS responded with status ${res.statusCode}`));
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
      reject(new Error("TTS request timed out"));
    });
  });
}

function splitTextIntoTTSChunks(text: string, maxLen: number = 130): string[] {
  // Strip emojis and unneeded markdown symbols
  const clean = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[#*`_~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

  // Split by natural clause boundaries (. , ! ? ; :)
  const clauses = clean.split(/(?<=[.!?,;:])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const clause of clauses) {
    if (!clause.trim()) continue;
    if ((current + " " + clause).trim().length <= maxLen) {
      current = (current + " " + clause).trim();
    } else {
      if (current) chunks.push(current);
      // If a single clause is longer than maxLen, break by words
      if (clause.length > maxLen) {
        const words = clause.split(" ");
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub + " " + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) chunks.push(sub);
        current = "";
      } else {
        current = clause;
      }
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, lang = "id" } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const chunks = splitTextIntoTTSChunks(text, 130);
    if (chunks.length === 0) {
      return NextResponse.json({ error: "No valid text after sanitization" }, { status: 400 });
    }

    // Fetch chunks sequentially or in small parallel batches to avoid throttling
    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      try {
        const buf = await fetchGoogleTTSChunk(chunk, lang);
        audioBuffers.push(buf);
      } catch (err) {
        console.warn("Failed chunk TTS, continuing:", err);
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json({ error: "TTS generation failed" }, { status: 502 });
    }

    const combinedBuffer = Buffer.concat(audioBuffers);

    return new NextResponse(combinedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combinedBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
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
  const lang = searchParams.get("lang") || "id";

  if (!text) {
    return NextResponse.json({ error: "Text query param is required" }, { status: 400 });
  }

  const chunks = splitTextIntoTTSChunks(text, 130);
  const audioBuffers: Buffer[] = [];
  for (const chunk of chunks) {
    try {
      const buf = await fetchGoogleTTSChunk(chunk, lang);
      audioBuffers.push(buf);
    } catch (err) {
      console.warn("Failed chunk TTS:", err);
    }
  }

  if (audioBuffers.length === 0) {
    return NextResponse.json({ error: "TTS generation failed" }, { status: 502 });
  }

  const combinedBuffer = Buffer.concat(audioBuffers);

  return new NextResponse(combinedBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": combinedBuffer.length.toString(),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
