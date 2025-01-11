package com.techcycle.service

import com.techcycle.domain.*
import com.techcycle.domain.enums.CartStatus
import com.techcycle.domain.enums.InteractionType
import com.techcycle.domain.enums.OrderStatus
import com.techcycle.domain.enums.PaymentMethod
import com.techcycle.repository.*
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import kotlin.random.Random

@Service
class DataSimulator(
    private val userRepository: UserRepository,
    private val addressRepository: AddressRepository,
    private val cartService: CartService,
    private val cartRepository: CartRepository,
    private val productRepository: ProductRepository,
    private val cartItemRepository: CartItemRepository,
    private val orderService: OrderService,
    private val orderRepository: OrderRepository,
    private val orderStatusHistoryRepository: OrderStatusHistoryRepository,
    private val interactionService: InteractionService,
    private val orderItemRepository: OrderItemRepository,
    private val encoder: PasswordEncoder,
) {

    @Transactional
    fun simulateData() {
        val startDate = LocalDateTime.of(2024, 1, 1, 0, 0)
        val endDate = LocalDateTime.of(2025, 1, 1, 0, 0)

        val users = userRepository.findAll().filter { !it.user.contains("delivery") && !it.user.contains("pavel") }
        val addressesPerUser = addressRepository.findAll().groupBy { it.user }
        val products = productRepository.findAll()

        val deliveryMen = userRepository.findAllByUserLikeIgnoreCase("delivery%")

        try {
            users.forEach { user ->
                val controlledRandom = ControlledRandom(Random.nextInt(0, 8), 50)
                val randomDates = generateRandomDates(startDate, endDate, 50)

                randomDates.forEach { date ->
                    val cart = createShoppingCart(user, date)
                    val randomProducts = getRandomSubset(products)
                    val cartItems = createCartItems(cart, randomProducts, date)

                    val cartInfo = getOrderInfo(cartItems)

                    val order = placeOrder(
                        user = user,
                        date = date.toInstant(ZoneOffset.UTC),
                        cart = cart,
                        cartInfo = cartInfo,
                        address = addressesPerUser[user]!!.random(),
                        cartItems = cartItems
                    )
                    var lastDate = date
                    val isCancelled = controlledRandom.next()
                    if (isCancelled) {
                        order.status = OrderStatus.CANCELLED
                        orderRepository.save(order)
                        orderStatusHistoryRepository.save(OrderStatusHistory(
                            createdAt = lastDate.toInstant(ZoneOffset.UTC),
                            status = OrderStatus.CANCELLED,
                            order = order,
                            comment = resolveOrderStatusComment(OrderStatus.CANCELLED),
                            createdBy = user
                        ))
                    }
                    else {
                        OrderStatus.entries.forEach { orderStatus ->

                            if (orderStatus != OrderStatus.PENDING && orderStatus != OrderStatus.CANCELLED) {
                                order.status = orderStatus
                                orderRepository.save(order)
                                orderStatusHistoryRepository.save(OrderStatusHistory(
                                    createdAt = lastDate.toInstant(ZoneOffset.UTC),
                                    status = orderStatus,
                                    order = order,
                                    comment = resolveOrderStatusComment(orderStatus),
                                    createdBy = deliveryMen.random()
                                ))
                                lastDate = lastDate.plusDays(Random.nextLong(Random.nextLong(0,3),Random.nextLong(4,6)))
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            throw e
        }

        userRepository.findAll().map {
            it.passwordHash = encoder.encode("test")
            it
        }.let { userRepository.saveAll(it) }

    }

    fun getOrderInfo(cartItems: List<CartItem>): OrderInfoResponse {
        val subtotal = cartItems.sumOf { it.quantity * it.product.price.toDouble() }.toLong()
        val discount = 0L
        val tax = (subtotal - discount) * 0.11
        val total = subtotal - discount + tax
        val shippingCost = 0L
        return OrderInfoResponse(
            subtotal = subtotal,
            discount = discount,
            tax = tax.toLong(),
            total = total.toLong(),
            shippingCost = shippingCost
        )
    }

    private fun createCartItems(cart: ShoppingCart, randomProducts: List<Product>, date: LocalDateTime): List<CartItem> =
        randomProducts.map {
            CartItem(
                quantity = Random.nextLong(1,3),
                product = it,
                cart = cart,
                savedForLater = false,
                addedAt = date.toInstant(ZoneOffset.UTC)
            )
        }.map { cartItemRepository.save(it) }

    fun <T> getRandomSubset(inputList: List<T>, min: Int = 2, max: Int = 5): List<T> {
        require(min > 0 && max >= min) { "Invalid range for subset size" }
        require(inputList.size >= min) { "Input list must have at least $min items" }

        val subsetSize = Random.nextInt(min, max + 1) 
        return inputList.shuffled().take(subsetSize) 
    }

    fun generateRandomDates(startDate: LocalDateTime, endDate: LocalDateTime, count: Int): List<LocalDateTime> {
        val startEpoch = startDate.toEpochSecond(ZoneOffset.UTC)
        val endEpoch = endDate.toEpochSecond(ZoneOffset.UTC)

        return List(count) {
            val randomEpoch = Random.nextLong(startEpoch, endEpoch)
            LocalDateTime.ofEpochSecond(randomEpoch, 0, ZoneOffset.UTC)
        }
    }

    fun createShoppingCart(user: User, date: LocalDateTime): ShoppingCart =
        cartRepository.save(
            ShoppingCart(
                user = user,
                status = CartStatus.ACTIVE,
                createdAt = date.toInstant(ZoneOffset.UTC),
                updatedAt = date.toInstant(ZoneOffset.UTC)
            )
        )

    fun placeOrder(date: Instant, user: User, cartInfo: OrderInfoResponse, address: Address, cartItems: List<CartItem>, cart: ShoppingCart): Order {
        val order = orderRepository.save(
            Order(
                createdAt = date,
                updatedAt = date,
                user = user,
                status = OrderStatus.PENDING,
                notes = "",
                subtotal = cartInfo.subtotal.toBigDecimal(),
                ipAddress = "",
                shippingAddress = address,
                discountAmount = cartInfo.discount.toBigDecimal(),
                taxAmount = cartInfo.tax.toBigDecimal(),
                userAgent = null,
                shippingCost = cartInfo.shippingCost.toBigDecimal(),
                paymentMethod = PaymentMethod.entries.toTypedArray().random(),
                totalAmount = cartInfo.total.toBigDecimal()
            )
        )

        orderStatusHistoryRepository.save(
            OrderStatusHistory(
            createdAt = date,
            order = order,
            status = OrderStatus.PENDING,
            createdBy = user,
            comment = "Order Pending Approval from Store"
        )
        )

        cartItems.map {
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
        }.also { orderItemRepository.saveAll(it) }
        cart.status = CartStatus.ORDERED
        cartRepository.save(cart)
        return order
    }

    fun resolveOrderStatusComment(status: OrderStatus) =
        when (status) {
            OrderStatus.PENDING -> "Order Pending Approval from Store"
            OrderStatus.PROCESSING -> "Order is being processed"
            OrderStatus.SHIPPED -> "Order is shipping"
            OrderStatus.CANCELLED -> "Order cancelled"
            OrderStatus.DELIVERED -> "Order delivered"
        }
}

class ControlledRandom(private val x: Int, private val y: Int) {
    private var remainingTrue = x
    private var remainingTotal = y

    init {
        require(x in 0..y) { "x must be between 0 and y" }
    }

    fun next(): Boolean {
        if (remainingTotal <= 0) throw IllegalStateException("No more calls allowed")

        val result = if (remainingTrue > 0 && (remainingTrue.toDouble() / remainingTotal) >= Math.random()) {
            remainingTrue--
            true
        } else {
            false
        }
        remainingTotal--
        return result
    }
}