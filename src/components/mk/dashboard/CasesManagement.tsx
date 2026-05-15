import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Scale, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CaseItem, deleteCase, subscribeCases, upsertCase } from '@/lib/dashboardApi';

const CasesManagement: React.FC = () => {
    const [items, setItems] = useState<CaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ fileNo: '', court: '', subject: '', status: 'open' as CaseItem['status'], clientName: '' });

    useEffect(() => {
        const unsub = subscribeCases(
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (error) => {
                console.error('Cases snapshot error:', error);
                toast({ title: 'Dava verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const openCount = useMemo(() => items.filter((i) => i.status === 'open').length, [items]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.fileNo.trim() || !form.court.trim() || !form.subject.trim()) {
            toast({ title: 'Eksik bilgi', description: 'Esas No, Mahkeme ve Dava Konusu zorunludur.', variant: 'destructive' });
            return;
        }
        try {
            setSaving(true);
            await upsertCase({
                fileNo: form.fileNo.trim(),
                court: form.court.trim(),
                subject: form.subject.trim(),
                status: form.status,
                clientName: form.clientName.trim() || undefined,
            });
            toast({ title: 'Kaydedildi', description: 'Dava kaydı eklendi.' });
            setForm({ fileNo: '', court: '', subject: '', status: 'open', clientName: '' });
            setIsAdding(false);
        } catch (error: any) {
            console.error('Case create error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Dava kaydı eklenemedi.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm('Bu dava kaydını silmek istediğinize emin misiniz?')) return;
        try {
            await deleteCase(id);
            toast({ title: 'Silindi', description: 'Dava kaydı kaldırıldı.' });
        } catch (error: any) {
            console.error('Case delete error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Dava kaydı silinemedi.', variant: 'destructive' });
        }
    };

    if (loading) {
        return <div className="text-center py-16 text-muted-foreground">Dava kayıtları yükleniyor...</div>;
    }

    return (
        <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
                    <Scale size={28} className="text-[#c9a84c]" /> Dava Dosyaları
                </h2>
                <button onClick={() => setIsAdding((p) => !p)} className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold">
                    <Plus size={16} /> {isAdding ? 'İptal' : 'Yeni Dava'}
                </button>
            </div>

            <div className="mb-4 text-sm text-[#6b7280]">Toplam: {items.length} · Açık dosya: {openCount}</div>

            {isAdding && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={submit}>
                    <input value={form.fileNo} onChange={(e) => setForm((p) => ({ ...p, fileNo: e.target.value }))} placeholder="Esas No" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.court} onChange={(e) => setForm((p) => ({ ...p, court: e.target.value }))} placeholder="Mahkeme" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Dava Konusu" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.clientName} onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))} placeholder="Müvekkil (opsiyonel)" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as CaseItem['status'] }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3">
                        <option value="open">Açık</option>
                        <option value="pending">Beklemede</option>
                        <option value="closed">Kapalı</option>
                    </select>
                    <button disabled={saving} className="bg-[#0f1e3d] text-white rounded-xl px-6 py-3 font-bold disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                </form>
            )}

            {items.length === 0 ? (
                <div className="text-center py-14 border-2 border-dashed border-[#c9a84c]/20 rounded-2xl text-muted-foreground">Henüz dava kaydı yok.</div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#c9a84c]/10 bg-[#f8f5ef]">
                            <div>
                                <div className="font-bold text-[#0f1e3d]">{item.fileNo} · {item.subject}</div>
                                <div className="text-xs text-[#6b7280]">{item.court}{item.clientName ? ` · ${item.clientName}` : ''}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs px-2 py-1 rounded-full bg-white border border-[#c9a84c]/20">{item.status}</span>
                                <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-[#e24b4a] hover:bg-red-50"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CasesManagement;

