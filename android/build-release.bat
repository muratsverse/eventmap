@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
cd /d %~dp0
echo Cleaning previous builds...
call gradlew.bat clean
echo Building release AAB...
call gradlew.bat bundleRelease
echo Build complete!
pause
