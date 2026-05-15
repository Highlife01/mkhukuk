import React from 'react';
import StatsGrid from './StatsGrid';
import DashboardCharts from './DashboardCharts';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DashboardStat, DashboardAppointment, DashboardActivity, DashboardChatbotConversation } from '../../../hooks/useDashboardData';

interface DashboardSummaryProps {
    stats: DashboardStat;
    appointments: DashboardAppointment[];
    activities: DashboardActivity[];
    conversations: DashboardChatbotConversation[];
    statsCards: any[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
    stats,
    appointments,
    activities,
    conversations,
    statsCards
}) => {
    const { t } = useTranslation();

    const revenueSeries = [
        { name: 'Ocak', value: Math.round(stats.totalRevenue * 0.12) },
        { name: 'Şub', value: Math.round(stats.totalRevenue * 0.15) },
        { name: 'Mar', value: Math.round(stats.totalRevenue * 0.13) },
        { name: 'Nis', value: Math.round(stats.totalRevenue * 0.18) },
        { name: 'May', value: Math.round(stats.totalRevenue * 0.14) },
        { name: 'Haz', value: Math.round(stats.totalRevenue * 0.16) },
        { name: 'Tem', value: Math.round(stats.totalRevenue * 0.12) },
    ];

    const clientGrowthSeries = [
        { name: 'Oca', value: 28 },
        { name: 'Şub', value: 32 },
        { name: 'Mar', value: 40 },
        { name: 'Nis', value: 45 },
        { name: 'May', value: 52 },
        { name: 'Haz', value: 61 },
        { name: 'Tem', value: 68 },
    ];

    const winLossSeries = [
        { name: 'Bu Ay', value: stats.winRate, win: stats.winRate, loss: 100 - stats.winRate },
        {
            name: 'Geçen Ay',
            value: Math.max(0, stats.winRate - 5),
            win: Math.max(0, stats.winRate - 5),
            loss: Math.min(100, 105 - stats.winRate),
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <StatsGrid stats={statsCards} />
            <DashboardCharts
                revenueSeries={revenueSeries}
                clientGrowthSeries={clientGrowthSeries}
                winLossSeries={winLossSeries}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dava Durumu */}
                <div className="bg-white border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
                        <h3 className="font-display font-semibold text-[#0f1e3d]">{t('dashboard.stats.activeCases')}</h3>
                        <span className="bg-[#0f1e3d] text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-tight">{t('dashboard.stats.activeCases')}</span>
                    </div>
                    <div className="p-6">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <div className="text-[11px] text-[#6b7280] font-bold mb-1 uppercase tracking-tight">Devam</div>
                                <div className="text-2xl font-bold text-[#0f1e3d]">{stats.activeCases}</div>
                                <div className="w-full bg-[#f0ece3] h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#c9a84c] h-full rounded-full" style={{ width: `${Math.min(100, stats.activeCases)}%` }}></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#6b7280] font-bold mb-1 uppercase tracking-tight">{t('dashboard.stats.wonCases')}</div>
                                <div className="text-2xl font-bold text-[#0f1e3d]">{stats.wonCases}</div>
                                <div className="w-full bg-[#f0ece3] h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#1d9e75] h-full rounded-full" style={{ width: `${Math.min(100, stats.wonCases)}%` }}></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] text-[#6b7280] font-bold mb-1 uppercase tracking-tight">{t('dashboard.stats.clients')}</div>
                                <div className="text-2xl font-bold text-[#0f1e3d]">{stats.clients}</div>
                                <div className="w-full bg-[#f0ece3] h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#e24b4a] h-full rounded-full" style={{ width: `${Math.min(100, stats.clients)}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[#c9a84c]/10">
                            <div className="text-[12px] text-[#6b7280] mb-2 font-medium">Son 6 aylık aktivite</div>
                            <div className="flex items-end gap-1.5 h-[60px]">
                                {[35, 55, 40, 70, 60, 90].map((h, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 bg-[#c9a84c] rounded-t-sm transition-all duration-500 ${i === 5 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                        style={{ height: `${h}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Randevular */}
                <div className="bg-white border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
                        <h3 className="font-display font-semibold text-[#0f1e3d]">Bugünkü Randevular</h3>
                        <span className="bg-[#1d9e75]/10 text-[#1d9e75] text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-tight">Canlı</span>
                    </div>
                    <div className="p-6 space-y-4">
                        {appointments.length > 0 ? appointments.map((appt, i) => (
                            <div key={i} className="flex items-center gap-4 pb-4 border-b border-[#c9a84c]/5 last:border-0 last:pb-0">
                                <div className={`w-2 h-2 rounded-full ${appt.color}`}></div>
                                <div className="w-12 text-center">
                                    <div className="text-[14px] font-bold text-[#0f1e3d] leading-none">{appt.time.split(':')[0]}</div>
                                    <div className="text-[10px] text-[#9ca3af] font-medium">:{appt.time.split(':')[1]}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-[13px] font-semibold text-[#0f1e3d] leading-tight">{appt.title}</div>
                                    <div className="text-[11px] text-[#6b7280] mt-0.5">{appt.client}</div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${appt.status === 'Bekliyor' ? 'bg-[#faeeda] text-[#854f0b]' :
                                    appt.status === 'Video' ? 'bg-[#e6f1fb] text-[#185fa5]' : 'bg-[#eaf3de] text-[#3b6d11]'
                                    }`}>
                                    {appt.status}
                                </span>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground py-10">Bugün için randevu bulunmuyor.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Alt Bölüm: Son Görüşmeler ve Aktivite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-[#c9a84c]/10 flex items-center justify-between">
                        <h3 className="font-display font-semibold text-[#0f1e3d]">Son Chatbot Görüşmeleri</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#1d9e75] rounded-full animate-pulse"></div>
                            <span className="text-[11px] text-[#1d9e75] font-bold uppercase tracking-tight">Canlı</span>
                        </div>
                    </div>
                    <div className="p-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest">
                                    <th className="px-5 py-3">Kullanıcı</th>
                                    <th className="px-5 py-3">Konu</th>
                                    <th className="px-5 py-3 text-right">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c9a84c]/5">
                                {conversations.length > 0 ? conversations.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#f8f5ef] transition-colors group">
                                        <td className="px-5 py-3 text-[13px] font-semibold text-[#0f1e3d]">{row.name}</td>
                                        <td className="px-5 py-3 text-[12px] text-[#6b7280]">{row.topic}</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-[#1d9e75]">{row.status}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">Görüşme bulunamadı.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-sm p-6">
                    <h3 className="font-display font-semibold text-[#0f1e3d] mb-4">Son Aktiviteler</h3>
                    <div className="space-y-4">
                        {activities.length > 0 ? activities.map((act, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="mt-1">
                                    {act.type === 'success' ? <CheckCircle2 size={14} className="text-[#1d9e75]" /> : act.type === 'info' ? <AlertCircle size={14} className="text-[#185fa5]" /> : <FileText size={14} className="text-[#c9a84c]" />}
                                </div>
                                <div>
                                    <div className="text-[12px] font-medium text-[#0f1e3d]">{act.text}</div>
                                    <div className="text-[10px] text-[#9ca3af] mt-0.5">{act.time}</div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground py-10">Aktivite bulunamadı.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;
