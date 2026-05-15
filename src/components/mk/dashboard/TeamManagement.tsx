import React, { useEffect, useState } from 'react';
import { UserPlus, Trash2, Camera, AtSign, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { TeamMember, createTeamMember, deleteTeamMember, subscribeTeamMembers } from '@/lib/dashboardApi';

const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<TeamMember>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeTeamMembers(
      (data) => {
        setMembers(data);
        setLoading(false);
      },
      (error) => {
        console.error('Team members snapshot error:', error);
        toast({
          title: 'Ekip verisi alınamadı',
          description: 'Lütfen bağlantınızı kontrol edip tekrar deneyin.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (form.name || '').trim();
    if (!name) {
      toast({ title: 'Eksik bilgi', description: 'Ad Soyad alanı zorunludur.', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      await createTeamMember({
        name,
        role: (form.role || '').trim() || 'Avukat',
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        avatarUrl: form.avatarUrl?.trim(),
      });
      toast({ title: 'Kaydedildi', description: 'Ekip üyesi eklendi.' });
      setForm({});
      setIsAdding(false);
    } catch (error: any) {
      console.error('Team member create error:', error);
      toast({ title: 'Hata', description: error?.message ?? 'Üye eklenemedi.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (id: string) => {
    if (!window.confirm('Bu ekip üyesini silmek istediğinize emin misiniz?')) return;
    try {
      await deleteTeamMember(id);
      toast({ title: 'Silindi', description: 'Ekip üyesi kaldırıldı.' });
    } catch (error: any) {
      console.error('Team member delete error:', error);
      toast({ title: 'Hata', description: error?.message ?? 'Üye silinemedi.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
        <div className="text-center py-20 border-2 border-dashed border-[#c9a84c]/20 rounded-3xl">
          <p className="text-muted-foreground font-medium">Ekip verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-8 shadow-sm animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0f1e3d] flex items-center gap-3">
            <UserPlus size={28} className="text-[#c9a84c]" />
            Ekip Üyeleri
          </h2>
          <p className="text-sm text-[#6b7280] mt-1 max-w-xl">
            Hukuk bürosu ekibinizi buradan yönetin. Üye ekleyebilir, profil fotoğrafı
            ve iletişim bilgilerini saklayabilirsiniz.
          </p>
        </div>
        <button
          onClick={() => setIsAdding((prev) => !prev)}
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-4 py-2 rounded-xl font-semibold hover:bg-[#e2c97e] transition"
        >
          <UserPlus size={16} /> {isAdding ? 'İptal' : 'Yeni Üye Ekle'}
        </button>
      </div>

      {isAdding && (
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8" onSubmit={addMember}>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Ad Soyad</label>
            <input
              value={form.name || ''}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="Örn. Av. Ayşe Yılmaz"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Pozisyon / Ünvan</label>
            <input
              value={form.role || ''}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
              placeholder="Örn. Avukat"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">E-posta</label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
                placeholder="ornek@domain.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Telefon</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
              <input
                type="tel"
                value={form.phone || ''}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
                placeholder="05xx xxx xx xx"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#6b7280]">Profil Fotoğrafı URL</label>
            <div className="relative">
              <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" size={18} />
              <input
                value={form.avatarUrl || ''}
                onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                className="w-full bg-[#f8f5ef] border border-[#c9a84c]/20 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-[#c9a84c]"
                placeholder="https://..."
              />
            </div>
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
                setForm({});
              }}
              className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {members.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[#c9a84c]/20 rounded-3xl">
          <p className="text-muted-foreground font-medium">Henüz ekip üyesi eklenmedi.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f1e3d] px-6 py-3 rounded-xl font-bold hover:bg-[#e2c97e] transition"
          >
            <UserPlus size={18} /> Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <div key={member.id} className="bg-[#f8f5ef] border border-[#c9a84c]/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#e2c97e]/40 flex items-center justify-center overflow-hidden">
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#0f1e3d]">{member.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-[#0f1e3d]">{member.name}</div>
                  <div className="text-xs uppercase tracking-wide font-semibold text-[#6b7280] mt-0.5">{member.role}</div>
                </div>
                <button
                  onClick={() => removeMember(member.id)}
                  className="p-2 rounded-xl bg-white border border-[#c9a84c]/20 text-[#e24b4a] hover:bg-[#ffecec] transition"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-sm text-[#475569] space-y-1">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <AtSign size={14} className="text-[#6b7280]" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#6b7280]" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
