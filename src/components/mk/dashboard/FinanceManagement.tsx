import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, DollarSign, Percent, Trash2, Wallet } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  FinanceAgreement,
  createFinanceAgreement,
  deleteFinanceAgreement,
  subscribeFinanceAgreements,
} from '@/lib/dashboardApi';

function formatCurrency(value: number) {
  return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

const FinanceManagement: React.FC = () => {
  const [agreements, setAgreements] = useState<FinanceAgreement[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<FinanceAgreement>>({ agreedAmount: 0, paidAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeFinanceAgreements(
      (data) => {
        setAgreements(data);
        setLoading(false);
      },
      (error) => {
        console.error('Finance agreements snapshot error:', error);
        toast({ title: 'Finans verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const totalAgreed = useMemo(() => agreements.reduce((sum, a) => sum + a.agreedAmount, 0), [agreements]);
  const totalPaid = useMemo(() => agreements.reduce((sum, a) => sum + a.paidAmount, 0), [agreements]);
  const totalDue = useMemo(() => agreements.reduce((sum, a) => sum + a.dueAmount, 0), [agreements]);

  const addAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientName = (form.clientName || '').trim();
    if (!clientName) {
      toast({ title: 'Eksik bilgi', description: 'Müvekkil adı zorunludur.', variant: 'destructive' });
      return;
    }
    const agreedAmount = Number(form.agreedAmount) || 0;
    const paidAmount = Number(form.paidAmount) || 0;
    const dueAmount = Math.max(0, agreedAmount - paidAmount);

    try {
      setSaving(true);
      await createFinanceAgreement({
        clientName,
        description: form.description?.trim(),
        agreedAmount,
        paidAmount,
        dueAmount,
      });
      toast({ title: 'Kaydedildi', description: 'Finans anlaşması eklendi.' });
      setForm({ agreedAmount: 0, paidAmount: 0 });
      setIsAdding(false);
    } catch (error: any) {
      console.error('Finance agreement create error:', error);
      toast({ title: 'Hata', description: error?.message ?? 'Anlaşma eklenemedi.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const removeAgreement = async (id: string) => {
    if (!window.confirm('Bu finans anlaşmasını silmek istediğinize emin misiniz?')) return;
    try {
      await deleteFinanceAgreement(id);
      toast({ title: 'Silindi', description: 'Anlaşma kaldırıldı.' });
    } catch (error: any) {
      console.error('Finance agreement delete error:', error);
      toast({ title: 'Hata', description: error?.message ?? 'Anlaşma silinemedi.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
        <div className="text-center py-20 border-2 border-dashed border-[#c9a84c]/20 rounded-3xl">
          <p className="text-muted-foreground font-medium">Finans verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
            <Wallet size={28} className="text-[#c9a84c]" />
            Finans Yönetimi
          </h2>
          <p className="text-sm text-[#6b7280] mt-1 max-w-xl">
            Müvekkillerle yapılan anlaşmaların toplam tutar, alınan peşinat ve kalan borç takibini burada yapabilirsiniz.
          </p>
        </div>
        <button
          onClick={() => setIsAdding((prev) => !prev)}
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold hover:bg-[#e2c97e] transition"
        >
          <CreditCard size={16} /> {isAdding ? 'İptal' : 'Yeni Anlaşma Ekle'}
        </button>
      </div>

      {isAdding && (
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8" onSubmit={addAgreement}>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Müvekkil Adı</label>
            <input
              value={form.clientName || ''}
              onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
              className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="Müvekkil adı..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Anlaşma Tutarı (TRY)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
              <input
                type="number"
                min={0}
                value={form.agreedAmount ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, agreedAmount: Number(e.target.value) }))}
                className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Ödenen Peşinat (TRY)</label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
              <input
                type="number"
                min={0}
                value={form.paidAmount ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, paidAmount: Number(e.target.value) }))}
                className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Açıklama (opsiyonel)</label>
            <input
              value={form.description || ''}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="Kısmî ödeme planı, tarih vb."
            />
          </div>

          <div className="lg:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#c9a84c] text-[#0f1e3d] px-8 py-3 rounded-xl font-bold hover:bg-[#e2c97e] transition disabled:opacity-60"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setForm({ agreedAmount: 0, paidAmount: 0 });
              }}
              className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="bg-[#f8f5ef] border border-[#c9a84c]/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard size={18} className="text-[#c9a84c]" />
            <div className="text-xs uppercase tracking-wide font-semibold text-[#6b7280]">Toplam Anlaşma</div>
          </div>
          <div className="text-2xl font-bold text-[#0f1e3d]">{formatCurrency(totalAgreed)}</div>
        </div>
        <div className="bg-[#f8f5ef] border border-[#c9a84c]/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign size={18} className="text-[#c9a84c]" />
            <div className="text-xs uppercase tracking-wide font-semibold text-[#6b7280]">Toplam Ödenen</div>
          </div>
          <div className="text-2xl font-bold text-[#0f1e3d]">{formatCurrency(totalPaid)}</div>
        </div>
        <div className="bg-[#f8f5ef] border border-[#c9a84c]/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Wallet size={18} className="text-[#c9a84c]" />
            <div className="text-xs uppercase tracking-wide font-semibold text-[#6b7280]">Kalan Borç</div>
          </div>
          <div className="text-2xl font-bold text-[#0f1e3d]">{formatCurrency(totalDue)}</div>
        </div>
      </div>

      {agreements.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[#c9a84c]/20 rounded-3xl">
          <p className="text-muted-foreground font-medium">Henüz finansal anlaşma kaydı yok.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-6 py-3 rounded-xl font-bold hover:bg-[#e2c97e] transition"
          >
            <CreditCard size={18} /> Anlaşma Ekle
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest">
                <th className="px-5 py-3">Müvekkil</th>
                <th className="px-5 py-3">Anlaşma</th>
                <th className="px-5 py-3">Ödenen</th>
                <th className="px-5 py-3">Kalan</th>
                <th className="px-5 py-3">Açıklama</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/5">
              {agreements.map((a) => (
                <tr key={a.id} className="hover:bg-[#f8f5ef] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#0f1e3d]">{a.clientName}</td>
                  <td className="px-5 py-4 text-[#6b7280]">{formatCurrency(a.agreedAmount)}</td>
                  <td className="px-5 py-4 text-[#6b7280]">{formatCurrency(a.paidAmount)}</td>
                  <td className="px-5 py-4 text-[#6b7280]">{formatCurrency(a.dueAmount)}</td>
                  <td className="px-5 py-4 text-[#6b7280]">{a.description || '-'}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => removeAgreement(a.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#c9a84c]/20 rounded-xl text-[#e24b4a] hover:bg-[#ffecec] transition"
                    >
                      <Trash2 size={14} /> Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
