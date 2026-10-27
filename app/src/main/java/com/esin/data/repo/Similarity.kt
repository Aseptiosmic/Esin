package com.esin.data.repo

import kotlin.math.ln
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sqrt

object Similarity {
    fun scorePercent(score: Int, trackCount: Int, artistCount: Int): Int {
        val maxScore = 10L * trackCount.coerceAtLeast(0) + 5L * artistCount.coerceAtLeast(0)
        if (maxScore == 0L) return 0
        return (score.coerceAtLeast(0).toLong() * 100L / maxScore).coerceIn(0, 100).toInt()
    }
    // Document frequencies include the current user and every profile returned by the RPC.
    fun genrePercent(mine: Map<String, Int>, other: Map<String, Int>, corpus: List<Map<String, Int>>): Int {
        val terms = mine.keys + other.keys
        if (terms.isEmpty() || corpus.isEmpty()) return 0
        var dot = 0.0; var normA = 0.0; var normB = 0.0
        for (genre in terms) {
            val df = corpus.count { (it[genre] ?: 0) > 0 }
            val idf = ln((corpus.size + 1.0) / (df + 1.0)) + 1.0
            val a = (mine[genre] ?: 0).coerceAtLeast(0).toDouble() * idf
            val b = (other[genre] ?: 0).coerceAtLeast(0).toDouble() * idf
            dot += a * b; normA += a * a; normB += b * b
        }
        if (normA == 0.0 || normB == 0.0) return 0
        return (min(1.0, dot / (sqrt(normA) * sqrt(normB))) * 100).roundToInt().coerceIn(0, 100)
    }
}
