import { useState } from 'react';
import { User as UserIcon, Mail, Lock, Heart, Calendar, Settings, Bell, LogOut, Shield, Crown, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites, useAttendances } from '@/hooks/useFavorites';
import { useEvents } from '@/hooks/useEvents';
import type { Event } from '@/types';
import EventCard from '../EventCard';
import AdminPanel from '../admin/AdminPanel';
import PasswordResetModal from '../modals/PasswordResetModal';
import PremiumModal from '../modals/PremiumModal';
import NotificationSettingsModal from '../modals/NotificationSettingsModal';
import ProfilePhotoModal from '../modals/ProfilePhotoModal';
import EditProfileModal from '../modals/EditProfileModal';
import UpdatePasswordModal from '../modals/UpdatePasswordModal';

interface ProfileViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

type ProfileTab = 'favorites' | 'attending' | 'settings' | 'admin';

export default function ProfileView({ events, onEventClick }: ProfileViewProps) {
  const {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    signInWithGoogle,
  } = useAuth();
  const { favorites } = useFavorites();
  const { attendances } = useAttendances();
  const { data: allEvents = [] } = useEvents();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');
  const [loginError, setLoginError] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setLoginError(error.message || 'Kayıt yapılamadı');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setLoginError(error.message || 'Giriş yapılamadı');
      }
    }
  };

  const favoriteEvents = allEvents.filter((e) => favorites.includes(e.id));
  const attendingEvents = allEvents.filter((e) => attendances.includes(e.id));

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
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

            {/* Login/Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {loginError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                  <p className="text-sm text-red-200">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-xl py-3 hover:opacity-90 active:scale-95 transition-all"
              >
                {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </form>

            {/* Forgot Password Link */}
            {!isSignUp && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  Şifremi Unuttum
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-pink-900/80 text-white/60">
                  veya
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl py-3 flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google ile Giriş Yap
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
              </button>
            </div>

            {/* Password Reset Modal */}
            <PasswordResetModal
              isOpen={showPasswordReset}
              onClose={() => setShowPasswordReset(false)}
            />
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
            src={profile?.cover_photo || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=300&fit=crop'}
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
              <button
                onClick={() => setShowProfilePhoto(true)}
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all relative group"
              >
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt="Profile"
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-white" strokeWidth={2} />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Değiştir</span>
                </div>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-white">
                    {profile?.name || 'Kullanıcı'}
                  </h1>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    aria-label="Profili Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-white/60 mb-3">{user.email}</p>

                {/* Stats */}
                <div className="flex gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">{favoriteEvents.length}</p>
                    <p className="text-xs text-white/60">Favoriler</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{attendingEvents.length}</p>
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
              ...(profile?.is_admin ? [{ id: 'admin' as ProfileTab, label: 'Admin', icon: Shield }] : []),
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
              {favoriteEvents.length === 0 ? (
                <div className="glassmorphism rounded-2xl p-8 text-center">
                  <Heart className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">Henüz favori etkinlik eklemediniz</p>
                </div>
              ) : (
                favoriteEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event)}
                    variant="compact"
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'attending' && (
            <>
              {attendingEvents.length === 0 ? (
                <div className="glassmorphism rounded-2xl p-8 text-center">
                  <Calendar className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">Henüz katılacağınız etkinlik yok</p>
                </div>
              ) : (
                attendingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event)}
                    variant="compact"
                  />
                ))
              )}
            </>
          )}

          {activeTab === 'admin' && profile?.is_admin && (
            <AdminPanel />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Premium Banner */}
              {!profile?.is_premium && (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                  <Crown className="w-5 h-5" />
                  <span>Premium'a Geç</span>
                </button>
              )}

              {profile?.is_premium && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <span className="text-white font-semibold">Premium Üye</span>
                  </div>
                  <p className="text-sm text-white/70">Sınırsız etkinlik oluşturma ve reklamsız deneyimin keyfini çıkarıyorsunuz</p>
                </div>
              )}

              {/* Settings */}
              <div className="glassmorphism rounded-2xl p-6 space-y-4">
                {/* Şifre Değiştir */}
                <button
                  onClick={() => setShowUpdatePassword(true)}
                  className="w-full flex items-center justify-between hover:bg-white/5 rounded-xl p-3 -mx-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-white/60" />
                    <span className="text-white">Şifre Değiştir</span>
                  </div>
                  <span className="text-white/40">›</span>
                </button>

                <div className="border-t border-white/10"></div>

                {/* Bildirim Ayarları */}
                <button
                  onClick={() => setShowNotifSettings(true)}
                  className="w-full flex items-center justify-between hover:bg-white/5 rounded-xl p-3 -mx-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-white/60" />
                    <span className="text-white">Bildirim Ayarları</span>
                  </div>
                  <span className="text-white/40">›</span>
                </button>

                <div className="border-t border-white/10"></div>

                {/* Çıkış Yap */}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-xl py-3 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />

        <NotificationSettingsModal
          isOpen={showNotifSettings}
          onClose={() => setShowNotifSettings(false)}
        />

        <ProfilePhotoModal
          isOpen={showProfilePhoto}
          onClose={() => setShowProfilePhoto(false)}
        />

        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
        />

        <UpdatePasswordModal
          isOpen={showUpdatePassword}
          onClose={() => setShowUpdatePassword(false)}
        />
      </div>
    </div>
  );
}
