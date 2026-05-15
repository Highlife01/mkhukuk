import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, Home, Users, Shield, Scale, PieChart, Gavel,
  ShieldCheck, ChevronRight, FileText, ArrowRight, Phone,
  Building2, Cpu, Heart, Umbrella, Zap, Landmark, Pen,
  CheckCircle
} from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { servicePages as staticServicePages, ServicePage } from '@/data/servicePages';
import { useSeo } from '@/hooks/useSeo';
import { useWebsitePage } from '@/hooks/useWebsitePage';

const getIconForSlug = (slug: string) => {
  const normalized = slug.toLowerCase();
  if (normalized.includes('icra')) return <Scale size={22} />;
  if (normalized.includes('gayrimenkul')) return <Home size={22} />;
  if (normalized.includes('aile')) return <Users size={22} />;
  if (normalized.includes('ceza')) return <Shield size={22} />;
  if (normalized.includes('tuketici')) return <ShieldCheck size={22} />;
  if (normalized.includes('vergi')) return <PieChart size={22} />;
  if (normalized.includes('idare')) return <Landmark size={22} />;
  if (normalized.includes('is-hukuku')) return <Briefcase size={22} />;
  if (normalized.includes('bilisim')) return <Cpu size={22} />;
  if (normalized.includes('saglik')) return <Heart size={22} />;
  if (normalized.includes('sigorta')) return <Umbrella size={22} />;
  if (normalized.includes('enerji')) return <Zap size={22} />;
  if (normalized.includes('sozlesme')) return <Pen size={22} />;
  if (normalized.includes('sirket')) return <Building2 size={22} />;
  if (normalized.includes('fikri')) return <FileText size={22} />;
  return <Gavel size={22} />;
};

// Group services by category for the premium layout
const categoryMap: Record<string, string> = {
  'icra-ve-iflas-hukuku': 'Ticaret & Finans',
  'vergi-hukuku': 'Ticaret & Finans',
  'sirketler-hukuku': 'Ticaret & Finans',
  'sozlesme-hukuku': 'Ticaret & Finans',
  'gayrimenkul-hukuku': 'Gayrimenkul & İnşaat',
  'enerji-hukuku': 'Gayrimenkul & İnşaat',
  'aile-hukuku': 'Bireysel Hukuk',
  'ceza-hukuku': 'Bireysel Hukuk',
  'tuketici-hukuku': 'Bireysel Hukuk',
  'is-hukuku': 'Bireysel Hukuk',
  'bilisim-hukuku': 'Teknoloji & Fikri Mülkiyet',
  'fikri-mulkiyet-hukuku': 'Teknoloji & Fikri Mülkiyet',
  'idare-hukuku': 'Kamu & İdare',
  'saglik-hukuku': 'Kamu & İdare',
  'sigorta-hukuku': 'Kamu & İdare',
};

const Services = () => {
  const { t } = useTranslation();
  const { page } = useWebsitePage('services');
  const [services, setServices] = useState<ServicePage[]>(staticServicePages);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useSeo({
    title: page?.title || 'Faaliyet Alanları',
    description: page?.description || 'MK Hukuk\'un uzmanlık alanları ve hukuki hizmetleri. İcra, boşanma, gayrimenkul, ceza, ticaret hukuku ve daha fazlası için uzman destek.',
    url: 'https://mkhukuk.web.app/hizmetler',
  });

  useEffect(() => {
    const q = query(collection(db, 'servicePages'), orderBy('slug', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ServicePage[];
        setServices(docs.length ? docs : staticServicePages);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore error:', error);
        setServices(staticServicePages);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const itemsToRender = loading ? staticServicePages : services;

  // Get unique categories
  const categories = Array.from(new Set(itemsToRender.map(s => categoryMap[s.slug] || 'Diğer')));

  // Featured services (first 3)
  const featuredServices = itemsToRender.slice(0, 3);

  // Filter by category
  const filteredServices = activeCategory
    ? itemsToRender.filter(s => (categoryMap[s.slug] || 'Diğer') === activeCategory)
    : itemsToRender;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO SECTION ─── */}
      <section className="bg-[#0a0e1a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1528] to-[#0a0e1a]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.4) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
          <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-amber/5 rounded-full blur-[180px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full mb-8">
              <Scale size={14} className="text-amber" />
              <span className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.2em]">
                {t('services_page.badge')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
              {t('services_page.title1')}
              <span className="gradient-text">{t('services_page.title2')}</span>
            </h1>

            <p className="text-lg text-white/40 leading-relaxed max-w-2xl mb-10">
              {page?.description || t('services_page.desc')}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '15+', label: t('services_page.stat1') },
                { value: '500+', label: t('services_page.stat2') },
                { value: '20+', label: t('services_page.stat3') },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-amber">{stat.value}</div>
                  <div className="text-xs text-white/30 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── CATEGORY FILTER BAR ─── */}
      <section className="sticky top-[72px] z-30 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                !activeCategory
                  ? 'bg-nav text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {t('services_page.allAreas')} ({itemsToRender.length})
            </button>
            {categories.map(cat => {
              const count = itemsToRender.filter(s => (categoryMap[s.slug] || 'Diğer') === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-amber text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURED SERVICES (only when no filter) ─── */}
      {!activeCategory && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              {t('services_page.featuredAreas')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredServices.map((service, i) => (
                <Link
                  key={service.slug}
                  to={`/hizmetler/${service.slug}`}
                  className={`group relative rounded-2xl overflow-hidden border border-border/50 hover:border-amber/30 transition-all duration-500 hover:-translate-y-1 ${
                    i === 0 ? 'lg:row-span-2' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`bg-card p-8 lg:p-10 flex flex-col h-full ${i === 0 ? 'min-h-[380px]' : ''}`}>
                    <div className="w-12 h-12 rounded-xl bg-amber/8 flex items-center justify-center text-amber mb-6 group-hover:bg-amber group-hover:text-white transition-all duration-300">
                      {getIconForSlug(service.slug)}
                    </div>

                    <div className="text-[10px] font-semibold uppercase tracking-widest text-amber/60 mb-3">
                      {categoryMap[service.slug] || 'Hukuk'}
                    </div>

                    <h3 className={`font-bold text-foreground mb-3 group-hover:text-amber transition-colors ${
                      i === 0 ? 'text-2xl' : 'text-lg'
                    }`}>
                      {service.title}
                    </h3>

                    <p className={`text-muted-foreground leading-relaxed mb-6 flex-grow ${
                      i === 0 ? 'text-[15px]' : 'text-sm line-clamp-2'
                    }`}>
                      {i === 0 ? service.intro : service.description}
                    </p>

                    <div className="flex items-center gap-2 text-amber text-sm font-semibold group-hover:gap-3 transition-all mt-auto">
                      {t('home.details')} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ALL SERVICES GRID ─── */}
      <section className={`pb-24 ${activeCategory ? 'pt-12' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {!activeCategory && (
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              {t('services_page.allAreasSub')}
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(activeCategory ? filteredServices : itemsToRender.slice(3)).map((service, i) => (
              <Link
                key={service.slug}
                to={`/hizmetler/${service.slug}`}
                className="group bg-card rounded-2xl p-7 border border-border/50 hover:border-amber/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-amber/8 flex items-center justify-center text-amber group-hover:bg-amber group-hover:text-white transition-all duration-300">
                    {getIconForSlug(service.slug)}
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 bg-secondary px-3 py-1 rounded-full">
                    {categoryMap[service.slug] || 'Hukuk'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-2.5 group-hover:text-amber transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-grow line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center gap-1.5 text-amber text-sm font-semibold group-hover:gap-3 transition-all pt-4 border-t border-border/40">
                  {t('services_page.detailBtn')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-24 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
                {t('services_page.whyUsTitle')} <span className="gradient-text">{t('services_page.whyUsTitleSpan')}</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t('services_page.whyUsDesc')}
              </p>
              <div className="space-y-4">
                {[
                  t('services_page.whyUsPoint1'),
                  t('services_page.whyUsPoint2'),
                  t('services_page.whyUsPoint3'),
                  t('services_page.whyUsPoint4'),
                  t('services_page.whyUsPoint5'),
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-amber mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-10 border border-border/40 shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-6">{t('services_page.freeConsultTitle')}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {t('services_page.freeConsultDesc')}
              </p>
              <div className="space-y-4">
                <Link
                  to="/iletisim"
                  className="w-full bg-amber hover:bg-amber-dark text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone size={18} /> {t('services_page.ctaBtnConsult')}
                </Link>
                <Link
                  to="/ai-asistan"
                  className="w-full bg-nav hover:bg-nav/90 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {t('services_page.aiStartBtn')} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
