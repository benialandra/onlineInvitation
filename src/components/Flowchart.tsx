import React, { useState } from 'react';
import { Play, Copy, Check, ArrowRight, HelpCircle, AlertCircle, RefreshCw, Layers, ShieldCheck, Mail, Send } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  badge: string;
  color: string;
}

export default function Flowchart() {
  const [activeStep, setActiveStep] = useState<string>('step1');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps: FlowStep[] = [
    {
      id: 'step1',
      title: 'Pilih Tema & Tracking Views',
      subTitle: 'Konsumen menjelajahi Katalog Tema',
      description: 'Setiap tema pernikahan memiliki halaman preview interaktif. Ketika tombol "Preview" diklik, sistem melacak jumlah kunjungan halaman (views counter) tema tersebut secara real-time untuk menunjukkan kepopulerannya.',
      badge: 'E-commerce Theme Card',
      color: 'border-amber-500 bg-amber-50 text-amber-900 font-medium'
    },
    {
      id: 'step2',
      title: 'Formulir Pemesanan Tambah Data',
      subTitle: 'Mengisi data pernikahan tanpa akun',
      description: 'Konsumen menekan tombol "Order" lalu mengisi kelengkapan info: Email, WhatsApp, Nama Mempelai Pria & Wanita, Tanggal Acara & Pilihan Musik. Tidak ada proses pendaftaran akun (register) atau kata sandi demi kenyamanan kilat.',
      badge: 'Guest Checkout Form',
      color: 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium'
    },
    {
      id: 'step3',
      title: 'Halaman Pembayaran & Kunci Reservasi (5 Menit)',
      subTitle: 'Sistem Kunci Reservasi Draft Tertunda',
      description: 'Setelah submit order, sistem membuat invoice berstatus "Pending" dengan masa tenggang 5 MENIT (dimulai dengan hitung mundur detik). Jika konsumen keluar halaman atau menutup tab, pesanan tidak hilang dan tetap aktif di sistem hingga 5 menit berlalu.',
      badge: 'Reservasi Aktif (5m Timeout)',
      color: 'border-yellow-600 bg-yellow-50 text-yellow-900 font-medium'
    },
    {
      id: 'step4',
      title: 'Kelayakan Batas & Expired Cleanup',
      subTitle: 'Pembersihan Otomatis Jika Melebihi Batas',
      description: 'Jika waktu pembayaran melebihi 5 menit tanpa pelunasan, pesanan otomatis dikategorikan "EXPIRED" (Kedaluwarsa) dan terhapus dari antrean aktif. Jika konsumen memesan kembali tema tersebut, sistem akan membuatkan pesanan baru dari nol.',
      badge: 'Automatic Garbage Collection',
      color: 'border-red-500 bg-red-50 text-red-900'
    },
    {
      id: 'step5',
      title: 'Pembayaran Sukses & Alokasi Kode Unik',
      subTitle: 'Integrasi Pengiriman Token Keamanan',
      description: 'Begitu pembayaran terkonfirmasi sukses, sistem beralih status ke "SUCCESS" dan secara instan membangkitkan KODE UNIK ACARA (contoh: WD-74291) yang dikirimkan langsung ke WhatsApp dan Email konsumen bersama tautan kelola undangan.',
      badge: 'Unique Token Dispatch',
      color: 'border-green-600 bg-green-50 text-green-900 font-medium'
    },
    {
      id: 'step6',
      title: 'Kelola Undangan "Order Saya" via Kode Unik',
      subTitle: 'Akses instan aman tanpa login/password',
      description: 'Konsumen diarahkan ke halaman "Order Saya" (My Order). Cukup dengan memasukkan Kode Unik yang diterima, konsumen dapat mengubah data undangan, memantau buku tamu, melihat statistik kedatangan RSVP, dan mengunduh link undangan kustomnya kapan saja.',
      badge: 'Passwordless Secure Dashboard',
      color: 'border-teal-600 bg-teal-50 text-teal-900'
    }
  ];

  const prompts = [
    {
      title: 'Prompt 1: Pembuatan Struktur Database & Integrasi Flowchart State',
      role: 'Arsitektur Database Terjadwal',
      promptText: `Buat sistem backend Express dan Firestore DB berstruktur Server-Side untuk aplikasi Jasa Undangan Pernikahan Online Ecommerce.
Skema koleksi:
1. \`themes\`: id (string), name, price, views (counter atomic), category, style (json).
2. \`orders\`: id (uuid), customerEmail, customerPhone, groomName, brideName, weddingDate, status ('pending'|'success'|'expired'), createdAt (timestamp), expiresAt (createdAt + 5 minutes), uniqueCode (random alphanumeric kustom).
Kriteria Bisnis:
- Amankan rute pembayaran: pesanan yang masih "Pending" dikunci selama 5 menit. Sediakan cron atau fungsi pembanding waktu lokal server yang otomatis membaca pesanan \`pending\` dan mengubahnya menjadi \`expired\` setelah 5 menit berlalu.
- Jika pengguna mencoba order ulang tema yang sama dan order sebelumnya drafnya sudah > 5 menit, batalkan order lama secara otomatis dan terbitkan UUID order baru dengan token acak.`
    },
    {
      title: 'Prompt 2: Skema Pengiriman OTP / Kode Unik WhatsApp & Email',
      role: 'Notifikasi Otomatis Terpercaya',
      promptText: `Implementasikan integrasi API pihak ketiga (seperti Mailgun/Sendgrid untuk Email dan Twilio/Fonnte untuk WhatsApp) di backend server Node.js.
Ketika status pesanan berubah dari 'pending' ke 'success' (setelah sukses simulasi pembayaran):
1. Buat kode keamanan unik dengan format 'WD-XXXXX' (di mana X adalah angka acak berkisar 5 digit).
2. Kirimkan pesan terformat ramah pengguna ke Email dan WhatsApp pembeli berisi: Kode Akses Unik, Nama Pengantin, Link Instan untuk Melacak Order Saya tanpa login (misal: https://domain-anda.com/order-saya?code=WD-XXXXX).
3. Buatlah antrean pengiriman email cadangan jika terjadi kegagalan gateway API.`
    },
    {
      title: 'Prompt 3: Panel Edit Mandiri Tanpa Login untuk Pelanggan',
      role: 'Passwordless User Interface',
      promptText: `Buatlah halaman 'Order Saya' (My Orders) responsif menggunakan React, Tailwind CSS, dan Lucide Icons.
- Halaman ini memuat formulir pencarian tunggal yang meminta masukan 'Kode Unik Pesanan' atau 'Nomor WhatsApp'.
- Setelah kode divalidasi dengan sukses via API, renderlah Dasbor Pengelolaan Undangan Online bagi konsumen bersangkutan.
- Di dalam dasbor ini, konsumen dapat:
  1. Mengubah detail teks undangan (Lokasi akad/resepsi, jam acara, link Google Maps).
  2. Mengganti pilihan lagu backsound (audio player terintegrasi).
  3. Mengupload foto album pernikahan (simulasi upload foto dengan preview instan).
  4. Melihat tabel atau grafik ringkasan RSVP/Konfirmasi Kehadiran dari tamu undangan secara live.`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* FLOWCHART VISUALIZER CARD */}
      <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-display font-bold text-lg text-gray-900 tracking-tight">
              Alur Sistem Undangan Online E-commerce
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">
              Klik tiap tahapan di diagram atau daftar di bawah untuk melihat rincian alur logika sistem secara mendalam.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/60 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span> 5-Min Timer Lock
          </span>
        </div>

        {/* FLOWCHART SCHEMATIC USING Styled Blocks (Modern Bento Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {steps.map((st, i) => {
            const isSelected = activeStep === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStep(st.id)}
                className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-wedding-gold bg-wedding-cream ring-1 ring-wedding-gold-light/40 shadow-xs translate-y-[-2px]'
                    : 'border-gray-200 bg-gray-55 hover:bg-gray-50/50 hover:border-gray-300'
                }`}
              >
                {/* Connector Arrow for desktops */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gray-300 pointer-events-none">
                    {i !== 2 && <ArrowRight size={14} className="bg-white rounded-full p-0.5 shadow-xs border border-gray-200" />}
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isSelected ? 'bg-wedding-gold text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">
                    {st.badge.split(' ')[0]}
                  </span>
                </div>
                
                <h4 className="font-display font-semibold text-sm text-gray-900 leading-tight">
                  {st.title}
                </h4>
                
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {st.subTitle}
                </p>

                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-wedding-gold"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE EXPLANATION DRAW-DOWN */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 mb-2">
          {(() => {
            const current = steps.find((s) => s.id === activeStep) || steps[0];
            return (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 rounded-md text-xs font-mono font-semibold bg-wedding-champagne text-wedding-gold-dark border border-wedding-gold-light/30">
                      INFO DETIL TAHAP {steps.findIndex((s) => s.id === current.id) + 1}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-semibold text-gray-600 font-sans">{current.badge}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-wedding-gold-dark">
                    <Layers size={13} />
                    <span>Sistem Otomatis Tanpa Login</span>
                  </div>
                </div>

                <h4 className="font-display font-black text-base text-gray-950">
                  {current.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {current.description}
                </p>

                {/* Simulated Business Rule Banner */}
                {current.id === 'step3' && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-yellow-50/70 border border-yellow-200/60 text-yellow-900 text-xs">
                    <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Aturan Kunci 5 Menit:</span> Selama halaman pembayaran / tab aktif maupun tidak aktif, detail pesanan Anda tetap dikunci selama 300 detik. Di luar batas itu, entri draf dihapus untuk mencegah penumpukan data sampah di sistem.
                    </div>
                  </div>
                )}

                {current.id === 'step5' && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-green-50/70 border border-green-200/60 text-green-900 text-xs">
                    <ShieldCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Otentikasi Passwordless:</span> Kode unik yang diterbitkan berfungsi sebagai kunci API terenkripsi untuk membaca data undangan anda secara aman dari database tanpa login email/password yang berbelit-belit.
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* AI PROMPT ASSISTANT FOR DEVELOPER */}
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl p-6 text-zinc-100">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
              AI Generation Guide
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-white mb-2">
            Dokumentasi & Prompt Generator
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            Gunakan prompt spesifik di bawah ini jika Anda ingin mengintegrasikan fitur ini dengan database riil (Firebase Firestore, SQLite, dsb.) atau mengembangkan webhook pengiriman email & WhatsApp otomatis. TINGGAL SALIN dan berikan kepada asisten AI Anda!
          </p>

          <div className="space-y-4">
            {prompts.map((p, index) => (
              <div key={index} className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 relative group">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs">
                    <span className="font-bold text-wedding-gold-light">{p.title}</span>
                    <span className="text-zinc-500 mx-1.5">|</span>
                    <span className="text-zinc-400 font-mono text-[10px] bg-zinc-900 p-1 rounded border border-zinc-800/80">
                      {p.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(p.promptText, index)}
                    className="p-1 px-2 rounded bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-mono text-xs flex items-center gap-1"
                    title="Salin Prompt"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={11} className="text-green-400" />
                        <span className="text-[10px] text-green-400 font-semibold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span className="text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="max-h-24 overflow-y-auto text-[11px] text-zinc-300 font-mono bg-zinc-900/40 p-2.5 rounded border border-zinc-900 leading-relaxed scrollbar-thin">
                  {p.promptText}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between items-center bg-zinc-900">
          <span>Sistem Flow Prototyping - v1.0</span>
          <span className="font-serif italic text-wedding-gold-light/60">Elegan & Tanpa Batas</span>
        </div>
      </div>
    </div>
  );
}
