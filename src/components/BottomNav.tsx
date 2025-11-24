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
        <div className="bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-md border border-white/10">
          <div className="relative flex items-center justify-around h-16 px-2">
            {tabs.map((tab) => {
              if (tab.label === '') {
                return (
                  <button
                    key={tab.id}
                    onClick={onCreateClick}
                    className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    aria-label="Etkinlik Oluştur"
                  >
                    <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
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
                    'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all',
                    isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
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
                  {isActive && (
                    <div className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
