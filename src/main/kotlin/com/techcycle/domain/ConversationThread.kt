package com.techcycle.domain

import com.techcycle.domain.enums.ConversationThreadStatus
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "conversation_threads", schema = "public")
data class ConversationThread (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thread_id", nullable = false)
    var id: Long = 0,

    @Column(name = "subject", length = 200)
    var subject: String,

    @Column(name = "status", length = 20)
    @Enumerated(EnumType.STRING)
    var status: ConversationThreadStatus = ConversationThreadStatus.OPEN,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    var createdBy: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    var assignedTo: User?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_order_id")
    var relatedOrder: Order,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    var updatedAt: Instant,
)