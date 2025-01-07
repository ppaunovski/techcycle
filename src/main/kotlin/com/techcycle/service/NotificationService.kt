package com.techcycle.service

import com.techcycle.api.response.NotificationResponse
import com.techcycle.domain.Notification
import com.techcycle.domain.Product
import com.techcycle.domain.User
import com.techcycle.domain.enums.NotificationType
import com.techcycle.repository.NotificationRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val userService: UserService
) {
    fun getUnreadNotificationsForActiveUser(): List<NotificationResponse> {
        val user = when(val principal = SecurityContextHolder.getContext().authentication.principal) {
            is UserDetails -> principal as User
            else -> return emptyList()
        }
        return notificationRepository.findAllByUserAndReadIsFalse(user).map {
            NotificationResponse(
                id = it.id,
                message = it.content ?: it.title,
                tittle = it.title,
            )
        }
    }

    fun notifyOutOfStock(product: Product) {
        userService.findAllAdmins().map { admin ->
            Notification(
                title = product.name + " is out of stock",
                type = NotificationType.MESSAGE,
                createdAt = Instant.now(),
                user = admin,
                data = null,
                read = false,
                readAt = null,
                content = null,
            )
        }.let { notificationRepository.saveAll(it) }
    }
}
