export interface ToolItem {
  id: string;
  tool_key: string;
  title: string;
  name: string;
  path: string;
  description: string;
  badge?: string;
  icon: string;
  color: string;
  iconBg: string;
  featured?: boolean;
  samples?: string[];
}

export const ALL_TOOLS: ToolItem[] = [
  {
    id: "gambar",
    tool_key: "gambar",
    title: "CARI PROMPT GAMBAR",
    name: "Cari Prompt Gambar",
    path: "/gambar",
    icon: "Image",
    color: "text-orange-400",
    iconBg: "bg-orange-500/10",
    description: "Unggah gambar apa pun, AI akan mengekstraksi komposisi, gaya, lighting, warna & keyword untuk Google Flow (Imagen 3), Midjourney, ChatGPT, Gemini, dan Claude.",
    badge: "POPULAR",
    samples: [
      "Jelaskan cara memakai Cari Prompt Gambar",
      "Saya mau membuat prompt gambar anime dari foto"
    ]
  },
  {
    id: "shortsvideo",
    tool_key: "shortsvideo",
    title: "SHORTS VIDEO PROMPT",
    name: "Shorts Video Prompt",
    path: "/shortsvideo",
    icon: "Video",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    description: "Analisis video pendek dan hasilkan prompt video sutradara sinematik untuk Google Flow (Veo), Kling AI, Sora, dan Runway.",
    badge: "LIVE",
    samples: [
      "Prompt video perakitan kerajinan kertas",
      "Video cinematic transisi produk kopi"
    ]
  },
  {
    id: "longvideo",
    tool_key: "longvideo",
    title: "LONG VIDEO PROMPT",
    name: "Long Video Prompt",
    path: "/longvideo",
    icon: "Film",
    color: "text-blue-400",
    iconBg: "bg-blue-500/10",
    description: "Ekstraksi scene dari video durasi panjang menjadi prompt sinematik terperinci untuk Google Veo, Runway & film maker.",
    badge: "LIVE",
    samples: [
      "Ekstraksi scene drone cinematic pegunungan",
      "Scene-by-scene dokumenter mobil klasik"
    ]
  },
  {
    id: "storyboard",
    tool_key: "storyboard",
    title: "STORYBOARD PRODUK",
    name: "Storyboard Produk",
    path: "/storyboard",
    icon: "Clapperboard",
    color: "text-rose-400",
    iconBg: "bg-rose-500/10",
    description: "Upload foto produk, dapatkan storyboard 3-beat scene-by-scene untuk affiliator TikTok Shop & Shopee.",
    badge: "LIVE",
    samples: [
      "Storyboard affiliator serum wajah glowing",
      "Script 10 detik Kopi Susu kekinian"
    ]
  },
  {
    id: "poster-infografis",
    tool_key: "poster-infografis",
    title: "POSTER INFOGRAFIS",
    name: "Poster Infografis",
    path: "/poster-infografis",
    icon: "LayoutGrid",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    description: "Buat prompt poster infografis siap pakai untuk konten sosmed, marketing, dan UMKM — dengan format & layout 20-poin otomatis.",
    badge: "NEW",
    samples: [
      "Poster tips manajemen keuangan mahasiswa",
      "Infografis manfaat teh hijau untuk kesehatan"
    ]
  },
  {
    id: "sales-page",
    tool_key: "sales-page",
    title: "SALES PAGE GENERATOR",
    name: "Sales Page Generator",
    path: "/sales-page",
    icon: "ShoppingBag",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10",
    description: "Ubah info produk jadi sales page persuasif & berorientasi konversi — headline, benefit, USP, FAQ, hingga CTA.",
    badge: "NEW",
    samples: [
      "Sales page e-course digital marketing",
      "Landing page produk perawatan kulit herbal"
    ]
  },
  {
    id: "coloring-book-prompt",
    tool_key: "coloring-book-prompt",
    title: "BUKU MEWARNAI",
    name: "Buku Mewarnai",
    path: "/coloring-book-prompt",
    icon: "BookOpen",
    color: "text-yellow-400",
    iconBg: "bg-yellow-500/10",
    description: "Buat prompt buku mewarnai anak 10–16 halaman (cover berwarna + sketsa line-art tebal) siap cetak atau download PDF KDP.",
    badge: "NEW",
    samples: [
      "Buku mewarnai dinosaurus lucu untuk PAUD",
      "Buku mewarnai hewan bawah laut 10 halaman"
    ]
  },
  {
    id: "style-detection",
    tool_key: "style-detection",
    title: "STYLE DETECTION",
    name: "Style Detection",
    path: "/style-detection",
    icon: "Wand2",
    color: "text-purple-400",
    iconBg: "bg-purple-500/10",
    description: "Deteksi style, palet warna, lighting & kamera dari gambar apa pun, langsung jadi prompt siap replikasi.",
    badge: "LIVE",
    samples: [
      "Deteksi aesthetic cyberpunk neon Tokyo",
      "Deteksi lighting fotografi komersial studio"
    ]
  },
  {
    id: "game-prompt",
    tool_key: "game-prompt",
    title: "GAME INTERAKTIF",
    name: "Game Prompt",
    path: "/game-prompt",
    icon: "Gamepad2",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    description: "Buat prompt game interaktif untuk anak-anak, siap di copy ke Gemini Canvas, ChatGPT, Claude, atau Lovable.",
    badge: "LIVE",
    samples: [
      "Game tebak suara binatang interaktif",
      "Game memory match buah-buahan ceria"
    ]
  },
  {
    id: "prompt-optimizer",
    tool_key: "prompt-optimizer",
    title: "PROMPT OPTIMIZER",
    name: "Prompt Optimizer",
    path: "/prompt-optimizer",
    icon: "Sparkles",
    color: "text-teal-400",
    iconBg: "bg-teal-500/10",
    description: "Masukkan prompt sederhana, AI akan menganalisis kualitasnya lalu mengubahnya menjadi instruksi profesional siap digunakan di ChatGPT, Gemini, Claude, dan lainnya.",
    badge: "NEW",
    samples: [
      "Optimalkan prompt presentasi pitch deck",
      "Perbaiki instruksi copy iklan TikTok"
    ]
  },
  {
    id: "prompt-to-image",
    tool_key: "prompt-to-image",
    title: "PROMPT TO IMAGE",
    name: "Prompt to Image",
    path: "/prompt-to-image",
    icon: "Palette",
    color: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500/10",
    description: "Ubah teks menjadi gambar AI berkualitas tinggi — pilih target model Google Imagen 3, FLUX, atau Midjourney, rasio, dan resolusi.",
    badge: "NEW",
    samples: [
      "Buat gambar kucing astronot di bulan",
      "Ilustrasi poster kopi minimalis"
    ]
  }
];
