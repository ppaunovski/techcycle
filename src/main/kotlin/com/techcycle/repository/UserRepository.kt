package com.techcycle.repository

import com.techcycle.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface UserRepository: JpaRepository<User, Long> {
    fun existsByEmail(email: String): Boolean
    fun findByEmail(email: String): User?
    @Query(value = "select u from User u where u.user ilike :s")
    fun findAllByUserLikeIgnoreCase(s: String): List<User>
}
