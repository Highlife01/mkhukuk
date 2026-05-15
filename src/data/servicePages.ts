export interface ServicePage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  faq?: Array<{ question: string; answer: string }>;
}

export const servicePages: ServicePage[] = [
  {
    slug: 'icra-ve-iflas-hukuku',
    title: 'İcra ve İflas Hukuku',
    description: 'İcradan tahsilat, haciz, takip ve iflas süreçlerinde uzman hukuki destek.',
    intro: 'İcra ve iflas süreci, hem alacaklılar hem borçlular için kritik hukukî sonuçlar doğurur. Biz bu süreçleri önleyici ve sonuç odaklı bir şekilde yönetiriz.',
    sections: [
      {
        title: 'Hangi Hizmetleri Sunuyoruz?',
        content: '- İlamlı / ilamsız takip\n- Haciz ve satış işlemleri\n- Menfi tespit davaları\n- İtiraz ve şikayet süreçleri\n- İcra dosyası yönetimi'
      },
      {
        title: 'Kimler İçin?',
        content: '- Alacaklı şirketler ve kişisel alacak sahipleri\n- Borçlu gerçek kişi ve kurumlar\n- Gayrimenkul yatırımcıları\n- Müvekkil portföyünü korumak isteyen ticaret şirketleri'
      },
      {
        title: 'Nasıl Çalışıyoruz?',
        content: '1. Ön değerlendirme ve dosya incelemesi\n2. Risk analizi ve ödeme planı önerisi\n3. Hukuki süreç takibi ve raporlama\n4. Hacizli mallar için satış / rızaen satış yönlendirmesi'
      }
    ],
    faq: [
      {
        question: 'İcra takibine itiraz süresi ne kadardır?',
        answer: 'İtiraz süresi genellikle tebliğ tarihinden itibaren 7 gündür. Süre aşıldığında itiraz hakkı kısıtlanabilir.'
      },
      {
        question: 'Hacizli taşınmaz nasıl satın alınır?',
        answer: 'Hacizli taşınmaz alımında vergi, harç, şerh kontrolü yapıp satış ihalesine katılmak gerekir. Detaylı süreç için uzman ekibimizle görüşün.'
      }
    ]
  },
  {
    slug: 'gayrimenkul-hukuku',
    title: 'Gayrimenkul Hukuku',
    description: 'Tapu, kira, tahliye, ortaklık ve taşınmaz uyuşmazlıklarında hukuki destek.',
    intro: 'Gayrimenkul işlemlerinde yapılacak en küçük hata bile büyük kayıplara yol açar. Hukuki süreçleri hızlı ve güvenli yönetiyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Tapu iptal ve tescil davaları\n- Ortaklığın giderilmesi davaları\n- Kira uyuşmazlıkları ve tahliye\n- Kat karşılığı sözleşme hukuku\n- Ecrimisil ve tespit davaları'
      },
      {
        title: 'Değer Katan Yaklaşım',
        content: 'Her dosyada önce risk analizi yapar, sonra çözüm stratejisi belirleriz. Amacımız hızlı sonuç ve minimum masraf.'
      }
    ],
    faq: [
      {
        question: 'Tapu iptal davası ne kadar sürer?',
        answer: 'Genel olarak 1-2 yıl sürebilir; ancak dava dosyasına göre bu süre kısalabilir veya uzayabilir.'
      },
      {
        question: 'Kira sözleşmesi olmadan tahliye mümkün mü?',
        answer: 'Evet, kiracının hukuka aykırı davranışı (tahliye taahhüdü vb.) tahliye nedeni olabilir.'
      }
    ]
  },
  {
    slug: 'aile-hukuku',
    title: 'Aile Hukuku',
    description: 'Boşanma, velayet, nafaka, mal paylaşımı ve aile uyuşmazlıklarında hukuki destek.',
    intro: 'Aile hukuku, hem duygusal hem de mali açıdan hassas süreçleri kapsar. Size empatiyle yaklaşan hukuk ekibimizle çözüm üretiriz.',
    sections: [
      {
        title: 'Sunulan Hizmetler',
        content: '- Boşanma davaları\n- Nafaka ve velayet\n- Mal paylaşımı ve tazminatlar\n- Koruma ve uzaklaştırma talepleri'
      },
      {
        title: 'Nasıl Çalışıyoruz',
        content: 'Önce durumunuzu dinliyoruz, ardından hukuki strateji ve en hızlı çözüme odaklanan bir plan sunuyoruz.'
      }
    ],
    faq: [
      {
        question: 'Boşanma davası ne kadar sürer?',
        answer: 'Dosyanın durumuna bağlı olarak 1-2 yılı bulabilir; anlaşmalı süreçler daha kısa sürebilir.'
      },
      {
        question: 'Nafaka nasıl hesaplanır?',
        answer: 'Gelir, yaşam standartları ve ihtiyaçlar dikkate alınarak adil bir nafaka talebi hazırlanır.'
      }
    ]
  },
  {
    slug: 'ceza-hukuku',
    title: 'Ceza Hukuku',
    description: 'Suç soruşturmaları ve davalarında savunma, itiraz ve beraat stratejileri.',
    intro: 'Ceza hukuku süreçleri kritik olup zamanında müdahale gerektirir. Deneyimli savunma ekibimizle süreci güçlendiriyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Tutukluluk itirazları\n- İddianame incelemesi\n- Savunma stratejileri\n- Ceza infazı takipleri'
      },
      {
        title: 'Süreci Nasıl Yönlendiriyoruz?',
        content: 'Hukuki savunmayı erken başlatmak için ifadelerinizi ve delilleri titizlikle değerlendiriyoruz.'
      }
    ],
    faq: [
      {
        question: 'Hakkınızda gözaltına alındığında ne yapmalısınız?',
        answer: 'Hemen bir avukatla görüşün, susma hakkınızı kullanın ve işlemlerin doğru tutulmasını sağlayın.'
      },
      {
        question: 'Ceza mahkemelerinde itiraz süreleri nasıldır?',
        answer: 'Genellikle karar tebliğinden itibaren 15 gün içinde itiraz (tayin) yapılmalıdır.'
      }
    ]
  },
  {
    slug: 'tuketici-hukuku',
    title: 'Tüketici Hukuku',
    description: 'Tüketici hakları, ayıplı mal ve hizmet, cayma ve tüketici davalarında danışmanlık.',
    intro: 'Tüketici haklarınızı korumak için hukuki destek sağlıyoruz; mağduriyetlerinizi tazmin etmek ve hakkınızı almak için yanınızdayız.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Ayıplı mal/hizmet davaları\n- Cayma, iade ve tazminat\n- Tüketici hakem heyeti başvuruları\n- Uyuşmazlık çözümü ve tahkim'
      },
      {
        title: 'Nasıl Destek Veriyoruz?',
        content: 'Dosya incelemesi sonrası haklarınızı belirleyip, gerektiğinde resmi başvuruları ve dava süreçlerini yönetiyoruz.'
      }
    ],
    faq: [
      {
        question: 'Ayıplı ürün iadesinde ne kadar süre var?',
        answer: 'Ayıplı ürün bildiriminde 30 gün içinde satıcıya bildirim yapılmalıdır; sonrasında hukuki süreç başlatılabilir.'
      },
      {
        question: 'Haksız ticari uygulama davası nedir?',
        answer: 'Tüketicinin korunmasını amaçlayan kanun çerçevesinde, yanıltıcı reklam veya haksız uygulamaya karşı açılan davalardır.'
      }
    ]
  },
  {
    slug: 'vergi-hukuku',
    title: 'Vergi Hukuku',
    description: 'Vergi davaları, ceza ihbarnameleri, vergi incelemeleri ve itiraz süreçlerinde destek.',
    intro: 'Vergi hukuku alanında uzman kadromuzla, vergi yargı süreçlerinde en etkin stratejileri uyguluyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Vergi inceleme ve tarhiyat itirazları\n- Vergi ceza davaları\n- Vergi mahkemesi süreçleri\n- Vergi planlama ve uyum danışmanlığı'
      },
      {
        title: 'Yaklaşımımız',
        content: 'Öncelikle mali verilerinizi değerlendirir, mümkünse uzlaşma ve indirim seçeneklerini kullanır, dava sürecini etkin takip ederiz.'
      }
    ],
    faq: [
      {
        question: 'Vergi cezasına itiraz süresi nedir?',
        answer: 'Genel olarak tebliğ tarihinden itibaren 30 gün içinde vergi mahkemesine dava açılmalıdır.'
      },
      {
        question: 'Vergi denetimine nasıl hazırlanmalıyım?',
        answer: 'Belge ve kayıtlarınızı düzenleyip, uzman bir ekip eşliğinde açıklama hazırlamak en doğru yaklaşımdır.'
      }
    ]
  },
  {
    slug: 'idare-hukuku',
    title: 'İdare Hukuku',
    description: 'İdari işlemlere itiraz, idari yargı, kamu sözleşmeleri ve kamulaştırma davalarında destek.',
    intro: 'Kamu kurumlarıyla olan ilişkinizde idari prosedürleri ve dava süreçlerini size özel yönetiyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- İdari davalar\n- İtiraz ve şikayet süreçleri\n- Kamu ihale uyuşmazlıkları\n- Kamulaştırma ve tazminat davaları'
      },
      {
        title: 'Çalışma Modelimiz',
        content: 'İdari süreçlere yönelik hızlı ve etkili başvuru yolu belirler, gerekirse dava sürecini yürütürüz.'
      }
    ],
    faq: [
      {
        question: 'Kamu ihale kararına nasıl itiraz edilir?',
        answer: 'İhale sürecine yönelik itiraz genellikle idare mahkemesine 30 gün içinde yapılır.'
      },
      {
        question: 'Kamulaştırma tazminatı nasıl hesaplanır?',
        answer: 'Kamulaştırılan taşınmazın rayiç değeri, kullanım amacı ve zararın kapsamına göre hesaplanır.'
      }
    ]
  },
  {
    slug: 'sozlesme-hukuku',
    title: 'Sözleşme Hukuku',
    description: 'Sözleşme hazırlama, inceleme ve ihtilaf çözümü konusunda tüm hukuki süreçleri yönetiyoruz.',
    intro: 'Sözleşmeler, iş ilişkisinin temelidir; yanlış bir madde mali riskleri artırabilir. Biz size güvenli ve profesyonel sözleşme desteği sağlıyoruz.',
    sections: [
      {
        title: 'Neler Sağlıyoruz?',
        content: '- Sözleşme hazırlığı ve revizyonu\n- Sözleşme müzakeresi ve pazarlık\n- Sözleşme feshi ve tazminat talepleri\n- Uyuşmazlık çözümünde arabuluculuk ve dava süreçleri'
      },
      {
        title: 'Neden Biz?',
        content: 'Her sektörü ve iş modelini anlamaya çalışarak sözleşmenizi titizlikle ele alır, riskleri minimize ederiz.'
      }
    ],
    faq: [
      {
        question: 'Sözleşmede hangi maddelere dikkat etmeliyim?',
        answer: 'Teslim süresi, ödeme koşulları, gecikme faizleri, ceza şartları ve fesih mekanizmaları en kritik bölümlerdir.'
      },
      {
        question: 'Sözleşme nasıl iptal edilir?',
        answer: 'Taraflar arasında mutabakat veya sözleşmede öngörülen fesih şartlarına bağlı olarak yapılır; dava yoluyla iptal de mümkün olabilir.'
      }
    ]
  },
  {
    slug: 'sirketler-hukuku',
    title: 'Şirketler Hukuku',
    description: 'Şirket kuruluşu, ortaklık sözleşmeleri, yönetim ve birleşme/devralma süreçlerinde hukuki destek.',
    intro: 'Şirket yapınızı güçlendirmek ve hukuki riskleri azaltmak için bütüncül bir şirketler hukuku danışmanlığı sunuyoruz.',
    sections: [
      {
        title: 'Temel Hizmetler',
        content: '- Şirket kuruluşu ve tescil işlemleri\n- Pay devri ve ortaklık sözleşmeleri\n- Yönetim kurulu ve temsil yetkileri\n- Birleşme, devralma ve tasfiye süreçleri'
      },
      {
        title: 'Nasıl Destek Sağlıyoruz?',
        content: 'Her aşamada hukuki uyum ve yükümlülükleri değerlendirir, işlemleri hızlandırmak için koordinasyonu sağlarız.'
      }
    ],
    faq: [
      {
        question: 'Şirket türü seçerken nelere dikkat edilmelidir?',
        answer: 'Sermaye, sorumluluk yapısı, faaliyet alanı ve vergi yükümlülükleri ana kriterlerdir; doğru yapı için analiz gerekir.'
      },
      {
        question: 'Ortaklar arasında anlaşmazlık çıkarsa ne yapılmalı?',
        answer: 'Önce iç sözleşme ve tüzük hükümlerine bakılır, arabuluculuk ya da dava süreci seçenekleri değerlendirilir.'
      }
    ]
  },
  {
    slug: 'fikri-mulkiyet-hukuku',
    title: 'Fikri Mülkiyet Hukuku',
    description: 'Marka, patent, tasarım ve telif haklarında tescil, takip ve ihlal süreçlerinde uzmanlık.',
    intro: 'Yaratıcı çalışmalarınızın hukuki güvenliğini sağlamak için fikri mülkiyet haklarının korunmasında profesyonel destek sağlıyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Marka, patent ve tasarım tescil destekleri\n- İhlal ve itiraz süreçleri\n- Lisans, devir ve kullanım sözleşmeleri\n- İnternet üzerinden marka/alan adı ihlallerine müdahale'
      },
      {
        title: 'Neden Önemli?',
        content: 'Fikri mülkiyet hakkı, işinizin değerini korur; zamanında tescil ve takip, hak kaybını önler.'
      }
    ],
    faq: [
      {
        question: 'Marka tescili ne kadar sürer?',
        answer: 'Başvurudan sonra yaklaşık 12-18 ay sürebilir; süreçte itirazlar süreyi etkileyebilir.'
      },
      {
        question: 'Patent ile faydalı model arasındaki fark nedir?',
        answer: 'Patent daha yüksek yenilik ve buluş basamağı gerektirirken, faydalı model daha kısa süreli ve daha kolay tescil edilebilir bir koruma sağlar.'
      }
    ]
  },
  {
    slug: 'is-hukuku',
    title: 'İş ve Sosyal Güvenlik Hukuku',
    description: 'İşçi ve işveren hakları, tazminat davaları ve iş sözleşmeleri yönetimi.',
    intro: 'Çalışma hayatındaki uyuşmazlıkları yasal çerçevede adil bir şekilde çözüme kavuşturuyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Kıdem ve ihbar tazminatı alacakları\n- İşe iade davaları\n- Mobbing ve kötüniyet tazminatı\n- İş sözleşmelerinin hazırlanması ve denetimi'
      }
    ]
  },
  {
    slug: 'bilisim-hukuku',
    title: 'Bilişim ve Teknoloji Hukuku',
    description: 'E-ticaret, siber suçlar, yazılım lisansları ve KVKK uyum süreçleri.',
    intro: 'Dijitalleşen dünyada teknoloji odaklı hukuki risklerinizi yönetiyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- İnternet üzerinden işlenen suçlar\n- Yazılım ve teknoloji sözleşmeleri\n- Unutulma hakkı başvuruları\n- Sosyal medya içerik kaldırma talepleri'
      }
    ]
  },
  {
    slug: 'saglik-hukuku',
    title: 'Sağlık ve İlaç Hukuku',
    description: 'Tıbbi malpraktis davaları, hasta hakları ve ilaç mevzuatı danışmanlığı.',
    intro: 'Sağlık sektöründeki hukuki uyuşmazlıklarda uzman danışmanlık sağlıyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Hekim ve hastane sorumluluk davaları\n- İlaç patentleri ve ruhsatlandırma\n- Hasta hakları ihlalleri\n- Sağlık turizmi hukuki altyapısı'
      }
    ]
  },
  {
    slug: 'sigorta-hukuku',
    title: 'Sigorta Hukuku',
    description: 'Tazminat talepleri, rücu davaları ve sigorta poliçe uyuşmazlıkları.',
    intro: 'Sigorta sözleşmelerinden kaynaklanan haklarınızı en etkin şekilde savunuyoruz.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- Trafik kazası tazminatları\n- Kasko ve hayat sigortası uyuşmazlıkları\n- Sigorta tahkim komisyonu başvuruları\n- Rücu davaları takibi'
      }
    ]
  },
  {
    slug: 'enerji-hukuku',
    title: 'Enerji ve Altyapı Hukuku',
    description: 'Enerji projeleri, lisanslama ve altyapı yatırımları hukuki desteği.',
    intro: 'Enerji sektöründeki karmaşık mevzuat ve yatırım süreçlerinde yanınızdayız.',
    sections: [
      {
        title: 'Hizmetlerimiz',
        content: '- EPDK lisans süreçleri\n- Yenilenebilir enerji projeleri\n- Maden ve petrol hukuku\n- Enerji santrali yatırım danışmanlığı'
      }
    ]
  }
];
