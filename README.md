# 🎓 Aplikasi Ujian Online Pintar Anak (30 Soal - 15 Detik)

Aplikasi web interaktif modern yang dirancang khusus untuk ujian/kuis anak dengan sistem **waktu ketat per soal** dan **anti-mundur**, sesuai instruksi:
- **30 Butir Soal** pilihan ganda yang interaktif dan ramah anak.
- **Timer 15 Detik per Soal** dengan indikator visual melingkar (Circular SVG) & progress bar yang berubah warna (Hijau -> Kuning -> Merah).
- **Otomatis Tersimpan**: Mau dijawab atau tidak, saat waktu 15 detik habis jawaban langsung terkunci dan otomatis berpindah ke soal selanjutnya.
- **Tidak Bisa Kembali**: Soal yang sudah lewat tidak dapat diakses lagi.
- **Kirim Hasil ke WhatsApp Ayah/Ibu**: Anak dapat langsung mengirimkan skor dan rincian hasil ujian ke WhatsApp orang tua dengan satu klik!

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Buka Langsung di Laptop / Komputer
Cukup klik dua kali file **`buka_langsung.bat`** atau klik ganda **`index.html`**. Aplikasi akan langsung terbuka di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).

---

### Opsi 2: Hubungkan ke HP / Tablet Anak (Jaringan Wi-Fi Rumah)
Jika anak menggunakan HP atau tablet di rumah:
1. Pastikan laptop dan HP anak terhubung ke jaringan Wi-Fi yang sama.
2. Klik dua kali file **`jalankan_server.bat`**.
3. Di layar hitam (command prompt) akan tertera tautan/link lokal, misalnya:
   ```
   http://192.168.1.15:8080
   ```
4. Buka tautan tersebut di browser HP/tablet anak.

---

### Opsi 3: Cara Membuat Link Online Resmi (Bisa Diakses dari Mana Saja - 100% GRATIS)

Agar anak bisa masuk dari mana saja lewat link internet biasa (seperti `https://ujian-anak.netlify.app`):

#### Cara Paling Mudah (Netlify Drop - Tanpa Coding & Tanpa Instalasi):
1. Buka situs [https://app.netlify.com/drop](https://app.netlify.com/drop) di browser.
2. Seret (drag & drop) seluruh folder **`ujian-online-anak`** ke halaman tersebut.
3. Tunggu sekitar 10 detik. Netlify akan langsung memberikan link resmi aktif gratis (contoh: `https://kuis-anak-pintar.netlify.app`).
4. Bagikan link tersebut ke WhatsApp anak!

#### Alternatif Lain:
- **Vercel**: Import folder ke [vercel.com](https://vercel.com).
- **GitHub Pages**: Upload repositori ke GitHub, lalu aktifkan *Pages* di menu Settings.

---

## ⚙️ Pengaturan Orang Tua (Admin & Bank Soal)

Di pojok kanan atas aplikasi terdapat tombol **⚙️ Orang Tua**.
- **PIN Rahasia Default:** `1234`
- Di menu ini, Ayah/Bunda dapat:
  1. **Mengedit 30 Soal**: Mengubah pertanyaan, pilihan A/B/C/D, serta kunci jawaban yang benar.
  2. **Mengubah Durasi Waktu**: Standar 15 detik (dapat diubah jika ingin menambah atau mengurangi waktu).
  3. **Mengatur Nomor WhatsApp Orang Tua**: Masukkan nomor WA (format internasional, contoh: `6281234567890`) agar hasil ujian anak langsung terkirim ke WhatsApp Ayah/Bunda.
  4. **Ekspor & Impor Bank Soal (JSON)**: Bisa membuat paket soal matematika, sains, bahasa Inggris, atau pelajaran sekolah lainnya.
  5. **Reset Default**: Mengembalikan kembali ke 30 soal standar bawaan sewaktu-waktu.

---

## 📊 Rincian Bank Soal Default (30 Soal Cerdas)
Aplikasi ini sudah dilengkapi dengan 30 butir soal pilihan ganda edukatif siap pakai:
- **Soal 1 - 10**: Logika & Matematika Dasar Berhitung (penjumlahan, pengurangan, perkalian, pembagian, pola bilangan, keliling bangun datar).
- **Soal 11 - 20**: Sains & Pengetahuan Alam (hewan herbivora/ovipar, fotosintesis, tata surya, gaya gravitasi, metamorfosis).
- **Soal 21 - 30**: Pengetahuan Umum & Kebangsaan (Pancasila, Garuda, lagu kebangsaan, arah mata angin, kebudayaan daerah).

---

## 🔒 Fitur Keamanan Ujian (Anti-Curang)
- **Anti-Mundur**: Tombol 'Back' pada browser HP atau komputer dicegat secara otomatis sehingga anak tidak dapat kembali memperbaiki jawaban sebelumnya.
- **Auto-Lock 15s**: Begitu detik ke-0 tercapai, tombol jawaban terkunci dan otomatis berpindah ke nomor berikutnya.
- **Peringatan Keluar (Prevent Exit)**: Jika anak tidak sengaja menekan refresh atau close saat ujian berlangsung, akan muncul dialog peringatan konfirmasi.
