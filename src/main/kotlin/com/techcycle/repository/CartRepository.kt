package com.techcycle.repository

import com.techcycle.domain.ShoppingCart
import com.techcycle.domain.User
import com.techcycle.domain.enums.CartStatus
import org.springframework.data.jpa.repository.JpaRepository

interface CartRepository: JpaRepository<ShoppingCart, Long> {
    fun findByUserAndStatus(user: User, status: CartStatus): ShoppingCart?

}
