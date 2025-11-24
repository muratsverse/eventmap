// Create Stripe Invoice for Premium Payment
// Bu fonksiyon email ile fatura gönderir

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authorization token al
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Supabase client oluştur
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://zktzpwuuqdsfdrdljtoy.supabase.co';
    const supabaseAnonKey = Deno.env.get('ANON_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // User'ı doğrula
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { priceId, userId, userEmail } = await req.json();

    if (!priceId || !userId || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📧 Fatura oluşturuluyor:', { priceId, userId, userEmail });

    // 1. Önce müşteri var mı kontrol et, yoksa oluştur
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('✅ Mevcut müşteri bulundu:', customer.id);
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId,
        },
      });
      console.log('✅ Yeni müşteri oluşturuldu:', customer.id);
    }

    // 2. Price'dan product bilgisini al
    const price = await stripe.prices.retrieve(priceId);
    console.log('✅ Price bilgisi alındı:', price.id);

    // 3. Invoice Item oluştur
    await stripe.invoiceItems.create({
      customer: customer.id,
      price: priceId,
      description: 'EventMap Premium Abonelik (Aylık)',
    });
    console.log('✅ Invoice item oluşturuldu');

    // 4. Invoice oluştur ve otomatik gönder
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: true, // Otomatik finalize et
      collection_method: 'send_invoice', // Email ile gönder
      days_until_due: 7, // 7 gün içinde ödenebilir
      metadata: {
        userId,
      },
      description: 'EventMap Premium Abonelik',
    });

    console.log('✅ Invoice oluşturuldu:', invoice.id);

    // 5. Invoice'ı finalize et ve email gönder
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    console.log('✅ Invoice finalize edildi:', finalizedInvoice.id);

    // 6. Invoice'ı email ile gönder
    const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);
    console.log('✅ Invoice email ile gönderildi:', sentInvoice.id);

    return new Response(
      JSON.stringify({
        success: true,
        invoiceId: sentInvoice.id,
        hostedInvoiceUrl: sentInvoice.hosted_invoice_url,
        message: 'Fatura email adresinize gönderildi',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Invoice oluşturma hatası:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
