package com.techcycle.domain

import com.techcycle.domain.enums.CartStatus
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "shopping_carts", schema = "public")
data class ShoppingCart (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User? = null,

    @Column(name = "session_id", length = 100)
    var sessionId: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    var status: CartStatus,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    var updatedAt: Instant,
)