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
    Sergi: 'from-[#8a7cd1] to-[#a195e6]',
    Atölye: 'from-[#e07b39] to-[#f0a060]',
    Parti: 'from-[#e84393] to-[#fd79a8]',
    Komedi: 'from-[#fdcb6e] to-[#ffeaa7]',
    Show: 'from-[#e17055] to-[#fab1a0]',
    Müzik: 'from-[#a29bfe] to-[#6c5ce7]',
    Gezi: 'from-[#00b894] to-[#55efc4]',
    Keyif: 'from-[#fd79a8] to-[#e84393]',
    Dans: 'from-[#ff7675] to-[#d63031]',
    Sinema: 'from-[#636e72] to-[#2d3436]',
    Opera: 'from-[#b71540] to-[#e55039]',
    Bar: 'from-[#6c5ce7] to-[#a29bfe]',
    Kültür: 'from-[#0984e3] to-[#74b9ff]',
    Sosyal: 'from-[#00cec9] to-[#81ecec]',
    Eğlence: 'from-[#ff6b6b] to-[#ee5a24]',
    Müzikal: 'from-[#9b59b6] to-[#8e44ad]',
    Yarışma: 'from-[#f39c12] to-[#f1c40f]',
    Çocuk: 'from-[#2ecc71] to-[#27ae60]',
    'Talk Show': 'from-[#1abc9c] to-[#16a085]',
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
    Sergi: '🎨',
    Atölye: '🔧',
    Parti: '🎉',
    Komedi: '😂',
    Show: '🌟',
    Müzik: '🎶',
    Gezi: '🏞️',
    Keyif: '☕',
    Dans: '💃',
    Sinema: '🎬',
    Opera: '🎼',
    Bar: '🍸',
    Kültür: '🏛️',
    Sosyal: '👥',
    Eğlence: '🎊',
    Müzikal: '🎤',
    Yarışma: '🏆',
    Çocuk: '🧸',
    'Talk Show': '🎙️',
  };
  return icons[category] || '📍';
}
