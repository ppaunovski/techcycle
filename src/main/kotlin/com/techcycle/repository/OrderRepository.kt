package com.techcycle.repository

import com.techcycle.domain.Order
import com.techcycle.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant
import java.time.LocalDateTime

interface OrderRepository: JpaRepository<Order, Long> {
    fun findAllByUser(user: User): List<Order>
    fun findAllByCreatedAtBetween(createdAt: Instant, createdAt2: Instant): List<Order>

}
