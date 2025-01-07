package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant

@Entity
@Table(name = "search_logs", schema = "public")
data class SearchLog (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "search_id", nullable = false)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    var user: User? = null,

    @Column(name = "search_query", length = Integer.MAX_VALUE)
    var searchQuery: String,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "filters")
    var filters: MutableMap<String, Any>? = null,

    @Column(name = "results_count")
    var resultsCount: Long,

    @Column(name = "session_id", length = 100)
    var sessionId: String? = null,

    @Column(name = "results")
    @JdbcTypeCode(SqlTypes.JSON)
    var results: Map<String, Any>? = null,

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    var createdAt: Instant,
)