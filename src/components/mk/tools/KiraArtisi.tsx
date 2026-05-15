import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, Info, Calendar, Home, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const KiraArtisi: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentRent, setCurrentRent] = useState<string>('');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState<string>('25');
  const [tufeRate, setTufeRate] = useState(62.51); // Örnek güncel TÜFE oranı
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const rent = parseFloat(currentRent.replace(/\./g, '').replace(',', '.')) || 0;
    const rate = useCustomRate ? (parseFloat(customRate) || 0) : tufeRate;
    
    if (rent > 0) {
      const increase = rent * (rate / 100);
      setResult({
        current: rent,
        increase: increase,
        newRent: rent + increase,
        rate: rate
      });
    } else {
      setResult(null);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const primaryColor = "#0f1e3d";
    const accentColor = "#c9a84c";

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor("#ffffff");
    doc.setFontSize(22);
    doc.text("MK HUKUK & DANISMANLIK", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("KIRA ARTIS HESAPLAMA BILGI FISI", 105, 30, { align: "center" });

    // Content
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Mevcut Durum:", 20, y);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Eski Kira Bedeli:", 20, y);
    doc.text(`TL ${result.current.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 80, y);
    
    y += 10;
    doc.text("Uygulanan Artis Orani:", 20, y);
    doc.text(`% ${result.rate}`, 80, y);

    y += 20;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Artis Detaylari:", 20, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Kira Artis Miktari:", 20, y);
    doc.text(`+ TL ${result.increase.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 150, y, { align: "right" });

    y += 15;
    doc.setFillColor(accentColor);
    doc.rect(20, y, 170, 12, 'F');
    doc.setTextColor("#ffffff");
    doc.setFontSize(14);
    doc.text("YENI KIRA BEDELI:", 25, y + 8);
    doc.text(`TL ${result.newRent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 185, y + 8, { align: "right" });

    y += 30;
    doc.setTextColor(primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`* Artis orani ${useCustomRate ? 'özel olarak belirlenmistir.' : 'güncel TÜFE ortalamasina göre hesaplanmistir.'}`, 20, y);
    doc.text("* 1 Temmuz 2024 sonrasi yürürlükteki yasal mevzuata uygundur.", 20, y + 5);
    doc.text("* Bu belge bilgilendirme amaclidir, resmi evrak niteligi tasimaz.", 20, y + 10);
    doc.text(`* Düzenleme Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, y + 15);

    doc.save(`Kira_Artis_Hesabi_${new Date().getTime()}.pdf`);
  };

  useEffect(() => {
    calculate();
  }, [currentRent, useCustomRate, customRate]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#c9a84c]/10 rounded-full text-[#c9a84c] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-display font-bold text-[#0f1e3d]">Kira Artış Hesaplama</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Mevcut Kira Bedeli (Alt Aylık)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] font-bold">₺</div>
                  <input 
                    type="text" 
                    value={currentRent}
                    onChange={(e) => setCurrentRent(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 pl-10 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]/30 text-[#0f1e3d] font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Artış Oranı Belirle</label>
                <div className="flex bg-[#f8f5ef] p-1 rounded-xl border border-[#c9a84c]/10">
                  <button 
                    onClick={() => setUseCustomRate(false)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${!useCustomRate ? 'bg-[#0f1e3d] text-white shadow-lg' : 'text-[#6b7280]'}`}
                  >
                    TÜFE (Yasal)
                  </button>
                  <button 
                    onClick={() => setUseCustomRate(true)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${useCustomRate ? 'bg-[#0f1e3d] text-white shadow-lg' : 'text-[#6b7280]'}`}
                  >
                    Özel Oran %
                  </button>
                </div>
              </div>
            </div>

            {useCustomRate && (
              <div className="animate-in zoom-in-95 duration-200">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest block mb-2">Özel Artış Yüzdesi (%)</label>
                <input 
                  type="number" 
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 px-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]/30 text-[#0f1e3d] font-bold"
                />
              </div>
            )}

            {!useCustomRate && (
              <div className="p-5 bg-[#0f1e3d]/5 rounded-2xl flex items-center gap-4 border border-[#c9a84c]/10">
                <div className="bg-[#0f1e3d] w-12 h-12 rounded-xl flex items-center justify-center text-[#c9a84c]">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-widest mb-0.5">Yürürlükteki TÜFE Oranı</div>
                  <div className="text-xl font-display font-bold text-[#0f1e3d]">%{tufeRate} <span className="text-xs font-sans text-muted-foreground">(12 Aylık Ort.)</span></div>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3 text-blue-800 text-xs mt-4">
              <span className="shrink-0"><Info size={16} /></span>
              <p>
                Konut kiralarında %25 sınırlama uygulaması 1 Temmuz 2024 itibarıyla sona ermiştir. 
                Yeni dönemde artışlar 12 aylık TÜFE ortalamasına göre yapılmaktadır.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#c9a84c]/10 rounded-3xl p-8 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
            {result ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center">
                   <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">YENİ KİRA BEDELİ</div>
                   <div className="text-4xl font-display font-bold text-[#0f1e3d]">₺ {result.newRent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                </div>
                
                <div className="space-y-4 pt-8 border-t border-[#c9a84c]/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6b7280] font-medium">Artış Miktarı</span>
                    <span className="text-[#1d9e75] font-bold">+ ₺ {result.increase.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6b7280] font-medium">Uygulanan Oran</span>
                    <span className="text-[#0f1e3d] font-bold">%{result.rate}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                   <button 
                    onClick={handleDownloadPDF}
                    className="w-full bg-[#c9a84c] text-[#0f1e3d] py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#0f1e3d] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
                   >
                     <Download size={16} /> Bilgi Fişi İndir
                   </button>
                   <div className="p-4 bg-[#f8f5ef] rounded-xl flex items-center gap-3">
                      <Home className="text-[#c9a84c]" size={18} />
                      <div className="text-[11px] text-[#0f1e3d] font-medium leading-tight text-center w-full">Yasal sınırlara uygun kira sözleşmesi için danışmanlık alabilirsiniz.</div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 opacity-20 space-y-4">
                 <Calendar size={48} className="mx-auto" />
                 <p className="font-display text-lg font-bold">Değer Bekleniyor...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KiraArtisi;
