import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

export type ChartPoint = {
  name: string;
  value: number;
};

interface DashboardChartsProps {
  revenueSeries: ChartPoint[];
  clientGrowthSeries: ChartPoint[];
  winLossSeries: ChartPoint[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ revenueSeries, clientGrowthSeries, winLossSeries }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0f1e3d]">Aylık Gelir Grafiği</h3>
          <span className="text-xs text-[#6b7280]">TRY</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} />
              <Line type="monotone" dataKey="value" stroke="#c9a84c" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0f1e3d]">Kazanma / Kaybetme Oranı</h3>
          <span className="text-xs text-[#6b7280]">% olarak</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={winLossSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
              <Bar dataKey="win" fill="#1d9e75" />
              <Bar dataKey="loss" fill="#e24b4a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#c9a84c]/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0f1e3d]">Müvekkil Artışı</h3>
          <span className="text-xs text-[#6b7280]">Aylık</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clientGrowthSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => value.toString()} />
              <Line type="monotone" dataKey="value" stroke="#185fa5" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
