import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  getVisionSystemPrompt,
  buildInfographicPrompt,
  buildSalesPagePrompt,
  buildColoringBookPrompt,
  buildGamePrompt,
  buildStoryboardPrompt,
  buildOptimizerPrompt,
} from "@/lib/promptEngines";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type, // 'vision' | 'infografis' | 'sales-page' | 'coloring-book' | 'game' | 'storyboard' | 'optimizer' | 'style'
      imageBase64,
      mediaType = "image", // 'image' | 'video'
      targetModel = "veo", // 'veo' | 'imagen3' | 'midjourney' | 'kling' | 'sora'
      language = "id",
      mode = "short",
      ...extraParams
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is provided, execute real LLM call
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      if (type === "vision" && imageBase64) {
        const systemPrompt = getVisionSystemPrompt({
          mediaType,
          targetModel,
          language,
          mode,
        });

        // Strip data URL header if present
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
        const mimeMatch = imageBase64.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : (mediaType === "video" ? "video/mp4" : "image/jpeg");

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: cleanBase64,
                    mimeType: mimeType,
                  },
                },
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
        });

        return NextResponse.json({
          prompt: response.text,
          model: "gemini-2.5-flash",
          targetModel,
        });
      }

      // Text based generators (infografis, sales page, etc.)
      let promptTask = "";
      if (type === "infografis") promptTask = buildInfographicPrompt(extraParams as any);
      else if (type === "sales-page") promptTask = buildSalesPagePrompt(extraParams as any);
      else if (type === "coloring-book") promptTask = buildColoringBookPrompt(extraParams as any);
      else if (type === "game") promptTask = buildGamePrompt(extraParams as any);
      else if (type === "storyboard") promptTask = buildStoryboardPrompt(extraParams as any);
      else if (type === "optimizer") promptTask = buildOptimizerPrompt(extraParams.rawPrompt, extraParams.targetAi);

      if (promptTask) {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: promptTask }] }],
        });
        return NextResponse.json({ prompt: response.text });
      }
    }

    // 2. Intelligent Offline / Direct Reconstruction Mode (When GEMINI_API_KEY is not configured yet)
    if (type === "infografis") {
      const p = buildInfographicPrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

    if (type === "sales-page") {
      const p = buildSalesPagePrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

    if (type === "coloring-book") {
      const p = buildColoringBookPrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

    if (type === "game") {
      const p = buildGamePrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

    if (type === "storyboard") {
      const p = buildStoryboardPrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

    if (type === "optimizer") {
      const p = buildOptimizerPrompt(extraParams.rawPrompt || "Buat gambar produk bagus", extraParams.targetAi);
      return NextResponse.json({ prompt: p });
    }

    if (type === "style") {
      const synth = `Hyper-realistic modern commercial aesthetic, studio softbox illumination, dynamic 45-degree angle, sharp metallic and matte reflections, 8k resolution, octane render, vivid emerald and lime neon glow.`;
      return NextResponse.json({
        prompt: synth,
        attributes: {
          style: "Modern Commercial Minimalist",
          lighting: "Studio Softbox 3-Point with Rim Light",
          camera: "45-degree dynamic close-up, 50mm f/1.8",
          colorPalette: ["#0a0a0c", "#d4f933", "#46e7d6", "#ffffff"],
          mood: "Premium & Energetic",
        },
      });
    }

    // Default Vision demo generator tailored for Google Flow (Veo / Imagen 3)
    if (mediaType === "video") {
      const veoPrompt = `[GOOGLE FLOW / VEO DIRECTORS PROMPT]
Cinematic high-definition slow tracking shot capturing the assembly of an intricate mechanical object. 
Camera: Smooth steady push-in dolly movement on 35mm anamorphic lens with subtle motion blur.
Lighting: Warm golden hour rim lighting paired with soft overhead studio diffusion, casting subtle realistic specular reflections.
Environment: Minimalist clean table surface with warm natural wooden grain texture, seamless dark matte backdrop.
Motion Dynamics: Fluid, deliberate hand movements precisely positioning mechanical gears and components, seamless stop-motion aesthetics.
Color Grading: Deep obsidian shadows, brushed metallic silver highlights, rich amber warmth.
Render Target: Google Flow (Veo) 1080p 24fps cinematic, photo-realism, master shot.

-- Versi Bahasa Indonesia:
Video sinematik resolusi tinggi yang menampilkan perakitan mendetail komponen presisi di atas meja kayu estetik. Kamera bergerak perlahan dolly-in dengan pencahayaan golden hour dan refleksi halus, menciptakan nuansa mewah dan profesional.`;

      return NextResponse.json({
        prompt: veoPrompt,
        targetModel: "Google Flow (Veo)",
        note: "Mode siap pakai. Pasang GEMINI_API_KEY di .env.local untuk live AI vision generation.",
      });
    }

    const imagenPrompt = `[GOOGLE FLOW / IMAGEN 3 PROMPT]
A high-end commercial product advertisement photo, center-focused composition.
Subject: Sleek modern design element floating weightlessly with subtle micro-droplets and luminous particle trails.
Lighting: Volumetric studio lighting with electric lime accents and cyan rim glow, delicate reflections on dark polished acrylic surface.
Optics: Shot on 85mm prime lens, f/1.4 shallow depth of field, razor-sharp focus on the primary subject, creamy bokeh background.
Atmosphere: Clean, futuristic, premium advertising aesthetics, ultra-detailed textures, 8k resolution, photorealistic masterpiece.

-- Versi Bahasa Indonesia:
Foto iklan produk komersial berkualitas studio dengan pencahayaan neon lime dan cyan yang elegan. Objek melayang dengan partikel energi halus dan refleksi jernih di atas permukaan gelap, memberikan kesan modern dan eksklusif.`;

    return NextResponse.json({
      prompt: imagenPrompt,
      targetModel: "Google Flow (Imagen 3)",
      note: "Mode siap pakai. Pasang GEMINI_API_KEY di .env.local untuk live AI vision generation.",
    });
  } catch (error: any) {
    console.error("API Generate Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
