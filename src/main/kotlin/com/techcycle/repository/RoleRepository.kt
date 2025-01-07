package com.techcycle.repository

import com.techcycle.domain.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository: JpaRepository<Role, Long> {
    fun findByRoleName(name: String): Role?
}