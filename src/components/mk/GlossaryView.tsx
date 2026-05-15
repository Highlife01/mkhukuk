import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, BookA, ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface Term {
  id: number;
  term: string;
  definition: string;
  category: string;
  letter: string;
  relatedTerms?: string[];
}

const glossaryTerms: Term[] = [
  { id: 1, term: "Haciz", definition: "Borçlunun borcunu ödememesi halinde, alacaklının talebi üzerine borçlunun mallarına ve haklarına icra dairesi tarafından el konulması işlemidir. Haciz, menkul (taşınır) ve gayrimenkul (taşınmaz) mallara uygulanabilir. İcra ve İflas Kanunu'nun 78-99. maddeleri arasında düzenlenmiştir.", category: "İcra Hukuku", letter: "H", relatedTerms: ["İcra Takibi", "Menkul Haczi", "Gayrimenkul Haczi"] },
  { id: 2, term: "Temerrüt", definition: "Borçlunun borcunu zamanında ödememesi veya alacaklının alacağını zamanında kabul etmemesi durumudur. Borçlu temerrüdünde faiz ve tazminat yükümlülükleri doğar. Türk Borçlar Kanunu m.117-126 arasında düzenlenmiştir.", category: "Borçlar Hukuku", letter: "T", relatedTerms: ["Temerrüt Faizi", "Gecikme Faizi", "İhtar"] },
  { id: 3, term: "İlam", definition: "Mahkeme tarafından verilen ve kesinleşen kararın yazılı şeklidir. İlamlı icra takibi yapabilmek için geçerli bir ilam gereklidir. Mahkeme kararının taraflara tebliğ edilen onaylı sureti anlamına gelir.", category: "Usul Hukuku", letter: "İ", relatedTerms: ["İlamlı İcra", "Kesinleşme", "Mahkeme Kararı"] },
  { id: 4, term: "İcra Takibi", definition: "Alacaklının alacağını tahsil etmek amacıyla icra müdürlüğü aracılığıyla başlattığı yasal süreçtir. İlamlı ve ilamsız olmak üzere iki türü vardır. İcra dairesine başvuru ile başlar ve ödeme emrinin borçluya tebliği ile devam eder.", category: "İcra Hukuku", letter: "İ", relatedTerms: ["Haciz", "Ödeme Emri", "İcra Dosyası"] },
  { id: 5, term: "Konkordato", definition: "Mali durumu bozulmuş borçlunun, alacaklılarıyla anlaşarak borçlarını belirli bir plan dahilinde ödemesini sağlayan hukuki bir kurumdur. İflas öncesi son çare olarak başvurulur ve mahkeme denetiminde yürütülür.", category: "İcra Hukuku", letter: "K", relatedTerms: ["İflas", "Borç Yapılandırma", "Mühlet"] },
  { id: 6, term: "Menfi Tespit Davası", definition: "Borçlunun, alacaklıya borçlu olmadığını veya borcun daha az olduğunu tespit ettirmek için açtığı davadır. İcra takibinden önce veya sonra açılabilir. Davayı kazanan borçlu, haksız icra takibinden kurtulur.", category: "İcra Hukuku", letter: "M", relatedTerms: ["İstirdat Davası", "İtirazın İptali", "Borçsuzluk"] },
  { id: 7, term: "Kıymet Takdiri", definition: "İcra satışına konu edilecek malın, bilirkişi tarafından belirlenen piyasa değeridir. Satış bu bedel üzerinden yapılır. Taşınmazlarda kıymet takdiri raporunun tebliğinden itibaren 2 yıl geçerlidir.", category: "İcra Hukuku", letter: "K", relatedTerms: ["Bilirkişi", "İhale", "Satış Bedeli"] },
  { id: 8, term: "Rızaen Satış", definition: "Hacizli veya ipotekli bir taşınmazın, icra müdürlüğü veya mahkeme kararı olmaksızın tarafların anlaşmasıyla satılmasıdır. Genellikle banka alacaklarında tercih edilen bir yöntemdir ve taraflara maliyet avantajı sağlar.", category: "İcra Hukuku", letter: "R", relatedTerms: ["İcra Satışı", "İpotek", "Anlaşmalı Satış"] },
  { id: 9, term: "İpotek", definition: "Bir borcun teminatı olarak taşınmaz üzerinde kurulan sınırlı ayni haktır. Borç ödenmezse ipotek alacaklısı taşınmazın satılmasını talep edebilir. Tapu siciline tescil ile kurulur.", category: "Gayrimenkul Hukuku", letter: "İ", relatedTerms: ["Tapu", "Rehin", "Teminat"] },
  { id: 10, term: "Tapu İptali ve Tescil", definition: "Tapu kaydının hukuka aykırı olduğu durumlarda, kaydın düzeltilmesi için açılan davadır. Miras, sahtecilik, ehliyetsizlik gibi nedenlerle açılabilir. Asliye hukuk mahkemesinde görülür.", category: "Gayrimenkul Hukuku", letter: "T", relatedTerms: ["Tapu Sicili", "Kadastro", "Tescil"] },
  { id: 11, term: "Nafaka", definition: "Aile hukuku kapsamında, eşlerin veya çocukların geçimi için mahkeme kararıyla belirlenen düzenli ödemedir. Tedbir nafakası, iştirak nafakası ve yoksulluk nafakası olmak üzere türleri vardır.", category: "Aile Hukuku", letter: "N", relatedTerms: ["Boşanma", "Velayet", "Tazminat"] },
  { id: 12, term: "Velayet", definition: "Ana babanın, ergin olmayan çocukları üzerindeki bakım, koruma ve temsil hak ve yükümlülüklerinin tamamıdır. Boşanma halinde mahkeme tarafından ana veya babaya verilir.", category: "Aile Hukuku", letter: "V", relatedTerms: ["Nafaka", "Boşanma", "Çocuk Hakları"] },
  { id: 13, term: "Menkul Haczi", definition: "Borçluya ait taşınır malların (araç, ev eşyası, mücevher vb.) icra müdürlüğü tarafından haczedilmesidir. Haczedilen mallar satılarak alacak tahsil edilir.", category: "İcra Hukuku", letter: "M", relatedTerms: ["Haciz", "Muhafaza", "Yediemin"] },
  { id: 14, term: "Gayrimenkul Haczi", definition: "Borçlunun taşınmaz malları (ev, arsa, tarla vb.) üzerine icra müdürlüğü tarafından konulan hacizdir. Tapu siciline şerh edilir ve taşınmazın satışı engellenir.", category: "İcra Hukuku", letter: "G", relatedTerms: ["Haciz", "Tapu Şerhi", "İcra Satışı"] },
  { id: 15, term: "Ödeme Emri", definition: "İcra müdürlüğü tarafından borçluya gönderilen ve borcunu 7 gün (ilamsız takipte) veya 10 gün (kambiyo takibinde) içinde ödemesini ya da itiraz etmesini bildiren resmi belgedir.", category: "İcra Hukuku", letter: "Ö", relatedTerms: ["İcra Takibi", "İtiraz", "Tebligat"] },
  { id: 16, term: "İtirazın İptali Davası", definition: "Borçlunun icra takibine yaptığı itirazın kaldırılması için alacaklının açtığı davadır. İtirazın tebliğinden itibaren 1 yıl içinde açılmalıdır. İcra inkâr tazminatı talep edilebilir.", category: "İcra Hukuku", letter: "İ", relatedTerms: ["İcra Takibi", "İtiraz", "İcra İnkâr Tazminatı"] },
  { id: 17, term: "Tebligat", definition: "Hukuki işlemlerin muhataplarına resmi yollarla bildirilmesidir. Posta, memur veya elektronik yolla yapılabilir. 7201 sayılı Tebligat Kanunu'na göre düzenlenir.", category: "Usul Hukuku", letter: "T", relatedTerms: ["Ödeme Emri", "Tebliğ Tarihi", "Usulsüz Tebligat"] },
  { id: 18, term: "Bilirkişi", definition: "Mahkeme tarafından, uzmanlık gerektiren konularda görüş almak için atanan kişidir. Bilirkişi raporu hâkim için bağlayıcı değildir ancak önemli bir delil niteliğindedir.", category: "Usul Hukuku", letter: "B", relatedTerms: ["Kıymet Takdiri", "Rapor", "Delil"] },
  { id: 19, term: "İflas", definition: "Ticaret mahkemesi kararıyla borçlunun tüm malvarlığının alacaklılar arasında paylaştırılmasıdır. Yalnızca tacirler hakkında uygulanır. İflas masası oluşturularak alacaklar sıraya konur.", category: "İcra Hukuku", letter: "İ", relatedTerms: ["Konkordato", "İflas Masası", "Sıra Cetveli"] },
  { id: 20, term: "Yediemin", definition: "Haczedilen malların muhafazası için icra müdürlüğü tarafından görevlendirilen kişidir. Yediemin, malları korumak ve istendiğinde teslim etmekle yükümlüdür.", category: "İcra Hukuku", letter: "Y", relatedTerms: ["Haciz", "Muhafaza", "Menkul Haczi"] },
  { id: 21, term: "İstihkak Davası", definition: "Haczedilen bir mal üzerinde üçüncü kişinin mülkiyet iddiasında bulunması halinde açılan davadır. Hacze itiraz eden üçüncü kişi bu davayı açar.", category: "İcra Hukuku", letter: "İ", relatedTerms: ["Haciz", "Mülkiyet", "Üçüncü Kişi"] },
  { id: 22, term: "Rehin", definition: "Bir alacağın teminatı olarak taşınır veya taşınmaz mal üzerinde kurulan sınırlı ayni haktır. Taşınırlarda teslim ile, taşınmazlarda tescil ile kurulur.", category: "Borçlar Hukuku", letter: "R", relatedTerms: ["İpotek", "Teminat", "Ayni Hak"] },
  { id: 23, term: "Vekâletname", definition: "Bir kişinin başka bir kişiyi belirli işlemleri yapmak üzere yetkilendirdiği noter onaylı belgedir. Dava vekâletnamesi ile avukat müvekkili adına işlem yapabilir.", category: "Usul Hukuku", letter: "V", relatedTerms: ["Avukat", "Müvekkil", "Temsil"] },
  { id: 24, term: "Zamanaşımı", definition: "Kanunda belirlenmiş sürenin geçmesiyle bir hakkın talep edilebilirliğinin sona ermesidir. Borçlar hukukunda genel zamanaşımı süresi 10 yıldır. Zamanaşımı def'i olarak ileri sürülmelidir.", category: "Borçlar Hukuku", letter: "Z", relatedTerms: ["Def'i", "Süre", "Hak Düşürücü Süre"] },
  { id: 25, term: "Müdahalenin Meni", definition: "Mülkiyet hakkına yapılan haksız müdahalenin önlenmesi için açılan davadır. Taşınmaza yapılan tecavüzün kaldırılmasını ve eski hale iadesini kapsar.", category: "Gayrimenkul Hukuku", letter: "M", relatedTerms: ["Mülkiyet", "Ecrimisil", "El Atmanın Önlenmesi"] },
  { id: 26, term: "Ecrimisil", definition: "Bir taşınmazı haksız olarak kullanan kişinin, taşınmaz sahibine ödemesi gereken haksız işgal tazminatıdır. Geriye dönük 5 yıl için talep edilebilir.", category: "Gayrimenkul Hukuku", letter: "E", relatedTerms: ["Müdahalenin Meni", "Haksız İşgal", "Tazminat"] },
  { id: 27, term: "Ortaklığın Giderilmesi", definition: "Paylı veya elbirliği mülkiyetine konu bir taşınmazın paydaşlar arasında paylaştırılması veya satılarak bedelinin bölüşülmesi davasıdır. İzale-i şüyu davası olarak da bilinir.", category: "Gayrimenkul Hukuku", letter: "O", relatedTerms: ["Paylı Mülkiyet", "İzale-i Şüyu", "Satış Suretiyle"] },
  { id: 28, term: "Kira Tespit Davası", definition: "Kiracı veya kiraya veren tarafından kira bedelinin mahkeme aracılığıyla yeniden belirlenmesi için açılan davadır. Beş yıldan uzun süreli kiralarda veya tarafların anlaşamaması halinde açılabilir.", category: "Kira Hukuku", letter: "K", relatedTerms: ["Kira Sözleşmesi", "Kira Artışı", "Tahliye"] },
  { id: 29, term: "Tahliye Davası", definition: "Kiraya verenin, kiracıyı kiralanan taşınmazdan çıkarmak için açtığı davadır. Kira bedelinin ödenmemesi, süre sonu, ihtiyaç gibi sebeplerle açılabilir.", category: "Kira Hukuku", letter: "T", relatedTerms: ["Kira Sözleşmesi", "İhtarname", "Tahliye Taahhüdü"] },
  { id: 30, term: "Şüf'a Hakkı", definition: "Paylı mülkiyette bir paydaşın payını üçüncü kişiye satması halinde, diğer paydaşların öncelikli satın alma hakkıdır. Satışın öğrenilmesinden itibaren 3 ay içinde kullanılmalıdır.", category: "Gayrimenkul Hukuku", letter: "Ş", relatedTerms: ["Paylı Mülkiyet", "Ön Alım Hakkı", "Tapu"] },
  { id: 31, term: "Temerrüt Faizi", definition: "Borçlunun temerrüde düşmesi halinde ödenmesi gereken yasal faizdir. TBK m.120'ye göre yıllık %9 oranında uygulanır. Ticari işlerde ise avans faizi oranı uygulanabilir.", category: "Borçlar Hukuku", letter: "T", relatedTerms: ["Temerrüt", "Yasal Faiz", "Avans Faizi"] },
  { id: 32, term: "İhtarname", definition: "Bir hukuki durumun karşı tarafa resmi olarak bildirilmesi için noter aracılığıyla gönderilen belgedir. Temerrüde düşürme, fesih bildirimi gibi amaçlarla kullanılır.", category: "Borçlar Hukuku", letter: "İ", relatedTerms: ["Temerrüt", "Fesih", "Noter"] },
  { id: 33, term: "Arabuluculuk", definition: "Tarafların bir uyuşmazlığı arabulucu yardımıyla müzakere ederek çözmesidir. İş hukuku ve ticaret hukuku davalarında dava şartı olarak zorunludur.", category: "Usul Hukuku", letter: "A", relatedTerms: ["Dava Şartı", "Uzlaşma", "Müzakere"] },
  { id: 34, term: "Kesinleşme", definition: "Mahkeme kararının temyiz veya istinaf yollarına başvurulmaması veya bu yolların tükenmesiyle kesin hale gelmesidir. İlamlı icra takibi için bazı davalarda kesinleşme şarttır.", category: "Usul Hukuku", letter: "K", relatedTerms: ["İlam", "Temyiz", "İstinaf"] },
  { id: 35, term: "İstinaf", definition: "İlk derece mahkemesi kararlarına karşı bölge adliye mahkemesine yapılan başvurudur. 2016 yılından itibaren Türk hukuk sisteminde uygulanmaktadır.", category: "Usul Hukuku", letter: "İ", relatedTerms: ["Temyiz", "Kesinleşme", "Bölge Adliye Mahkemesi"] },
];

const categories = ['Tümü', ...Array.from(new Set(glossaryTerms.map(t => t.category)))];
const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

const GlossaryView: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredTerms = useMemo(() => {
    return glossaryTerms
      .filter(t => {
        const matchesSearch = searchQuery === '' || 
          t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.definition.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tümü' || t.category === selectedCategory;
        const matchesLetter = !selectedLetter || t.letter === selectedLetter;
        return matchesSearch && matchesCategory && matchesLetter;
      })
      .sort((a, b) => a.term.localeCompare(b.term, 'tr'));
  }, [searchQuery, selectedCategory, selectedLetter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tümü');
    setSelectedLetter(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber/10 text-amber-dark px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <BookA size={14} /> {t('glossary.badge')}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">{t('glossary.title')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('glossary.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={t('glossary.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-amber transition placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Alphabet Bar */}
      <div className="flex flex-wrap justify-center gap-1 mb-6">
        {alphabet.map(letter => {
          const hasTerms = glossaryTerms.some(t => t.letter === letter);
          return (
            <button
              key={letter}
              onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
              disabled={!hasTerms}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                selectedLetter === letter
                  ? 'bg-amber text-amber-foreground'
                  : hasTerms
                    ? 'bg-card border border-border text-foreground hover:border-amber hover:text-amber'
                    : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-nav text-nav-foreground'
                : 'bg-card border border-border text-foreground hover:border-amber'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count & reset */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{filteredTerms.length}</span> {t('glossary.termsFound')}
        </p>
        {(searchQuery || selectedCategory !== 'Tümü' || selectedLetter) && (
          <button onClick={resetFilters} className="text-xs text-amber font-bold hover:underline">
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Terms List */}
      <div className="space-y-3">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-amber/50 transition"
          >
            <button
              onClick={() => setExpandedId(expandedId === term.id ? null : term.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-amber/10 text-amber rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                  {term.letter}
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{term.term}</h3>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{term.category}</span>
                </div>
              </div>
              {expandedId === term.id ? (
                <ChevronUp size={18} className="text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {expandedId === term.id && (
              <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{term.definition}</p>
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag size={14} className="text-amber" />
                    <span className="text-xs font-semibold text-muted-foreground">{t('glossary.relatedTerms')}:</span>
                    {term.relatedTerms.map(rt => (
                      <button
                        key={rt}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery(rt);
                          setSelectedCategory('Tümü');
                          setSelectedLetter(null);
                          setExpandedId(null);
                        }}
                        className="text-xs bg-secondary px-3 py-1 rounded-lg font-medium text-foreground hover:bg-amber/10 hover:text-amber transition"
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="text-center py-16">
            <BookA size={48} className="mx-auto text-muted-foreground/30 mb-4" />
             <h3 className="font-bold text-foreground mb-2">{t('glossary.noResults')}</h3>
            <p className="text-sm text-muted-foreground">—</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlossaryView;
