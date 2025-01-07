package com.techcycle.domain

import com.techcycle.domain.enums.OrderStatus
import com.techcycle.domain.enums.PaymentMethod
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(name = "orders", schema = "public")
data class Order (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User,

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    var paymentMethod: PaymentMethod,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id")
    var shippingAddress: Address,

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    var subtotal: BigDecimal,

    @Column(name = "shipping_cost", nullable = false, precision = 10, scale = 2)
    var shippingCost: BigDecimal,

    @Column(name = "tax_amount", nullable = false, precision = 10, scale = 2)
    var taxAmount: BigDecimal,

    @ColumnDefault("0")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    var discountAmount: BigDecimal,

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    var totalAmount: BigDecimal,

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    var status: OrderStatus,

    @Column(name = "notes", length = Integer.MAX_VALUE)
    var notes: String? = null,

    @Column(name = "ip_address", length = 45)
    var ipAddress: String? = null,

    @Column(name = "user_agent", length = Integer.MAX_VALUE)
    var userAgent: String? = null,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant? = null,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    var updatedAt: Instant? = null
)