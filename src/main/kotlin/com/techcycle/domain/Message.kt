package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "messages", schema = "public")
data class Message (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id")
    var thread: ConversationThread,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    var sender: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    var receiver: User,

    @Column(name = "message_text", nullable = false, length = Integer.MAX_VALUE)
    var messageText: String,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant,
)