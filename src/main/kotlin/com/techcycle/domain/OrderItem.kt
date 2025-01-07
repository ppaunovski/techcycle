package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.math.BigDecimal

@Entity
@Table(name = "order_items", schema = "public")
data class OrderItem (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_items_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    var order: Order,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    var product: Product,

    @Column(name = "quantity", nullable = false)
    var quantity: Long,

    @Column(name = "price_at_time", nullable = false, precision = 10, scale = 2)
    var priceAtTime: BigDecimal,

    @ColumnDefault("0")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    var discountAmount: BigDecimal,

    @ColumnDefault("0")
    @Column(name = "tax_amount", precision = 10, scale = 2)
    var taxAmount: BigDecimal,

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    var totalAmount: BigDecimal,
)