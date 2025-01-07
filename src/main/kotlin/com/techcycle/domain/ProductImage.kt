package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "product_images", schema = "public")
data class ProductImage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    var product: Product,

    @Column(name = "image_url", nullable = false)
    var imageUrl: String,

    @Column(name = "bytes")
    var bytes: ByteArray,

    @Column(name = "alt_text", length = 100)
    var altText: String,

    @Column(name = "title", length = 100)
    var title: String,

    @Column(name = "display_order")
    var displayOrder: Long,

    @ColumnDefault("false")
    @Column(name = "is_primary")
    var isPrimary: Boolean,
)