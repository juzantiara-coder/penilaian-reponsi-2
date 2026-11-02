/**
 * ====================================================================
 * BANK SOAL RESMI PRAKTIKUM TEKNOLOGI DAN MEKANISASI PERKEBUNAN
 * INSTITUT PERTANIAN STIPER (INSTIPER) YOGYAKARTA
 * 30 Butir Soal Pilihan Ganda (A, B, C, D) Sesuai Dokumen Terlampir
 * ====================================================================
 */

const DEFAULT_CONFIG = {
  examTitle: "Praktikum Teknologi dan Mekanisasi",
  examSubtitle: "Ujian 30 Soal Pilihan Ganda - 15 Detik per Nomor",
  timePerQuestion: 15,
  passingGrade: 70,
  parentPhoneNumber: "6285609616030",
  googleSheetWebhookUrl: "https://script.google.com/macros/s/AKfycby50YIG6eYdat1nsrLuJ54SxC9pNB8_0_ryZSC_1qMqH5rYZkldaKzB8UnDZfmNWPY9/exec",
  coassUser: "bangmail",
  coassPass: "coass2026.354"
};

const OFFICIAL_INSTIPER_QUESTIONS = [
  {
    id: 1,
    question: "Judul lengkap praktikum pada Acara I adalah...",
    options: [
      "Identifikasi Alat dan Mesin Perkebunan",
      "Pengenalan Sumber Daya Manusia Perkebunan",
      "Manajemen Bengkel dan Alsintan",
      "Pengujian Kapasitas Mesin Pascapanen"
    ],
    correct: 0 // A
  },
  {
    id: 2,
    question: "Praktikum yang membahas mengenai macam-macam transmisi manual dan perbandingan putaran roda gigi adalah Acara II dengan judul...",
    options: [
      "Motor Bakar dan Kelistrikan Traktor",
      "Sistem Transmisi dan Kendali",
      "Dinamika Aliran Fluida Hidrolik",
      "Sistem Pengemudian Otomatis"
    ],
    correct: 1 // B
  },
  {
    id: 3,
    question: "Judul lengkap dari praktikum Acara III adalah...",
    options: [
      "Kalibrasi Alat Semprot dan Pemupukan",
      "Simpel Driving Crane Grabber dan Scissor Lift, Traktor Roda 4, dan Hand Tractor",
      "Pengukuran Dimensi dan Kapasitas Lapang Traktor",
      "Pengenalan Sensor Navigasi dan Pemetaan Lahan"
    ],
    correct: 1 // B
  },
  {
    id: 4,
    question: "Praktikum Acara IV berfokus pada pengujian debit nozzle, pola semprotan, dan volume aplikasi dengan judul...",
    options: [
      "Mekanisasi untuk Rawat Tanaman (Kalibrasi Sprayer)",
      "Pengendalian Hama Terpadu Berbasis Mekanis",
      "Pengujian Pompa Tekanan Tinggi Perkebunan",
      "Desain Nozzle dan Pola Sebaran Fluida"
    ],
    correct: 0 // A
  },
  {
    id: 5,
    question: "Judul praktikum Acara V yang menganalisis efisiensi waktu siklus, kecepatan maju, dan selip roda traktor adalah...",
    options: [
      "Pengukuran Konsumsi Bahan Bakar",
      "Analisis Beban Tarik Implemen",
      "Cycle Time Alat dan Mesin Perkebunan",
      "Dinamika Suspensi Traktor Roda 4"
    ],
    correct: 2 // C
  },
  {
    id: 6,
    question: "Praktikum Acara VI yang mengenalkan teknologi pertanian presisi (smart farming), autosteering GPS, dan kamera AI berjudul...",
    options: [
      "Operasional Drone Penyemprot Tanaman Perkebunan",
      "Perancangan Sistem Irigasi Tetes Otomatis",
      "Operasional Autonomous Intermittent Fertilizer Spreader",
      "Kalibrasi Sensor Kelembapan dan Suhu Tanah"
    ],
    correct: 2 // C
  },
  {
    id: 7,
    question: "Berikut ini yang merupakan alat tulis/pencatat standar yang digunakan praktikan selama kegiatan praktikum adalah...",
    options: [
      "Buku catatan, alat tulis, dan handphone",
      "Laptop, printer portabel, dan jangka sorong",
      "Papan dada, kalkulator ilmiah, dan kertas grafik",
      "Kamera DSLR, handy talky, dan GPS genggam"
    ],
    correct: 0 // A
  },
  {
    id: 8,
    question: "Implemen pengolah tanah primer yang menggunakan piringan cakram cekung untuk memotong dan membalik tanah keras atau berbatu adalah...",
    options: [
      "Bajak rotary",
      "Bajak piringan (disk plow)",
      "Bajak singkal (moldboard plow)",
      "Bajak garu"
    ],
    correct: 1 // B
  },
  {
    id: 9,
    question: "Dua peralatan utama yang digunakan pada Acara IV untuk menampung air dan mengukur volume cairan per satuan waktu adalah...",
    options: [
      "Labu ukur dan buret",
      "Gelas ukur 2 L dan ember",
      "Pipa kapiler dan corong",
      "Timbangan digital dan pipet ukur"
    ],
    correct: 1 // B
  },
  {
    id: 10,
    question: "Bahan bakar yang digunakan sebagai sumber tenaga utama pada mesin penggerak motor diesel Traktor Roda 4 Kubota adalah...",
    options: [
      "Bensin pertalite",
      "Bahan bakar solar",
      "Avtur",
      "Minyak tanah"
    ],
    correct: 1 // B
  },
  {
    id: 11,
    question: "Alat bantu yang ditancapkan setiap jarak 4 meter sebagai patok rintangan jalur pengujian zig-zag pada Acara V adalah...",
    options: [
      "Traffic cone plastik",
      "Kayu pancang (patok kayu)",
      "Tong besi",
      "Tali pembatas"
    ],
    correct: 1 // B
  },
  {
    id: 12,
    question: "Nama aplikasi pemrosesan citra (computer vision) yang digunakan untuk mendeteksi letak pohon kelapa sawit pada Acara VI adalah...",
    options: [
      "Google Lens",
      "MATLAB Mobile",
      "Aplikasi AITRI",
      "Agisoft Metashape"
    ],
    correct: 2 // C
  },
  {
    id: 13,
    question: "Alat ukur yang digunakan praktikan untuk mencatat durasi waktu tempuh lintasan traktor pada praktikum Cycle Time adalah...",
    options: [
      "Anemometer",
      "Speedometer",
      "Stopwatch (atau timer digital)",
      "Tachometer"
    ],
    correct: 2 // C
  },
  {
    id: 14,
    question: "Sebelum mesin traktor dihidupkan, posisi seluruh tuas transmisi dan tuas kendali wajib dipastikan berada pada kondisi...",
    options: [
      "Maju cepat",
      "Gigi 1",
      "Netral",
      "Mundur"
    ],
    correct: 2 // C
  },
  {
    id: 15,
    question: "Tujuan utama menginjak pedal kopling secara penuh sebelum kunci kontak diputar ke posisi START adalah...",
    options: [
      "Memutus transmisi daya dari mesin ke flywheel secara total demi keselamatan kerja",
      "Mempercepat pengisian daya aki traktor",
      "Mengurangi gesekan pada ban traktor",
      "Mendinginkan suhu ruang bakar mesin"
    ],
    correct: 0 // A
  },
  {
    id: 16,
    question: "Tegangan aki minimal yang harus dipastikan saat mesin traktor otonomus menyala agar sistem navigasi bekerja stabil adalah...",
    options: [
      "6,0 Volt",
      "9,5 Volt",
      "12,0 Volt",
      "13,8 Volt"
    ],
    correct: 3 // D
  },
  {
    id: 17,
    question: "Pada saat menghidupkan hand tractor menggunakan engkol starter, tuas yang ditarik untuk membebaskan kompresi awal mesin adalah...",
    options: [
      "Tuas gas penuh",
      "Tuas dekompresi (choke)",
      "Tuas kopling kemudi",
      "Tuas persneling"
    ],
    correct: 1 // B
  },
  {
    id: 18,
    question: "Operator membelokkan arah jalan hand tractor di lahan perkebunan dengan cara...",
    options: [
      "Memutar roda setir kemudi bundar",
      "Mengendalikan setang kemudi dan menekan tuas kopling kemudi (kiri atau kanan)",
      "Menggeser tuas gas ke posisi paling rendah",
      "Menginjak pedal rem kaki"
    ],
    correct: 1 // B
  },
  {
    id: 19,
    question: "Komponen penjepit mekanis pada Crane Grabber yang bertugas mencengkeram Tandan Buah Segar (TBS) secara langsung adalah...",
    options: [
      "Swing base",
      "Upper arm",
      "Grabber jaw",
      "Boom base"
    ],
    correct: 2 // C
  },
  {
    id: 20,
    question: "Mekanisme kerja penaikan bak penampung pada unit Scissor Lift saat membongkar muatan dilakukan melalui...",
    options: [
      "Penarikan kabel sling baja menggunakan motor listrik",
      "Pompa fluida hidrolik yang merenggangkan rangka pantograf (lengan silang/gunting)",
      "Putaran poros roda gigi cacing manual",
      "Tekanan udara kompresor pneumatik rendah"
    ],
    correct: 1 // B
  },
  {
    id: 21,
    question: "Ketinggian nozzle dari permukaan tanah yang diatur saat pengujian kalibrasi sprayer pada Acara IV adalah...",
    options: [
      "10 cm",
      "25 cm",
      "44 cm",
      "100 cm"
    ],
    correct: 2 // C
  },
  {
    id: 22,
    question: "Fungsi penetapan titik A dan titik B pada pembuatan Guidance Lines di sistem Auto Steering FJDynamics adalah...",
    options: [
      "Titik A sebagai titik awal lintasan dan titik B sebagai pengunci arah lurus barisan kerja",
      "Titik A sebagai batas pengisian bensin dan titik B sebagai batas rem",
      "Titik A untuk mengukur kecepatan putar dan titik B untuk mematikan aki",
      "Titik A sebagai koordinat kantor dan titik B sebagai batas gudang"
    ],
    correct: 0 // A
  },
  {
    id: 23,
    question: "Pada aplikasi Auto Spreader AITRI, dua mode pemilihan target pemupukan tanaman adalah...",
    options: [
      "BASAH dan KERING",
      "LARGE - TM dan SMALL - TBM",
      "BIBIT dan AFKIR",
      "ORGANIK dan ANORGANIK"
    ],
    correct: 1 // B
  },
  {
    id: 24,
    question: "Langkah yang tepat saat mematikan traktor otonom setelah selesai operasi di lapangan adalah...",
    options: [
      "Langsung mencabut kutub aki tanpa mematikan mesin",
      "Menginjak rem mendadak lalu mematikan kunci kontak",
      "Mengubah mode Auto ke Manual, menurunkan RPM ke 1000, menetralkan tuas, lalu memutar kunci ke kiri",
      "Menarik tuas rem tangan pada putaran mesin tinggi"
    ],
    correct: 2 // C
  },
  {
    id: 25,
    question: "Rumus perbandingan roda gigi (Gear Ratio / GR) pada sistem transmisi 4 roda gigi (A, B, C, D) adalah...",
    options: [
      "GR = (A / B) * (C / D)",
      "GR = (B / A) * (D / C)",
      "GR = (A * B) / (C * D)",
      "GR = (A + B) * (C + D)"
    ],
    correct: 1 // B
  },
  {
    id: 26,
    question: "Rumus untuk mencari kecepatan putar poros keluaran (RPM output) dari putaran poros masukan (RPM input) dan Gear Ratio (GR) adalah...",
    options: [
      "RPM_out = RPM_in * GR",
      "RPM_out = RPM_in / GR",
      "RPM_out = RPM_in - GR",
      "RPM_out = GR / RPM_in"
    ],
    correct: 1 // B
  },
  {
    id: 27,
    question: "Jika dosis larutan total yang dibutuhkan adalah D = 15 Liter (15.000 mL) untuk populasi tanaman sebanyak JP = 143 pohon, berapakah dosis ideal per pohon (DP) menggunakan rumus DP = D / JP?",
    options: [
      "50,25 mL/pohon",
      "75,50 mL/pohon",
      "104,89 mL/pohon",
      "215,00 mL/pohon"
    ],
    correct: 2 // C
  },
  {
    id: 28,
    question: "Rumus keliling roda traktor (K) berdasarkan diameter roda (D) adalah...",
    options: [
      "K = pi * D",
      "K = 2 * pi * D",
      "K = pi * D^2",
      "K = pi / D"
    ],
    correct: 0 // A
  },
  {
    id: 29,
    question: "Rumus menghitung persentase selip roda traktor (S) dari putaran roda aktual (Na) dan putaran roda teoritis (No) adalah...",
    options: [
      "S = [(Na + No) / Na] * 100%",
      "S = [(No - Na) / No] * 100%",
      "S = [(Na - No) / Na] * 100%",
      "S = (Na - No) * 100%"
    ],
    correct: 2 // C
  },
  {
    id: 30,
    question: "Rumus kecepatan maju linear traktor (v) berdasarkan jarak tempuh lintasan (s) dan waktu tempuh (t) adalah...",
    options: [
      "v = s * t",
      "v = s / t",
      "v = t / s",
      "v = s - t"
    ],
    correct: 1 // B
  }
];

// Helper Storage
const ExamStorage = {
  getConfig() {
    try {
      const stored = localStorage.getItem("instiper_exam_config_v3");
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : { ...DEFAULT_CONFIG };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  },
  saveConfig(cfg) {
    try {
      localStorage.setItem("instiper_exam_config_v3", JSON.stringify(cfg));
    } catch (e) {
      console.error(e);
    }
  },
  getQuestions() {
    // Selalu gunakan 30 soal resmi dari dokumen PDF INSTIPER
    try {
      const stored = localStorage.getItem("instiper_exam_questions_v3");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 30) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return JSON.parse(JSON.stringify(OFFICIAL_INSTIPER_QUESTIONS));
  },
  saveQuestions(qList) {
    try {
      localStorage.setItem("instiper_exam_questions_v3", JSON.stringify(qList));
    } catch (e) {
      console.error(e);
    }
  },
  getResults() {
    try {
      const stored = localStorage.getItem("instiper_exam_results_v3");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "RES-001",
        waktu: "01/11/2026, 21:10:15",
        nim: "25/25244001/TP",
        nama: "Abdurrahman Nur Rizqi",
        minat: "Teknik Pertanian",
        skor: 93,
        benar: 28,
        salah: 2,
        kosong: 0,
        status: "LULUS"
      }
    ];
  },
  saveResult(newRecord) {
    try {
      const current = this.getResults();
      current.unshift(newRecord);
      localStorage.setItem("instiper_exam_results_v3", JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
  },
  setResults(list) {
    try {
      localStorage.setItem("instiper_exam_results_v3", JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },
  mergeResults(incomingList) {
    try {
      const current = this.getResults();
      const map = new Map();
      
      // Masukkan data lokal yang sudah ada
      current.forEach(item => {
        const key = (item.nim || item.nama || item.id || '').trim().toLowerCase();
        if (key) map.set(key, item);
      });

      // Timpa / tambahkan data masuk dari cloud & Google Drive
      incomingList.forEach(item => {
        if (!item) return;
        const key = (item.nim || item.nama || item.id || '').trim().toLowerCase();
        if (key) {
          map.set(key, item);
        }
      });

      const merged = Array.from(map.values());
      this.setResults(merged);
      return merged;
    } catch (e) {
      console.error("Merge error:", e);
      return this.getResults();
    }
  },
  clearResults() {
    try {
      localStorage.setItem("instiper_exam_results_v3", JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  }
};
