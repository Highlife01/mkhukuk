import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, Clock, Landmark } from 'lucide-react';
import { useState } from 'react';
import { useSeo } from '@/hooks/useSeo';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useSeo({
    title: 'S.S.S.',
    description: 'MK Hukuk sıkça sorulan sorular sayfası ile hukuki süreçlerinizde sıkça karşılaşılan soruların cevaplarını bulabilirsiniz.',
    url: 'https://mkhukuk.web.app/sss',
  });

  const faqs = [
    { q: t('faq.questions.q1.q'), a: t('faq.questions.q1.a') },
    { q: t('faq.questions.q2.q'), a: t('faq.questions.q2.a') },
    { q: t('faq.questions.q3.q'), a: t('faq.questions.q3.a') },
    { q: t('faq.questions.q4.q'), a: t('faq.questions.q4.a') },
    { q: t('faq.questions.q5.q'), a: t('faq.questions.q5.a') },
    { q: t('faq.questions.q6.q'), a: t('faq.questions.q6.a') },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-nav py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-amber/10 text-amber px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <HelpCircle size={14} /> {t('faq.badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-nav-foreground mb-6 font-display">{t('faq.title').split(' ').slice(0, 2).join(' ')} <span className="text-amber">{t('faq.title').split(' ').slice(2).join(' ')}</span></h1>
          <p className="text-nav-foreground/60 leading-relaxed font-body max-w-xl mx-auto">
            {t('faq.desc')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-card rounded-[2.5rem] border border-border/60 shadow-card overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i} className={`border-b border-border/40 last:border-0 transition-colors ${openIndex === i ? 'bg-secondary/20' : ''}`}>
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-8 flex items-center justify-between gap-4 group"
              >
                <span className={`text-lg font-bold font-display transition-colors ${openIndex === i ? 'text-amber' : 'text-foreground group-hover:text-amber'}`}>
                  {faq.q}
                </span>
                {openIndex === i ? <ChevronUp className="text-amber shrink-0" /> : <ChevronDown className="text-muted-foreground shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 text-muted-foreground leading-relaxed font-body animate-accordion-down">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber p-8 rounded-[2rem] text-amber-foreground shadow-amber flex flex-col items-center text-center">
            <div className="bg-white/20 p-4 rounded-2xl mb-4"><Phone size={24} /></div>
            <h3 className="text-xl font-black mb-2 font-display">{t('faq.cta1.title')}</h3>
            <p className="text-sm opacity-80 mb-6 font-body">{t('faq.cta1.desc')}</p>
            <a href="tel:+905322026799" className="text-xl font-black font-display">+90 532 202 67 99</a>
          </div>
          <div className="bg-nav p-8 rounded-[2rem] text-nav-foreground shadow-nav flex flex-col items-center text-center">
            <div className="bg-white/5 p-4 rounded-2xl mb-4"><MessageCircle size={24} /></div>
            <h3 className="text-xl font-black mb-2 font-display">{t('faq.cta2.title')}</h3>
            <p className="text-sm opacity-50 mb-6 font-body">{t('faq.cta2.desc')}</p>
            <button 
              onClick={() => window.open('https://wa.me/905322026799', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
            >
              {t('faq.cta2.btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
