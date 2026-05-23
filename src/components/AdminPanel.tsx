import React, { useState } from 'react';
import { Plus, Trash2, Tag, Eye, Layers, DollarSign, Palette, CheckCircle, HelpCircle, Package, ArrowLeft } from 'lucide-react';
import { Theme, ThemeStyle } from '../types';
import { formatRupiah } from '../data/themes';

interface AdminPanelProps {
  themes: Theme[];
  onAddTheme: (newTheme: Theme) => void;
  onDeleteTheme: (themeId: string) => void;
  onBackToKatalog: () => void;
}

export default function AdminPanel({ themes, onAddTheme, onDeleteTheme, onBackToKatalog }: AdminPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(199000);
  const [category, setCategory] = useState<'Modern' | 'Rustic' | 'Elegant' | 'Traditional' | 'Minimalist'>('Modern');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800');
  
  // Custom theme style properties
  const [primaryColor, setPrimaryColor] = useState('#8B7443'); // Gold
  const [secondaryColor, setSecondaryColor] = useState('#F9F6F0'); // Beige Cream
  const [fontHeading, setFontHeading] = useState<'font-serif' | 'font-sans' | 'font-display'>('font-serif');

  const [isSuccessMsg, setIsSuccessMsg] = useState(false);

  // Pre-configured elegant colors for prompt selection
  const COLOR_PRESETS = [
    { name: 'Royal Gold', primary: '#8B7443', secondary: '#F9F5F0' },
    { name: 'Forest Green', primary: '#2D4B39', secondary: '#F4F7F5' },
    { name: 'Warm Terracotta', primary: '#AC5D45', secondary: '#FAF5F2' },
    { name: 'Midnight Charcoal', primary: '#1E2522', secondary: '#F5F5F5' },
    { name: 'Rose Petal', primary: '#B2626F', secondary: '#FDFBFB' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !imageUrl.trim()) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newStyle: ThemeStyle = {
      primaryColor,
      secondaryColor,
      accentColor: primaryColor,
      backgroundColor: secondaryColor,
      fontHeading,
      bgPattern: 'floral-delicate'
    };

    const newTheme: Theme = {
      id: newId || `theme_${Date.now()}`,
      name,
      description,
      price: Number(price),
      views: 0,
      imageUrl,
      category,
      style: newStyle,
      features: [
        'Responsive Invitation Link',
        'Custom Bride & Groom Profile',
        'Direct RSVP RSVP Tracker',
        'Premium Audio Autoplay',
        'Live Countdown Timer & Google Maps Integration'
      ]
    };

    onAddTheme(newTheme);
    
    // Clear Form
    setName('');
    setDescription('');
    setPrice(199000);
    setImageUrl('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800');
    setIsSuccessMsg(true);
    setShowAddForm(false);
    setTimeout(() => setIsSuccessMsg(false), 3000);
  };

  const totalViews = themes.reduce((acc, t) => acc + (t.views || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={onBackToKatalog}
            className="text-xs font-semibold text-gray-500 hover:text-wedding-gold-dark mb-2 py-1 flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 w-fit transition"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>
          <h2 className="font-serif font-black text-2xl text-[#1E2522] tracking-tight uppercase">
            Halaman Admin Tema Undangan
          </h2>
          <p className="text-xs text-gray-500 font-mono tracking-wider uppercase font-semibold mt-0.5">Kelola & Tambah Tema Pernikahan Online</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-wedding-gold hover:bg-wedding-gold-dark text-white text-xs font-semibold py-3 px-5 rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-1.5 uppercase tracking-wider"
        >
          <Plus size={16} />
          <span>{showAddForm ? 'Batal Tambah' : 'Tambah Tema Baru'}</span>
        </button>
      </div>

      {isSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Sukses! Tema undangan baru berhasil dimasukkan ke katalog sistem dan disimpan di LocalStorage!</span>
        </div>
      )}

      {/* METRIC SUMMARIES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-wedding-champagne/40 flex items-center justify-center text-wedding-gold-dark">
            <Package size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block tracking-wider uppercase font-mono font-bold">Total Undangan Tema</span>
            <span className="text-xl font-bold font-serif text-[#1e2522]">{themes.length} Terdaftar</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Eye size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block tracking-wider uppercase font-mono font-bold">Akumulasi Total Views</span>
            <span className="text-xl font-bold font-serif text-[#1e2522]">{totalViews}x Pengunjung</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block tracking-wider uppercase font-mono font-bold">Keuntungan Penjualan</span>
            <span className="text-xl font-bold font-serif text-emerald-700">100% Persisten</span>
          </div>
        </div>
      </div>

      {/* ADD NEW THEME WIZARD FORM */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#fbf9f5] border-2 border-wedding-gold/20 rounded-2xl p-6 sm:p-8 space-y-6 animate-slideIn">
          <div className="border-b border-gray-150 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-black text-lg text-gray-950 flex items-center gap-1.5">
              <Palette className="text-wedding-gold" size={18} />
              <span>Form Input Kategori & Desain Tema Baru</span>
            </h3>
            <span className="text-[10px] bg-wedding-champagne text-wedding-gold-dark font-bold font-mono px-2 py-0.5 rounded uppercase">
              Admin Only
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nama Desain Tema <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Forest Pines, Classic Crimson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Singkat Keindahan Tema <span className="text-red-500">*</span></label>
                <textarea
                  required
                  placeholder="Ceritakan keistimewaan nuansa desain ini..."
                  value={description}
                  rows={2}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Harga Jasa Undangan (IDR) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Klasifikasi Kategori <span className="text-red-500">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold bg-white"
                  >
                    <option value="Modern">Modern</option>
                    <option value="Elegant">Elegant</option>
                    <option value="Rustic">Rustic</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Traditional">Traditional</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">URL Cover Wallpaper / Gambar Miniatur <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-hidden focus:border-wedding-gold bg-white font-mono"
                />
                <p className="text-[10px] text-gray-400 mt-1">Gunakan URL gambar Unsplash favorit Anda untuk me-load template wedding dengan lancar.</p>
              </div>

              <div className="p-4 bg-white border border-gray-150 rounded-xl space-y-3">
                <label className="text-xs font-bold text-gray-700 block">Konfigurasi Visual & Mood Warna</label>
                
                {/* Preschool preset choices */}
                <div className="grid grid-cols-5 gap-1.5">
                  {COLOR_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className="border border-gray-200 p-1.5 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 active:scale-95 transition"
                      title={preset.name}
                    >
                      <div className="h-4 w-4 rounded-full shadow-sm mb-1" style={{ backgroundColor: preset.primary }}></div>
                      <span className="text-[7.5px] text-gray-500 font-semibold truncate max-w-full leading-none">{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Warna Utama</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-gray-200"
                      />
                      <span className="text-xs font-mono">{primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Warna Latar Depan</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border border-gray-200"
                      />
                      <span className="text-xs font-mono">{secondaryColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Model Tipografi Judul (Fonts)</label>
                  <select
                    value={fontHeading}
                    onChange={(e) => setFontHeading(e.target.value as any)}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-hidden bg-white mt-1"
                  >
                    <option value="font-serif">Elegant Serif (Classic / Playfair)</option>
                    <option value="font-sans">Modern Sans (Slick / Inter)</option>
                    <option value="font-display">Unique Display (Architectural / Space)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-gray-150">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-3 border border-gray-200 hover:bg-gray-100 text-xs font-semibold rounded-xl text-gray-650 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-wedding-gold hover:bg-wedding-gold-dark text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Simpan Desain Baru
            </button>
          </div>
        </form>
      )}

      {/* ACTIVE THEME LIST CRUD WINDOW */}
      <div className="space-y-4">
        <h3 className="font-serif font-black text-lg text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <Layers className="text-wedding-gold-dark" size={16} />
          <span>Daftar Katalog Tema Aktif ({themes.length} Tema)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <div key={theme.id} className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img src={theme.imageUrl} alt={theme.name} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                <span className="absolute top-2.5 right-2 rounded-full px-2.5 py-1 bg-white/95 text-gray-800 text-[9px] font-bold border border-wedding-gold/15 shadow-sm uppercase tracking-wider font-mono">
                  {theme.category}
                </span>
                
                {/* Visual Primary Color Specimen dot */}
                <span className="absolute bottom-2 right-2 rounded-full h-5 w-5 border border-white shadow-xs" style={{ backgroundColor: theme.style.primaryColor }} title="Warna Tema" />
              </div>

              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-black text-sm text-gray-900 leading-tight block">{theme.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{theme.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-mono font-bold leading-none">HARGA</span>
                    <span className="text-[13px] font-bold text-wedding-gold-dark font-mono">{formatRupiah(theme.price)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono font-medium">
                    <Eye size={12} />
                    <span>{theme.views || 0}x</span>
                  </div>
                </div>
              </div>

              {/* Action Trail deletion and management */}
              <div className="bg-gray-50 p-2.5 px-4 border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[9px] text-gray-400 font-mono">ID: {theme.id}</span>
                
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Apakah Anda yakin ingin menghapus tema "${theme.name}" permanen dari katalog?`)) {
                      onDeleteTheme(theme.id);
                    }
                  }}
                  className="text-red-650 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                  title="Hapus Tema"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
