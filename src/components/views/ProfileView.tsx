import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Lock, Heart, Calendar, Settings, Bell, LogOut, Shield, Edit2, Eye, EyeOff, Trash2, FileText, Scale, CreditCard, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites, useAttendances } from '@/hooks/useFavorites';
import { useEvents, useUserCreatedEvents } from '@/hooks/useEvents';
import type { Event } from '@/types';
import EventCard from '../EventCard';
import AdminPanel from '../admin/AdminPanel';
import PasswordResetModal from '../modals/PasswordResetModal';
import NotificationSettingsModal from '../modals/NotificationSettingsModal';
import ProfilePhotoModal from '../modals/ProfilePhotoModal';
import EditProfileModal from '../modals/EditProfileModal';
import UpdatePasswordModal from '../modals/UpdatePasswordModal';
import { supabase } from '@/lib/supabase';
import { translateAuthError } from '@/lib/errorMessages';

interface ProfileViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

type ProfileTab = 'favorites' | 'attending' | 'created' | 'settings' | 'admin';

export default function ProfileView({ events, onEventClick }: ProfileViewProps) {
  const navigate = useNavigate();
  const {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
    signInWithGoogle,
    signInWithApple,
    deleteAccount,
  } = useAuth();
  const { favorites } = useFavorites();
  const { attendances } = useAttendances();
  const { data: allEvents = [] } = useEvents();
  const { data: userCreatedEvents = [] } = useUserCreatedEvents(user?.id);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');
  const [loginError, setLoginError] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoginError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setLoginError(translateAuthError(error));
    }
  };

  const handleAppleSignIn = async () => {
    setLoginError('');
    const { error } = await signInWithApple();
    if (error) {
      setLoginError(translateAuthError(error));
    }
  };

  // Email görünürlük durumunu yükle
  useEffect(() => {
    if (profile) {
      setEmailVisible(profile.email_visible ?? false);
    }
  }, [profile]);

  // Email görünürlüğünü değiştir
  const toggleEmailVisibility = async () => {
    if (!user) return;

    const newVisibility = !emailVisible;
    setEmailVisible(newVisibility);

    const { error } = await supabase
      .from('profiles')
      .update({ email_visible: newVisibility })
      .eq('id', user.id);

    if (error) {
      console.error('Email görünürlük güncellenirken hata:', error);
      setEmailVisible(!newVisibility); // Revert on error
    }
  };

  // Hesabı silme işlemi
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { error } = await deleteAccount();

    if (error) {
      alert('Hesap silinirken hata oluştu: ' + translateAuthError(error));
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      // Başarılı - modal'ı kapat
      setShowDeleteConfirm(false);
      setIsDeleting(false);
      // signOut çağrılır ve kullanıcı login ekranına gider
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setLoginError(translateAuthError(error));
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setLoginError(translateAuthError(error));
      }
    }
  };

  const favoriteEvents = allEvents.filter((e) => favorites.includes(e.id));
  const attendingEvents = allEvents.filter((e) => attendances.includes(e.id));
  // Kullanıcının oluşturduğu tüm etkinlikler (onaysız dahil)
  const createdEvents = userCreatedEvents;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[var(--text)]">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-mobile mx-auto px-4 py-8 safe-area-top">
          <div className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--surface-2)] border border-[var(--border)] rounded-3xl mb-4">
                <UserIcon className="w-10 h-10 text-[var(--text)]" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-semibold text-[var(--text)] mb-2">Hoş Geldiniz</h1>
              <p className="text-[var(--muted)]">Etkinliklere katılmaya devam edin</p>
            </div>

            {/* Login/Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-40)]"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-sm text-red-300">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[var(--accent)] text-white font-semibold rounded-xl py-3 hover:opacity-90 active:scale-95 transition-all"
              >
                {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </form>

            {/* Forgot Password Link */}
            {!isSignUp && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowPasswordReset(true)}
                  className="text-[var(--accent)] hover:opacity-80 text-sm font-medium"
                >
                  Şifremi Unuttum
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--surface)] text-[var(--muted)]">
                  veya
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] font-semibold rounded-xl py-3 flex items-center justify-center gap-3 transition-colors border border-[var(--border)]"
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

              {/* Apple ile giriş sadece iOS'ta göster */}
              {Capacitor.getPlatform() === 'ios' && (
                <button
                  onClick={handleAppleSignIn}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-3 transition-colors border border-[var(--border)]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple ile Giriş Yap
                </button>
              )}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[var(--accent)] hover:opacity-80 text-sm font-medium"
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
            <div className="rounded-2xl p-4 text-center bg-[var(--surface)] border border-[var(--border)]">
              <Heart className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
              <p className="text-xs font-medium text-[var(--muted)]">Favorilere Ekle</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-[var(--surface)] border border-[var(--border)]">
              <Calendar className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
              <p className="text-xs font-medium text-[var(--muted)]">Etkinlik Oluştur</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-[var(--surface)] border border-[var(--border)]">
              <Bell className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
              <p className="text-xs font-medium text-[var(--muted)]">Bildirimler</p>
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        </div>

        {/* Profile Info */}
        <div className="px-4 -mt-16 relative z-10">
          <div className="rounded-3xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <button
                onClick={() => setShowProfilePhoto(true)}
                className="w-20 h-20 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl flex items-center justify-center flex-shrink-0 hover:opacity-90 active:scale-95 transition-all relative group"
              >
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt="Profile"
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-[var(--text)]" strokeWidth={2} />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Değiştir</span>
                </div>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-[var(--text)]">
                    {profile?.name || 'Kullanıcı'}
                  </h1>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="text-[var(--muted)] hover:text-[var(--text)] transition-colors p-1"
                    aria-label="Profili Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                {emailVisible && (
                  <p className="text-sm text-[var(--muted)] mb-3">{user.email}</p>
                )}

                {/* Stats */}
                <div className="flex gap-4">
                  <div>
                    <p className="text-lg font-semibold text-[var(--text)]">{favoriteEvents.length}</p>
                    <p className="text-xs text-[var(--muted)]">Favoriler</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--text)]">{attendingEvents.length}</p>
                    <p className="text-xs text-[var(--muted)]">Katılıyorum</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--text)]">{createdEvents.length}</p>
                    <p className="text-xs text-[var(--muted)]">Oluşturdum</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - İki satır */}
        <div className="px-4 mt-6 space-y-2">
          {/* Birinci satır: Favoriler, Katılıyorum, Oluşturdum */}
          <div className="rounded-2xl p-1 flex gap-1 bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {[
              { id: 'favorites' as ProfileTab, label: 'Favori', icon: Heart },
              { id: 'attending' as ProfileTab, label: 'Katılım', icon: Calendar },
              { id: 'created' as ProfileTab, label: 'Oluşturduklarım', icon: PlusCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl font-medium text-xs transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* İkinci satır: Admin (varsa), Ayarlar */}
          <div className="rounded-2xl p-1 flex gap-1 bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {[
              ...(profile?.is_admin ? [{ id: 'admin' as ProfileTab, label: 'Admin', icon: Shield }] : []),
              { id: 'settings' as ProfileTab, label: 'Ayarlar', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl font-medium text-xs transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
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
                <div className="rounded-2xl p-8 text-center bg-[var(--surface)] border border-[var(--border)]">
                  <Heart className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
                  <p className="text-[var(--muted)]">Henuz favori etkinlik eklemediniz</p>
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
                <div className="rounded-2xl p-8 text-center bg-[var(--surface)] border border-[var(--border)]">
                  <Calendar className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
                  <p className="text-[var(--muted)]">Henuz katilacaginiz etkinlik yok</p>
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

          {activeTab === 'created' && (
            <>
              {createdEvents.length === 0 ? (
                <div className="rounded-2xl p-8 text-center bg-[var(--surface)] border border-[var(--border)]">
                  <PlusCircle className="w-12 h-12 text-[var(--muted)] mx-auto mb-3" />
                  <p className="text-[var(--muted)]">Henüz etkinlik oluşturmadınız</p>
                  <p className="text-xs text-[var(--muted)] mt-2">Alt menüdeki + butonuyla yeni etkinlik oluşturabilirsiniz</p>
                </div>
              ) : (
                createdEvents.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Status Badge */}
                    {event.status && event.status !== 'approved' && (
                      <div className={`absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'inReview'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : event.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {event.status === 'inReview' ? '⏳ Onay Bekliyor' :
                         event.status === 'rejected' ? '❌ Reddedildi' :
                         event.status === 'draft' ? '📝 Taslak' : event.status}
                      </div>
                    )}
                    <EventCard
                      event={event}
                      onClick={() => onEventClick(event)}
                      variant="compact"
                    />
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'admin' && profile?.is_admin && (
            <AdminPanel />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Settings */}
              <div className="rounded-2xl p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)]">
                {/* Şifre Değiştir */}
                <button
                  onClick={() => setShowUpdatePassword(true)}
                  className="w-full flex items-center justify-between hover:bg-[var(--surface-2)] rounded-xl p-3 -mx-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[var(--muted)]" />
                    <span className="text-[var(--text)]">Şifre Değiştir</span>
                  </div>
                  <span className="text-[var(--muted)]">›</span>
                </button>

                <div className="border-t border-[var(--border)]"></div>

                {/* Bildirim Ayarları */}
                <button
                  onClick={() => setShowNotifSettings(true)}
                  className="w-full flex items-center justify-between hover:bg-[var(--surface-2)] rounded-xl p-3 -mx-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[var(--muted)]" />
                    <span className="text-[var(--text)]">Bildirim Ayarlari</span>
                  </div>
                  <span className="text-[var(--muted)]">›</span>
                </button>

                <div className="border-t border-[var(--border)]"></div>

                {/* Email Görünürlüğü */}
                <button
                  onClick={toggleEmailVisibility}
                  className="w-full flex items-center justify-between hover:bg-[var(--surface-2)] rounded-xl p-3 -mx-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {emailVisible ? (
                      <Eye className="w-5 h-5 text-[var(--muted)]" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-[var(--muted)]" />
                    )}
                    <div className="text-left">
                      <div className="text-[var(--text)]">Email Adresi Görünürlüğü</div>
                      <div className="text-xs text-[var(--muted)]">
                        {emailVisible ? 'Profilimde gorunur' : 'Profilimde gizli'}
                      </div>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    emailVisible ? 'bg-[#4fb07a]' : 'bg-[var(--surface-2)]'
                  } relative`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      emailVisible ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                </button>

                <div className="border-t border-[var(--border)]"></div>

                {/* Yasal Bağlantılar */}
                <div className="space-y-2">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wider px-3">Yasal</p>

                  <button
                    onClick={() => navigate('/terms')}
                    className="w-full flex items-center justify-between hover:bg-[var(--surface-2)] rounded-xl p-3 -mx-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[var(--muted)]" />
                      <span className="text-[var(--text)]">Kullanım Şartları</span>
                    </div>
                    <span className="text-[var(--muted)]">›</span>
                  </button>

                  <button
                    onClick={() => navigate('/privacy')}
                    className="w-full flex items-center justify-between hover:bg-[var(--surface-2)] rounded-xl p-3 -mx-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-[var(--muted)]" />
                      <span className="text-[var(--text)]">Gizlilik Politikası</span>
                    </div>
                    <span className="text-[var(--muted)]">›</span>
                  </button>

                  <button
                    onClick={() => navigate('/refund')}
                    className="w-full flex items-center justify-between hover:bg-[var(--surface-2)] rounded-xl p-3 -mx-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[var(--muted)]" />
                      <span className="text-[var(--text)]">İade Politikası</span>
                    </div>
                    <span className="text-[var(--muted)]">›</span>
                  </button>
                </div>

                <div className="border-t border-[var(--border)]"></div>

                {/* Hesabı Sil */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-medium rounded-xl py-3 transition-all border border-red-600/30"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Hesabı Sil</span>
                </button>

                <div className="border-t border-[var(--border)]"></div>

                {/* Çıkış Yap */}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-medium rounded-xl py-3 transition-all border border-red-500/30"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
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

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Hesabı Sil</h3>
                <p className="text-[var(--muted)] text-sm">
                  Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-all"
                >
                  {isDeleting ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full bg-[var(--surface-2)] hover:bg-[var(--surface)] text-[var(--text)] font-semibold rounded-xl py-3 transition-all border border-[var(--border)]"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
