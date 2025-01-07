package com.techcycle.domain

import com.techcycle.domain.enums.InteractionType
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "user_product_interactions", schema = "public")
data class UserProductInteraction (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interaction_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    var product: Product,

    @Column(name = "interaction_type", length = 20)
    @Enumerated(EnumType.STRING)
    var interactionType: InteractionType,

    @Column(name = "duration")
    var duration: Long,

    @Column(name = "source", length = 50)
    var source: String,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant,
)