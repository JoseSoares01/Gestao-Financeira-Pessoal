import { useEffect, useState, useRef } from 'react';
import type { Transaction } from '@/types';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

interface TransactionListProps {
  transactions: Transaction[];
}

const categoryIcons: Record<string, string> = {
  'Salário': '💰',
  'Bônus': '🎁',
  'Freelance': '💼',
  'Investimentos': '📈',
  'Outros': '➕',
  'Moradia': '🏠',
  'Alimentação': '🍽️',
  'Transporte': '🚗',
  'Saúde': '❤️',
  'Lazer': '🎮',
  'Educação': '📚',
};

export function TransactionList({ transactions }: TransactionListProps) {
  const [isVisible, setIsVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 600);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  };

  const downloadExcel = () => {
    // Prepare data for Excel
    const excelData = transactions.map(t => ({
      'Data': t.date,
      'Descrição': t.description,
      'Categoria': t.category,
      'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
      'Essencial': t.isEssential === undefined ? '-' : (t.isEssential ? 'Sim' : 'Não'),
      'Método de Pagamento': t.paymentMethod,
      'Valor': t.type === 'income' ? t.amount : -t.amount,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 12 }, // Data
      { wch: 25 }, // Descrição
      { wch: 15 }, // Categoria
      { wch: 10 }, // Tipo
      { wch: 10 }, // Essencial
      { wch: 18 }, // Método de Pagamento
      { wch: 12 }, // Valor
    ];
    ws['!cols'] = colWidths;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `transacoes_jose_luiza_${date}.xlsx`;

    // Download
    XLSX.writeFile(wb, filename);
  };

  return (
    <div 
      ref={listRef}
      className={`relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 ${
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

      <div className="relative p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Transações Recentes</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadExcel}
              className="gap-2 border-border hover:bg-primary/10 hover:border-primary/50"
            >
              <Download className="w-4 h-4" />
              Excel
            </Button>
            <button className="text-sm text-primary hover:text-primary-light transition-colors">
              Ver todas
            </button>
          </div>
        </div>
      </div>
      <div className="relative divide-y divide-border">
        {transactions.slice(0, 6).map((transaction, index) => (
          <div 
            key={transaction.id}
            className={cn(
              "p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors cursor-pointer",
              !isVisible && "opacity-0 translate-x-4"
            )}
            style={{ 
              transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
              transaction.type === 'income' 
                ? "bg-success/10" 
                : "bg-destructive/10"
            )}>
              {categoryIcons[transaction.category] || (transaction.type === 'income' ? '💰' : '💸')}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {transaction.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
                {transaction.isEssential !== undefined && (
                  <>
                    <span>•</span>
                    <span className={transaction.isEssential ? "text-success" : "text-warning"}>
                      {transaction.isEssential ? 'Essencial' : 'Não essencial'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-1 text-sm font-semibold",
                transaction.type === 'income' ? "text-success" : "text-white"
              )}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                )}
                <span>
                  {transaction.type === 'income' ? '+' : '-'}
                  € {transaction.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button className="p-1 hover:bg-muted rounded transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
