package com.techcycle.repository

import com.techcycle.domain.Notification
import com.techcycle.domain.User
import org.springframework.data.jpa.repository.JpaRepository

interface NotificationRepository: JpaRepository<Notification, Long> {
    fun findAllByUserAndReadIsFalse(user: User): List<Notification>
}
