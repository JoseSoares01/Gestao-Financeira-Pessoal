import { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Sparkles } from 'lucide-react';
import type { Forecast } from '@/types';
import { cn } from '@/lib/utils';

interface ForecastCardProps {
  forecast: Forecast;
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 700);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative bg-gradient-to-br from-card to-bg-dark border border-primary/30 rounded-xl p-6 overflow-hidden transition-all duration-500",
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 179, 66, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 179, 66, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Gradient Fade Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-radial from-primary/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-white">Previsão Financeira</h3>
      </div>
      
      <p className="relative text-sm text-muted-foreground mb-5">
        Projeção para o próximo mês baseada nos últimos 3 meses
      </p>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Next Month Estimate */}
        <div className="bg-card/50 rounded-lg p-4 border border-border/50 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground mb-1">Saldo Estimado</p>
          <p className="text-2xl font-bold text-white">
            € {forecast.nextMonth.toLocaleString('pt-PT')}
          </p>
        </div>

        {/* Trend */}
        <div className="bg-card/50 rounded-lg p-4 border border-border/50 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground mb-1">Tendência</p>
          <div className="flex items-center gap-2">
            {forecast.trend === 'up' ? (
              <>
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-lg font-semibold text-success">Crescente</span>
              </>
            ) : forecast.trend === 'down' ? (
              <>
                <TrendingDown className="w-5 h-5 text-destructive" />
                <span className="text-lg font-semibold text-destructive">Decrescente</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">Estável</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {forecast.percentage > 0 ? '+' : ''}{forecast.percentage}% vs mês anterior
          </p>
        </div>

        {/* Alert */}
        {forecast.alert && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-primary font-medium mb-1">Alerta</p>
                <p className="text-sm text-white">{forecast.alert}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
