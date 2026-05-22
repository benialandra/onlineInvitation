import { Theme } from '../types';

export const THEMES_DATA: Theme[] = [
  {
    id: 'rustic-bloom',
    name: 'Rustic Bloom',
    description: 'Sentuhan alam pedesaan yang hangat dengan kombinasi warna sage green, kayu alami, dan bebungaan liar yang menawan.',
    price: 149000,
    views: 412,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    category: 'Rustic',
    style: {
      primaryColor: '#2d4a43', // Sage dark
      secondaryColor: '#a3b899', // Sage light
      accentColor: '#bfa37a', // Earthy gold
      backgroundColor: '#f5f2eb', // Ivory warm
      fontHeading: 'font-serif',
      bgPattern: 'floral-mural'
    },
    features: [
      'Animasi Kelopak Bunga Berguguran',
      'Galeri Foto Grid Rustik',
      'Sistem RSVP Real-time Terintegrasi',
      'Peta Kustom Navigasi Google Maps',
      'Backsound Instrumen Akustik Romantis'
    ]
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Kemewahan dalam kesederhanaan. Desain minimalis kekinian dengan layout bento grid, garis-garis bersih, dan tipografi estetis.',
    price: 129000,
    views: 589,
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600',
    category: 'Minimalist',
    style: {
      primaryColor: '#171717', // Charcoal black
      secondaryColor: '#737373', // Neutrals
      accentColor: '#db2777', // Rose blush accent
      backgroundColor: '#fafafa', // Snow white
      fontHeading: 'font-display',
      bgPattern: 'clean'
    },
    features: [
      'Tampilan Mobile-first Premium',
      'Hitung Mundur Pernikahan Elegan',
      'Layout Album Foto Minimalis',
      'Ucapan & Doa Kolom Berita',
      'Musik Latar Lofi Piano'
    ]
  },
  {
    id: 'royal-elegancy',
    name: 'Royal Elegancy',
    description: 'Kemegahan istana kerajaan dengan hiasan emas berkilau, ilustrasi ukiran klasik, dan bingkai ornamen simetris nan megah.',
    price: 199000,
    views: 824,
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
    category: 'Elegant',
    style: {
      primaryColor: '#1e293b', // Royal Indigo
      secondaryColor: '#c39a56', // Metallic Gold
      accentColor: '#94a3b8', // Silver trim
      backgroundColor: '#fcfbf7', // Pearl Ivory
      fontHeading: 'font-serif',
      bgPattern: 'damask-gold'
    },
    features: [
      'Animasi Transisi Halaman Mewah',
      'Kolom Gift/Kado Digital (Bank & E-wallet)',
      'Video Background Header',
      'Penghitung RSVP Canggih',
      'Musik Orkestra Romantis Klasik'
    ]
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    description: 'Nuansa hutan tropis yang rimbun dengan hijau emerald pekat dipadu aksen emas tipis yang romantis dan menenangkan jiwa.',
    price: 159000,
    views: 301,
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600',
    category: 'Modern',
    style: {
      primaryColor: '#064e3b', // Emerald dark
      secondaryColor: '#34d399', // Emerald mint
      accentColor: '#fbbf24', // Sun Gold
      backgroundColor: '#f0fdf4', // Pastel green
      fontHeading: 'font-serif',
      bgPattern: 'leaf-outline'
    },
    features: [
      'Animasi Efek Daun Rimbun Jatuh',
      'Galeri Slide Estetis',
      'Buku Tamu Digital Responsif',
      'Peta Lokasi Instan',
      'Kombinasi Musik Forest Ambience & Violin'
    ]
  },
  {
    id: 'celestial-gold',
    name: 'Celestial Stars',
    description: 'Pernikahan di bawah taburan bintang malam cosmic. Desain gelap memikat dengan taburan konstelasi rasi bintang nan megah.',
    price: 179000,
    views: 652,
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600',
    category: 'Elegant',
    style: {
      primaryColor: '#0f172a', // Starry Navy
      secondaryColor: '#fbbf24', // Star gold
      accentColor: '#38bdf8', // Starlight blue
      backgroundColor: '#090d16', // Deep sky
      fontHeading: 'font-display',
      bgPattern: 'constellation'
    },
    features: [
      'Animasi Partikel Bintang Kelip',
      'Pemandangan Rasi Bintang Interaktif',
      'Kombinasi QR Code Amplop Digital',
      'Integrasi Musik Latar Harp & Ambient Synth',
      'Buku Tamu dengan Balon Ucapan Efek Mengambang'
    ]
  },
  {
    id: 'traditional-heritage',
    name: 'Traditional Heritage',
    description: 'Eksotika warisan adat nusantara yang luhur dengan ornamen batik klasik megah, menyatu dalam tata letak yang profesional.',
    price: 189000,
    views: 265,
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
    category: 'Traditional',
    style: {
      primaryColor: '#451a03', // Java Mahogany
      secondaryColor: '#d97706', // Warm Amber
      accentColor: '#b45309', // Terracotta
      backgroundColor: '#fdfaf2', // Batik Cream
      fontHeading: 'font-serif',
      bgPattern: 'batik-motif'
    },
    features: [
      'Ornamen Bingkai Etnik Interaktif',
      'Galeri Multi-Adat Nusantara',
      'Integrasi Google Maps & Waze',
      'Buku Ucapan Model Gulungan Kuno',
      'Pilihan Gamelan / Musik Adat Instrumen Lembut'
    ]
  }
];

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
