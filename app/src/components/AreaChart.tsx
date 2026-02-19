import { useEffect, useState, useRef } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { MonthlyData } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AreaChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        <p className="text-xs text-primary">
          Saldo: € {payload[0].value.toLocaleString('pt-PT')}
        </p>
      </div>
    );
  }
  return null;
};

export function AreaChart({ data }: AreaChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const trend = data.length > 1 
    ? data[data.length - 1].balance > data[0].balance ? 'up' : 'down'
    : 'neutral';
  
  const trendPercentage = data.length > 1
    ? ((data[data.length - 1].balance - data[0].balance) / data[0].balance * 100).toFixed(1)
    : '0';

  // Calculate average for reference line
  const averageBalance = data.reduce((sum, d) => sum + d.balance, 0) / data.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 400);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={chartRef}
      className={`relative bg-card border border-border rounded-xl p-6 overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 179, 66, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 179, 66, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Gradient Fade Effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Evolução do Saldo</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{trendPercentage}%</span>
          {trend === 'up' ? (
            <TrendingUp className="w-5 h-5 text-success" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-5 h-5 text-destructive" />
          ) : null}
        </div>
      </div>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7cb342" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#7cb342" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7cb342" />
                <stop offset="100%" stopColor="#aed581" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d4a2d" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7a8a7a', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#7a8a7a', fontSize: 12 }}
              tickFormatter={(value) => `€${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Average reference line */}
            <ReferenceLine 
              y={averageBalance} 
              stroke="#7a8a7a" 
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="url(#lineGradient)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={1000}
              animationBegin={0}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
