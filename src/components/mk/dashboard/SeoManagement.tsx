import React, { useEffect, useState } from 'react';
import { Search, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { saveSeoSettings, SeoSettings, subscribeSeoSettings } from '@/lib/dashboardApi';

const SeoManagement: React.FC = () => {
    const [settings, setSettings] = useState<SeoSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsub = subscribeSeoSettings(
            (data) => {
                setSettings(data);
                setLoading(false);
            },
            (error) => {
                console.error('SEO settings snapshot error:', error);
                toast({ title: 'SEO verisi alınamadı', description: 'Lütfen tekrar deneyin.', variant: 'destructive' });
                setLoading(false);
            }
        );

        return () => unsub();
    }, []);

    const save = async () => {
        if (!settings) return;
        if (!settings.siteTitle.trim() || !settings.siteDescription.trim()) {
            toast({ title: 'Eksik bilgi', description: 'Site başlığı ve açıklaması zorunludur.', variant: 'destructive' });
            return;
        }

        try {
            setSaving(true);
            await saveSeoSettings({
                siteTitle: settings.siteTitle.trim(),
                siteDescription: settings.siteDescription.trim(),
                defaultOgImage: settings.defaultOgImage.trim(),
                robotsIndex: settings.robotsIndex,
            });
            toast({ title: 'Kaydedildi', description: 'SEO ayarları güncellendi.' });
        } catch (error: any) {
            console.error('SEO save error:', error);
            toast({ title: 'Hata', description: error?.message ?? 'SEO ayarları kaydedilemedi.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    if (loading || !settings) return <div className="text-center py-16 text-muted-foreground">SEO ayarları yükleniyor...</div>;

    return (
        <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3 mb-6">
                <Search size={28} className="text-[#c9a84c]" /> SEO Yönetimi
            </h2>

            <div className="grid grid-cols-1 gap-4">
                <input
                    value={settings.siteTitle}
                    onChange={(e) => setSettings((p) => (p ? { ...p, siteTitle: e.target.value } : p))}
                    placeholder="Site Başlığı"
                    className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3"
                />
                <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings((p) => (p ? { ...p, siteDescription: e.target.value } : p))}
                    placeholder="Site Açıklaması"
                    rows={3}
                    className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3"
                />
                <input
                    value={settings.defaultOgImage}
                    onChange={(e) => setSettings((p) => (p ? { ...p, defaultOgImage: e.target.value } : p))}
                    placeholder="Varsayılan OG Görseli"
                    className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3"
                />
                <label className="inline-flex items-center gap-2 text-sm text-[#0f1e3d]">
                    <input
                        type="checkbox"
                        checked={settings.robotsIndex}
                        onChange={(e) => setSettings((p) => (p ? { ...p, robotsIndex: e.target.checked } : p))}
                    />
                    Arama motorlarında indekslemeye izin ver
                </label>

                <div>
                    <button
                        onClick={save}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-[#0f1e3d] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60"
                    >
                        <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeoManagement;

