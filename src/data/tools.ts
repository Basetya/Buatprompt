export interface ToolItem {
  id: string;
  tool_key: string;
  title: string;
  name: string;
  path: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  icon: string;
  color: string;
  iconBg: string;
  featured?: boolean;
  category: "google-flow" | "cinematic-video" | "visual-art" | "commerce-growth" | "interactive-lab";
  samples?: string[];
}

export const ALL_TOOLS: ToolItem[] = [
  // --- FLAGSHIP GOOGLE FLOW & NEXT-GEN TOOLS ---
  {
    id: "google-flow-director",
    tool_key: "google-flow-director",
    title: "GOOGLE FLOW MULTI-SHOT DIRECTOR",
    name: "Google Flow Multi-Shot Director",
    path: "/google-flow-director",
    icon: "Video",
    color: "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    badge: "EXCLUSIVE",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    featured: true,
    category: "google-flow",
    description: "Rancang sekuens video multi-shot terpadu untuk Google Veo dengan konsistensi karakter, pacing kamera sinematik, serta deskripsi audio/soundscape sinkron.",
    samples: [
      "Sekuens 3 shot: Establishing drone -> Medium action -> Close-up emosi",
      "Konsistensi pencahayaan sinematik malam hari di Tokyo cyberpunk"
    ]
  },
  {
    id: "prompt-matrix",
    tool_key: "prompt-matrix",
    title: "UNIVERSAL PROMPT MATRIX",
    name: "Universal Prompt Matrix",
    path: "/prompt-matrix",
    icon: "Layers",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
    badge: "FLAGSHIP",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    featured: true,
    category: "google-flow",
    description: "Satu konsep, empat dialek AI sekaligus: Google Flow (Veo/Imagen 3), Midjourney v6.1 (--ar & parameter), Kling AI, dan Claude 3.5 Sonnet secara simultan.",
    samples: [
      "Konversi konsep produk komersial ke 4 format AI dalam 1 klik",
      "Sinkronisasi parameter teknis prompt visual dan video"
    ]
  },
  {
    id: "viral-hook",
    tool_key: "viral-hook",
    title: "VIRAL HOOK & RETENTION LAB",
    name: "Viral Hook & Retention Lab",
    path: "/viral-hook",
    icon: "Flame",
    color: "text-rose-400",
    iconBg: "bg-rose-500/15",
    badge: "HOT",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    featured: true,
    category: "commerce-growth",
    description: "Formula hook 3 detik penahan scroll berbasis psikologi audiens: Curiosity Gap, Pattern Interrupt, dan Visual Staging untuk TikTok & Reels.",
    samples: [
      "Hook provokatif untuk produk skincare anti-penuaan",
      "Pattern interrupt pembuka video kuliner viral"
    ]
  },

  // --- CORE REVERSE-ENGINEERING & VISUAL FOUNDRY ---
  {
    id: "gambar",
    tool_key: "gambar",
    title: "ULTRA-REALISM VISUAL FOUNDRY",
    name: "Visual Prompt Foundry",
    path: "/gambar",
    icon: "Image",
    color: "text-amber-400",
    iconBg: "bg-amber-500/15",
    badge: "POPULAR",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    category: "visual-art",
    description: "Dekomposisi gambar referensi menjadi parameter optik nyata (focal length, sensor, lighting rig, color grading) untuk Google Imagen 3 & Midjourney.",
    samples: [
      "Ekstraksi lighting komersial studio 85mm f/1.4",
      "Bedah palet warna dan komposisi fine-art photography"
    ]
  },
  {
    id: "shortsvideo",
    tool_key: "shortsvideo",
    title: "SHORTS VIDEO CINEMATICS",
    name: "Shorts Video Cinematics",
    path: "/shortsvideo",
    icon: "Camera",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    badge: "LIVE",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    category: "cinematic-video",
    description: "Transformasikan klip video pendek menjadi prompt sutradara terstruktur: aksi temporal, pergerakan kamera dolly/pan, dan pencahayaan dinamis di Google Veo.",
    samples: [
      "Prompt video stop-motion kerajinan tangan DIY",
      "Cinematic motion blur transisi produk premium"
    ]
  },
  {
    id: "longvideo",
    tool_key: "longvideo",
    title: "EPIC NARRATIVE VIDEO SCENE",
    name: "Narrative Video Sequencer",
    path: "/longvideo",
    icon: "Film",
    color: "text-blue-400",
    iconBg: "bg-blue-500/15",
    badge: "PRO",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    category: "cinematic-video",
    description: "Pecah rekaman video panjang menjadi rangkaian naskah scene sinematik berkelanjutan (Opening, Tension, Climax, Resolution) untuk Google Veo & Runway.",
    samples: [
      "Rangkaian scene dokumenter otomotif 4K",
      "Transisi sinematik lanskap alam pegunungan"
    ]
  },
  {
    id: "storyboard",
    tool_key: "storyboard",
    title: "COMMERCE STORYBOARD ARCHITECT",
    name: "Storyboard Video Commerce",
    path: "/storyboard",
    icon: "Clapperboard",
    color: "text-purple-400",
    iconBg: "bg-purple-500/15",
    badge: "CONVERSION",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    category: "commerce-growth",
    description: "Blueprint storyboard 3-beat siap syuting untuk affiliator TikTok Shop & Shopee Video: visual direction, naskah voiceover, on-screen text, hingga CTA.",
    samples: [
      "Script 15 detik Kopi Susu Creamy penahan scroll",
      "Storyboard serum glowing 5 hari tanpa lengket"
    ]
  },
  {
    id: "poster-infografis",
    tool_key: "poster-infografis",
    title: "INFOGRAPHIC & BRAND SYSTEMS",
    name: "Infografis 20-Poin Studio",
    path: "/poster-infografis",
    icon: "LayoutGrid",
    color: "text-teal-400",
    iconBg: "bg-teal-500/15",
    badge: "20-POINT",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    category: "visual-art",
    description: "Format visual 20-poin teruji untuk menghasilkan poster infografis edukatif, perbandingan produk, dan konten viral media sosial dengan layout presisi.",
    samples: [
      "Infografis strategi manajemen finansial",
      "Poster tips kesehatan & wellness modern"
    ]
  },
  {
    id: "sales-page",
    tool_key: "sales-page",
    title: "HIGH-CONVERTING SALES COPY",
    name: "Sales Copy Architect",
    path: "/sales-page",
    icon: "ShoppingBag",
    color: "text-yellow-400",
    iconBg: "bg-yellow-500/15",
    badge: "COPYWRITING",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    category: "commerce-growth",
    description: "Struktur landing page 16 bagian berorientasi omzet: headline tajam, problem agitation, solusi tanpa klaim palsu, FAQ, dan penawaran tak tertolak.",
    samples: [
      "Sales page digital course Google Flow Masterclass",
      "Landing page produk perawatan tubuh premium"
    ]
  },
  {
    id: "style-detection",
    tool_key: "style-detection",
    title: "STYLE & LIGHTING DECONSTRUCTOR",
    name: "Style & Lighting Scanner",
    path: "/style-detection",
    icon: "Wand2",
    color: "text-violet-400",
    iconBg: "bg-violet-500/15",
    badge: "AI SCAN",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    category: "visual-art",
    description: "Pindai lighting rig, lensa, sudut pandang, palet warna HEX, dan mesin render dari visual referensi, lalu sintesis prompt replikasi dengan slider kemiripan.",
    samples: [
      "Deteksi aesthetic editorial fashion Milan",
      "Pencahayaan dramatis chiaroscuro 3D Octane"
    ]
  },
  {
    id: "prompt-optimizer",
    tool_key: "prompt-optimizer",
    title: "MASTER PROMPT REFINERY",
    name: "Prompt Optimizer Studio",
    path: "/prompt-optimizer",
    icon: "Sparkles",
    color: "text-sky-400",
    iconBg: "bg-sky-500/15",
    badge: "ENHANCER",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    category: "google-flow",
    description: "Tingkatkan prompt mentah menjadi instruksi AI tingkat produksi: persona mendalam, batasan tegas, konteks latar, dan spesifikasi format yang presisi.",
    samples: [
      "Refining prompt ide konten YouTube berdurasi panjang",
      "Optimasi prompt presentasi pitch deck investor"
    ]
  },
  {
    id: "prompt-to-image",
    tool_key: "prompt-to-image",
    title: "IMAGEN 3 & FLUX VISUALIZER",
    name: "Prompt to Image Foundry",
    path: "/prompt-to-image",
    icon: "Palette",
    color: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500/15",
    badge: "STUDIO",
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    category: "visual-art",
    description: "Workspace teks-ke-gambar teroptimasi dengan preset Google Flow Imagen 3, FLUX.1, dan Midjourney dalam rasio 1:1, 9:16, 16:9, dan 4:5.",
    samples: [
      "Iklan produk 3D melayang dengan neon rim light",
      "Ilustrasi kopi minimalis resolusi 8K"
    ]
  },
  {
    id: "coloring-book-prompt",
    tool_key: "coloring-book-prompt",
    title: "PRINTABLE BOOK CREATOR",
    name: "Buku Mewarnai Printable",
    path: "/coloring-book-prompt",
    icon: "BookOpen",
    color: "text-pink-400",
    iconBg: "bg-pink-500/15",
    badge: "KDP READY",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    category: "interactive-lab",
    description: "Hasilkan buku mewarnai anak 10–16 halaman dalam satu berkas HTML siap cetak/unduh PDF (@media print) untuk bisnis cetak mandiri atau Amazon KDP.",
    samples: [
      "Buku mewarnai hewan purba lucu untuk PAUD",
      "Seri eksplorasi antariksa anak SD"
    ]
  },
  {
    id: "game-prompt",
    tool_key: "game-prompt",
    title: "INTERACTIVE HTML5 GAME LAB",
    name: "Game Canvas Interaktif",
    path: "/game-prompt",
    icon: "Gamepad2",
    color: "text-lime-400",
    iconBg: "bg-lime-500/15",
    badge: "CANVAS",
    badgeColor: "bg-lime-500/20 text-lime-300 border-lime-500/30",
    category: "interactive-lab",
    description: "Buat mini-game interaktif anak dalam satu file HTML/CSS/JS utuh tanpa dependensi, langsung bisa dimainkan di browser atau Gemini Canvas.",
    samples: [
      "Game memori kartu suara binatang",
      "Tebak warna & bentuk ceria ramah sentuhan"
    ]
  }
];
