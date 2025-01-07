package com.techcycle.service

import com.techcycle.api.request.AddToCartRequest
import com.techcycle.api.response.CartItemResponse
import com.techcycle.api.response.CartResponse
import com.techcycle.api.response.MinimalCartResponse
import com.techcycle.domain.CartItem
import com.techcycle.domain.Product
import com.techcycle.domain.ShoppingCart
import com.techcycle.domain.User
import com.techcycle.domain.enums.CartStatus
import com.techcycle.repository.CartItemRepository
import com.techcycle.repository.CartRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class CartService(
    private val repository: CartRepository,
    private val cartItemRepository: CartItemRepository,
    private val userService: UserService,
    private val productService: ProductService,
    private val productImagesService: ProductImagesService
) {
    fun findCart(id: Long): CartResponse {
        return repository.findByIdOrNull(id)?.takeIf { it.status == CartStatus.ACTIVE }?.let { cart ->
            val cartItems = cartItemRepository.findAllByCart(cart)
            CartResponse(
                id = cart.id,
                items = cartItems
                    .map {
                        CartItemResponse(
                            id = it.id,
                            productId = it.product.id,
                            productName = it.product.name,
                            productImage = productImagesService.findPrimaryForProduct(it.product) ?: "".toByteArray(),
                            price = it.product.price.toDouble(),
                            stock = it.product.stockQuantity ?: 0,
                            quantity = it.quantity.toInt()
                        )
                    },
                totalItems = cartItems.sumOf { it.quantity.toInt() },
                totalPrice = cartItems.sumOf { it.quantity.toInt() * it.product.price.toInt() }
            )
        } ?: throw RuntimeException("Cart not found")

    }

    fun updateCartItem(id: Long, itemId: Long, quantity: Int): CartResponse {
        return cartItemRepository.findByIdOrNull(itemId)
            ?.takeIf { item ->  item.cart.id == id }?.let {
                it.quantity = quantity.toLong()
                cartItemRepository.saveAndFlush(it)
                findCart(id)
            } ?: throw RuntimeException("Cart item not found")
    }

    fun deleteCartItem(id: Long, itemId: Long): CartResponse {
        return cartItemRepository.findByIdOrNull(itemId)?.takeIf { it.cart.id == id }?.let {
            cartItemRepository.delete(it)
        }?.let { findCart(id) } ?: throw RuntimeException("Cart item not found")
    }

    fun addToCart(request: AddToCartRequest): MinimalCartResponse {
        val username = userService.getCurrentUserName()
        val user = userService.findUserByUsername(username)
        val product = productService.findById(request.productId) ?: throw RuntimeException("Product not found")

        return createOrUpdate(user, product, request.cartId, request.quantity)
    }

    private fun createOrUpdate(user: User?, product: Product, cartId: Long?, quantity: Int): MinimalCartResponse {
        val cart = if (cartId != null) {
            repository.findByIdOrNull(cartId)?.takeIf { it.user == user }?.let { cart ->
                val cartItem = cartItemRepository.findByCartAndProduct(cart, product)

                if (cartItem != null) {
                    cartItem.quantity += quantity
                    cartItemRepository.save(cartItem)
                }
                else {
                    cartItemRepository.save(CartItem(
                        cart = cart,
                        product = product,
                        quantity = quantity.toLong(),
                        addedAt = Instant.now()
                    ))
                }
                cart
            } ?: throw RuntimeException("Cart not found")
        } else {
            val cart = repository.save(ShoppingCart(
                user = user,
                createdAt = Instant.now(),
                updatedAt = Instant.now(),
                status = CartStatus.ACTIVE
            ))

            val cartItem = cartItemRepository.save(CartItem(
                cart = cart,
                product = product,
                quantity = quantity.toLong(),
                addedAt = Instant.now()
            ))
            cart
        }
        return MinimalCartResponse(
            id = cart.id,
            productCount = cartItemRepository.findAllByCart(cart).count().toLong(),
            totalCount = cartItemRepository.findAllByCart(cart).sumOf { it.quantity }
        )
    }

    fun findActiveCartByUser(user: User): ShoppingCart =
        repository.findByUserAndStatus(user, CartStatus.ACTIVE) ?: repository.save(ShoppingCart(
            user = user,
            createdAt = Instant.now(),
            updatedAt = Instant.now(),
            status = CartStatus.ACTIVE
        ))

    fun getOrderInfoFromCart(cartId: Long): OrderInfoResponse =
        findCart(cartId).let { cart ->
            val subtotal = cart.totalPrice
            val discount = 0L
            val tax = (subtotal - discount) * 0.11
            val total = subtotal - discount + tax
            val shippingCost = 0L
            OrderInfoResponse(
                subtotal = subtotal.toLong(),
                discount = discount,
                tax = tax.toLong(),
                total = total.toLong(),
                shippingCost = shippingCost
            )

        }
}

data class OrderInfoResponse(
    val subtotal: Long,
    val total: Long,
    val tax: Long,
    val discount: Long,
    val shippingCost: Long,
) {

}
