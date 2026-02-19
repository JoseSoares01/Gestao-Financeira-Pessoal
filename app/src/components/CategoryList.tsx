import { useEffect, useState, useRef } from 'react';
import type { CategoryData } from '@/types';

interface CategoryListProps {
  categories: CategoryData[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            // Animate bars one by one
            categories.forEach((_, index) => {
              setTimeout(() => {
                setAnimatedWidths(prev => {
                  const newWidths = [...prev];
                  newWidths[index] = categories[index].percentage;
                  return newWidths;
                });
              }, index * 100);
            });
          }, 500);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => observer.disconnect();
  }, [categories]);

  return (
    <div 
      ref={listRef}
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
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      <h3 className="relative text-lg font-semibold text-white mb-5">Despesas por Categoria</h3>
      <div className="relative space-y-4">
        {categories.map((category, index) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shadow-sm" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-white">{category.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">
                  € {category.value.toLocaleString('pt-PT')}
                </span>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {category.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ 
                  width: `${animatedWidths[index] || 0}%`,
                  backgroundColor: category.color,
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: `0 0 10px ${category.color}40`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
