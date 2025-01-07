package com.techcycle.service

import com.techcycle.config.security.JwtConfiguration
import com.techcycle.domain.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*

@Service
class JwtService(
    private val jwtConfiguration: JwtConfiguration,
) {
    private val secretKey = Keys.hmacShaKeyFor(jwtConfiguration.secretKey.toByteArray())

    fun extractUsername(token: String): String?  = extractClaim(token, Claims::getSubject)

    fun generateAccessToken(
        extraClaims: Map<String, Any> = emptyMap(),
        user: User
    ): String =
        generateToken(
            extraClaims = extraClaims,
            userDetails = user,
            duration = jwtConfiguration.duration
        )

    fun generateRefreshToken(userDetails: UserDetails): String =
        generateToken(userDetails = userDetails, duration = jwtConfiguration.refreshDuration)

    fun generateToken(
        extraClaims: Map<String, Any> = emptyMap(),
        userDetails: UserDetails,
        duration: Long
    ): String =
        Jwts
            .builder()
            .claims()
            .subject(userDetails.username)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + duration))
            .add(extraClaims)
            .and()
            .signWith(secretKey)
            .compact()

    fun isTokenValid(
        token: String,
        userDetails: UserDetails
    ): Boolean = extractUsername(token) == userDetails.username && !isTokenExpired(token)

    private fun isTokenExpired(token: String): Boolean =
        extractClaim(token, Claims::getExpiration).before(Date())

    private fun <T> extractClaim(
        token: String,
        claimsResolver: (Claims) -> T,
    ): T = claimsResolver(extractAllClaimsFromToken(token))

    private fun extractAllClaimsFromToken(token: String): Claims =
        Jwts
            .parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
}