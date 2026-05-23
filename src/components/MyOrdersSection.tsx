import React, { useState } from 'react';
import { Key, Calendar, MapPin, Heart, Music, Check, Settings, Users, Share2, Clipboard, Edit, Download, ExternalLink, Bookmark, UserCheck, AlertCircle, Save, QrCode, Upload, Image, Trash2, X } from 'lucide-react';
import { Order, RSVP } from '../types';
import { formatRupiah } from '../data/themes';

interface MyOrdersSectionProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onOpenInvitationPreview: (themeId: string, customData?: Partial<Order>) => void;
  dummyCode: string;
}

export default function MyOrdersSection({
  orders,
  onUpdateOrder,
  onOpenInvitationPreview,
  dummyCode
}: MyOrdersSectionProps) {
  const [accessCode, setAccessCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'rsvp' | 'preview'>('details');

  // Input states for editing
  const [groomName, setGroomName] = useState('');
  const [groomNickname, setGroomNickname] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideNickname, setBrideNickname] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTime, setWeddingTime] = useState('');
  const [weddingLocation, setWeddingLocation] = useState('');
  const [musicChoice, setMusicChoice] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Uploaded photo states for dynamic edit uploader inside Dashboard
  const [photoUrl, setPhotoUrl] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  // Mock RSVP data for the simulation dashboard
  const [rsvpList, setRsvpList] = useState<RSVP[]>([
    { id: '1', orderId: '', name: 'Bapak Ahmad & Keluarga', guests: 4, attendance: 'yes', message: 'Selamat membina keluarga sakinah mawaddah warahmah Zaky & Rara. Semoga penuh limpahan berkah!', createdAt: '2026-05-22T04:20:00Z' },
    { id: '2', orderId: '', name: 'Dian Sastrowardoyo', guests: 2, attendance: 'yes', message: 'Happy wedding! Sehat dan bahagia selalu di lembaran baru hidup kalian.', createdAt: '2026-05-22T05:10:00Z' },
    { id: '3', orderId: '', name: 'Rian D\'masiv', guests: 1, attendance: 'no', message: 'Selamat menempuh hidup baru sahabatku, mohon maaf berhalangan hadir karena ada konser.', createdAt: '2026-05-22T05:30:00Z' }
  ]);

  const [newRsvps, setNewRsvps] = useState<RSVP[]>([]);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toUpperCase();
    
    // Find matching order that is SUCCESSFUL
    const found = orders.find(
      (o) => o.uniqueCode === cleanCode && o.status === 'success'
    );

    if (found) {
      setSelectedOrder(found);
      setErrorMessage('');
      
      // Initialize edit fields
      setGroomName(found.groomName);
      setGroomNickname(found.groomNickname);
      setBrideName(found.brideName);
      setBrideNickname(found.brideNickname);
      setWeddingDate(found.weddingDate);
      setWeddingTime(found.weddingTime);
      setWeddingLocation(found.weddingLocation);
      setMusicChoice(found.musicChoice);
      setCustomMessage(found.customMessage || '');
      setPhotoUrl(found.photoUrl || '');
      setAdditionalPhotos(found.additionalPhotos || []);
    } else {
      setErrorMessage('Kode Akses salah atau pesanan Anda belum dibayar/sudah kedaluwarsa.');
      setSelectedOrder(null);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated: Order = {
      ...selectedOrder,
      groomName,
      groomNickname,
      brideName,
      brideNickname,
      weddingDate,
      weddingTime,
      weddingLocation,
      musicChoice,
      customMessage,
      photoUrl,
      additionalPhotos
    };

    onUpdateOrder(updated);
    setSelectedOrder(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Quick helper to fill dummy code for demo testing
  const useDemoCode = () => {
    setAccessCode(dummyCode);
  };

  // Calculated RSVP Stats
  const totalGuestsProposed = rsvpList.reduce((acc, curr) => acc + (curr.attendance === 'yes' ? curr.guests : 0), 0);
  const totalYesCount = rsvpList.filter((r) => r.attendance === 'yes').length;
  const totalNoCount = rsvpList.filter((r) => r.attendance === 'no').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* ACCESS CODE PORTAL (GUEST MODE) */}
      {!selectedOrder ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-lg mx-auto p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-wedding-champagne text-wedding-gold mx-auto flex items-center justify-center border border-wedding-gold-light/35">
              <Key size={20} />
            </div>
            <h3 className="text-2xl font-serif font-black text-gray-950 tracking-tight leading-none mt-2">
              Lacak & Kelola Order Saya
            </h3>
            <p className="text-gray-500 text-xs px-4">
              Silakan masukkan Kode Akses Unik (misal: <code className="font-mono bg-wedding-champagne text-wedding-gold-dark px-1.5 py-0.5 rounded-sm font-bold">WD-XXXXX</code>) yang dikirimkan langsung ke WhatsApp atau Email Anda setelah pembayaran terkonfirmasi.
            </p>
          </div>

          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Kode Akses Unik</label>
              <input
                type="text"
                required
                placeholder="CONTOH: WD-74621"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full text-center text-lg font-mono tracking-widest p-4 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold bg-gray-50/50 block font-bold"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-1.5 leading-relaxed">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#445445] hover:bg-[#324133] text-white font-semibold text-xs py-4 px-4 rounded-xl shadow-md uppercase tracking-wider transition duration-150"
            >
              Uji Coba Hubungi Dashboard saya
            </button>
          </form>

          {/* Quick Sandbox Tester */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Belum pesan? Gunakan data uji coba:</span>
            <button
              onClick={useDemoCode}
              className="text-wedding-gold font-bold hover:underline bg-transparent"
            >
              Gunakan Kode Dummy ({dummyCode})
            </button>
          </div>
        </div>
      ) : (
        /* SUCCESS AUTHORIZED ORDER MANAGE DASHBOARD */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          
          {/* DASHBOARD NAV HEADER */}
          <div className="bg-[#1a231b] text-white p-6 px-8 border-b border-[#2d3a2f] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-green-500/15 text-green-400 text-[10px] font-mono font-bold uppercase rounded-full border border-green-500/30">
                  Pembayaran Berhasil
                </span>
                <span className="text-neutral-500 text-xs">|</span>
                <span className="text-wedding-gold-light font-mono text-xs font-semibold">Akses: {selectedOrder.uniqueCode}</span>
              </div>
              <h2 className="text-xl font-display font-medium text-white tracking-tight mt-1">
                Dasbor Kelola Undangan Online
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition text-[11px] font-semibold"
              >
                Log Out Dasbor
              </button>

              <button
                onClick={() => onOpenInvitationPreview(selectedOrder.themeId, selectedOrder)}
                className="bg-wedding-gold hover:bg-wedding-gold-dark text-white px-4 py-1.5 rounded-lg text-xs font-semibold font-display shadow-md transition flex items-center gap-1.5"
              >
                <ExternalLink size={13} />
                <span>Lihat Link Undangan Live</span>
              </button>
            </div>
          </div>

          {/* INNER TAB TRAY */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`p-4 px-6 text-xs font-semibold font-display transition relative font-medium ${
                activeTab === 'details' ? 'text-wedding-gold-dark' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Settings size={14} />
                <span>Ubah Data & Teks Undangan</span>
              </div>
              {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wedding-gold"></div>}
            </button>

            <button
              onClick={() => setActiveTab('rsvp')}
              className={`p-4 px-6 text-xs font-semibold font-display transition relative font-medium ${
                activeTab === 'rsvp' ? 'text-wedding-gold-dark' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>RSVP Tamu & Tamu Hadir</span>
              </div>
              {activeTab === 'rsvp' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wedding-gold"></div>}
            </button>
          </div>

          {/* TAB CONTENT: EDIT DETAILS FORM */}
          {activeTab === 'details' && (
            <form onSubmit={handleSaveChanges} className="p-6 sm:p-8 space-y-6">
              
              {/* QR CODE GENERATOR & LIVE LINK PORTLET WITH GLASSMORPHISM EFFECT */}
              <div className="relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 sm:p-6 shadow-xl shadow-wedding-gold/5 ring-1 ring-black/5 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-wedding-champagne/15 before:to-transparent before:-z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                  
                  {/* Column 1: Scannable QR Code Image */}
                  <div className="md:col-span-3 flex flex-col items-center text-center space-y-2.5">
                    <div className="bg-white/85 p-3 rounded-2xl border border-white shadow-md relative flex items-center justify-center transition duration-200 hover:scale-[1.02]">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `${window.location.origin}${window.location.pathname}?view=invitation&code=${selectedOrder.uniqueCode}`
                        )}`}
                        alt="Scannable QR Code"
                        className="w-32 h-32 rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-wedding-gold shadow-xs">
                        <Heart size={11} className="text-wedding-gold fill-wedding-gold animate-pulse" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-wedding-gold-dark tracking-wider uppercase flex items-center gap-1.5 bg-wedding-gold/10 px-2 py-0.5 rounded-md">
                      <QrCode size={11} /> Scan QR Undangan
                    </span>
                  </div>

                  {/* Column 2: Details & Actions */}
                  <div className="md:col-span-9 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-950 flex items-center gap-1.5 leading-none">
                        <span>Link Undangan Online Anda Aktif</span>
                        <span className="px-2 py-0.5 bg-green-500/15 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider font-mono">
                          Live
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Undangan digital Anda dapat disebarkan sekarang juga. Setiap perubahan data atau foto di bawah ini akan diperbarui langsung secara real-time.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}${window.location.pathname}?view=invitation&code=${selectedOrder.uniqueCode}`}
                        className="flex-1 text-xs font-mono p-3 bg-gray-55 border border-gray-200 rounded-xl text-gray-600 focus:outline-hidden block truncate font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const link = `${window.location.origin}${window.location.pathname}?view=invitation&code=${selectedOrder.uniqueCode}`;
                          navigator.clipboard.writeText(link);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        className={`px-4 py-3 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition ${
                          copySuccess ? 'bg-emerald-600 text-white' : 'bg-[#445445] hover:bg-[#324133] text-white'
                        }`}
                      >
                        {copySuccess ? <Check size={14} /> : <Clipboard size={14} />}
                        <span>{copySuccess ? 'Copied' : 'Salin'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const link = `${window.location.origin}${window.location.pathname}?view=invitation&code=${selectedOrder.uniqueCode}`;
                          const text = `Halo, Kami mengundang Anda untuk merayakan kebahagiaan kami. Silakan buka tautan undangan digital resmi kami berikut untuk rincian lengkap acara: ${link}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[11px] font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Share2 size={12} />
                        <span>Bagikan ke WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const link = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                            `${window.location.origin}${window.location.pathname}?view=invitation&code=${selectedOrder.uniqueCode}`
                          )}`;
                          window.open(link, '_blank');
                        }}
                        className="bg-zinc-800 hover:bg-zinc-900 border border-zinc-700 text-white text-[11px] font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Download size={12} />
                        <span>Download QR Code (HQ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenInvitationPreview(selectedOrder.themeId, selectedOrder)}
                        className="bg-wedding-champagne hover:bg-wedding-champagne/80 text-wedding-gold-dark text-[11px] font-extrabold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-wedding-gold-light/25 shadow-sm"
                      >
                        <ExternalLink size={12} />
                        <span>Buka Preview Layar Penuh</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-105">
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">mempelai pria</h4>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Nama Lengkap Pria</label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Nama Panggilan Pria</label>
                    <input
                      type="text"
                      required
                      value={groomNickname}
                      onChange={(e) => setGroomNickname(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">mempelai wanita</h4>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Nama Lengkap Wanita</label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Nama Panggilan Wanita</label>
                    <input
                      type="text"
                      required
                      value={brideNickname}
                      onChange={(e) => setBrideNickname(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pb-6 border-b border-gray-105">
                <h4 className="font-display font-bold text-sm text-gray-900">Rincian Acara Pernikahan</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Tanggal Pernikahan</label>
                    <input
                      type="date"
                      required
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Jam Dimulai</label>
                    <input
                      type="text"
                      required
                      value={weddingTime}
                      onChange={(e) => setWeddingTime(e.target.value)}
                      className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Pilihan Lagu Backsound</label>
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
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Lokasi Gedung / Alamat Resepsi</label>
                  <input
                    type="text"
                    required
                    value={weddingLocation}
                    onChange={(e) => setWeddingLocation(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans"
                  />
                </div>
              </div>

              {/* PHOTO COVERS AND GALLERY MANAGEMENT SUB-FORM */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">Kelola Media Foto Undangan</h4>
                  <p className="text-xs text-gray-450 font-sans">Ubah atau unggah foto Anda yang tampil di cover utama serta galeri dokumentasi pendukung di undangan digital.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                  {/* Photo 1: Main wallpaper photo */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">Foto Utama / Wallpaper Sampul</label>
                    {photoUrl ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-250 group bg-gray-50 flex items-center justify-center">
                        <img src={photoUrl} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('')}
                            className="p-2 bg-red-650 hover:bg-red-700 text-white rounded-full transition shadow-md text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 size={13} />
                            <span>Hapus / Ganti Foto</span>
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
                          const el = document.getElementById('dash-primary-image-input');
                          if (el) el.click();
                        }}
                      >
                        <input
                          id="dash-primary-image-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.length) {
                              handlePrimaryFile(e.target.files[0]);
                            }
                          }}
                        />
                        <Upload size={20} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700 block">Tarik & lepas atau cari gambar baru</span>
                        <span className="text-[10px] text-gray-400 block font-mono">JPG, PNG, atau WEBP</span>
                      </div>
                    )}
                  </div>

                  {/* Photo 2: Gallery supporting elements */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">Foto Galeri Kebahagiaan Kami (Maks 4)</label>
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
                        const el = document.getElementById('dash-gallery-image-input');
                        if (el) el.click();
                      }}
                    >
                      <input
                        id="dash-gallery-image-input"
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
                      <Image size={20} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 block">Tambahkan Foto Galeri Baru</span>
                      <span className="text-[10px] text-gray-400 block font-mono">Pilih satu atau lebih gambar sekaligus</span>
                    </div>

                    {additionalPhotos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {additionalPhotos.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-150 group bg-gray-100">
                            <img src={img} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdditionalPhotos(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1 right-1 bg-red-650 hover:bg-red-700 text-white p-1 rounded-full shadow-xs transition"
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

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-gray-400">
                  Terakhir diperbarui: Baru saja. Perubahan langsung terupdate di link live!
                </div>
                
                <div className="flex items-center gap-3">
                  {isSaved && (
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1 animate-pulse">
                      <Check size={14} /> Berhasil disimpan!
                    </span>
                  )}
                  
                  <button
                    type="submit"
                    className="bg-wedding-gold hover:bg-wedding-gold-dark text-white font-semibold text-xs py-3.5 px-6 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 transition"
                  >
                    <Save size={14} />
                    <span>Simpan Perubahan Undangan</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* TAB CONTENT: RSVP GUESTS */}
          {activeTab === 'rsvp' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* STATS TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-800 uppercase block">Total Tamu Hadir</span>
                    <strong className="text-3xl font-display font-black text-emerald-950 font-mono mt-1 block">
                      {totalGuestsProposed} <span className="text-xs text-emerald-600 font-sans font-medium">Orang</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl text-emerald-600 border border-emerald-100">
                    <UserCheck size={20} />
                  </div>
                </div>

                <div className="bg-wedding-champagne border border-wedding-gold-light/20 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-wedding-gold-dark uppercase block">Undangan Terkonfirmasi</span>
                    <strong className="text-3xl font-display font-black text-wedding-gold-dark font-mono mt-1 block">
                      {totalYesCount} <span className="text-xs font-sans font-medium text-wedding-gold">Baris</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl text-wedding-gold border border-wedding-gold-light/25">
                    <Check size={20} />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase block">Menolak / Berhalangan</span>
                    <strong className="text-3xl font-display font-black text-gray-800 font-mono mt-1 block">
                      {totalNoCount} <span className="text-xs font-sans font-medium text-gray-500">Orang</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl text-gray-400 border border-gray-200">
                    <AlertCircle size={20} />
                  </div>
                </div>
              </div>

              {/* LIST READ TABLE */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="font-display font-bold text-sm text-gray-900">
                    Buku Tamu Konfirmasi Kehadiran Live
                  </h4>

                  <button
                    onClick={() => alert('Simulasi Ekspor tamu ke Excel/CSV sukses diunduh!')}
                    className="p-1.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-950 hover:bg-gray-50 transition font-sans text-xs flex items-center gap-1 font-semibold"
                  >
                    <Download size={13} />
                    <span>Ekspor ke CSV/Excel</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-left text-xs text-gray-500 border-collapse bg-white">
                    <thead className="text-[10px] text-gray-400 uppercase bg-gray-50 font-mono tracking-wider">
                      <tr>
                        <th className="p-4 py-3">Nama Tamu</th>
                        <th className="p-4 py-3">Jumlah Tamu</th>
                        <th className="p-4 py-3">Kehadiran</th>
                        <th className="p-4 py-3">Pesan Doa Restu</th>
                        <th className="p-4 py-3 text-right">Tanggal RSVP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rsvpList.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="p-4 font-bold text-gray-900">{r.name}</td>
                          <td className="p-4 font-mono font-semibold">{r.guests} Person</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              r.attendance === 'yes' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                            }`}>
                              {r.attendance === 'yes' ? 'Hadir' : 'Absen'}
                            </span>
                          </td>
                          <td className="p-4 italic text-gray-600 max-w-xs truncate" title={r.message}>
                            "{r.message}"
                          </td>
                          <td className="p-4 text-right text-gray-400 font-mono text-[10px]">
                            {new Date(r.createdAt).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* FOOTER METRICS INFO */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 font-sans">
            Tipe Lisensi Undangan: <strong className="text-gray-600 font-bold">Premium E-Commerce Lifetime</strong> • Link aktif sampai selamanya.
          </div>

        </div>
      )}

    </div>
  );
}
