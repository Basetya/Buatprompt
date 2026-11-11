import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  getVisionSystemPrompt,
  buildMultiAngleCampaign,
  buildSevenDaySprint,
  buildCharacterAnchorPrompt,
  buildI2VMotionPrompt,
  buildCinemaPipelinePrompt,
  buildForensicInspectorData,
  buildGoogleFlowDirectorPrompt,
  buildUniversalPromptMatrix,
  buildViralHookPrompt,
  buildInfographicPrompt,
  buildSalesPagePrompt,
  buildColoringBookPrompt,
  buildGamePrompt,
  buildStoryboardPrompt,
  buildOptimizerPrompt,
  buildElevenLabsEmotionPrompt,
  buildFoleySoundscapePrompt,
  buildSafeZoneOpticsPrompt,
  buildHookSplitterPrompt,
  buildCashCowStoryPrompt,
  buildThumbnailArchitectPrompt,
  buildKineticMotionPrompt,
  buildMultiSceneStoryPrompt,
} from "@/lib/promptEngines";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      imageBase64,
      mediaType = "image",
      targetModel = "veo",
      language = "id",
      mode = "short",
      ...extraParams
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Live LLM Inference if API key is present
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

      // Live text generation for specialized prompts
      let taskPrompt = "";
      if (type === "cinema-pipeline") taskPrompt = buildCinemaPipelinePrompt(extraParams as any);
      else if (type === "i2v-motion") taskPrompt = buildI2VMotionPrompt(extraParams as any);
      else if (type === "content-sprint") taskPrompt = buildSevenDaySprint(extraParams as any);
      else if (type === "google-flow-director") taskPrompt = buildGoogleFlowDirectorPrompt(extraParams as any);
      else if (type === "viral-hook") taskPrompt = buildViralHookPrompt(extraParams as any);
      else if (type === "infografis") taskPrompt = buildInfographicPrompt(extraParams as any);
      else if (type === "sales-page") taskPrompt = buildSalesPagePrompt(extraParams as any);
      else if (type === "storyboard") taskPrompt = buildStoryboardPrompt(extraParams as any);
      else if (type === "optimizer") taskPrompt = buildOptimizerPrompt(extraParams.rawPrompt, extraParams.targetAi);

      if (type === "multi-scene-story") {
        try {
          const {
            topicIdea = "Tips Konten",
            rawScriptText = "",
            targetNiche = "General Creator",
            motionStyle = "apple-keynote",
            durationTarget = "55s",
            inputTab = "idea"
          } = extraParams;

          const is55s = durationTarget !== "26s";
          const targetSeconds = is55s ? 52 : 26;
          const targetWords = is55s ? "120-135 kata" : "60-65 kata";

          const systemPrompt = `Anda adalah Senior Creative Director dan Master Motion Graphic Copywriter.
Tugas Anda adalah menyusun naskah video vertikal 9:16 (TikTok, Instagram Reels, YouTube Shorts) berdurasi tepat ~${targetSeconds} detik (${targetWords}) yang dibagi menjadi 4 Scene sinematik dengan alur retensi visual tinggi:
- Scene 1: THE SHOCK HOOK (Kaitkan rasa penasaran, emosi "shocked", durasi ${is55s ? 10 : 6} detik)
- Scene 2: THE PAIN AGITATION (Bongkar kesalahan/masalah, emosi "skeptical", durasi ${is55s ? 15 : 7} detik)
- Scene 3: THE BREAKTHROUGH REVEAL (Solusi cerdas & aksi nyata, emosi "celebrate", durasi ${is55s ? 15 : 7} detik)
- Scene 4: THE INFINITE LOOP CTA (Call to action dan loop anchor menyatu kembali ke Scene 1, emosi "point-cta", durasi ${is55s ? 12 : 6} detik)

Input Pengguna:
- Topik/Ide: "${topicIdea}"
- Naskah Mentah Pengguna (jika ada): "${rawScriptText || ''}"
- Niche Target: "${targetNiche}"
- Gaya Visual: "${motionStyle}"
- Mode Input: "${inputTab}"

KEMBALIKAN HANYA JSON VALID (tanpa markdown code fences, tanpa kata pengantar) dengan struktur persis seperti ini:
{
  "topic": "${topicIdea}",
  "wordCount": 128,
  "estimatedVoiceSeconds": ${targetSeconds},
  "isTooLong": false,
  "totalDurationSec": ${targetSeconds},
  "retentionFormula": "3 Hukum Fisika Visual + Character Emotion Resonance + Word-by-Word Highlight",
  "scenes": [
    {
      "sceneNumber": 1,
      "stageName": "THE SHOCK HOOK",
      "timeRange": "0:00 - 0:${is55s ? '10' : '06'}",
      "headline": "TEKS HEADLINE HURUF BESAR SINGKAT",
      "subtext": "Penjelasan subteks yang dibacakan voiceover...",
      "metric": "STOP! 🛑",
      "highlightKeyword": "KATA_KUNCI",
      "durationSec": ${is55s ? 10 : 6},
      "characterEmotion": "shocked",
      "kineticFx": "Spring Punch Scale 1.2x + Alert Aura Halo",
      "foleyCue": "0:00 Fast Whoosh + Heavy Sub-Bass Thud"
    },
    {
      "sceneNumber": 2,
      "stageName": "THE PAIN AGITATION",
      "timeRange": "0:${is55s ? '10' : '06'} - 0:${is55s ? '25' : '13'}",
      "headline": "KENDALA UTAMA YANG BIKIN GAGAL",
      "subtext": "Penjelasan masalah yang membuat penonton merasa relate...",
      "metric": "-85% GAGAL",
      "highlightKeyword": "KENDALA",
      "durationSec": ${is55s ? 15 : 7},
      "characterEmotion": "skeptical",
      "kineticFx": "Wipe Push Left + Floating Red Question Particles",
      "foleyCue": "0:${is55s ? '10' : '06'} Camera Snap + Low Vinyl Scratch"
    },
    {
      "sceneNumber": 3,
      "stageName": "THE BREAKTHROUGH REVEAL",
      "timeRange": "0:${is55s ? '25' : '13'} - 0:${is55s ? '40' : '20'}",
      "headline": "TERAPKAN SOLUSI INI HARI INI",
      "subtext": "Penjelasan solusi praktis dan langkah konkrit yang terbukti efektif...",
      "metric": "+350% HASIL",
      "highlightKeyword": "SOLUSI",
      "durationSec": ${is55s ? 15 : 7},
      "characterEmotion": "celebrate",
      "kineticFx": "Dynamic Glowing SVG Curve Path + Rocket Sparkles",
      "foleyCue": "0:${is55s ? '25' : '13'} Harmonic Synth Swell + Crisp Cash Chime"
    },
    {
      "sceneNumber": 4,
      "stageName": "THE INFINITE LOOP CTA",
      "timeRange": "0:${is55s ? '40' : '20'} - 0:${targetSeconds}",
      "headline": "SIMPAN VIDEO INI BIAR NGGAK LUPA",
      "subtext": "Penjelasan ajakan simpan dan kalimat anchor yang nyambung kembali ke scene 1...",
      "metric": "SAVE! ✨",
      "highlightKeyword": "SIMPAN",
      "durationSec": ${is55s ? 12 : 6},
      "characterEmotion": "point-cta",
      "kineticFx": "Pulsating Bookmark Ring + Seamless Loop Match Cut",
      "foleyCue": "0:${is55s ? '40' : '20'} Clean Glass Bell Ding + Ambient Fade Out"
    }
  ]
}`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          });

          const rawText = response.text || "";
          const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedJson);
          if (parsed && Array.isArray(parsed.scenes) && parsed.scenes.length === 4) {
            return NextResponse.json(parsed);
          }
        } catch (llmErr) {
          console.warn("Live Gemini multi-scene generation failed, falling back to autonomous synthesis engine:", llmErr);
        }
      }

      if (taskPrompt) {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: taskPrompt }] }],
        });
        return NextResponse.json({ prompt: response.text });
      }
    }

    // 2. High-Fidelity Autonomous Production Engine (Offline/Direct Synthesis Mode)
    if (type === "batch-angles") {
      const data = buildMultiAngleCampaign(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "content-sprint") {
      const prompt = buildSevenDaySprint(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "audio-director") {
      const data = buildElevenLabsEmotionPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "foley-soundscape") {
      const data = buildFoleySoundscapePrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "safe-zone-optics") {
      const data = buildSafeZoneOpticsPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "hook-splitter") {
      const data = buildHookSplitterPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "faceless-pipeline") {
      const data = buildCashCowStoryPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "thumbnail-architect") {
      const data = buildThumbnailArchitectPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "kinetic-motion") {
      const data = buildKineticMotionPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "multi-scene-story") {
      const data = buildMultiSceneStoryPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "character-board") {
      const data = buildCharacterAnchorPrompt(extraParams as any);
      return NextResponse.json(data);
    }

    if (type === "i2v-motion") {
      const prompt = buildI2VMotionPrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "cinema-pipeline") {
      const prompt = buildCinemaPipelinePrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "forensic-inspector") {
      const data = buildForensicInspectorData();
      return NextResponse.json(data);
    }

    if (type === "google-flow-director") {
      const prompt = buildGoogleFlowDirectorPrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "prompt-matrix") {
      const matrix = buildUniversalPromptMatrix(extraParams.concept || "Commercial coffee advertisement", extraParams.visualMood);
      return NextResponse.json({ matrix });
    }

    if (type === "viral-hook") {
      const prompt = buildViralHookPrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "infografis") {
      const prompt = buildInfographicPrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "sales-page") {
      const prompt = buildSalesPagePrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "coloring-book") {
      const prompt = buildColoringBookPrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "game") {
      const prompt = buildGamePrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "storyboard") {
      const prompt = buildStoryboardPrompt(extraParams as any);
      return NextResponse.json({ prompt });
    }

    if (type === "optimizer") {
      const prompt = buildOptimizerPrompt(extraParams.rawPrompt || "Buat video kopi menarik", extraParams.targetAi);
      return NextResponse.json({ prompt });
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

    // Default Vision Video/Image Directive
    if (mediaType === "video") {
      const veoPrompt = `[BUATPROMPT STUDIO — GOOGLE FLOW (VEO 2) MASTER DIRECTIVE]
Cinematic 4K slow tracking push-in shot capturing mechanical precision assembly.
Camera: Smooth steady push-in dolly movement on 35mm anamorphic prime lens with subtle physical motion blur.
Lighting Setup: Volumetric golden hour rim lighting paired with soft diffused overhead studio lighting, authentic specular reflections.
Environment: Minimalist dark acrylic studio surface with warm walnut wood grain accents, subtle atmospheric haze.
Temporal Motion: Deliberate, fluid hand movements positioning intricate mechanical components with microscopic precision.
Color Grading: Deep obsidian shadows, brushed titanium highlights, warm amber rim glow.
Audio Soundscape: Low-frequency ambient room tone, tactile mechanical clicks, subtle rising orchestral swell.
Target Engine: Google Flow (Veo 2) 4K 24fps master shot.`;

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
Color & Mood: Deep cosmic background, pristine metallic reflections, ultra-high dynamic range, 8K photorealism.`;

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
