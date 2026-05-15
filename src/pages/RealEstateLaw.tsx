import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Key, Shield, FileText, Gavel, CheckCircle, Scale, Search, PenTool, Building } from 'lucide-react';

const RealEstateLaw = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Tapu ve Kayıt İncelemesi",
      desc: "Taşınmazın üzerindeki ipotek, haciz ve şerhlerin detaylı analizi ve mülkiyet doğrulama süreçleri.",
      items: ["Mülkiyet Durumu Kontrolü", "Vekaletname Geçerlilik Analizi", "Kısıtlamaların Tespiti"]
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Sözleşme Yönetimi",
      desc: "Alım-satım, satış vaadi ve kat karşılığı inşaat sözleşmelerinin hukuki zeminde hazırlanması.",
      items: ["Gayrimenkul Satış Vaadi", "Kira Sözleşmeleri", "Eser Sözleşmeleri"]
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "İmar ve Yapı Hukuku",
      desc: "İmar planı değişiklikleri, yapı ruhsatları ve iskan süreçlerinde profesyonel danışmanlık.",
      items: ["İmar Barışı Başvuruları", "Yapı Ruhsatı Süreçleri", "Cins Tashihi İşlemleri"]
    },
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Gayrimenkul Davaları",
      desc: "Tapu iptal tescil, müdahalenin men'i ve ortaklığın giderilmesi (izale-i şuyu) davaları.",
      items: ["Tapu İptal ve Tescil", "Tahliye Davaları", "Ecrimisil Talepleri"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 text-amber px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 font-body">
          <Home size={14} /> Gayrimenkul Hukuku Uzmanlığı
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 font-display leading-tight">
          Gayrimenkul Yatırımlarınızı <br />
          <span className="gradient-text">Hukuki Güvence Altına Alın</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body">
          Türkiye'nin karmaşık gayrimenkul mevzuatında, uzman avukat kadromuzla alım-satım, kiralama ve inşaat süreçlerinizin her adımında yanınızdayız.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {services.map((service, index) => (
          <div key={index} className="bg-card p-10 rounded-[2.5rem] border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-500 group">
            <div className="bg-amber/10 w-16 h-16 rounded-2xl flex items-center justify-center text-amber mb-8 group-hover:bg-amber group-hover:text-amber-foreground transition-all duration-300">
              {service.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-foreground font-display">{service.title}</h3>
            <p className="text-muted-foreground mb-8 font-body leading-relaxed">{service.desc}</p>
            <div className="space-y-3">
              {service.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-foreground font-body">
                  <CheckCircle size={16} className="text-amber" /> {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Warning Section */}
      <div className="bg-nav rounded-[3rem] p-10 md:p-16 text-nav-foreground relative overflow-hidden shadow-nav">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-black mb-6 font-display leading-tight">Gayrimenkul Alırken <br /><span className="text-amber">Dikkat Edilmesi Gerekenler</span></h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber flex-shrink-0 font-display font-bold">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Tapu Kaydı Tetkiki</h4>
                  <p className="text-sm text-nav-foreground/60 leading-relaxed font-body">Üzerinde haciz, ipotek veya aile konutu şerhi olup olmadığı mutlaka kontrol edilmelidir.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber flex-shrink-0 font-display font-bold">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">İmar ve Ruhsat Kontrolü</h4>
                  <p className="text-sm text-nav-foreground/60 leading-relaxed font-body">Yapının ruhsatına uygunluğu ve belediye nezdinde herhangi bir yıkım kararı bulunmadığı teyit edilmelidir.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber flex-shrink-0 font-display font-bold">3</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Sözleşme Denetimi</h4>
                  <p className="text-sm text-nav-foreground/60 leading-relaxed font-body">Noter huzurunda yapılmayan satış vaadi sözleşmelerinin geçersiz olabileceği unutulmamalıdır.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-96 bg-card/5 backdrop-blur-sm border border-nav-foreground/10 p-8 rounded-[2rem] text-center">
            <Scale size={48} className="text-amber mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4 font-display">Hukuki Danışmanlık Alın</h3>
            <p className="text-sm text-nav-foreground/50 mb-8 leading-relaxed font-body">Gayrimenkul hukuku telafisi güç zararların doğabileceği bir alandır. Yatırım yapmadan önce avukatımıza danışın.</p>
            <button className="w-full bg-amber text-amber-foreground py-4 rounded-xl font-bold hover:bg-amber-light transition-all shadow-amber">
              Ücretsiz Ön Görüşme Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateLaw;
