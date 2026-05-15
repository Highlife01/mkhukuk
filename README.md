# Hukuk Rehberi Plus

## Proje Bilgisi

Bu proje Hukuk Rehberi Plus için geliştirilmiş bir web uygulamasıdır.

## Nasıl Düzenleyebilirim?

Tercih ettiğiniz IDE'yi kullanarak yerel olarak çalışabilirsiniz.

**Gereksinimler:**
Node.js ve npm yüklü olmalıdır.

**Kurulum Adımları:**

```sh
# Adım 1: Bağımlılıkları yükleyin.
npm install

# Adım 2: Geliştirme sunucusunu başlatın.
npm run dev
```

## Kullanılan Teknolojiler

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🌟 Son Güncellemeler ve Geliştirmeler (Changelog)

**✅ 1. Tam Çeviri (Multi-Language) Entegrasyonu**
- Hizmetler, İletişim, Hakkımızda ve Alt Bilgi alanlarındaki tüm kaba metinler (hardcoded strings) `t()` fonksiyonu ile i18n altyapısına aktarıldı.
- Çeviri scripti, JSON anahtarlarını düzgün okuyup diğer dillere hatasız basacak hale getirildi.

**✅ 2. Ana Sayfa "Hero" Animasyonu ve Görselleri**
- Ana sayfaya boş yazı veya düz renk görünümü yerine, 3 adet hukuk konseptli, lüks (premium) yapay zeka ile üretilmiş görseller konuldu.
- Her 5 saniyede bir otomatik dönen ve %75 şeffaflıkla gayet net görünen arka plan efekti eklendi.
- Üzerlerindeki "İngilizce sahte yazılar" tamamen silinip resimler sade formda tutuldu; böylece üstündeki HTML metinleri anında çoklu dile uyumlu çalışacak konuma geldi.

**✅ 3. Dashboard Erişim (Giriş) ve Veri Hataları**
- _"Giriş Başarılı, Dashboard'a yönlendiriliyorsunuz"_ dedikten sonra kullanıcıyı direkt Login ekranına geri atan "rol" (admin/auth) problemi, tüm yetkilendirme döngüleri iyileştirilerek düzeltildi.
- İzin (rule) kısıtlamasından kaynaklanan "Chatbot verisi alınamadı" hatası Firestore kuralları (firestore.rules) güncellenerek tamamen çözüldü.

**✅ 4. Yönetim Paneli Hata Çözümleri & İşlevsellik**
- **Blog Yönetimi:** Makaleleri sadece ekleme/silme haricinde sonradan tekrar panele yükleyip içeriğini değiştirmeye yarayan **"Düzenle"** butonu sistemi kodlandı.
- **Hizmet Sayfaları (Services):** `Globe` ikonunun import unutulmasından (React ölümcül hatası) paneli çökerten detay temizlendi, tam aktif çalışır duruma getirildi.
- **Web Sayfaları (Seeding):** Statik web sayfalarını tek tuşla veritabanına yedeklemek için "Varsayılanları Yükle" komutu geliştirildi.

**✅ 5. Dinamik İçerik Altyapısı (DynamicPage)**
- Panel üzerinden açılan web sayfalarının URL üzerinden okunabilmesi adına `App.tsx` içine **`/sayfa/:slug`** yönlendirmesi (Routing) eklendi. Markdown destekli dinamik `DynamicPage.tsx` bileşeni kuruldu.

**✅ 6. Sözlük / Veritabanı "Kod İsimli Yazı" Temizliği**
- `glossary.badge`, `database.readMore` gibi ham veya İngilizce çeviri kodu olarak ön ekranda patlayan bütün eksik anahtarlar (Sözlük, İhtiyaç, Kararlar vs.), `tr.json` sözlüğüne eksiksiz eklenerek "Hakiki Türkçe" formatlarına çekildi.

**✅ 7. Footer ve Hukuk Araçları**
- Sitenin taban menüsüne (footer) doğrudan kullanıcıların ve avukatların işini hızlandırması için **"Hesaplama Araçları"**, **"Vekalet Ücreti Hesaplama"** eklentileri yapıldı.

**✅ 8. Küresel Kurumsal "Playfair Display" Font Birliği**
- Ana sayfanın tepesindeki gösterişli serif/tırnaklı ("Playfair Display") yazı tipi, marka bütünlüğünü tamamlaması için sitenin alt sayfalarındaki bütün başlıklara (`h1`'den `h6`'ya kadar) başarıyla uygulandı. 
