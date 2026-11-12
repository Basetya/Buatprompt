import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET() {
  let gpuName: string | null = null;
  let pythonAvailable = false;

  try {
    const { stdout } = await execPromise("nvidia-smi --query-gpu=name --format=csv,noheader", {
      timeout: 2500,
    });
    if (stdout && stdout.trim()) {
      gpuName = stdout.trim().split("\n")[0].trim();
    }
  } catch {
    gpuName = null;
  }

  try {
    const { stdout } = await execPromise("python --version", { timeout: 2000 });
    if (stdout && stdout.toLowerCase().includes("python")) {
      pythonAvailable = true;
    }
  } catch {
    pythonAvailable = false;
  }

  return NextResponse.json({
    browserRealtimeReady: true,
    gpuAvailable: Boolean(gpuName),
    gpuName,
    pythonAvailable,
    supportedLocalModels: ["LivePortrait", "MuseTalk", "Wav2Lip"],
    activeMode: "browser-realtime-rigged-and-cutout",
    note: gpuName
      ? `GPU terdeteksi (${gpuName}). Siap untuk integrasi worker LivePortrait/MuseTalk offline.`
      : "Berjalan dalam Mode Browser Real-Time (0% GPU/API eksternal): 2D Rigged Human + Multi-Pose Cutout.",
  });
}
