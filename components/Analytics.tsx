import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, ShieldCheck, Zap } from 'lucide-react';

interface HistoryItem {
  type: 'product' | 'room';
  timestamp: string;
  score: number;
  title: string;
}

export const Analytics: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('scangreen_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Prepare chart data from history
  const chartData = history.slice(-7).map((item, index) => ({
    label: `Scan ${index + 1}`,
    score: item.score,
    timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  // Fallback if no history
  const displayData = chartData.length > 0 ? chartData : [
    { label: 'Mon', score: 45 },
    { label: 'Tue', score: 52 },
    { label: 'Wed', score: 48 },
    { label: 'Thu', score: 65 },
    { label: 'Fri', score: 72 },
    { label: 'Sat', score: 85 },
    { label: 'Sun', score: 92 },
  ];

  const avgScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
    : 82;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Impact Analytics</h2>
          <p className="text-slate-500 font-medium">Tracking your journey to a plastic-free lifestyle.</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">LIVE UPDATES</span>
        </div>
      </div>

      {/* --- QUICK STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Eco-Score', value: `${avgScore}%`, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Items Scanned', value: history.length || '124', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Plastic Reduction', value: '+14%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Carbon Avoided', value: '2.4t', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] shadow-xl bg-white/80 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Sustainability Progress</h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last {displayData.length} Sessions</div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  hide
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 800, color: '#059669' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass-panel p-8 rounded-[2rem] shadow-xl bg-white/80 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Recent Scans</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {history.length > 0 ? (
              history.slice().reverse().map((item, i) => (
                <div key={i} className="flex items-start gap-4 animate-fade-in group">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform ${item.score > 70 ? 'bg-emerald-500' : item.score > 40 ? 'bg-amber-400' : 'bg-red-500'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 leading-none mb-1 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                      {item.type} • {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Package className="w-12 h-12 mb-2" />
                <p className="text-sm font-medium">No activity recorded yet.</p>
              </div>
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={() => { localStorage.removeItem('scangreen_history'); setHistory([]); }}
              className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
