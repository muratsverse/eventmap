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
    Konser: 'from-[#6d7cff] to-[#8a94ff]',
    Spor: 'from-[#4fb07a] to-[#6bc59a]',
    Tiyatro: 'from-[#d07a6a] to-[#e3a08d]',
    Festival: 'from-[#d3a253] to-[#e1b86f]',
    Meetup: 'from-[#5ea2d9] to-[#78b7ea]',
    Sergi: 'from-[#8a7cd1] to-[#a195e6]'
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
