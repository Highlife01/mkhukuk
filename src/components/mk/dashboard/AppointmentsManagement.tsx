import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
    AppointmentItem,
    deleteAppointment,
    subscribeAppointments,
    upsertAppointment,
} from '@/lib/dashboardApi';

const AppointmentsManagement: React.FC = () => {
    const [items, setItems] = useState<AppointmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ time: '09:00', title: '', client: '', status: 'Bekliyor', color: 'bg-[#c9a84c]' });

    useEffect(() => {
        const unsub = subscribeAppointments(
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (error) => {
                console.error('Appointments snapshot error:', error);
                toast({ title: 'Randevu verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
                setLoading(false);
            }
        );

        return () => unsub();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.time.trim() || !form.title.trim() || !form.client.trim()) {
            toast({ title: 'Eksik bilgi', description: 'Saat, başlık ve müvekkil alanları zorunludur.', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            await upsertAppointment({
                time: form.time,
                title: form.title.trim(),
                client: form.client.trim(),
                status: form.status,
                color: form.color,
            });
            toast({ title: 'Kaydedildi', description: 'Randevu eklendi.' });
            setForm({ time: '09:00', title: '', client: '', status: 'Bekliyor', color: 'bg-[#c9a84c]' });
            setIsAdding(false);
        } catch (error: any) {
            console.error('Appointment create error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Randevu kaydedilemedi.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;
        try {
            await deleteAppointment(id);
            toast({ title: 'Silindi', description: 'Randevu kaldırıldı.' });
        } catch (error: any) {
            console.error('Appointment delete error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Randevu silinemedi.', variant: 'destructive' });
        }
    };

    if (loading) return <div className="text-center py-16 text-muted-foreground">Randevular yükleniyor...</div>;

    return (
        <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
                    <Calendar size={28} className="text-[#c9a84c]" /> Randevu Yönetimi
                </h2>
                <button onClick={() => setIsAdding((p) => !p)} className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold">
                    <Plus size={16} /> {isAdding ? 'İptal' : 'Yeni Randevu'}
                </button>
            </div>

            {isAdding && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={submit}>
                    <input type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Başlık" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} placeholder="Müvekkil" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3">
                        <option>Bekliyor</option>
                        <option>Video</option>
                        <option>Onaylı</option>
                    </select>
                    <button disabled={saving} className="bg-[#0f1e3d] text-white rounded-xl px-6 py-3 font-bold disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                </form>
            )}

            {items.length === 0 ? (
                <div className="text-center py-14 border-2 border-dashed border-[#c9a84c]/20 rounded-2xl text-muted-foreground">Henüz randevu kaydı yok.</div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#c9a84c]/10 bg-[#f8f5ef]">
                            <div>
                                <div className="font-bold text-[#0f1e3d]">{item.time} · {item.title}</div>
                                <div className="text-xs text-[#6b7280]">{item.client} · {item.status}</div>
                            </div>
                            <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-[#e24b4a] hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentsManagement;

