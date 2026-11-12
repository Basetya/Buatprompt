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
    outfit: "beanie-striped" | "hoodie-glasses";
  }
) {
  const { cx, cy, scale, emotion, isTalking, vocalVolume = 0, elapsed, outfit } = options;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // 1. Natural idle bobbing & breathing
  const idleBob = Math.sin(elapsed * 2.8) * 4;
  const headSway = Math.sin(elapsed * 1.6) * 0.03;

  ctx.translate(0, idleBob);

  // 2. CHEST / SHOULDERS (Bottom Anchored)
  ctx.save();
  if (outfit === "beanie-striped") {
    ctx.fillStyle = "#1e40af";
    ctx.fillRect(-85, 75, 170, 230);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-85, 105, 170, 20);
    ctx.fillRect(-85, 145, 170, 20);
    ctx.fillRect(-85, 185, 170, 20);

    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-40, 65, 80, 22);
  } else {
    ctx.fillStyle = "#ea580c";
    ctx.fillRect(-85, 75, 170, 230);

    ctx.fillStyle = "#c2410c";
    ctx.fillRect(-50, 140, 100, 60);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-18, 85, 5, 40);
    ctx.fillRect(13, 85, 5, 40);

    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✻", 0, 136);
  }
  ctx.restore();

  // 3. HAND GESTURES BASED ON EMOTION
  ctx.save();
  ctx.fillStyle = "#f5c59f";
  ctx.strokeStyle = "#d49b77";
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
  ctx.fillStyle = "#d49b77";
  ctx.fillRect(-20, 50, 40, 28);

  // 5. HEAD (Voxel Block with 3D Shading)
  ctx.save();
  ctx.rotate(headSway);

  // Front face
  ctx.fillStyle = "#f5c59f";
  ctx.fillRect(-60, -70, 120, 120);

  // Side 3D shading
  ctx.fillStyle = "#e2b28c";
  ctx.fillRect(55, -70, 14, 120);

  // Bottom shadow
  ctx.fillStyle = "#d49b77";
  ctx.fillRect(-60, 42, 120, 8);

  // Nose
  ctx.fillStyle = "#e2b28c";
  ctx.fillRect(-9, -4, 18, 14);

  // Cheeks
  ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
  ctx.fillRect(-50, 2, 22, 12);
  ctx.fillRect(28, 2, 22, 12);

  // 6. HAIR / BEANIE
  if (outfit === "beanie-striped") {
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(-66, -135, 132, 75);

    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-70, -76, 140, 20);

    ctx.fillStyle = "#1e40af";
    ctx.fillRect(-22, -160, 44, 26);
    ctx.fillRect(-16, -168, 32, 10);

    ctx.fillStyle = "#451a03";
    ctx.fillRect(-55, -56, 22, 18);
    ctx.fillRect(33, -56, 22, 18);
    ctx.fillRect(-12, -56, 24, 14);
  } else {
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(-66, -102, 132, 42);
    ctx.fillRect(-66, -70, 16, 50);
    ctx.fillRect(50, -70, 16, 50);
    ctx.fillRect(-42, -64, 84, 14);
  }

  // 7. EYES & EYEBROWS (Expressive & Blinking)
  const isBlinking = Math.sin(elapsed * 2.2) > 0.94;

  if (outfit === "hoodie-glasses") {
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 5;
    ctx.strokeRect(-46, -30, 36, 30);
    ctx.strokeRect(10, -30, 36, 30);
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.lineTo(10, -15);
    ctx.stroke();
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
