package com.techcycle.domain

import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.time.Instant

@Entity
@Table(name = "users", schema = "public")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    var id: Long = 0,

    @Column(name = "username", nullable = false, length = 50)
    var user: String,

    @Column(name = "password", nullable = false)
    var passwordHash: String,

    @Column(name = "email", nullable = false, length = 100)
    var email: String,

    @Column(name = "first_name", length = 50)
    var firstName: String,

    @Column(name = "last_name", length = 50)
    var lastName: String,

    @Column(name = "phone_number", length = 20)
    var phoneNumber: String? = null,

    @Column(name = "avatar_url")
    var avatarUrl: String? = null,

    @Column(name = "last_login")
    var lastLogin: Instant? = null,

    @ColumnDefault("0")
    @Column(name = "failed_login_attempts")
    var failedLoginAttempts: Long? = null,

    @ColumnDefault("'ACTIVE'")
    @Column(name = "account_status", length = 20)
    var accountStatus: String? = null,

    @ColumnDefault("false")
    @Column(name = "email_verified")
    var emailVerified: Boolean? = false,

    @ColumnDefault("false")
    @Column(name = "two_factor_enabled")
    var twoFactorEnabled: Boolean? = false,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferences")
    var preferences: MutableMap<String, Any>? = null,

    @Column(name = "created_at")
    @CreatedDate
    var createdAt: Instant? = null,

    @Column(name = "updated_at")
    @LastModifiedDate
    var updatedAt: Instant? = null,

    @OneToMany(
        mappedBy = "user",
        cascade = [CascadeType.ALL],
        fetch = FetchType.EAGER
    ) var roles: MutableSet<UserRole> = mutableSetOf(),
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return roles.map { SimpleGrantedAuthority(it.role.roleName) }.toMutableList()
    }

    override fun getPassword(): String {
        return passwordHash
    }

    override fun getUsername(): String {
        return user
    }

}