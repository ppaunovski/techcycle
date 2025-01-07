package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "user_roles", schema = "public")
data class UserRole (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_roles_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    var role: Role,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "assigned_at")
    var assignedAt: Instant,
)