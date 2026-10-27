package com.esin.data.remote

import com.esin.BuildConfig
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.postgrest.Postgrest
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseClientProvider @Inject constructor() {
    // Auth's default Android session manager persists and refreshes the anonymous session.
    val client: SupabaseClient? by lazy {
        if (!BuildConfig.SUPABASE_URL.startsWith("https://") || BuildConfig.SUPABASE_ANON_KEY.isBlank()) null
        else createSupabaseClient(BuildConfig.SUPABASE_URL, BuildConfig.SUPABASE_ANON_KEY) {
            install(Auth)
            install(Postgrest)
        }
    }
}
