@echo off
echo Building Android Release AAB...
cd /d "%~dp0android"
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
call gradlew.bat clean
call gradlew.bat bundleRelease
echo.
echo Build complete! AAB location:
echo %~dp0android\app\build\outputs\bundle\release\app-release.aab
pause
