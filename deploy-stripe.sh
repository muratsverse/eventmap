#!/bin/bash

# Stripe Premium Deployment Script
# Bu script Stripe edge functions'larını deploy eder

echo "🚀 EventMap Stripe Deployment"
echo "=============================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Gerekli değişkenleri kontrol et
echo "📋 Gerekli değişkenleri kontrol ediyorum..."

if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo -e "${RED}❌ STRIPE_SECRET_KEY bulunamadı!${NC}"
  echo "Lütfen önce şu komutu çalıştırın:"
  echo "  export STRIPE_SECRET_KEY=sk_test_..."
  exit 1
fi

if [ -z "$STRIPE_PUBLISHABLE_KEY" ]; then
  echo -e "${RED}❌ STRIPE_PUBLISHABLE_KEY bulunamadı!${NC}"
  echo "Lütfen önce şu komutu çalıştırın:"
  echo "  export STRIPE_PUBLISHABLE_KEY=pk_test_..."
  exit 1
fi

echo -e "${GREEN}✅ Environment variables hazır${NC}"
echo ""

# Supabase'e giriş kontrolü
echo "🔐 Supabase bağlantısı kontrol ediliyor..."
if ! npx supabase projects list &> /dev/null; then
  echo -e "${YELLOW}⚠️  Supabase'e giriş yapmanız gerekiyor${NC}"
  npx supabase login
fi

echo -e "${GREEN}✅ Supabase bağlantısı aktif${NC}"
echo ""

# Secrets set et
echo "🔑 Supabase secrets ayarlanıyor..."

npx supabase secrets set STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_Wgj2DXnU2v4b83Y1ajATA1ekClMmUEkh
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sbp_ca670cfe3c94701e0e0d81a604f47ae6b6e8922a
npx supabase secrets set SUPABASE_URL=$VITE_SUPABASE_URL

echo -e "${GREEN}✅ Secrets set edildi${NC}"
echo ""

# Edge functions deploy et
echo "🚀 Edge functions deploy ediliyor..."

echo "  📦 create-checkout-session..."
npx supabase functions deploy create-checkout-session

echo "  📦 stripe-webhook..."
npx supabase functions deploy stripe-webhook

echo -e "${GREEN}✅ Edge functions deploy edildi${NC}"
echo ""

# .env dosyasını güncelle
echo "📝 .env dosyası güncelleniyor..."

if [ -f ".env" ]; then
  # Publishable key'i ekle/güncelle
  if grep -q "VITE_STRIPE_PUBLISHABLE_KEY" .env; then
    # Mevcut satırı güncelle (platform bağımsız)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s|VITE_STRIPE_PUBLISHABLE_KEY=.*|VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|g" .env
    else
      # Linux/Windows Git Bash
      sed -i "s|VITE_STRIPE_PUBLISHABLE_KEY=.*|VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|g" .env
    fi
  else
    echo "VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY" >> .env
  fi

  # Price ID'yi ekle/güncelle
  if ! grep -q "VITE_STRIPE_PRICE_MONTHLY" .env; then
    echo "VITE_STRIPE_PRICE_MONTHLY=price_1SRCyZCOalGPl2j7dJOqK6wS" >> .env
  fi

  echo -e "${GREEN}✅ .env dosyası güncellendi${NC}"
else
  echo -e "${RED}❌ .env dosyası bulunamadı!${NC}"
  exit 1
fi

echo ""
echo "=============================="
echo -e "${GREEN}🎉 Deployment tamamlandı!${NC}"
echo ""
echo "📝 Sonraki adımlar:"
echo "  1. Development server'ı yeniden başlatın: npm run dev"
echo "  2. Stripe Dashboard'da webhook endpoint ekleyin:"
echo "     https://PROJE_ID.supabase.co/functions/v1/stripe-webhook"
echo "  3. Test kartı ile ödeme yapın: 4242 4242 4242 4242"
echo ""
echo "📖 Detaylı bilgi için: STRIPE_DEPLOYMENT.md"
echo ""
