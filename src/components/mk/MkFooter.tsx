import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scale, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const MkFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0a0e1a] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="bg-amber p-2.5 rounded-xl group-hover:scale-110 transition-all duration-500 shadow-lg shadow-amber/40">
                  <Scale className="text-[#0a0e1a] w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white text-[#0a0e1a] text-[8px] font-black px-1 rounded-sm border border-amber/30">MK</div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter text-white font-display group-hover:text-amber transition-colors">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] text-amber/80 uppercase tracking-[0.3em] font-black -mt-1">
                  {t('brand.subtitle')}
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-white/35">
              <a href="mailto:info@avmahmutkaya.com.tr" className="flex items-center gap-2 hover:text-amber transition-colors">
                <Mail size={14} className="text-amber/60" /> info@avmahmutkaya.com.tr
              </a>
              <a href="tel:+905322026799" className="flex items-center gap-2 hover:text-amber transition-colors">
                <Phone size={14} className="text-amber/60" /> +90 (532) 202 67 99
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber/60" /> Ankara, Türkiye
              </div>
            </div>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white/50">
              {t('footer.corporate')}
            </h4>
            <ul className="space-y-3.5 text-sm text-white/40">
              <li><Link to="/hakkimizda" className="hover:text-amber transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/hizmetler" className="hover:text-amber transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/blog" className="hover:text-amber transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/iletisim" className="hover:text-amber transition-colors">{t('footer.legal')}</Link></li>
              <li><Link to="/yargitay-kararlari" className="hover:text-amber transition-colors">Yargıtay Kararları</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white/50">
              Hukuki Araçlar
            </h4>
            <ul className="space-y-3.5 text-sm text-white/40">
              <li><Link to="/araclar" className="hover:text-amber transition-colors text-amber-light font-bold">Hesaplama Araçları</Link></li>
              <li><Link to="/araclar?tool=vekalet-ucreti" className="hover:text-amber transition-colors">Vekalet Ücreti Hesapla</Link></li>
              <li><Link to="/rehber" className="hover:text-amber transition-colors">İcra Rehberi</Link></li>
              <li><Link to="/sozluk" className="hover:text-amber transition-colors">Hukuk Sözlüğü</Link></li>
              <li><Link to="/ai-asistan" className="hover:text-amber transition-colors flex items-center gap-1">AI Hukuk Asistanı <ArrowUpRight size={12} /></Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white/50">
              {t('footer.newsletter')}
            </h4>
            <p className="text-sm mb-5 text-white/35 leading-relaxed">
              {t('footer.newsletterDesc')}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm w-full text-white placeholder:text-white/25 focus:ring-2 focus:ring-amber/40 outline-none transition"
              />
              <button className="bg-amber hover:bg-amber-dark text-white px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} {t('footer.rights')}</p>
          <div className="flex gap-8 text-xs text-white/25">
            <span className="hover:text-amber cursor-pointer transition-colors">{t('footer.privacy')}</span>
            <span className="hover:text-amber cursor-pointer transition-colors">{t('footer.terms')}</span>
            <span className="hover:text-amber cursor-pointer transition-colors">{t('footer.kvkk')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MkFooter;
