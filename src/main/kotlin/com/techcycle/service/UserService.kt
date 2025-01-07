package com.techcycle.service

import com.techcycle.domain.User
import com.techcycle.repository.RoleRepository
import com.techcycle.repository.UserRepository
import com.techcycle.repository.UserRoleRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val userRoleRepository: UserRoleRepository,
    private val roleRepository: RoleRepository
) {
    fun findUserByUsername(username: String): User? = userRepository.findByEmail(username)

    fun getCurrentUserName(): String {
        val authentication = SecurityContextHolder.getContext().authentication
        return when (val principal = authentication.principal) {
            is UserDetails -> principal.username
            is String -> principal // In case of a simple String principal (e.g., for basic authentication)
            else -> throw IllegalStateException("Principal is not valid")
        }
    }

    fun findAllAdmins(): List<User> {
        val role = roleRepository.findByRoleName("ROLE_ADMIN")!!
        return userRoleRepository.findAllByRole(role).map { it.user }
    }
}