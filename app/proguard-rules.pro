# Retrofit reflects on generic signatures and runtime method/parameter annotations.
-keepattributes Signature,InnerClasses,EnclosingMethod,*Annotation*,AnnotationDefault
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class retrofit2.Response
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation
-if interface * { @retrofit2.http.* <methods>; }
-keep,allowobfuscation interface <1>

# kotlinx.serialization generated serializers and companion accessors.
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault
-keepclassmembers class **$Companion { kotlinx.serialization.KSerializer serializer(...); }
-keepclasseswithmembers class ** { kotlinx.serialization.KSerializer serializer(...); }
-keep,includedescriptorclasses class **$$serializer { *; }
-keepclassmembers @kotlinx.serialization.Serializable class * { static **$Companion Companion; }

# Room generated implementations, Hilt components and Media3 session entry points.
-keep class com.esin.data.local.AppDatabase_Impl { *; }
-keep class * extends androidx.room.RoomDatabase { *; }
-keep class * extends androidx.room.migration.AutoMigrationSpec { *; }
-keep class dagger.hilt.** { *; }
-keep class * extends dagger.hilt.android.internal.managers.* { *; }
-keep class com.esin.service.MusicService { *; }
-keep class androidx.media3.session.** { *; }
