import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  getVisionSystemPrompt,
  buildGoogleFlowDirectorPrompt,
  buildUniversalPromptMatrix,
  buildViralHookPrompt,
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
      type, // 'vision' | 'google-flow-director' | 'prompt-matrix' | 'viral-hook' | 'infografis' | 'sales-page' | 'coloring-book' | 'game' | 'storyboard' | 'optimizer' | 'style'
      imageBase64,
      mediaType = "image",
      targetModel = "veo",
      language = "id",
      mode = "short",
      ...extraParams
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is available, handle live LLM inference
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      if (type === "vision" && imageBase64) {
        const systemPrompt = getVisionSystemPrompt({
          mediaType,
          targetModel,
          language,
          mode,
        });

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

      // Live text based generation
      let promptTask = "";
      if (type === "google-flow-director") promptTask = buildGoogleFlowDirectorPrompt(extraParams as any);
      else if (type === "viral-hook") promptTask = buildViralHookPrompt(extraParams as any);
      else if (type === "infografis") promptTask = buildInfographicPrompt(extraParams as any);
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

    // 2. Offline / Direct Production Synthesis Mode
    if (type === "google-flow-director") {
      const p = buildGoogleFlowDirectorPrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

    if (type === "prompt-matrix") {
      const matrix = buildUniversalPromptMatrix(extraParams.concept || "Commercial luxury espresso coffee cup with velvet foam", extraParams.visualMood);
      return NextResponse.json({ matrix });
    }

    if (type === "viral-hook") {
      const p = buildViralHookPrompt(extraParams as any);
      return NextResponse.json({ prompt: p });
    }

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
      const synth = `Hyper-detailed cinematic aesthetic, 3-point studio lighting with high-contrast rim light, shot from 45-degree angle, rendered in Octane Render & Unreal Engine 5. Color palette: Deep obsidian, electric violet, vibrant cyan. Masterpiece, 8K resolution, award-winning commercial lighting.`;
      return NextResponse.json({
        prompt: synth,
        attributes: {
          style: "Futuristic Studio Commercial",
          lighting: "3-Point Studio Softbox + Electric Violet Rim Light",
          camera: "Cinematic 45-degree, 50mm f/1.8 Anamorphic",
          colorPalette: ["#07080c", "#6366f1", "#06b6d4", "#f1f5f9"],
          mood: "Premium & Visionary",
        },
      });
    }

    // Default Vision Demo Generator for Google Flow (Veo / Imagen 3)
    if (mediaType === "video") {
      const veoPrompt = `[BUATPROMPT STUDIO — GOOGLE FLOW (VEO 2) MASTER DIRECTIVE]
Cinematic 4K slow tracking push-in shot capturing mechanical precision assembly.
Camera: Smooth steady push-in dolly movement on 35mm anamorphic prime lens with subtle physical motion blur.
Lighting Setup: Volumetric golden hour rim lighting paired with soft diffused overhead studio lighting, authentic specular reflections.
Environment: Minimalist dark acrylic studio surface with warm walnut wood grain accents, subtle atmospheric haze.
Temporal Motion: Deliberate, fluid hand movements positioning intricate mechanical components with microscopic precision.
Color Grading: Deep obsidian shadows, brushed titanium highlights, warm amber rim glow.
Audio Soundscape: Low-frequency ambient room tone, tactile mechanical clicks, subtle rising orchestral swell.
Target Engine: Google Flow (Veo 2) 4K 24fps master shot.

-- Ringkasan Bahasa Indonesia:
Video sinematik beresolusi tinggi yang menampilkan perakitan presisi komponen miniatur di atas meja estetik. Kamera bergerak dolly-in perlahan dengan tata cahaya golden hour dan pantulan halus, menghasilkan video komersial berkelas dunia.`;

      return NextResponse.json({
        prompt: veoPrompt,
        targetModel: "Google Flow (Veo 2)",
      });
    }

    const imagenPrompt = `[BUATPROMPT STUDIO — GOOGLE FLOW (IMAGEN 3) MASTER DIRECTIVE]
Center-weighted commercial hero photograph of an iconic luxury subject.
Subject: Flawlessly rendered, floating with weightless poise, surrounded by crystalline micro-particles and ethereal luminous energy trails.
Lighting Rig: Key light at 45 degrees, soft ambient fill, electric violet and cyan rim light creating razor-sharp silhouette separation.
Optics: Captured on 85mm prime lens at f/1.4 for creamy circular bokeh, ultra-sharp subject focus, zero chromatic aberration.
Color & Mood: Deep cosmic background, pristine metallic reflections, ultra-high dynamic range, 8K photorealism.

-- Ringkasan Bahasa Indonesia:
Foto produk komersial premium dengan pencahayaan rim light violet dan cyan yang tajam. Objek melayang dengan partikel cahaya halus dan latar belakang bokeh artistik, menciptakan daya tarik visual eksklusif.`;

    return NextResponse.json({
      prompt: imagenPrompt,
      targetModel: "Google Flow (Imagen 3)",
    });
  } catch (error: any) {
    console.error("API Generate Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
