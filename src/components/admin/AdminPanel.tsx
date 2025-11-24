import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Clock, AlertTriangle, Loader2, Eye } from 'lucide-react';

interface PendingEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  city: string;
  date: string;
  time: string;
  end_time?: string;
  organizer: string;
  creator_id: string;
  submitted_at: string;
  image_url: string;
  report_count: number;
}

interface AdminNotification {
  id: string;
  event_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Admin kontrolü
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    setIsAdmin(data?.is_admin || false);

    if (data?.is_admin) {
      loadPendingEvents();
      loadNotifications();
    } else {
      setLoading(false);
    }
  };

  const loadPendingEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'inReview')
      .order('submitted_at', { ascending: false });

    if (!error && data) {
      setPendingEvents(data);
    }
    setLoading(false);
  };

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('admin_notifications')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data);
    }
  };

  const approveEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq('id', eventId);

    if (!error) {
      alert('✅ Etkinlik onaylandı!');
      loadPendingEvents();
      setSelectedEvent(null);
    } else {
      alert('❌ Hata: ' + error.message);
    }
  };

  const rejectEvent = async (eventId: string) => {
    if (!rejectionReason.trim()) {
      alert('⚠️ Lütfen red nedeni girin');
      return;
    }

    const { error } = await supabase
      .from('events')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq('id', eventId);

    if (!error) {
      alert('✅ Etkinlik reddedildi');
      loadPendingEvents();
      setSelectedEvent(null);
      setRejectionReason('');
    } else {
      alert('❌ Hata: ' + error.message);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    loadNotifications();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-400">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Paneli</h1>
          <p className="text-gray-300">Etkinlik onayları ve sistem yönetimi</p>
        </div>

        {/* Bildirimler */}
        {notifications.length > 0 && (
          <div className="mb-8 glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Bildirimler ({notifications.length})
            </h2>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white/5 rounded-xl p-4 flex items-start justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{notif.title}</h3>
                    <p className="text-sm text-gray-300">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.created_at).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="ml-4 text-xs text-purple-400 hover:text-purple-300"
                  >
                    Okundu İşaretle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-10 h-10 text-yellow-400" />
              <div>
                <p className="text-gray-300 text-sm">Onay Bekleyen</p>
                <p className="text-3xl font-bold text-white">{pendingEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-red-400" />
              <div>
                <p className="text-gray-300 text-sm">Raporlu Etkinlikler</p>
                <p className="text-3xl font-bold text-white">
                  {pendingEvents.filter((e) => e.report_count > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="glassmorphism rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <div>
                <p className="text-gray-300 text-sm">Toplam İşlem</p>
                <p className="text-3xl font-bold text-white">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onay Bekleyen Etkinlikler */}
        <div className="glassmorphism rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Onay Bekleyen Etkinlikler</h2>

          {pendingEvents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-xl text-gray-300">Tüm etkinlikler onaylandı!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex gap-6">
                    {/* Görsel */}
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-32 h-32 object-cover rounded-xl"
                    />

                    {/* Detaylar */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span>{event.category}</span>
                            <span>•</span>
                            <span>{event.city}</span>
                            <span>•</span>
                            <span>{event.date} - {event.time}</span>
                            {event.end_time && <span>→ {event.end_time}</span>}
                          </div>
                        </div>
                        {event.report_count > 0 && (
                          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {event.report_count} Rapor
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span>Organizatör: {event.organizer}</span>
                        <span>•</span>
                        <span>Konum: {event.location}</span>
                        <span>•</span>
                        <span>
                          Gönderildi: {new Date(event.submitted_at).toLocaleString('tr-TR')}
                        </span>
                      </div>

                      {/* Aksiyon Butonları */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Detayları Gör
                        </button>
                        <button
                          onClick={() => approveEvent(event.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Onayla
                        </button>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reddet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detay Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glassmorphism rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Etkinlik Detayları</h2>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-400">Başlık</label>
                  <p className="text-lg font-semibold text-white">{selectedEvent.title}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Açıklama</label>
                  <p className="text-white">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Kategori</label>
                    <p className="text-white">{selectedEvent.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Şehir</label>
                    <p className="text-white">{selectedEvent.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Tarih</label>
                    <p className="text-white">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Saat</label>
                    <p className="text-white">
                      {selectedEvent.time}
                      {selectedEvent.end_time && ` - ${selectedEvent.end_time}`}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Konum</label>
                  <p className="text-white">{selectedEvent.location}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Organizatör</label>
                  <p className="text-white">{selectedEvent.organizer}</p>
                </div>
              </div>

              {/* Red Nedeni */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Red Nedeni (opsiyonel, reddetme durumunda gerekli)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Etkinliğin neden reddedildiğini açıklayın..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  rows={3}
                />
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3">
                <button
                  onClick={() => approveEvent(selectedEvent.id)}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Onayla
                </button>
                <button
                  onClick={() => rejectEvent(selectedEvent.id)}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reddet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
