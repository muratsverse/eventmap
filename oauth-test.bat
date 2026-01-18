@echo off
REM OAuth Test ve Debug Script
REM Bu script tum OAuth ve build testlerini otomatik yapar

echo ========================================
echo   OAUTH VE BUILD TEST SCRIPTI
echo ========================================
echo.

:MENU
echo.
echo [1] Web Development Modu Basla (localhost:5173)
echo [2] Android Studio Ac
echo [3] Android Build ve Sync
echo [4] Release APK/AAB Olustur
echo [5] Gradle Clean
echo [6] Logcat Ac (OAuth logs)
echo [7] Deep Link Test
echo [8] Tum Dependencies Guncelle
echo [9] Supabase Dashboard Ac
echo [0] Cikis
echo.
set /p choice="Seciminiz (0-9): "

if "%choice%"=="1" goto DEV_MODE
if "%choice%"=="2" goto OPEN_STUDIO
if "%choice%"=="3" goto ANDROID_SYNC
if "%choice%"=="4" goto RELEASE_BUILD
if "%choice%"=="5" goto GRADLE_CLEAN
if "%choice%"=="6" goto LOGCAT
if "%choice%"=="7" goto DEEP_LINK_TEST
if "%choice%"=="8" goto UPDATE_DEPS
if "%choice%"=="9" goto OPEN_SUPABASE
if "%choice%"=="0" goto END

goto MENU

:DEV_MODE
echo.
echo ======================================
echo   WEB DEVELOPMENT MODU BASLATILIYOR
echo ======================================
echo.
echo Tarayicida ac: http://localhost:5173
echo Gmail ile giris yaparken console'u acik tutun (F12)
echo.
npm run dev
goto MENU

:OPEN_STUDIO
echo.
echo ======================================
echo   ANDROID STUDIO ACILIYOR
echo ======================================
echo.
npx cap open android
goto MENU

:ANDROID_SYNC
echo.
echo ======================================
echo   ANDROID BUILD VE SYNC
echo ======================================
echo.
echo [1/3] Web build yapiliyor...
call npm run build
if errorlevel 1 (
    echo HATA: Web build basarisiz!
    pause
    goto MENU
)

echo.
echo [2/3] Capacitor Android sync...
call npx cap sync android
if errorlevel 1 (
    echo HATA: Capacitor sync basarisiz!
    pause
    goto MENU
)

echo.
echo [3/3] Android Studio aciliyor...
call npx cap open android

echo.
echo BASARILI! Android Studio acildi.
echo Simdi Android Studio'da Run butonuna basin.
echo.
pause
goto MENU

:RELEASE_BUILD
echo.
echo ======================================
echo   RELEASE AAB/APK OLUSTURULUYOR
echo ======================================
echo.
echo [1/4] Web build...
call npm run build
if errorlevel 1 (
    echo HATA: Web build basarisiz!
    pause
    goto MENU
)

echo.
echo [2/4] Capacitor sync...
call npx cap sync android

echo.
echo [3/4] Gradle clean...
cd android
call gradlew clean

echo.
echo [4/4] Release AAB olusturuluyor...
call gradlew bundleRelease
if errorlevel 1 (
    echo HATA: Release build basarisiz!
    cd ..
    pause
    goto MENU
)

cd ..

echo.
echo ========================================
echo BASARILI! Release AAB olusturuldu.
echo ========================================
echo.
echo Dosya konumu:
echo android\app\build\outputs\bundle\release\app-release.aab
echo.
echo Bu dosyayi Google Play Console'a yukleyin.
echo.
pause
goto MENU

:GRADLE_CLEAN
echo.
echo ======================================
echo   GRADLE CLEAN
echo ======================================
echo.
cd android
call gradlew clean
cd ..
echo.
echo Gradle cache temizlendi.
pause
goto MENU

:LOGCAT
echo.
echo ======================================
echo   LOGCAT - OAUTH LOGS
echo ======================================
echo.
echo Android cihazi bagli oldugundan emin olun!
echo.
echo Logcat aciliyor (Ctrl+C ile cikin)...
echo.
adb logcat -s Capacitor:V chromium:I *:E
goto MENU

:DEEP_LINK_TEST
echo.
echo ======================================
echo   DEEP LINK TEST
echo ======================================
echo.
echo Android cihazi bagli oldugundan emin olun!
echo.
echo [1] OAuth Callback Test
echo [2] Password Reset Test
echo [3] Genel Deep Link Test
echo [4] Geri Don
echo.
set /p dl_choice="Seciminiz (1-4): "

if "%dl_choice%"=="1" (
    echo.
    echo OAuth callback deep link gonderiliyor...
    adb shell am start -a android.intent.action.VIEW -d "eventmap://auth/callback?code=test123"
    echo.
    echo Deep link gonderildi! Uygulamayi kontrol edin.
    pause
)

if "%dl_choice%"=="2" (
    echo.
    echo Password reset deep link gonderiliyor...
    adb shell am start -a android.intent.action.VIEW -d "eventmap://reset-password"
    echo.
    echo Deep link gonderildi! Uygulamayi kontrol edin.
    pause
)

if "%dl_choice%"=="3" (
    echo.
    echo Genel deep link gonderiliyor...
    adb shell am start -a android.intent.action.VIEW -d "eventmap://test"
    echo.
    echo Deep link gonderildi! Uygulamayi kontrol edin.
    pause
)

goto MENU

:UPDATE_DEPS
echo.
echo ======================================
echo   DEPENDENCIES GUNCELLEME
echo ======================================
echo.
echo [1/3] npm dependencies...
call npm update

echo.
echo [2/3] Capacitor...
call npm install @capacitor/core@latest @capacitor/cli@latest

echo.
echo [3/3] Android dependencies...
cd android
call gradlew --refresh-dependencies
cd ..

echo.
echo Tum dependencies guncellendi.
pause
goto MENU

:OPEN_SUPABASE
echo.
echo ======================================
echo   SUPABASE DASHBOARD
echo ======================================
echo.
echo Tarayicida aciliyor...
start https://app.supabase.com/project/zktzpwuuqdsfdrdljtoy/auth/url-configuration
echo.
echo Redirect URLs'i ekleyin:
echo - http://localhost:5173/auth/callback
echo - http://localhost:5174/auth/callback
echo - eventmap://auth/callback
echo.
pause
goto MENU

:END
echo.
echo Cikiliyor...
exit

