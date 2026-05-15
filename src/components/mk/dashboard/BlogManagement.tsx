import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Search, 
  Calendar, Image as ImageIcon,
  X, Loader2, Database
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  setDoc,
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { blogPosts as staticBlogPosts } from '../../../data/blogPosts';
import { toast } from '@/components/ui/use-toast';

interface BlogManagementProps {
  isAdding?: boolean;
  setIsAdding?: (value: boolean) => void;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ 
  isAdding: propsIsAdding, 
  setIsAdding: propsSetIsAdding 
}) => {
  const [internalIsAdding, setInternalIsAdding] = useState(false);
  
  const isAdding = propsIsAdding !== undefined ? propsIsAdding : internalIsAdding;
  const setIsAdding = propsSetIsAdding !== undefined ? propsSetIsAdding : setInternalIsAdding;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    category: 'Makaleler',
    author: 'Av. Mahmut Kaya',
    readTime: '5 dk',
    desc: '',
    content: '',
    image: '/images/blog/default.png'
  });

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error in management:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Yazı silinirken bir hata oluştu.');
      }
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const slug = newPost.slug || newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const docRef = editingId ? doc(db, 'blogPosts', editingId) : doc(db, 'blogPosts', slug);
      
      const payload: any = {
        ...newPost,
        slug,
        updatedAt: Timestamp.now()
      };
      
      if (!editingId) {
        payload.createdAt = Timestamp.now();
        payload.date = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
      }

      await setDoc(docRef, payload, { merge: true });
      toast({ title: editingId ? 'Yazı güncellendi.' : 'Yazı başarıyla eklendi.', description: 'Blog yazınız Firestore’a kaydedildi.' });
      handleCancel();
    } catch (error: any) {
      console.error('Error adding/updating post:', error);
      toast({ title: 'Hata oluştu.', description: error?.message ?? 'Lütfen tekrar deneyin.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post: any) => {
    setNewPost({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Makaleler',
      author: post.author || 'Av. Mahmut Kaya',
      readTime: post.readTime || '5 dk',
      desc: post.desc || '',
      content: post.content || '',
      image: post.image || '/images/blog/default.png'
    });
    setEditingId(post.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewPost({
      title: '',
      slug: '',
      category: 'Makaleler',
      author: 'Av. Mahmut Kaya',
      readTime: '5 dk',
      desc: '',
      content: '',
      image: '/images/blog/default.png'
    });
  };

  const handleSeed = async () => {
    if (window.confirm('Mevcut makaleleri Firestore\'a aktarmak istiyor musunuz?')) {
      setIsSeeding(true);
      try {
        for (const post of staticBlogPosts) {
          const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
          await setDoc(doc(db, 'blogPosts', slug), {
            ...post,
            slug,
            createdAt: Timestamp.now()
          });
        }
        toast({ title: 'Örnek veriler yüklendi.', description: 'Blog yazıları Firestore’a aktarıldı.' });
      } catch (error: any) {
        console.error('Error seeding posts:', error);
        toast({ title: 'Aktarım sırasında bir hata oluştu.', description: error?.message ?? 'Lütfen tekrar deneyin.', variant: 'destructive' });
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-[#c9a84c]" size={40} />
        <p className="text-[#6b7280] font-bold">Blog yazıları yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#c9a84c]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#c9a84c]/10">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0f1e3d] flex items-center gap-3">
              <FileText className="text-[#c9a84c]" size={24} />
              Blog Yönetimi
            </h2>
            <p className="text-[#6b7280] text-xs font-medium mt-1 uppercase tracking-tight">Sitedeki makaleleri buradan yönetin.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="bg-[#0f1e3d] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1a2f55] transition-all text-xs border border-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Database size={16} className="text-[#c9a84c]" />
              {isSeeding ? 'Yükleniyor...' : 'Örnek Verileri Yükle'}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
              <input 
                type="text" 
                placeholder="Yazı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-[#c9a84c]/50 w-64 text-[#0f1e3d] font-medium"
              />
            </div>
            <button 
              onClick={handleCancel}
              className="bg-[#c9a84c] text-[#0f1e3d] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e2c97e] transition-all shadow-sm shadow-[#c9a84c]/20"
            >
              {isAdding ? <X size={18} /> : <Plus size={18} strokeWidth={3} />}
              <span>{isAdding ? 'Vazgeç' : 'Yeni Yazı'}</span>
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleAddPost} className="mb-10 bg-[#f8f5ef] p-8 rounded-2xl border border-[#c9a84c]/10 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Başlık</label>
                  <input 
                    required
                    type="text" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Makale başlığı..."
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                  />
                </div>
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Görsel Yolu</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
                    <input 
                      type="text" 
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                      placeholder="/images/blog/..."
                      className="w-full bg-white p-3 pl-10 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-xs text-[#0f1e3d]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Slug (Opsiyonel)</label>
                  <input 
                    type="text" 
                    value={newPost.slug}
                    onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                    placeholder="icra-hukuku-v-b"
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-xs text-[#0f1e3d]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Kategori</label>
                    <select 
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[13px] text-[#0f1e3d]"
                    >
                      <option>Makaleler</option>
                      <option>Hukukta Gündem</option>
                      <option>Bültenler</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Okuma Süresi</label>
                    <input 
                      type="text" 
                      value={newPost.readTime}
                      onChange={(e) => setNewPost({...newPost, readTime: e.target.value})}
                      placeholder="5 dk"
                      className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[13px] text-[#0f1e3d]"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">İçerik (Markdown)</label>
                  <textarea 
                    required
                    rows={8}
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Yazı içeriği..."
                    className="w-full bg-white p-4 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-[13px] text-[#0f1e3d] leading-relaxed"
                  />
                </div>
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Kısa Özet</label>
                   <textarea 
                    required
                    rows={2}
                    value={newPost.desc}
                    onChange={(e) => setNewPost({...newPost, desc: e.target.value})}
                    placeholder="Liste görünümünde görünecek kısa özet..."
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-[13px] text-[#0f1e3d]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#0f1e3d] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#1a2f55] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Yazıyı Yayınla'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="group bg-white p-4 rounded-2xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/40 hover:shadow-md transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f8f5ef] flex-shrink-0 border border-[#c9a84c]/10 relative group-hover:scale-105 transition-transform">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f1e3d] leading-tight group-hover:text-[#c9a84c] transition-colors">{post.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#c9a84c]" /> {post.date}</span>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#f8f5ef] rounded text-[#0f1e3d]/70 border border-[#c9a84c]/10">{post.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pr-2">
                  <button 
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 rounded-xl bg-[#c9a84c]/20 text-[#0f1e3d] font-bold hover:bg-[#c9a84c]/30 transition-all"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-[#e24b4a] transition-all"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-[#f8f5ef] rounded-2xl border-2 border-dashed border-[#c9a84c]/20">
              <FileText className="mx-auto text-[#c9a84c]/30 mb-4" size={48} />
              <p className="text-[#6b7280] font-bold">Kayıtlı yazı bulunamadı.</p>
              <button onClick={() => setIsAdding(true)} className="mt-4 text-[#c9a84c] font-black text-sm uppercase tracking-widest hover:underline">İlk yazınızı ekleyin</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
