package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "addresses", schema = "public")
data class Address (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User,

    @Column(name = "street_address", nullable = false, length = Integer.MAX_VALUE)
    var streetAddress: String,

    @Column(name = "city", nullable = false, length = 100)
    var city: String,

    @Column(name = "state", length = 100)
    var state: String,

    @Column(name = "postal_code", length = 20)
    var postalCode: String,

    @Column(name = "country", nullable = false, length = 100)
    var country: String
)