import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { DocumentItem, deleteDocument, subscribeDocuments, upsertDocument } from '@/lib/dashboardApi';

const DocumentsManagement: React.FC = () => {
    const [items, setItems] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: '', type: '', clientName: '', status: 'draft' as DocumentItem['status'] });

    useEffect(() => {
        const unsub = subscribeDocuments(
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (error) => {
                console.error('Documents snapshot error:', error);
                toast({ title: 'Doküman verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.type.trim()) {
            toast({ title: 'Eksik bilgi', description: 'Doküman adı ve türü zorunludur.', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            await upsertDocument({
                title: form.title.trim(),
                type: form.type.trim(),
                clientName: form.clientName.trim() || undefined,
                status: form.status,
            });
            toast({ title: 'Kaydedildi', description: 'Doküman kaydı eklendi.' });
            setForm({ title: '', type: '', clientName: '', status: 'draft' });
            setIsAdding(false);
        } catch (error: any) {
            console.error('Document create error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Doküman kaydedilemedi.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm('Bu dokümanı silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDocument(id);
            toast({ title: 'Silindi', description: 'Doküman kaldırıldı.' });
        } catch (error: any) {
            console.error('Document delete error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Doküman silinemedi.', variant: 'destructive' });
        }
    };

    if (loading) return <div className="text-center py-16 text-muted-foreground">Dokümanlar yükleniyor...</div>;

    return (
        <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
                    <FileText size={28} className="text-[#c9a84c]" /> Doküman Yönetimi
                </h2>
                <button onClick={() => setIsAdding((p) => !p)} className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold">
                    <Plus size={16} /> {isAdding ? 'İptal' : 'Yeni Doküman'}
                </button>
            </div>

            {isAdding && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={submit}>
                    <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Doküman adı" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} placeholder="Tür (Dilekçe, Sözleşme vb.)" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.clientName} onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))} placeholder="Müvekkil (opsiyonel)" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as DocumentItem['status'] }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3">
                        <option value="draft">Taslak</option>
                        <option value="review">İncelemede</option>
                        <option value="approved">Onaylı</option>
                    </select>
                    <button disabled={saving} className="bg-[#0f1e3d] text-white rounded-xl px-6 py-3 font-bold disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                </form>
            )}

            {items.length === 0 ? (
                <div className="text-center py-14 border-2 border-dashed border-[#c9a84c]/20 rounded-2xl text-muted-foreground">Henüz doküman kaydı yok.</div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#c9a84c]/10 bg-[#f8f5ef]">
                            <div>
                                <div className="font-bold text-[#0f1e3d]">{item.title}</div>
                                <div className="text-xs text-[#6b7280]">{item.type} · {item.status}{item.clientName ? ` · ${item.clientName}` : ''}</div>
                            </div>
                            <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-[#e24b4a] hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentsManagement;

