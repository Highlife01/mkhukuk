import React from 'react';
import { 
  Layout, MessageCircle, FileText, Users, 
  Calendar, BookOpen, Globe, Search, 
  BarChart3, Settings, LogIn, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navItems = [
    { id: 'dashboard', label: t('dashboard.tabs.overview'), icon: <Layout size={18} />, section: 'Genel' },
    { id: 'messages', label: 'Gelen Mesajlar', icon: <MessageCircle size={18} />, section: 'Genel', badgeColor: 'bg-emerald-500 text-white' },
    { id: 'chatbot', label: t('dashboard.tabs.chatbot'), icon: <MessageCircle size={18} />, section: 'Genel', badge: 3 },
    { id: 'cases', label: t('dashboard.tabs.cases'), icon: <Scale size={18} />, section: 'Hukuk', badge: 12, badgeColor: 'bg-[#d4af37] text-[#0f1e3d]' },
    { id: 'clients', label: t('dashboard.tabs.clients'), icon: <Users size={18} />, section: 'Hukuk' },
    { id: 'team', label: t('dashboard.tabs.team'), icon: <Users size={18} />, section: 'Hukuk' },
    { id: 'appointments', label: t('dashboard.tabs.appointments'), icon: <Calendar size={18} />, section: 'Hukuk' },
    { id: 'documents', label: t('dashboard.tabs.documents'), icon: <BookOpen size={18} />, section: 'Hukuk' },
    { id: 'website', label: t('dashboard.tabs.website'), icon: <Globe size={18} />, section: 'Site Yönetimi' },
    { id: 'service-pages', label: 'Hizmet Sayfaları', icon: <Globe size={18} />, section: 'Site Yönetimi' },
    { id: 'blog', label: t('dashboard.tabs.blog'), icon: <FileText size={18} />, section: 'Site Yönetimi', badge: 2, badgeColor: 'bg-[#d4af37] text-[#0f1e3d]' },
    { id: 'decisions', label: 'Mahkeme Kararları', icon: <Scale size={18} />, section: 'Site Yönetimi' },
    { id: 'seo', label: t('dashboard.tabs.seo'), icon: <Search size={18} />, section: 'Site Yönetimi' },
    { id: 'finance', label: t('dashboard.tabs.finance'), icon: <BarChart3 size={18} />, section: 'Finans' },
    { id: 'management', label: t('dashboard.tabs.management'), icon: <Settings size={18} />, section: 'Ayarlar' },
  ];

  const sections = ['Genel', 'Hukuk', 'Site Yönetimi', 'Finans', 'Ayarlar'];

  return (
    <aside className="w-[240px] bg-[#0f1e3d] flex flex-col fixed left-0 top-0 bottom-0 z-[100] overflow-hidden border-r border-[rgba(201,168,76,0.15)] shadow-2xl">
      <div className="p-6 border-b border-[rgba(201,168,76,0.15)]">
        <Link to="/" className="flex flex-col group">
          <div className="w-10 h-10 bg-[#c9a84c] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Scale size={22} className="text-[#0f1e3d]" />
          </div>
          <span className="font-display text-[15px] font-bold text-white leading-tight tracking-tight uppercase">Av. Mahmut Kaya</span>
          <span className="text-[9px] text-[#c9a84c] font-black uppercase tracking-[2px] mt-1 opacity-80">Hukuk & Danışmanlık</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar px-3">
        {sections.map((section) => (
          <div key={section} className="mb-6">
            <span className="text-[9px] font-black uppercase tracking-[1.5px] text-[#c9a84c]/50 px-3 mb-3 block">
              {section}
            </span>
            <div className="space-y-1">
              {navItems.filter(item => item.section === section).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                    activeTab === item.id 
                      ? 'bg-[rgba(201,168,76,0.12)] text-[#f1e5ac] border-l-2 border-[#c9a84c] rounded-l-none -ml-[2px]' 
                      : 'text-white/60 hover:bg-[rgba(201,168,76,0.05)] hover:text-white'
                  }`}
                >
                  <span className={`${activeTab === item.id ? 'text-[#c9a84c]' : 'text-white/30 group-hover:text-white/70'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-bold ${item.badgeColor || 'bg-[#e24b4a] text-white'} shadow-sm`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-5 border-t border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.02)]">
        <div className="flex items-center gap-3 p-2 bg-[rgba(255,255,255,0.03)] rounded-2xl border border-white/5">
          <div className="w-9 h-9 bg-[#c9a84c] rounded-xl flex items-center justify-center font-bold text-[14px] text-[#0f1e3d] shadow-inner">
            MK
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-[13px] font-bold text-white truncate">Av. Mahmut Kaya</div>
            <div className="text-[10px] text-[#c9a84c]/70 font-medium truncate uppercase tracking-wider">Kurucu Ortak</div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Çıkış Yap"
          >
            <LogIn size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
