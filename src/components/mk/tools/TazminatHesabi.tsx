import React, { useState, useEffect } from 'react';
import { Zap, ArrowLeft, Info, UserCheck, Briefcase, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const TazminatHesabi: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [years, setYears] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const salary = parseFloat(grossSalary.replace(/\./g, '').replace(',', '.')) || 0;
    const totalDays = (years * 365) + (months * 30) + days;
    
    if (salary > 0 && totalDays >= 365) {
      // Severance (Kıdem) - 1 month for each year
      // Kıdem tazminatı tavanı kontrolü (Örnek: 35.058,58 TL)
      const tavan = 35058.58;
      const effectiveSalary = Math.min(salary, tavan);
      
      const severanceRaw = effectiveSalary * (totalDays / 365.25);
      const stampTax = severanceRaw * 0.00759; // %0.759 damga vergisi
      const severanceNet = severanceRaw - stampTax;

      // Notice (İhbar) - Simplified logic
      let noticeWeeks = 2;
      if (totalDays > 1095) noticeWeeks = 8; // 3+ years
      else if (totalDays > 547) noticeWeeks = 6; // 1.5 - 3 years
      else if (totalDays > 182) noticeWeeks = 4; // 6 months - 1.5 years
      else noticeWeeks = 2;

      const noticeRaw = (salary / 30) * (noticeWeeks * 7);
      const incomeTax = noticeRaw * 0.15; // %15 income tax (Basit tutuldu)
      const noticeStampTax = noticeRaw * 0.00759;
      const noticeNet = noticeRaw - incomeTax - noticeStampTax;

      setResult({
        salary: salary,
        effectiveSalary: effectiveSalary,
        totalDays: totalDays,
        severanceGross: severanceRaw,
        severanceNet: severanceNet,
        noticeRaw: noticeRaw,
        noticeNet: noticeNet,
        totalNet: severanceNet + noticeNet,
        isNoticeEligible: true
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
    doc.text("KIDEM VE IHBAR TAZMINATI HESAPLAMA BILGI FISI", 105, 30, { align: "center" });

    // Content
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Calisma Bilgileri:", 20, y);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Brüt Maas:", 20, y);
    doc.text(`TL ${result.salary.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 80, y);
    
    y += 10;
    doc.text("Toplam Calisma Süresi:", 20, y);
    doc.text(`${years} Yıl, ${months} Ay, ${days} Gün`, 80, y);

    y += 20;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Tazminat Detaylari:", 20, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Kidem Tazminati (Net):", 20, y);
    doc.text(`TL ${result.severanceNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 150, y, { align: "right" });

    y += 10;
    doc.text("Ihbar Tazminati (Net):", 20, y);
    doc.text(`TL ${result.noticeNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 150, y, { align: "right" });

    y += 15;
    doc.setFillColor(accentColor);
    doc.rect(20, y, 170, 12, 'F');
    doc.setTextColor("#ffffff");
    doc.setFontSize(14);
    doc.text("TOPLAM ELE GECEN:", 25, y + 8);
    doc.text(`TL ${result.totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 185, y + 8, { align: "right" });

    y += 30;
    doc.setTextColor(primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("* Kidem tazminati tavanı (35.058,58 TL) dikkate alınarak hesaplanmıştır.", 20, y);
    doc.text("* Vergi oranları ve yasal kesintiler güncel mevzuata göre simüle edilmistir.", 20, y + 5);
    doc.text("* Bu belge bilgilendirme amaclidir, resmi evrak niteligi tasimaz.", 20, y + 10);
    doc.text(`* Düzenleme Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, y + 15);

    doc.save(`Tazminat_Hesabi_${new Date().getTime()}.pdf`);
  };

  useEffect(() => {
    calculate();
  }, [grossSalary, years, months, days]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#c9a84c]/10 rounded-full text-[#c9a84c] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-display font-bold text-[#0f1e3d]">Kıdem ve İhbar Tazminatı</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Brüt Maaş (TL)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] font-bold">₺</div>
                  <input 
                    type="text" 
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 pl-10 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]/30 text-[#0f1e3d] font-bold"
                  />
                </div>
                <div className="text-[10px] text-muted-foreground italic">Maaş + eklentiler (Brüt toplam)</div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Çalışma Süresi</label>
                <div className="grid grid-cols-3 gap-2">
                   <div className="space-y-1 text-center">
                     <span className="text-[10px] text-[#6b7280] font-bold uppercase">Yıl</span>
                     <input type="number" min="0" value={years} onChange={(e) => setYears(parseInt(e.target.value) || 0)} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 p-2 rounded-lg text-center font-bold text-[#0f1e3d] text-sm" />
                   </div>
                   <div className="space-y-1 text-center">
                     <span className="text-[10px] text-[#6b7280] font-bold uppercase">Ay</span>
                     <input type="number" min="0" max="11" value={months} onChange={(e) => setMonths(parseInt(e.target.value) || 0)} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 p-2 rounded-lg text-center font-bold text-[#0f1e3d] text-sm" />
                   </div>
                   <div className="space-y-1 text-center">
                     <span className="text-[10px] text-[#6b7280] font-bold uppercase">Gün</span>
                     <input type="number" min="0" max="30" value={days} onChange={(e) => setDays(parseInt(e.target.value) || 0)} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 p-2 rounded-lg text-center font-bold text-[#0f1e3d] text-sm" />
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-[#f8f5ef] rounded-2xl flex items-center gap-3">
                  <UserCheck className="text-[#c9a84c]" size={20} />
                  <div className="text-xs text-[#0f1e3d] font-medium">İstifa durumunda kıdem hakkı oluşmayabilir (ESK hariç).</div>
               </div>
               <div className="p-4 bg-[#f8f5ef] rounded-2xl flex items-center gap-3">
                  <Briefcase className="text-[#c9a84c]" size={20} />
                  <div className="text-xs text-[#0f1e3d] font-medium">Bakiye süre ve yıllık izin hakları ayrıca eklenmelidir.</div>
               </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800 text-xs">
              <span className="shrink-0"><Info size={16} /></span>
              <p>
                Kıdem tazminatı tavanı 2024 yılı ikinci yarısı için 35.058,58 TL'dir. 
                Bu hesaplama tavan sınırını aşan maaşlar için tavan değerini baz alır.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 h-full">
           <div className="bg-[#0f1e3d] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap size={120} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#c9a84c] mb-10">Tazminat Özeti</h3>
              
              {result ? (
                <div className="space-y-6 flex-1">
                  <div className="group">
                    <div className="text-[10px] text-white/50 uppercase font-bold tracking-tighter mb-1">KİDEM TAZMİNATI (NET)</div>
                    <div className="text-2xl font-display font-bold text-white">₺ {result.severanceNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className="group">
                    <div className="text-[10px] text-white/50 uppercase font-bold tracking-tighter mb-1">İHBAR TAZMİNATI (NET)</div>
                    <div className="text-2xl font-display font-bold text-white">₺ {result.noticeNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-white/10">
                    <div className="text-[11px] text-[#c9a84c] font-black uppercase tracking-widest mb-1">TOPLAM ELE GEÇEN</div>
                    <div className="text-3xl font-display font-black text-[#c9a84c]">₺ {result.totalNet.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  
                  <button 
                    onClick={handleDownloadPDF}
                    className="w-full bg-white text-[#0f1e3d] py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#c9a84c] transition-all mt-8 flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Detaylı PDF Al
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-20 space-y-4">
                   <Zap size={48} className="mx-auto" />
                   <p className="font-display text-lg font-bold">Veri Giriniz</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TazminatHesabi;
