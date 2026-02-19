import { useEffect, useState, useRef } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import type { MonthlyData } from '@/types';

interface BarChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          if (entry.dataKey === 'incomeTrend' || entry.dataKey === 'expenseTrend') return null;
          return (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name === 'income' ? 'Receitas' : entry.name === 'expense' ? 'Despesas' : entry.name}: 
              € {entry.value.toLocaleString('pt-PT')}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

// 3D Bar Component
const ThreeDBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  const depth = 8;
  const skew = 4;
  
  return (
    <g>
      {/* Front face */}
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />
      
      {/* Top face (3D effect) */}
      <path 
        d={`M ${x} ${y} L ${x + skew} ${y - depth} L ${x + width + skew} ${y - depth} L ${x + width} ${y} Z`}
        fill={fill}
        opacity={0.7}
      />
      
      {/* Right face (3D effect) */}
      <path 
        d={`M ${x + width} ${y} L ${x + width + skew} ${y - depth} L ${x + width + skew} ${y - depth + height} L ${x + width} ${y + height} Z`}
        fill={fill}
        opacity={0.5}
      />
      
      {/* Highlight on front */}
      <rect 
        x={x + 2} 
        y={y + 2} 
        width={width - 4} 
        height={Math.min(4, height - 4)} 
        fill="rgba(255,255,255,0.2)" 
        rx={1}
      />
    </g>
  );
};

export function BarChart({ data }: BarChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Calculate trend lines
  const dataWithTrends = data.map((item, index) => {
    const incomeTrend = index > 0 
      ? data.slice(0, index + 1).reduce((sum, d) => sum + d.income, 0) / (index + 1)
      : item.income;
    const expenseTrend = index > 0
      ? data.slice(0, index + 1).reduce((sum, d) => sum + d.expense, 0) / (index + 1)
      : item.expense;
    return { ...item, incomeTrend, expenseTrend };
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 300);
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
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-destructive/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <h3 className="relative text-lg font-semibold text-white mb-6">Receitas vs Despesas</h3>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataWithTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7cb342" />
                <stop offset="100%" stopColor="#558b2f" />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef5350" />
                <stop offset="100%" stopColor="#c62828" />
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
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span style={{ color: '#b8c5b8' }}>
                  {value === 'income' ? 'Receitas' : value === 'expense' ? 'Despesas' : value}
                </span>
              )}
            />
            
            {/* 3D Bars */}
            <Bar 
              dataKey="income" 
              name="income"
              fill="url(#incomeGradient)" 
              radius={[4, 4, 0, 0]}
              animationDuration={600}
              animationBegin={0}
              barSize={24}
            >
              {dataWithTrends.map((_, index) => (
                <Cell key={`income-${index}`} fill="url(#incomeGradient)">
                  <ThreeDBar />
                </Cell>
              ))}
            </Bar>
            <Bar 
              dataKey="expense" 
              name="expense"
              fill="url(#expenseGradient)" 
              radius={[4, 4, 0, 0]}
              animationDuration={600}
              animationBegin={100}
              barSize={24}
            >
              {dataWithTrends.map((_, index) => (
                <Cell key={`expense-${index}`} fill="url(#expenseGradient)">
                  <ThreeDBar />
                </Cell>
              ))}
            </Bar>
            
            {/* Trend Lines */}
            <Line
              type="monotone"
              dataKey="incomeTrend"
              name="Tendência Receitas"
              stroke="#7cb342"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="expenseTrend"
              name="Tendência Despesas"
              stroke="#ef5350"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
