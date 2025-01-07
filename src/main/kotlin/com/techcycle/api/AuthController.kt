package com.techcycle.api

import com.techcycle.api.request.AuthRequest
import com.techcycle.api.request.RegisterRequest
import com.techcycle.api.response.AuthResponse
import com.techcycle.service.AuthService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val service: AuthService,
) {
    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): AuthResponse = service.register(request)

    @PostMapping("/login")
    fun login (@RequestBody request: AuthRequest): AuthResponse = service.authenticate(request)

    @GetMapping
    fun test() = "OK"

    @GetMapping("/status")
    fun status() = service.getStatus()
}