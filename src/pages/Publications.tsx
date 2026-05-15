import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, ArrowRight, BookOpen, Newspaper, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { blogPosts as staticBlogPosts } from '@/data/blogPosts';
import { useSeo } from '@/hooks/useSeo';

const Publications = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSeo({
    title: 'Yayınlar & Blog',
    description: 'MK Hukuk dönemsel bültenler, makaleler ve gündem yazılarıyla hukuki gelişmeleri takip edin. Emsal içtihatlar ve pratik rehberler burada.',
    url: 'https://mkhukuk.web.app/blog',
  });

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (postsData.length === 0) {
          setArticles(staticBlogPosts);
        } else {
          setArticles(postsData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setArticles(staticBlogPosts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const categories = [
    { icon: <BookOpen size={20} />, name: "Hukukta Gündem", count: 12 },
    { icon: <FileText size={20} />, name: "Makaleler", count: articles.length },
    { icon: <Newspaper size={20} />, name: "Bültenler", count: 8 },
    { icon: <Video size={20} />, name: "Videolar", count: 5 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber/10 text-amber px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <FileText size={14} /> Bilgi Merkezi
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground font-display">Yayınlar & <span className="text-amber">Gündem</span></h1>
          <p className="text-muted-foreground mt-4 font-body leading-relaxed">
            Hukuk dünyasındaki güncel gelişmeleri, akademik makaleleri ve sektörel bültenlerimizi buradan takip edebilirsiniz.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <button key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 hover:border-amber/40 hover:bg-amber/5 transition-all text-sm font-bold font-body">
              <span className="text-amber">{cat.icon}</span>
              {cat.name}
              <span className="text-[10px] opacity-30 px-1.5 py-0.5 bg-foreground/5 rounded-md">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {articles.map((art, i) => (
          <Link key={i} to={`/yayinlar/${art.slug}`} className="bg-card rounded-[2rem] border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-300 group overflow-hidden flex flex-col">
            <div className="h-56 overflow-hidden relative">
              <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 left-4 bg-amber text-amber-foreground px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                {art.category}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-muted-foreground/60 text-xs mb-4 font-body">
                <Calendar size={14} /> {art.date}
              </div>
              <h3 className="text-xl font-black mb-4 text-foreground font-display leading-tight group-hover:text-amber transition-colors">
                {art.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-body flex-grow">
                {art.desc}
              </p>
              <div className="flex items-center gap-2 text-amber font-bold text-sm uppercase tracking-widest group-hover:gap-3 transition-all font-body">
                Devamını Oku <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-nav rounded-[2.5rem] p-10 md:p-16 text-center shadow-nav">
        <h2 className="text-3xl font-black text-nav-foreground mb-6 font-display">Bültenimize Abone Olun</h2>
        <p className="text-nav-foreground/50 mb-10 font-body max-w-xl mx-auto leading-relaxed">
          Önemli yasal değişiklikleri ve bültenlerimizi anında e-posta kutunuzda görün.
        </p>
        <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <input type="email" placeholder="E-posta adresiniz" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-nav-foreground outline-none focus:ring-2 focus:ring-amber/50 transition font-body" />
          <button className="bg-amber text-amber-foreground px-8 py-4 rounded-xl font-bold hover:bg-amber-light transition-all shadow-amber uppercase tracking-widest text-sm">
            Kaydol
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publications;
