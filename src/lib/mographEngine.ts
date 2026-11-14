/**
 * BUATPROMPT MOGRAPH ENGINE
 * -------------------------------------------------------------
 * Audio Synthesizer (Foley SFX & Lo-Fi BGM Generator),
 * Rapid Dynamic Phrase Segmentation (Karaoke Pacing),
 * and Acoustic-Driven Voxel Character Drawing.
 * 100% Client-Side Web Audio API & HTML5 Canvas.
 */

export interface TimedPhrase {
  phraseText: string;
  words: string[];
  highlightWord?: string;
  startPct: number; // 0 to 1
  endPct: number;   // 0 to 1
  badge?: string;
  hasSentencePause?: boolean;
}

/**
 * Splits scene headline and subtext into punchy 3-4 word editorial beats
 * with character-weighted timing so caption cadence matches real speech speed.
 */
function splitIntoPunchyPhrases(text: string): Array<{ text: string; words: string[]; pauseAfter: boolean }> {
  const clean = text.replace(/["#*~`_—–]/g, " ").trim();
  const rawTokens = clean.split(/\s+/).filter((w) => w.length > 0);

  const words: Array<{ word: string; pauseAfter: boolean }> = [];
  for (const tok of rawTokens) {
    const pauseAfter = /[.,!?;:]$/.test(tok);
    const cleaned = tok.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9%]+$/g, "").trim();
    if (cleaned.length > 0) {
      words.push({ word: cleaned.toUpperCase(), pauseAfter });
    }
  }

  const phrases: Array<{ text: string; words: string[]; pauseAfter: boolean }> = [];
  let i = 0;
  while (i < words.length) {
    const remaining = words.length - i;
    let take = Math.min(3, remaining);
    if (remaining === 4) {
      take = 4;
    } else if (remaining >= 5) {
      // Break naturally at punctuation if within 2..4 words
      let pBreak = -1;
      for (let k = 1; k < Math.min(4, remaining); k++) {
        if (words[i + k].pauseAfter) {
          pBreak = k + 1;
          break;
        }
      }
      take = pBreak > 0 ? pBreak : (i % 2 === 0 ? 3 : 4);
    }

    const slice = words.slice(i, i + take);
    const wList = slice.map((s) => s.word);
    const lastPause = slice[slice.length - 1]?.pauseAfter || false;
    phrases.push({
      text: wList.join(" "),
      words: wList,
      pauseAfter: lastPause,
    });
    i += take;
  }
  return phrases;
}

export function extractTimedPhrases(
  headline: string,
  subtext: string,
  highlightKeyword?: string,
  metricBadge?: string
): TimedPhrase[] {
  const headPhrases = splitIntoPunchyPhrases(headline);
  if (headPhrases.length > 0) {
    headPhrases[headPhrases.length - 1].pauseAfter = true;
  }
  const subPhrases = splitIntoPunchyPhrases(subtext);
  const allPhrases = [...headPhrases, ...subPhrases];

  if (allPhrases.length === 0) {
    return [{ phraseText: "PERHATIKAN INI", words: ["PERHATIKAN", "INI"], startPct: 0, endPct: 1 }];
  }

  // Weight each phrase duration by its character count + natural punctuation pause
  const weights = allPhrases.map((p) => p.text.length + 5 + (p.pauseAfter ? 6 : 0));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let acc = 0;
  return allPhrases.map((p, idx) => {
    const startPct = acc / totalWeight;
    acc += weights[idx];
    const endPct = idx === allPhrases.length - 1 ? 1 : acc / totalWeight;
    const isLast = idx === allPhrases.length - 1;

    return {
      phraseText: p.text,
      words: p.words,
      highlightWord: highlightKeyword?.toUpperCase(),
      startPct,
      endPct,
      badge: isLast ? metricBadge : undefined,
      hasSentencePause: p.pauseAfter,
    };
  });
}

/**
 * In-Browser Procedural Foley SFX Synthesizer
 */
export function playProceduralSFX(
  audioCtx: AudioContext,
  destinations: AudioNode[],
  type: "whoosh" | "pop" | "chime" | "click"
) {
  try {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;

    if (type === "whoosh") {
      const bufferSize = audioCtx.sampleRate * 0.35;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(220, t);
      filter.frequency.exponentialRampToValueAtTime(3200, t + 0.16);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.35);
      filter.Q.setValueAtTime(3.8, t);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.38, t + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      destinations.forEach((d) => gain.connect(d));

      whiteNoise.start(t);
      whiteNoise.stop(t + 0.35);
    } else if (type === "pop") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.08);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      destinations.forEach((d) => gain.connect(d));

      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === "chime") {
      [587, 880, 1174].forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

        osc.connect(gain);
        destinations.forEach((d) => gain.connect(d));

        osc.start(t);
        osc.stop(t + 0.65);
      });
    } else if (type === "click") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(1400, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      destinations.forEach((d) => gain.connect(d));

      osc.start(t);
      osc.stop(t + 0.035);
    }
  } catch (err) {
    console.warn("SFX synthesis notice:", err);
  }
}

/**
 * Procedural Lo-Fi BGM Engine (75 BPM)
 */
export class ProceduralLoFiBGM {
  private audioCtx: AudioContext;
  private destinations: AudioNode[];
  private masterGain: GainNode;
  private isRunning: boolean = false;
  private intervalId: any = null;
  private currentStep: number = 0;

  constructor(audioCtx: AudioContext, destinations: AudioNode[]) {
    this.audioCtx = audioCtx;
    this.destinations = destinations;
    this.masterGain = audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.14, audioCtx.currentTime);
    destinations.forEach((d) => this.masterGain.connect(d));
  }

  public setVolume(vol: number) {
    this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(vol, 1)), this.audioCtx.currentTime);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentStep = 0;

    const stepDurationMs = 200; // 75 BPM

    this.intervalId = setInterval(() => {
      this.playStep(this.currentStep % 16);
      this.currentStep++;
    }, stepDurationMs);
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playStep(step: number) {
    if (!this.isRunning) return;
    const t = this.audioCtx.currentTime;

    // Sub kick on 0 & 8
    if (step === 0 || step === 8) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(105, t);
      osc.frequency.exponentialRampToValueAtTime(38, t + 0.14);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.15);
    }

    // Filtered snare on 4 & 12
    if (step === 4 || step === 12) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(210, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.09);
    }

    // Warm chord pad
    if (step === 0 || step === 8) {
      const freqs = step === 0 ? [293.66, 349.23, 440.0, 523.25] : [349.23, 440.0, 523.25, 659.25];

      freqs.forEach((freq) => {
        const osc = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const gain = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(750, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 1.4);
      });
    }
  }
}

/**
 * Fetch and decode Microsoft Azure / Edge Neural TTS into AudioBuffer
 */
export async function fetchAndDecodeTTS(
  audioCtx: AudioContext,
  text: string,
  options?: {
    voice?: string;
    emotion?: string;
    rate?: string;
    pitch?: string;
  }
): Promise<AudioBuffer | null> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: options?.voice || "id-ID-ArdiNeural",
        emotion: options?.emotion || "normal",
        customRate: options?.rate,
        customPitch: options?.pitch,
      }),
    });

    if (!res.ok) {
      throw new Error(`TTS API error: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (err) {
    console.warn("TTS fetch notice:", err);
    return null;
  }
}

export type VoxelPresetId =
  | "beanie-striped"
  | "hoodie-glasses"
  | "hijab-pastel"
  | "suit-gold"
  | "cyber-neon"
  | "barista-apron";

export interface VoxelPreset {
  id: VoxelPresetId;
  name: string;
  niche: string;
  gender: "male" | "female";
  shirtColor: string;
  accentColor: string;
  skinColor: string;
  skinShadow: string;
  hairColor: string;
  headwear: "beanie" | "none" | "hijab" | "cap" | "cyber-hair";
  glasses: "none" | "square" | "gold" | "visor";
}

export const VOXEL_3D_PRESETS: Record<VoxelPresetId, VoxelPreset> = {
  "beanie-striped": {
    id: "beanie-striped",
    name: "Leo • Classic Beanie",
    niche: "Umum & Edukasi",
    gender: "male",
    shirtColor: "#1e40af",
    accentColor: "#ffffff",
    skinColor: "#f5c59f",
    skinShadow: "#e2b28c",
    hairColor: "#451a03",
    headwear: "beanie",
    glasses: "none",
  },
  "hoodie-glasses": {
    id: "hoodie-glasses",
    name: "Max • Tech Hoodie",
    niche: "Tech & SaaS",
    gender: "male",
    shirtColor: "#ea580c",
    accentColor: "#c2410c",
    skinColor: "#f5c59f",
    skinShadow: "#e2b28c",
    hairColor: "#3e2723",
    headwear: "none",
    glasses: "square",
  },
  "hijab-pastel": {
    id: "hijab-pastel",
    name: "Alya • Voxel Hijab",
    niche: "Skincare & Affiliate",
    gender: "female",
    shirtColor: "#f5f5f4",
    accentColor: "#10b981",
    skinColor: "#f6cfb0",
    skinShadow: "#e4b998",
    hairColor: "#047857",
    headwear: "hijab",
    glasses: "none",
  },
  "suit-gold": {
    id: "suit-gold",
    name: "Boss • Voxel CEO",
    niche: "Finansial & Bisnis",
    gender: "male",
    shirtColor: "#18181b",
    accentColor: "#f59e0b",
    skinColor: "#f1c29b",
    skinShadow: "#d9a57d",
    hairColor: "#1c1917",
    headwear: "none",
    glasses: "gold",
  },
  "cyber-neon": {
    id: "cyber-neon",
    name: "Nova • Cyber Neon",
    niche: "Gaming & AI",
    gender: "female",
    shirtColor: "#1e1b4b",
    accentColor: "#06b6d4",
    skinColor: "#f5c59f",
    skinShadow: "#e2b28c",
    hairColor: "#9333ea",
    headwear: "cyber-hair",
    glasses: "visor",
  },
  "barista-apron": {
    id: "barista-apron",
    name: "Kopi • Voxel Barista",
    niche: "Kuliner & Kopi",
    gender: "male",
    shirtColor: "#78350f",
    accentColor: "#fef3c7",
    skinColor: "#e8b48a",
    skinShadow: "#cf986e",
    hairColor: "#292524",
    headwear: "cap",
    glasses: "none",
  },
};

/**
 * Overlays dense micro-voxel 3D brick bevels (highlight + shadow seams)
 * to give flat regions a high-density sculpted MagicaVoxel look.
 */
function drawVoxelMicroGrid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  step: number = 8,
  intensity: number = 0.14
) {
  ctx.save();
  for (let vx = x; vx < x + w - 2; vx += step) {
    for (let vy = y; vy < y + h - 2; vy += step) {
      const cw = Math.min(step - 1, x + w - vx);
      const ch = Math.min(step - 1, y + h - vy);
      // Subtle top-left bevel highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${(intensity * 0.7).toFixed(3)})`;
      ctx.fillRect(vx, vy, cw, 1.5);
      // Subtle bottom-right shadow seam
      ctx.fillStyle = `rgba(0, 0, 0, ${intensity.toFixed(3)})`;
      ctx.fillRect(vx, vy + ch - 1.5, cw, 1.5);
      ctx.fillRect(vx + cw - 1.5, vy, 1.5, ch);
    }
  }
  ctx.restore();
}

/**
 * Expressive 3D Voxel Character Drawing on Canvas
 * Anchored at bottom, with acoustic-driven real-time mouth flap, expressive eyes, and gestures.
 */
export function drawVoxelAvatar(
  ctx: CanvasRenderingContext2D,
  options: {
    cx: number;
    cy: number;
    scale: number;
    emotion: "shocked" | "skeptical" | "celebrate" | "point-cta";
    isTalking: boolean;
    vocalVolume?: number; // 0 to 255 from Web Audio Analyser
    elapsed: number;
    outfit: VoxelPresetId;
  }
) {
  const { cx, cy, scale, emotion, isTalking, vocalVolume = 0, elapsed, outfit } = options;
  const preset = VOXEL_3D_PRESETS[outfit] || VOXEL_3D_PRESETS["beanie-striped"];

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // 1. Natural idle bobbing & breathing
  const idleBob = Math.sin(elapsed * 2.8) * 4;
  const headSway = Math.sin(elapsed * 1.6) * 0.03;

  ctx.translate(0, idleBob);

  // 2. CHEST / SHOULDERS (Bottom Anchored)
  ctx.save();
  ctx.fillStyle = preset.shirtColor;
  ctx.fillRect(-85, 75, 170, 230);

  if (outfit === "beanie-striped") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-85, 105, 170, 20);
    ctx.fillRect(-85, 145, 170, 20);
    ctx.fillRect(-85, 185, 170, 20);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-40, 65, 80, 22);
  } else if (outfit === "suit-gold") {
    // White shirt V + Gold Tie
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-26, 75, 52, 85);
    ctx.fillStyle = preset.accentColor;
    ctx.fillRect(-9, 78, 18, 95);
  } else if (outfit === "hijab-pastel") {
    // Hijab chest drape
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-62, 65, 124, 65);
    ctx.fillStyle = preset.accentColor;
    ctx.fillRect(-52, 118, 104, 10);
  } else if (outfit === "barista-apron") {
    // White tee underneath + apron straps
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-85, 75, 170, 35);
    ctx.fillStyle = preset.shirtColor;
    ctx.fillRect(-62, 85, 124, 220);
    ctx.fillStyle = preset.accentColor;
    ctx.fillRect(-48, 145, 96, 50);
  } else {
    ctx.fillStyle = preset.accentColor;
    ctx.fillRect(-50, 140, 100, 60);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-18, 85, 5, 40);
    ctx.fillRect(13, 85, 5, 40);
  }
  // Dense micro-voxel brick texture across torso/outfit
  drawVoxelMicroGrid(ctx, -85, 75, 170, 210, 9, 0.14);
  ctx.restore();

  // 3. HAND GESTURES BASED ON EMOTION
  ctx.save();
  ctx.fillStyle = preset.skinColor;
  ctx.strokeStyle = preset.skinShadow;
  ctx.lineWidth = 2;

  if (emotion === "shocked") {
    const handBob = Math.sin(elapsed * 4) * 4;
    ctx.fillRect(-98, 15 + handBob, 28, 42);
    ctx.strokeRect(-98, 15 + handBob, 28, 42);
  } else if (emotion === "skeptical") {
    ctx.fillRect(16, 42, 38, 28);
    ctx.strokeRect(16, 42, 38, 28);
  } else if (emotion === "celebrate") {
    const cheer = Math.sin(elapsed * 5) * 8;
    ctx.fillRect(-105, -5 + cheer, 28, 38);
    ctx.strokeRect(-105, -5 + cheer, 28, 38);
    ctx.fillRect(78, -5 - cheer, 28, 38);
    ctx.strokeRect(78, -5 - cheer, 28, 38);
  } else if (emotion === "point-cta") {
    const pointBob = Math.sin(elapsed * 3.5) * 5;
    ctx.fillRect(70, -20 + pointBob, 24, 55);
    ctx.strokeRect(70, -20 + pointBob, 24, 55);
    ctx.fillRect(75, -40 + pointBob, 14, 20);
  }
  ctx.restore();

  // 4. NECK
  ctx.fillStyle = preset.skinShadow;
  ctx.fillRect(-20, 50, 40, 28);

  // 5. HEAD (Dense Sculpted Voxel Block with 3D Shading)
  ctx.save();
  ctx.rotate(headSway);

  // Hijab back wrap behind face
  if (preset.headwear === "hijab") {
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-74, -84, 148, 152);
    drawVoxelMicroGrid(ctx, -74, -84, 148, 152, 8, 0.16);
  }

  // Front face
  ctx.fillStyle = preset.skinColor;
  ctx.fillRect(-60, -70, 120, 120);
  drawVoxelMicroGrid(ctx, -60, -70, 120, 120, 10, 0.045);

  // Side 3D shading (sculpted depth)
  ctx.fillStyle = preset.skinShadow;
  ctx.fillRect(55, -70, 14, 120);
  drawVoxelMicroGrid(ctx, 55, -70, 14, 120, 7, 0.12);

  // Bottom shadow
  ctx.fillStyle = preset.skinShadow;
  ctx.fillRect(-60, 42, 120, 8);

  // Nose (3D voxel protrusion)
  ctx.fillStyle = preset.skinShadow;
  ctx.fillRect(-9, -4, 18, 14);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fillRect(-9, -4, 18, 3);

  // Cheeks
  ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
  ctx.fillRect(-50, 2, 22, 12);
  ctx.fillRect(28, 2, 22, 12);

  // 6. HAIR / HEADWEAR (High-Density Micro-Voxel Grid)
  if (preset.headwear === "beanie") {
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-66, -135, 132, 75);
    drawVoxelMicroGrid(ctx, -66, -135, 132, 75, 7, 0.22);

    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-70, -76, 140, 20);
    drawVoxelMicroGrid(ctx, -70, -76, 140, 20, 7, 0.25);

    ctx.fillStyle = "#1e40af";
    ctx.fillRect(-22, -160, 44, 26);
    ctx.fillRect(-16, -168, 32, 10);
    drawVoxelMicroGrid(ctx, -22, -160, 44, 26, 7, 0.24);

    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-55, -56, 22, 18);
    ctx.fillRect(33, -56, 22, 18);
    ctx.fillRect(-12, -56, 24, 14);
  } else if (preset.headwear === "hijab") {
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-72, -88, 144, 34);
    ctx.fillRect(-72, -60, 18, 118);
    ctx.fillRect(54, -60, 18, 118);
    drawVoxelMicroGrid(ctx, -72, -88, 144, 34, 8, 0.2);
    drawVoxelMicroGrid(ctx, -72, -60, 18, 118, 8, 0.2);
    drawVoxelMicroGrid(ctx, 54, -60, 18, 118, 8, 0.2);
  } else if (preset.headwear === "cap") {
    ctx.fillStyle = "#292524";
    ctx.fillRect(-66, -112, 132, 50);
    drawVoxelMicroGrid(ctx, -66, -112, 132, 50, 8, 0.22);
    ctx.fillStyle = "#44403c";
    ctx.fillRect(-66, -74, 160, 16);
    drawVoxelMicroGrid(ctx, -66, -74, 160, 16, 8, 0.2);
  } else if (preset.headwear === "cyber-hair") {
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-66, -110, 132, 48);
    ctx.fillRect(-48, -124, 44, 20);
    ctx.fillRect(6, -118, 38, 16);
    drawVoxelMicroGrid(ctx, -66, -110, 132, 48, 7, 0.22);
  } else {
    ctx.fillStyle = preset.hairColor;
    ctx.fillRect(-66, -102, 132, 42);
    ctx.fillRect(-66, -70, 16, 50);
    ctx.fillRect(50, -70, 16, 50);
    ctx.fillRect(-42, -64, 84, 14);
    drawVoxelMicroGrid(ctx, -66, -102, 132, 42, 8, 0.22);
  }

  // 7. EYES & EYEBROWS (Expressive & Blinking)
  const isBlinking = Math.sin(elapsed * 2.2) > 0.94;

  if (preset.glasses === "square" || preset.glasses === "gold") {
    ctx.strokeStyle = preset.glasses === "gold" ? "#f59e0b" : "#18181b";
    ctx.lineWidth = 5;
    ctx.strokeRect(-46, -30, 36, 30);
    ctx.strokeRect(10, -30, 36, 30);
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.lineTo(10, -15);
    ctx.stroke();
  } else if (preset.glasses === "visor") {
    ctx.fillStyle = "rgba(6, 182, 212, 0.45)";
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 3;
    ctx.fillRect(-52, -30, 104, 28);
    ctx.strokeRect(-52, -30, 104, 28);
  }

  // Eyebrows
  ctx.fillStyle = "#29180f";
  if (emotion === "shocked") {
    ctx.fillRect(-44, -45, 30, 6);
    ctx.fillRect(14, -45, 30, 6);
  } else if (emotion === "skeptical") {
    ctx.fillRect(-44, -47, 30, 6);
    ctx.fillRect(14, -36, 30, 6);
  } else {
    ctx.fillRect(-44, -39, 30, 5);
    ctx.fillRect(14, -39, 30, 5);
  }

  // Eyes with Glossy Highlights
  if (isBlinking) {
    ctx.fillStyle = "#29180f";
    ctx.fillRect(-38, -18, 20, 3.5);
    ctx.fillRect(18, -18, 20, 3.5);
  } else if (emotion === "celebrate") {
    ctx.strokeStyle = "#29180f";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(-28, -15, 10, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(28, -15, 10, Math.PI, 0);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#0f172a";
    const eyeH = emotion === "shocked" ? 22 : 16;
    ctx.fillRect(-38, -20, 18, eyeH);
    ctx.fillRect(20, -20, 18, eyeH);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-36, -18, 6, 6);
    ctx.fillRect(22, -18, 6, 6);
  }

  // 8. ACOUSTIC-DRIVEN MOUTH LIP-SYNC
  // Uses real-time vocal acoustic volume from Web Audio Analyser!
  const hasVoiceEnergy = vocalVolume > 8;
  const isMouthActive = isTalking && (vocalVolume > 0 ? hasVoiceEnergy : Math.sin(elapsed * 12) > 0.2);

  if (isMouthActive) {
    // If real-time volume is present, scale mouth height directly with sound wave
    const targetHeight = vocalVolume > 0
      ? Math.min(Math.max((vocalVolume / 32) * 16, 6), 18)
      : Math.abs(Math.sin(elapsed * 14)) * 10 + 5;

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(-16, 14, 32, targetHeight, 4);
    ctx.fill();

    // White upper teeth
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-13, 14, 26, 3.5, 2);
    ctx.fill();

    // Pink tongue
    if (targetHeight > 9) {
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.roundRect(-10, 14 + targetHeight - 5, 20, 5, 2);
      ctx.fill();
    }
  } else {
    // Closed mouth: clean stylish subtle line
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.roundRect(-12, 18, 24, 3, 1.5);
    ctx.fill();
  }

  // 9. EMOTIONAL OVERLAYS
  if (emotion === "shocked") {
    ctx.font = "bold 34px monospace";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("!", 0, -180);
  } else if (emotion === "skeptical") {
    ctx.font = "bold 30px monospace";
    ctx.fillStyle = "#06b6d4";
    ctx.textAlign = "center";
    ctx.fillText("?", 48, -145);
  } else if (emotion === "celebrate") {
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#facc15";
    ctx.fillText("★", -58, -135);
    ctx.fillText("★", 58, -135);
  } else if (emotion === "point-cta") {
    ctx.font = "26px sans-serif";
    ctx.fillText("🔖", 0, -170);
  }

  ctx.restore();
  ctx.restore();
}

export type MotionStyleId =
  | "apple-keynote"
  | "editorial-light"
  | "midnight-slate"
  | "viral-yellow"
  | "neo-brutalism"
  | "glass-aurora"
  | "notion-clean"
  | "fintech-alpha"
  | "cyber-hud"
  | "stoic-gold"
  | "swiss-minimalist"
  | "retro-arcade";

export interface ThemePalette {
  id: MotionStyleId;
  name: string;
  tag: string;
  isLight: boolean;
  bgColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  secondaryAccent: string;
  cardBg: string;
  cardBorder: string;
  cardText: string;
  cardSubText: string;
  fontFamily: "sans-serif" | "serif" | "monospace";
}

export const MOTION_PALETTES: Record<MotionStyleId, ThemePalette> = {
  "editorial-light": {
    id: "editorial-light",
    name: "Studio Light Editorial",
    tag: "HYPE • LIGHT",
    isLight: true,
    bgColor: "#f8fafc",
    textColor: "#0f172a",
    mutedTextColor: "rgba(15, 23, 42, 0.35)",
    accentColor: "#2563eb",
    secondaryAccent: "#0284c7",
    cardBg: "#ffffff",
    cardBorder: "rgba(15, 23, 42, 0.12)",
    cardText: "#0f172a",
    cardSubText: "#475569",
    fontFamily: "sans-serif",
  },
  "midnight-slate": {
    id: "midnight-slate",
    name: "Midnight Slate Editorial",
    tag: "HYPE • TECH",
    isLight: false,
    bgColor: "#0b1120",
    textColor: "#f8fafc",
    mutedTextColor: "rgba(248, 250, 252, 0.36)",
    accentColor: "#3b82f6",
    secondaryAccent: "#60a5fa",
    cardBg: "rgba(30, 41, 59, 0.85)",
    cardBorder: "rgba(59, 130, 246, 0.3)",
    cardText: "#ffffff",
    cardSubText: "#cbd5e1",
    fontFamily: "sans-serif",
  },
  "viral-yellow": {
    id: "viral-yellow",
    name: "High-Contrast Viral Yellow",
    tag: "HYPE • REELS",
    isLight: false,
    bgColor: "#050505",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.32)",
    accentColor: "#facc15",
    secondaryAccent: "#22c55e",
    cardBg: "rgba(24, 24, 27, 0.92)",
    cardBorder: "rgba(250, 204, 21, 0.45)",
    cardText: "#ffffff",
    cardSubText: "#e4e4e7",
    fontFamily: "sans-serif",
  },
  "neo-brutalism": {
    id: "neo-brutalism",
    name: "Neo-Brutalism Pop",
    tag: "TRENDING",
    isLight: true,
    bgColor: "#fefce8",
    textColor: "#09090b",
    mutedTextColor: "rgba(9, 9, 11, 0.35)",
    accentColor: "#ea580c",
    secondaryAccent: "#db2777",
    cardBg: "#ffffff",
    cardBorder: "#09090b",
    cardText: "#09090b",
    cardSubText: "#27272a",
    fontFamily: "sans-serif",
  },
  "glass-aurora": {
    id: "glass-aurora",
    name: "Apple Glass Aurora",
    tag: "HYPE • GLASS",
    isLight: false,
    bgColor: "#09051a",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#a78bfa",
    secondaryAccent: "#22d3ee",
    cardBg: "rgba(255, 255, 255, 0.08)",
    cardBorder: "rgba(167, 139, 250, 0.35)",
    cardText: "#ffffff",
    cardSubText: "#ddd6fe",
    fontFamily: "sans-serif",
  },
  "notion-clean": {
    id: "notion-clean",
    name: "Notion Paper Clean",
    tag: "EDITORIAL",
    isLight: true,
    bgColor: "#fbfaf8",
    textColor: "#1c1917",
    mutedTextColor: "rgba(28, 25, 23, 0.35)",
    accentColor: "#e11d48",
    secondaryAccent: "#0f766e",
    cardBg: "#ffffff",
    cardBorder: "rgba(28, 25, 23, 0.14)",
    cardText: "#1c1917",
    cardSubText: "#57534e",
    fontFamily: "serif",
  },
  "apple-keynote": {
    id: "apple-keynote",
    name: "Apple Keynote Luxury",
    tag: "PRO",
    isLight: false,
    bgColor: "#08090d",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#38bdf8",
    secondaryAccent: "#10b981",
    cardBg: "rgba(15, 23, 42, 0.82)",
    cardBorder: "rgba(255, 255, 255, 0.14)",
    cardText: "#ffffff",
    cardSubText: "#cbd5e1",
    fontFamily: "sans-serif",
  },
  "fintech-alpha": {
    id: "fintech-alpha",
    name: "Wall St / FinTech Alpha",
    tag: "FINANCE",
    isLight: false,
    bgColor: "#070c14",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#10b981",
    secondaryAccent: "#34d399",
    cardBg: "rgba(6, 24, 20, 0.85)",
    cardBorder: "rgba(16, 185, 129, 0.35)",
    cardText: "#ffffff",
    cardSubText: "#a7f3d0",
    fontFamily: "sans-serif",
  },
  "cyber-hud": {
    id: "cyber-hud",
    name: "Cyberpunk Tech HUD",
    tag: "TECH",
    isLight: false,
    bgColor: "#080911",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#06b6d4",
    secondaryAccent: "#a855f7",
    cardBg: "rgba(15, 23, 42, 0.85)",
    cardBorder: "rgba(6, 182, 212, 0.4)",
    cardText: "#ffffff",
    cardSubText: "#a5f3fc",
    fontFamily: "monospace",
  },
  "stoic-gold": {
    id: "stoic-gold",
    name: "Dark Stoic & Gold",
    tag: "WISDOM",
    isLight: false,
    bgColor: "#0c0d11",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#f59e0b",
    secondaryAccent: "#fbbf24",
    cardBg: "rgba(24, 20, 14, 0.85)",
    cardBorder: "rgba(245, 158, 11, 0.4)",
    cardText: "#fef3c7",
    cardSubText: "#fde68a",
    fontFamily: "serif",
  },
  "swiss-minimalist": {
    id: "swiss-minimalist",
    name: "Swiss Bauhaus",
    tag: "DESIGN",
    isLight: false,
    bgColor: "#09090b",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#ef4444",
    secondaryAccent: "#f87171",
    cardBg: "rgba(24, 24, 27, 0.9)",
    cardBorder: "rgba(239, 68, 68, 0.4)",
    cardText: "#ffffff",
    cardSubText: "#fca5a5",
    fontFamily: "sans-serif",
  },
  "retro-arcade": {
    id: "retro-arcade",
    name: "Retro Synth Arcade",
    tag: "RETRO",
    isLight: false,
    bgColor: "#0a0718",
    textColor: "#ffffff",
    mutedTextColor: "rgba(255, 255, 255, 0.35)",
    accentColor: "#ec4899",
    secondaryAccent: "#8b5cf6",
    cardBg: "rgba(24, 14, 42, 0.88)",
    cardBorder: "rgba(236, 72, 153, 0.45)",
    cardText: "#ffffff",
    cardSubText: "#f9a8d4",
    fontFamily: "monospace",
  },
};

export type Human2DPresetId =
  | "tech-creator"
  | "hijab-educator"
  | "finance-exec"
  | "coffee-barista"
  | "genz-casual"
  | "stoic-mentor";

export interface Human2DPreset {
  id: Human2DPresetId;
  name: string;
  niche: string;
  gender: "male" | "female";
  skinColor: string;
  skinShadow: string;
  hairColor: string;
  topColor: string;
  outerColor: string;
  style: "blazer" | "suit-tie" | "hijab" | "barista" | "hoodie-long" | "turtleneck-beard";
  glasses: "square" | "round" | "none";
}

export const HUMAN_2D_PRESETS: Record<Human2DPresetId, Human2DPreset> = {
  "tech-creator": {
    id: "tech-creator",
    name: "Raka • Tech & AI",
    niche: "Tech, AI & SaaS",
    gender: "male",
    skinColor: "#f5c8a4",
    skinShadow: "#e0a980",
    hairColor: "#1e1b18",
    topColor: "#18181b",
    outerColor: "#334155",
    style: "blazer",
    glasses: "square",
  },
  "hijab-educator": {
    id: "hijab-educator",
    name: "Nadia • Hijab Edukator",
    niche: "Skincare & Edukasi",
    gender: "female",
    skinColor: "#f6cfb0",
    skinShadow: "#e2b28c",
    hairColor: "#047857",
    topColor: "#fef3c7",
    outerColor: "#065f46",
    style: "hijab",
    glasses: "none",
  },
  "finance-exec": {
    id: "finance-exec",
    name: "Bima • Finance CEO",
    niche: "Finansial & Bisnis",
    gender: "male",
    skinColor: "#f1c29b",
    skinShadow: "#d99b72",
    hairColor: "#1c1917",
    topColor: "#ffffff",
    outerColor: "#1e293b",
    style: "suit-tie",
    glasses: "square",
  },
  "coffee-barista": {
    id: "coffee-barista",
    name: "Dika • Barista Kopi",
    niche: "Kuliner & Kopi",
    gender: "male",
    skinColor: "#e8b48a",
    skinShadow: "#cf986e",
    hairColor: "#292524",
    topColor: "#fafaf9",
    outerColor: "#78350f",
    style: "barista",
    glasses: "none",
  },
  "genz-casual": {
    id: "genz-casual",
    name: "Salsa • Gen-Z Affiliate",
    niche: "Affiliate & Lifestyle",
    gender: "female",
    skinColor: "#f7d4b8",
    skinShadow: "#e3b694",
    hairColor: "#3f2212",
    topColor: "#ec4899",
    outerColor: "#db2777",
    style: "hoodie-long",
    glasses: "round",
  },
  "stoic-mentor": {
    id: "stoic-mentor",
    name: "Arjun • Stoic Mentor",
    niche: "Motivasi & Stoic",
    gender: "male",
    skinColor: "#e6b38c",
    skinShadow: "#c99269",
    hairColor: "#27272a",
    topColor: "#18181b",
    outerColor: "#27272a",
    style: "turtleneck-beard",
    glasses: "none",
  },
};

/**
 * 2D Rigged Human Creator Host (Layered Vector/Editorial Character)
 * Features 6 distinct persona presets, natural head tilt, blinking eyes,
 * emotion-reactive eyebrows, 6 acoustic phoneme mouth shapes, and gestures.
 */
export function drawRiggedHumanHost(
  ctx: CanvasRenderingContext2D,
  options: {
    cx: number;
    cy: number;
    scale: number;
    emotion: "shocked" | "skeptical" | "celebrate" | "point-cta";
    isTalking: boolean;
    vocalVolume?: number;
    elapsed: number;
    accentColor?: string;
    presetId?: Human2DPresetId;
  }
) {
  const {
    cx,
    cy,
    scale,
    emotion,
    isTalking,
    vocalVolume = 0,
    elapsed,
    accentColor = "#38bdf8",
    presetId = "tech-creator",
  } = options;

  const p = HUMAN_2D_PRESETS[presetId] || HUMAN_2D_PRESETS["tech-creator"];
  const hasVoice = vocalVolume > 8;
  const activeSpeak = isTalking && (vocalVolume > 0 ? hasVoice : Math.sin(elapsed * 12) > 0.2);

  // Subtle breathing + vocal head nod
  const breatheY = Math.sin(elapsed * 2.4) * 3.5;
  const vocalBounce = activeSpeak ? Math.min(vocalVolume / 55, 1) * 4 : 0;
  const headTilt = Math.sin(elapsed * 1.7) * 0.035 + (activeSpeak ? Math.sin(elapsed * 9) * 0.018 : 0);

  ctx.save();
  ctx.translate(cx, cy + breatheY - vocalBounce);
  ctx.scale(scale, scale);

  // Subtle Studio Rim-Light Glow behind host
  const rimGrad = ctx.createRadialGradient(0, -10, 20, 0, -10, 175);
  rimGrad.addColorStop(0, `${accentColor}33`);
  rimGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(0, -10, 175, 0, Math.PI * 2);
  ctx.fill();

  // Back Hair / Hijab Drape behind shoulders
  if (p.style === "hoodie-long") {
    ctx.fillStyle = p.hairColor;
    ctx.beginPath();
    ctx.roundRect(-72, -60, 144, 165, 36);
    ctx.fill();
  } else if (p.style === "hijab") {
    ctx.fillStyle = p.hairColor;
    ctx.beginPath();
    ctx.roundRect(-76, -86, 152, 200, [56, 56, 36, 36]);
    ctx.fill();
  }

  // 1. TORSO & OUTFIT
  ctx.save();
  ctx.fillStyle = p.topColor;
  ctx.beginPath();
  ctx.roundRect(-82, 68, 164, 210, 32);
  ctx.fill();

  if (p.style === "blazer" || p.style === "suit-tie") {
    ctx.fillStyle = p.outerColor;
    ctx.beginPath();
    ctx.moveTo(-88, 72);
    ctx.lineTo(-24, 68);
    ctx.lineTo(-14, 195);
    ctx.lineTo(-96, 265);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(88, 72);
    ctx.lineTo(24, 68);
    ctx.lineTo(14, 195);
    ctx.lineTo(96, 265);
    ctx.closePath();
    ctx.fill();

    if (p.style === "suit-tie") {
      // Gold/Accent tie
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(-9, 68);
      ctx.lineTo(9, 68);
      ctx.lineTo(12, 165);
      ctx.lineTo(0, 185);
      ctx.lineTo(-12, 165);
      ctx.closePath();
      ctx.fill();
    }
  } else if (p.style === "barista") {
    // Apron over white tee
    ctx.fillStyle = p.outerColor;
    ctx.beginPath();
    ctx.roundRect(-58, 86, 116, 190, 16);
    ctx.fill();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-42, 68);
    ctx.lineTo(-42, 92);
    ctx.moveTo(42, 68);
    ctx.lineTo(42, 92);
    ctx.stroke();
  } else if (p.style === "turtleneck-beard") {
    ctx.fillStyle = p.outerColor;
    ctx.beginPath();
    ctx.roundRect(-28, 52, 56, 30, 10);
    ctx.fill();
  } else if (p.style === "hijab") {
    // Neat hijab chest drape
    ctx.fillStyle = p.outerColor;
    ctx.beginPath();
    ctx.roundRect(-56, 62, 112, 74, [16, 16, 44, 44]);
    ctx.fill();
  } else if (p.style === "hoodie-long") {
    // Hoodie strings
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-16, 76);
    ctx.lineTo(-18, 125);
    ctx.moveTo(16, 76);
    ctx.lineTo(18, 125);
    ctx.stroke();
  }
  ctx.restore();

  // 2. EXPRESSIVE HUMAN HANDS (Animated per Emotion)
  ctx.save();
  ctx.fillStyle = p.skinColor;
  ctx.strokeStyle = p.skinShadow;
  ctx.lineWidth = 2;

  if (emotion === "shocked") {
    const wave = Math.sin(elapsed * 5) * 6;
    ctx.beginPath();
    ctx.roundRect(-108, 18 + wave, 34, 46, 14);
    ctx.fill();
    ctx.stroke();
  } else if (emotion === "skeptical") {
    ctx.beginPath();
    ctx.roundRect(12, 46, 40, 28, 12);
    ctx.fill();
    ctx.stroke();
  } else if (emotion === "celebrate") {
    const cheer = Math.sin(elapsed * 6) * 8;
    ctx.beginPath();
    ctx.roundRect(-112, 4 + cheer, 34, 42, 14);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(78, 4 - cheer, 34, 42, 14);
    ctx.fill();
    ctx.stroke();
  } else if (emotion === "point-cta") {
    const bob = Math.sin(elapsed * 4) * 6;
    ctx.beginPath();
    ctx.roundRect(72, -16 + bob, 28, 56, 12);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(79, -42 + bob, 14, 30, 7);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 3. NECK WITH SHADOW
  ctx.fillStyle = p.skinShadow;
  ctx.beginPath();
  ctx.roundRect(-22, 34, 44, 44, 10);
  ctx.fill();

  // 4. RIGGED HEAD GROUP
  ctx.save();
  ctx.rotate(headTilt);

  if (p.style !== "hijab") {
    ctx.fillStyle = p.skinShadow;
    ctx.beginPath();
    ctx.ellipse(-60, -10, 10, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(60, -10, 10, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smooth human head contour
  ctx.fillStyle = p.skinColor;
  ctx.beginPath();
  ctx.roundRect(-58, -76, 116, 124, [48, 48, 40, 40]);
  ctx.fill();

  // Subtle cheek warmth
  ctx.fillStyle = "rgba(244, 63, 94, 0.14)";
  ctx.beginPath();
  ctx.ellipse(-34, 6, 14, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(34, 6, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stoic Mentor Beard
  if (p.style === "turtleneck-beard") {
    ctx.fillStyle = "rgba(39, 39, 42, 0.85)";
    ctx.beginPath();
    ctx.roundRect(-54, 6, 108, 44, [8, 8, 40, 40]);
    ctx.fill();
    // Mouth cutout area on beard
    ctx.fillStyle = p.skinColor;
    ctx.beginPath();
    ctx.ellipse(0, 20, 22, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hair / Hijab Front Frame / Barista Cap
  if (p.style === "hijab") {
    ctx.strokeStyle = p.hairColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.roundRect(-58, -80, 116, 126, [50, 50, 42, 42]);
    ctx.stroke();
  } else if (p.style === "barista") {
    ctx.fillStyle = "#292524";
    ctx.beginPath();
    ctx.roundRect(-62, -98, 124, 46, [40, 40, 8, 8]);
    ctx.fill();
    // Cap brim
    ctx.fillStyle = "#44403c";
    ctx.beginPath();
    ctx.roundRect(-56, -62, 138, 14, 7);
    ctx.fill();
  } else {
    ctx.fillStyle = p.hairColor;
    ctx.beginPath();
    ctx.roundRect(-62, -96, 124, 52, [44, 44, 14, 14]);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-54, -56);
    ctx.quadraticCurveTo(-20, -34, 8, -54);
    ctx.quadraticCurveTo(32, -36, 56, -56);
    ctx.lineTo(58, -78);
    ctx.lineTo(-58, -78);
    ctx.closePath();
    ctx.fill();
  }

  // Glasses
  if (p.glasses === "square") {
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-44, -28, 34, 26, 8);
    ctx.roundRect(10, -28, 34, 26, 8);
    ctx.moveTo(-10, -15);
    ctx.lineTo(10, -15);
    ctx.stroke();
  } else if (p.glasses === "round") {
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-27, -15, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(27, -15, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-11, -15);
    ctx.lineTo(11, -15);
    ctx.stroke();
  }

  // Eyebrows (Emotion Reactive)
  ctx.strokeStyle = "#1e1b18";
  ctx.lineWidth = 4.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (emotion === "shocked") {
    ctx.moveTo(-40, -38);
    ctx.quadraticCurveTo(-27, -46, -14, -38);
    ctx.moveTo(14, -38);
    ctx.quadraticCurveTo(27, -46, 40, -38);
  } else if (emotion === "skeptical") {
    ctx.moveTo(-40, -40);
    ctx.lineTo(-14, -37);
    ctx.moveTo(14, -33);
    ctx.lineTo(40, -36);
  } else {
    ctx.moveTo(-40, -36);
    ctx.lineTo(-14, -36);
    ctx.moveTo(14, -36);
    ctx.lineTo(40, -36);
  }
  ctx.stroke();

  // Eyes (Natural Blinking + Catchlight)
  const isBlinking = Math.sin(elapsed * 2.1) > 0.94;
  if (isBlinking) {
    ctx.strokeStyle = "#1e1b18";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-36, -15);
    ctx.lineTo(-18, -15);
    ctx.moveTo(18, -15);
    ctx.lineTo(36, -15);
    ctx.stroke();
  } else if (emotion === "celebrate") {
    ctx.strokeStyle = "#1e1b18";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-27, -12, 8, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(27, -12, 8, Math.PI, 0);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(-27, -15, 6.5, 0, Math.PI * 2);
    ctx.arc(27, -15, 6.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-29, -17, 2.5, 0, Math.PI * 2);
    ctx.arc(25, -17, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nose
  ctx.strokeStyle = "#d99b72";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(5, 2, -2, 4);
  ctx.stroke();

  // 5. 6-PHONEME ACOUSTIC MOUTH LIP-SYNC (A / I / U / E / O / Closed)
  if (activeSpeak) {
    const energy = vocalVolume > 0 ? Math.min(vocalVolume / 45, 1) : 0.65;
    const phonemeCycle = Math.floor((elapsed * 11) % 5); // Cycles natural phoneme shapes while voice energy is active
    const mouthW = phonemeCycle === 2 ? 18 : phonemeCycle === 1 ? 30 : 24 + energy * 6;
    const mouthH = Math.max(6, (phonemeCycle === 2 ? 14 : 9 + energy * 10));

    ctx.fillStyle = "#3f0d12";
    ctx.beginPath();
    ctx.ellipse(0, 21, mouthW / 2, mouthH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper teeth
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-mouthW * 0.36, 21 - mouthH / 2 + 1, mouthW * 0.72, 3.5, 1.5);
    ctx.fill();

    // Tongue when open wide ("A" / "O")
    if (mouthH > 10) {
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.ellipse(0, 21 + mouthH * 0.25, mouthW * 0.28, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Relaxed natural smile when silent
    ctx.strokeStyle = "#7c2d12";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, 20);
    ctx.quadraticCurveTo(0, 25, 12, 20);
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

/**
 * Multi-Pose Human Cutout Renderer (Studio Photo Presenter Style)
 * Renders user-uploaded human photo/PNG cutout anchored at bottom with
 * breathing motion, studio rim-light, and acoustic vocal micro-bounce.
 */
export function drawHumanCutoutAvatar(
  ctx: CanvasRenderingContext2D,
  options: {
    img: HTMLImageElement;
    cx: number;
    bottomY: number;
    maxHeight: number;
    maxWidth: number;
    vocalVolume?: number;
    elapsed: number;
    accentColor?: string;
    sceneProgress?: number;
    framing?: "half-body" | "full-body";
    poseInfo?: {
      id: string;
      label: string;
      tiltDeg: number;
      scaleMultiplier: number;
      yOffset: number;
      badgeEmoji: string;
      badgeText: string;
      glowColor?: string;
    };
  }
) {
  const {
    img,
    cx,
    bottomY,
    maxHeight,
    maxWidth,
    vocalVolume = 0,
    elapsed,
    accentColor = "#38bdf8",
    sceneProgress = 0.5,
    framing = "half-body",
    poseInfo,
  } = options;

  if (!img.complete || img.naturalWidth === 0) return;

  // Smart Framing: If user uploads full-body photo (tall aspect ratio) and half-body is selected,
  // crop to upper 58% (torso + head) so presenter face remains large, expressive and impactful on mobile screens!
  const isTallFullBody = img.naturalHeight / img.naturalWidth > 1.35;
  const isCropHalfBody = framing === "half-body" && isTallFullBody;

  const effectiveSourceW = img.naturalWidth;
  const effectiveSourceH = isCropHalfBody ? img.naturalHeight * 0.58 : img.naturalHeight;

  const activeMaxH = framing === "full-body" ? Math.max(maxHeight, 520) : maxHeight;
  const ratio = Math.min(maxWidth / effectiveSourceW, activeMaxH / effectiveSourceH);
  const drawW = effectiveSourceW * ratio;
  const drawH = effectiveSourceH * ratio;

  // Natural human micro-motion: breathing + gentle sway + vocal energy micro-nod
  const breatheScale = 1 + Math.sin(elapsed * 2.2) * 0.012;
  const vocalBounce = vocalVolume > 10 ? Math.min(vocalVolume / 60, 1) * 4.5 : 0;
  const swayX = Math.sin(elapsed * 1.4) * 3;
  const enterZoom = 0.94 + Math.min(sceneProgress * 4, 1) * 0.06;

  // Contextual Dynamic Pose Transforms (100% Procedural & Air-Gapped)
  const poseTilt = poseInfo?.tiltDeg ? (poseInfo.tiltDeg * Math.PI) / 180 : 0;
  const poseScale = poseInfo?.scaleMultiplier || 1.0;
  const poseYOffset = poseInfo?.yOffset || 0;
  const activeGlowColor = poseInfo?.glowColor || accentColor;

  ctx.save();
  ctx.translate(cx + swayX, bottomY - vocalBounce + poseYOffset);

  // Smooth ease-in for pose tilt
  const currentTilt = poseTilt * Math.min(sceneProgress * 3.5, 1);
  ctx.rotate(currentTilt);

  const finalScale = breatheScale * enterZoom * poseScale;
  ctx.scale(finalScale, finalScale);

  // Studio rim-light glow behind person
  const glow = ctx.createRadialGradient(0, -drawH * 0.55, 20, 0, -drawH * 0.55, drawH * 0.65);
  glow.addColorStop(0, `${activeGlowColor}33`);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -drawH * 0.55, drawH * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Draw the actual human cutout photo (with smart source framing if full body)
  if (isCropHalfBody) {
    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      effectiveSourceH,
      -drawW / 2,
      -drawH,
      drawW,
      drawH
    );
  } else {
    ctx.drawImage(img, -drawW / 2, -drawH, drawW, drawH);
  }

  // Floating Action Gesture Badge: Only show if badgeEmoji is explicitly set AND non-empty!
  // (Prevents any technical placeholder text like "HOOK INTRO" from appearing on screen)
  if (poseInfo && poseInfo.badgeEmoji && poseInfo.badgeEmoji.trim() !== "" && sceneProgress > 0.08) {
    const badgeFloatY = Math.sin(elapsed * 3) * 4;
    const badgeX = drawW * 0.32;
    const badgeY = -drawH * 0.88 + badgeFloatY;

    ctx.save();
    ctx.translate(badgeX, badgeY);

    // Badge Pop-in
    const badgeScale = Math.min((sceneProgress - 0.08) * 6, 1);
    ctx.scale(badgeScale, badgeScale);

    const hasText = !!poseInfo.badgeText && poseInfo.badgeText.trim() !== "";
    const badgeWidth = hasText ? 115 : 44;
    const badgeHeight = 34;

    // Pill Background
    ctx.fillStyle = "rgba(10, 15, 25, 0.88)";
    ctx.strokeStyle = activeGlowColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = activeGlowColor;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.roundRect(-badgeWidth / 2, -badgeHeight / 2, badgeWidth, badgeHeight, 17);
    ctx.fill();
    ctx.stroke();

    // Emoji + Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (hasText) {
      ctx.font = "900 12px Inter, system-ui, sans-serif";
      ctx.fillText(`${poseInfo.badgeEmoji} ${poseInfo.badgeText}`, 0, 1);
    } else {
      ctx.font = "20px system-ui, sans-serif";
      ctx.fillText(poseInfo.badgeEmoji, 0, 1);
    }

    ctx.restore();
  }

  ctx.restore();
}
