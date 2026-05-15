import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Search, 
  Loader2, Globe, 
  Save, X
} from 'lucide-react';
import { collection, doc, getDocs, onSnapshot, orderBy, query, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { websitePages as staticPages, WebsitePage } from '../../../data/websitePages';
import { toast } from '@/components/ui/use-toast';

const WebsiteManagement = () => {
  const [pages, setPages] = useState<WebsitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<WebsitePage | null>(null);
  const [saving, setSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'websitePages'), orderBy('slug', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as WebsitePage[];
        if (docs.length === 0) {
          setPages(staticPages);
        } else {
          setPages(docs);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Website pages snapshot error:', error);
        setPages(staticPages);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = pages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (page?: WebsitePage) => {
    setSelected(page ?? {
      slug: '',
      title: '',
      path: '',
      description: '',
      content: '',
    });
    setIsEditing(true);
  };

  const savePage = async () => {
    if (!selected) return;
    if (!selected.slug || !selected.title || !selected.path) {
      toast({ title: 'Eksik bilgi', description: 'Slug, başlık ve path zorunludur.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'websitePages', selected.slug), {
        ...selected,
        updatedAt: Timestamp.now(),
      });
      toast({ title: 'Kaydedildi', description: 'Sayfa içerikleri kaydedildi.' });
      setIsEditing(false);
      setSelected(null);
    } catch (error: any) {
      console.error('Web sayfası kaydetme hatası:', error);
      toast({ title: 'Kaydetme hatası', description: error?.message ?? 'Tekrar deneyin.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const removePage = async (slug: string) => {
    if (!window.confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'websitePages', slug));
      toast({ title: 'Silindi', description: 'Sayfa silindi.' });
    } catch (error: any) {
      console.error('Sayfa silme hatası:', error);
      toast({ title: 'Silme hatası', description: error?.message ?? 'Tekrar deneyin.', variant: 'destructive' });
    }
  };

  const seedPages = async () => {
    if (!window.confirm('Örnek varsayılan sayfaları Firestore’a aktarmak istiyor musunuz? Mümkünse üzerine yazılacaktır.')) return;
    setIsSeeding(true);
    try {
      for (const page of staticPages) {
        await setDoc(doc(db, 'websitePages', page.slug), {
          ...page,
          updatedAt: Timestamp.now(),
        });
      }
      toast({ title: 'Aktarıldı', description: 'Varsayılan web sayfaları başarıyla yüklendi.' });
    } catch (error: any) {
      console.error('Seeding error:', error);
      toast({ title: 'Aktarım Hatası', description: error?.message ?? 'Lütfen tekrar deneyin.', variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-[#c9a84c]" size={40} />
        <p className="text-[#6b7280] font-bold">Sayfalar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#c9a84c]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#c9a84c]/10">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0f1e3d] flex items-center gap-3">
              <Globe className="text-[#c9a84c]" size={24} />
              Web Sayfaları
            </h2>
            <p className="text-[#6b7280] text-xs font-medium mt-1 uppercase tracking-tight">Site içeriğinizi yönetin.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={seedPages}
              disabled={isSeeding}
              className="bg-[#0f1e3d] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1a2f55] transition-all text-xs border border-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Globe size={16} className="text-[#c9a84c]" />
              {isSeeding ? 'Yükleniyor...' : 'Varsayılanları Yükle'}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
              <input
                type="text"
                placeholder="Sayfa ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-[#c9a84c]/50 w-64 text-[#0f1e3d] font-medium"
              />
            </div>
            <button
              onClick={() => startEdit()}
              className="bg-[#c9a84c] text-[#0f1e3d] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e2c97e] transition-all shadow-sm shadow-[#c9a84c]/20"
            >
              <Plus size={18} strokeWidth={3} />
              Yeni Sayfa
            </button>
          </div>
        </div>

        {isEditing && selected && (
          <div className="mb-10 bg-[#f8f5ef] p-8 rounded-2xl border border-[#c9a84c]/10 animate-in zoom-in-95 duration-300">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0f1e3d]">Sayfa Düzenle</h3>
                <p className="text-xs text-[#6b7280]">Slug veya başlığı değiştirerek yeni sayfa kaydedebilirsiniz.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelected(null);
                }}
                className="p-2 rounded-xl text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Slug</label>
                <input
                  value={selected.slug}
                  onChange={(e) => setSelected({ ...selected, slug: e.target.value })}
                  placeholder="sayfa-slug"
                  className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                />

                <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Başlık</label>
                <input
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                  placeholder="Sayfa Başlığı"
                  className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                />

                <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Path</label>
                <input
                  value={selected.path}
                  onChange={(e) => setSelected({ ...selected, path: e.target.value })}
                  placeholder="/hakkimizda"
                  className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                />

                <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Kısa Açıklama</label>
                <textarea
                  value={selected.description}
                  onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-[#0f1e3d]"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">İçerik (Markdown)</label>
                <textarea
                  value={selected.content}
                  onChange={(e) => setSelected({ ...selected, content: e.target.value })}
                  rows={12}
                  className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-[#0f1e3d] leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              {selected.slug && (
                <button
                  type="button"
                  onClick={() => selected.slug && removePage(selected.slug)}
                  className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all"
                >
                  <Trash2 size={16} /> Sil
                </button>
              )}
              <button
                type="button"
                onClick={savePage}
                disabled={saving}
                className="bg-[#0f1e3d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a2f55] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Kaydet
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filtered.length > 0 ? (
            filtered.map((page) => (
              <div key={page.slug} className="group bg-white p-4 rounded-2xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/40 hover:shadow-md transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f8f5ef] flex-shrink-0 border border-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f1e3d] leading-tight group-hover:text-[#c9a84c] transition-colors">{page.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">
                      <span className="px-2 py-0.5 bg-[#f8f5ef] rounded text-[#0f1e3d]/70 border border-[#c9a84c]/10">{page.path}</span>
                      <span className="px-2 py-0.5 bg-[#f8f5ef] rounded text-[#0f1e3d]/70 border border-[#c9a84c]/10">{page.slug}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(page)}
                    className="px-4 py-2 rounded-xl bg-[#c9a84c]/20 text-[#0f1e3d] font-bold hover:bg-[#c9a84c]/30 transition-all"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => removePage(page.slug)}
                    className="p-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-[#f8f5ef] rounded-2xl border-2 border-dashed border-[#c9a84c]/20">
              <Globe className="mx-auto text-[#c9a84c]/30 mb-4" size={48} />
              <p className="text-[#6b7280] font-bold">Hiç sayfa bulunamadı.</p>
              <button
                onClick={() => startEdit()}
                className="mt-4 text-[#c9a84c] font-black text-sm uppercase tracking-widest hover:underline"
              >
                İlk sayfanızı ekleyin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteManagement;
