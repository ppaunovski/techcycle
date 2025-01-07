package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(name = "roles", schema = "public")
data class Role (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id", nullable = false)
    var id: Long = 0,

    @Column(name = "role_name", nullable = false, length = 20)
    var roleName: String,

    @Column(name = "description", length = Integer.MAX_VALUE)
    var description: String? = null,
)