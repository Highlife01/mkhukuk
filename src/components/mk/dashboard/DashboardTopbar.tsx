import React, { useState } from 'react';
import { 
  Bell, Search, Plus, 
  User, Settings, LogOut,
  Scale, FileText, MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  title: string;
  userEmail?: string;
  onAddClick?: (type: string) => void;
}

const DashboardTopbar: React.FC<TopbarProps> = ({ title, userEmail, onAddClick }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-[rgba(201,168,76,0.2)] h-[60px] flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-lg font-bold text-[#0f1e3d]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#f8f5ef] border border-[rgba(201,168,76,0.2)] rounded-lg px-3 py-1.5 w-64 focus-within:border-[#c9a84c] transition-all">
          <Search size={14} className="text-[#6b7280]" />
          <input 
            type="text" 
            placeholder="Ara..." 
            className="bg-transparent border-none outline-none text-xs text-[#1a1a2e] w-full font-medium"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-[rgba(201,168,76,0.15)] pl-4">
          <button className="w-9 h-9 border border-[rgba(201,168,76,0.2)] rounded-lg bg-[#f8f5ef] flex items-center justify-center text-[#6b7280] hover:text-[#c9a84c] hover:border-[#c9a84c] transition-all relative">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#e24b4a] rounded-full border border-white"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="bg-[#c9a84c] hover:bg-[#e2c97e] text-[#0f1e3d] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus size={14} strokeWidth={3} />
              Yeni Ekle
            </button>

            {showAddMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[rgba(201,168,76,0.2)] rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { onAddClick?.('case'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#0f1e3d] hover:bg-[#f8f5ef] flex items-center gap-3 transition-colors"
                  >
                    <Scale size={16} className="text-[#c9a84c]" />
                    Yeni Dava
                  </button>
                  <button 
                    onClick={() => { onAddClick?.('blog'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#0f1e3d] hover:bg-[#f8f5ef] flex items-center gap-3 transition-colors"
                  >
                    <FileText size={16} className="text-[#c9a84c]" />
                    Yeni Yazı
                  </button>
                  <button 
                    onClick={() => { onAddClick?.('appointment'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#0f1e3d] hover:bg-[#f8f5ef] flex items-center gap-3 transition-colors"
                  >
                    <MessageSquare size={16} className="text-[#c9a84c]" />
                    Yeni Randevu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
