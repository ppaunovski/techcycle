package com.techcycle.api

import com.techcycle.api.request.AddToCartRequest
import com.techcycle.service.CartService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/cart")
class CartController(
    private val service: CartService
) {
    @PostMapping
    fun addToCart(@RequestBody request: AddToCartRequest) = service.addToCart(request)

    @GetMapping("/{id}")
    fun getCart(@PathVariable("id") id: Long) = service.findCart(id)

    @PatchMapping("/{id}/items/{itemId}")
    fun updateCartItem(
        @PathVariable("id") id: Long,
        @PathVariable("itemId") itemId: Long,
        @RequestBody quantity: Int
    ) = service.updateCartItem(id, itemId, quantity)

    @DeleteMapping("/{id}/items/{itemId}")
    fun deleteCartItem(@PathVariable id: Long, @PathVariable itemId: Long) = service.deleteCartItem(id, itemId)

    @GetMapping("/{id}/order-info")
    fun getOrderInfoFromCart(@PathVariable id: Long) = service.getOrderInfoFromCart(cartId = id)
}