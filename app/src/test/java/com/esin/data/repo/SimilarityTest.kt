package com.esin.data.repo

import org.junit.Assert.assertEquals
import org.junit.Test

class SimilarityTest {
    @Test fun scoreIsBoundedAndHandlesEmpty() {
        assertEquals(0, Similarity.scorePercent(5, 0, 0))
        assertEquals(100, Similarity.scorePercent(999, 10, 10))
        assertEquals(50, Similarity.scorePercent(75, 10, 10))
        assertEquals(0, Similarity.scorePercent(-1, 10, 10))
    }
    @Test fun genreUsesTfIdfAndHandlesZeroVectors() {
        val a = mapOf("Electronic" to 4, "Jazz" to 1)
        val b = mapOf("Electronic" to 4, "Jazz" to 1)
        assertEquals(100, Similarity.genrePercent(a, b, listOf(a, b)))
        assertEquals(0, Similarity.genrePercent(a, emptyMap(), listOf(a, emptyMap())))
        assertEquals(0, Similarity.genrePercent(a, mapOf("Rock" to 1), listOf(a, mapOf("Rock" to 1))))
    }
}
