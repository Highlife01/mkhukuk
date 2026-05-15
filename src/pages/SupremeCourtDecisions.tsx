import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Gavel, Search, Filter, Calendar, FileText, ChevronRight, 
  ArrowRight, Download, Share2, Bookmark, Scale
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useSeo } from '@/hooks/useSeo';
import { useWebsitePage } from '@/hooks/useWebsitePage';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const SupremeCourtDecisions = () => {
  const { t } = useTranslation();
  const { page } = useWebsitePage('decisions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChamber, setSelectedChamber] = useState('Tümü');
  const [selectedYear, setSelectedYear] = useState('Tümü');

  useSeo({
    title: page?.title || 'Yargıtay Kararları',
    description: page?.description || 'MK Hukuk Yargıtay emsal karar arama motoru. Güncel içtihatlar, daire kararları ve hukuki emsallere hızlı erişim.',
    url: 'https://mkhukuk.web.app/yargitay-kararlari',
  });

  const [decisions, setDecisions] = useState<any[]>([
    {
      id: 1,
      chamber: "4. Hukuk Dairesi",
      category: "Hukuk Daireleri",
      caseNo: "2026/830 E.",
      decisionNo: "2026/931 K.",
      date: "21.01.2026",
      year: "2026",
      summary: "Çevre hukukuna ilişkin uyuşmazlıklarda görevli mahkemenin tayini ve bölge adliye mahkemesi kararlarının temyiz incelemesi süreçleri.",
      tags: ["Çevre Hukuku", "Görev İtirazı", "İstinaf"],
      content: "Yargıtay 5. Hukuk Dairesi tarafından temyiz inceleme görevinin Dairemize ait olduğu gerekçesiyle gönderilen dava dosyası üzerinde yapılan ön incelemede; dava konusu uyuşmazlığın niteliği ve temyizin kapsamının, çevre hukukuna ilişkin olduğu anlaşılmıştır..."
    },
    {
      id: 2,
      chamber: "12. Hukuk Dairesi",
      category: "Hukuk Daireleri",
      caseNo: "2025/1142 E.",
      decisionNo: "2026/105 K.",
      date: "18.01.2026",
      year: "2026",
      summary: "İcra takiplerinde kıymet takdirine itiraz süreci, süresinde yapılmayan itirazların hukuki sonuçları ve hak düşürücü süreler.",
      tags: ["İcra İflas", "Kıymet Takdiri", "Hak Düşürücü Süre"],
      content: "Taraflar arasındaki icra takibi dosyası kapsamında yapılan kıymet takdirine karşı süresi içerisinde itiraz edilmediği, mahkemenin bu yöndeki kararının usul ve yasaya uygun olduğu görülmüş olup..."
    },
    {
      id: 3,
      chamber: "9. Hukuk Dairesi",
      category: "Hukuk Daireleri",
      caseNo: "2025/9564 E.",
      decisionNo: "2026/221 K.",
      date: "15.01.2026",
      year: "2026",
      summary: "İş kazası neticesinde oluşan maluliyet nedeniyle maddi ve manevi tazminat davasında kusur oranlarının belirlenmesi ve bilirkişi raporu geçerliliği.",
      tags: ["İş Hukuku", "İş Kazası", "Tazminat"],
      content: "Dava, iş kazasından kaynaklanan maddi ve manevi tazminat istemine ilişkindir. Mahkemece alınan kusur raporları arasındaki çelişki giderilmeden hüküm kurulması hatalı olup..."
    }
  ]);

  React.useEffect(() => {
    const q = query(collection(db, 'courtDecisions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreDecisions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (firestoreDecisions.length > 0) {
        setDecisions(prev => {
          // IDs are used to avoid duplicates if needed, but for now we'll just prepend
          const combined = [...firestoreDecisions, ...prev.filter(p => !firestoreDecisions.find((f: any) => f.id === p.id))];
          return combined;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = 
      d.chamber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.caseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.decisionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(d.tags) && d.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesChamber = selectedChamber === 'Tümü' || d.category === selectedChamber;
    const matchesYear = selectedYear === 'Tümü' || d.year === selectedYear;

    return matchesSearch && matchesChamber && matchesYear;
  });

  const handleDownloadPDF = (decision: any) => {
    const doc = new jsPDF();
    const primaryColor = "#0f1e3d";
    const accentColor = "#c9a84c";

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor("#ffffff");
    doc.setFontSize(22);
    doc.text("MK HUKUK & DANISMANLIK", 105, 18, { align: "center" });
    doc.setFontSize(10);
    doc.text("YARGITAY EMSAL KARAR BELGESI", 105, 28, { align: "center" });

    // Decision Info Header
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    doc.setTextColor(primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${decision.caseNo} / ${decision.decisionNo}`, 20, 60);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Karar Tarihi: ${decision.date}`, 190, 60, { align: "right" });
    doc.text(`Ilgili Daire: ${decision.chamber}`, 20, 68);

    // Summary Section
    let y = 85;
    doc.setFillColor("#f8f5ef");
    doc.rect(20, y, 170, 25, 'F');
    doc.setDrawColor("#e5e7eb");
    doc.rect(20, y, 170, 25, 'S');
    
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("KARAR ÖZETI:", 25, y + 8);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const splitSummary = doc.splitTextToSize(decision.summary, 160);
    doc.text(splitSummary, 25, y + 15);

    // Content Section
    y += 40;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("KARAR METNI:", 20, y);
    
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitContent = doc.splitTextToSize(decision.content, 170);
    doc.text(splitContent, 20, y);

    // Footer
    doc.setTextColor(primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("* Bu belge MK Hukuk Karar Arama Veritabanı üzerinden olusturulmustur.", 20, 280);
    doc.text(`* Belge Dogrulama Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, 285);

    doc.save(`Yargitay_Karar_${decision.caseNo.replace(/\//g, '_')}.pdf`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedChamber('Tümü');
    setSelectedYear('Tümü');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Header */}
      <div className="bg-[#0f1e3d] py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-amber rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-amber rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 px-4 py-2 rounded-full mb-2">
            <Scale size={14} className="text-amber" />
            <span className="text-amber text-[10px] font-black uppercase tracking-[0.2em]">
              {t('decisions.badge')}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
            {t('decisions.title').split(' ').slice(0, 1).join(' ')} <span className="gradient-text italic">{t('decisions.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <p className="text-sm md:text-base text-white/50 leading-relaxed font-body max-w-2xl mx-auto">
            {t('decisions.desc')}
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-amber transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text"
              placeholder={t('decisions.searchPlaceholder')}
              className="w-full bg-card/50 backdrop-blur-xl border border-border/60 rounded-[2rem] pl-16 pr-32 py-6 text-lg outline-none focus:ring-4 focus:ring-amber/20 focus:border-amber transition-all shadow-2xl font-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-3 bottom-3 bg-amber text-amber-foreground px-8 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-amber-light transition-all shadow-amber">
              {t('decisions.btnSearch')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="bg-card p-8 rounded-[2.5rem] border border-border/60 shadow-card">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3 font-display">
                <Filter size={20} className="text-amber" /> {t('decisions.filterTitle')}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3">{t('decisions.filterChambers')}</label>
                  <select 
                    value={selectedChamber}
                    onChange={(e) => setSelectedChamber(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber transition-all cursor-pointer font-bold"
                  >
                    <option value="Tümü">Tümü</option>
                    <option value="Hukuk Daireleri">Hukuk Daireleri</option>
                    <option value="Ceza Daireleri">Ceza Daireleri</option>
                    <option value="Hukuk Genel Kurulu">Hukuk Genel Kurulu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3">{t('decisions.filterYear')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['2026', '2025', '2024', 'Tümü'].map(year => (
                      <button 
                        key={year} 
                        onClick={() => setSelectedYear(year)}
                        className={`px-4 py-2 rounded-lg border transition-all text-xs font-bold ${selectedYear === year ? 'bg-amber text-amber-foreground border-amber' : 'border-border/40 hover:bg-amber/10 hover:border-amber'}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <button 
                    onClick={clearFilters}
                    className="w-full text-xs font-black text-amber uppercase tracking-widest hover:underline text-center"
                  >
                    {t('decisions.filterClear')}
                  </button>
                </div>
              </div>
            </div>

            {/* Premium CTA */}
            <div className="bg-gradient-to-br from-amber to-amber-dark p-8 rounded-[2.5rem] text-amber-foreground shadow-amber relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h4 className="text-lg font-black mb-4 font-display leading-tight">{t('decisions.ctaTitle')}</h4>
              <p className="text-sm opacity-80 mb-6 font-body leading-relaxed">{t('decisions.ctaDesc')}</p>
              <button className="w-full bg-white text-amber font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:shadow-lg transition-all">{t('decisions.ctaBtn')}</button>
            </div>
          </div>
        </div>

        {/* Decisions List */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black font-display">{filteredDecisions.length} {t('decisions.listHeading')}</h2>
            <div className="text-sm text-muted-foreground font-body">{t('decisions.sortBy')}</div>
          </div>

          {filteredDecisions.map((decision) => (
            <div 
              key={decision.id}
              className="bg-card p-10 rounded-[3rem] border border-border/60 shadow-card hover:shadow-card-hover hover:border-amber/30 transition-all duration-500 group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-amber/10 text-amber px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">
                      {decision.chamber}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-bold font-body">
                      <Calendar size={14} /> {decision.date}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-foreground group-hover:text-amber transition-colors font-display leading-tight">
                    {decision.caseNo} / {decision.decisionNo}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-2xl bg-secondary/50 hover:bg-amber hover:text-amber-foreground transition-all">
                    <Bookmark size={20} />
                  </button>
                  <button className="p-3 rounded-2xl bg-secondary/50 hover:bg-amber hover:text-amber-foreground transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8 font-body text-lg border-l-4 border-amber/20 pl-6 italic">
                {decision.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {decision.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60 px-4 py-1.5 bg-secondary/30 rounded-full border border-border/40">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-border/40">
                <div className="flex items-center gap-2 text-amber font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                  {t('decisions.viewContent')} <ChevronRight size={18} />
                </div>
                <button 
                  onClick={() => handleDownloadPDF(decision)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-amber transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <Download size={16} /> {t('decisions.downloadPdf')}
                </button>
              </div>
            </div>
          ))}

          {filteredDecisions.length === 0 && (
            <div className="text-center py-20 bg-card rounded-[3rem] border border-dashed border-border/60">
              <div className="bg-amber/5 w-20 h-20 rounded-full flex items-center justify-center text-amber mx-auto mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-black mb-4 font-display">{t('decisions.noResults')}</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-body">{t('decisions.noResultsDesc')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-nav/50 py-24 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { val: "2M+", label: t('decisions.stats.total') },
              { val: "50k+", label: t('decisions.stats.weekly') },
              { val: "0.2s", label: t('decisions.stats.speed') },
              { val: "99%", label: t('decisions.stats.accuracy') }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl md:text-5xl font-black text-amber mb-3 font-display group-hover:scale-110 transition-transform">{stat.val}</div>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupremeCourtDecisions;
