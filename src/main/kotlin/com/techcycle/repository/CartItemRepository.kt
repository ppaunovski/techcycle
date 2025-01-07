package com.techcycle.repository

import com.techcycle.domain.CartItem
import com.techcycle.domain.Product
import com.techcycle.domain.ShoppingCart
import org.springframework.data.jpa.repository.JpaRepository

interface CartItemRepository: JpaRepository<CartItem, Long> {
    fun findByCartAndProduct(cart: ShoppingCart, product: Product): CartItem?

    fun findAllByCart(cart: ShoppingCart): List<CartItem>
}