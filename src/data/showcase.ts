export interface ShowcaseItem {
  id: string;
  label: string;
  prompt: string;
  image_path: string;
  media_url: string;
  sort_order: number;
  media_type: "video" | "image";
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "df2d3a7d-79c5-4dd7-96a7-523955e71944",
    label: "Shorts Video",
    prompt: "Video timelapse berkualitas tinggi yang menampilkan perakitan model pesawat tempur secara mendetail menggunakan bahan karton cokelat di atas latar belakang putih bersih yang minimalis. Kamera diposisikan dalam sudut pandang *top-down* yang stabil, memperlihatkan tangan yang secara presisi menempelkan bagian-bagian sayap, kokpit transparan, mesin jet berwarna hitam, dan roda pendaratan. Gaya visualnya sangat rapi dengan estetika kerajinan tangan (DIY) yang profesional, didukung oleh pencahayaan studio yang terang dan merata tanpa bayangan tajam. Palet warna didominasi oleh warna cokelat alami dari serat karton yang kontras dengan latar belakang putih, menciptakan komposisi yang simetris, terpusat, dan memuaskan secara visual.",
    image_path: "df2d3a7d-79c5-4dd7-96a7-523955e71944/1784883083733.mp4",
    media_url: "https://bqmanbdfjjrjpbkqhcgs.supabase.co/functions/v1/showcase-media?path=df2d3a7d-79c5-4dd7-96a7-523955e71944%2F1784883083733.mp4",
    sort_order: 1,
    media_type: "video"
  },
  {
    id: "6fd83b26-480e-4069-ba9e-67b4eb93527c",
    label: "Long Video",
    prompt: "Video sinematik yang menampilkan perakitan mendetail dari model miniatur mobil Mahindra Scorpio berwarna hitam mengkilap. Proses dimulai dengan tangan yang mengenakan sarung tangan hitam menyusun berbagai komponen mesin dan roda perak yang rumit di atas meja kayu berwarna cokelat hangat dengan serat kayu yang terlihat jelas. Gaya visualnya menggunakan teknik stop-motion yang halus dengan pencahayaan studio yang cerah dan merata, menonjolkan tekstur realistis dan pantulan cahaya yang tajam pada bodi mobil yang mengkilap. Komposisi beralih dari bidikan makro jarak dekat yang fokus pada detail komponen kecil hingga tampilan 360 derajat yang mulus saat mobil yang sudah jadi berputar perlahan di atas dudukan pajangan hitam. Latar belakang berubah dari meja kayu yang hangat menjadi latar belakang abu-abu minimalis yang bersih, menciptakan kontras warna yang elegan antara hitam pekat mobil, aksen perak metalik, dan latar belakang yang netral, memberikan kesan kemewahan dan presisi teknis.",
    image_path: "6fd83b26-480e-4069-ba9e-67b4eb93527c/1784886352118.webm",
    media_url: "https://bqmanbdfjjrjpbkqhcgs.supabase.co/functions/v1/showcase-media?path=6fd83b26-480e-4069-ba9e-67b4eb93527c%2F1784886352118.webm",
    sort_order: 2,
    media_type: "video"
  },
  {
    id: "c6c60add-f3bb-47e5-9ccf-f024f3443f1a",
    label: "UGC Affiliate",
    prompt: "STORYBOARD — Kopi Kapal Api Kopi Susu\nAudience: Pecinta kopi instan yang mencari praktis dan rasa creamy.\nBig Idea: Kopi instan creamy, praktis, bikin mood auto ON!\nHook: Mager bikin kopi tapi pengen creamy?\nDurasi: ±10 detik\n\nSCENE 1 — 0-3s\nShot: POV Close-up | Kamera: Shaky handheld / Static\nVisual: Kamera fokus ke wajah influencer yang terlihat ngantuk atau mager. Wajah menghadap ke bawah, lalu perlahan mendongak dengan ekspresi lelah.\nVO: Mager bikin kopi tapi pengen creamy?\nText: MALES BIKIN KOPI?!\nSFX/Musik: Musik upbeat tiba-tiba muncul setelah hook\n\nSCENE 2 — 3-8s\nShot: Medium shot | Kamera: Static\nVisual: Influencer dengan senyum lebar, memegang sachet Kapal Api Kopi Susu di satu tangan dan cangkir kopi yang sudah jadi di tangan lain. Adegan menunjukkan ia mengangkat sachet ke cangkir seolah baru selesai menyeduh. Background santai, misalnya meja kerja atau sofa.\nVO: Ini solusinya! Praktis, creamy, mood langsung naik!\nText: KOPI SUSU INSTAN!\nSFX/Musik: Suara 'ting!' atau 'slurp' diikuti music upbeat.\n\nSCENE 3 — 8-10s\nShot: Close-up | Kamera: Slow push-in\nVisual: Fokus ke sachet Kopi Kapal Api Kopi Susu yang dipegang influencer, lalu tangan influencer menunjuk ke arah bawah layar (simulasi keranjang kuning/link bio). Wajah influencer tersenyum bahagia.\nVO: Langsung cek keranjang kuning ya!\nText: CEK KERANJANG KUNING!\nSFX/Musik: Musik berakhir dengan 'ding' ceria.\n\nCTA: Cek keranjang kuning sekarang!\n\nCaption: Stuck butuh mood booster instan? ✨ Kopi Kapal Api Kopi Susu penyelamatku! Praktis, creamy, langsung bikin melek! #KopiInstan #KopiSusu #MoodBooster\nHashtag: #KapalApiKopiSusu #KopiInstan #CemilanEnak #MinumanRemaja #RekomendasiKopi",
    image_path: "c6c60add-f3bb-47e5-9ccf-f024f3443f1a/1784886383821.webm",
    media_url: "https://bqmanbdfjjrjpbkqhcgs.supabase.co/functions/v1/showcase-media?path=c6c60add-f3bb-47e5-9ccf-f024f3443f1a%2F1784886383821.webm",
    sort_order: 3,
    media_type: "video"
  },
  {
    id: "1105d816-6e90-4032-9c76-5fb6ce473202",
    label: "UGC Affiliate",
    prompt: "STORYBOARD — Vaseline Advanced Strength Lotion\nAudience: Orang-orang dengan kulit sangat kering yang mencari solusi cepat dan efektif.\nBig Idea: Lotion ini penyelamat kulit keringmu dalam 5 hari, tanpa lengket!\nHook: Kulit kering kerontang? Stop ngeluh!\nDurasi: ±10 detik\n\nSCENE 1 — 0-3s\nShot: Medium close-up | Kamera: Handheld slight shake, lalu static\nVisual: Afiliator menunjukkan telapak tangan kosong yang sedikit kering/pecah-pecah (tanpa terlihat sangat ekstrem), dengan ekspresi wajah cemberut/mengeluh.\nVO: Kulit kering kerontang? Stop ngeluh!\nText: KULIT KERING BEGITU?\nSFX/Musik: Sound effect 'fail trombone' atau sound lucu 'sad violin melody' yang berhenti mendadak.\n\nSCENE 2 — 3-8s\nShot: Close-up | Kamera: Slow push-in\nVisual: Afiliator mengaplikasikan lotion Vaseline Advanced Strength ke salah satu telapak tangan. Perlihatkan tekstur lotion yang tidak lengket saat diratakan. Fokus pada area yang diaplikasikan.\nVO: Ini nih penyelamat! 5 hari kulit lembap lagi, tanpa lengket.\nText: 5 HARI, NO LENGKET!\nSFX/Musik: Musik upbeat, transisi mulus.\n\nSCENE 3 — 8-10s\nShot: Medium shot | Kamera: Static\nVisual: Afiliator tersenyum sambil menunjukkan kedua tangan yang kini terlihat lebih halus dan melembap. Posisikan produk di samping tangan.\nVO: Yuk cobain, klik keranjang kuning sekarang!\nText: KLIK KERANJANG KUNING!\nSFX/Musik: Musik ceria masih berlanjut, suara 'klik' kecil.\n\nCTA: KLIK KERANJANG KUNING SEKARANG!\n\nCaption: Jangan biarin kulit kering bikin badmood! 👋 Cobain rahasia kulit lembap tanpa lengket cuma dalam 5 hari, sekarang! 👇\nHashtag: #Vaseline #KulitKering #LotionBadan #SkincareRoutine #RekomendasiProduk",
    image_path: "1105d816-6e90-4032-9c76-5fb6ce473202/1784886381808.webm",
    media_url: "https://bqmanbdfjjrjpbkqhcgs.supabase.co/functions/v1/showcase-media?path=1105d816-6e90-4032-9c76-5fb6ce473202%2F1784886381808.webm",
    sort_order: 4,
    media_type: "video"
  },
  {
    id: "0c4bd201-1dee-45a5-9504-6de319dfe5a7",
    label: "Poster",
    prompt: "Poster promosi vertikal bergaya ilustrasi vektor modern untuk kopi, rasio aspek 9:16, tampilan bersih dan tajam seperti desain digital resolusi tinggi. Latar belakang gradasi hangat cokelat-kuning keemasan dengan nuansa senja, dihiasi garis-garis lengkung dekoratif di keempat sudut dalam warna kuning tua dan cokelat. Ada elemen biji kopi outline tersebar di latar sebagai ornamen.\n\nDi bagian atas tengah terdapat logo kecil bergambar cangkir kopi dengan uap, di bawahnya teks “KOPI SENJA” dengan huruf kapital tebal warna cokelat tua. Pusat komposisi menampilkan judul besar bertumpuk tiga baris: “Jumat Berkah, Kopi Senja Gratis!” dengan font bulat tebal berwarna putih, outline cokelat tua tebal, efek bayangan halus, sangat dominan dan mudah dibaca. Di sisi kiri dan kanan judul ada ilustrasi percikan kopi kecil berwarna krem-cokelat. Di bawah judul ada teks penjelas dua baris berwarna cokelat tua: “Beli 1 kopi nikmat, GRATIS 1! Spesial untuk mahasiswa.” dengan gaya sans-serif tebal.\n\nBagian bawah menampilkan dua gelas kopi takeaway kartun besar di atas permukaan cokelat gelap melengkung. Gelas kiri sedikit miring ke kiri, berwarna putih dengan sleeve cokelat, bertuliskan “Beli 1” pada sleeve; kopi di dalamnya meluap dengan busa krim di atas dan tetesan kopi mengalir dari bibir gelas, ada uap putih melengkung di atasnya. Gelas kanan tegak sedikit miring ke kanan, putih dengan sleeve cokelat bertuliskan “GRATIS 1!”, juga berisi kopi yang terciprat keluar dengan beberapa tetes melayang di sisi kanan, serta uap putih di atasnya. Di kanan bawah dekat gelas kanan ada emblem stiker/medali emas bergelombang bertuliskan “15000” dengan garis tepi cokelat dan efek kilau kecil.\n\nDi paling bawah tengah terdapat tombol ajakan bertindak berbentuk kapsul besar berwarna kuning emas dengan outline cokelat tua dan bayangan lembut, berisi teks putih tebal “Pesan Sekarang!”. Pencahayaan terlihat seperti desain datar dengan gradasi dan highlight ilustratif, tanpa sumber cahaya realistis. Palet warna dominan cokelat, kuning emas, krem, putih, dan cokelat tua. Gaya keseluruhan: poster promosi kopi, ilustrasi vektor 2D, clean, playful, modern, ramah, kontras tinggi, tanpa foto manusia, tanpa objek realistis.",
    image_path: "0c4bd201-1dee-45a5-9504-6de319dfe5a7/1784885785148.jfif",
    media_url: "https://bqmanbdfjjrjpbkqhcgs.supabase.co/functions/v1/showcase-media?path=0c4bd201-1dee-45a5-9504-6de319dfe5a7%2F1784885785148.jfif",
    sort_order: 5,
    media_type: "image"
  },
  {
    id: "e1aee26d-72a1-42ab-a201-3053c2e753c4",
    label: "Poster",
    prompt: "Iklan poster promosi minuman matcha latte bergaya desain grafis komersial, komposisi vertikal 9:16 dengan latar belakang hijau tua gradasi halus. Di bagian atas tengah ada logo putih “RIZGO COFFEE” dengan ikon cangkir kopi mengepul di atasnya. Teks utama sangat besar di tengah atas: “SAATNYA MATCHA” dengan huruf kapital tebal, warna putih dengan outline hijau terang dan efek bayangan/3D tebal sehingga tampak menonjol. Di bawahnya ada teks promo putih: “BELI MATCHA LATTE GET 30% KHUSUS HARI INI”. Di sisi kiri tengah terdapat teks melengkung vertikal putih “MATCHA LATTE” dengan panah melengkung mengarah ke minuman.\n\nObjek utama: satu gelas tinggi transparan berisi matcha latte warna hijau muda pucat, terletak sedikit di kanan bawah tengah, tampak besar dan dominan. Minuman memiliki lapisan busa putih tipis di bagian atas, permukaan sedikit berbuih, gelas bening dengan dasar tebal dan sedikit silinder meruncing ke bawah. Di kiri bawah gelas ada mangkuk kayu kecil berisi bubuk matcha hijau cerah. Di kanan bawah gelas ada kotak label harga hijau terang dengan sudut membulat berisi teks putih: “HANYA 40K” dan di bawahnya lebih kecil “Hanya Setiap Hari Minggu!”.\n\nLatar dihiasi beberapa daun hijau muda yang tampak melayang/tersebar di tepi-tepi frame: satu di kiri atas, satu di kanan atas, satu di kanan tengah, satu di kiri tengah bawah, satu di kanan bawah, dan satu di kiri bawah tepi; daun sedikit blur seperti elemen dekoratif. Di bagian bawah terdapat teks putih: “Matcha Latte Membawa Energi Tenang untuk Hari Senin Anda.” Pada pojok kanan bawah ada ikon bintang/berkilau kecil warna putih kehijauan.\n\nGaya visual: poster iklan modern, clean, berwarna hijau dominan, kombinasi 2D graphic design dengan render produk realistis untuk gelas matcha dan mangkuk kayu. Pencahayaan lembut dan merata tanpa bayangan keras, highlight halus pada gelas dan busa. Nuansa segar, natural, energik, dan promo. Detail tajam, kontras tinggi, tipografi besar dan tebal, tampilan sangat rapi seperti artwork promosi media sosial. Resolution tampak tinggi, rasio aspek vertikal 9:16.",
    image_path: "e1aee26d-72a1-42ab-a201-3053c2e753c4/1784886309949.webp",
    media_url: "https://bqmanbdfjjrjpbkqhcgs.supabase.co/functions/v1/showcase-media?path=e1aee26d-72a1-42ab-a201-3053c2e753c4%2F1784886309949.webp",
    sort_order: 6,
    media_type: "image"
  }
];
