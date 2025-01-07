package com.techcycle.api.request

data class RegisterRequest (
    val firstName: String,
    val lastName: String,
    val email: String,
    val registerPassword: String,
    val confirmPassword: String
)
