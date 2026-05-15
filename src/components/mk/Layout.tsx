import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Scale, User, Menu, X, Sparkles, BookOpen, BookA,
  MessageSquare, Send, Building, Briefcase, Landmark,
  FileText, HelpCircle, MessageCircle, ChevronDown
} from 'lucide-react';
import MkFooter from '@/components/mk/MkFooter';
import LanguageSwitcher from '@/components/mk/LanguageSwitcher';
import WhatsAppAssistant from './WhatsAppAssistant';
import { getAiAssistantReply, AiChatMessage } from '@/lib/ai';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const navItems = [
    { key: '/', label: t('nav.home'), icon: <Landmark size={14} /> },
    { key: '/hakkimizda', label: t('nav.about'), icon: <Building size={14} /> },
    { key: '/hizmetler', label: t('nav.services'), icon: <Briefcase size={14} /> },
    { key: '/yayinlar', label: t('nav.blog'), icon: <FileText size={14} /> },
    { key: '/sss', label: t('nav.faq'), icon: <HelpCircle size={14} /> },
    { key: '/iletisim', label: t('nav.contact'), icon: <Send size={14} /> },
    { key: '/ai-asistan', label: t('nav.aiAssistant'), icon: <Sparkles size={14} /> },
  ];

  const isDashboard = location.pathname.startsWith('/dashboard');

  // Scroll detection for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (isDashboard) {
    return <>{children}</>;
  }

  const handleChatSend = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setChatLoading(true);

    try {
      const reply = await getAiAssistantReply([
        ...chatMessages,
        { role: 'user', content: trimmed },
      ]);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error?.message ||
            'AI asistanı yanıt verirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* ─── NAVIGATION ─── */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? 'top-4 w-[95%] lg:w-[85%] glass-card rounded-[2rem] py-3 shadow-2xl backdrop-blur-md bg-white/70 border border-white/20'
            : 'top-0 w-full bg-nav-solid py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-4 group perspective-1000"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <div className="bg-amber p-3 rounded-2xl group-hover:rotate-y-12 transition-all duration-500 shadow-xl shadow-amber/20 gold-shimmer">
                  <Scale className="text-nav w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white text-nav text-[9px] font-black px-1.5 py-0.5 rounded-lg border border-amber/30 shadow-sm">MK</div>
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-black tracking-tighter transition-colors font-display ${isScrolled ? 'text-nav' : 'text-white'} group-hover:text-amber`}>
                  MK <span className="text-amber">HUKUK</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.key}
                  className={`text-sm font-bold tracking-wide uppercase transition-all duration-300 hover:text-amber relative group ${
                    isScrolled ? 'text-nav/70' : 'text-white/80'
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-amber to-amber-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-amber/20 text-[13px]"
              >
                <User size={15} /> {t('nav.login')}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition text-white"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-nav border-t border-white/5 px-4 pb-5 pt-2 space-y-1 animate-slide-up">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.key}
                className={`block w-full text-left py-3 px-4 rounded-lg transition-all ${
                  location.pathname === item.key
                    ? 'text-amber bg-amber/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {item.icon} {item.label}
                </span>
              </Link>
            ))}
            <Link
              to="/dashboard"
              className="w-full bg-gradient-to-r from-amber to-amber-dark text-white px-4 py-3 rounded-lg font-semibold flex items-center gap-2 justify-center mt-3 shadow-sm text-sm"
            >
              <User size={16} /> {t('nav.login')}
            </Link>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-[72px]" />

      <main>{children}</main>

      {/* ─── Floating AI Chat ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAiOpen(!isAiOpen)}
          className="bg-gradient-to-r from-amber to-amber-dark text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-amber/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          {isAiOpen ? <X size={20} /> : <MessageSquare size={20} />}
        </button>
        {isAiOpen && (
          <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-card rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-scale-in">
            <div className="bg-nav p-5 text-white flex items-center gap-3">
              <div className="bg-amber/15 p-2 rounded-lg">
                <Sparkles className="text-amber" size={16} />
              </div>
              <div>
                <span className="font-semibold text-sm">{t('chat.title')}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/40 font-medium">{t('chat.online')}</span>
                </div>
              </div>
            </div>
            <div
              ref={chatScrollRef}
              className="h-72 p-5 overflow-y-auto bg-[#fafaf8] space-y-4"
            >
              {chatMessages.length === 0 ? (
                <div className="bg-white p-4 rounded-2xl rounded-tl-md text-sm text-foreground/80 shadow-sm border border-border/30 leading-relaxed">
                  {t('chat.welcome')}
                </div>
              ) : (
                chatMessages.map((m, index) => (
                  <div
                    key={`${m.role}-${index}`}
                    className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-amber/10 text-foreground rounded-tr-md'
                          : 'bg-white text-foreground/80 shadow-sm border border-border/30 rounded-tl-md'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
                  <span>{t('chat.typing') ?? 'Yazıyor...'}</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border/40 bg-white flex gap-2">
              <input
                type="text"
                placeholder={t('chat.placeholder')}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend(chatInput);
                  }
                }}
                className="flex-1 bg-[#f7f5f0] p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber/40 transition placeholder:text-muted-foreground"
              />
              <button
                disabled={chatLoading}
                onClick={() => handleChatSend(chatInput)}
                className="bg-gradient-to-r from-amber to-amber-dark p-3 rounded-xl text-white shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── WhatsApp Floating ─── */}
      <div className="fixed bottom-6 right-24 z-50">
        <button
          onClick={() => setShowWhatsApp(!showWhatsApp)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group ${
            showWhatsApp
              ? 'bg-slate-800 text-white rotate-90 scale-90'
              : 'bg-[#25d366] text-white hover:scale-105 shadow-green-500/20'
          }`}
        >
          {showWhatsApp ? <X size={20} /> : <MessageCircle size={22} />}
          {!showWhatsApp && (
            <span className="absolute bottom-full mb-3 right-0 bg-white text-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-semibold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border/40">
              WhatsApp Asistan
            </span>
          )}
        </button>
        {showWhatsApp && (
          <div className="absolute bottom-20 right-0 w-80 md:w-96 z-[110]">
            <WhatsAppAssistant onClose={() => setShowWhatsApp(false)} />
          </div>
        )}
      </div>

      <MkFooter />
    </div>
  );
};

export default Layout;
