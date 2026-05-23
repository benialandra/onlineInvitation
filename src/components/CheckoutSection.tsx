import React, { useState, useEffect } from 'react';
import { Clock, ShoppingCart, Shield, ArrowRight, ArrowLeft, RefreshCw, Smartphone, QrCode, Mail, MessageSquare, AlertTriangle, CheckCircle, Heart, Upload, Image, Trash2, X } from 'lucide-react';
import { Theme, Order, Notification } from '../types';
import { formatRupiah } from '../data/themes';

interface CheckoutSectionProps {
  theme: Theme;
  activeOrder: Order | null;
  onOrderCreated: (order: Order) => void;
  onPaymentSuccess: (order: Order) => void;
  onCancelCheckout: () => void;
  addNotification: (notif: Notification) => void;
}

export default function CheckoutSection({
  theme,
  activeOrder,
  onOrderCreated,
  onPaymentSuccess,
  onCancelCheckout,
  addNotification
}: CheckoutSectionProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  
  // Form input states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [groomName, setGroomName] = useState('');
  const [groomNickname, setGroomNickname] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideNickname, setBrideNickname] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTime, setWeddingTime] = useState('09:00 WIB');
  const [weddingLocation, setWeddingLocation] = useState('');
  const [musicChoice, setMusicChoice] = useState('Beautiful in White - Westlife');
  const [customMessage, setCustomMessage] = useState('');

  // Uploaded photo states
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);

  const handlePrimaryFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSecondaryFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAdditionalPhotos((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Local calculation of countdown time left
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds

  // Handle restoring form if activeOrder exists and is still pending
  useEffect(() => {
    if (activeOrder && activeOrder.status === 'pending') {
      setStep('payment');
      
      // Calculate remaining seconds based on expiresAt
      const calculateSecondsLeft = () => {
        const expires = new Date(activeOrder.expiresAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((expires - now) / 1000));
        return diff;
      };
      
      setTimeLeft(calculateSecondsLeft());

      const interval = setInterval(() => {
        const left = calculateSecondsLeft();
        setTimeLeft(left);
        if (left <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setStep('form');
    }
  }, [activeOrder]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate order data
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes from now
    const uniqueCode = `WD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substring(2, 9)}`,
      themeId: theme.id,
      themeName: theme.name,
      customerName,
      customerEmail,
      customerPhone,
      groomName,
      groomNickname,
      brideName,
      brideNickname,
      weddingDate,
      weddingTime,
      weddingLocation,
      status: 'pending',
      createdAt,
      expiresAt,
      uniqueCode,
      musicChoice,
      customMessage,
      photoUrl,
      additionalPhotos
    };

    onOrderCreated(newOrder);
    setStep('payment');

    // Simulate sending initial 'Draft Created / Pending Payment' notification
    const orderLink = `https://ais-pre-2iru7vft5klkyoilfwdwuf-441940351373.asia-southeast1.run.app/?view=my-orders&code=${uniqueCode}`;
    
    const whatsappMsg: Notification = {
      id: `sms_${Math.random().toString(36).substring(2, 9)}`,
      type: 'whatsapp',
      to: customerPhone,
      uniqueCode,
      message: `Halo Kak ${customerName},\n\nDraf pesanan Undangan Online dengan tema *${theme.name}* telah dibuat! \nSilakan selesaikan pembayaran sebesar *${formatRupiah(theme.price)}* sebelum waktu habis (5 menit).\n\nJika belum dibayar dalam 5 menit, draf ini otomatis kedaluwarsa. Tautan pembayaran aman: ${orderLink}`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    };

    addNotification(whatsappMsg);
  };

  const handleSimulatePayment = () => {
    if (!activeOrder) return;

    // Simulate payment success
    onPaymentSuccess(activeOrder);

    // Send successful delivery notification
    const successEmail: Notification = {
      id: `notif_email_${Math.random().toString(36).substring(2, 9)}`,
      type: 'email',
      to: activeOrder.customerEmail,
      subject: `Pembayaran Berhasil! Kode Akses Undangan Online Anda (${activeOrder.uniqueCode})`,
      uniqueCode: activeOrder.uniqueCode,
      message: `Yth. Bapak/Ibu ${activeOrder.customerName},\n\nPembayaran untuk pesanan Jasa Undangan Pernikahan Anda (Tema: ${activeOrder.themeName}) sebesar ${formatRupiah(theme.price)} telah TERVERIFIKASI SUKSES!\n\nBerikut KODE AKSES UNIK Anda untuk melacak & mengedit undangan pernikahan Anda:\n🔓 KODE AKSES: ${activeOrder.uniqueCode}\n\nMasukkan kode unik ini di menu "Lacak Order Saya" di website kami kapan saja tanpa perlu login/kata sandi.\n\nSelamat mempersiapkan hari bahagia Anda!\nSalam Hangat,\nTim Wedding Online Store`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    };

    const successWhatsapp: Notification = {
      id: `notif_wa_${Math.random().toString(36).substring(2, 9)}`,
      type: 'whatsapp',
      to: activeOrder.customerPhone,
      uniqueCode: activeOrder.uniqueCode,
      message: `🎉 *PEMBAYARAN INVOICE SUKSES!* 🎉\n\nHalo Kak ${activeOrder.customerName},\npembayaran sebesar *${formatRupiah(theme.price)}* telah berhasil diterima.\n\nBerikut adalah kunci kustomisasi undangan Anda:\n🔓 *KODE AKSES UNIK:* ${activeOrder.uniqueCode}\n\nAnda dapat mengunduh daftar RSVP, mengubah tanggal, mengganti musik, dan mengaktifkan link undangan online Anda kapan saja langsung lewat dasbor "Lacak Order Saya" di website kami menggunakan kode di atas.\n\nTerima kasih atas kepercayaannya!`,
      timestamp: new Date().toLocaleTimeString('id-ID')
    };

    addNotification(successEmail);
    addNotification(successWhatsapp);
  };

  // Helper to format remaining seconds into MM:SS
  const formatTimer = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      
      {/* HEADER PROGRESS STEP */}
      <div className="bg-[#1a231b] text-white p-6 px-8 flex justify-between items-center border-b border-[#2d3a2f]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-wedding-gold/20 rounded-lg text-wedding-gold-light">
            <ShoppingCart size={18} />
          </div>
          <div>
            <span className="text-xs text-gray-400 block uppercase tracking-wider font-mono font-bold">Proses Pemesanan Jasa</span>
            <h2 className="text-lg font-display font-medium text-white tracking-tight">
              {step === 'form' ? 'Konfigurasi Data Pengantin' : 'Selesaikan Pembayaran'}
            </h2>
          </div>
        </div>

        {step === 'payment' && timeLeft > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            <Clock size={15} className="text-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-amber-200">
              Selesai otomatis: <strong className="text-amber-300 text-sm font-bold">{formatTimer(timeLeft)}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: THEME SUMMARY & DETAILS */}
        <div className="lg:col-span-4 bg-gray-50/70 p-6 lg:p-8 border-r border-gray-100 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase bg-wedding-champagne text-wedding-gold-dark px-2.5 py-1 rounded-full font-bold">
              Tema Terpilih
            </span>
            <h3 className="text-2xl font-serif font-black text-gray-950 tracking-tight leading-none mt-1">
              {theme.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              {theme.description}
            </p>
          </div>

          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-2xs relative">
            <img 
              src={theme.imageUrl} 
              alt={theme.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 left-2 bg-black/70 hover:bg-black text-white p-1.5 px-3 rounded-full text-xs font-semibold leading-none flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-wedding-gold"></span>
              <span>{theme.category}</span>
            </div>
          </div>

          <div className="space-y-3.5 pt-4 border-t border-gray-200/50">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Harga Jasa Lisensi</span>
              <span className="text-xl font-bold font-display text-gray-900">{formatRupiah(theme.price)}</span>
            </div>
            
            <div className="p-3 bg-white rounded-xl border border-gray-105 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">Fitur Tambahan Termasuk:</span>
              <ul className="text-[11px] text-gray-600 space-y-1">
                {theme.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-wedding-gold text-xs">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SWITCHABLE STEPS */}
        <div className="lg:col-span-8 p-6 lg:p-8">
          
          {/* STEP 1: FILL FORM */}
          {step === 'form' && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="pb-3 border-b border-gray-100">
                <h4 className="font-display font-bold text-sm text-gray-900">1. Kontak Utama Layanan</h4>
                <p className="text-xs text-gray-400">Digunakan untuk menerima Notifikasi Kode Unik Tanpa Registrasi</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Pemesan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Adrian"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50/50"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email Aktif</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50/50"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">No. WhatsApp/Telpon</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="pb-3 border-b border-gray-100 pt-3">
                <h4 className="font-display font-bold text-sm text-gray-900">2. Informasi Mempelai & Acara</h4>
                <p className="text-xs text-gray-400">Akan dicantumkan pada desain undangan pernikahan online Anda</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Lengkap Mempelai Pria</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap Mempelai Pria"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Panggilan Pria</label>
                    <input
                      type="text"
                      required
                      placeholder="Panggilan"
                      value={groomNickname}
                      onChange={(e) => setGroomNickname(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Lengkap Mempelai Wanita</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap Mempelai Wanita"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Panggilan Wanita</label>
                    <input
                      type="text"
                      required
                      placeholder="Panggilan"
                      value={brideNickname}
                      onChange={(e) => setBrideNickname(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Tanggal Pernikahan</label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Lokasi Resepsi</label>
                  <input
                    type="text"
                    required
                    placeholder="Alamat lengkap gedung / tempat acara"
                    value={weddingLocation}
                    onChange={(e) => setWeddingLocation(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Pilihan Backsound Lagu</label>
                  <select
                    value={musicChoice}
                    onChange={(e) => setMusicChoice(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-white"
                  >
                    <option value="Beautiful in White - Westlife">Beautiful in White - Westlife</option>
                    <option value="A Thousand Years - Christina Perri">A Thousand Years - Christina Perri</option>
                    <option value="Can't Help Falling in Love - Kina Grannis">Can't Help Falling in Love - Kina Grannis</option>
                    <option value="Perfect - Ed Sheeran">Perfect - Ed Sheeran</option>
                    <option value="Instrumen Akustik Biola Romantis">Instrumen Akustik Biola Romantis</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Catatan Kustom (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Minta hal khusus pada halaman..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                  />
                </div>
              </div>

              {/* PHOTO UPLOAD AND GALLERY SETUP PANEL */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">3. Unggah Foto Dokumentasi (Otomatis Diterapkan)</h4>
                  <p className="text-xs text-gray-400">Unggah foto Anda untuk langsung diterapkan ke tema undangan baru saat pembayaran berhasil</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo 1: Primary Cover Couple Photo */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">Foto Utama / Sampul Undangan</label>
                    
                    {photoUrl ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center">
                        <img src={photoUrl} alt="Cover Utama" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('')}
                            className="p-2.5 bg-red-650 hover:bg-red-700 text-white rounded-full transition shadow-md text-xs font-bold flex items-center gap-1.5"
                          >
                            <Trash2 size={14} />
                            <span>Hapus Foto Utama</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingPrimary(true); }}
                        onDragLeave={() => setIsDraggingPrimary(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingPrimary(false);
                          if (e.dataTransfer.files?.length) {
                            handlePrimaryFile(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                          isDraggingPrimary ? 'border-wedding-gold bg-wedding-champagne/15' : 'border-gray-200 hover:border-wedding-gold/60 bg-gray-50/50'
                        }`}
                        onClick={() => {
                          const el = document.getElementById('primary-photo-input');
                          if (el) el.click();
                        }}
                      >
                        <input
                          id="primary-photo-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              handlePrimaryFile(e.target.files[0]);
                            }
                          }}
                        />
                        <Upload size={22} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-705 block">Tarik & lepas atau cari gambar</span>
                        <span className="text-[10px] text-gray-450 font-medium block">JPG, PNG atau WEBP berkualitas tinggi</span>
                      </div>
                    )}
                  </div>

                  {/* Photo 2: Secondary Additional Grid Gallery */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">Foto Galeri Tambahan (Hingga 4 foto)</label>
                    
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingSecondary(true); }}
                      onDragLeave={() => setIsDraggingSecondary(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingSecondary(false);
                        if (e.dataTransfer.files?.length) {
                          handleSecondaryFiles(e.dataTransfer.files);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                        isDraggingSecondary ? 'border-wedding-gold bg-wedding-champagne/15' : 'border-gray-200 hover:border-wedding-gold/60 bg-gray-50/50'
                      }`}
                      onClick={() => {
                        const el = document.getElementById('secondary-photo-input');
                        if (el) el.click();
                      }}
                    >
                      <input
                        id="secondary-photo-input"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.length) {
                            handleSecondaryFiles(e.target.files);
                          }
                        }}
                      />
                      <Image size={22} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-705 block">Unggah Foto Galeri Pendukung</span>
                      <span className="text-[10px] text-gray-450 block">Klik di sini untuk memilih beberapa gambar sekaligus</span>
                    </div>

                    {additionalPhotos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {additionalPhotos.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-150 group">
                            <img src={img} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdditionalPhotos(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-650 text-white p-1 rounded-full shadow-xs transition"
                              title="Hapus foto ini"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onCancelCheckout}
                  className="px-6 py-3.5 border border-gray-200 hover:bg-gray-55 text-xs font-semibold rounded-xl text-gray-600 transition flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  <span>Kembali</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-xs py-3.5 px-6 rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <span>Kirim & Lanjutkan Pembayaran</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT WITH TIMER & QR CODE / INSTANT BANK TRANSFER */}
          {step === 'payment' && activeOrder && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Timeout reached warning status */}
              {timeLeft <= 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                  <AlertTriangle className="text-red-600 mx-auto" size={32} />
                  <h4 className="font-display font-bold text-base text-gray-900">
                    Sesi Pembayaran Telah Kedaluwarsa!
                  </h4>
                  <p className="text-gray-500 text-xs max-w-md mx-auto">
                    Masa draf pesanan Anda yang dikunci selama 5 menit telah berakhir. Detail formulir Anda telah dikosongkan secara otomatis untuk efisiensi sistem keamanan kami.
                  </p>
                  <button
                    onClick={onCancelCheckout}
                    className="bg-[#445445] hover:bg-[#324133] text-white font-semibold text-xs py-2.5 px-6 rounded-xl shadow-md transition"
                  >
                    Ulangi Pemesanan Baru
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-amber-500/10 border border-amber-200/50 p-4 rounded-xl flex items-start gap-2 text-xs">
                    <Clock size={16} className="text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="font-bold text-amber-800 block">Sistem Sedang Mengunci Invoice Anda!</span>
                      <p className="text-amber-700/90 mt-0.5 font-sans">
                        Jika Anda secara sengaja atau tidak sengaja menutup tab ini atau kembali ke halaman katalog, orderan Anda <span className="underline font-bold">TIDAK AKAN HILANG</span> dan akan tersimpan secara otomatis selama <strong className="font-bold text-amber-900 font-mono">5 Menit ({formatTimer(timeLeft)})</strong>. Di luar 5 menit, database draf akan dihapus otomatis.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* QRIS PAYMENTS COVER SCREEN */}
                    <div className="border border-gray-150 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-4 bg-gray-50/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Metode Pembayaran Instan</span>
                      
                      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs relative">
                        {/* Fake QRIS SVG */}
                        <div className="h-44 w-44 bg-zinc-100 flex flex-col justify-between items-center p-2 relative">
                          <QrCode size={135} className="text-zinc-950 mt-1" />
                          <div className="font-mono text-[9px] text-gray-500 border-t border-gray-200 pt-1 w-full text-center tracking-widest font-bold">
                            QRIS PERNIKAHAN ONLINE
                          </div>
                          
                          {/* Inner gold heart for design element */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-wedding-gold shadow-xs">
                            <Heart size={14} className="text-wedding-gold fill-wedding-gold" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-gray-600">Scan QRIS di atas dengan m-Banking atau E-Wallet</span>
                        <div className="text-xl font-bold text-zinc-900 tracking-tight font-mono">
                          {formatRupiah(theme.price)}
                        </div>
                      </div>
                    </div>

                    {/* MANUAL INFO */}
                    <div className="space-y-4 flex flex-col justify-between">
                      <div className="space-y-3.5 text-xs text-gray-600 font-sans">
                        <div className="p-3.5 bg-white border border-gray-100 rounded-xl">
                          <span className="text-gray-400 block pb-1 border-b border-gray-50 mb-1.5 text-[10px] tracking-wider uppercase font-semibold">
                            Ringkasan Invoice
                          </span>
                          <table className="w-full text-left space-y-1.5">
                            <tbody>
                              <tr>
                                <td className="text-gray-400 py-0.5">Kode Unik Acara</td>
                                <td className="font-bold text-gray-800 text-right py-0.5 font-mono">{activeOrder.uniqueCode}</td>
                              </tr>
                              <tr>
                                <td className="text-gray-400 py-0.5">Pemesan</td>
                                <td className="font-semibold text-gray-800 text-right py-0.5">{activeOrder.customerName}</td>
                              </tr>
                              <tr>
                                <td className="text-gray-400 py-0.5">Telepon WA</td>
                                <td className="font-semibold text-gray-800 text-right py-0.5 font-mono">{activeOrder.customerPhone}</td>
                              </tr>
                              <tr>
                                <td className="text-gray-400 py-0.5">Mempelai</td>
                                <td className="font-semibold text-wedding-gold-dark text-right py-0.5">{activeOrder.groomNickname} & {activeOrder.brideNickname}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1 text-indigo-900 leading-relaxed text-[11px]">
                          <span className="font-bold text-indigo-950 block">🔑 Tanpa Akun & Password</span>
                          Setelah pembayaran berhasil diverifikasi secara instan lewat tombol simulasi, kami mengirim **Kode Akses Unik** ke WhatsApp & Email Anda untuk memodifikasi teks, lokasi maps, RSVP tamu, dan mendownload link undangan Anda.
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <button
                          onClick={handleSimulatePayment}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-xs py-4 px-4 rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5 transition duration-150 active:scale-95"
                        >
                          <CheckCircle size={15} />
                          <span>Simulasi Bayar Sekarang (Sukses)</span>
                        </button>

                        <button
                          onClick={onCancelCheckout}
                          className="w-full py-2.5 bg-transparent border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-xl text-gray-500 transition"
                        >
                          Batal / Bayar Nanti
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
