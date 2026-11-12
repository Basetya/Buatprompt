// ============================================================================
// BUATPROMPT AIR-GAP KNOWLEDGE VAULT (LOCAL INTELLIGENCE BANK)
// ============================================================================
// Knowledge base lokal terdistilasi untuk sintesis konten deterministik berbobot tinggi.
// Bekerja 100% offline tanpa perlu koneksi API, menyediakan fakta riil, kutipan
// legendaris barat & timur, prinsip psikologi, dan data industri.
// ============================================================================

export interface VaultQuote {
  quote: string;
  author: string;
  concept: string;
}

export interface DomainVault {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  authorityFacts: string[];
  legendaryQuotes: VaultQuote[];
  psychologicalHooks: string[];
  actionSolutions: string[];
  ctaLoops: string[];
}

export const KNOWLEDGE_VAULT: Record<string, DomainVault> = {
  // 1. MOTIVASI, FILSAFAT & STOICISM (BARAT & TIMUR)
  stoic_motivation: {
    id: "stoic_motivation",
    name: "Motivasi & Stoic Wisdom",
    badge: "🏛️ FILSAFAT BARAT & TIMUR",
    tagline: "Kutipan klasik Marcus Aurelius, Seneca, Sun Tzu, Lao Tzu, dan psikologi disiplin modern.",
    authorityFacts: [
      "Hukum Dopamin: Kesenangan instan merusak fokus otak selama 72 jam ke depan.",
      "Prinsip Kaizen Jepang: Perbaikan 1% setiap hari menghasilkan peningkatan 37x lipat dalam setahun.",
      "Studi Deep Work: Butuh 23 menit bagi otak manusia untuk kembali fokus setelah 1 kali distraksi notifikasi.",
      "Konsep Amor Fati: Mencintai setiap kesulitan sebagai bahan bakar kematangan mental."
    ],
    legendaryQuotes: [
      {
        quote: "Bukan kesulitan yang membuat kita takut, tapi ketakutan kitalah yang membuat hal itu jadi sulit.",
        author: "Seneca (Filsuf Romawi)",
        concept: "Ketakutan Irasional"
      },
      {
        quote: "Kamu punya kuasa atas pikiranmu, bukan kejadian di luar sana. Sadari ini, dan kamu akan menemukan kekuatan sejati.",
        author: "Marcus Aurelius (Kaisar Romawi)",
        concept: "Kendali Internal"
      },
      {
        quote: "Perjalanan seribu mil selalu dimulai dengan satu langkah pertama di bawah telapak kakimu.",
        author: "Lao Tzu (Tao Te Ching)",
        concept: "Konsistensi Awal"
      },
      {
        quote: "Kemenangan terbesar adalah menaklukkan ego dan hawa nafsum diri sendiri sebelum mengalahkan lawan.",
        author: "Sun Tzu (The Art of War)",
        concept: "Disiplin Diri"
      },
      {
        quote: "Kesabaran yang diiringi kerja terarah akan mengubah air yang tenang menjadi kekuatan yang mampu membelah batu.",
        author: "Pepatah Kuno Timur",
        concept: "Daya Tahan"
      },
      {
        quote: "Disiplin adalah memilih antara apa yang kamu inginkan sekarang vs apa yang paling kamu inginkan nanti.",
        author: "Prinsip Stoic Modern",
        concept: "Prioritas Waktu"
      }
    ],
    psychologicalHooks: [
      "STOP SCROLL! BACA INI SEBELUM HARI INI BERAKHIR",
      "KENAPA KAMU SELALU MENUNDA HAL PALING PENTING?",
      "SENJATA RAHASIA PARA KAISAR WAKTU MENGHADAPI STRES",
      "BUKAN KURANG WAKTU, TAPI ENERGI KAMU YANG BOCOR"
    ],
    actionSolutions: [
      "Terapkan Aturan 2 Menit hari ini: Jika butuh kurang dari 2 menit, kerjakan detik ini juga tanpa tunda.",
      "Jadwalkan 90 menit Deep Work setiap pagi tanpa ponsel. Produktivitasmu akan melonjak 300%.",
      "Praktekkan Memento Mori: Ingat bahwa energimu terbatas, berhentilah mengurusi hal sepele yang tidak bermakna.",
      "Kendalikan apa yang di dalam kuasamu, ikhlaskan apa yang di luar kendalimu. Pikiranmu akan langsung tenang."
    ],
    ctaLoops: [
      "Simpan pesan ini untuk kamu baca lagi besok pagi... Dan kamu akan mengerti kenapa...",
      "Save video ini agar kamu punya pengingat saat mulai merasa malas... Karena seperti kata orang bijak...",
      "Bagikan ke satu orang yang lagi berjuang hari ini... Dan tanyakan ke mereka..."
    ]
  },

  // 2. FINANSIAL, INVESTASI & WEALTH MASTERY
  financial_wealth: {
    id: "financial_wealth",
    name: "Finansial & Wealth Mastery",
    badge: "📈 KEUANGAN & INVESTASI",
    tagline: "Kaidah riil akuntansi personal, compound interest, psikologi uang, dan portofolio sehat.",
    authorityFacts: [
      "Hukum Compound Interest Einstein: Bunga majemuk adalah keajaiban dunia ke-8. Yang paham akan menuai, yang tidak paham akan membayar.",
      "Lifestyle Inflation Trap: Kenaikan gaji tanpa sistem otomatisasi selalu terserap 100% oleh pengeluaran baru.",
      "Kaidah 50/30/20 Elizabeth Warren: 50% kebutuhan pokok, 30% keinginan, 20% tabungan masa depan dan investasi.",
      "Emergency Buffer Rule: Minimal 3 hingga 6 bulan pengeluaran rutin wajib tersimpan di instrumen likuid bebas risiko."
    ],
    legendaryQuotes: [
      {
        quote: "Jangan menabung apa yang tersisa setelah belanja, tapi belanjakan apa yang tersisa setelah menabung.",
        author: "Warren Buffett",
        concept: "Pay Yourself First"
      },
      {
        quote: "Banyak orang membeli barang yang tidak mereka butuhkan, dengan uang yang tidak mereka miliki, untuk memukau orang yang tidak mereka sukai.",
        author: "Will Rogers / Dave Ramsey",
        concept: "Perangkap Gengsi"
      },
      {
        quote: "Kekayaan sejati bukanlah seberapa banyak uang yang kamu pamerkan, tapi seberapa banyak pilihan hidup dan kebebasan waktu yang kamu miliki.",
        author: "Morgan Housel (The Psychology of Money)",
        concept: "Kebebasan Waktu"
      }
    ],
    psychologicalHooks: [
      "KENAPA GAJI BERAPAPUN SELALU HABIS DI TANGGAL 10?",
      "3 BOCOR HALUS KEUANGAN YANG BIKIN SUSAH KAYA",
      "JANGAN PERNAH SIMPAN SELURUH TABUNGAN DI SATU REKENING",
      "ATURAN GAJI 3 JUTA BIAR TETAP PUNYA DANA DARURAT"
    ],
    actionSolutions: [
      "Buka 3 rekening terpisah: Rekening operasional, rekening senang-senang, dan rekening investasi tanpa kartu debit fisik.",
      "Autodebet 20% gaji di detik pertama gajian masuk. Anggap uang itu tidak pernah ada di dompetmu.",
      "Terapkan Aturan 72 Jam sebelum beli barang non-primer. Seringkali keinginan itu hilang dengan sendirinya.",
      "Investasikan pada instrumen indeks pasar yang terbukti puluhan tahun mengalahkan laju inflasi."
    ],
    ctaLoops: [
      "Simpan video ini biar rekeningmu nggak bocor lagi bulan depan... Karena kalau kamu hitung ulang...",
      "Save panduan ini sebelum kamu belanja di tanggal kembar nanti... Dan ingat rahasianya..."
    ]
  },

  // 3. E-COMMERCE, AFFILIATE & PERSUASION PSYCHOLOGY
  affiliate_conversion: {
    id: "affiliate_conversion",
    name: "Affiliate & Conversion Psychology",
    badge: "💼 PSIKOLOGI PENJUALAN",
    tagline: "Prinsip persuasi Robert Cialdini, story-selling, etika urgensi, dan konversi tinggi.",
    authorityFacts: [
      "Prinsip Cialdini (Social Proof): 88% calon pembeli membaca ulasan orang lain sebelum memutuskan checkout.",
      "Prinsip Loss Aversion (Kahneman): Rasa takut kehilangan promo bernilai 2x lebih kuat daripada harapan mendapatkan hadiah.",
      "Hukum 3 Detik Video E-Commerce: Hook visual produk harus menjawab 'Apa untungnya buat saya?' sebelum detik ke-4.",
      "Story-Selling vs Hard-Selling: Konten berbasis cerita memiliki tingkat closing 400% lebih tinggi dibanding sekadar sebar link."
    ],
    legendaryQuotes: [
      {
        quote: "Orang tidak suka dijualin, tapi mereka sangat suka membeli saat mereka merasa itu keputusan cerdas mereka sendiri.",
        author: "Jeffrey Gitomer",
        concept: "Keputusan Mandiri"
      },
      {
        quote: "Fokuslah memecahkan masalah konsumen, maka uang akan menjadi produk sampingan yang mengejarmu.",
        author: "Zig Ziglar",
        concept: "Solusi Nyata"
      }
    ],
    psychologicalHooks: [
      "STOP SCROLL! KENAPA PROMOSI AFFILIATE KAMU MASIH SEPI?",
      "JANGAN PERNAH SPAM LINK SEBELUM BIKIN PENONTON RELATE",
      "RAHASIA AFFILIATE PEMULA TEMBUS 10 JUTA PERTAMA",
      "TRIK STORY-SELLING YANG BIKIN ORANG CHECKOUT SUKARELA"
    ],
    actionSolutions: [
      "Mulai dengan menceritakan momen frustrasi pribadimu, lalu tunjukkan produk ini sebagai penyelamat.",
      "Soroti satu fitur paling solutif dengan demonstrasi visual jarak dekat (macro b-roll).",
      "Berikan alasan logis kenapa harga promo hari ini sangat menguntungkan dibanding kerugian jika menunda.",
      "Arahkan tindakan jelas ke keranjang kuning atau link di bio dengan instruksi satu langkah sederhana."
    ],
    ctaLoops: [
      "Klik link di bio dan simpan video ini sekarang juga... Biar besok kamu bisa langsung praktekkan..."
    ]
  },

  // 4. KULINER, KOPI & F&B CRAFT
  culinary_coffee: {
    id: "culinary_coffee",
    name: "Kuliner & Kopi Craft",
    badge: "☕ FISIKA EKSTRAKSI & RASA",
    tagline: "Fisika ekstraksi TDS, suhu presisi 90°C, degassing CO2 blooming, dan rasio emas seduhan.",
    authorityFacts: [
      "Suhu Air Ideal: Air 100°C membakar minyak volatil kopi. Suhu optimal pour-over adalah 88°C–92°C.",
      "Fase Blooming: 45 detik pertama pelepasan gas CO2 menentukan 60% kemanisan dan profil rasa cangkir.",
      "Rasio Emas Seduhan: Rasio 1:15 (1 gram kopi untuk 15ml air) menghasilkan ekstraksi seimbang 18–22% TDS.",
      "Reaksi Maillard & Karamelisasi: Biji sangrai medium menyimpan aroma floral dan asam buah alami yang segar."
    ],
    legendaryQuotes: [
      {
        quote: "Menyeduh kopi yang luar biasa bukanlah sihir, melainkan pemahaman fisika air, waktu kontak, dan penghormatan pada biji.",
        author: "James Hoffmann (World Barista Champion)",
        concept: "Fisika Seduhan"
      }
    ],
    psychologicalHooks: [
      "RAHASIA KOPI SEENAK CAFE TANPA PERLU MESIN MAHAL",
      "KENAPA KOPI RUMAHAN KAMU SERING ASAM DAN SEPET?",
      "JANGAN PERNAH SEDUH KOPI PAKAI AIR MENDIDIH 100°C",
      "TRIK BARISTA 45 DETIK BIAR KOPI MANIS ALAMI"
    ],
    actionSolutions: [
      "Tunggu air mendidih turun selama 1 menit agar suhunya mencapai 90 derajat sebelum dituangkan.",
      "Lakukan blooming dengan menuang air 2x berat kopi, diamkan 45 detik hingga gelembung gas habis.",
      "Tuang air perlahan dengan gerakan spiral lembut tanpa menyentuh dinding kertas filter.",
      "Gunakan air mineral dengan TDS 75–150 ppm untuk mengeluarkan rasa manis biji secara maksimal."
    ],
    ctaLoops: [
      "Simpan resep ini sebelum kamu nyeduh kopi pagi besok... Karena kalau kamu coba sekali saja..."
    ]
  },

  // 5. SKINCARE & BEAUTY SCIENCE
  skincare_beauty: {
    id: "skincare_beauty",
    name: "Skincare & Beauty Science",
    badge: "✨ DERMATOLOGI & KULIT",
    tagline: "Sains skin barrier, metode sandwich retinol, hidrasi trans-epidermal, dan perlindungan seluler.",
    authorityFacts: [
      "Skin Barrier Function: Stratum korneum adalah benteng lipid pelindung. Jika rusak, bakteri mudah memicu jerawat inflamasi.",
      "Metode Sandwich Retinol: Mengapit bahan aktif di antara dua lapis pelembab mengurangi risiko iritasi hingga 75%.",
      "Transepidermal Water Loss (TEWL): Kulit kehilangan hidrasi tertinggi saat tidur malam hari jika tidak dikunci occlusive.",
      "Aturan Broad-Spectrum SPF: Sinar UV-A menembus kaca jendela dan menyebabkan 80% penuaan dini tanpa disadari."
    ],
    legendaryQuotes: [
      {
        quote: "Kulit sehat tidak membutuhkan 10 langkah rumit, kulit sehat membutuhkan konsistensi perlindungan dan hidrasi yang tepat.",
        author: "Prinsip Dermatologi Modern",
        concept: "Minimalis Efektif"
      }
    ],
    psychologicalHooks: [
      "STOP PAKAI RETINOL KALAU MASIH BIKIN PURGING PARAH",
      "KULIT RUSAK BUKAN KARENA KURANG PRODUK MAHAL",
      "KESALAHAN CUCI MUKA YANG BIKIN SKIN BARRIER HANCUR",
      "CARA BIKIN KULIT GLOWING TANPA BIKIN KANTONG JEBOL"
    ],
    actionSolutions: [
      "Gunakan metode sandwich: Oles pelembab tipis, beri setetes retinol, lalu kunci dengan ceramide tebal.",
      "Hentikan semua eksfoliasi kimiawi saat kulit perih, fokus 7 hari hanya ke pelembab dan tabir surya.",
      "Cuci muka maksimal 60 detik dengan pembersih ber-pH seimbang 5.5 untuk menjaga minyak alami pelindung.",
      "Selalu gunakan sunscreen seukuran dua jari setiap pagi tanpa terlewat meski di dalam ruangan."
    ],
    ctaLoops: [
      "Simpan panduan ini untuk rutinitas skincare malammu nanti... Dan lihat perubahannya dalam 7 hari..."
    ]
  },

  // 6. TECH, GADGET, AI & PRODUCTIVITY
  tech_productivity: {
    id: "tech_productivity",
    name: "Tech, Gadget & Productivity",
    badge: "⚡ TEKNOLOGI & PROSES CERDAS",
    tagline: "Hukum Pareto 80/20, Parkinson's Law, pemilihan gadget value-for-money, dan otomasi kerja cerdas.",
    authorityFacts: [
      "Hukum Pareto 80/20: 80% hasil kerjamu berasal dari 20% tindakan penting yang kamu eksekusi tanpa kompromi.",
      "Hukum Parkinson: Suatu pekerjaan akan memakan waktu sebanyak waktu yang dialokasikan. Persingkat deadline, fokus meningkat.",
      "Diminishing Returns Gadget: Performa HP 15 juta vs HP 4 juta untuk tugas harian hanya berbeda 8% dalam kenyamanan riil.",
      "Second Brain Methodology (Tiago Forte): Otak manusia dirancang untuk melahirkan ide, bukan untuk menyimpannya."
    ],
    legendaryQuotes: [
      {
        quote: "Kesederhanaan adalah kecanggihan tertinggi.",
        author: "Leonardo da Vinci / Steve Jobs",
        concept: "Kesederhanaan Canggih"
      },
      {
        quote: "Fokus bukanlah tentang mengatakan ya pada hal yang kamu sukai, fokus adalah menolak ratusan ide bagus lainnya.",
        author: "Steve Jobs",
        concept: "Kekuatan Menolak"
      }
    ],
    psychologicalHooks: [
      "JANGAN BELI HP MAHAL KALAU CUMA BUAT SCROLL MEDSOS",
      "3 FITUR GADGET YANG SEBENARNYA CUMA GIMMICK IKLAN",
      "HENTIKAN KERJA LEMBUR DENGAN OTOMASI 1 LANGKAH INI",
      "CARA ORANG CERDAS MENGHEMAT 8 JUTA SAAT GANTI HP"
    ],
    actionSolutions: [
      "Pilih chipset mid-range dengan fabrikasi 4nm efisien: baterai awet seharian dan bodi tetap dingin.",
      "Otomatisasi tugas berulang dengan shortcut dan template. Selamatkan minimal 2 jam kerjamu setiap hari.",
      "Prioritaskan layar AMOLED 120Hz dan kecepatan charging 67W daripada megapiksel kamera gimmick.",
      "Terapkan aturan 'Satu Masuk, Satu Keluar': Jangan beli gadget baru sebelum menjual atau menghibahkan yang lama."
    ],
    ctaLoops: [
      "Simpan trik ini sebelum kamu tergiur promo gadget baru... Karena pilihan cerdas adalah..."
    ]
  }
};

/**
 * Membangun vault netral khusus topik pengguna ketika topik berada di luar 6 vault spesifik.
 * Mencegah pencampuran fakta dari domain lain (misalnya Marcus Aurelius/diminishing return masuk ke topik umum).
 */
export function buildUniversalTopicVault(topic: string): DomainVault {
  const cleanTopic = topic.trim() || "Topik Ini";
  const shortTopic = cleanTopic.length > 42 ? cleanTopic.slice(0, 42).trim() + "..." : cleanTopic;

  return {
    id: "universal_topic",
    name: `Topik Khusus: ${shortTopic}`,
    tagline: `Sintesis naskah murni mengikuti konteks "${shortTopic}" tanpa mencampur domain lain.`,
    badge: "Topic-Pure Synthesis",
    legendaryQuotes: [
      {
        quote: "Hasil besar selalu lahir dari pemahaman dasar yang benar, bukan dari menebak-nebak.",
        author: "Prinsip Praktisi",
        concept: "Fundamental Mastery",
      },
      {
        quote: "Konsistensi pada langkah kecil yang tepat jauh lebih berdampak daripada usaha besar yang salah arah.",
        author: "Kaidah Eksekusi",
        concept: "Structured Execution",
      },
    ],
    authorityFacts: [
      `Sebagian besar kegagalan dalam ${shortTopic} terjadi karena melewatkan langkah fundamental di awal.`,
      `Banyak orang hanya meniru permukaan dari ${shortTopic} tanpa memahami alasan di balik setiap tahapannya.`,
    ],
    psychologicalHooks: [
      `JANGAN ASAL COBA! INI RAHASIA ${shortTopic.toUpperCase()} YANG JARANG DIBAHAS`,
      `KENAPA BANYAK YANG GAGAL SAAT PRAKTEK ${shortTopic.toUpperCase()}?`,
      `TERNYATA INI KUNCI UTAMA ${shortTopic.toUpperCase()} AGAR HASILNYA MAKSIMAL`,
    ],
    actionSolutions: [
      `Mulai dari fondasi paling sederhana pada ${shortTopic}, ukur hasilnya secara bertahap, lalu rapikan detailnya.`,
      `Gunakan pola langkah yang terstruktur pada ${shortTopic} agar hasilnya stabil dan mudah diulang kapan saja.`,
    ],
    ctaLoops: [
      `Simpan video ini sebagai panduan praktis tentang ${shortTopic} supaya kamu tidak salah langkah lagi.`,
      `Bagikan video ini ke teman yang juga sedang mempelajari ${shortTopic} biar sama-sama paham intinya.`,
    ],
  };
}

/**
 * Mengambil domain vault yang cocok berdasarkan input teks atau ID vault.
 * Jika textOrId adalah "auto" atau kosong, selalu memprioritaskan topicHint.
 */
export function matchDomainVault(textOrId: string, topicHint?: string): DomainVault {
  const raw = (textOrId || "").toLowerCase().trim();
  const target = raw === "auto" || !raw ? (topicHint || "").toLowerCase().trim() : raw;

  // Direct ID match
  if (KNOWLEDGE_VAULT[target]) {
    return KNOWLEDGE_VAULT[target];
  }

  // Semantic keyword mapping
  if (target.includes("kopi") || target.includes("coffee") || target.includes("barista") || target.includes("seduh") || target.includes("espresso") || target.includes("v60") || target.includes("kuliner") || target.includes("masak") || target.includes("resep")) {
    return KNOWLEDGE_VAULT.culinary_coffee;
  }
  if (target.includes("gaji") || target.includes("uang") || target.includes("tabung") || target.includes("investasi") || target.includes("saham") || target.includes("finansial") || target.includes("kaya") || target.includes("hemat") || target.includes("rekening")) {
    return KNOWLEDGE_VAULT.financial_wealth;
  }
  if (target.includes("affiliate") || target.includes("komisi") || target.includes("jualan") || target.includes("closing") || target.includes("shopee") || target.includes("tiktok shop") || target.includes("omset")) {
    return KNOWLEDGE_VAULT.affiliate_conversion;
  }
  if (target.includes("skincare") || target.includes("kulit") || target.includes("jerawat") || target.includes("retinol") || target.includes("glowing") || target.includes("wajah") || target.includes("beauty")) {
    return KNOWLEDGE_VAULT.skincare_beauty;
  }
  if (target.includes("gadget") || target.includes("hp") || target.includes("iphone") || target.includes("android") || target.includes("laptop") || target.includes("tech") || target.includes("ai") || target.includes("software")) {
    return KNOWLEDGE_VAULT.tech_productivity;
  }
  if (target.includes("stoic") || target.includes("motivasi") || target.includes("filsafat") || target.includes("bijak") || target.includes("disiplin") || target.includes("fokus") || target.includes("mental")) {
    return KNOWLEDGE_VAULT.stoic_motivation;
  }

  // Fallback netral sesuai topik asli (tidak mencampur domain lain!)
  return buildUniversalTopicVault(topicHint || textOrId);
}

/**
 * Menghitung seed variasi kombinasi (Combinatorial Permutation) dari string
 * Menjamin variasi kreatif yang deterministik dan konsisten per input atau variasi indeks
 */
export function getCombinatorialSeed(str: string, variantOffset: number = 0): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash + variantOffset);
}

