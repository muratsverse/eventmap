import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase, supabaseHelpers } from '@/lib/supabase';

/**
 * Initialize push notifications for native platforms
 * Registers device token and stores it in Supabase
 */
export async function initPushNotifications(userId: string) {
  if (!Capacitor.isNativePlatform()) return;
  if (!supabaseHelpers.isConfigured()) return;

  try {
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') {
      console.log('Push notification permission denied');
      return;
    }

    // Register for push notifications
    await PushNotifications.register();

    // Listen for registration success
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push token:', token.value);

      // Save token to Supabase
      await supabase
        .from('push_tokens')
        .upsert({
          user_id: userId,
          token: token.value,
          platform: Capacitor.getPlatform(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,platform',
        });
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    // Listen for received notifications (app in foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });

    // Listen for notification action (user tapped notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Notification action:', action);
      // Could navigate to specific event here
      const eventId = action.notification.data?.eventId;
      if (eventId) {
        // Handle navigation to event
        window.dispatchEvent(new CustomEvent('openEvent', { detail: { eventId } }));
      }
    });
  } catch (error) {
    console.error('Push notification init error:', error);
  }
}

/**
 * Remove push token when user logs out
 */
export async function removePushToken(userId: string) {
  if (!Capacitor.isNativePlatform()) return;
  if (!supabaseHelpers.isConfigured()) return;

  try {
    await supabase
      .from('push_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('platform', Capacitor.getPlatform());
  } catch (error) {
    console.error('Remove push token error:', error);
  }
}
