import React, { useState, useEffect } from 'react';
import { 
  Gavel, Plus, Trash2, Search, 
  Calendar, X, Loader2, Database,
  FileText, Scale, ChevronRight, Edit2
} from 'lucide-react';
import { 
  collection, 
  setDoc,
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { toast } from '@/components/ui/use-toast';

const DecisionsManagement: React.FC = () => {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newDecision, setNewDecision] = useState({
    chamber: '4. Hukuk Dairesi',
    category: 'Hukuk Daireleri',
    caseNo: '',
    decisionNo: '',
    date: '',
    year: '',
    summary: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'courtDecisions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDecisions(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error in decisions management:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu kararı silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'courtDecisions', id));
        toast({ title: 'Karar silindi.' });
      } catch (error) {
        console.error('Error deleting decision:', error);
        toast({ title: 'Hata oluştu.', variant: 'destructive' });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const id = editingId || newDecision.caseNo.replace(/\//g, '-').replace(/\s+/g, '').toLowerCase();
      const docRef = doc(db, 'courtDecisions', id);
      
      const payload: any = {
        ...newDecision,
        tags: typeof newDecision.tags === 'string' ? newDecision.tags.split(',').map(t => t.trim()) : newDecision.tags,
        updatedAt: Timestamp.now()
      };
      
      if (!editingId) {
        payload.createdAt = Timestamp.now();
      }

      await setDoc(docRef, payload, { merge: true });
      toast({ title: editingId ? 'Karar güncellendi.' : 'Karar başarıyla eklendi.' });
      handleCancel();
    } catch (error: any) {
      console.error('Error saving decision:', error);
      toast({ title: 'Hata oluştu.', description: error?.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (decision: any) => {
    setNewDecision({
      chamber: decision.chamber || '',
      category: decision.category || '',
      caseNo: decision.caseNo || '',
      decisionNo: decision.decisionNo || '',
      date: decision.date || '',
      year: decision.year || '',
      summary: decision.summary || '',
      content: decision.content || '',
      tags: Array.isArray(decision.tags) ? decision.tags.join(', ') : ''
    });
    setEditingId(decision.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewDecision({
      chamber: '4. Hukuk Dairesi',
      category: 'Hukuk Daireleri',
      caseNo: '',
      decisionNo: '',
      date: '',
      year: '',
      summary: '',
      content: '',
      tags: ''
    });
  };

  const filteredDecisions = decisions.filter(d => 
    d.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.chamber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-[#c9a84c]" size={40} />
        <p className="text-[#6b7280] font-bold">Kararlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#c9a84c]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#c9a84c]/10">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0f1e3d] flex items-center gap-3">
              <Gavel className="text-[#c9a84c]" size={24} />
              Mahkeme Kararları Yönetimi
            </h2>
            <p className="text-[#6b7280] text-xs font-medium mt-1 uppercase tracking-tight">Emsal kararları buradan ekleyin ve güncelleyin.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" size={16} />
              <input 
                type="text" 
                placeholder="Karar ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-[#c9a84c]/50 w-64 text-[#0f1e3d] font-medium"
              />
            </div>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-[#c9a84c] text-[#0f1e3d] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e2c97e] transition-all shadow-sm shadow-[#c9a84c]/20"
            >
              {isAdding ? <X size={18} /> : <Plus size={18} strokeWidth={3} />}
              <span>{isAdding ? 'Vazgeç' : 'Yeni Karar'}</span>
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleSave} className="mb-10 bg-[#f8f5ef] p-8 rounded-2xl border border-[#c9a84c]/10 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Esas No</label>
                    <input 
                      required
                      type="text" 
                      value={newDecision.caseNo}
                      onChange={(e) => setNewDecision({...newDecision, caseNo: e.target.value})}
                      placeholder="2026/830 E."
                      className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Karar No</label>
                    <input 
                      required
                      type="text" 
                      value={newDecision.decisionNo}
                      onChange={(e) => setNewDecision({...newDecision, decisionNo: e.target.value})}
                      placeholder="2026/931 K."
                      className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Karar Tarihi</label>
                    <input 
                      required
                      type="text" 
                      value={newDecision.date}
                      onChange={(e) => setNewDecision({...newDecision, date: e.target.value})}
                      placeholder="21.01.2026"
                      className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Yıl</label>
                    <input 
                      required
                      type="text" 
                      value={newDecision.year}
                      onChange={(e) => setNewDecision({...newDecision, year: e.target.value})}
                      placeholder="2026"
                      className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Daire</label>
                  <input 
                    required
                    type="text" 
                    value={newDecision.chamber}
                    onChange={(e) => setNewDecision({...newDecision, chamber: e.target.value})}
                    placeholder="4. Hukuk Dairesi"
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[#0f1e3d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Kategori</label>
                  <select 
                    value={newDecision.category}
                    onChange={(e) => setNewDecision({...newDecision, category: e.target.value})}
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-bold text-[13px] text-[#0f1e3d]"
                  >
                    <option>Hukuk Daireleri</option>
                    <option>Ceza Daireleri</option>
                    <option>Hukuk Genel Kurulu</option>
                    <option>Ceza Genel Kurulu</option>
                    <option>BAM Kararları</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Kısa Özet</label>
                  <textarea 
                    required
                    rows={3}
                    value={newDecision.summary}
                    onChange={(e) => setNewDecision({...newDecision, summary: e.target.value})}
                    placeholder="Kararın kısa özeti..."
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-[13px] text-[#0f1e3d]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Karar İçeriği</label>
                  <textarea 
                    required
                    rows={6}
                    value={newDecision.content}
                    onChange={(e) => setNewDecision({...newDecision, content: e.target.value})}
                    placeholder="Kararın tam metni..."
                    className="w-full bg-white p-4 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-[13px] text-[#0f1e3d] leading-relaxed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6b7280] ml-1">Etiketler (Virgülle ayırın)</label>
                  <input 
                    type="text" 
                    value={newDecision.tags}
                    onChange={(e) => setNewDecision({...newDecision, tags: e.target.value})}
                    placeholder="İcra Hukuku, Tazminat, Görev"
                    className="w-full bg-white p-3 rounded-xl border border-[#c9a84c]/20 focus:border-[#c9a84c] outline-none font-medium text-xs text-[#0f1e3d]"
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
                {isSaving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kararı Kaydet'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4">
          {filteredDecisions.length > 0 ? (
            filteredDecisions.map((decision) => (
              <div key={decision.id} className="group bg-white p-5 rounded-2xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/40 hover:shadow-md transition-all flex items-center justify-between gap-6">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-[#f8f5ef] flex items-center justify-center text-[#0f1e3d] border border-[#c9a84c]/10 group-hover:scale-105 transition-transform">
                    <Scale size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-[#0f1e3d]">{decision.caseNo} / {decision.decisionNo}</h3>
                      <span className="text-[9px] px-2 py-0.5 bg-[#f8f5ef] rounded text-[#0f1e3d]/60 border border-[#c9a84c]/10 font-black uppercase tracking-tighter">{decision.chamber}</span>
                    </div>
                    <p className="text-[#6b7280] text-[11px] font-medium line-clamp-1 italic">"{decision.summary}"</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#c9a84c]" /> {decision.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(decision)}
                    className="p-3 rounded-xl bg-[#c9a84c]/10 text-[#0f1e3d] hover:bg-[#c9a84c]/20 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(decision.id)}
                    className="p-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-[#e24b4a] transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-[#f8f5ef] rounded-2xl border-2 border-dashed border-[#c9a84c]/20">
              <Gavel className="mx-auto text-[#c9a84c]/30 mb-4" size={48} />
              <p className="text-[#6b7280] font-bold">Kayıtlı karar bulunamadı.</p>
              <button onClick={() => setIsAdding(true)} className="mt-4 text-[#c9a84c] font-black text-sm uppercase tracking-widest hover:underline">İlk kararı ekleyin</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionsManagement;
