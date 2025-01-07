package com.techcycle.api.response

import com.techcycle.domain.CartItem
import com.techcycle.domain.Product
import java.time.Instant

data class CartResponse (
    val id: Long,
    val items: List<CartItemResponse>,
    val totalPrice: Int,
    val totalItems: Int,
) {

}

data class CartItemResponse (
    val id: Long,
    val productId: Long,
    val productName: String,
    val productImage: ByteArray,
    val quantity: Int,
    val price: Double,
    val stock: Long,
)
