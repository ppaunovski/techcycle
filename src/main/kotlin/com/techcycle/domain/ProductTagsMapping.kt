package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "product_tags_mapping", schema = "public")
data class ProductTagsMapping (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_tags_mapping_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    var product: Product,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    var tag: ProductTag,
)