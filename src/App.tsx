import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Eye, Heart, HelpCircle, Layers, Calendar, ClipboardCheck, Clock, ShieldAlert, Award, FileSpreadsheet, LockKeyhole, ArrowRight, Activity } from 'lucide-react';
import { Theme, Order, Notification } from './types';
import { THEMES_DATA, formatRupiah } from './data/themes';
import Flowchart from './components/Flowchart';
import ThemePreviewModal from './components/ThemePreviewModal';
import CheckoutSection from './components/CheckoutSection';
import MyOrdersSection from './components/MyOrdersSection';
import NotificationSimulator from './components/NotificationSimulator';

export default function App() {
  // Navigation Navigation tab state
  const [activeTab, setActiveTab] = useState<'katalog' | 'order-saya' | 'flowchart'>('katalog');
  
  // Theme state with views count tracking
  const [themes, setThemes] = useState<Theme[]>(() => {
    const saved = localStorage.getItem('wedding_themes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return THEMES_DATA; }
    }
    return THEMES_DATA;
  });

  // Current selected category for catalog filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Orders list state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wedding_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    
    // Default initial mock successful order so they can inspect "Order Saya" immediately!
    const defaultSuccessOrder: Order = {
      id: 'ord_demo_royal',
      themeId: 'royal-elegancy',
      themeName: 'Royal Elegancy',
      customerName: 'Beni Alandra',
      customerEmail: 'beni.alandra@sat.co.id',
      customerPhone: '081293847291',
      groomName: 'Zaky Hidayat, S.Kom.',
      groomNickname: 'Zaky',
      brideName: 'Rara Amanda, M.B.A.',
      brideNickname: 'Rara',
      weddingDate: '2026-10-18',
      weddingTime: '09:00 WIB',
      weddingLocation: 'Grand Ballroom Hotel Mulia, Jakarta Timur',
      status: 'success',
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
      uniqueCode: 'WD-74621',
      musicChoice: 'Beautiful in White - Westlife',
      customMessage: 'Mohon doa restu agar acara kami dilancarkan selalu.'
    };

    return [defaultSuccessOrder];
  });

  // Active incomplete reservation draft order
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('wedding_active_order');
    if (saved) {
      try { 
        const order = JSON.parse(saved) as Order;
        // Verify if it didn't expire already
        if (new Date(order.expiresAt).getTime() > Date.now() && order.status === 'pending') {
          return order;
        }
      } catch (e) { }
    }
    return null;
  });

  // Currently ordering theme
  const [selectedOrderingTheme, setSelectedOrderingTheme] = useState<Theme | null>(null);

  // Previewing Theme modal
  const [previewingTheme, setPreviewingTheme] = useState<Theme | null>(null);

  // Notifications Queue Simulator
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Local clock state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Save changes helper
  useEffect(() => {
    localStorage.setItem('wedding_themes', JSON.stringify(themes));
  }, [themes]);

  useEffect(() => {
    localStorage.setItem('wedding_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('wedding_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('wedding_active_order');
    }
  }, [activeOrder]);

  // Handle local time
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // REAL-TIME AUTO EXPIRY REAPER (Checks every 1 second)
  // Reaps pending draf orders if more than 5 minutes have elapsed.
  useEffect(() => {
    const checkExpiry = () => {
      let changed = false;
      const now = Date.now();

      // Check current active order draft
      if (activeOrder && activeOrder.status === 'pending') {
        const expiresTime = new Date(activeOrder.expiresAt).getTime();
        if (now >= expiresTime) {
          setActiveOrder(null);
          changed = true;
          
          // Send virtual SMS/WhatsApp about expiration
          const expiredAlert: Notification = {
            id: `exp_${Math.random().toString(36).substring(2, 9)}`,
            type: 'whatsapp',
            to: activeOrder.customerPhone,
            uniqueCode: activeOrder.uniqueCode,
            message: `⚠️ *DRAF ORDER KEDALUWARSA* ⚠️\n\nHalo Kak ${activeOrder.customerName},\nMasa tenggang reservasi pembayaran 5 menit untuk tema *${activeOrder.themeName}* telah habis.\nDraf pesanan Anda dibatalkan secara otomatis demi efisiensi antrean server. Silakan buat pesanan baru jika ingin melanjutkan.`,
            timestamp: new Date().toLocaleTimeString('id-ID')
          };
          setNotifications(prev => [expiredAlert, ...prev]);
        }
      }

      // Check orders database
      const updatedOrders = orders.map(o => {
        if (o.status === 'pending') {
          const expiresTime = new Date(o.expiresAt).getTime();
          if (now >= expiresTime) {
            changed = true;
            return { ...o, status: 'expired' as const };
          }
        }
        return o;
      });

      if (changed) {
        setOrders(updatedOrders);
      }
    };

    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [activeOrder, orders]);

  // Atomic view tracking trigger when user previews theme layout
  const handlePreviewTheme = (theme: Theme) => {
    // Increment view count atomic
    const updated = themes.map(t => {
      if (t.id === theme.id) {
        return { ...t, views: t.views + 1 };
      }
      return t;
    });
    setThemes(updated);
    setPreviewingTheme(theme);
  };

  // Click to start ordering theme
  const handleInitiateOrder = (theme: Theme) => {
    // check if there's already an active reservation pending and NOT expired for THIS OR ANOTHER theme
    if (activeOrder && activeOrder.status === 'pending') {
      const expiresTime = new Date(activeOrder.expiresAt).getTime();
      if (Date.now() < expiresTime) {
        // Find theme
        const matchingTheme = themes.find(t => t.id === activeOrder.themeId) || theme;
        setSelectedOrderingTheme(matchingTheme);
        setActiveTab('katalog'); // stay or jump to checkout display
        alert(`ℹ️ Anda masih memiliki transaksi tertunda berdurasi 5 menit yang belum terselesaikan. Sistem otomatis memulihkan invoice Anda.`);
        return;
      }
    }

    // Otherwise, start fresh order form
    setSelectedOrderingTheme(theme);
  };

  // Executed from CheckoutSection once Order object is built (status: pending)
  const handleOrderCreated = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
  };

  // Executed from CheckoutSection when payment simulation succeeds
  const handlePaymentSuccess = (pendingOrder: Order) => {
    const updatedOrders = orders.map(o => {
      if (o.id === pendingOrder.id) {
        return { ...o, status: 'success' as const };
      }
      return o;
    });
    setOrders(updatedOrders);
    
    // Clear active temporary draft
    setActiveOrder(null);
    setSelectedOrderingTheme(null);
    
    // Redirect instantly to My Orders tab
    setActiveTab('order-saya');
    
    // Set success alert
    setTimeout(() => {
      alert(`🎉 Selamat! Pembayaran Anda sukses diverifikasi. Anda sekarang masuk ke halaman kelola menggunakan Kode Akses ${pendingOrder.uniqueCode}.`);
    }, 100);
  };

  const handleUpdateOrderDetails = (updatedOrder: Order) => {
    const updated = orders.map(o => (o.id === updatedOrder.id ? updatedOrder : o));
    setOrders(updated);
  };

  // Filter themes based on interactive category selections
  const filteredThemes = selectedCategory === 'Semua' 
    ? themes 
    : themes.filter(t => t.category === selectedCategory);

  const categories = ['Semua', 'Modern', 'Elegant', 'Rustic', 'Minimalist', 'Traditional'];

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-wedding-gold/20 font-sans">
      
      {/* GLOBAL SYSTEM LEVEL ANNOUNCEMENT TO SHOW ACTIVE RESERVATIONS TIMEOUTS */}
      {activeOrder && activeOrder.status === 'pending' && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-2.5 px-4 flex items-center justify-between shadow-md relative z-30 animate-pulse">
          <div className="flex items-center gap-1.5 mx-auto text-center">
            <ShieldAlert size={14} className="shrink-0 animate-spin" />
            <span>
              Reservasi Pembayaran Aktif untuk draf <strong>{activeOrder.groomNickname} & {activeOrder.brideNickname}</strong> ({activeOrder.themeName}) sedang dikunci selama 5 menit.
            </span>
            <button 
              onClick={() => {
                const mathTheme = themes.find(t => t.id === activeOrder.themeId) || themes[0];
                setSelectedOrderingTheme(mathTheme);
                // jump directly
              }}
              className="ml-2 underline font-extrabold hover:text-wedding-champagne uppercase font-display bg-amber-800 px-2 py-0.5 rounded"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}

      {/* HEADER ACTION TRAIL */}
      <header className="sticky top-0 bg-wedding-cream/95 backdrop-blur-md border-b border-wedding-champagne/80 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-wedding-gold-dark flex items-center justify-center text-wedding-cream shadow-xs">
              <Heart size={21} className="fill-wedding-cream animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-serif font-black text-lg text-wedding-gold-dark tracking-tight leading-none uppercase">
                  Wedding Online
                </h1>
                <span className="h-1.5 w-1.5 rounded-full bg-wedding-gold"></span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase font-semibold mt-0.5">E-Commerce Agency</p>
            </div>
          </div>

          {/* CENTRE TABS PIP */}
          <nav className="hidden md:flex items-center gap-1.5 bg-wedding-champagne/40 p-1.5 rounded-full border border-wedding-champagne/70">
            <button
              onClick={() => {
                setActiveTab('katalog');
                setSelectedOrderingTheme(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold font-display transition duration-200 flex items-center gap-1.5 ${
                activeTab === 'katalog' && !selectedOrderingTheme
                  ? 'bg-wedding-gold-dark text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Katalog Tema</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('order-saya');
                setSelectedOrderingTheme(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold font-display transition duration-200 flex items-center gap-1.5 relative ${
                activeTab === 'order-saya'
                  ? 'bg-wedding-gold-dark text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              <LockKeyhole size={14} />
              <span>Lacak Order Saya</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wedding-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-wedding-gold"></span>
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('flowchart');
                setSelectedOrderingTheme(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold font-display transition duration-200 flex items-center gap-1.5 ${
                activeTab === 'flowchart'
                  ? 'bg-wedding-gold-dark text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              <Layers size={14} />
              <span>Alur & Flowchart</span>
            </button>
          </nav>

          {/* SECURE REAL-TIME METRICS */}
          <div className="flex items-center gap-3.5">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-400 block tracking-wider font-mono font-bold uppercase">Waktu Sistem Server</span>
              <span className="text-xs font-semibold font-mono text-gray-800">{currentTime || 'Loading...'}</span>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono tracking-wider font-bold p-1 py-1.5 px-3 rounded-lg border border-emerald-200/50 flex items-center gap-1">
              <Activity size={12} className="text-emerald-600 shrink-0" />
              <span>OTP GATEWAY ACTIVE</span>
            </span>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION DRAWER */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 z-30 flex justify-around py-3 px-2 shadow-xl shrink-0">
        <button
          onClick={() => {
            setActiveTab('katalog');
            setSelectedOrderingTheme(null);
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'katalog' && !selectedOrderingTheme ? 'text-wedding-gold-dark' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <ShoppingBag size={18} />
          <span>Katalog</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('order-saya');
            setSelectedOrderingTheme(null);
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'order-saya' ? 'text-wedding-gold-dark' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <LockKeyhole size={18} />
          <span>Lacak Order</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('flowchart');
            setSelectedOrderingTheme(null);
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'flowchart' ? 'text-wedding-gold-dark' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <Layers size={18} />
          <span>Alur & Flow</span>
        </button>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12 space-y-12">
        
        {/* INTERACTIVE STATE-CONTROL CHEKOUT DISPLAY */}
        {selectedOrderingTheme ? (
          <div className="animate-fadeIn">
            <CheckoutSection
              theme={selectedOrderingTheme}
              activeOrder={activeOrder}
              onOrderCreated={handleOrderCreated}
              onPaymentSuccess={handlePaymentSuccess}
              onCancelCheckout={() => setSelectedOrderingTheme(null)}
              addNotification={(n) => setNotifications(prev => [n, ...prev])}
            />
          </div>
        ) : (
          <>
            {/* CENTRAL TABS CONTROL */}
            {activeTab === 'katalog' && (
              <div className="space-y-10">
                {/* HERO PROMOTIONAL BOX */}
                <div className="bg-gradient-to-br from-[#2f392f] to-[#1e2520] text-wedding-cream rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-wedding-gold/20 shadow-lg">
                  
                  {/* Decorative faint patterns */}
                  <div className="absolute inset-x-0 bottom-0 opacity-15 h-35 pointer-events-none bg-[radial-gradient(#ebe7de_1px,transparent_1px)] [background-size:20px_20px]"></div>

                  <div className="relative max-w-2xl space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-wedding-gold/20 text-wedding-gold-light border border-wedding-gold-light/10">
                      <Sparkles size={12} className="text-wedding-gold-light animate-pulse" />
                      <span>Sistem E-Commerce Pemesanan Instan</span>
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight leading-tight text-white">
                      Undangan Pernikahan Online <br />
                      Premium Tanpa Akun & Password
                    </h2>

                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
                      Jelajahi berbagai pilihan tema premium yang dinamis dengan konsep e-commerce modern. Cepat dibuat, dapat diubah kapan saja sendiri tanpa daftar akun baru. Kami mengintegrasikan <strong className="text-wedding-gold-light">Kunci Reservasi 5 Menit</strong> pada halaman pembayaran demi efisiensi antrean server.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('flowchart')}
                        className="bg-wedding-gold hover:bg-wedding-gold-dark text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 transition"
                      >
                        <span>Lihat Alur & Flowchart</span>
                        <ArrowRight size={13} />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('order-saya');
                        }}
                        className="bg-transparent border border-wedding-gold-light/30 hover:bg-wedding-gold-light/10 text-wedding-gold-light hover:text-white text-xs font-semibold py-3 px-5 rounded-xl transition"
                      >
                        Kelola Undangan Saya
                      </button>
                    </div>
                  </div>
                </div>

                {/* THEME FILTER & CONTROLS */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h3 className="font-display font-black text-xl text-gray-950 tracking-tight flex items-center gap-2">
                        Pilih Desain Tema Undangan
                      </h3>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Klik tombol Preview untuk melihat undangan live atau tombol Order untuk memesan secara instan.
                      </p>
                    </div>

                    {/* Category Tab options */}
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`p-1.5 px-3.5 rounded-lg text-xs font-semibold transition font-display ${
                            selectedCategory === cat
                              ? 'bg-wedding-gold text-white shadow-xs'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-55'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCTS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredThemes.map((theme) => (
                      <div 
                        key={theme.id}
                        className="bg-white rounded-2xl border border-wedding-champagne/90 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-wedding-gold hover:shadow-md transition duration-300 transform hover:translate-y-[-2px]"
                      >
                        {/* COVER IMAGE */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={theme.imageUrl}
                            alt={theme.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="absolute top-3 left-3 bg-[#445445]/90 backdrop-blur-xs text-white p-1 px-3 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                            <span>{theme.category}</span>
                          </div>

                          {/* Views meter */}
                          <div className="absolute bottom-3 right-3 bg-wedding-cream/95 backdrop-blur-2xs text-[#445445] p-1.5 px-3 rounded-lg text-[10px] font-bold font-mono tracking-tight flex items-center gap-1 shadow-xs border border-wedding-champagne">
                            <Eye size={12} className="text-wedding-gold" />
                            <span>{theme.views} Dilihat</span>
                          </div>
                        </div>

                        {/* PRODUCT CONTENT TITLE */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif font-bold text-base text-gray-950">
                                {theme.name}
                              </h4>
                              <span className="font-display font-extrabold text-sm text-wedding-gold-dark">
                                {formatRupiah(theme.price)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                              {theme.description}
                            </p>
                          </div>

                          {/* ACTION BUTTON TRAY */}
                          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-wedding-cream">
                            <button
                              onClick={() => handlePreviewTheme(theme)}
                              className="w-full p-2.5 border border-wedding-champagne hover:bg-wedding-champagne/40 hover:border-wedding-gold-light text-xs font-semibold rounded-xl text-gray-700 transition flex items-center justify-center gap-1"
                            >
                              <Eye size={13} />
                              <span>Preview Tema</span>
                            </button>

                            <button
                              onClick={() => handleInitiateOrder(theme)}
                              className="w-full bg-wedding-gold-dark hover:bg-wedding-gold text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <span>Order Jasa</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'order-saya' && (
              <div className="py-2 animate-fadeIn">
                <MyOrdersSection
                  orders={orders}
                  onUpdateOrder={handleUpdateOrderDetails}
                  onOpenInvitationPreview={(themeId, customData) => {
                    const themeObj = themes.find(t => t.id === themeId) || themes[0];
                    // Open modal simulation but with customizable names
                    setPreviewingTheme(themeObj);
                  }}
                  dummyCode="WD-74621"
                />
              </div>
            )}

            {activeTab === 'flowchart' && (
              <div className="py-2 animate-fadeIn">
                <Flowchart />
              </div>
            )}
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#1a231b] text-stone-300 border-t border-[#2d3a2f] py-10 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="font-serif font-black text-sm text-white uppercase tracking-wider">
              Wedding Online invitation Store
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">
              © 2026 Google AI Studio Build. Semua Hak Cipta Dilindungi.
            </p>
          </div>

          <div className="flex gap-4 text-xs">
            <button onClick={() => { setActiveTab('katalog'); setSelectedOrderingTheme(null); }} className="hover:text-white transition">Katalog Tema</button>
            <span>•</span>
            <button onClick={() => { setActiveTab('order-saya'); setSelectedOrderingTheme(null); }} className="hover:text-white transition">Order Saya</button>
            <span>•</span>
            <button onClick={() => { setActiveTab('flowchart'); setSelectedOrderingTheme(null); }} className="hover:text-white transition">Alur & Flowchart</button>
          </div>
        </div>
      </footer>

      {/* POPUP MODAL: LIVE PREVIEW INVITATIONS */}
      {previewingTheme && (
        <ThemePreviewModal
          theme={previewingTheme}
          onClose={() => setPreviewingTheme(null)}
          onOrder={() => {
            const theme = previewingTheme;
            setPreviewingTheme(null);
            handleInitiateOrder(theme);
          }}
        />
      )}

      {/* BACKEND SIMULATED NOTIFICATION DIALOG ON MOBILE & DESKTOP LEFT SLEEVE */}
      <NotificationSimulator
        notifications={notifications}
        onOpenMyOrdersWithCode={(code) => {
          setActiveTab('order-saya');
          setSelectedOrderingTheme(null);
          // Auto-fill access on dasbor if needed by state, we can simulate typing
        }}
        onClear={() => setNotifications([])}
      />

    </div>
  );
}
