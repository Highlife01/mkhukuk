import React from 'react';
import { MessageCircle, X, Gavel, FileText, Scale, ShieldCheck, ChevronRight } from 'lucide-react';

interface WhatsAppAssistantProps {
  onClose: () => void;
}

const WhatsAppAssistant: React.FC<WhatsAppAssistantProps> = ({ onClose }) => {
  const options = [
    { 
      title: "Hukuki Destek Alma", 
      desc: "Hukuki sorularınız için anında uzman desteği alın",
      icon: <MessageCircle size={20} className="text-blue-500" />
    },
    { 
      title: "Yargıtay ve BAM Kararı Arama", 
      desc: "Emsal kararlar ve içtihatlar için arama yapın",
      icon: <Scale size={20} className="text-amber" />
    },
    { 
      title: "Dava Dilekçesi Hazırlama", 
      desc: "Yapay zeka ile hızlı ve profesyonel dilekçeler oluşturun",
      icon: <FileText size={20} className="text-purple-500" />
    },
    { 
      title: "Sözleşme Hazırlama", 
      desc: "Özelleştirilmiş sözleşme şablonları oluşturun",
      icon: <ShieldCheck size={20} className="text-green-500" />
    }
  ];

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-border/40 w-full max-w-md animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="bg-[#f0f9f4] p-6 flex items-center justify-between border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl text-white shadow-lg shadow-green-500/20">
            <MessageCircle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[#075e54] font-black text-lg font-display">WhatsApp Hukuki Asistan</h3>
              <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">YENİ</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-white/50 p-2 rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-body">
          Av. Mahmut Kaya yapay zeka destekli hukuk asistanınız artık WhatsApp üzerinden cebinizde. 
          Aşağıdaki hizmetlerden dilediğinizi seçerek WhatsApp asistanınıza soru sorarak hemen kullanmaya başlayabilirsiniz.
        </p>

        <div className="space-y-3">
          {options.map((option, i) => (
            <button 
              key={i}
              className="w-full text-left p-4 rounded-2xl border border-border/40 hover:border-green-500/30 hover:bg-green-50/30 transition-all duration-300 group flex items-start gap-4"
              onClick={() => {
                const text = encodeURIComponent(`Merhaba, ${option.title} hakkında bilgi almak istiyorum.`);
                window.open(`https://wa.me/905322026799?text=${text}`, '_blank');
              }}
            >
              <div className="bg-card p-3 rounded-xl border border-border/40 shadow-sm group-hover:scale-110 transition-transform">
                {option.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 font-display group-hover:text-green-600 transition-colors">{option.title}</h4>
                <p className="text-xs text-slate-500 font-body mt-1">{option.desc}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-green-500 transition-colors mt-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-50/50 border-t border-border/40">
        <button 
          className="w-full bg-[#25d366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 transition-all active:scale-95"
          onClick={() => window.open('https://wa.me/905322026799', '_blank')}
        >
          <MessageCircle size={20} />
          WhatsApp'ta Başla
        </button>
      </div>
    </div>
  );
};

export default WhatsAppAssistant;
