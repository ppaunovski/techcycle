package com.techcycle.config.filters

import com.techcycle.service.JwtService
import io.jsonwebtoken.JwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserDetailsService,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt = request.getToken
        if (jwt == null) {
            filterChain.doFilter(request, response)
            return
        }
        val email = try {
            jwtService.extractUsername(jwt)
        } catch (e: JwtException) {
            filterChain.doFilter(request, response)
            throw RuntimeException("Unauthorized")
        }

        if (email != null && SecurityContextHolder.getContext().authentication == null) {
            val userDetails = userDetailsService.loadUserByUsername(email)

            if (jwtService.isTokenValid(jwt, userDetails)) {
                updateContext(userDetails, request)
            }

            filterChain.doFilter(request, response)
        }
    }

    private fun updateContext(
        userDetails: UserDetails,
        request: HttpServletRequest
    ) {
        val authToken = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

        SecurityContextHolder.getContext().authentication = authToken
    }
}

val HttpServletRequest.getToken: String?
    get() = getHeader(HttpHeaders.AUTHORIZATION)
        ?.takeIf { it.isNotBlank() && it.contains("Bearer ") }
        ?.substringAfter("Bearer ")