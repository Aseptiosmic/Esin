package com.esin.data.remote

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

@Serializable data class AudiusUser(val id: String? = null, val name: String? = null, val handle: String? = null)
@Serializable data class Artwork(
    @SerialName("150x150") val small: String? = null,
    @SerialName("480x480") val medium: String? = null,
    @SerialName("1000x1000") val large: String? = null,
)
@Serializable data class AudiusTrack(
    val id: String? = null, val title: String? = null, val user: AudiusUser? = null,
    val artwork: Artwork? = null, val genre: String? = null, val mood: String? = null,
    val duration: Int? = null, val permalink: String? = null,
    @SerialName("is_streamable") val isStreamable: Boolean? = null,
    @SerialName("is_stream_gated") val isStreamGated: Boolean? = null,
    @SerialName("has_stream_access") val hasStreamAccess: Boolean? = null,
    @SerialName("stream_conditions") val streamConditions: JsonElement? = null,
    val access: JsonElement? = null,
)
@Serializable data class TrackListResponse(val data: List<AudiusTrack>? = null)
@Serializable data class TrackResponse(val data: AudiusTrack? = null)
@Serializable data class StreamResponse(val data: String? = null)

interface AudiusApi {
    @GET("tracks/trending") suspend fun trending(@Query("limit") limit: Int = 20): TrackListResponse
    @GET("tracks/search") suspend fun search(@Query("query") query: String, @Query("limit") limit: Int = 20): TrackListResponse
    @GET("tracks/{id}") suspend fun track(@Path("id") id: String): TrackResponse
    @GET("tracks/{id}/stream") suspend fun stream(@Path("id") id: String, @Query("no_redirect") noRedirect: Boolean = true): StreamResponse
}
