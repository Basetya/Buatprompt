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

    const rawApiKey = process.env.GEMINI_API_KEY || "";
    const apiKeys = rawApiKey
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 20);
    const apiKey = apiKeys[0] || "";

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

        let response;
        try {
          response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
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
        } catch {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
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
        }

        return NextResponse.json({
          prompt: response.text,
          model: "gemini-3-flash-preview",
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
            inputTab = "idea",
            seriesCount = 1,
          } = extraParams;

          const seriesTotal = Math.min(Math.max(Number(seriesCount) || 1, 1), 4);
          const is55s = durationTarget !== "26s";
          const targetSeconds = is55s ? 52 : 26;
          const targetWords = is55s ? "110-125 kata" : "55-65 kata";

          let systemPrompt = "";

          if (seriesTotal > 1) {
            systemPrompt = `Anda adalah Master Scriptwriter & Top Viral TikTok/Reels Creator Indonesia.
Tugas Anda adalah membedah topik edukasi: "${topicIdea}" menjadi TEPAT ${seriesTotal} SERI/EPISODE BERTURUT-TURUT (Part 1 sampai Part ${seriesTotal}).
Masing-masing episode berdurasi ~${targetSeconds} detik (${targetWords}) yang dibagi menjadi 4 Scene sinematik dengan alur retensi visual tinggi.

ATURAN SERI MULTI-PART EDUKASI:
1. Setiap Part memiliki subtopik tersendiri yang padat dan berbobot (tidak bertele-tele).
2. Di Scene 1 setiap Part (khususnya Part 2-4), buat Series Hook yang menyambung dari episode sebelumnya ("Di Part 1 kemarin kita udah... Sekarang di Part 2...").
3. Di Scene 4 (untuk Part 1 sampai Part ${seriesTotal - 1}), WAJIB ada CLIFFHANGER HOOK menggantung yang bikin penasaran tinggi untuk part berikutnya ("...tapi rahasia utamanya ada di suhu minyak di Part 3 besok. Follow sekarang biar nggak ketinggalan!").
4. Di Scene 4 episode terakhir (Part ${seriesTotal}), tutup dengan CTA tuntas & ajakan simpan keseluruhan seri.
5. Gunakan gaya tutur lisan 100% natural, mengalir santai seperti teman akrab (DILARANG kalimat kaku buku teks seperti "banyak orang gagal paham", "memaksakan hasil instan").
6. Setiap scene WAJIB menyertakan "suggestedPose": pilih salah satu dari ["friendly-anchor", "problem-shrug", "secret-lean", "explainer", "eureka-point", "chin-thinker", "comparison", "strong-cta"] yang paling tepat dengan emosi dan konteks kalimat.

KEMBALIKAN HANYA JSON MURNI VALID (tanpa markdown code fences):
{
  "topic": "${topicIdea}",
  "seriesCount": ${seriesTotal},
  "episodes": [
    {
      "partNumber": 1,
      "partTitle": "Judul Subtopik Singkat Part 1 (Maks. 4 Kata)",
      "scenes": [
        {
          "sceneNumber": 1,
          "stageName": "THE SHOCK HOOK",
          "timeRange": "0:00 - 0:${is55s ? '10' : '06'}",
          "headline": "HEADLINE SINGKAT PUNCHY",
          "subtext": "Penjelasan pembuka hook serial...",
          "metric": "SERI 01",
          "highlightKeyword": "KATA_KUNCI",
          "durationSec": ${is55s ? 10 : 6},
          "characterEmotion": "shocked",
          "suggestedPose": "friendly-anchor",
          "kineticFx": "Spring Punch Scale 1.2x + Alert Aura Halo",
          "foleyCue": "0:00 Fast Whoosh + Heavy Sub-Bass Thud"
        },
        {
          "sceneNumber": 2,
          "stageName": "THE PAIN AGITATION",
          "timeRange": "0:${is55s ? '10' : '06'} - 0:${is55s ? '25' : '13'}",
          "headline": "MASALAH YANG TERJADI",
          "subtext": "Penjelasan masalah subtopik Part 1...",
          "metric": "-85% GAGAL",
          "highlightKeyword": "MASALAH",
          "durationSec": ${is55s ? 15 : 7},
          "characterEmotion": "skeptical",
          "suggestedPose": "problem-shrug",
          "kineticFx": "Wipe Push Left + Floating Red Question Particles",
          "foleyCue": "0:${is55s ? '10' : '06'} Camera Snap + Low Vinyl Scratch"
        },
        {
          "sceneNumber": 3,
          "stageName": "THE BREAKTHROUGH REVEAL",
          "timeRange": "0:${is55s ? '25' : '13'} - 0:${is55s ? '40' : '20'}",
          "headline": "TRIK EMAS PART INI",
          "subtext": "Langkah konkrit yang dibongkar di Part 1...",
          "metric": "+350% HASIL",
          "highlightKeyword": "SOLUSI",
          "durationSec": ${is55s ? 15 : 7},
          "characterEmotion": "celebrate",
          "suggestedPose": "eureka-point",
          "kineticFx": "Dynamic Glowing SVG Curve Path + Rocket Sparkles",
          "foleyCue": "0:${is55s ? '25' : '13'} Harmonic Synth Swell + Crisp Cash Chime"
        },
        {
          "sceneNumber": 4,
          "stageName": "CLIFFHANGER CTA",
          "timeRange": "0:${is55s ? '40' : '20'} - 0:${targetSeconds}",
          "headline": "LANJUT KE PART BERIKUTNYA",
          "subtext": "Kalimat cliffhanger bikin penasaran yang mengunci agar viewer wajib follow untuk Part 2...",
          "metric": "FOLLOW! 🔔",
          "highlightKeyword": "FOLLOW",
          "durationSec": ${is55s ? 12 : 6},
          "characterEmotion": "point-cta",
          "suggestedPose": "strong-cta",
          "kineticFx": "Pulsating Bookmark Ring + Seamless Loop Match Cut",
          "foleyCue": "0:${is55s ? '40' : '20'} Clean Glass Bell Ding + Ambient Fade Out"
        }
      ]
    }
  ]
}`;
          } else {
            systemPrompt = `Anda adalah Master Scriptwriter & Top Viral TikTok/Reels Creator Indonesia.
Tugas Anda adalah membuat naskah video vertikal 9:16 yang SANGAT ALAMI, LUWES, DAN MENGALIR SEPERTI OBROLAN NYATA ANTAR TEMAN (100% gaya tutur lisan manusia, BUKAN bahasa buku, BUKAN makalah kaku, BUKAN template korporat).

DETAIL TARGET:
- Durasi: Tepat ~${targetSeconds} detik (${targetWords})
- Format: ${is55s ? "52-55s Deep Story (Storytelling mendalam, emosional, membongkar rahasia langkah demi langkah)" : "26s Express Hook (Punchy, cepat, to-the-point langsung membongkar kesalahan dan solusi)"}
- Topik/Ide: "${topicIdea}"
${rawScriptText ? `- Naskah Acuan Pengguna: "${rawScriptText}"` : ""}
- Niche: "${targetNiche}"
- Gaya Visual: "${motionStyle}"

PEDOMAN PERCAKAPAN SUPER ALAMI (WAJIB DIIKUTI):
1. DILARANG KERAS menggunakan frasa kaku seperti:
   - ❌ "Banyak orang gagal paham tentang..."
   - ❌ "Kesalahan terbesar adalah memaksakan hasil instan tanpa memahami sistem..."
   - ❌ "Seperti kata [Tokoh]: ..."
   - ❌ Mengulang kalimat tanya mentah sebagai pengantar.
2. GUNAKAN gaya tutur lisan kreator manusia:
   - Scene 1 (Hook): Buka dengan pertanyaan relate atau fakta mencengangkan ("Pernah nggak sih kamu...", "Stop lakukan ini kalau nggak mau...", "Jujur, siapa yang masih...").
   - Scene 2 (Agitasi Masalah): Bahas kenapa cara lama bikin gagal dengan nada gregetan/penasaran ("Nah masalahnya...", "Biasanya kita tuh langsung...", "Padahal rahasianya bukan di situ...").
   - Scene 3 (Solusi Teruji): Beri langkah konkrit yang bisa langsung ditiru hari ini ("Ternyata kuncinya tuh simpel banget...", "Coba lakuin dua langkah ini...", "Trik rahasianya...").
   - Scene 4 (CTA Santai): Ajak simpan video dan ngobrol di kolom komentar ("Coba deh praktekin nanti sore! Save dulu biar nggak lupa, terus share ke temen kamu ya!").
3. Headline harus singkat, padat, huruf kapital (maksimal 3-5 kata) agar nyaman dibaca di layar HP.
4. Subtext adalah teks persis yang dibacakan oleh voiceover. Kalimat mengalir enak dengan intonasi natural.
5. Setiap scene WAJIB menyertakan "suggestedPose": pilih salah satu dari ["friendly-anchor", "problem-shrug", "secret-lean", "explainer", "eureka-point", "chin-thinker", "comparison", "strong-cta"] yang paling tepat dengan emosi naskah.

KEMBALIKAN HANYA JSON MURNI VALID (tanpa markdown code fences, tanpa kata pengantar):
{
  "topic": "${topicIdea}",
  "wordCount": ${is55s ? 118 : 60},
  "estimatedVoiceSeconds": ${targetSeconds},
  "isTooLong": false,
  "totalDurationSec": ${targetSeconds},
  "retentionFormula": "Human Conversational Cadence + Emotional Relatability + Word-by-Word Highlight",
  "scenes": [
    {
      "sceneNumber": 1,
      "stageName": "THE SHOCK HOOK",
      "timeRange": "0:00 - 0:${is55s ? '10' : '06'}",
      "headline": "HEADLINE SINGKAT PUNCHY",
      "subtext": "Kalimat pembuka hook yang bikin penasaran dan relate...",
      "metric": "STOP! 🛑",
      "highlightKeyword": "KATA_KUNCI",
      "durationSec": ${is55s ? 10 : 6},
      "characterEmotion": "shocked",
      "suggestedPose": "friendly-anchor",
      "kineticFx": "Spring Punch Scale 1.2x + Alert Aura Halo",
      "foleyCue": "0:00 Fast Whoosh + Heavy Sub-Bass Thud"
    },
    {
      "sceneNumber": 2,
      "stageName": "THE PAIN AGITATION",
      "timeRange": "0:${is55s ? '10' : '06'} - 0:${is55s ? '25' : '13'}",
      "headline": "MASALAH YANG SERING TERJADI",
      "subtext": "Penjelasan kenapa cara biasa selalu gagal dengan nada santai...",
      "metric": "-85% GAGAL",
      "highlightKeyword": "MASALAH",
      "durationSec": ${is55s ? 15 : 7},
      "characterEmotion": "skeptical",
      "suggestedPose": "problem-shrug",
      "kineticFx": "Wipe Push Left + Floating Red Question Particles",
      "foleyCue": "0:${is55s ? '10' : '06'} Camera Snap + Low Vinyl Scratch"
    },
    {
      "sceneNumber": 3,
      "stageName": "THE BREAKTHROUGH REVEAL",
      "timeRange": "0:${is55s ? '25' : '13'} - 0:${is55s ? '40' : '20'}",
      "headline": "SOLUSI RAHASIA PRAKTIS",
      "subtext": "Langkah konkrit yang terbukti berhasil dan gampang dicoba...",
      "metric": "+350% HASIL",
      "highlightKeyword": "SOLUSI",
      "durationSec": ${is55s ? 15 : 7},
      "characterEmotion": "celebrate",
      "suggestedPose": "eureka-point",
      "kineticFx": "Dynamic Glowing SVG Curve Path + Rocket Sparkles",
      "foleyCue": "0:${is55s ? '25' : '13'} Harmonic Synth Swell + Crisp Cash Chime"
    },
    {
      "sceneNumber": 4,
      "stageName": "THE INFINITE LOOP CTA",
      "timeRange": "0:${is55s ? '40' : '20'} - 0:${targetSeconds}",
      "headline": "SIMPAN RESEP SEKARANG",
      "subtext": "Ajakan simpan video dan coba sendiri di rumah...",
      "metric": "SAVE! ✨",
      "highlightKeyword": "SIMPAN",
      "durationSec": ${is55s ? 12 : 6},
      "characterEmotion": "point-cta",
      "suggestedPose": "strong-cta",
      "kineticFx": "Pulsating Bookmark Ring + Seamless Loop Match Cut",
      "foleyCue": "0:${is55s ? '40' : '20'} Clean Glass Bell Ding + Ambient Fade Out"
    }
  ]
}`;
          }

          // Try Gemini API models via direct v1beta endpoint with multi-key rotation
          const candidateModels = [
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite-preview",
            "gemini-flash-latest",
          ];
          for (let kIdx = 0; kIdx < apiKeys.length; kIdx++) {
            const currentKey = apiKeys[kIdx];
            for (const modelName of candidateModels) {
              try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentKey}`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 50000);
                const res = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    generationConfig: { responseMimeType: "application/json" },
                  }),
                  signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                  const data = await res.json();
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
                    const parsed = JSON.parse(cleanedJson);
                    if (parsed) {
                      if (Array.isArray(parsed.episodes) && parsed.episodes.length > 0) {
                        if (!parsed.scenes && parsed.episodes[0]?.scenes) {
                          parsed.scenes = parsed.episodes[0].scenes;
                        }
                        return NextResponse.json(parsed);
                      }
                      if (Array.isArray(parsed.scenes) && parsed.scenes.length === 4) {
                        return NextResponse.json(parsed);
                      }
                    }
                  }
                } else if (res.status === 429) {
                  console.warn(`[Gemini API] Key #${kIdx + 1} quota reached (429), rotating key...`);
                  break; // break model loop, try next API key
                }
              } catch (fetchErr) {
                console.warn(`[Gemini API] Model ${modelName} on key #${kIdx + 1} call error:`, fetchErr);
              }
            }
          }
        } catch (llmErr) {
          console.warn("Live Gemini multi-scene generation failed, falling back to autonomous synthesis engine:", llmErr);
        }
      }

      if (taskPrompt) {
        let response;
        try {
          response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: taskPrompt }] }],
          });
        } catch {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: [{ role: "user", parts: [{ text: taskPrompt }] }],
          });
        }
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
