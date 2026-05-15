import React, { useEffect, useState } from 'react';
import { UserPlus, Trash2, Phone, AtSign, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ClientItem, deleteClient, subscribeClients, upsertClient } from '@/lib/dashboardApi';

const ClientsManagement: React.FC = () => {
    const [items, setItems] = useState<ClientItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Partial<ClientItem>>({});

    useEffect(() => {
        const unsub = subscribeClients(
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (error) => {
                console.error('Clients snapshot error:', error);
                toast({ title: 'Müvekkil verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullName = (form.fullName || '').trim();
        if (!fullName) {
            toast({ title: 'Eksik bilgi', description: 'Ad Soyad alanı zorunludur.', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            await upsertClient({
                fullName,
                identityNo: form.identityNo?.trim(),
                phone: form.phone?.trim(),
                email: form.email?.trim(),
                notes: form.notes?.trim(),
            });
            toast({ title: 'Kaydedildi', description: 'Müvekkil kaydı oluşturuldu.' });
            setForm({});
            setIsAdding(false);
        } catch (error: any) {
            console.error('Client create error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Kayıt oluşturulamadı.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm('Bu müvekkil kaydını silmek istediğinize emin misiniz?')) return;
        try {
            await deleteClient(id);
            toast({ title: 'Silindi', description: 'Müvekkil kaydı kaldırıldı.' });
        } catch (error: any) {
            console.error('Client delete error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Kayıt silinemedi.', variant: 'destructive' });
        }
    };

    if (loading) return <div className="text-center py-16 text-muted-foreground">Müvekkil listesi yükleniyor...</div>;

    return (
        <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
                    <UserPlus size={28} className="text-[#c9a84c]" /> Müvekkil Yönetimi
                </h2>
                <button onClick={() => setIsAdding((p) => !p)} className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold">
                    <UserPlus size={16} /> {isAdding ? 'İptal' : 'Yeni Müvekkil'}
                </button>
            </div>

            {isAdding && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={submit}>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Ad Soyad / Ünvan</label>
                        <input value={form.fullName || ''} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3 outline-none" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">T.C. / Vergi No</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
                            <input value={form.identityNo || ''} onChange={(e) => setForm((p) => ({ ...p, identityNo: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">E-posta</label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
                            <input type="email" value={form.email || ''} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Telefon</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
                            <input type="tel" value={form.phone || ''} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none" />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Notlar</label>
                        <textarea value={form.notes || ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3 outline-none min-h-[100px]" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <button disabled={saving} className="bg-[#c9a84c] text-[#0f1e3d] px-8 py-3 rounded-xl font-bold disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold">İptal</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.length === 0 ? (
                    <div className="md:col-span-2 text-center py-14 border-2 border-dashed border-[#c9a84c]/20 rounded-2xl text-muted-foreground">Henüz müvekkil kaydı yok.</div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl border border-[#c9a84c]/10 bg-[#f8f5ef] group relative">
                            <div className="font-bold text-[#0f1e3d] text-lg mb-1">{item.fullName}</div>
                            <div className="space-y-1 text-sm text-[#6b7280]">
                                {item.phone && <div className="flex items-center gap-2"><Phone size={14} /> {item.phone}</div>}
                                {item.email && <div className="flex items-center gap-2"><AtSign size={14} /> {item.email}</div>}
                                {item.identityNo && <div className="flex items-center gap-2"><CreditCard size={14} /> {item.identityNo}</div>}
                            </div>
                            <button onClick={() => remove(item.id)} className="absolute top-4 right-4 p-2 rounded-lg text-[#e24b4a] opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-red-100 shadow-sm"><Trash2 size={16} /></button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientsManagement;
