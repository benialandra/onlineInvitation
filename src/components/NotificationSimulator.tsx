import React, { useState } from 'react';
import { Mail, MessageSquare, Clipboard, Check, BellRing, ArrowRight, Sparkles, X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationSimulatorProps {
  notifications: Notification[];
  onOpenMyOrdersWithCode: (code: string) => void;
  onClear: () => void;
}

export default function NotificationSimulator({
  notifications,
  onOpenMyOrdersWithCode,
  onClear
}: NotificationSimulatorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (notifications.length === 0) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 left-6 z-40 bg-zinc-900 border border-zinc-800 text-white rounded-full p-4.5 shadow-xl flex items-center gap-2.5 hover:bg-zinc-805 transition-all animate-bounce"
        title="Buka Inbox Notifikasi Simulasi"
      >
        <BellRing size={18} className="text-wedding-gold animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-wider uppercase">
          Simulasi WA/Email ({notifications.length})
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-zinc-950 border border-zinc-800 rounded-2xl w-80 max-h-96 shadow-2xl overflow-hidden flex flex-col justify-between">
      
      {/* HEADER TRAIL */}
      <div className="bg-zinc-900 text-white p-3.5 px-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <BellRing size={14} className="text-wedding-gold-light" />
          <span className="font-mono font-extrabold uppercase tracking-wide text-[10px] text-zinc-300">
            Inbox Notifikasi Gateway (Simulator)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-[9px] uppercase font-mono tracking-wider font-semibold bg-zinc-950 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded transition"
          >
            Clear
          </button>
          
          <button
            onClick={() => setMinimized(true)}
            className="text-zinc-500 hover:text-white"
            title="Minimize"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* BODY INBOX FEED */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 max-h-72 scrollbar-thin">
        <p className="text-[10px] text-zinc-500 leading-normal font-sans italic text-center pb-2 border-b border-zinc-900">
          *Pesan ini dikirimkan ke Email/WhatsApp pembeli secara virtual karena kendala sandbox browser. Salin kode unik untuk masuk halaman "Order Saya".
        </p>

        {notifications.map((n) => {
          const isWhatsApp = n.type === 'whatsapp';
          return (
            <div key={n.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 space-y-2 text-xs animate-fadeIn">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  {isWhatsApp ? (
                    <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-green-400 uppercase bg-green-500/10 p-0.5 px-1.5 rounded">
                      <MessageSquare size={10} /> WhatsApp
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 p-0.5 px-1.5 rounded">
                      <Mail size={10} /> Email
                    </span>
                  )}
                  <span className="text-zinc-500">→</span>
                  <span className="text-zinc-300 font-mono font-semibold max-w-[90px] truncate" title={n.to}>
                    {n.to}
                  </span>
                </div>
                <span className="text-zinc-500 font-mono italic">{n.timestamp}</span>
              </div>

              {n.subject && (
                <div className="text-[10px] font-bold text-wedding-gold-light uppercase tracking-tight truncate">
                  Subjek: {n.subject}
                </div>
              )}

              <div className="text-zinc-300 font-mono text-[10.5px] leading-relaxed whitespace-pre-line bg-zinc-950/45 p-2 rounded border border-zinc-900 max-h-28 overflow-y-auto scrollbar-thin">
                {n.message}
              </div>

              {/* QUICK KEY ACTIONS COOP */}
              <div className="pt-1.5 flex gap-2">
                <button
                  onClick={() => handleCopyCode(n.uniqueCode, n.id)}
                  className="flex-1 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white p-1 rounded font-mono font-medium flex items-center justify-center gap-1 transition"
                >
                  {copiedId === n.id ? (
                    <>
                      <Check size={11} className="text-green-400" />
                      <span className="text-green-400 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Clipboard size={11} />
                      <span>Salin Kunci ({n.uniqueCode})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenMyOrdersWithCode(n.uniqueCode)}
                  className="bg-wedding-gold text-white text-[10px] font-bold py-1 px-2.5 rounded hover:bg-wedding-gold-dark transition flex items-center gap-1 font-sans"
                >
                  <span>Gunakan</span>
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
