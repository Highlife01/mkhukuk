import React from 'react';
import { useTranslation } from 'react-i18next';
import { Database } from 'lucide-react';

interface Decision {
  id: number;
  title: string;
  year: number;
  category: string;
}

interface DatabaseViewProps {
  decisions: Decision[];
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ decisions }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 text-amber px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4 font-body">
          <Database size={14} /> {t('database.badge')}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-foreground">{t('database.title')}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-amber to-amber-dark mx-auto mt-6 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {decisions.map((d) => (
          <div key={d.id} className="bg-card p-7 rounded-[1.5rem] border border-border/60 shadow-card hover:shadow-card-hover hover:border-amber/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] bg-amber/10 text-amber font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider font-body">{d.category}</span>
              <span className="text-muted-foreground text-xs font-medium font-body">{d.year}</span>
            </div>
            <h3 className="font-black mb-3 text-foreground text-lg leading-snug">{d.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-5 font-body leading-relaxed">—</p>
            <button className="text-amber font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all font-body">
              {t('database.readMore')} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatabaseView;
