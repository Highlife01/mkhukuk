import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, CheckCircle, Gavel, Scale, BookOpen, FileText,
  ChevronRight, Shield, Award, TrendingUp, MessageCircle,
  ShieldCheck, ArrowRight, Users, Briefcase, Home, Star,
  Phone, Mail, MapPin, Clock, Quote, ExternalLink, Send, CheckCircle2, AlertCircle, Loader2, Cpu, Globe
} from 'lucide-react';

const HomeView: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    '/images/hero/1.png',
    '/images/hero/2.png',
    '/images/hero/3.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'Yeni',
        createdAt: serverTimestamp(),
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const services = [
    { icon: <Users size={24} />, title: t('home.service1Title'), desc: t('home.service1Desc'), link: "/hizmetler/aile-hukuku" },
    { icon: <Briefcase size={24} />, title: t('home.service2Title'), desc: t('home.service2Desc'), link: "/hizmetler/is-hukuku" },
    { icon: <Home size={24} />, title: t('home.service3Title'), desc: t('home.service3Desc'), link: "/hizmetler/gayrimenkul-hukuku" },
    { icon: <Shield size={24} />, title: t('home.service4Title'), desc: t('home.service4Desc'), link: "/hizmetler/ceza-hukuku" },
    { icon: <Globe size={24} />, title: t('home.service5Title'), desc: t('home.service5Desc'), link: "/hizmetler/bilisim-hukuku" },
    { icon: <Scale size={24} />, title: t('home.service6Title'), desc: t('home.service6Desc'), link: "/hizmetler/icra-ve-iflas-hukuku" },
    { icon: <ShieldCheck size={24} />, title: t('home.service7Title'), desc: t('home.service7Desc'), link: "/hizmetler/tuketici-hukuku" },
    { icon: <Gavel size={24} />, title: t('home.service8Title'), desc: t('home.service8Desc'), link: "/hizmetler/sozlesme-hukuku" },
  ];

  const testimonials = [
    {
      name: "Mehmet Y.",
      role: "İş Davası Müvekkili",
      text: "MK Hukuk ekibi, iş davası sürecimde beni hem hukuki hem de psikolojik olarak destekledi. Profesyonel ve sonuç odaklı çalışmaları sayesinde davamızı kazandık.",
      rating: 5,
    },
    {
      name: "Zeynep K.",
      role: "Gayrimenkul Müvekkili",
      text: "Tapu iptali davamda gösterdikleri özen ve uzmanlık takdire şayandı. Her aşamada bilgilendirilmem, süreci çok kolaylaştırdı.",
      rating: 5,
    },
    {
      name: "Ali D.",
      role: "Ticaret Hukuku Müvekkili",
      text: "Şirketimizin sözleşme uyuşmazlığında hızlı ve etkili çözüm ürettiler. Büronun sahip olduğu teknolojik imkanlar sayesinde emsal kararlara ulaşmamız çok kısa sürdü.",
      rating: 5,
    },
  ];

  return (
    <div className="font-sans antialiased selection:bg-[#C5A059]/30 selection:text-white">
      {/* ─── HERO SECTION - LIGHT PREMIUM ─── */}
      <section className="relative min-h-[90vh] flex items-center bg-[#F8F5EF] overflow-hidden">
        {/* Background Images with subtle presence */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
          {heroImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-all [transition-duration:6000ms] ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            >
              <img
                src={img}
                alt={`Av. Mahmut Kaya Hero ${index + 1}`}
                className="w-full h-full object-cover object-[center_20%]"
              />
            </div>
          ))}
        </div>

        {/* Decorative elements for light theme */}
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5EF] via-[#F8F5EF]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          
          {/* Glowing Accents - Soft */}
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#004488]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20 py-24 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-6 py-2.5 rounded-full shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                <span className="text-[#001229]/60 text-[10px] font-black uppercase tracking-[0.3em]">
                  {t('home.badge')}
                </span>
              </div>

              <div className="relative">
                <div className="absolute -top-32 -left-12 text-[10rem] font-black text-[#001229]/5 select-none pointer-events-none font-serif hidden lg:block whitespace-nowrap">MK HUKUK</div>
                <h1 className="text-5xl md:text-6xl lg:text-[4.8rem] font-bold text-[#001229] leading-[1.05] tracking-tight font-serif relative z-10">
                  {t('home.heroTitle1')}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#8B6E31] to-[#C5A059]">
                    {t('home.heroTitle2')}
                  </span>
                </h1>
              </div>

              <p className="text-xl text-slate-600 max-w-xl leading-relaxed font-light border-l-2 border-[#C5A059]/30 pl-6">
                {t('home.heroDesc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link
                  to="/hizmetler"
                  className="inline-flex items-center justify-center gap-3 bg-[#001229] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#C5A059] hover:text-[#001229] transition-all duration-500 group"
                >
                  <Briefcase size={20} className="group-hover:-rotate-6 transition-transform" />
                  {t('home.ctaServices')}
                </Link>
                <Link
                  to="/ai-asistan"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#001229] border border-slate-200 px-10 py-5 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-50 hover:border-[#C5A059]/30 transition-all duration-500 group"
                >
                  <Cpu size={20} className="group-hover:rotate-12 transition-transform text-[#C5A059]" />
                  {t('home.ctaAi')}
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-10 pt-8 border-t border-slate-200">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs text-[#001229] font-black shadow-sm">
                      {['AV', 'MK', 'HK', 'DR'][i - 1]}
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-xs text-[#001229] font-black shadow-md z-10">
                    +5K
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#C5A059] mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Başarılı Sonuçlanan Dava</span>
                </div>
              </div>
            </div>

            {/* Right — Professional Panel */}
            <div className="hidden lg:block lg:col-span-5 relative">
               <div className="relative bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F5EF] rounded-bl-full"></div>
                  <h3 className="text-2xl font-serif text-[#001229] mb-8">Neden <span className="text-[#C5A059]">Av. Mahmut Kaya?</span></h3>
                  
                  <div className="space-y-8">
                     {[
                       { title: "Uzman Kadro", desc: "Alanında ihtisas yapmış deneyimli avukatlar." },
                       { title: "Şeffaf Süreç", desc: "Her aşamada anlık bilgilendirme ve raporlama." },
                       { title: "Dijital Güç", desc: "AI ile hızlandırılmış hukuki analiz ve strateji." },
                     ].map((item, idx) => (
                       <div key={idx} className="flex gap-5 items-start">
                         <div className="w-12 h-12 rounded-2xl bg-[#F8F5EF] border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shrink-0">
                           <CheckCircle2 size={20} />
                         </div>
                         <div>
                           <h4 className="text-[#001229] font-bold text-lg mb-1">{item.title}</h4>
                           <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRACTICE AREAS ─── */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 text-[#001229] font-black uppercase tracking-[0.2em] text-[10px] bg-[#F8F5EF] px-5 py-2.5 rounded-full mb-6 border border-slate-200">
              <Scale size={14} className="text-[#C5A059]" /> {t('home.servicesBadge')}
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#001229] leading-tight mb-6 font-serif">
              {t('home.servicesTitle')}
            </h2>
            <div className="h-1.5 w-24 bg-[#C5A059] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <Link
                key={i}
                to={s.link}
                className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-[#C5A059]/30 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#001229] flex items-center justify-center text-[#C5A059] mb-8 group-hover:scale-110 transition-transform duration-500">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-[#001229] mb-4">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                  {s.desc}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50">
                  <span className="inline-flex items-center gap-2 text-[#001229] text-[10px] font-black uppercase tracking-widest group-hover:text-[#C5A059] transition-colors">
                    {t('home.details')} <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI ASSISTANT - LIGHT PREMIUM ─── */}
      <section className="py-32 bg-[#F8F5EF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-20 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-[#C5A059] font-black uppercase tracking-widest text-[10px] bg-[#C5A059]/5 px-5 py-2.5 rounded-full self-start mb-8 border border-[#C5A059]/20">
                  <Sparkles size={14} /> {t('home.aiBadge')}
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-[#001229] leading-tight mb-6 font-serif">
                  {t('home.aiTitle1')}
                  <br />
                  <span className="text-[#C5A059]">{t('home.aiTitle2')}</span>
                </h2>

                <p className="text-slate-600 leading-relaxed text-lg mb-10 font-light">
                  {t('home.aiDesc')}
                  <strong className="text-[#001229] font-medium"> {t('home.aiDescBold')}</strong> {t('home.aiDescEnd')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {[
                    t('home.aiFeature1'),
                    t('home.aiFeature2'),
                    t('home.aiFeature3'),
                    t('home.aiFeature4'),
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4 text-sm font-bold text-[#001229] bg-[#F8F5EF]/50 p-4 rounded-2xl border border-slate-100">
                      <CheckCircle size={18} className="text-[#C5A059]" /> {item}
                    </div>
                  ))}
                </div>

                <Link
                  to="/ai-asistan"
                  className="inline-flex items-center justify-center gap-3 bg-[#001229] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#001229] transition-all self-start shadow-xl group"
                >
                  <Scale size={20} className="group-hover:rotate-12 transition-transform" />
                  {t('home.startChat')}
                </Link>
              </div>

              <div className="bg-[#001229] p-12 lg:p-20 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 to-transparent"></div>
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative z-10">
                  <div className="bg-[#F8F5EF] p-6 flex items-center gap-4 border-b border-slate-100">
                    <div className="bg-[#001229] p-3 rounded-xl">
                      <Sparkles className="text-[#C5A059]" size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-lg text-[#001229] block">{t('chat.title')}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">AKTİF</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-2xl rounded-tl-md text-sm text-slate-700 border border-slate-100">
                      {t('chat.welcome')}
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#001229] text-white p-5 rounded-2xl rounded-tr-md text-sm max-w-[85%] font-medium shadow-md">
                        {t('chat.welcomeExample2')}?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREMIUM STATS ─── */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: t('home.stats.lawyers').split(' ')[0], label: t('home.stats.lawyers').split(' ').slice(1).join(' '), icon: <Award size={24} /> },
              { value: t('home.stats.decisions').split(' ')[0], label: t('home.stats.decisions').split(' ').slice(1).join(' '), icon: <FileText size={24} /> },
              { value: t('home.stats.users').split(' ')[0], label: t('home.stats.users').split(' ').slice(1).join(' '), icon: <Scale size={24} /> },
              { value: t('home.stats.success').split(' ')[0], label: t('home.stats.success').split(' ').slice(1).join(' '), icon: <TrendingUp size={24} /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F8F5EF] text-[#C5A059] mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                  {stat.icon}
                </div>
                <div className="text-4xl lg:text-5xl font-black text-[#001229] mb-2">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-32 bg-[#F8F5EF]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-[#C5A059] font-black uppercase tracking-[0.2em] text-[10px] bg-white px-5 py-2.5 rounded-full mb-6 border border-slate-100">
              <Star size={14} /> Referanslarımız
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#001229] font-serif mb-6">
              Müvekkillerimizin <span className="text-[#C5A059]">Yorumları</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative">
                <Quote size={40} className="text-[#C5A059]/10 absolute top-10 right-10" />
                <div className="flex items-center gap-1 mb-8">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-[#C5A059]" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg mb-10 italic font-serif">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 rounded-xl bg-[#001229] flex items-center justify-center text-[#C5A059] text-sm font-black">
                    {item.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-[#001229]">{item.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-[#001229] rounded-[4rem] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 bg-[#C5A059] text-[#001229] p-12 lg:p-16 flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl font-black leading-tight mb-8 font-serif">
                    Bizimle<br />İletişime Geçin
                  </h2>
                  <div className="space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#001229] rounded-2xl flex items-center justify-center text-[#C5A059] shadow-lg">
                        <Phone size={24} />
                      </div>
                      <div>
                        <div className="text-[#001229]/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Telefon</div>
                        <a href="tel:+905322026799" className="text-xl font-black hover:text-white transition-colors">0532 202 67 99</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#001229] rounded-2xl flex items-center justify-center text-[#C5A059] shadow-lg">
                        <Mail size={24} />
                      </div>
                      <div>
                        <div className="text-[#001229]/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">E-Posta</div>
                        <a href="mailto:info@avmahmutkaya.com.tr" className="text-xl font-black hover:text-white transition-colors">info@avmahmutkaya.com.tr</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-12 lg:p-20">
                <h3 className="text-3xl font-bold text-white mb-10">İletişim Formu</h3>
                
                {submitStatus === 'success' && (
                  <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                    <CheckCircle2 size={24} /> Mesajınız başarıyla iletildi.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      name="name" type="text" required placeholder="Ad Soyad"
                      value={formData.name} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                    <input
                      name="phone" type="tel" placeholder="Telefon"
                      value={formData.phone} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                  <input
                    name="email" type="email" required placeholder="E-Posta"
                    value={formData.email} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#C5A059] outline-none transition-all"
                  />
                  <textarea
                    name="message" rows={4} required placeholder="Mesajınız"
                    value={formData.message} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#C5A059] outline-none transition-all resize-none"
                  />
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full bg-[#C5A059] text-[#001229] py-5 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> GÖNDER</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}} />
    </div>
  );
};

export default HomeView;
