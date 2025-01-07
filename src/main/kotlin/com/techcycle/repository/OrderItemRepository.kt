package com.techcycle.repository

import com.techcycle.domain.Order
import com.techcycle.domain.OrderItem
import org.springframework.data.jpa.repository.JpaRepository

interface OrderItemRepository: JpaRepository<OrderItem, Long> {
    fun findAllByOrder(order: Order): List<OrderItem>
}