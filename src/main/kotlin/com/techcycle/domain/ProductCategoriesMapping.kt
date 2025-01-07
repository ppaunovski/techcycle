package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "product_categories_mapping", schema = "public")
data class ProductCategoriesMapping (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_categories_mapping_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    var product: Product,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    var category: ProductCategory,

    @ColumnDefault("false")
    @Column(name = "is_primary")
    var isPrimary: Boolean = false,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant
)