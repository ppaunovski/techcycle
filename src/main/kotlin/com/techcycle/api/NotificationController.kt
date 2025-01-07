package com.techcycle.api

import com.techcycle.domain.Notification
import com.techcycle.service.NotificationService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/notifications")
class NotificationController(
    private val service: NotificationService
) {
    @GetMapping
    fun getUnreadNotificationsForUser() = service.getUnreadNotificationsForActiveUser()
}