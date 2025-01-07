package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault

@Entity
@Table(name = "product_tags", schema = "public")
data class ProductTag (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id", nullable = false)
    var id: Long = 0,

    @Column(name = "name", nullable = false, length = 50)
    var name: String,

    @Column(name = "description", length = Integer.MAX_VALUE)
    var description: String,
)