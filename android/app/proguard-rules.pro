# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Capacitor WebView & JavaScript Interface
-keepclassmembers class * extends com.getcapacitor.Plugin {
   @com.getcapacitor.annotation.CapacitorPlugin *;
   @com.getcapacitor.PluginMethod public *;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin public class *
-keep public class com.getcapacitor.** { *; }

# WebView JavaScript Interface
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep generic signature (needed for Reflection)
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod

# Gson/JSON serialization
-keepattributes Signature
-keep class sun.misc.Unsafe { *; }
-keep class com.google.gson.** { *; }

# Capacitor Plugins
-keep class com.capacitorjs.plugins.** { *; }

# OkHttp & Retrofit (if used)
-dontwarn okhttp3.**
-dontwarn retrofit2.**
-keep class okhttp3.** { *; }
-keep class retrofit2.** { *; }

# AndroidX
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
