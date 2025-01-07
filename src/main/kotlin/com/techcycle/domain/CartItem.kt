package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "cart_items", schema = "public")
data class CartItem (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_items_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    var cart: ShoppingCart,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    var product: Product,

    @Column(name = "quantity", nullable = false)
    var quantity: Long,

    @ColumnDefault("false")
    @Column(name = "saved_for_later")
    var savedForLater: Boolean = false,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "added_at")
    var addedAt: Instant,
)