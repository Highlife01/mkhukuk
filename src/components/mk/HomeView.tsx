import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Scale, BookOpen, ChevronRight, Shield, Award, 
  Users, Briefcase, Home, Gavel, Globe, CheckCircle2, 
  ArrowRight, Phone, Mail, MapPin, Clock, Quote, FileText,
  Star, ExternalLink, ArrowUpRight
} from 'lucide-react';

const HomeView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const titleParts = (t('home.heroTitle1') || 'Av. Mahmut Kaya').split(' ');
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(' ');

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const services = [
    { id: 'aile', icon: <Users size={32} />, title: t('home.service1Title'), desc: t('home.service1Desc'), link: "/hizmetler/aile-hukuku" },
    { id: 'is', icon: <Briefcase size={32} />, title: t('home.service2Title'), desc: t('home.service2Desc'), link: "/hizmetler/is-hukuku" },
    { id: 'gayrimenkul', icon: <Home size={32} />, title: t('home.service3Title'), desc: t('home.service3Desc'), link: "/hizmetler/gayrimenkul-hukuku" },
    { id: 'ceza', icon: <Shield size={32} />, title: t('home.service4Title'), desc: t('home.service4Desc'), link: "/hizmetler/ceza-hukuku" },
    { id: 'bilisim', icon: <Globe size={32} />, title: t('home.service5Title'), desc: t('home.service5Desc'), link: "/hizmetler/bilisim-hukuku" },
    { id: 'icra', icon: <Scale size={32} />, title: t('home.service6Title'), desc: t('home.service6Desc'), link: "/hizmetler/icra-ve-iflas-hukuku" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'Yeni',
        createdAt: serverTimestamp(),
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full page-transition">
      {/* ─── ULTRA PREMIUM HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#071a33] text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-amber/10 rounded-full blur-[150px] animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber/5 rounded-full blur-[120px] animate-pulse-slow" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber/10 border border-amber/20 gold-shimmer">
              <Star className="text-amber animate-spin-slow" size={14} />
              <span className="text-amber text-[10px] font-black uppercase tracking-[0.3em]">{t('home.badge')}</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[1.1] tracking-tighter">
              {firstWord} <br />
              <span className="gradient-text italic font-medium">{restOfTitle}</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-xl font-body leading-relaxed text-balance">
              {t('home.heroDesc')}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <button 
                onClick={() => navigate('/hizmetler')}
                className="px-10 py-5 bg-amber hover:bg-amber-light text-nav font-black rounded-2xl transition-all shadow-2xl shadow-amber/20 flex items-center gap-3 group gold-shimmer gold-glow uppercase tracking-widest text-xs"
              >
                {t('home.ctaServices')}
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/ai-asistan')}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black transition-all uppercase tracking-widest text-xs backdrop-blur-md"
              >
                {t('home.ctaAi')}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-12 pt-16 border-t border-white/10">
              <div className="group cursor-default">
                <div className="text-4xl font-black text-white group-hover:text-amber transition-colors">15+</div>
                <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mt-2">{t('home.stats.lawyers')}</div>
              </div>
              <div className="group cursor-default">
                <div className="text-4xl font-black text-white group-hover:text-amber transition-colors">500+</div>
                <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mt-2">{t('home.stats.success')}</div>
              </div>
              <div className="group cursor-default">
                <div className="text-4xl font-black text-white group-hover:text-amber transition-colors">%98</div>
                <div className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mt-2">{t('home.stats.users')}</div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative group">
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] premium-shadow">
              <img src="/images/hero/1.png" alt="Hero" className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/90 via-[#071a33]/20 to-transparent" />
            </div>
            {/* Floating Premium Card */}
            <div className="absolute -bottom-10 -left-10 z-20 glass-card p-8 rounded-[2rem] shadow-2xl max-w-[280px] animate-bounce-slow border-amber/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber text-nav rounded-2xl flex items-center justify-center shadow-lg shadow-amber/30 gold-shimmer">
                  <Award size={24} />
                </div>
                <div>
                  <div className="font-black text-nav text-sm tracking-tight uppercase">Mükemmellik</div>
                  <div className="text-[10px] text-amber-dark font-bold uppercase tracking-widest">Ödüllü Danışmanlık</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Yüksek yargı kararları ve yapay zeka analizleriyle savunma stratejinizi bir üst seviyeye taşıyoruz.
              </p>
            </div>
            {/* Experience Badge */}
            <div className="absolute -top-6 -right-6 z-20 bg-amber text-nav px-6 py-3 rounded-2xl font-black text-sm shadow-xl gold-shimmer gold-glow">
              20+ Yıl Tecrübe
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ─── */}
      <section className="py-32 bg-[#f7f4ee]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 text-amber bg-amber/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                {t('home.servicesBadge')}
              </div>
              <h3 className="text-5xl md:text-6xl font-display font-black text-nav leading-tight tracking-tight">
                Uzmanlık Alanlarımızla <br /> <span className="text-amber italic">Güvendesiniz.</span>
              </h3>
            </div>
            <Link to="/hizmetler" className="flex items-center gap-3 text-nav font-black uppercase tracking-widest text-xs hover:text-amber transition-all group">
              TÜM HİZMETLERİMİZ <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((s) => (
              <div key={s.id} className="group glass-card p-10 rounded-[2.5rem] border-transparent hover:border-amber/20 transition-all duration-500 hover:-translate-y-2 premium-shadow bg-white">
                <div className="w-20 h-20 bg-[#f7f4ee] rounded-[1.5rem] flex items-center justify-center text-amber mb-8 group-hover:bg-amber group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
                  {s.icon}
                </div>
                <h4 className="text-2xl font-black text-nav mb-4 tracking-tight group-hover:text-amber transition-colors">{s.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{s.desc}</p>
                <Link to={s.link} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber group-hover:gap-4 transition-all">
                  DETAYLI İNCELE <ChevronRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI TECHNOLOGY SECTION ─── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-[#071a33] rounded-[4rem] p-10 md:p-20 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(7,26,51,0.3)]">
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white rounded-full blur-[80px]" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8 text-white">
                <div className="inline-flex items-center gap-3 text-amber bg-amber/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] gold-shimmer border border-amber/20">
                  <Sparkles size={16} className="animate-pulse" /> HUKUKUN GELECEĞİ
                </div>
                <h3 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-tighter">
                  {t('home.aiTitle1')} <span className="text-amber italic">{t('home.aiTitle2')}</span>
                </h3>
                <p className="text-white/70 leading-relaxed text-xl font-medium max-w-lg">
                  MK Hukuk'un yapay zeka entegrasyonu, binlerce emsal kararı saniyeler içinde tarayarak davanızın sonucunu önceden analiz eder.
                </p>
                <button 
                  onClick={() => navigate('/ai-asistan')}
                  className="px-12 py-6 bg-amber text-nav font-black rounded-2xl hover:bg-amber-light transition-all flex items-center gap-3 gold-shimmer gold-glow uppercase tracking-widest text-xs"
                >
                  YAPAY ZEKAYI DENEYİN <ArrowRight size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 relative">
                <div className="space-y-6">
                  <div className="glass-card p-8 rounded-3xl text-center transform translate-y-8 hover:translate-y-4 transition-all duration-500 border-white/5 backdrop-blur-xl">
                    <div className="text-amber mb-4 flex justify-center"><FileText size={32} /></div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Dilekçe Analizi</span>
                  </div>
                  <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-4 transition-all duration-500 border-white/5 backdrop-blur-xl">
                    <div className="text-amber mb-4 flex justify-center"><Shield size={32} /></div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Risk Raporu</span>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="glass-card p-8 rounded-3xl text-center hover:translate-y-4 transition-all duration-500 border-white/5 backdrop-blur-xl">
                    <div className="text-amber mb-4 flex justify-center"><Scale size={32} /></div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Emsal Sorgu</span>
                  </div>
                  <div className="glass-card p-8 rounded-3xl text-center transform -translate-y-8 hover:-translate-y-12 transition-all duration-500 border-white/5 backdrop-blur-xl">
                    <div className="text-amber mb-4 flex justify-center"><Gavel size={32} /></div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">Karar Analizi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="py-32 bg-[#f7f4ee]" id="contact">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-amber bg-amber/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                İLETİŞİME GEÇİN
              </div>
              <h3 className="text-5xl md:text-7xl font-display font-black text-nav leading-tight tracking-tighter">
                Hukuki Çözüm <br /> <span className="text-amber italic">Ortağınızız.</span>
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
                Adalet yolculuğunuzda size en profesyonel desteği sunmak için buradayız. Formu doldurun, uzman ekibimiz size ulaşsın.
              </p>
            </div>
            
            <div className="grid gap-6">
              {[
                { icon: <Phone size={24} />, label: "Telefon", value: "+90 532 202 67 99", color: "bg-blue-50 text-blue-600" },
                { icon: <Mail size={24} />, label: "E-Posta", value: "info@mkhukuk.com", color: "bg-emerald-50 text-emerald-600" },
                { icon: <MapPin size={24} />, label: "Adres", value: "Adalet Plaza, Kat:4, Adana", color: "bg-amber-50 text-amber" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{item.label}</div>
                    <div className="text-nav font-black text-lg">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-border/50 relative overflow-hidden premium-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full -mr-16 -mt-16" />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Ad Soyad</label>
                  <input 
                    type="text" required name="name" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-5 bg-[#f7f4ee]/50 border border-border/50 rounded-2xl outline-none focus:border-amber focus:bg-white transition-all font-bold" 
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-Posta</label>
                  <input 
                    type="email" required name="email" value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-5 bg-[#f7f4ee]/50 border border-border/50 rounded-2xl outline-none focus:border-amber focus:bg-white transition-all font-bold" 
                    placeholder="E-posta Adresiniz"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Konu</label>
                <input 
                  type="text" name="subject" value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-5 bg-[#f7f4ee]/50 border border-border/50 rounded-2xl outline-none focus:border-amber focus:bg-white transition-all font-bold" 
                  placeholder="Başvuru Konusu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mesajınız</label>
                <textarea 
                  required rows={4} name="message" value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-5 bg-[#f7f4ee]/50 border border-border/50 rounded-2xl outline-none focus:border-amber focus:bg-white transition-all font-bold resize-none" 
                  placeholder="Hukuki sorunuzu buraya detaylıca yazabilirsiniz..."
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-6 bg-nav text-white font-black rounded-2xl hover:bg-nav/90 transition shadow-2xl flex items-center justify-center gap-3 gold-shimmer gold-glow uppercase tracking-[0.2em] text-xs"
              >
                {isSubmitting ? "İşleniyor..." : "Başvuruyu Gönder"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl text-center text-xs font-black uppercase tracking-widest animate-fade-in border border-emerald-100">
                  Mesajınız Başarıyla İletildi.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
