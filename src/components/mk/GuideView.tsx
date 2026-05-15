import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, BookOpen, ChevronRight, MapPin, Clock, Eye, ArrowLeft,
  AlertTriangle, CheckCircle, FileText, Home, Car, LandPlot, Building2, TrendingUp
} from 'lucide-react';

// ---------- DATA ----------

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: string;
  date: string;
  icon: React.ReactNode;
  content: ArticleContent;
}

interface ArticleContent {
  intro: string;
  sections: { heading: string; body: string }[];
  tips: string[];
  faq: { q: string; a: string }[];
}

const articles: Article[] = [
  {
    id: 'icradan-ev-nasil-alinir',
    title: 'İcradan Ev Nasıl Alınır? 2024 Kapsamlı Rehber',
    excerpt: 'İcra yoluyla satışa çıkan gayrimenkulleri satın alma sürecinin A\'dan Z\'ye anlatımı. Kıymet takdiri, ihale süreci, KDV ve tapu devri detayları.',
    category: 'Gayrimenkul',
    readTime: '12 dk',
    views: '45.2K',
    date: '2024-03-10',
    icon: <Home size={20} />,
    content: {
      intro: 'İcra dairesi aracılığıyla satışa çıkarılan gayrimenkuller, piyasa değerinin altında fiyatlarla alınabilmektedir. Ancak bu süreçte dikkat edilmesi gereken birçok hukuki ve teknik detay bulunmaktadır. Bu rehberde icra satışından ev almanın tüm aşamalarını detaylıca ele alıyoruz.',
      sections: [
        {
          heading: 'İcra Satışı Nedir?',
          body: 'İcra satışı, borçlunun borcunu ödememesi durumunda alacaklının talebiyle icra müdürlüğü tarafından borçlunun mallarının satılması işlemidir. İcra ve İflas Kanunu\'nun 106-137. maddeleri arasında düzenlenmiştir. Gayrimenkul satışları açık artırma usulüyle yapılır ve UYAP üzerinden ilan edilir.'
        },
        {
          heading: 'Kıymet Takdiri ve Muhammen Bedel',
          body: 'İcra müdürlüğü tarafından atanan bilirkişi, gayrimenkulün güncel piyasa değerini belirler. Bu değere "muhammen bedel" denir. Birinci artırmada satış, muhammen bedelin %50\'sinden ve satış masraflarını karşılayacak miktardan aşağı olamaz. İkinci artırmada ise %50 sınırı geçerlidir. Kıymet takdirine 7 gün içinde itiraz edilebilir.'
        },
        {
          heading: 'İhale Sürecine Katılma Şartları',
          body: 'İhaleye katılmak için muhammen bedelin %10\'u oranında teminat yatırılması gerekir. Teminat nakit, banka teminat mektubu veya devlet tahvili olarak kabul edilir. İhale UYAP e-satış portalı üzerinden elektronik ortamda yapılır. Teklif verme süresi en az 7 gündür.'
        },
        {
          heading: 'KDV ve Vergi Yükümlülükleri',
          body: 'İcra satışlarında konut için %1, işyeri için %20 KDV uygulanır (2024 güncel oranları). Ayrıca %1,14 oranında tapu harcı ve damga vergisi ödenmesi gerekmektedir. Satış bedeli üzerinden ayrıca tellaliye harcı hesaplanır.'
        },
        {
          heading: 'Tapu Devri ve Teslim Süreci',
          body: 'İhale kesinleştikten ve bedel ödendikten sonra icra müdürlüğü tarafından alıcı adına tescil yazısı yazılır. Tapu müdürlüğü bu yazıya istinaden devir işlemini gerçekleştirir. Gayrimenkul borçlu tarafından tahliye edilmezse icra dairesi aracılığıyla tahliye işlemi yapılır.'
        }
      ],
      tips: [
        'Kıymet takdiri raporunu mutlaka inceleyin ve gerekirse itiraz edin',
        'Tapu kaydındaki şerhleri, ipotekleri ve hacizleri kontrol edin',
        'Gayrimenkulü fiziksel olarak yerinde görün ve çevre araştırması yapın',
        'İmar durumunu belediyeden sorgulayın',
        'KDV oranını ve toplam maliyeti önceden hesaplayın',
        'İhale sonrası ödeme süresini (10 gün) kaçırmayın'
      ],
      faq: [
        { q: 'İcra satışında taksit yapılır mı?', a: 'Hayır, ihale bedeli peşin ödenir. Ancak bazı bankalar icra satışları için kredi kullandırabilmektedir.' },
        { q: 'İhaleye vekil ile katılabilir miyim?', a: 'Evet, noter onaylı vekaletname ile vekil aracılığıyla ihaleye katılabilirsiniz.' },
        { q: 'İhaleden sonra vazgeçebilir miyim?', a: 'İhaleden vazgeçilmesi durumunda teminat iade edilmez ve iki ihale arasındaki fark alıcıdan tahsil edilir.' },
      ]
    }
  },
  {
    id: 'icra-satisinda-riskler',
    title: 'İcra Satışında Riskler ve Dikkat Edilmesi Gerekenler',
    excerpt: 'İcra ihalelerinde karşılaşılabilecek hukuki ve finansal riskler, ihalenin feshi sebepleri ve alıcıyı koruyacak önlemler.',
    category: 'Risk Analizi',
    readTime: '10 dk',
    views: '38.7K',
    date: '2024-02-28',
    icon: <AlertTriangle size={20} />,
    content: {
      intro: 'İcra satışları cazip fiyatlar sunsa da beraberinde önemli riskler taşır. Tapu üzerindeki şerhler, ihalenin feshi davaları, kiracı hakları ve yapısal sorunlar gibi pek çok risk faktörü bulunmaktadır. Bu makalede tüm riskleri ve korunma yollarını detaylı şekilde ele alıyoruz.',
      sections: [
        {
          heading: 'Tapu Üzerindeki Yükler',
          body: 'Gayrimenkul üzerinde ipotek, haciz, intifa hakkı, şufa hakkı veya irtifak hakkı gibi yükler bulunabilir. Bazı haklar satışla düşerken, bazıları alıcıya geçer. Özellikle "satış vaadi şerhi" ve "kira şerhi" gibi haklar alıcıyı doğrudan etkiler.'
        },
        {
          heading: 'İhalenin Feshi Riski',
          body: 'İhale sonrası 7 gün içinde ilgililer ihalenin feshini talep edebilir. Satış ilanının usulsüz yapılması, kıymet takdirinin hatalı olması veya ihale sürecindeki usulsüzlükler fesih nedeni olabilir. Fesih davası sonuçlanana kadar tapu devri yapılamaz.'
        },
        {
          heading: 'Tahliye Sorunları',
          body: 'Gayrimenkulde borçlu veya kiracı oturuyorsa tahliye süreci uzayabilir. Kiracının kira sözleşmesi satıştan önce tapuya şerh edilmişse, yeni malik kira sözleşmesiyle bağlıdır. Tahliye işlemi icra müdürlüğü aracılığıyla yapılır ancak süreç 1-3 ay sürebilir.'
        },
        {
          heading: 'Yapısal ve İmar Riskleri',
          body: 'Binada kaçak kat, ruhsatsız tadilat veya imar planına aykırı yapılaşma olabilir. Bu durumlar belediye tarafından yıkım kararı alınmasına veya cezai işlem uygulanmasına neden olabilir. Satış öncesi belediyeden imar durumu ve yapı ruhsatı sorgulanmalıdır.'
        }
      ],
      tips: [
        'Tapu kaydını mutlaka güncel olarak alın ve tüm şerhleri kontrol edin',
        'Kıymet takdiri tarihinin 2 yılı geçmediğinden emin olun',
        'Gayrimenkulü bizzat yerinde inceleyin',
        'Belediyeden imar durumu belgesi alın',
        'Uzman bir avukattan hukuki görüş alın',
      ],
      faq: [
        { q: 'İhalenin feshi davası ne kadar sürer?', a: 'Genellikle 3-6 ay arasında sonuçlanır, ancak istinaf aşamasıyla birlikte 1 yılı bulabilir.' },
        { q: 'Üzerinde ipotek olan evi icra satışından alırsam ipotek bana geçer mi?', a: 'İcra satışı tüm haciz ve ipotekleri siler. Ancak satış bedelinden öncelikle ipotek alacaklısının alacağı karşılanır.' },
      ]
    }
  },
  {
    id: 'icradan-arac-alma-rehberi',
    title: 'İcradan Araç Nasıl Alınır? Detaylı Rehber',
    excerpt: 'İcra müdürlükleri ve UYAP üzerinden araç satın alma süreci, araç değer tespiti, trafik kayıt kontrolleri ve devir işlemleri.',
    category: 'Araç',
    readTime: '9 dk',
    views: '52.1K',
    date: '2024-03-05',
    icon: <Car size={20} />,
    content: {
      intro: 'İcra satışıyla araç almak, piyasa fiyatının altında araç sahibi olmanın en yaygın yollarından biridir. Ancak süreçte araç üzerindeki hacizler, muayene durumu ve trafik cezaları gibi konuların dikkatle incelenmesi gerekir.',
      sections: [
        {
          heading: 'İcra Araç Satışı Süreci',
          body: 'İcra müdürlüğü tarafından haczedilen araçlar, kıymet takdiri yapıldıktan sonra UYAP e-satış portalında ilan edilir. İhale süreci gayrimenkul satışına benzer şekilde elektronik ortamda gerçekleştirilir. Teminat oranı muhammen bedelin %10\'udur.'
        },
        {
          heading: 'Araç Üzerindeki Kayıtlar',
          body: 'Aracın trafik tescil kaydında haciz, rehin, yakalama (aranma) kaydı ve muayene bilgileri bulunur. İcra satışıyla alınan araçlardaki tüm hacizler kalkar. Ancak trafik cezaları ve motorlu taşıtlar vergisi borçları konusunda dikkatli olunmalıdır.'
        },
        {
          heading: 'Ekspertiz ve Değer Tespiti',
          body: 'İcra müdürlüğü bilirkişisi aracın değerini belirler, ancak bu değerleme her zaman güncel piyasa koşullarını yansıtmayabilir. Mümkünse aracı fiziksel olarak görüp bağımsız ekspertiz yaptırmanız önerilir. Otopark ücretlerini de hesaba katın.'
        }
      ],
      tips: [
        'EGM sorgulaması ile aracın çalıntı veya yakalama kaydı olup olmadığını kontrol edin',
        'Araç muayene tarihini ve geçmiş muayene sonuçlarını inceleyin',
        'Trafik cezası ve MTV borcu sorgulayın',
        'Mümkünse aracı yerinde görün ve test edin',
        'Hasarlı araçlarda tramer kaydını kontrol edin',
      ],
      faq: [
        { q: 'İcradan aldığım araca kredi çekilir mi?', a: 'Bazı bankalar icra satışından alınan araçlar için taşıt kredisi kullandırabilmektedir, ancak bu bankadan bankaya değişir.' },
        { q: 'Araç teslim edilmezse ne yapılır?', a: 'İcra müdürlüğüne başvurarak zorla teslim (yediemine teslim edilen araçlar için) talep edebilirsiniz.' },
      ]
    }
  },
  {
    id: 'hacizli-mal-nasil-satin-alinir',
    title: 'Hacizli Mal Nasıl Satın Alınır?',
    excerpt: 'Hacizli taşınır ve taşınmaz malların satın alınması, hukuki süreç ve dikkat edilmesi gereken önemli noktalar.',
    category: 'Genel',
    readTime: '8 dk',
    views: '31.4K',
    date: '2024-01-20',
    icon: <FileText size={20} />,
    content: {
      intro: 'Hacizli mal satın almak, uygun fiyatlarla mülk edinmenin bir yoludur ancak hukuki süreç karmaşık olabilir. Bu rehberde hacizli taşınır ve taşınmaz malların nasıl satın alınacağını adım adım açıklıyoruz.',
      sections: [
        {
          heading: 'Hacizli Mal Türleri',
          body: 'Hacizli mallar taşınır (araç, makine, elektronik eşya vb.) ve taşınmaz (ev, arsa, işyeri) olarak ikiye ayrılır. Her iki tür için de satış süreci İcra ve İflas Kanunu\'na göre yürütülür ancak prosedürler farklılık gösterir.'
        },
        {
          heading: 'Satış İlanlarını Takip Etme',
          body: 'UYAP e-satış portalı (esatis.uyap.gov.tr) üzerinden tüm icra satış ilanları takip edilebilir. Ayrıca Türkiye genelinde gazetelerde ve icra müdürlüğü ilan panolarında da duyurular yapılır.'
        }
      ],
      tips: [
        'UYAP e-satış portalını düzenli olarak takip edin',
        'İlgilendiğiniz dosyanın icra müdürlüğünden detaylarını öğrenin',
        'Uzman avukat desteği alın',
      ],
      faq: [
        { q: 'Hacizli mal almak güvenli mi?', a: 'İcra müdürlüğü denetiminde yapılan satışlar hukuki güvence altındadır. Ancak her satışın kendine özgü riskleri olabilir, bu nedenle avukat desteği önerilir.' },
      ]
    }
  },
  {
    id: 'banka-ipotekli-ev-satin-alma',
    title: 'Banka İpotekli Ev Satın Alma Rehberi',
    excerpt: 'Bankaya ipotekli gayrimenkul satın alırken yapılması gerekenler, ipotek kaldırma süreci ve rızaen satış avantajları.',
    category: 'Gayrimenkul',
    readTime: '11 dk',
    views: '28.9K',
    date: '2024-02-15',
    icon: <Building2 size={20} />,
    content: {
      intro: 'Banka ipotekli gayrimenkul satın almak, doğru adımlar atıldığında güvenli ve avantajlı bir işlemdir. Rızaen satış yöntemiyle banka ile anlaşma sağlanarak ipotek kaldırılabilir ve alıcı temiz tapu ile mülkü devralabilir.',
      sections: [
        {
          heading: 'İpotek Nedir ve Nasıl Kaldırılır?',
          body: 'İpotek, borcun teminatı olarak gayrimenkul üzerine konulan bir takyidattır. Borcun ödenmesiyle veya banka ile yapılan anlaşmayla kaldırılabilir. Rızaen satışta banka, satış bedelinden alacağını tahsil ederek ipotek fek yazısı verir.'
        },
        {
          heading: 'Rızaen Satış Avantajları',
          body: 'Rızaen satışta hem satıcı hem alıcı hem de banka için avantajlar vardır. Satıcı icra masraflarından kurtulur, alıcı piyasa değerine yakın ama uygun fiyata alır, banka ise alacağını hızla tahsil eder. MK Hukuk olarak rızaen satış süreçlerinde uzman aracılık hizmeti sunuyoruz.'
        }
      ],
      tips: [
        'Bankadan güncel borç bakiyesini öğrenin',
        'İpotek derecesini ve diğer takyidatları kontrol edin',
        'Rızaen satış için banka ile önceden görüşün',
        'Tapu devri ve ipotek fekkinin eşzamanlı yapılmasını sağlayın',
      ],
      faq: [
        { q: 'İpotekli ev alınabilir mi?', a: 'Evet, banka onayı ve uygun prosedürlerle ipotekli gayrimenkul satın alınabilir. En güvenli yöntem rızaen satıştır.' },
        { q: 'İpotek bedeli ev değerinden yüksekse ne olur?', a: 'Bu durumda "batık ipotek" söz konusudur. Banka ile borç yapılandırma görüşmesi yapılarak çözüm aranabilir.' },
      ]
    }
  },
];

const cityPages = [
  { city: 'İstanbul', slug: 'istanbul', count: '2,340', icon: '🏙️' },
  { city: 'Ankara', slug: 'ankara', count: '1,120', icon: '🏛️' },
  { city: 'İzmir', slug: 'izmir', count: '890', icon: '🌊' },
  { city: 'Adana', slug: 'adana', count: '560', icon: '🌿' },
  { city: 'Bursa', slug: 'bursa', count: '480', icon: '🏔️' },
  { city: 'Antalya', slug: 'antalya', count: '420', icon: '☀️' },
  { city: 'Konya', slug: 'konya', count: '310', icon: '🕌' },
  { city: 'Gaziantep', slug: 'gaziantep', count: '280', icon: '🏭' },
  { city: 'Mersin', slug: 'mersin', count: '250', icon: '⚓' },
  { city: 'Kayseri', slug: 'kayseri', count: '190', icon: '⛰️' },
  { city: 'Eskişehir', slug: 'eskisehir', count: '170', icon: '🎓' },
  { city: 'Trabzon', slug: 'trabzon', count: '140', icon: '🍵' },
];

// ---------- COMPONENTS ----------

const GuideView: React.FC = () => {
  const { t } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', 'Gayrimenkul', 'Araç', 'Risk Analizi', 'Genel'];

  const filteredArticles = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const article = articles.find((a) => a.id === selectedArticle);

  if (article) {
    return <ArticleDetail article={article} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-amber font-bold uppercase tracking-widest text-xs mb-4">
          <BookOpen size={16} /> {t('guide.badge')}
        </div>
        <h2 className="text-4xl font-black text-foreground mb-4">{t('guide.title')}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('guide.title')}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-card rounded-2xl border p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder={t('guide.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-amber text-amber-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {filteredArticles.length > 0 && selectedCategory === 'Tümü' && !searchQuery && (
        <div
          className="bg-nav text-nav-foreground rounded-3xl p-8 md:p-12 mb-10 cursor-pointer hover:opacity-95 transition"
          onClick={() => setSelectedArticle(filteredArticles[0].id)}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <span className="text-amber text-xs font-bold uppercase tracking-widest">Öne Çıkan Rehber</span>
              <h3 className="text-3xl font-black leading-tight">{filteredArticles[0].title}</h3>
              <p className="text-muted-foreground leading-relaxed">{filteredArticles[0].excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={14} /> {filteredArticles[0].readTime}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {filteredArticles[0].views} görüntülenme</span>
              </div>
              <button className="inline-flex items-center gap-2 bg-amber text-amber-foreground px-6 py-3 rounded-xl font-bold hover:bg-amber-dark transition">
                Rehberi Oku <ChevronRight size={16} />
              </button>
            </div>
            <div className="w-full md:w-64 h-48 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Home className="text-amber" size={64} />
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {(selectedCategory === 'Tümü' && !searchQuery ? filteredArticles.slice(1) : filteredArticles).map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article.id)}
            className="bg-card rounded-2xl border shadow-sm hover:border-amber hover:shadow-md transition cursor-pointer group overflow-hidden"
          >
            <div className="h-32 bg-secondary flex items-center justify-center group-hover:bg-amber/10 transition">
              <div className="text-amber">{article.icon}</div>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] bg-amber-light text-amber-dark font-bold px-2 py-1 rounded uppercase tracking-wider">
                {article.category}
              </span>
              <h3 className="font-bold text-foreground leading-snug">{article.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Aramanızla eşleşen rehber bulunamadı.</p>
          <p className="text-sm mt-2">Farklı anahtar kelimeler deneyin veya kategori filtresini değiştirin.</p>
        </div>
      )}

    </div>
  );
};

// ---------- ARTICLE DETAIL ----------

const ArticleDetail: React.FC<{ article: Article; onBack: () => void }> = ({ article, onBack }) => {
  const { t } = useTranslation();
  return (
  <div className="max-w-4xl mx-auto px-4 py-12">
    {/* Breadcrumb */}
    <button onClick={onBack} className="flex items-center gap-2 text-amber font-semibold text-sm mb-8 hover:underline">
      <ArrowLeft size={16} /> {t('guide.back')}
    </button>

    {/* Article Header */}
    <div className="mb-10">
      <span className="text-[10px] bg-amber-light text-amber-dark font-bold px-3 py-1 rounded uppercase tracking-wider">
        {article.category}
      </span>
      <h1 className="text-3xl md:text-4xl font-black text-foreground mt-4 mb-4 leading-tight">{article.title}</h1>
      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime} okuma</span>
        <span className="flex items-center gap-1"><Eye size={14} /> {article.views} görüntülenme</span>
        <span>{article.date}</span>
      </div>
    </div>

    {/* Table of Contents */}
    <div className="bg-secondary rounded-2xl p-6 mb-10 border">
      <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">İçindekiler</h3>
      <ol className="space-y-2">
        {article.content.sections.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber cursor-pointer transition">
            <span className="w-6 h-6 bg-amber/20 text-amber rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
            {s.heading}
          </li>
        ))}
      </ol>
    </div>

    {/* Intro */}
    <div className="prose max-w-none mb-10">
      <p className="text-foreground leading-relaxed text-lg">{article.content.intro}</p>
    </div>

    {/* Sections */}
    <div className="space-y-10 mb-12">
      {article.content.sections.map((section, i) => (
        <div key={i}>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-amber text-amber-foreground rounded-lg flex items-center justify-center text-sm font-bold">{i + 1}</span>
            {section.heading}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{section.body}</p>
        </div>
      ))}
    </div>

    {/* Tips */}
    <div className="bg-amber/5 border border-amber/20 rounded-2xl p-8 mb-12">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <CheckCircle className="text-amber" size={24} /> {t('guide.expertTips')}
      </h3>
      <ul className="space-y-3">
        {article.content.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-foreground">
            <CheckCircle className="text-amber flex-shrink-0 mt-0.5" size={16} />
            {tip}
          </li>
        ))}
      </ul>
    </div>

    {/* FAQ */}
    {article.content.faq.length > 0 && (
      <div className="mb-12">
        <h3 className="text-xl font-bold text-foreground mb-6">{t('guide.faq')}</h3>
        <div className="space-y-4">
          {article.content.faq.map((item, i) => (
            <div key={i} className="bg-card border rounded-2xl p-6">
              <h4 className="font-bold text-foreground mb-2">{item.q}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* CTA */}
    <div className="bg-nav text-nav-foreground rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-black mb-3">Profesyonel Destek mi Gerekiyor?</h3>
      <p className="text-muted-foreground mb-6">İcra satışlarında uzman avukat desteği için hemen bize ulaşın.</p>
      <button className="bg-amber hover:bg-amber-dark text-amber-foreground px-8 py-3 rounded-xl font-bold transition">
        Ücretsiz Ön Değerlendirme
      </button>
    </div>
    </div>
  );
};

export default GuideView;
