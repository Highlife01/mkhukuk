import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSeo } from '@/hooks/useSeo';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useWebsitePage } from '@/hooks/useWebsitePage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Contact = () => {
  const { t } = useTranslation();
  const { page } = useWebsitePage('contact');

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useSeo({
    title: page?.title || 'İletişim',
    description:
      page?.description ||
      'MK Hukuk ile iletişime geçin. Ofisimiz, telefon ve WhatsApp üzerinden hızlı destek sağlayan ekibimizle yanınızdayız.',
    url: 'https://mkhukuk.web.app/iletisim',
  });

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

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="bg-[#0a0e1a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1528] to-[#0a0e1a]" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full mb-8">
            <MapPin size={14} className="text-amber" />
            <span className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.2em]">
              {t('nav.contact') || 'İletişim'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {t('contact.heroTitle1')} <span className="gradient-text">{t('contact.heroTitle2')}</span>
          </h1>
          <p className="text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
            {page?.description || t('contact.desc')}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="py-20 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center text-amber group-hover:bg-amber group-hover:text-white transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{t('contact.phoneLabel')}</h3>
                    <a href="tel:+905322026799" className="text-muted-foreground hover:text-amber transition-colors">+90 532 202 67 99</a>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed">{t('contact.phoneDesc')}</p>
              </div>

              <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0f1e3d]/10 flex items-center justify-center text-[#0f1e3d] group-hover:bg-[#0f1e3d] group-hover:text-white transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{t('contact.emailLabel')}</h3>
                    <a href="mailto:info@mkhukuk.com" className="text-muted-foreground hover:text-[#0f1e3d] transition-colors">info@mkhukuk.com</a>
                  </div>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed">{t('contact.emailDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-8 rounded-3xl border border-green-500/20 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-950 text-lg">{t('contact.whatsappLabel')}</h3>
                    <p className="text-green-800/80 font-medium">+90 532 202 67 99</p>
                  </div>
                </div>
                <p className="text-sm text-green-950/70 leading-relaxed mb-6">{t('contact.whatsappDesc')}</p>
                <a
                  href="https://wa.me/905322026799"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-green-500/20"
                >
                  <MessageSquare size={18} /> {t('contact.whatsappBtn')}
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-xl border border-border/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full blur-3xl -mr-10 -mt-10" />
                
                <h2 className="text-3xl font-bold text-foreground mb-2">{t('home.contact.formTitle')}</h2>
                <p className="text-muted-foreground mb-8">{t('home.contact.formDesc')}</p>

                {submitStatus === 'success' && (
                  <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-emerald-800 font-bold">{t('home.contact.successTitle')}</h4>
                      <p className="text-emerald-600/90 text-sm mt-1">{t('home.contact.successDesc')}</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-red-800 font-bold">{t('home.contact.errorTitle')}</h4>
                      <p className="text-red-600/90 text-sm mt-1">{t('home.contact.errorDesc')}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground/80 pl-1">{t('home.contact.namePlaceholder').replace(' *', '')} <span className="text-red-500">*</span></label>
                      <input
                        id="name" name="name" type="text" required
                        value={formData.name} onChange={handleChange}
                        placeholder={t('home.contact.namePlaceholder')}
                        className="w-full bg-[#f8f9fa] border-transparent rounded-xl px-5 py-3.5 text-sm focus:bg-white focus:border-amber focus:ring-4 focus:ring-amber/10 outline-none transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-semibold text-foreground/80 pl-1">{t('home.contact.phoneLabel')}</label>
                      <input
                        id="phone" name="phone" type="tel"
                        value={formData.phone} onChange={handleChange}
                        placeholder={t('home.contact.phonePlaceholder')}
                        className="w-full bg-[#f8f9fa] border-transparent rounded-xl px-5 py-3.5 text-sm focus:bg-white focus:border-amber focus:ring-4 focus:ring-amber/10 outline-none transition-all placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-semibold text-foreground/80 pl-1">{t('home.contact.emailLabel')} <span className="text-red-500">*</span></label>
                    <input
                      id="email" name="email" type="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder={t('home.contact.emailPlaceholder')}
                      className="w-full bg-[#f8f9fa] border-transparent rounded-xl px-5 py-3.5 text-sm focus:bg-white focus:border-amber focus:ring-4 focus:ring-amber/10 outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-sm font-semibold text-foreground/80 pl-1">{t('home.contact.subjectPlaceholder')}</label>
                    <input
                      id="subject" name="subject" type="text"
                      value={formData.subject} onChange={handleChange}
                      placeholder={t('home.contact.subjectPlaceholder')}
                      className="w-full bg-[#f8f9fa] border-transparent rounded-xl px-5 py-3.5 text-sm focus:bg-white focus:border-amber focus:ring-4 focus:ring-amber/10 outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-semibold text-foreground/80 pl-1">{t('home.contact.messagePlaceholder').replace(' *', '')} <span className="text-red-500">*</span></label>
                    <textarea
                      id="message" name="message" rows={5} required
                      value={formData.message} onChange={handleChange}
                      placeholder={t('home.contact.messagePlaceholder')}
                      className="w-full bg-[#f8f9fa] border-transparent rounded-xl px-5 py-3.5 text-sm focus:bg-white focus:border-amber focus:ring-4 focus:ring-amber/10 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber to-amber-dark text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-amber/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <> <Loader2 size={18} className="animate-spin" /> {t('home.contact.submittingBtn')} </>
                    ) : (
                      <> <Send size={18} /> {t('home.contact.submitBtn')} </>
                    )}
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    {t('home.contact.kvkkNote')}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
