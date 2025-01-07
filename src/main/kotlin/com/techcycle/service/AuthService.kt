package com.techcycle.service

import com.techcycle.api.request.AuthRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import com.techcycle.api.request.RegisterRequest
import com.techcycle.api.response.AuthResponse
import com.techcycle.domain.User
import com.techcycle.repository.UserRepository
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val repository: UserRepository,
    private val encoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val jwtService: JwtService,
    private val cartService: CartService,
) {
    fun authenticate(authRequest: AuthRequest): AuthResponse {
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    authRequest.username,
                    authRequest.password
                )
            )

        } catch (ex: Exception) {
            throw RuntimeException("Invalid user credentials")
        }

        val user = userDetailsService.loadUserByUsername(authRequest.username) as User
        val token = jwtService.generateAccessToken(user = user)

        return AuthResponse(
            token = token,
            username = user.user,
            lastName = user.lastName,
            firstName = user.firstName,
            cartId = cartService.findActiveCartByUser(user).id
        )
    }

    fun register(request: RegisterRequest): AuthResponse {
        with(request) {
            if (registerPassword != confirmPassword) throw RuntimeException("Passwords don't match")
            if (repository.existsByEmail(email)) throw RuntimeException("Email already registered")

            val user = repository.save(
                User(
                    email = email,
                    passwordHash = encoder.encode(registerPassword),
                    firstName = firstName,
                    lastName = lastName,
                    user = email,
                )
            )

            return authenticate(
                AuthRequest(
                    user.email,
                    user.passwordHash
                )
            )
        }
    }

    fun getStatus(): AuthStatusResponse = AuthStatusResponse(
        isAuthenticated = SecurityContextHolder.getContext().authentication.isAuthenticated
    )
}

data class AuthStatusResponse(
    val isAuthenticated: Boolean
) {

}
