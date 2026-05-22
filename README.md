# 🌿 Wedding Online Store - E-Commerce Platform

Platform e-commerce penyedia jasa pembuatan undangan pernikahan online premium berbasis spasial modern, bersih, dan berestetika tinggi. Dikembangkan secara profesional menggunakan **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, dan dihias dengan tema warna elegan **Natural Tones** (Sage & Warm Linen).

---

## 🚀 Fitur Utama & Keunggulan Sistem

- **Sistem Tanpa Login / No-Password Guest System**: Konsumen dapat merancang data pernikahan, memilih tema, mengelola buku tamu, dan melacak konfirmasi RSVP langsung hanya dengan memasukkan **Kode Unik Acara (WD-XXXXX)** sebagai token akses aman.
- **Draf Reservasi Otomatis (5 Menit Sesi Kunci)**: 
  Sistem mengunci pesanan aktif selama 5 menit guna efisiensi infrastruktur server. Apabila pembayaran tidak terlaksana dalam 5 menit, draf pesanan akan dihapus secara otomatis dan konsumen dapat memesan ulang tema yang sama dengan detail baru tanpa menumpuk draf sampah di server.
- **Real-Time Views Counter**: Melacak kepopuleran masing-masing tema dengan counter interaktif yang bertambah setiap kali Preview diklik.
- **Panel Edit Khusus & Dasbor Buku Tamu**: Panel terenkripsi tanpa registrasi bagi pemilik acara untuk memodifikasi teks nama mempelai, peta lokasi (Google Maps), backsound lagu, memantau jumlah tamu hadir, serta mengekspor data tamu ke Excel/CSV secara instan.
- **Virtual Notification Gateway Simulator**: Dilengkapi panel pemberitahuan real-time untuk mensimulasikan notifikasi OTP via WhatsApp dan Email kepada konsumen draf serta konfirmasi akses setelah sukses bayar.

---

## 📊 Alur & Flowchart Logika Bisnis

```
[1. PILIH TEMA & TRACK VIEWS] 
             │   Atomic counter views bertambah saat tombol 'Preview' diklik konsumen.
             ▼
[2. FORMULIR ORDER INSTAN] 
             │   Isi Kontak (Email, WA) & Info Pengantin tanpa ribet mendaftar akun gres.
             ▼
[3. TRANSAKSI DIKUNCI (5 MENIT)] 
             │   Invoice berstatus 'Pending & Kunci Reservasi' (Detik Berhitung Mundur).
             ├────── Bila > 5 Menit ──────► [4. EXPIRED CLEANUP DELETION]
             │   Draf dihapus otomatis demi kebersihan antrean draf database.
             ▼
[5. PEMBAYARAN DI-SIMULASIKAN] 
             │   Status berubah menjadi 'Success', sistem membangkitkan KODE AKSES UNIK.
             ▼
[6. TOKEN OTP DISPATCH] 
             │   Sistem mengirim 'WD-XXXXX' ke WA/Email konsumen via Simulator.
             ▼
[7. DASBOR KELOLA ORDER SAYA] 
                 Kelola Undangan, Edit Lokasi, Ubah Backsound, & Ekspor RSVP ke CSV.
```

```
┌──────────────────────┐
│      MULAI           │
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│ User membuka website │
└─────────┬────────────┘
          │
          ▼
┌────────────────────────────────────┐
│ Tampilkan daftar tema undangan    │
│ - Card tema                       │
│ - Tombol Preview                  │
│ - Tombol Order                    │
│ - Jumlah view tema                │
└─────────┬──────────────────────────┘
          │
 ┌────────┴────────┐
 │                 │
 ▼                 ▼
┌────────────────┐ ┌─────────────────────┐
│ Klik Preview   │ │ Klik Order          │
└──────┬─────────┘ └─────────┬───────────┘
       │                     │
       ▼                     ▼
┌────────────────┐   ┌──────────────────────┐
│ Halaman Preview│   │ Buat data order      │
│ Tema Undangan  │   │ status = pending     │
└──────┬─────────┘   │ expired = 5 menit    │
       │             └─────────┬────────────┘
       │                       │
       └──────────────┐        ▼
                      │ ┌──────────────────────┐
                      │ │ Halaman Pembayaran   │
                      │ └─────────┬────────────┘
                      │           │
                      │    ┌──────┴───────┐
                      │    │              │
                      ▼    ▼              ▼
               ┌───────────────┐ ┌─────────────────┐
               │ Bayar berhasil│ │ User batal /    │
               │               │ │ belum bayar     │
               └──────┬────────┘ └────────┬────────┘
                      │                   │
                      ▼                   ▼
         ┌─────────────────────┐ ┌──────────────────────┐
         │ Kirim kode unik     │ │ Simpan order pending │
         │ ke Email/WhatsApp   │ │ selama 5 menit       │
         └─────────┬───────────┘ └─────────┬────────────┘
                   │                       │
                   ▼                       ▼
      ┌─────────────────────────┐ ┌──────────────────────┐
      │ User masuk halaman      │ │ Waktu > 5 menit ?    │
      │ "Order Saya"            │ └─────────┬────────────┘
      │ menggunakan kode unik   │           │
      └─────────┬───────────────┘      ┌────┴─────┐
                │                      │          │
                ▼                      ▼          ▼
        ┌───────────────┐      ┌────────────┐ ┌────────────────┐
        │ Lihat detail  │      │ Tidak      │ │ Ya             │
        │ order         │      │ tetap ada  │ │ Hapus order    │
        └──────┬────────┘      └────────────┘ │ pending lama   │
               │                               └──────┬─────────┘
               ▼                                      │
        ┌───────────────┐                             ▼
        │    SELESAI    │                 ┌────────────────────┐
        └───────────────┘                 │ Jika order ulang,  │
                                          │ buat pending baru  │
                                          └────────────────────┘
```


---

## 🛠️ Cara Menguji Aplikasi di Komputer Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan dan menguji aplikasi di lokal komputer Anda (Localhost):

### 1. Prasyarat Instalasi
Pastikan Anda sudah menginstal **Node.js** (versi 18 atau lebih tinggi) dan **npm** di komputer Anda. Cek dengan perintah:
```bash
node -v
npm -v
```

### 2. Unduh atau Ekspor Repositori
Ekspor repositori file biner dari platform atau klon dari GitHub:
```bash
git clone <url-repo-anda>
cd <nama-folder-projek>
```

### 3. Instalasi Dependensi
Buka terminal/command prompt pada folder projek tersebut, lalu jalankan perintah berikut untuk mengunduh semua paket dan pustaka yang dibutuhkan:
```bash
npm install
```

### 4. Menjalankan Server Pengembangan (Dev Mode)
Untuk memulai server pengembangan lokal, jalankan perintah:
```bash
npm run dev
```
Setelah berjalan, terminal akan menampilkan tautan server lokal Anda (biasanya **`http://localhost:3000`** atau **`http://localhost:5173`** tergantung konfigurasi port). Buka tautan tersebut pada browser Anda.

### 5. Membangun Aplikasi untuk Produksi
Jika ingin memeriksa kinerja rilis produksi akhir, build berkas statis dengan perintah:
```bash
npm run build
```
Hasil kompilasi optimal akan disimpan di dalam direktori `dist/` yang siap dideploy ke penyedia hosting cloud rilis statis maupun server.

---

## 🪴 Kombinasi Desain "Natural Tones"

Aplikasi ini menggunakan palet warna kustom bertemakan keselarasan alam bebas yang ramah di mata:

- 🟢 **Sage Leaf Green (`#6b856c`)**: Digunakan sebagai warna utama aksen, melambangkan kebahagiaan dan awal kehidupan baru yang asri.
- 🟤 **Muted Warm Linen/Sand (`#faf8f4` & `#ebe7de`)**: Digunakan untuk latar belakang kanvas guna menghidupkan suasana rustik yang tenang dan elegan.
- 🌲 **Forest Carbon (`#2b332c`)**: Pewarnaan teks utama yang memberikan ketajaman tinggi, ergonomis, bebas silau matahari, dan ramah aksesibilitas.

---
*Dibuat dengan dedikasi tinggi oleh Google AI Studio Build.*
