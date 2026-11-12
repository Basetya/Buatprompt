import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_VAULT, matchDomainVault } from "@/lib/knowledgeVault";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain = "stoic_motivation", customNicheTitle = "" } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Live LLM Knowledge Distillation (Online Mode)
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `Anda adalah Chief Knowledge Architect dan Senior Research Curator.
Tugas Anda adalah melakukan "KNOWLEDGE DISTILLATION" untuk domain/niche: "${customNicheTitle || domain}".
Ekstrak intisari pengetahuan berbobot tinggi kelas dunia yang mencakup:
1. 4 Authority Facts: Fakta empiris, hukum psikologi, atau data statistik industri yang mengejutkan.
2. 4 Legendary Quotes: Kutipan otentik dari tokoh legendaris dunia (kombinasi Barat & Timur, filsuf, investor, atau pakar industri) lengkap dengan nama pengarang dan konsepnya.
3. 4 Psychological Hooks: Kalimat pembuka penahan scroll jempol yang mematahkan mitos (Pattern Interrupt).
4. 4 Action Solutions: Solusi praktis, terukur, dan langsung bisa dieksekusi audiens hari ini.
5. 3 Infinite Loop CTAs: Kalimat ajakan simpan video yang kata terakhirnya menyatu kembali ke detik awal.

Kembalikan HANYA JSON VALID (tanpa markdown code fences, tanpa kata pengantar) dengan struktur persis seperti ini:
{
  "id": "${domain.toLowerCase().replace(/\\s+/g, '_')}",
  "name": "${customNicheTitle || domain}",
  "badge": "🧠 DISTILLED KNOWLEDGE VAULT",
  "tagline": "Pengetahuan terdistilasi via Gemini 2.5 Flash untuk sintesis deterministik mandiri.",
  "authorityFacts": [
    "Fakta empiris 1...",
    "Fakta empiris 2...",
    "Fakta empiris 3...",
    "Fakta empiris 4..."
  ],
  "legendaryQuotes": [
    {
      "quote": "Teks kutipan...",
      "author": "Nama Pengarang / Tokoh",
      "concept": "Nama Konsep"
    }
  ],
  "psychologicalHooks": [
    "Hook 1...",
    "Hook 2...",
    "Hook 3...",
    "Hook 4..."
  ],
  "actionSolutions": [
    "Solusi 1...",
    "Solusi 2...",
    "Solusi 3...",
    "Solusi 4..."
  ],
  "ctaLoops": [
    "CTA Loop 1...",
    "CTA Loop 2...",
    "CTA Loop 3..."
  ]
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
        });

        const rawText = response.text || "";
        const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        return NextResponse.json({
          status: "success",
          source: "gemini-2.5-flash-distillation",
          vault: parsed
        });
      } catch (geminiErr: any) {
        console.warn("Live distillation failed, falling back to local vault:", geminiErr);
      }
    }

    // 2. Studio Local Knowledge Bank Fallback
    const localVault = matchDomainVault(domain || customNicheTitle);
    return NextResponse.json({
      status: "success",
      source: "local-studio-vault",
      vault: localVault,
      message: "Beroperasi menggunakan Bank Pengetahuan Lokal BuatPrompt."
    });
  } catch (err: any) {
    console.error("Distill Vault API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to distill knowledge vault" },
      { status: 500 }
    );
  }
}

