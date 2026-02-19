import { useEffect, useState, useRef } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface DonutChartProps {
  essential: number;
  nonEssential: number;
  essentialValue: number;
  nonEssentialValue: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{data.name}</p>
        <p className="text-xs" style={{ color: data.color }}>
          € {data.value.toLocaleString('pt-PT')} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function DonutChart({ 
  essential, 
  nonEssential, 
  essentialValue, 
  nonEssentialValue 
}: DonutChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const data = [
    { name: 'Essencial', value: essentialValue, percentage: essential, color: '#7cb342' },
    { name: 'Não Essencial', value: nonEssentialValue, percentage: nonEssential, color: '#ffa726' },
  ];

  const total = essentialValue + nonEssentialValue;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 500);
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-warning/5 to-transparent rounded-full blur-xl pointer-events-none" />

      <h3 className="relative text-lg font-semibold text-white mb-4">Essencial vs Não Essencial</h3>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              animationDuration={800}
              animationBegin={0}
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="none"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-lg font-bold text-white">
            € {total.toLocaleString('pt-PT')}
          </span>
        </div>
      </div>
      {/* Legend */}
      <div className="relative flex justify-center gap-4 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full shadow-lg" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">
              {item.name} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
