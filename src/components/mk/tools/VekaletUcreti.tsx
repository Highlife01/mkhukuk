import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, Download, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CalculationResult {
  baseAmount: number;
  vat: number;
  total: number;
  details: string;
}

const VekaletUcreti: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [feeType, setFeeType] = useState('civil');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    const val = parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0;
    let base = 0;
    let details = "";

    // Simplified calculation logic based on typical 2024/25 AAÜT
    if (feeType === 'civil') {
      const minFee = 17900;
      const percentageFee = val * 0.16;
      base = Math.max(minFee, percentageFee);
      details = val > 0 ? "Nispi vekalet ücreti hesaplandı." : "Maktu vekalet ücreti uygulandı.";
    } else if (feeType === 'criminal') {
      base = 17900;
      details = "Asliye Ceza Mahkemesi maktu ücreti.";
    } else if (feeType === 'enforcement') {
      base = 4500;
      details = "İcra dairesi takip ücreti.";
    } else if (feeType === 'magistrate') {
      base = 10700;
      details = "Sulh Hukuk Mahkemesi maktu ücreti.";
    }

    const vat = base * 0.20;
    setResult({
      baseAmount: base,
      vat: vat,
      total: base + vat,
      details: details
    });
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
    doc.text("VEKALET ÜCRETI HESAPLAMA BILGI FISI", 105, 30, { align: "center" });

    // Content Box
    doc.setDrawColor(accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    
    const typeLabel = feeType === 'civil' ? 'Asliye Hukuk Mahkemesi' : 
                     feeType === 'criminal' ? 'Asliye Ceza Mahkemesi' : 
                     feeType === 'enforcement' ? 'İcra Dairesi' : 'Sulh Hukuk Mahkemesi';

    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Islem Detaylari:", 20, y);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Mahkeme / Takip Türü:`, 20, y);
    doc.text(typeLabel, 80, y);
    
    y += 10;
    doc.text(`Dava Degeri:`, 20, y);
    doc.text(`TL ${parseFloat(amount || "0").toLocaleString('tr-TR')}`, 80, y);

    y += 20;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Hesap Özeti:", 20, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text("Ham Vekalet Ücreti:", 20, y);
    doc.text(`TL ${result.baseAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 150, y, { align: "right" });

    y += 10;
    doc.text("KDV (%20):", 20, y);
    doc.text(`TL ${result.vat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 150, y, { align: "right" });

    y += 15;
    doc.setFillColor(accentColor);
    doc.rect(20, y, 170, 12, 'F');
    doc.setTextColor("#ffffff");
    doc.setFontSize(14);
    doc.text("TOPLAM TUTAR:", 25, y + 8);
    doc.text(`TL ${result.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 185, y + 8, { align: "right" });

    y += 30;
    doc.setTextColor(primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`* ${result.details}`, 20, y);
    doc.text("* Bu belge bilgilendirme amaclidir, resmi evrak niteligi tasimaz.", 20, y + 5);
    doc.text(`* Düzenleme Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, y + 10);

    doc.save(`Vekalet_Ucreti_Hesaplama_${new Date().getTime()}.pdf`);
  };

  useEffect(() => {
    if (amount) calculate();
  }, [feeType, amount]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#c9a84c]/10 rounded-full text-[#c9a84c] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-display font-bold text-[#0f1e3d]">Vekalet Ücreti Hesaplama</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Mahkeme / Takip Türü</label>
                <select 
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]/30 text-[#0f1e3d] font-bold appearance-none"
                >
                  <option value="civil">Asliye Hukuk Mahkemesi</option>
                  <option value="criminal">Asliye Ceza Mahkemesi</option>
                  <option value="enforcement">İcra Dairesi (Takip)</option>
                  <option value="magistrate">Sulh Hukuk Mahkemesi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">Dava Değeri (TL)</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] font-bold">₺</div>
                   <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 pl-10 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#c9a84c]/30 text-[#0f1e3d] font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800 text-xs">
              <Info size={16} className="shrink-0" />
              <p>
                Hesaplama 2024-2025 Avukatlık Asgari Ücret Tarifesi (AAÜT) baz alınarak yapılmıştır. 
                Nispi ücretlerde basamaklı tarife uygulanır. Sonuçlar bilgilendirme amaçlıdır.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f1e3d] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calculator size={80} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#c9a84c] mb-6">Hesap Özeti</h3>
            
            {result ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-white/60">Ham Vekalet Ücreti</span>
                   <span className="font-bold">₺ {result.baseAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-white/60">KDV (%20)</span>
                   <span className="font-bold">₺ {result.vat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                   <span className="text-sm font-bold">TOPLAM</span>
                   <span className="text-2xl font-display font-bold text-[#c9a84c]">₺ {result.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[10px] text-white/40 italic mt-4">{result.details}</p>
                
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full bg-[#c9a84c] text-[#0f1e3d] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all mt-4 flex items-center justify-center gap-2"
                >
                   <Download size={14} /> Bilgi Fişi İndir
                </button>
              </div>
            ) : (
              <div className="py-10 text-center text-white/30 space-y-2">
                 <Calculator size={32} className="mx-auto" />
                 <p className="text-xs">Hesaplama yapmak için <br/> değer giriniz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VekaletUcreti;
