import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Target, Users, Shield, Award, Landmark, Globe, Scale, CheckCircle, Phone, ArrowRight } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useWebsitePage } from '@/hooks/useWebsitePage';

const About = () => {
  const { t } = useTranslation();
  const { page } = useWebsitePage('about');

  useSeo({
    title: page?.title || 'Hakkımızda',
    description:
      page?.description ||
      'MK Hukuk ekibi ve değerlerimiz. 2010\'dan beri şeffaf, çözüm odaklı ve teknoloji ile güçlendirilmiş hukuki danışmanlık sunuyoruz.',
    url: 'https://mkhukuk.web.app/hakkimizda',
  });

  const values = [
    { icon: <Shield size={22} />, title: t('about.values.v1.title'), desc: t('about.values.v1.desc') },
    { icon: <Award size={22} />, title: t('about.values.v2.title'), desc: t('about.values.v2.desc') },
    { icon: <Users size={22} />, title: t('about.values.v3.title'), desc: t('about.values.v3.desc') },
    { icon: <Target size={22} />, title: t('about.values.v4.title'), desc: t('about.values.v4.desc') },
  ];

  const milestones = [
    { year: '2010', event: t('about.journey.m1') },
    { year: '2015', event: t('about.journey.m2') },
    { year: '2018', event: t('about.journey.m3') },
    { year: '2022', event: t('about.journey.m4') },
    { year: '2024', event: t('about.journey.m5') },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="bg-[#0a0e1a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1528] to-[#0a0e1a]" />
          <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-amber/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full mb-8">
                <Landmark size={14} className="text-amber" />
                <span className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  {t('about.badge')}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                {t('about.title1')} <br />
                <span className="gradient-text">{t('about.title2')}</span>
              </h1>

              <p className="text-lg text-white/40 leading-relaxed max-w-xl mb-10">
                {page?.description || t('about.desc')}
              </p>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: t('about.stats.exp'), label: t('about.stats.expLabel') },
                  { value: t('about.stats.lawyers'), label: t('about.stats.lawyersLabel') },
                  { value: '500+', label: t('about.stats.successfulCases') },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-amber">{stat.value}</div>
                    <div className="text-[10px] text-white/30 font-medium uppercase tracking-widest mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="bg-amber/10 absolute inset-0 blur-[80px] -z-10 rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
                alt="MK Hukuk Bürosu"
                className="rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 text-amber font-semibold uppercase tracking-widest text-xs bg-amber/8 px-4 py-2 rounded-full mb-6">
              <Scale size={14} /> {t('about.valuesTitle')}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
              {t('about.valuesTitle')}
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber to-amber-dark rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-lg hover:border-amber/20 transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-amber/8 flex items-center justify-center text-amber mb-6 group-hover:bg-amber group-hover:text-white transition-all duration-300">
                  {val.icon}
                </div>
                <h3 className="text-base font-bold mb-3 text-foreground">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-24 bg-[#f7f5f0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('about.journey.title')}</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber to-amber-dark rounded-full mx-auto" />
          </div>

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 items-start group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber/10 border-2 border-amber/30 flex items-center justify-center text-amber text-xs font-bold group-hover:bg-amber group-hover:text-white group-hover:border-amber transition-all">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-amber/15" />
                  )}
                </div>
                <div className="pt-2 pb-8">
                  <div className="text-sm font-bold text-amber mb-1">{m.year}</div>
                  <div className="text-foreground font-medium">{m.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border/40 shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                <Globe size={28} className="text-amber mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-6">{t('about.missionTitle')}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {page?.content || t('about.missionDesc')}
                </p>
                <div className="space-y-3">
                  {[
                    t('about.mission.item1'),
                    t('about.mission.item2'),
                    t('about.mission.item3'),
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-foreground font-medium">
                      <CheckCircle size={16} className="text-amber shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-nav p-10 lg:p-16 flex flex-col justify-center text-center">
                <h3 className="text-2xl font-bold text-white mb-4">{t('about.workWithUs.title')}</h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  {t('about.workWithUs.desc')}
                </p>
                <div className="space-y-3">
                  <Link to="/iletisim" className="w-full bg-amber hover:bg-amber-dark text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Phone size={18} /> {t('about.workWithUs.contactBtn')}
                  </Link>
                  <Link to="/hizmetler" className="w-full bg-white/10 hover:bg-white/15 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    {t('about.workWithUs.servicesBtn')} <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
