import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';
import { TrendMetric } from '../types';

interface Props {
  metrics: TrendMetric[];
}

const colors = ['#38bdf8', '#8b5cf6', '#34d399'];

export function MetricsBoard({ metrics }: Props) {
  return (
    <section className="glass-panel p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Tendances de performance</h2>
          <span className="text-xs uppercase tracking-[0.35em] text-slate-400">30 derniers jours</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <div key={metric.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold text-white">{metric.name}</h3>
              <p className="text-xs uppercase text-slate-400">{metric.unit}</p>
              <div className="mt-3 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metric.data.map((point) => ({
                    ...point,
                    label: dayjs(point.timestamp).format('DD MMM')
                  }))}>
                    <defs>
                      <linearGradient id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        borderRadius: '1rem',
                        border: '1px solid rgba(148, 163, 184, 0.35)',
                        color: '#f8fafc'
                      }}
                      labelStyle={{ color: '#38bdf8', fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#color-${index})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
