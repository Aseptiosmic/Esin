package com.esin.di

import android.content.Context
import androidx.room.Room
import com.esin.BuildConfig
import com.esin.data.local.AppDatabase
import com.esin.data.local.TrackDao
import com.esin.data.remote.AudiusApi
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides @Singleton fun database(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "esin.db").build()
    @Provides fun trackDao(db: AppDatabase): TrackDao = db.trackDao()
    @Provides @Singleton fun json(): Json = Json { ignoreUnknownKeys = true; explicitNulls = false }
    @Provides @Singleton fun http(): OkHttpClient = OkHttpClient.Builder().followRedirects(true).followSslRedirects(true).build()
    @Provides @Singleton fun audiusApi(http: OkHttpClient, json: Json): AudiusApi {
        val apiHttp = http.newBuilder().addInterceptor { chain ->
            val original = chain.request()
            if (original.url.host == "api.audius.co") {
                val url = original.url.newBuilder().addQueryParameter("app_name", "Esin").build()
                val request = original.newBuilder().url(url)
                if (BuildConfig.AUDIUS_TOKEN.isNotBlank()) request.header("Authorization", "Bearer ${BuildConfig.AUDIUS_TOKEN}")
                chain.proceed(request.build())
            } else chain.proceed(original)
        }.build()
        return Retrofit.Builder().baseUrl("https://api.audius.co/v1/")
            .client(apiHttp).addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build().create(AudiusApi::class.java)
    }
}
