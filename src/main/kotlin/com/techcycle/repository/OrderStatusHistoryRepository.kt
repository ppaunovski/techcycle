package com.techcycle.repository

import com.techcycle.domain.Order
import com.techcycle.domain.OrderStatusHistory
import org.springframework.data.jpa.repository.JpaRepository

interface OrderStatusHistoryRepository: JpaRepository<OrderStatusHistory, Long> {
    fun findAllByOrderOrderByIdDesc(order: Order): List<OrderStatusHistory>

}
