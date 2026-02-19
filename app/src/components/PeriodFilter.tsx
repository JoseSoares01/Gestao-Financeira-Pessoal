import type { PeriodFilter as PeriodFilterType } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, CalendarDays, CalendarRange, CalendarCheck } from 'lucide-react';

interface PeriodFilterProps {
  value: PeriodFilterType;
  onChange: (value: PeriodFilterType) => void;
}

const periods = [
  { id: 'day' as PeriodFilterType, label: 'Dia', icon: CalendarCheck },
  { id: 'month' as PeriodFilterType, label: 'Mês', icon: CalendarDays },
  { id: 'semester' as PeriodFilterType, label: 'Semestre', icon: CalendarRange },
  { id: 'year' as PeriodFilterType, label: 'Ano', icon: Calendar },
];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="flex items-center gap-1 bg-card/50 p-1 rounded-lg border border-border/50">
      {periods.map((period) => {
        const Icon = period.icon;
        const isActive = value === period.id;
        
        return (
          <button
            key={period.id}
            onClick={() => onChange(period.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-white hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{period.label}</span>
          </button>
        );
      })}
    </div>
  );
}
