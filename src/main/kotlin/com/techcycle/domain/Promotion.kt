package com.techcycle.domain

import com.techcycle.domain.enums.PromotionType
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(name = "promotions", schema = "public")
data class Promotion (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id", nullable = false)
    var id: Long = 0,

    @Column(name = "promotion_type", nullable = false)
    @Enumerated(EnumType.STRING)
    var promotionType: PromotionType,

    @Column(name = "name", nullable = false, length = 100)
    var name: String,

    @Column(name = "description", length = Integer.MAX_VALUE)
    var description: String,

    @Column(name = "code", length = 50)
    var code: String,

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    var discountValue: BigDecimal?,

    @Column(name = "minimum_purchase", precision = 10, scale = 2)
    var minimumPurchase: BigDecimal?,

    @Column(name = "start_date", nullable = false)
    var startDate: Instant,

    @Column(name = "end_date", nullable = false)
    var endDate: Instant,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rules")
    var rules: MutableMap<String, Any>? = null,

    @ColumnDefault("true")
    @Column(name = "active")
    var active: Boolean = true,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant,
)