import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Clock, ArrowLeft, Share2, Loader2, ExternalLink, Globe, MessageCircle } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { blogPosts as staticBlogPosts } from '@/data/blogPosts';
import ReactMarkdown from 'react-markdown';

const PublicationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        // First check Firestore
        const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setPost(querySnapshot.docs[0].data());
        } else {
          // If not in Firestore, check static data
          const staticPost = staticBlogPosts.find(p => p.slug === slug);
          if (staticPost) {
            setPost(staticPost);
          }
        }

        // Fetch some related posts (simple version)
        try {
          const relatedQ = query(collection(db, 'blogPosts'), limit(3));
          const relatedSnapshot = await getDocs(relatedQ);
          if (!relatedSnapshot.empty) {
            setRelatedPosts(relatedSnapshot.docs.map(d => d.data()).filter(p => p.slug !== slug));
          } else {
            setRelatedPosts(staticBlogPosts.filter(p => p.slug !== slug).slice(0, 3));
          }
        } catch (e) {
          console.error("Error fetching related posts:", e);
          setRelatedPosts(staticBlogPosts.filter(p => p.slug !== slug).slice(0, 3));
        }

      } catch (error) {
        console.error("Error fetching post:", error);
        // Final fallback to static data if main fetch failed
        const staticPost = staticBlogPosts.find(p => p.slug === slug);
        if (staticPost) {
          setPost(staticPost);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-amber" size={48} />
        <p className="text-muted-foreground font-bold">İçerik yükleniyor...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black mb-4">Yazı Bulunamadı</h1>
        <Link to="/yayinlar" className="text-amber font-bold flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Yayınlara Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-12">
          <div className="inline-flex items-center gap-2 bg-amber text-amber-foreground px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground font-display leading-[1.1] mb-8">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60 font-body">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber text-xs font-bold">
                MK
              </div>
              <span className="font-bold text-foreground/80">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-amber" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber" />
              {post.readTime} okuma süresi
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <Link to="/yayinlar" className="inline-flex items-center gap-2 text-amber font-bold text-sm uppercase tracking-widest mb-10 hover:gap-3 transition-all">
            <ArrowLeft size={18} /> Yayınlara Geri Dön
          </Link>
          
          <article className="prose prose-lg prose-amber max-w-none 
            prose-headings:font-display prose-headings:font-black prose-headings:text-foreground
            prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-bold
            prose-a:text-amber prose-a:no-underline hover:prose-a:underline
            prose-li:font-body prose-li:text-muted-foreground">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>

          <div className="mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Paylaş:</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-xl bg-secondary hover:bg-amber hover:text-amber-foreground transition-all flex items-center justify-center shadow-sm">
                  <Globe size={18} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-secondary hover:bg-amber hover:text-amber-foreground transition-all flex items-center justify-center shadow-sm">
                  <MessageCircle size={18} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-secondary hover:bg-amber hover:text-amber-foreground transition-all flex items-center justify-center shadow-sm">
                  <ExternalLink size={18} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-secondary hover:bg-amber hover:text-amber-foreground transition-all flex items-center justify-center shadow-sm">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              {relatedPosts.slice(0, 2).map(related => (
                <Link key={related.slug} to={`/yayinlar/${related.slug}`} className="text-xs font-bold text-amber hover:text-amber-light underline decoration-amber/30 underline-offset-4">
                  Sıradaki Yazı: {related.title.substring(0, 30)}...
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-nav p-8 rounded-[2rem] text-nav-foreground shadow-nav sticky top-24">
            <h4 className="text-xl font-black mb-4 font-display italic decoration-amber underline-offset-8 underline">Hukuki Destek</h4>
            <p className="text-sm text-nav-foreground/50 mb-8 font-body leading-relaxed">
              Bu konuyla ilgili daha detaylı bilgi almak veya hukuki süreçlerinizi başlatmak için uzman ekibimizle iletişime geçebilirsiniz.
            </p>
            <Link to="/iletisim" className="block w-full bg-amber text-amber-foreground py-4 rounded-xl font-bold text-center hover:bg-amber-light transition-all shadow-amber uppercase tracking-widest text-xs">
              Danışmanlık Al
            </Link>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground/40 italic">Son Eklenenler</h4>
            <div className="space-y-6">
              {relatedPosts.slice(0, 3).map(recent => (
                <Link key={recent.slug} to={`/yayinlar/${recent.slug}`} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <img src={recent.image} alt={recent.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-amber font-black uppercase tracking-widest mb-1">{recent.category}</span>
                    <h5 className="text-sm font-bold text-foreground leading-tight group-hover:text-amber transition-colors font-display line-clamp-2">{recent.title}</h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;
