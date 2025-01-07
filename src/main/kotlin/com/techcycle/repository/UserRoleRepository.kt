package com.techcycle.repository

import com.techcycle.domain.Role
import com.techcycle.domain.UserRole
import org.springframework.data.jpa.repository.JpaRepository

interface UserRoleRepository: JpaRepository<UserRole, Long> {
    fun findAllByRole(role: Role): List<UserRole>
}
