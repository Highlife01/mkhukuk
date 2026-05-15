export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  desc: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "icra-hukukunda-rizaen-satis",
    title: "İcra Hukukunda Rızaen Satış: Şartlar, Süreç ve Avantajlar",
    date: "18 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "6 dk",
    desc: "İcra ve İflas Kanunu kapsamında, borçluların haczedilen mallarının satışında önemli bir kolaylık sağlayan rızaen satış müessesesi.",
    image: "/images/blog/rizaen-satis.png",
    content: `
# İcra Hukukunda Rızaen Satış: Şartlar, Süreç ve Avantajlar

## Giriş
İcra ve İflas Kanunu (İİK) kapsamında, borçluların haczedilen mallarının satışında önemli bir kolaylık sağlayan "rızaen satış" müessesesi, hem borçlu hem de alacaklı açısından çeşitli avantajlar sunmaktadır. Bu makalede, rızaen satışın ne olduğu, hangi şartlar altında gerçekleştirilebileceği, süreci ve taraflara sağladığı faydalar detaylı bir şekilde incelenecektir.

## Rızaen Satış Nedir?
Rızaen satış, İcra ve İflas Kanunu'nun 111/a maddesi ile düzenlenmiş olup, haczedilen bir malın icra dairesi tarafından açık artırma yoluyla satılması yerine, borçluya belirli şartlar altında bu malı bizzat satma yetkisinin verilmesidir. Bu yöntem, borçlunun malını piyasa değerine daha yakın bir fiyata satabilmesine olanak tanıyarak, ihale sürecinde oluşabilecek değer kayıplarının önüne geçmeyi amaçlar.

## Rızaen Satışın Şartları
Rızaen satışın gerçekleştirilebilmesi için belirli şartların bir araya gelmesi gerekmektedir:
- **Borçlunun Talebi:** Borçlu, kıymet takdirinin kendisine tebliğinden itibaren yedi gün içinde haczedilen malının rızaen satışı için icra dairesinden yetki talep etmelidir.
- **Satış Bedeli:** Rızaen satışta belirlenen bedel, malın muhammen bedelinin %90'ını aşmamalı ve alacaklının alacağını ve satış masraflarını karşılamalıdır.
- **Süre Sınırı:** İcra müdürü tarafından borçluya rızaen satış için on beş günlük bir süre verilir.

## Rızaen Satış Süreci
1. Kıymet Takdiri ve Tebliği
2. Borçlunun Başvurusu
3. Yetki Belgesi Verilmesi
4. Satışın Gerçekleştirilmesi
5. Paranın Ödenmesi

## Rızaen Satışın Avantajları
- **Borçlu Açısından:** Malın piyasa değerine daha yakın bir fiyata satılabilmesi, itibar kaybının önüne geçilmesi.
- **Alacaklı Açısından:** Alacağına daha hızlı ve eksiksiz kavuşma imkanı, satış masraflarının azalması.

## Sonuç
İcra hukukunda rızaen satış, borçlu ve alacaklı menfaatlerini dengeleyen, modern icra hukukunun önemli bir aracıdır. Borçlunun malını daha etkin bir şekilde değerlendirmesine olanak tanırken, alacaklının da alacağına daha hızlı ulaşmasını sağlar.
    `
  },
  {
    slug: "icra-satislari-ve-ihalenin-feshi",
    title: "İcra Satışları (İhale) ve İhalenin Feshi Davası: Güncel Uygulamalar",
    date: "19 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "7 dk",
    desc: "İcra takibinin önemli aşamalarından biri olan haczedilen malların satışı ve ihale sürecindeki usul aykırılıklarına karşı şikayet yolu.",
    image: "/images/blog/icra-ihale.png",
    content: `
# İcra Satışları (İhale) ve İhalenin Feshi Davası: Güncel Uygulamalar

## Giriş
İcra takibinin önemli aşamalarından biri olan haczedilen malların satışı, alacaklının alacağına kavuşmasını sağlayan temel yollardan biridir. Bu satışlar genellikle açık artırma (ihale) yoluyla gerçekleştirilir. Ancak, ihale sürecinde usul ve yasaya aykırılıklar meydana gelmesi durumunda, ilgililer tarafından "ihalenin feshi davası" açılabilir.

## İcra Satışları (İhale) Süreci
Haczedilen malların satışı, İcra ve İflas Kanunu (İİK) hükümlerine göre yapılır. Günümüzde satışlar, e-Satış Portalı üzerinden elektronik ortamda gerçekleştirilmektedir.
1. Kıymet Takdiri
2. Satış İlanı
3. Elektronik İhale
4. İhale Bedelinin Ödenmesi
5. Tescil/Teslim

## İhalenin Feshi Davası
İhale sürecinde yapılan hatalar veya usulsüzlükler, ihalenin feshi davası ile satışın iptaline yol açabilir. Başlıca fesih nedenleri:
- İhale ilanındaki usulsüzlükler
- İhale sürecindeki usulsüzlükler
- Malın esaslı vasfında hata
- İhaleye katılımın engellenmesi

## Sonuç
İcra satışları ve ihalenin feshi davası, icra hukukunun karmaşık ancak hayati konularıdır. Elektronik ihale sistemiyle birlikte süreçler modernleşse de, hak kayıplarının önüne geçmek için yasal prosedürlere titizlikle uyulması gerekmektedir.
    `
  },
  {
    slug: "tapu-iptal-ve-tescil-davalari",
    title: "Gayrimenkul Hukukunda Tapu İptal ve Tescil Davaları: Muris Muvazaası ve Yolsuz Tescil",
    date: "20 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "9 dk",
    desc: "Tapu sicilinde gerçek hak durumuna aykırı olarak yapılan tescillerin düzeltilmesi ve muris muvazaası nedeniyle açılan davalar.",
    image: "/images/blog/tapu-iptal.png",
    content: `
# Gayrimenkul Hukukunda Tapu İptal ve Tescil Davaları: Muris Muvazaası ve Yolsuz Tescil

## Giriş
Gayrimenkul hukuku, taşınmaz mallar üzerindeki hakları ve bu hakların korunmasını düzenleyen önemli bir hukuk dalıdır. Tapu sicilinde çeşitli nedenlerle gerçeğe aykırı durumlar ortaya çıkabilmektedir.

## Tapu İptal ve Tescil Davası Nedir?
Tapu iptal ve tescil davası, tapu sicilinde gerçek hak durumuna aykırı olarak yapılan tescillerin düzeltilmesi, yani hukuka aykırı tescilin iptal edilerek gerçek hak sahibinin adına tescil edilmesini amaçlayan davalardır.

## Muris Muvazaası Nedeniyle Davalar
Muris muvazaası, mirasbırakanın (muris), mirasçılarından mal kaçırmak amacıyla gerçekte bağışlamak istediği bir taşınmazı, tapuda satış veya ölünceye kadar bakma sözleşmesi gibi göstererek devretmesidir.
- **Şartları:** Mal kaçırma kastı, görünürdeki işlem, gizli işlem, üçüncü kişiye devir.

## Yolsuz Tescil Nedeniyle Davalar
Yolsuz tescil, tapu sicilinde yapılan bir tescil işleminin, hukuken geçerli bir sebebe dayanmaması durumudur. Örnekler: Geçersiz vekaletname, hukuki ehliyet eksikliği, sahtecilik.

## Sonuç
Gayrimenkul hukukunda tapu iptal ve tescil davaları, taşınmaz maliklerinin haklarını korumak ve tapu sicilinin güvenilirliğini sağlamak açısından büyük önem taşır.
    `
  },
  {
    slug: "2025-kira-hukuku-gelismeleri",
    title: "2025 Yılı Kira Hukuku Gelişmeleri: %25 Sınırı Sonrası Tahliye ve Kira Tespit Davaları",
    date: "21 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "8 dk",
    desc: "Konut kiralarında uygulanan %25 kira artış oranı sınırlaması sonrası beklenen tahliye ve kira tespit davalarındaki yeni dönem.",
    image: "/images/blog/kira-hukuku.png",
    content: `
# 2025 Yılı Kira Hukuku Gelişmeleri: %25 Sınırı Sonrası Tahliye ve Kira Tespit Davaları

## Giriş
Türkiye'de kira hukuku, özellikle son yıllarda yaşanan ekonomik dalgalanmalar nedeniyle önemli değişikliklere sahne olmuştur. %25 sınırının kaldırılması veya devam etmesi beklentileri süreci doğrudan etkilemektedir.

## Tahliye Davaları ve Güncel Durum
Başlıca tahliye nedenleri:
- İhtiyaç nedeniyle tahliye
- Yeniden inşa ve imar nedeniyle tahliye
- İki haklı ihtar nedeniyle tahliye
- Tahliye taahhütnamesi

## Kira Tespit Davaları
Kira tespit davası, kira bedelinin piyasa koşullarına göre yeniden belirlenmesi amacıyla açılır. Özellikle 5 yılı dolduran kira sözleşmelerinde hakkaniyet ilkesi gözetilerek yeni bedel belirlenir.

## Sonuç
2025 yılı, kira hukuku açısından önemli gelişmelere sahne olmaktadır. Tarafların yasal düzenlemeleri ve güncel yargı kararlarını yakından takip etmeleri önemlidir.
    `
  },
  {
    slug: "kira-uyusmazliklarinda-zorunlu-arabuluculuk",
    title: "Kira Uyuşmazlıklarında Zorunlu Arabuluculuk Süreci ve Uygulama Hataları",
    date: "22 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "6 dk",
    desc: "Kira ilişkilerinden doğan uyuşmazlıklarda dava açmadan önce tamamlanması gereken zorunlu arabuluculuk süreci ve sık yapılan hatalar.",
    image: "/images/blog/arabuluculuk.png",
    content: `
# Kira Uyuşmazlıklarında Zorunlu Arabuluculuk Süreci ve Uygulama Hataları

## Giriş
Kira uyuşmazlıklarının yargı yoluyla çözümü uzun sürebildiğinden, 01.09.2023 tarihinden itibaren zorunlu arabuluculuk uygulaması getirilmiştir.

## Süreç Nasıl İşler?
1. **Başvuru:** Arabuluculuk bürolarına başvuru yapılır.
2. **Görevlendirme:** Bir arabulucu atanır.
3. **Toplantılar:** Taraflar bir araya gelerek müzakere eder.
4. **Sonuç:** Anlaşma sağlanırsa mahkeme ilamı niteliğinde belge düzenlenir.

## Yaygın Uygulama Hataları
- Arabuluculuğa başvurmadan dava açmak (usulden red nedeni)
- Sürelere dikkat etmemek
- İyi niyetli yaklaşım sergilememek
- Bilgi ve belge eksikliğiyle toplantıya katılmak

## Sonuç
Arabuluculuk, kira uyuşmazlıklarının çözümünde modern ve etkili bir alternatif sunmaktadır.
    `
  },
  {
    slug: "is-hukukunda-uzaktan-calisma",
    title: "İş Hukukunda Uzaktan Çalışma (Remote Work) ve İş Kazası Sorumluluğu",
    date: "23 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "7 dk",
    desc: "Uzaktan çalışma modelinde iş sağlığı ve güvenliği yükümlülükleri ile evde meydana gelen kazaların iş kazası sayılma kriterleri.",
    image: "/images/blog/uzaktan-calisma.png",
    content: `
# İş Hukukunda Uzaktan Çalışma (Remote Work) ve İş Kazası Sorumluluğu

## Giriş
Uzaktan çalışma modeli birçok sektörde kalıcı hale gelmiştir. Bu durum, iş kazası sorumluluğu gibi konularda yeni hukuki tartışmaları beraberinde getirmiştir.

## İşverenin Yükümlülükleri
İşverenin 6331 sayılı Kanun kapsamındaki yükümlülükleri devam etmektedir:
- Risk değerlendirmesi yapmak
- Eğitim ve bilgilendirme sağlamak
- Gerekli ekipmanları temin etmek

## İş Kazası Sorumluluğu
Uzaktan çalışmada iş kazası sayılma kriterleri:
- Olay ile işin yürütümü arasındaki bağlantı (Nedensellik bağı)
- İspat yükü (Aksini ispat işverendedir)
- İşverenin denetim alanı kısıtlı olsa da sorumluluğu devam eder.

## Sonuç
Tarafların detaylı uzaktan çalışma sözleşmeleri yapmaları ve İSG tedbirlerini titizlikle uygulamaları uyuşmazlıkları önleyecektir.
    `
  },
  {
    slug: "kvkk-veri-sorumlularinin-yukumlulukleri",
    title: "KVKK Kapsamında Veri Sorumlularının Yükümlülükleri ve 2025 Güncel Cezaları",
    date: "24 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "8 dk",
    desc: "Kişisel Verilerin Korunması Kanunu uyarınca veri sorumlularına getirilen aydınlatma, güvenlik ve VERBİS kayıt yükümlülükleri.",
    image: "/images/blog/kvkk-ceza.png",
    content: `
# KVKK Kapsamında Veri Sorumlularının Yükümlülükleri ve 2025 Güncel Cezaları

## Giriş
Dijitalleşen dünyada kişisel verilerin korunması kurumlar için kritik önemdedir. KVKK, veri sorumlularına ağır yükümlülükler ve ihlaller için yüksek cezalar öngörür.

## Temel Yükümlülükler
1. **Aydınlatma Yükümlülüğü:** Veri sahiplerini bilgilendirme.
2. **Veri Güvenliği:** Teknik ve idari tedbirlerin alınması.
3. **VERBİS Kaydı:** Şartları sağlayanların sicile kaydı.
4. **Başvuruları Yanıtlama:** Veri sahibi taleplerine 30 gün içinde dönüş.
5. **Silme/Yok Etme:** İşleme şartları kalktığında verilerin imhası.

## 2025 Güncel Cezalar
- Aydınlatma ihlali: 47.000 TL - 946.000 TL
- Veri güvenliği ihlali: 141.000 TL - 9.463.000 TL
- VERBİS yükümlülüğü: 283.000 TL - 14.193.000 TL

## Sonuç
KVKK uyumu sadece yasal zorunluluk değil, kurumsal itibarın da temelidir.
    `
  },
  {
    slug: "e-ticaret-hukuku-tuketici-haklari",
    title: "E-Ticaret Hukuku: Tüketici Hakları ve Mesafeli Satış Sözleşmelerinde Yeni Dönem",
    date: "25 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "7 dk",
    desc: "İnternet alışverişlerinde 14 günlük cayma hakkı, iade kargo ücretleri ve yeni Mesafeli Sözleşmeler Yönetmeliği düzenlemeleri.",
    image: "/images/blog/e-ticaret.png",
    content: `
# E-Ticaret Hukuku: Tüketici Hakları ve Mesafeli Satış Sözleşmelerinde Yeni Dönem

## Giriş
Dijitalleşme alışveriş alışkanlıklarını değiştirirken, tüketici haklarının korunması ihtiyacı e-ticaret hukukunu şekillendirmiştir.

## Temel Tüketici Hakları
- **Bilgilendirme Hakkı:** Ürün özellikleri ve fiyat hakkında açık bilgi.
- **Cayma Hakkı:** 14 gün içinde gerekçesiz iade hakkı.
- **Ayıplı Mal Sorumluluğu:** Değişim, onarım veya bedel iadesi talebi.

## Yeni Düzenlemeler
1 Ocak 2026'dan itibaren cayma hakkını kullanan tüketicilere iade kargo ücreti yansıtılamayacaktır. Aracı hizmet sağlayıcılarının (pazaryerleri) sorumlulukları artırılmıştır.

## Sonuç
Tüketicilerin ve işletmelerin güncel yasal değişiklikleri takip etmeleri, güvenli e-ticaret ekosistemi için kritiktir.
    `
  },
  {
    slug: "bosanma-davalarinda-mal-rejiminin-tasfiyesi",
    title: "Boşanma Davalarında Mal Rejiminin Tasfiyesi ve Katılma Alacağı Hesaplaması",
    date: "26 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "9 dk",
    desc: "Evlilik birliği içinde edinilen malların paylaşımı, katılma alacağı hesaplama yöntemleri ve 10 yıllık zamanaşımı süresi.",
    image: "/images/blog/mal-paylasimi.png",
    content: `
# Boşanma Davalarında Mal Rejiminin Tasfiyesi ve Katılma Alacağı Hesaplaması

## Giriş
Evlilik birliğinin boşanma ile sona ermesi durumunda, eşlerin evlilik süresince edindikleri malların nasıl paylaşılacağının belirlenmesi süreci başlar.

## Edinilmiş Mallara Katılma Rejimi
Yasal mal rejimine göre, karşılığı verilerek edinilen her türlü değer (maaş, sosyal ödemeler vb.) edinilmiş maldır. Kişisel mallar (miras, bağış vb.) paylaşıma tabi değildir.

## Katılma Alacağı Hesaplaması
Artık Değer = (Edinilmiş Mallar) - (Borçlar)
Katılma Alacağı = Artık Değerin %50'si.
Hesaplamada malların karar tarihindeki rayiç değerleri esas alınır.

## Sonuç
Mal paylaşımı davalarında malların doğru tespiti ve rayiç değerlerin belirlenmesi hak kayıplarının önüne geçer. 10 yıllık zamanaşımı süresi unutulmamalıdır.
    `
  },
  {
    slug: "miras-hukukunda-sakli-pay",
    title: "Miras Hukukunda Saklı Pay ve Tenkis Davası: Güncel Yargıtay Kararları Işığında",
    date: "27 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "8 dk",
    desc: "Mirasçıların dokunulamaz payları (saklı pay), vasiyetnameler ile ihlal edilen hakların tenkis davası ile geri alınması.",
    image: "/images/blog/miras-tenkis.png",
    content: `
# Miras Hukukunda Saklı Pay ve Tenkis Davası: Güncel Yargıtay Kararları Işığında

## Giriş
Mirasbırakan, sağlığında yaptığı tasarruflarla mirasçıların haklarını zedeleyebilir. TMK, bazı mirasçıların paylarını "saklı pay" olarak koruma altına almıştır.

## Saklı Paylı Mirasçılar ve Oranlar
- **Altsoy (Çocuklar/Torunlar):** Yasal payın yarısı.
- **Anne ve Baba:** Yasal payın 1/4'ü.
- **Sağ Kalan Eş:** Mirasçı olduğu duruma göre yasal payın tamamı veya 3/4'ü.

## Tenkis Davası
Mirasbırakanın saklı payı ihlal eden tasarruflarının yasal sınırlara çekilmesi için açılan davadır. Mirasbırakanın ölümünden sonra 1 yıl içinde açılmalıdır.

## Sonuç
Yargıtay kararlarına göre değerleme anı ve mal kaçırma kastının tespiti tenkis davalarının kaderini belirler.
    `
  },
  {
    slug: "bilisim-suclari-sosyal-medya-hakaret",
    title: "Bilişim Suçları ve Sosyal Medya Üzerinden İşlenen Hakaret/Tehdit Suçlarında İspat",
    date: "28 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "6 dk",
    desc: "İnternet yoluyla işlenen hakaret ve tehdit suçlarında ekran görüntüsü, URL kaydı ve IP tespiti gibi delil elde etme yöntemleri.",
    image: "/images/blog/bilisim-suclari.png",
    content: `
# Bilişim Suçları ve Sosyal Medya Üzerinden İşlenen Hakaret/Tehdit Suçlarında İspat

## Giriş
Sosyal medya platformlarının yaygınlaşmasıyla birlikte dijital ortamda hakaret ve tehdit eylemleri artış göstermiştir. Bu eylemler TCK kapsamında bilişim suçları arasındadır.

## İspat Yöntemleri
1. **Ekran Görüntüsü (Screenshot):** En yaygın başlangıç delilidir.
2. **URL (Link) Kaydı:** İçeriğin kalıcı adresi.
3. **Hesap Bilgileri:** Kullanıcı adı ve profil verileri.
4. **IP Adresi Tespiti:** Savcılık kanalıyla servis sağlayıcılardan talep edilir.

## Delil Serbestliği ve Hukuka Uygunluk
Delillerin hukuka uygun yollarla elde edilmesi esastır. Hileli veya özel hayatın gizliliğini ağır ihlal eden ses/video kayıtları yargılamada kullanılamayabilir.

## Sonuç
Suç tespiti yapıldığında delillerin karartılmaması için vakit kaybetmeden siber suçlarla mücadele birimlerine başvurulmalıdır.
    `
  },
  {
    slug: "kat-mulkiyeti-kanunu-aidat-tahsili",
    title: "Kat Mülkiyeti Kanunu: Ortak Alanların Kullanımı ve Aidat Alacaklarının Tahsili",
    date: "29 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "7 dk",
    desc: "Apartman ve sitelerde ortak alanların paylaşımı, gecikme tazminatı ve ödenmeyen aidatlar için icra takibi süreçleri.",
    image: "/images/blog/kat-mulkiyeti.png",
    content: `
# Kat Mülkiyeti Kanunu: Ortak Alanların Kullanımı ve Aidat Alacaklarının Tahsili

## Giriş
Apartman ve site yaşamı, Kat Mülkiyeti Kanunu (KMK) kurallarına tabidir. Ortak alanların kullanımı ve giderlere katılım huzurlu yaşamın temelidir.

## Ortak Alanlar ve Kullanımı
Temeller, çatılar, merdivenler, sahanlıklar ve asansörler ortak yerlerdir. Bu alanlar amacına uygun kullanılmalı ve diğer kat malikleri rahatsız edilmemelidir.

## Aidat Alacaklarının Tahsili
Aidatını ödemeyen kat malikine:
- İhtarname gönderilir.
- İlamsız icra takibi başlatılır.
- Aylık %5 gecikme tazminatı talep edilebilir.
Aidat alacakları 5 yıllık zamanaşımına tabidir.

## Sonuç
KMK kurallarına uyum, mülk değerini korurken hukuki uyuşmazlıkların da önüne geçer.
    `
  },
  {
    slug: "kambiyo-senetlerine-mahsus-haciz-yolu",
    title: "Kambiyo Senetlerine Mahsus Haciz Yolu: 2025 Taslak Düzenlemeler ve Mevcut Durum",
    date: "30 Mart 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "8 dk",
    desc: "Çek, bono ve poliçe alacaklıları için sunulan imtiyazlı icra takibi yolu ve yeni Cebrî İcra Kanunu taslağındaki değişiklikler.",
    image: "/images/blog/kambiyo-hukuku.png",
    content: `
# Kambiyo Senetlerine Mahsus Haciz Yolu: 2025 Taslak Düzenlemeler ve Mevcut Durum

## Giriş
Ticari hayatta ödemelerin güvencesi olan çek ve bonolar için alacaklıya daha hızlı tahsilat imkanı sunan özel bir icra takip yolu mevcuttur.

## Mevcut Durum (İİK Madde 167)
- Borçluya 10 günlük ödeme, 5 günlük itiraz süresi tanınır.
- Borçlunun itirazı kural olarak satışı durdurmaz.
- Senedin aslının icra dairesine ibrazı zorunludur.

## 2025 Cebrî İcra Kanunu Taslağı
Yeni taslak ile kambiyo senetlerine mahsus haciz yolunun kaldırılarak genel haciz yoluyla birleştirilmesi gündemdedir. Bu durumun ticari güven ve takip süreleri üzerindeki etkileri tartışılmaktadır.

## Sonuç
İcra hukukundaki bu köklü değişiklik, ticari alacakların tahsil sürecini doğrudan etkileyecektir.
    `
  },
  {
    slug: "tibbi-malpraktis-davalari",
    title: "Tıbbi Malpraktis Davaları: Hekim Sorumluluğu ve Tazminat Hesaplama Yöntemleri",
    date: "01 Nisan 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "9 dk",
    desc: "Hekim hataları nedeniyle açılan tazminat davalarında kusur tespiti, illiyet bağı ve maddi/manevi tazminat hesaplama kriterleri.",
    image: "/images/blog/malpraktis.png",
    content: `
# Tıbbi Malpraktis Davaları: Hekim Sorumluluğu ve Tazminat Hesaplama Yöntemleri

## Giriş
Hekim veya sağlık personelinin tanı ve tedavi sırasında standart uygulamanın dışına çıkması "tıbbi malpraktis" olarak adlandırılır.

## Sorumluluğun Şartları
1. **Hukuka Aykırı Fiil:** Tıbbi standartlara aykırılık.
2. **Kusur:** Hekimin eylemindeki ihmal veya kasıt.
3. **Zarar:** Hastanın uğradığı fiziksel/ruhsal kayıp.
4. **İlliyet Bağı:** Zararın hekim hatasından kaynaklanması.

## Tazminat Hesaplama
- **Maddi Tazminat:** Tedavi giderleri, kazanç kaybı, bakım giderleri. Aktüerya bilirkişileri tarafından hesaplanır.
- **Manevi Tazminat:** Yaşanan acı ve üzüntünün telafisi için hakimin takdirindeki miktar.

## Sonuç
Hekim hatası davalarında tıbbi bilirkişi raporları ve uzman hukuki görüş davanın temel taşlarını oluşturur.
    `
  },
  {
    slug: "sirketler-hukukunda-konkordato",
    title: "Şirketler Hukukunda Konkordato Süreci: İflastan Kurtulma Yolu Olarak Güncel Uygulama",
    date: "02 Nisan 2026",
    category: "Makaleler",
    author: "Av. Mahmut Kaya",
    readTime: "8 dk",
    desc: "Mali sıkıntıya düşen şirketlerin borçlarını yapılandırarak ticari faaliyetlerine devam etmesini sağlayan konkordato süreci ve şartları.",
    image: "/images/blog/konkordato.png",
    content: `
# Şirketler Hukukunda Konkordato Süreci: İflastan Kurtulma Yolu Olarak Güncel Uygulama

## Giriş
Konkordato, borçlarını ödeyemeyen dürüst borçlunun, alacaklılarıyla anlaşarak iflastan kurtulmasını sağlayan hukuki bir çözüm yoludur.

## Konkordato Süreci Aşamaları
1. **Tebliğ ve Talep:** Proje ile mahkemeye başvuru.
2. **Geçici Mühlet:** 3 aylık koruma süresi ve komiser ataması.
3. **Kesin Mühlet:** 1 yıllık (uzatılabilir) detaylı inceleme süreci.
4. **Tasdik:** Alacaklıların onayı ve mahkeme kararıyla projenin kesinleşmesi.

## Şirketler İçin Avantajları
- İcra takiplerinin durması ve haciz koruması.
- Borçların vadeye yayılması veya indirilmesi.
- Şirketin faaliyetlerini sürdürerek istihdamı koruması.

## Sonuç
Mali krizlerin başında yapılan başvurular ve gerçekçi iyileştirme projeleri konkordatonun başarı şansını artırır.
    `
  }
];
