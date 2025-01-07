package com.techcycle.domain

import jakarta.persistence.*

@Table(name = "brands")
@Entity
data class Brand (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id", nullable = false)
    val id: Long = 0,

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "description")
    val description: String? = null,
)