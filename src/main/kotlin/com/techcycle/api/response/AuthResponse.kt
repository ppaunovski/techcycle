package com.techcycle.api.response

data class AuthResponse (
    val token: String,
    val username: String,
    val firstName: String,
    val lastName: String,
    val cartId: Long,
)