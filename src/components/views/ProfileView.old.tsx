import { useState } from 'react';
import { User as UserIcon, Mail, Lock, Heart, Calendar, Settings, Bell, LogOut } from 'lucide-react';
import { Event } from '@/types';
import EventCard from '../EventCard';

interface ProfileViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

type ProfileTab = 'favorites' | 'attending' | 'settings';

export default function ProfileView({ events, onEventClick }: ProfileViewProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');

  // Mock user data
  const mockUser = {
    name: 'Hoş Geldiniz',
    email: 'ornek@email.com',
    profilePhoto: '',
    coverPhoto: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=300&fit=crop',
    isPremium: false,
    favorites: events.slice(0, 3),
    attending: events.slice(3, 6),
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-mobile mx-auto px-4 py-8 safe-area-top">
          <div className="glassmorphism rounded-3xl p-8 card-shadow">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4">
                <UserIcon className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h1>
              <p className="text-white/60">Etkinliklere katılmaya devam edin</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-xl py-3 hover:opacity-90 active:scale-95 transition-all"
              >
                Giriş Yap
              </button>
            </form>

            <div className="text-center mt-6">
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Hesabınız yok mu? Kayıt olun
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="glassmorphism rounded-2xl p-4 text-center">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-white/80">Favorilere Ekle</p>
            </div>
            <div className="glassmorphism rounded-2xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-white/80">Etkinlik Oluştur</p>
            </div>
            <div className="glassmorphism rounded-2xl p-4 text-center">
              <Bell className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-white/80">Bildirimler</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-mobile mx-auto">
        {/* Cover Photo */}
        <div className="relative h-32 safe-area-top">
          <img
            src={mockUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        </div>

        {/* Profile Info */}
        <div className="px-4 -mt-16 relative z-10">
          <div className="glassmorphism rounded-3xl p-6 card-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-10 h-10 text-white" strokeWidth={2} />
              </div>

              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">{mockUser.name}</h1>
                <p className="text-sm text-white/60 mb-3">{mockUser.email}</p>

                {/* Stats */}
                <div className="flex gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">{mockUser.favorites.length}</p>
                    <p className="text-xs text-white/60">Favoriler</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{mockUser.attending.length}</p>
                    <p className="text-xs text-white/60">Katılıyorum</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">0</p>
                    <p className="text-xs text-white/60">Oluşturdum</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-6">
          <div className="glassmorphism rounded-2xl p-1 flex gap-1">
            {[
              { id: 'favorites' as ProfileTab, label: 'Favoriler', icon: Heart },
              { id: 'attending' as ProfileTab, label: 'Katılıyorum', icon: Calendar },
              { id: 'settings' as ProfileTab, label: 'Ayarlar', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 mt-6 space-y-3">
          {activeTab === 'favorites' && (
            <>
              {mockUser.favorites.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  variant="compact"
                />
              ))}
            </>
          )}

          {activeTab === 'attending' && (
            <>
              {mockUser.attending.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                  variant="compact"
                />
              ))}
            </>
          )}

          {activeTab === 'settings' && (
            <div className="glassmorphism rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-white/60" />
                  <span className="text-white">Bildirimler</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                </label>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-xl py-3 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
