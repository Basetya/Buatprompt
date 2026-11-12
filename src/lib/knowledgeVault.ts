// ============================================================================
// BUATPROMPT STUDIO KNOWLEDGE BANK
// ============================================================================
// Bank pengetahuan terkurasi untuk sintesis naskah konten berretensi tinggi
// across 16 niche populer media sosial.
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
  },

  // 7. KESEHATAN, DIET & FITNESS
  health_fitness: {
    id: "health_fitness",
    name: "Kesehatan, Diet & Fitness",
    badge: "💪 WELLNESS & BODY GOALS",
    tagline: "Sains metabolisme, defisit kalori berkelanjutan, tidur berkualitas, dan latihan otot.",
    authorityFacts: [
      "Kurang tidur di bawah 6 jam menaikkan hormon ghrelin (lapar) hingga 24% dan memperlambat pembakaran lemak.",
      "70% energi harian dibakar oleh metabolisme basal dan gerak ringan NEAT (jalan kaki), bukan cuma 1 jam di gym.",
      "Minum air 500ml sebelum makan terbukti membantu kontrol porsi secara alami tanpa rasa tersiksa."
    ],
    legendaryQuotes: [
      { quote: "Tubuhmu adalah satu-satunya tempat tinggal yang harus kamu rawat seumur hidup.", author: "Jim Rohn", concept: "Body Stewardship" },
      { quote: "Jangan mencari diet 2 minggu, bangunlah pola makan yang sanggup kamu jalani 2 tahun.", author: "Prinsip Nutrisi Modern", concept: "Sustainable Habits" }
    ],
    psychologicalHooks: [
      "SUDAH MAKAN DIKIT TAPI BERAT BADAN NGGAK TURUN? INI PENYEBABNYA",
      "STOP CARA DIET MENYIKSA! INI POLA BAKAR LEMAK YANG TERBUKTI",
      "3 KEBIASAAN PAGI YANG DIAM-DIAM MENGHANCURKAN METABOLISME"
    ],
    actionSolutions: [
      "Terapkan defisit kalori ringan 300-400 kkal per hari dengan protein cukup agar otot tetap terjaga.",
      "Targetkan 8.000 langkah kaki per hari ditambah latihan beban 3x seminggu selama 35 menit.",
      "Jaga jendela tidur konsisten 7-8 jam agar hormon pemulihan dan pembakaran lemak bekerja optimal."
    ],
    ctaLoops: [
      "Simpan panduan sehat ini untuk mulai besok pagi... Karena kesehatan adalah investasi terbaik..."
    ]
  },

  // 8. PARENTING & TUMBUH KEMBANG ANAK
  parenting_family: {
    id: "parenting_family",
    name: "Parenting & Tumbuh Kembang",
    badge: "👨‍👩‍👧 SMART PARENTING",
    tagline: "Pola asuh empatik, regulasi emosi anak, aturan gadget sehat, dan komunikasi keluarga.",
    authorityFacts: [
      "Anak usia 2-6 tahun meniru 80% respons emosional orang tuanya daripada sekadar mendengar nasihat lisan.",
      "Paparan layar berlebih sebelum tidur menekan melatonin dan menurunkan kualitas fokus belajar keesokan hari."
    ],
    legendaryQuotes: [
      { quote: "Anak-anak tidak pernah pandai mendengarkan orang tua, tapi mereka tidak pernah gagal meniru.", author: "James Baldwin", concept: "Modeling Behavior" },
      { quote: "Koneksi emosional harus selalu mendahului koreksi perilaku.", author: "Dr. Daniel Siegel", concept: "Connect Before Correct" }
    ],
    psychologicalHooks: [
      "ANAK SERING TANTRUM? COBA UBAH KALIMAT INI SAAT MENEGUR",
      "JANGAN ASAL KASIH HP! INI DAMPAKNYA PADA FOKUS ANAK USIA DINI",
      "3 CARA MEMBANGUN KEPERCAYAAN DIRI ANAK TANPA HARUS MEMANJAKAN"
    ],
    actionSolutions: [
      "Validasi perasaan anak terlebih dahulu ('Ibu tahu kamu kecewa'), baru ajak berdiskusi mencari solusi.",
      "Buat jadwal bebas layar 1 jam sebelum tidur dan ganti dengan sesi membaca buku cerita bersama."
    ],
    ctaLoops: [
      "Simpan video ini untuk dibagikan ke pasanganmu malam ini... Karena mendidik anak adalah perjalanan bersama..."
    ]
  },

  // 9. KARIER, CV & INTERVIEW KERJA
  career_interview: {
    id: "career_interview",
    name: "Karier, CV & Interview Kerja",
    badge: "💼 CAREER ACCELERATOR",
    tagline: "Lolos sistem ATS, teknik wawancara STAR, negosiasi gaji, dan personal branding profesional.",
    authorityFacts: [
      "Recruiter rata-rata hanya memindai CV selama 6-7 detik pertama sebelum memutuskan lanjut atau gugur.",
      "Lebih dari 75% perusahaan besar menyaring lamaran dengan sistem ATS berbasis kata kunci pencapaian."
    ],
    legendaryQuotes: [
      { quote: "Jangan hanya menceritakan tugas harianmu; tunjukkan dampak terukur yang kamu bawa.", author: "Prinsip HR Global", concept: "Impact-Driven Resume" },
      { quote: "Peluang besar datang saat persiapan bertemu dengan keberanian berbicara.", author: "Seneca", concept: "Preparedness" }
    ],
    psychologicalHooks: [
      "SUDAH KIRIM RATUSAN LAMARAN TAPI NGGAK DIPANGGIL? CEK CV KAMU",
      "JAWABAN CERDAS SAAT HRD TANYA 'BERAPA GAJI YANG KAMU HARAPKAN?'",
      "3 KESALAHAN FATAL SAAT INTERVIEW YANG BIKIN KANDIDAT PINTAR GUGUR"
    ],
    actionSolutions: [
      "Gunakan rumus angka dampak di CV: 'Meningkatkan efisiensi X sebesar 30%' alih-alih sekadar daftar tugas.",
      "Jawab pertanyaan perilaku dengan metode STAR (Situation, Task, Action, Result) dalam 90 detik."
    ],
    ctaLoops: [
      "Simpan tips karier ini sebelum jadwal interview berikutnya... Karena persiapan matang menentukan hasil..."
    ]
  },

  // 10. BISNIS, UMKM & JUALAN LARIS
  business_umkm: {
    id: "business_umkm",
    name: "Bisnis, UMKM & Jualan Laris",
    badge: "🏪 UMKM & GROWTH",
    tagline: "Manajemen margin profit, strategi repeat order, branding kemasan, dan kas bisnis sehat.",
    authorityFacts: [
      "Banyak UMKM bangkrut bukan karena sepi pembeli, melainkan karena omset besar tapi kas operasional tercampur uang pribadi.",
      "Mendapatkan pelanggan baru biayanya 5x lebih mahal dibandingkan menjaga pelanggan lama agar repeat order."
    ],
    legendaryQuotes: [
      { quote: "Omset adalah kebanggaan, profit adalah kewarasan, dan arus kas adalah nyawa bisnis.", author: "Prinsip Keuangan Bisnis", concept: "Cash is King" },
      { quote: "Orang tidak membeli produkmu; mereka membeli versi diri mereka yang lebih baik setelah memakainya.", author: "Seth Godin", concept: "Value Transformation" }
    ],
    psychologicalHooks: [
      "JUALAN RAMAI TAPI UANGNYA NGGAK PERNAH KUMPUL? INI BOCORNYA",
      "STOP BANTING HARGA! INI CARA NAIKKAN NILAI PRODUK BIAR LARIS",
      "3 STRATEGI BIKIN PEMBELI BALIK LAGI TANPA KELUAR BIAYA IKLAN"
    ],
    actionSolutions: [
      "Pisahkan rekening usaha dan pribadi sejak hari pertama, lalu hitung HPP lengkap termasuk biaya kemas dan iklan.",
      "Tambahkan kartu ucapan personal atau bonus kecil untuk mendorong testimoni dan pembelian ulang."
    ],
    ctaLoops: [
      "Simpan strategi bisnis ini untuk evaluasi usahamu minggu ini... Karena bisnis kuat dibangun dari sistem..."
    ]
  },

  // 11. EDUKASI, BELAJAR CEPAT & BAHASA
  education_study: {
    id: "education_study",
    name: "Edukasi, Belajar & Bahasa",
    badge: "📚 SMART LEARNING",
    tagline: "Active recall, spaced repetition, teknik Feynman, dan cara belajar cepat anti-lupa.",
    authorityFacts: [
      "Membaca ulang catatan berkali-kali hanya memberi ilusi paham; teknik Active Recall meningkatkan daya ingat hingga 2x lipat.",
      "Teknik Pomodoro (25 menit fokus penuh, 5 menit jeda) menjaga performa kognitif otak tanpa kelelahan mental."
    ],
    legendaryQuotes: [
      { quote: "Jika kamu belum bisa menjelaskannya dengan bahasa sederhana, berarti kamu belum benar-benar memahaminya.", author: "Richard Feynman", concept: "Feynman Technique" },
      { quote: "Belajar bukan soal berapa jam duduk, tapi seberapa aktif otak menguji dirinya sendiri.", author: "Sains Kognitif", concept: "Active Recall" }
    ],
    psychologicalHooks: [
      "BELAJAR BERJAM-JAM TAPI BESOKNYA LANGSUNG LUPA? GANTI CARANYA",
      "RAHASIA PAHAM MATERI SULIT DALAM 15 MENIT DENGAN TEKNIK FEYNMAN",
      "CARA KUASAI KOSAKATA BARU TANPA HAFALAN MEMBOSANKAN"
    ],
    actionSolutions: [
      "Tutup buku setelah membaca 1 bab, lalu tulis ulang poin utamanya dengan bahasamu sendiri dari ingatan.",
      "Ulangi materi pada hari ke-1, ke-3, ke-7, dan ke-21 (Spaced Repetition) agar terkunci di memori jangka panjang."
    ],
    ctaLoops: [
      "Simpan metode belajar ini untuk ujian atau skill barumu... Karena cara belajar yang tepat menghemat separuh waktu..."
    ]
  },

  // 12. OTOMOTIF, MOTOR & PERAWATAN HARIAN
  automotive_modif: {
    id: "automotive_modif",
    name: "Otomotif, Motor & Perawatan",
    badge: "🏍️ GARAGE & CARE",
    tagline: "Perawatan mesin awet, efisiensi BBM, cek komponen krusial, dan tips berkendara aman.",
    authorityFacts: [
      "Tekanan angin ban yang kurang 20% dapat membuat konsumsi BBM lebih boros hingga 10% dan ban cepat aus tidak merata.",
      "Menunda ganti oli melewati batas kilometer merusak lapisan pelindung silinder dan menurunkan kompresi mesin."
    ],
    legendaryQuotes: [
      { quote: "Merawat secara rutin jauh lebih murah daripada turun mesin di tengah jalan.", author: "Kaidah Mekanik", concept: "Preventive Maintenance" }
    ],
    psychologicalHooks: [
      "KENDARAAN TERASA BERAT DAN BOROS BBM? CEK 3 BAGIAN SEPELE INI",
      "JANGAN TUNGGU RUSAK! INI JADWAL PERAWATAN WAJIB BIAR MESIN AWET",
      "KESALAHAN HARIAN PENGENDARA YANG BIKIN KOMPONEN CEPAT AUS"
    ],
    actionSolutions: [
      "Cek tekanan angin ban minimal 2 minggu sekali dan ganti oli mesin tepat waktu sesuai spesifikasi pabrikan.",
      "Bersihkan filter udara secara berkala agar pembakaran mesin tetap bersih dan tarikan terasa ringan."
    ],
    ctaLoops: [
      "Simpan checklist otomotif ini sebelum servis berikutnya... Karena kendaraan terawat bikin perjalanan tenang..."
    ]
  },

  // 13. PROPERTI, RUMAH & DEKORASI INTERIOR
  property_interior: {
    id: "property_interior",
    name: "Properti, Rumah & Dekorasi",
    badge: "🏠 HOME & LIVING",
    tagline: "Tata ruang minimalis, pencahayaan estetik, tips KPR cerdas, dan renovasi hemat.",
    authorityFacts: [
      "Mengganti lampu putih dingin menjadi pencahayaan warm white berlapis (ambient + task light) langsung membuat ruangan terasa 2x lebih lega dan mewah.",
      "Memilih warna dinding netral terang memantulkan cahaya alami sehingga ruangan sempit terasa lebih lapang."
    ],
    legendaryQuotes: [
      { quote: "Rumah yang nyaman bukan soal luas meter perseginya, melainkan bagaimana cahaya dan fungsi ruang ditata.", author: "Prinsip Arsitektur Ruang", concept: "Spatial Harmony" }
    ],
    psychologicalHooks: [
      "RUMAH MUNGIL TERASA SEMPIT DAN SUMPEK? UBAH 3 HAL INI TANPA RENOVASI",
      "TRIK PENCAHAYAAN MURAH YANG BIKIN KAMAR TERASA SEPERTI HOTEL",
      "JANGAN ASAL AMBIL CICILAN RUMAH! HITUNG DULU RASIO AMAN INI"
    ],
    actionSolutions: [
      "Manfaatkan cermin besar di sisi berlawanan jendela dan pilih furnitur berkaki ramping agar lantai tetap terlihat.",
      "Pastikan cicilan properti maksimal 30% dari penghasilan bulanan dan siapkan dana darurat terpisah."
    ],
    ctaLoops: [
      "Simpan inspirasi ruang ini untuk proyek rumah impianmu... Karena detail kecil mengubah suasana..."
    ]
  },

  // 14. TRAVEL, LIBURAN & HIDDEN GEM
  travel_lifestyle: {
    id: "travel_lifestyle",
    name: "Travel, Liburan & Destinasi",
    badge: "✈️ SMART TRAVELER",
    tagline: "Itinerary hemat anti-boncos, trik packing efisien, dan persiapan perjalanan nyaman.",
    authorityFacts: [
      "Memesan tiket perjalanan dan penginapan di luar akhir pekan atau jauh hari dapat menghemat anggaran hingga 35%.",
      "Teknik menggulung pakaian dan memisahkan barang esensial di tas kabin mengurangi risiko barang tertinggal."
    ],
    legendaryQuotes: [
      { quote: "Perjalanan terbaik bukan yang paling mahal, melainkan yang paling siap dan penuh cerita.", author: "Etika Traveler", concept: "Mindful Travel" }
    ],
    psychologicalHooks: [
      "LIBURAN SERING OVERBUDGET? INI CARA SUSUN ITINERARY HEMAT TAPI PUAS",
      "3 BARANG WAJIB BAWA SAAT TRAVELING BIAR NGGAK PANIK DI JALAN",
      "TRIK PACKING RINGKAS 1 TAS UNTUK LIBURAN 5 HARI"
    ],
    actionSolutions: [
      "Kelompokkan destinasi dalam satu zona rute per hari agar tidak habis waktu dan ongkos di perjalanan.",
      "Gunakan teknik gulung pakaian dan simpan salinan dokumen penting secara offline di ponsel."
    ],
    ctaLoops: [
      "Simpan panduan liburan ini untuk rencana trip berikutnya... Karena liburan tenang dimulai dari persiapan..."
    ]
  },

  // 15. HUBUNGAN, KOMUNIKASI & PSIKOLOGI DIRI
  relationship_self: {
    id: "relationship_self",
    name: "Hubungan, Komunikasi & Psikologi",
    badge: "❤️ EMPATHY & BOUNDARIES",
    tagline: "Komunikasi sehat, batasan diri (boundaries), active listening, dan kecerdasan emosional.",
    authorityFacts: [
      "Dalam konflik hubungan, penggunaan kalimat 'Aku merasa...' jauh lebih efektif meredakan defensif dibanding menyalahkan dengan 'Kamu selalu...'.",
      "Menetapkan batasan sehat bukan bentuk keegoisan, melainkan cara menjaga energi agar hubungan bertahan jangka panjang."
    ],
    legendaryQuotes: [
      { quote: "Antara stimulus dan respons ada ruang jeda. Di ruang itulah kebebasan kita memilih sikap berada.", author: "Viktor Frankl", concept: "Emotional Space" }
    ],
    psychologicalHooks: [
      "SERING SALAH PAHAM SAAT DISKUSI? COBA UBAH POLA KOMUNIKASI INI",
      "TANDA HUBUNGAN SEHAT YANG JARANG DISADARI BANYAK ORANG",
      "CARA MENOLAK DENGAN SOPAN TANPA RASA BERSALAH"
    ],
    actionSolutions: [
      "Latih mendengarkan aktif tanpa langsung memotong pembicaraan, lalu ulangi inti pesan lawan bicara untuk memastikan sepaham.",
      "Katakan tidak dengan tegas namun hangat saat kapasitas waktumu memang sudah penuh."
    ],
    ctaLoops: [
      "Simpan pengingat hubungan sehat ini untuk dirimu hari ini... Karena komunikasi yang baik membangun ketenangan..."
    ]
  },

  // 16. PERTUMBUHAN KONTEN & SOSIAL MEDIA
  content_creator_growth: {
    id: "content_creator_growth",
    name: "Pertumbuhan Konten & Sosmed",
    badge: "🎬 CREATOR GROWTH",
    tagline: "Hook 3 detik pertama, retensi audiens, storytelling vertikal, dan konsistensi upload.",
    authorityFacts: [
      "65% penonton memutuskan lanjut menonton atau menggulir layar dalam 2,5 detik pertama video.",
      "Video dengan pergantian visual atau penekanan kata tiap 1,5 detik menjaga tingkat retensi hingga 2x lebih tinggi."
    ],
    legendaryQuotes: [
      { quote: "Jangan buat konten untuk semua orang; buatlah pesan tajam yang terasa sangat relevan bagi satu tipe penonton.", author: "Prinsip Kreator Digital", concept: "Audience Resonance" }
    ],
    psychologicalHooks: [
      "VIEWS MENTOK DI RATUSAN PADAHAL EDITING SUDAH LAMA? CEK 3 DETIK AWAL",
      "FORMULA HOOK YANG BIKIN PENONTON BERHENTI SCROLLING SEKETIKA",
      "CARA BIKIN VIDEO PENDEK YANG RAPI DAN NGGAK MEMBOSANKAN"
    ],
    actionSolutions: [
      "Mulai langsung dengan masalah atau pertanyaan spesifik di kalimat pertama tanpa basa-basi salam pembuka panjang.",
      "Pastikan teks di layar besar, kontras tinggi, dan bergerak selaras dengan suara narator."
    ],
    ctaLoops: [
      "Simpan formula kreator ini untuk video upload berikutnya... Karena konsistensi dan evaluasi mengalahkan keberuntungan..."
    ]
  }
};

/**
 * Membangun vault netral khusus topik pengguna ketika topik berada di luar 16 preset spesifik.
 * Mencegah pencampuran fakta dari domain lain masuk ke topik yang tidak berhubungan.
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

  // Semantic keyword mapping across all 16 social media niches
  if (target.includes("kopi") || target.includes("coffee") || target.includes("barista") || target.includes("seduh") || target.includes("espresso") || target.includes("v60") || target.includes("kuliner") || target.includes("masak") || target.includes("resep") || target.includes("makanan")) {
    return KNOWLEDGE_VAULT.culinary_coffee;
  }
  if (target.includes("diet") || target.includes("olahraga") || target.includes("gym") || target.includes("fitness") || target.includes("sehat") || target.includes("kalori") || target.includes("tidur") || target.includes("lemak") || target.includes("kurus") || target.includes("otot")) {
    return KNOWLEDGE_VAULT.health_fitness;
  }
  if (target.includes("anak") || target.includes("parenting") || target.includes("bayi") || target.includes("balita") || target.includes("tantrum") || target.includes("keluarga") || target.includes("ibu") || target.includes("ayah")) {
    return KNOWLEDGE_VAULT.parenting_family;
  }
  if (target.includes("kerja") || target.includes("cv") || target.includes("interview") || target.includes("wawancara") || target.includes("karier") || target.includes("karir") || target.includes("lamaran") || target.includes("hrd") || target.includes("loker")) {
    return KNOWLEDGE_VAULT.career_interview;
  }
  if (target.includes("umkm") || target.includes("bisnis") || target.includes("usaha") || target.includes("dagang") || target.includes("toko") || target.includes("warung") || target.includes("pelanggan") || target.includes("brand")) {
    return KNOWLEDGE_VAULT.business_umkm;
  }
  if (target.includes("belajar") || target.includes("ujian") || target.includes("sekolah") || target.includes("kuliah") || target.includes("bahasa") || target.includes("inggris") || target.includes("hafal") || target.includes("edukasi")) {
    return KNOWLEDGE_VAULT.education_study;
  }
  if (target.includes("motor") || target.includes("mobil") || target.includes("oli") || target.includes("ban") || target.includes("mesin") || target.includes("otomotif") || target.includes("servis") || target.includes("bensin") || target.includes("bbm")) {
    return KNOWLEDGE_VAULT.automotive_modif;
  }
  if (target.includes("rumah") || target.includes("kamar") || target.includes("properti") || target.includes("kpr") || target.includes("dekor") || target.includes("interior") || target.includes("renovasi") || target.includes("minimalis")) {
    return KNOWLEDGE_VAULT.property_interior;
  }
  if (target.includes("travel") || target.includes("liburan") || target.includes("wisata") || target.includes("hotel") || target.includes("tiket") || target.includes("packing") || target.includes("trip") || target.includes("healing")) {
    return KNOWLEDGE_VAULT.travel_lifestyle;
  }
  if (target.includes("hubungan") || target.includes("pasangan") || target.includes("pacar") || target.includes("nikah") || target.includes("komunikasi") || target.includes("psikologi") || target.includes("toxic") || target.includes("cinta")) {
    return KNOWLEDGE_VAULT.relationship_self;
  }
  if (target.includes("konten") || target.includes("reels") || target.includes("tiktok") || target.includes("shorts") || target.includes("youtube") || target.includes("views") || target.includes("fyp") || target.includes("kreator") || target.includes("sosmed")) {
    return KNOWLEDGE_VAULT.content_creator_growth;
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

