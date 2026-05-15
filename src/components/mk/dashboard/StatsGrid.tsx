import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsGridProps {
  stats?: {
    label: string;
    value: string | number;
    sub: string;
    trend: 'up' | 'down';
    color?: string;
  }[];
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const computed = stats ?? [
    { label: 'Aktif Dava', value: '47', sub: '↑ 3 bu ay', trend: 'up', color: 'border-[#c9a84c]' },
    { label: 'Kazanılan Dava', value: '89%', sub: '↑ 2% geçen ay', trend: 'up', color: 'stat-success' },
    { label: 'Müvekkil', value: '243', sub: '↑ 8 yeni bu ay', trend: 'up', color: 'stat-info' },
    { label: 'Chatbot Sorgusu', value: '1.2K', sub: '↑ 15% bu hafta', trend: 'up', color: 'stat-danger' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {computed.map((stat, i) => {
        let barColor = '#c9a84c';
        let barOpacity = 'opacity-40';
        if (stat.color === 'stat-success') { barColor = '#1d9e75'; barOpacity = 'opacity-100'; }
        if (stat.color === 'stat-danger') { barColor = '#e24b4a'; barOpacity = 'opacity-100'; }
        if (stat.color === 'stat-info') { barColor = '#185fa5'; barOpacity = 'opacity-100'; }
        
        return (
          <div key={i} className="bg-white border border-[rgba(201,168,76,0.1)] rounded-2xl p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div 
              className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 ${barOpacity} group-hover:opacity-100`}
              style={{ backgroundColor: barColor }}
            ></div>
            <div className="text-[10px] text-[#6b7280] uppercase tracking-[1px] font-black mb-2 opacity-70">{stat.label}</div>
            <div className="font-display text-[26px] font-bold text-[#0f1e3d] leading-none mb-3">{stat.value}</div>
            <div className="text-[11px] text-[#9ca3af] flex items-center gap-1.5 font-bold uppercase tracking-tight">
              <span className={stat.trend === 'up' ? 'text-[#1d9e75]' : 'text-[#e24b4a]'}>
                {stat.trend === 'up' ? '↑' : '↓'} {stat.sub.split(' ')[1]}
              </span>
              <span className="opacity-60">{stat.sub.split(' ').slice(2).join(' ')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
