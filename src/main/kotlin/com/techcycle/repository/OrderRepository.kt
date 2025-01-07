package com.techcycle.repository

import com.techcycle.domain.Order
import com.techcycle.domain.User
import org.springframework.data.jpa.repository.JpaRepository

interface OrderRepository: JpaRepository<Order, Long> {
    fun findAllByUser(user: User): List<Order>

}
