// Stripe Webhook Handler
// Bu fonksiyon Stripe'dan gelen ödeme bildirimlerini işler

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    // Webhook signature'ı doğrula
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not set');
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log(`Webhook received: ${event.type}`);

    // Supabase client oluştur
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not set');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Event türüne göre işlem yap
    switch (event.type) {
      case 'checkout.session.completed': {
        // Ödeme başarılı
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('No userId in session metadata');
          break;
        }

        // User'ı premium yap
        const { error } = await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_since: new Date().toISOString(),
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating profile:', error);
        } else {
          console.log(`User ${userId} upgraded to premium`);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        // Abonelik iptal edildi veya güncellendi
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Customer ID'den user'ı bul
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const isPremium = subscription.status === 'active';

          const { error } = await supabase
            .from('profiles')
            .update({
              is_premium: isPremium,
              premium_since: isPremium ? new Date().toISOString() : null,
            })
            .eq('id', profile.id);

          if (error) {
            console.error('Error updating subscription status:', error);
          } else {
            console.log(`User ${profile.id} premium status: ${isPremium}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        // Ödeme başarısız
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment failed for customer: ${invoice.customer}`);
        // TODO: Kullanıcıya email gönder
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400 }
    );
  }
});
