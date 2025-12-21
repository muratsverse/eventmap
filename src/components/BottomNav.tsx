import { List, Map, Plus, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TabType } from '@/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCreateClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onCreateClick }: BottomNavProps) {
  const tabs = [
    { id: 'liste' as TabType, label: 'Liste', icon: List },
    { id: 'harita' as TabType, label: 'Harita', icon: Map },
    { id: 'create' as TabType, label: '', icon: Plus }, // Placeholder for FAB
    { id: 'ara' as TabType, label: 'Ara', icon: Search },
    { id: 'profil' as TabType, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
      <div className="max-w-mobile mx-auto px-4 pb-2">
        <div className="bg-[var(--surface)]/95 backdrop-blur-md rounded-3xl shadow-md border border-[var(--border)]">
          <div className="grid grid-cols-5 items-center h-16 px-2">
            {tabs.map((tab) => {
              if (tab.label === '') {
                return (
                  <button
                    key={tab.id}
                    onClick={onCreateClick}
                    className="mx-auto w-11 h-11 bg-[var(--brand)] rounded-full shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    aria-label="Etkinlik Oluştur"
                  >
                    <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </button>
                );
              }

              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all',
                    isActive ? 'text-[var(--text)]' : 'text-[var(--muted)] hover:text-[var(--text)]'
                  )}
                  aria-label={tab.label}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 transition-all',
                      isActive && 'scale-110'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    'text-xs font-medium transition-all',
                    isActive && 'font-semibold'
                  )}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
