import React, { useState } from 'react';
import { Key, Calendar, MapPin, Heart, Music, Check, Settings, Users, Share2, Clipboard, Edit, Download, ExternalLink, Bookmark, UserCheck, AlertCircle, Save } from 'lucide-react';
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
      customMessage
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
