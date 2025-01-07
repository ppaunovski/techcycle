package com.techcycle.domain

import com.techcycle.domain.enums.NotificationType
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant

@Entity
@Table(name = "notifications", schema = "public")
data class Notification (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id", nullable = false)
    var id: Long = 0,

    @Column(name = "notification_type", nullable = false)
    @Enumerated(EnumType.STRING)
    var type: NotificationType,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User,

    @Column(name = "title", length = 200)
    var title: String,

    @Column(name = "content", length = Integer.MAX_VALUE)
    var content: String?,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "data")
    var data: MutableMap<String, Any>?,

    @ColumnDefault("false")
    @Column(name = "is_read")
    var read: Boolean = false,

    @Column(name = "read_at")
    var readAt: Instant? = null,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant
)