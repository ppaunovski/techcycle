package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "product_categories", schema = "public")
data class ProductCategory (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id", nullable = false)
    var id: Long = 0,

    @Column(name = "category_name", nullable = false, length = 50)
    var categoryName: String,

    @Column(name = "description", length = Integer.MAX_VALUE)
    var description: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_category_id")
    var parentCategory: ProductCategory? = null,

    @Column(name = "icon_url")
    var iconUrl: String? = null,

    @Column(name = "display_order")
    var displayOrder: Long? = null,

    @ColumnDefault("true")
    @Column(name = "is_active")
    var isActive: Boolean = true
)