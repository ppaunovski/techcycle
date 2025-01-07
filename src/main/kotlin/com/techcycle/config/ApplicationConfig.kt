package com.techcycle.config

import com.techcycle.repository.UserRepository
import com.techcycle.service.AuthService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.auditing.DateTimeProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.ZonedDateTime
import java.util.Optional.of

@Configuration
class ApplicationConfig(
    private val userRepository: UserRepository,
) {
    @Bean
    fun userDetailsService(): UserDetailsService =
        UserDetailsService {
            email -> userRepository.findByEmail(email)
        }

    @Bean
    fun authenticationProvider(userRepository: UserRepository): AuthenticationProvider {
        val provider = DaoAuthenticationProvider()
        provider.setUserDetailsService(userDetailsService())
        provider.setPasswordEncoder(encoder())
        return provider
    }

    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager =
        config.authenticationManager

    @Bean // Makes ZonedDateTime compatible with auditing fields
    fun auditingDateTimeProvider()= DateTimeProvider { of(ZonedDateTime.now()) }
}