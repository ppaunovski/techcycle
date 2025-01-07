package com.techcycle.api.request

data class AddToCartRequest(
    val productId: Long,
    val quantity: Int,
    val cartId: Long? = null
) {

}
