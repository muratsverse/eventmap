@echo off
REM Stripe Premium Deployment Script for Windows
REM Bu script Stripe edge functions'larını deploy eder

echo.
echo ========================================
echo   EventMap Stripe Deployment (Windows)
echo ========================================
echo.

REM Supabase CLI kurulu mu kontrol et
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npx bulunamadi! Node.js yuklu mu kontrol edin.
    pause
    exit /b 1
)

echo [1/5] Supabase login kontrol ediliyor...
echo.

REM Secrets set et
echo [2/5] Supabase secrets ayarlaniyor...
echo.

set /p STRIPE_SECRET_KEY="Stripe Secret Key (sk_test_...): "
set /p STRIPE_PUBLISHABLE_KEY="Stripe Publishable Key (pk_test_...): "
set /p SUPABASE_URL="Supabase URL: "

echo.
echo Secrets ayarlaniyor...
call npx supabase secrets set STRIPE_SECRET_KEY=%STRIPE_SECRET_KEY%
call npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_Wgj2DXnU2v4b83Y1ajATA1ekClMmUEkh
call npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=sbp_ca670cfe3c94701e0e0d81a604f47ae6b6e8922a
call npx supabase secrets set SUPABASE_URL=%SUPABASE_URL%

echo.
echo [OK] Secrets ayarlandi
echo.

REM Edge functions deploy et
echo [3/5] Edge functions deploy ediliyor...
echo.

echo   - create-checkout-session...
call npx supabase functions deploy create-checkout-session

echo   - stripe-webhook...
call npx supabase functions deploy stripe-webhook

echo.
echo [OK] Edge functions deploy edildi
echo.

REM .env dosyasini guncelle
echo [4/5] .env dosyasi guncelleniyor...
echo.

if exist .env (
    REM Mevcut VITE_STRIPE_PUBLISHABLE_KEY satirini sil
    findstr /V "VITE_STRIPE_PUBLISHABLE_KEY" .env > .env.tmp
    move /Y .env.tmp .env >nul

    REM Yeni degeri ekle
    echo VITE_STRIPE_PUBLISHABLE_KEY=%STRIPE_PUBLISHABLE_KEY% >> .env

    REM Price ID yoksa ekle
    findstr /C:"VITE_STRIPE_PRICE_MONTHLY" .env >nul
    if %ERRORLEVEL% NEQ 0 (
        echo VITE_STRIPE_PRICE_MONTHLY=price_1SRCyZCOalGPl2j7dJOqK6wS >> .env
    )

    echo [OK] .env dosyasi guncellendi
) else (
    echo [ERROR] .env dosyasi bulunamadi!
    pause
    exit /b 1
)

echo.
echo [5/5] Database schema kontrol ediliyor...
echo.
echo Supabase SQL Editor'da su SQL'i calistirmaniz gerekiyor:
echo.
echo ALTER TABLE profiles
echo   ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
echo   ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ,
echo   ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
echo   ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
echo.

echo ========================================
echo   Deployment Tamamlandi!
echo ========================================
echo.
echo Sonraki adimlar:
echo   1. Development server'i yeniden baslatin
echo   2. Stripe Dashboard'da webhook endpoint ekleyin
echo   3. Test karti ile odeme yapin: 4242 4242 4242 4242
echo.
echo Detayli bilgi: STRIPE_DEPLOYMENT.md
echo.
pause
