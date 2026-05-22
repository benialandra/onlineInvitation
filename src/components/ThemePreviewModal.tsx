import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Heart, Music, Music2, Share2, Send, CheckCircle, Users, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Theme } from '../types';

interface ThemePreviewModalProps {
  theme: Theme;
  onClose: () => void;
  onOrder: () => void;
}

interface Wish {
  name: string;
  relation: string;
  message: string;
  attendance: 'yes' | 'no';
  time: string;
}

export default function ThemePreviewModal({ theme, onClose, onOrder }: ThemePreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false); // Has the user clicked "Buka Undangan"
  const [isPlaying, setIsPlaying] = useState(false); // Music playing state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpAttendance, setRsvpAttendance] = useState<'yes' | 'no'>('yes');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  
  // Custom wishes for simulation
  const [wishes, setWishes] = useState<Wish[]>([
    { name: 'Risma & Heru', relation: 'Sahabat Pengantin', message: 'Selamat menikmati indahnya bahtera rumah tangga baru ya Bella & Aris! Semoga samawa selalu dan cepat dikaruniai buah hati. Amin.', attendance: 'yes', time: '2 menit lalu' },
    { name: 'Dokter Danu', relation: 'Keluarga', message: 'Barakallahu lakum wa baraka alaikum. Sungguh bahagia melihat kalian bersatu. Selamat menempuh lembaran baru!', attendance: 'yes', time: '1 jam lalu' },
    { name: 'Arief Prasetyo', relation: 'Teman Kantor', message: 'Happy Wedding, bro! Semoga menjadi keluarga yang sakinah. Maaf belum bisa hadir karena dinas luar kota, tapi doa terbaik dari jauh.', attendance: 'no', time: '3 jam lalu' },
  ]);

  // Audio wave animation simulation
  const [audioBars, setAudioBars] = useState<number[]>([15, 30, 20, 40, 10, 25, 35, 10, 30, 15]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioBars(Array.from({ length: 12 }, () => Math.floor(Math.random() * 35) + 5));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpMessage.trim()) return;

    const newWish: Wish = {
      name: rsvpName,
      relation: rsvpAttendance === 'yes' ? 'Hadir' : 'Absen (Tidak Hadir)',
      message: rsvpMessage,
      attendance: rsvpAttendance,
      time: 'Baru Saja'
    };

    setWishes([newWish, ...wishes]);
    setIsRsvpSubmitted(true);
    setTimeout(() => {
      setIsRsvpSubmitted(false);
      setRsvpName('');
      setRsvpMessage('');
    }, 3000);
  };

  // Preset names for custom theme feels
  const names = {
    groom: theme.id === 'modern-minimal' ? 'Adrian Saputra' : theme.id === 'royal-elegancy' ? 'Raden Wijaya, S.T.' : 'Aris Setiadi',
    groomNick: theme.id === 'modern-minimal' ? 'Adrian' : theme.id === 'royal-elegancy' ? 'Wijaya' : 'Aris',
    bride: theme.id === 'modern-minimal' ? 'Bella Amanda' : theme.id === 'royal-elegancy' ? 'Dewi Puspita, M.B.A.' : 'Bella Rosita',
    brideNick: theme.id === 'modern-minimal' ? 'Bella' : theme.id === 'royal-elegancy' ? 'Dewi' : 'Bella',
    weddingDate: 'Minggu, 18 Oktober 2026',
    address: theme.id === 'royal-elegancy' ? 'Grand Ballroom Hotel Mulia, Jakarta Timur' : 'Pine Forest Villa, Lembang, Bandung'
  };

  const style = theme.style;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 flex items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      {/* WRAPPER */}
      <div className="bg-white w-full h-full sm:h-[92vh] sm:max-w-2xl sm:rounded-2xl shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* HEADER BAR FOR CONTROL */}
        <div className="bg-[#1a231b] text-white p-4 px-6 flex items-center justify-between shrink-0 z-10 border-b border-[#2d3a2f]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <div className="text-xs">
              <span className="text-gray-400">Mode Preview: </span>
              <span className="font-bold text-wedding-gold-light">{theme.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOrder}
              className="bg-wedding-gold hover:bg-wedding-gold-dark text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display shadow-md transition-all active:scale-95 flex items-center gap-1"
            >
              <Sparkles size={13} />
              <span>Order Tema Ini</span>
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition"
              aria-label="Tutup Preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MOCK APPLICATION BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto relative bg-wedding-cream scrollbar-thin">
          
          {/* MOCK MUSIC WAVEFLOATING BAR */}
          {isOpen && (
            <div className="fixed bottom-6 right-6 sm:absolute z-40 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-wedding-gold/35 flex items-center gap-3.5 transition-all">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2.5 rounded-full text-white transition-all ${isPlaying ? 'bg-wedding-gold animate-pulse' : 'bg-gray-400'}`}
              >
                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-5 pr-2">
                  {audioBars.map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-wedding-gold rounded-full transition-all duration-150"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN 1: THE INVITATION COVER */}
          {!isOpen ? (
            <div 
              className="absolute inset-0 flex flex-col justify-between items-center text-center p-8 transition-all duration-700 relative overflow-hidden"
              style={{ backgroundColor: style.backgroundColor }}
            >
              {/* Decorative backgrounds base on pattern selection */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#c39a56_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Top Ornaments */}
              <div className="mt-8 space-y-2 opacity-80">
                <div className={`text-xs uppercase tracking-widest font-mono text-gray-500`}>
                  Undangan Pernikahan
                </div>
                <div className="h-[2px] w-12 bg-wedding-gold mx-auto"></div>
              </div>

              {/* Groom & Bride Name Display */}
              <div className="my-auto space-y-6 px-4">
                <span className="text-wedding-gold font-serif text-lg tracking-wide block">The Wedding of</span>
                <h1 className={`text-4xl sm:text-5xl font-serif text-gray-900 font-extrabold italic tracking-tight leading-tight px-2`}>
                  {names.groomNick} <span className="font-serif text-wedding-gold-dark not-italic">&</span> {names.brideNick}
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm tracking-wide max-w-sm mx-auto">
                  Kepada Yth. Bapak/Ibu/Saudara/i <br />
                  <span className="font-bold text-gray-800 text-sm mt-1 inline-block border-b border-dashed border-gray-400 pb-0.5">Tamu Undangan Terhormat</span>
                </p>
                <div className="text-[10px] text-gray-400 italic">
                  *Kami mengundang Anda untuk merayakan momen kebahagiaan kami
                </div>
              </div>

              {/* Button "Buka Undangan" */}
              <div className="mb-12 relative z-10 w-full px-8">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setIsPlaying(true);
                  }}
                  className="w-full bg-gray-950 text-white hover:bg-gray-800 text-sm font-semibold tracking-wider uppercase py-4 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition active:scale-95 flex items-center justify-center gap-2"
                  style={{ backgroundColor: style.primaryColor }}
                >
                  <Heart size={16} className="text-white fill-white animate-pulse" />
                  <span>Buka Undangan</span>
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN 2: SCROLLABLE MAIN INVITATION BODY */
            <div className="space-y-12 pb-24 animate-fadeIn">
              
              {/* HERO WALLPAPER SECTION */}
              <div className="relative h-[45vh] bg-cover bg-center flex items-end p-6" style={{ backgroundImage: `url(${theme.imageUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="relative text-white space-y-2 w-full text-center">
                  <span className="text-wedding-gold-light font-serif italic text-sm">Save the Date</span>
                  <h2 className="text-3xl font-serif font-black">{names.groomNick} & {names.brideNick}</h2>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-wedding-champagne opacity-90 font-mono">
                    <Calendar size={13} />
                    <span>{names.weddingDate}</span>
                  </div>
                </div>
              </div>

              {/* WELCOME POEM / SURAH */}
              <div className="px-6 text-center max-w-md mx-auto space-y-4">
                <Heart className="text-wedding-gold mx-auto fill-wedding-gold-light/20" size={24} />
                <p className="text-sm italic text-gray-600 leading-relaxed font-serif">
                  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang..."
                </p>
                <span className="text-xs font-semibold text-wedding-gold-dark font-display uppercase tracking-widest block">
                  — Ar-Rum: 21
                </span>
              </div>

              {/* GROOM AND BRIDE PROFILE */}
              <div className="px-6 space-y-8 bg-wedding-cream/50 py-10 border-y border-wedding-gold/15">
                <h3 className="text-center font-serif text-2xl text-gray-900 font-bold tracking-tight">
                  Kedua Mempelai
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                  {/* GROOM COLUMN */}
                  <div className="bg-white/70 p-6 rounded-2xl border border-wedding-gold/10 space-y-3">
                    <div className="h-20 w-20 rounded-full bg-wedding-champagne mx-auto flex items-center justify-center font-serif text-3xl text-wedding-gold-dark font-extrabold shadow-sm border border-white">
                      ♂
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-gray-900">{names.groom}</h4>
                      <p className="text-xs text-gray-500 font-serif mt-1">Putra dari Bapak H. Hermawan & Ibu Hajah Susanti</p>
                    </div>
                  </div>

                  {/* BRIDE COLUMN */}
                  <div className="bg-white/70 p-6 rounded-2xl border border-wedding-gold/10 space-y-3">
                    <div className="h-20 w-20 rounded-full bg-wedding-champagne mx-auto flex items-center justify-center font-serif text-3xl text-wedding-gold-dark font-extrabold shadow-sm border border-white">
                      ♀
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-gray-900">{names.bride}</h4>
                      <p className="text-xs text-gray-500 font-serif mt-1">Putri dari Bapak Ir. Gunawan & Ibu Rahmawati</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIMELINE / AGENDA */}
              <div className="px-6 max-w-md mx-auto space-y-6">
                <h3 className="text-center font-serif text-2xl text-gray-900 font-bold tracking-tight mb-2">
                  Acara Spesial
                </h3>

                <div className="space-y-4">
                  {/* AKAD */}
                  <div className="bg-white rounded-2xl p-5 border border-wedding-gold/15 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-wedding-champagne text-wedding-gold-dark text-xs font-bold leading-none rounded-full">
                        Akad Nikah
                      </span>
                      <span className="text-xs text-gray-400 font-mono">08.00 - 10.00 WIB</span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-gray-900">Kediaman Mempelai Wanita</h4>
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <MapPin size={13} className="shrink-0 text-wedding-gold mt-0.5" />
                      <span>{names.address}</span>
                    </p>
                  </div>

                  {/* RECEPTION */}
                  <div className="bg-white rounded-2xl p-5 border border-wedding-gold/15 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-wedding-gold text-white text-xs font-bold leading-none rounded-full">
                        Resepsi Pernikahan
                      </span>
                      <span className="text-xs text-gray-400 font-mono">11.00 - Selesai</span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-gray-900">Grand Hall Villa</h4>
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <MapPin size={13} className="shrink-0 text-wedding-gold mt-0.5" />
                      <span>{names.address}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RSVP FORM & COMMENTS SIMULATOR */}
              <div className="px-6 max-w-md mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-wedding-gold/15 shadow-xs">
                  <h4 className="font-serif font-bold text-lg text-gray-900 text-center mb-1">
                    Konfirmasi Kehadiran (RSVP)
                  </h4>
                  <p className="text-gray-500 text-xs text-center mb-5">
                    Rencanakan kehadiran Anda dan kirimkan ucapan doa restu langsung
                  </p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama tamu undangan..."
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Jumlah Tamu</label>
                        <select
                          value={rsvpGuests}
                          onChange={(e) => setRsvpGuests(e.target.value)}
                          className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50"
                        >
                          <option value="1">1 Orang</option>
                          <option value="2">2 Orang</option>
                          <option value="3">3 Orang</option>
                          <option value="4">4 Orang atau lebih</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-1">Konfirmasi</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setRsvpAttendance('yes')}
                            className={`flex-1 py-3 text-xs font-semibold rounded-xl text-center border transition ${
                              rsvpAttendance === 'yes'
                                ? 'bg-wedding-gold border-wedding-gold text-white'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            Hadir
                          </button>
                          <button
                            type="button"
                            onClick={() => setRsvpAttendance('no')}
                            className={`flex-1 py-3 text-xs font-semibold rounded-xl text-center border transition ${
                              rsvpAttendance === 'no'
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            Absen
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Ucapan & Doa Restu</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tulis ucapan selamat & doa terbaik untuk kedua mempelai..."
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold font-sans bg-gray-50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-wedding-gold hover:bg-wedding-gold-dark text-white font-semibold text-xs py-3.5 px-4 rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-2 transition"
                    >
                      <Send size={13} />
                      <span>Kirim Konfirmasi</span>
                    </button>
                  </form>

                  {isRsvpSubmitted && (
                    <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle size={15} className="text-green-600 shrink-0" />
                      <span>Konfirmasi RSVP Anda berhasil disimpan dan didata!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* PUBLIC WISHES SCROLL */}
              <div className="px-6 max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                  <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <Users size={14} className="text-wedding-gold-dark" />
                    <span>Ucapan Tamu ({wishes.length})</span>
                  </h4>
                  <span className="text-[10px] text-gray-400">Terbuka untuk umum</span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {wishes.map((w, idx) => (
                    <div key={idx} className="bg-white/80 p-3.5 rounded-xl border border-gray-100/90 text-xs space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-gray-900">{w.name}</span>
                        <span className="text-gray-400 text-[10px]">{w.time}</span>
                      </div>
                      <div className="text-[10px] text-wedding-gold-dark uppercase font-mono tracking-wider font-semibold">
                        {w.relation} • {w.attendance === 'yes' ? 'Hadir' : 'Absen'}
                      </div>
                      <p className="text-gray-600 mt-1 italic leading-relaxed">
                        "{w.message}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
