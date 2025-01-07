package com.techcycle.service

import com.techcycle.api.request.PlaceOrderRequest
import com.techcycle.domain.*
import com.techcycle.domain.enums.CartStatus
import com.techcycle.domain.enums.InteractionType
import com.techcycle.domain.enums.OrderStatus
import com.techcycle.domain.enums.PaymentMethod
import com.techcycle.repository.*
import jakarta.servlet.http.HttpServletRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val cartService: CartService,
    private val addressRepository: AddressRepository,
    private val cartRepository: CartRepository,
    private val productRepository: ProductRepository,
    private val orderItemRepository: OrderItemRepository,
    private val cartItemRepository: CartItemRepository,
    private val productImagesService: ProductImagesService,
    private val orderStatusHistoryRepository: OrderStatusHistoryRepository,
    private val interactionService: InteractionService,
    private val notificationService: NotificationService,
) {
    fun getPaymentMethods() = PaymentMethod.entries.map { it.type }.toTypedArray()

    @Transactional
    fun placeOrder(request: PlaceOrderRequest, servletRequest: HttpServletRequest): OrderResponse {
        val user = when (val principal = SecurityContextHolder.getContext().authentication.principal) {
            is String -> throw RuntimeException("Unauthorized User")
            is UserDetails -> principal as User
            else -> throw RuntimeException("Unauthorized User")
        }
        val cart = cartService.findActiveCartByUser(user)
        val cartInfo = cartService.getOrderInfoFromCart(cart.id)

        val order = orderRepository.save(
            Order(
                createdAt = Instant.now(),
                updatedAt = Instant.now(),
                user = user,
                status = OrderStatus.PENDING,
                notes = request.notes,
                subtotal = cartInfo.subtotal.toBigDecimal(),
                ipAddress = servletRequest.remoteAddr,
                shippingAddress = addressRepository.save(
                    Address(
                        user = user,
                        city = request.city,
                        streetAddress = request.street,
                        postalCode = request.postalCode,
                        state = request.state,
                        country = request.country
                    )
                ),
                discountAmount = cartInfo.discount.toBigDecimal(),
                taxAmount = cartInfo.tax.toBigDecimal(),
                userAgent = null,
                shippingCost = cartInfo.shippingCost.toBigDecimal(),
                paymentMethod = PaymentMethod.entries.first { it.type == request.paymentMethod },
                totalAmount = cartInfo.total.toBigDecimal()
            )
        )

        orderStatusHistoryRepository.save(OrderStatusHistory(
            createdAt = Instant.now(),
            order = order,
            status = OrderStatus.PENDING,
            createdBy = user,
            comment = "Order Pending Approval from Store"
        ))

        cartItemRepository.findAllByCart(cart).map {
            interactionService.saveInteraction(interactionType = InteractionType.ORDERED, product = it.product, user = user)
            OrderItem(
                totalAmount = it.product.price * it.quantity.toBigDecimal(),
                discountAmount = 0.toBigDecimal(),
                taxAmount = it.product.price * 0.11.toBigDecimal(),
                quantity = it.quantity,
                product = it.product,
                order = order,
                priceAtTime = it.product.price,
            )
        }.also { orderItemRepository.saveAll(it) }.forEach { orderItem ->
            orderItem.product.stockQuantity = orderItem.product.stockQuantity?.minus(orderItem.quantity)
            if (orderItem.product.stockQuantity != null && orderItem.product.stockQuantity == 0L) {
                notificationService.notifyOutOfStock(orderItem.product)
            }
            productRepository.save(orderItem.product)
        }
        cart.status = CartStatus.ORDERED
        cartRepository.save(cart)
        return OrderResponse(
            status = order.status.toString(),
            createdAt = order.createdAt ?: Instant.now(),
            updatedAt = order.updatedAt ?: Instant.now(),
            orderInfo = cartInfo
        )
    }

    fun getOrdersForActiveUser(): List<OrderDisplayResponse> {
        val user = when (val principal = SecurityContextHolder.getContext().authentication.principal) {
            is String -> throw RuntimeException("Unauthorized User")
            is UserDetails -> principal as User
            else -> throw RuntimeException("Unauthorized User")
        }
        return orderRepository.findAllByUser(user).map { order ->
            OrderDisplayResponse(
                id = order.id,
                createdAt = order.createdAt ?: Instant.now(),
                updatedAt = order.updatedAt ?: Instant.now(),
                status = order.status,
                totalPrice = order.totalAmount.toDouble(),
                orderNumber = order.id.toString(),
                itemCount = orderItemRepository.findAllByOrder(order).count()
            )
        }
    }

    fun getOrderDetails(orderId: Long): OrderDetailsResponse? =
        orderRepository.findByIdOrNull(orderId)?.let { order ->
            OrderDetailsResponse(
                id = order.id,
                products = orderItemRepository.findAllByOrder(order)
                    .map {
                        orderItem -> OrderItemResponse(
                            id = orderItem.product.id.toString(),
                            quantity = orderItem.quantity.toInt(),
                            imageUrl = productImagesService.findPrimaryForProduct(orderItem.product) ?: "".toByteArray(),
                            name = orderItem.product.name,
                            price = orderItem.product.price,
                            description = orderItem.product.description,
                        )
                    },
                statusHistory = orderStatusHistoryRepository.findAllByOrderOrderByIdDesc(order).map { OrderStatusHistoryResponse(
                    createdAt = it.createdAt,
                    updatedAt = it.createdAt,
                    updatedBy = it.createdBy.username,
                    status =  it.status,
                    metadata = null,
                    comment = it.comment
                ) },
                shippingAddress = order.shippingAddress.let { AddressResponse(
                    city = it.city,
                    postalCode = it.postalCode,
                    state = it.state,
                    country = it.country,
                    street = it.streetAddress,
                ) },
                paymentMethod = order.paymentMethod,
                shippingCost = order.shippingCost,
                totalPrice = order.totalAmount,
                tax = order.taxAmount,
                subtotal = order.subtotal,
                discount = order.discountAmount
            )
        }

}
data class OrderItemResponse(
    val id: String,
    val name: String,
    val description: String,
    val price: Number,
    val imageUrl: ByteArray,
    val quantity: Int,
)
data class OrderDetailsResponse(
    val id: Long,
    val products: List<OrderItemResponse>,
    val statusHistory: List<OrderStatusHistoryResponse>,
    val shippingAddress: AddressResponse,
    val paymentMethod: PaymentMethod,
    val subtotal: BigDecimal,
    val tax: BigDecimal,
    val shippingCost: BigDecimal,
    val discount: BigDecimal,
    val totalPrice: BigDecimal,
) {

}

data class AddressResponse(
    val street: String,
    val postalCode: String,
    val state: String,
    val country: String,
    val city: String,
) {

}

data class OrderStatusHistoryResponse(
    val status: OrderStatus,
    val createdAt: Instant,
    val updatedAt: Instant,
    val comment: String?,
    val metadata: Map<String, Any>?,
    val updatedBy: String,
) {

}

data class OrderDisplayResponse(
    val id: Long,
    val createdAt: Instant,
    val updatedAt: Instant,
    val status: OrderStatus,
    val totalPrice: Double,
    val orderNumber: String,
    val itemCount: Int,
) {

}

data class OrderResponse(
    val status: String,
    val createdAt: Instant,
    val updatedAt: Instant,
    val orderInfo: OrderInfoResponse
) {

}
