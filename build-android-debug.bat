@echo off
echo ========================================
echo Android Debug APK Olusturuluyor...
echo ========================================
cd /d "%~dp0android"
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr

echo.
echo Adim 1: Gradle Daemon durduruluyor...
call gradlew.bat --stop

echo.
echo Adim 2: Build klasorleri temizleniyor...
call gradlew.bat clean

echo.
echo Adim 3: Debug APK olusturuluyor...
call gradlew.bat assembleDebug

echo.
echo ========================================
echo Build tamamlandi!
echo ========================================
echo APK konumu:
echo %~dp0android\app\build\outputs\apk\debug\app-debug.apk
echo ========================================
pause
