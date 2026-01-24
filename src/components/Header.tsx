import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  eventCount?: number;
  onFilterClick?: () => void;
  className?: string;
}

export default function Header({ title, eventCount, onFilterClick, className }: HeaderProps) {
  return (
    <header className={cn('safe-area-top', className)}>
      <div className="rounded-2xl p-4 mb-4 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-1.5">
              <img
                src="/logo.png"
                alt="Happenin"
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--text)]">{title}</h1>
              {eventCount !== undefined && (
                <p className="text-sm text-[var(--muted)]">
                  {eventCount} etkinlik
                </p>
              )}
            </div>
          </div>

          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="rounded-xl p-2.5 bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface)] active:scale-95 transition-all"
              aria-label="Filtrele"
            >
              <SlidersHorizontal className="w-5 h-5 text-[var(--text)]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
