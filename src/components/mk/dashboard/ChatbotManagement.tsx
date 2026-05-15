import React, { useEffect, useState } from 'react';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
    ChatbotConversationItem,
    deleteChatbotConversation,
    subscribeChatbotConversations,
    upsertChatbotConversation,
} from '@/lib/dashboardApi';

const ChatbotManagement: React.FC = () => {
    const [items, setItems] = useState<ChatbotConversationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: 'Anonim', topic: '', status: 'Devam' });

    useEffect(() => {
        const unsub = subscribeChatbotConversations(
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (error) => {
                console.error('Chatbot snapshot error:', error);
                toast({ title: 'Chatbot verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.topic.trim()) {
            toast({ title: 'Eksik bilgi', description: 'Konu alanı zorunludur.', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            await upsertChatbotConversation({
                name: form.name.trim() || 'Anonim',
                topic: form.topic.trim(),
                status: form.status,
            });
            toast({ title: 'Kaydedildi', description: 'Chatbot görüşmesi eklendi.' });
            setForm({ name: 'Anonim', topic: '', status: 'Devam' });
            setIsAdding(false);
        } catch (error: any) {
            console.error('Chatbot create error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Görüşme kaydedilemedi.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm('Bu görüşmeyi silmek istediğinize emin misiniz?')) return;
        try {
            await deleteChatbotConversation(id);
            toast({ title: 'Silindi', description: 'Görüşme kaldırıldı.' });
        } catch (error: any) {
            console.error('Chatbot delete error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'Görüşme silinemedi.', variant: 'destructive' });
        }
    };

    if (loading) return <div className="text-center py-16 text-muted-foreground">Görüşmeler yükleniyor...</div>;

    return (
        <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
                    <MessageCircle size={28} className="text-[#c9a84c]" /> Chatbot Görüşmeleri
                </h2>
                <button onClick={() => setIsAdding((p) => !p)} className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold">
                    <Plus size={16} /> {isAdding ? 'İptal' : 'Yeni Görüşme'}
                </button>
            </div>

            {isAdding && (
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" onSubmit={submit}>
                    <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Kullanıcı" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <input value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} placeholder="Konu" className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3" />
                    <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3">
                        <option>Devam</option>
                        <option>Çözüldü</option>
                        <option>Yönlendirme</option>
                    </select>
                    <button disabled={saving} className="bg-[#0f1e3d] text-white rounded-xl px-6 py-3 font-bold disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                </form>
            )}

            {items.length === 0 ? (
                <div className="text-center py-14 border-2 border-dashed border-[#c9a84c]/20 rounded-2xl text-muted-foreground">Henüz chatbot görüşmesi yok.</div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#c9a84c]/10 bg-[#f8f5ef]">
                            <div>
                                <div className="font-bold text-[#0f1e3d]">{item.name} · {item.topic}</div>
                                <div className="text-xs text-[#6b7280]">{item.status}</div>
                            </div>
                            <button onClick={() => remove(item.id)} className="p-2 rounded-lg text-[#e24b4a] hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatbotManagement;

