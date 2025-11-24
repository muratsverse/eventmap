import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Ücretsiz';
  if (min === max) return `₺${min}`;
  return `₺${min} - ₺${max}`;
}

export function formatDate(dateStr: string): string {
  return dateStr;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Konser: 'from-purple-500 to-pink-500',
    Spor: 'from-green-500 to-emerald-500',
    Tiyatro: 'from-red-500 to-orange-500',
    Festival: 'from-yellow-500 to-orange-500',
    Meetup: 'from-blue-500 to-cyan-500',
    Sergi: 'from-indigo-500 to-purple-500'
  };
  return colors[category] || 'from-gray-500 to-gray-600';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Konser: '🎵',
    Spor: '⚽',
    Tiyatro: '🎭',
    Festival: '🎪',
    Meetup: '🤝',
    Sergi: '🎨'
  };
  return icons[category] || '📍';
}
