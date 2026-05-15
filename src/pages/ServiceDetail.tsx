import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { servicePages as staticServicePages, ServicePage } from '@/data/servicePages';
import { ArrowLeft, ArrowRight, Phone, Mail, MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<ServicePage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'servicePages', slug);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setPage({ id: snapshot.id, ...(snapshot.data() as any) } as ServicePage);
        } else {
          const fallback = staticServicePages.find((p) => p.slug === slug) ?? null;
          setPage(fallback);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Service page fetch error:', error);
        const fallback = staticServicePages.find((p) => p.slug === slug) ?? null;
        setPage(fallback);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [slug]);

  useSeo({
    title: page?.title ? `${page.title} - Hizmetler` : 'Hizmet Detayı',
    description: page?.description,
    url: `https://mkhukuk.web.app/hizmetler/${slug}`,
  });

  // Get adjacent services for navigation
  const currentIndex = staticServicePages.findIndex(p => p.slug === slug);
  const prevService = currentIndex > 0 ? staticServicePages[currentIndex - 1] : null;
  const nextService = currentIndex < staticServicePages.length - 1 ? staticServicePages[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-amber" size={40} />
          <span className="text-sm text-muted-foreground">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] bg-background py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Sayfa bulunamadı</h1>
          <p className="text-muted-foreground mb-8">Bu hizmet sayfası mevcut değil.</p>
          <Link to="/hizmetler" className="inline-flex items-center gap-2 text-amber font-semibold hover:underline">
            <ArrowLeft size={18} /> Hizmetler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="bg-[#0a0e1a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1528] to-[#0a0e1a]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
            <Link to="/" className="hover:text-amber transition-colors">Ana Sayfa</Link>
            <ChevronRight size={14} />
            <Link to="/hizmetler" className="hover:text-amber transition-colors">Hizmetler</Link>
            <ChevronRight size={14} />
            <span className="text-amber/80">{page.title}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {page.title}
          </h1>
          <p className="text-lg text-white/40 leading-relaxed max-w-3xl">
            {page.description}
          </p>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Intro */}
            <div className="text-lg text-foreground/80 leading-relaxed border-l-4 border-amber/30 pl-6">
              {page.intro}
            </div>

            {/* Sections */}
            {page.sections.map((section, i) => (
              <div key={section.title} className="bg-card rounded-2xl border border-border/40 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-amber text-sm font-bold">
                    {i + 1}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                </div>
                <div className="prose prose-sm prose-amber max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* FAQ */}
            {page.faq && page.faq.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">Sıkça Sorulan Sorular</h3>
                <div className="space-y-4">
                  {page.faq.map((item) => (
                    <div key={item.question} className="bg-card rounded-2xl border border-border/40 p-6">
                      <h4 className="font-semibold text-foreground mb-2">{item.question}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border/40">
              {prevService ? (
                <Link to={`/hizmetler/${prevService.slug}`} className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-amber/30 transition-all">
                  <ArrowLeft size={16} className="text-muted-foreground group-hover:text-amber transition-colors shrink-0" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Önceki</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-amber transition-colors">{prevService.title}</div>
                  </div>
                </Link>
              ) : <div />}
              {nextService && (
                <Link to={`/hizmetler/${nextService.slug}`} className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-amber/30 transition-all text-right">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Sonraki</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-amber transition-colors">{nextService.title}</div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-amber transition-colors shrink-0" />
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-[100px] space-y-6">
              {/* Quick Contact */}
              <div className="bg-nav rounded-2xl p-8 text-white">
                <h4 className="text-lg font-bold mb-2">Hızlı İletişim</h4>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  Bu alanda ücretsiz ön değerlendirme için bize ulaşın.
                </p>
                <div className="space-y-3">
                  <a href="tel:+905322026799" className="flex items-center gap-3 bg-amber hover:bg-amber-dark text-white px-5 py-3.5 rounded-xl font-semibold text-sm transition-all">
                    <Phone size={16} /> 0532 202 67 99
                  </a>
                  <a href="mailto:info@mkhukuk.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white px-5 py-3.5 rounded-xl font-medium text-sm transition-all">
                    <Mail size={16} /> info@mkhukuk.com
                  </a>
                  <a href="https://wa.me/905322026799" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-green-600/80 hover:bg-green-600 text-white px-5 py-3.5 rounded-xl font-medium text-sm transition-all">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Other Services */}
              <div className="bg-card rounded-2xl border border-border/40 p-6">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Diğer Hizmetler
                </h4>
                <div className="space-y-1">
                  {staticServicePages
                    .filter(s => s.slug !== slug)
                    .slice(0, 6)
                    .map(s => (
                      <Link
                        key={s.slug}
                        to={`/hizmetler/${s.slug}`}
                        className="flex items-center justify-between py-2.5 text-sm text-foreground/70 hover:text-amber transition-colors group"
                      >
                        {s.title}
                        <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-amber transition-colors" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
