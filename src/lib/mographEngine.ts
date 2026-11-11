/**
 * BUATPROMPT MOGRAPH ENGINE
 * -------------------------------------------------------------
 * Audio Synthesizer (Foley SFX & Lo-Fi BGM Generator),
 * Timed Phrase Segmentation, and Expressive Voxel Character Drawing.
 * 100% Client-Side Web Audio API & HTML5 Canvas.
 */

export interface TimedPhrase {
  phraseText: string;
  highlightWord?: string;
  startPct: number; // 0 to 1
  endPct: number;   // 0 to 1
  badge?: string;
}

/**
 * Splits scene headline and subtext into 3 punchy, dynamic phrases
 * (2-4 words each) with exact timing windows for karaoke-style delivery.
 */
export function extractTimedPhrases(
  headline: string,
  subtext: string,
  highlightKeyword?: string,
  metricBadge?: string
): TimedPhrase[] {
  const cleanHeadline = headline.trim().toUpperCase();
  const words = cleanHeadline.split(/\s+/).filter(Boolean);

  if (words.length <= 3) {
    return [
      {
        phraseText: words.join(" "),
        highlightWord: highlightKeyword?.toUpperCase(),
        startPct: 0.0,
        endPct: 0.35,
        badge: metricBadge,
      },
      {
        phraseText: extractPunchySubtext(subtext, 0),
        highlightWord: highlightKeyword?.toUpperCase(),
        startPct: 0.35,
        endPct: 0.70,
      },
      {
        phraseText: extractPunchySubtext(subtext, 1) || (metricBadge || "PERHATIKAN!"),
        highlightWord: highlightKeyword?.toUpperCase(),
        startPct: 0.70,
        endPct: 1.0,
        badge: metricBadge,
      },
    ];
  }

  // Divide headline words into 2 parts
  const mid = Math.ceil(words.length / 2);
  const part1 = words.slice(0, mid).join(" ");
  const part2 = words.slice(mid).join(" ");
  const punchySub = extractPunchySubtext(subtext, 0);

  return [
    {
      phraseText: part1,
      highlightWord: highlightKeyword?.toUpperCase(),
      startPct: 0.0,
      endPct: 0.32,
    },
    {
      phraseText: part2,
      highlightWord: highlightKeyword?.toUpperCase(),
      startPct: 0.32,
      endPct: 0.68,
      badge: metricBadge,
    },
    {
      phraseText: punchySub || (metricBadge || "SIMAK CARANYA"),
      highlightWord: highlightKeyword?.toUpperCase(),
      startPct: 0.68,
      endPct: 1.0,
      badge: metricBadge,
    },
  ];
}

function extractPunchySubtext(subtext: string, part: number): string {
  if (!subtext) return "";
  const cleaned = subtext.replace(/[#*`~]/g, "").trim();
  const sentences = cleaned.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

  if (sentences.length > part && sentences[part].length > 0) {
    const sWords = sentences[part].split(/\s+/).filter(Boolean);
    return sWords.slice(0, 4).join(" ").toUpperCase();
  }

  const allWords = cleaned.split(/\s+/).filter(Boolean);
  const start = part * 4;
  return allWords.slice(start, start + 4).join(" ").toUpperCase();
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
    this.masterGain.gain.setValueAtTime(0.16, audioCtx.currentTime);
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

/**
 * Expressive 3D Voxel Character Drawing on Canvas
 * Anchored at bottom, with expressive eyes, mouth flap, and animated hand gestures.
 */
export function drawVoxelAvatar(
  ctx: CanvasRenderingContext2D,
  options: {
    cx: number;
    cy: number;
    scale: number;
    emotion: "shocked" | "skeptical" | "celebrate" | "point-cta";
    isTalking: boolean;
    elapsed: number;
    outfit: "beanie-striped" | "hoodie-glasses";
  }
) {
  const { cx, cy, scale, emotion, isTalking, elapsed, outfit } = options;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // 1. Natural idle bobbing & breathing
  const idleBob = Math.sin(elapsed * 2.8) * 5;
  const headSway = Math.sin(elapsed * 1.6) * 0.035;

  ctx.translate(0, idleBob);

  // 2. CHEST / SHOULDERS (Bottom Anchored)
  ctx.save();
  if (outfit === "beanie-striped") {
    // Striped sailor shirt
    ctx.fillStyle = "#1e40af";
    ctx.fillRect(-90, 80, 180, 220);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-90, 110, 180, 22);
    ctx.fillRect(-90, 155, 180, 22);
    ctx.fillRect(-90, 200, 180, 22);

    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-45, 70, 90, 24);
  } else {
    // Orange Hoodie
    ctx.fillStyle = "#ea580c";
    ctx.fillRect(-90, 80, 180, 220);

    ctx.fillStyle = "#c2410c";
    ctx.fillRect(-55, 150, 110, 65);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-22, 90, 6, 45);
    ctx.fillRect(16, 90, 6, 45);

    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✻", 0, 142);
  }
  ctx.restore();

  // 3. HAND GESTURES BASED ON EMOTION
  ctx.save();
  ctx.fillStyle = "#f5c59f"; // Skin
  ctx.strokeStyle = "#d49b77";
  ctx.lineWidth = 2;

  if (emotion === "shocked") {
    // Left hand raised to cheek in surprise
    const handBob = Math.sin(elapsed * 4) * 4;
    ctx.fillRect(-105, 10 + handBob, 32, 45);
    ctx.strokeRect(-105, 10 + handBob, 32, 45);
  } else if (emotion === "skeptical") {
    // Right hand to chin in thought
    ctx.fillRect(20, 40, 42, 30);
    ctx.strokeRect(20, 40, 42, 30);
  } else if (emotion === "celebrate") {
    // Both hands raised in victory
    const cheer = Math.sin(elapsed * 5) * 8;
    ctx.fillRect(-115, -10 + cheer, 30, 40);
    ctx.strokeRect(-115, -10 + cheer, 30, 40);
    ctx.fillRect(85, -10 - cheer, 30, 40);
    ctx.strokeRect(85, -10 - cheer, 30, 40);
  } else if (emotion === "point-cta") {
    // Right hand pointing upwards toward the kinetic text / CTA
    const pointBob = Math.sin(elapsed * 3.5) * 6;
    ctx.fillRect(75, -25 + pointBob, 26, 60);
    ctx.strokeRect(75, -25 + pointBob, 26, 60);
    // Index finger point
    ctx.fillRect(80, -45 + pointBob, 16, 22);
  }
  ctx.restore();

  // 4. NECK
  ctx.fillStyle = "#d49b77";
  ctx.fillRect(-22, 55, 44, 30);

  // 5. HEAD (Voxel Block with 3D Shading)
  ctx.save();
  ctx.rotate(headSway);

  // Front face
  ctx.fillStyle = "#f5c59f";
  ctx.fillRect(-65, -75, 130, 130);

  // Side 3D shading
  ctx.fillStyle = "#e2b28c";
  ctx.fillRect(60, -75, 15, 130);

  // Bottom shadow
  ctx.fillStyle = "#d49b77";
  ctx.fillRect(-65, 45, 130, 10);

  // Nose
  ctx.fillStyle = "#e2b28c";
  ctx.fillRect(-10, -5, 20, 16);

  // Cheeks
  ctx.fillStyle = "rgba(239, 68, 68, 0.22)";
  ctx.fillRect(-55, 0, 24, 14);
  ctx.fillRect(31, 0, 24, 14);

  // 6. HAIR / BEANIE
  if (outfit === "beanie-striped") {
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-72, -145, 144, 80);

    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-76, -82, 152, 22);

    ctx.fillStyle = "#1e40af";
    ctx.fillRect(-24, -172, 48, 30);
    ctx.fillRect(-18, -180, 36, 12);

    ctx.fillStyle = "#451a03";
    ctx.fillRect(-60, -60, 24, 20);
    ctx.fillRect(36, -60, 24, 20);
    ctx.fillRect(-14, -60, 28, 16);
  } else {
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(-72, -110, 144, 45);
    ctx.fillRect(-72, -75, 18, 55);
    ctx.fillRect(54, -75, 18, 55);
    ctx.fillRect(-45, -68, 90, 15);
  }

  // 7. EYES & EYEBROWS (Expressive & Blinking)
  const isBlinking = Math.sin(elapsed * 2.2) > 0.94;

  if (outfit === "hoodie-glasses") {
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 6;
    ctx.strokeRect(-50, -32, 40, 34);
    ctx.strokeRect(10, -32, 40, 34);
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.lineTo(10, -15);
    ctx.stroke();
  }

  // Eyebrows
  ctx.fillStyle = "#29180f";
  if (emotion === "shocked") {
    ctx.fillRect(-48, -48, 32, 7);
    ctx.fillRect(16, -48, 32, 7);
  } else if (emotion === "skeptical") {
    ctx.fillRect(-48, -50, 32, 7);
    ctx.fillRect(16, -38, 32, 7);
  } else {
    ctx.fillRect(-48, -42, 32, 6);
    ctx.fillRect(16, -42, 32, 6);
  }

  // Eyes with Glossy Highlights
  if (isBlinking) {
    ctx.fillStyle = "#29180f";
    ctx.fillRect(-42, -20, 22, 4);
    ctx.fillRect(20, -20, 22, 4);
  } else if (emotion === "celebrate") {
    ctx.strokeStyle = "#29180f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-31, -16, 11, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(31, -16, 11, Math.PI, 0);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#0f172a";
    const eyeH = emotion === "shocked" ? 24 : 18;
    ctx.fillRect(-42, -22, 19, eyeH);
    ctx.fillRect(23, -22, 19, eyeH);

    // White gloss reflection
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-40, -20, 7, 7);
    ctx.fillRect(25, -20, 7, 7);
  }

  // 8. MOUTH FLAP (Harmonic Lip-Sync)
  if (isTalking) {
    const mouthHeight = Math.abs(Math.sin(elapsed * 15)) * 16 + 5;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-20, 15, 40, mouthHeight);

    // White upper teeth
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-17, 15, 34, 4);

    // Pink tongue
    if (mouthHeight > 10) {
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(-14, 15 + mouthHeight - 6, 28, 6);
    }
  } else {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(-16, 22, 32, 4);
  }

  // 9. EMOTIONAL OVERLAYS
  if (emotion === "shocked") {
    ctx.font = "bold 38px monospace";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("!", 0, -195);
  } else if (emotion === "skeptical") {
    ctx.font = "bold 34px monospace";
    ctx.fillStyle = "#06b6d4";
    ctx.textAlign = "center";
    ctx.fillText("?", 52, -160);
  } else if (emotion === "celebrate") {
    ctx.font = "26px sans-serif";
    ctx.fillStyle = "#facc15";
    ctx.fillText("★", -65, -150);
    ctx.fillText("★", 65, -150);
  } else if (emotion === "point-cta") {
    ctx.font = "30px sans-serif";
    ctx.fillText("🔖", 0, -190);
  }

  ctx.restore();
  ctx.restore();
}
