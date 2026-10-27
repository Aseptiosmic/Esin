package com.esin.util

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class UpdatePolicyTest {
    @Test fun forcedAndMinimumVersionsBlock() {
        assertTrue(UpdatePolicy.required(1, 2, 2, false))
        assertTrue(UpdatePolicy.required(1, 1, 2, true))
        assertFalse(UpdatePolicy.required(2, 1, 2, true))
        assertFalse(UpdatePolicy.required(1, 1, 2, false))
        assertTrue(UpdatePolicy.available(1, 2))
        assertFalse(UpdatePolicy.available(2, 2))
    }
}
