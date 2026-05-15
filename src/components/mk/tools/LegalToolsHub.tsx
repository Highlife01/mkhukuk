import React from 'react';
import { 
  Calculator, 
  FileText, 
  Search, 
  Scale, 
  Briefcase, 
  Building, 
  UserCheck, 
  Globe, 
  Mic, 
  ShieldCheck,
  Zap,
  ChevronRight,
  TrendingUp,
  FileDigit,
  MapPin,
  Home
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  onClick: (id: string) => void;
  badge?: string;
  isNew?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ id, title, description, icon, category, onClick, badge, isNew }) => (
  <button 
    onClick={() => onClick(id)}
    className="group relative bg-white border border-[#c9a84c]/10 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a84c]/5 hover:border-[#c9a84c]/30 hover:-translate-y-1 overflow-hidden"
  >
    {isNew && (
      <div className="absolute top-0 right-0">
        <div className="bg-[#c9a84c] text-[#0f1e3d] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-tighter">YENİ</div>
      </div>
    )}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-[#f8f5ef] border border-[#c9a84c]/10 rounded-xl flex items-center justify-center text-[#0f1e3d] group-hover:bg-[#0f1e3d] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest">{category}</span>
          {badge && <span className="bg-[#1d9e75]/10 text-[#1d9e75] text-[9px] px-1.5 py-0.5 rounded font-bold">{badge}</span>}
        </div>
        <h3 className="font-display font-bold text-[#0f1e3d] text-base group-hover:text-[#c9a84c] transition-colors mb-2">{title}</h3>
        <p className="text-[#6b7280] text-xs leading-relaxed line-clamp-2">{description}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-end">
      <div className="text-[11px] font-bold text-[#0f1e3d] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Uygulamayı Aç <ChevronRight size={14} />
      </div>
    </div>
  </button>
);

const LegalToolsHub: React.FC<{ onSelectTool: (id: string) => void }> = ({ onSelectTool }) => {
  const { t } = useTranslation();

  const tools = [
    {
      id: 'vekalet-ucreti',
      title: 'Vekalet Ücreti Hesaplama',
      description: '2024-2025 AAÜT tarifesine göre avukatlık ücreti hesaplayın.',
      icon: <Calculator size={24} />,
      category: 'HESAPLAMA',
      badge: '2025 Güncel'
    },
    {
      id: 'kira-artis',
      title: 'Kira Artış Hesaplama',
      description: 'TÜFE oranlarına göre yasal kira artış sınırlarını hesaplayın.',
      icon: <TrendingUp size={24} />,
      category: 'HESAPLAMA'
    },
    {
      id: 'tazminat-hesabi',
      title: 'Kıdem ve İhbar Tazminatı',
      description: 'İşten ayrılma durumunda yasal tazminat haklarınızı hesaplayın.',
      icon: <Zap size={24} />,
      category: 'İŞ HUKUKU'
    },
    {
      id: 'yargilama-gideri',
      title: 'Yargılama Gideri Hesaplama',
      description: 'Farklı mahkeme türleri için harç ve masraf tahmini yapın.',
      icon: <Scale size={24} />,
      category: 'HESAPLAMA'
    },
    {
      id: 'udf-editor',
      title: 'Online UDF Editör',
      description: 'UYAP uyumlu UDF dosyalarını tarayıcı üzerinden düzenleyin.',
      icon: <FileText size={24} />,
      category: 'BELGE',
      isNew: true
    },
    {
      id: 'ses-metin',
      title: 'Sesle Metin Yaz',
      description: 'Hukuki terminolojiye duyarlı sesli yazım aracı.',
      icon: <Mic size={24} />,
      category: 'YAPAY ZEKA'
    },
    {
      id: 'icra-kapak',
      title: 'İcra Kapak Hesabı',
      description: 'İcra dosyası kapak hesabı ve borç dökümü oluşturun.',
      icon: <Building size={24} />,
      category: 'İCRA'
    },
    {
      id: 'arac-deger-kaybi',
      title: 'Araç Değer Kaybı',
      description: 'Trafik kazası sonrası araç değer kaybı tazminatı hesaplayın.',
      icon: <ShieldCheck size={24} />,
      category: 'SİGORTA'
    },
    {
      id: 'nufus-analiz',
      title: 'Nüfus Analiz Sistemi',
      description: 'Hukuki davalar için demografik ve nüfus analizleri.',
      icon: <UserCheck size={24} />,
      category: ' ANALİZ'
    },
    {
        id: 'konsolosluk-sorgu',
        title: 'Konsolosluk Sorgulama',
        description: 'Bulunulan bölgeye göre yetkili konsoloslukları bulun.',
        icon: <Globe size={24} />,
        category: 'ADRES'
    },
    {
        id: 'adliye-sorgu',
        title: 'Kapanan Adliye Sorgulama',
        description: 'Kapatılan veya birleştirilen adliyelerin akıbetini sorgulayın.',
        icon: <MapPin size={24} />,
        category: 'SORGULAMA'
    },
    {
        id: 'belge-ozetleme',
        title: 'Hukuki Belge Özetleme',
        description: 'Yapay zeka ile uzun dava dosyalarını saniyeler içinde özetleyin.',
        icon: <FileDigit size={24} />,
        category: 'YAPAY ZEKA',
        isNew: true
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#0f1e3d] flex items-center gap-2">
            <Briefcase className="text-[#c9a84c]" /> Hukuki Araçlar Portalı
          </h2>
          <p className="text-[#6b7280] text-sm mt-1">Tüm hesaplama ve yönetim araçlarına tek bir noktadan erişin.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
             <input 
               type="text" 
               placeholder="Araç ara..."
               className="bg-white border border-[#c9a84c]/20 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]/30 text-[#0f1e3d] font-medium transition-all w-64"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard 
            key={tool.id}
            {...tool}
            onClick={onSelectTool}
          />
        ))}
      </div>

      <div className="bg-[#0f1e3d] rounded-3xl p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a84c]/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-[#c9a84c]/20 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#c9a84c] w-16 h-16 rounded-2xl flex items-center justify-center text-[#0f1e3d]">
            <Zap size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-display font-bold mb-2">Yapay Zeka Destekli Hukuk Asistanı</h3>
            <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
              Müvekkil görüşmelerinizden belge özetlemeye kadar tüm süreçleri yapay zeka ile optimize edin. 
              Daha gelişmiş özellikler için ofis yönetim modülünü ziyaret edin.
            </p>
          </div>
          <button className="bg-white text-[#0f1e3d] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#0f1e3d] transition-all whitespace-nowrap">
            Hemen Keşfet
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalToolsHub;
