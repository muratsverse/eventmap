@echo off
echo ========================================
echo Android Release AAB Olusturuluyor...
echo ========================================
cd /d "%~dp0"
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr

echo.
echo Adim 1: Web dosyalari build ediliyor...
call npm run build
if errorlevel 1 goto :error

echo.
echo Adim 2: Capacitor Android senkronizasyonu yapiliyor...
call npx cap sync android
if errorlevel 1 goto :error

cd /d "%~dp0android"

echo.
echo Adim 3: Gradle Daemon durduruluyor...
call gradlew.bat --stop

echo.
echo Adim 4: Build klasorleri temizleniyor...
call gradlew.bat clean

echo.
echo Adim 5: Release AAB olusturuluyor...
call gradlew.bat bundleRelease
if errorlevel 1 goto :error

echo.
echo ========================================
echo Build tamamlandi!
echo ========================================
echo AAB konumu:
echo %~dp0android\app\build\outputs\bundle\release\app-release.aab
echo ========================================
pause
goto :eof

:error
echo.
echo Build sirasinda hata olustu. Loglari kontrol edin.
pause
exit /b 1
