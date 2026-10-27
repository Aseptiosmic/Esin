package com.esin.util

/** Pure update rule; a failed fetch is handled by VersionChecker's cached manifest. */
object UpdatePolicy {
    fun required(current: Long, minimum: Long, latest: Long, force: Boolean): Boolean =
        current < minimum || (current < latest && force)
    fun available(current: Long, latest: Long): Boolean = current < latest
}
