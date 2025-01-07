package com.techcycle.api

import com.techcycle.api.request.InteractionRequest
import com.techcycle.service.InteractionService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/interaction")
class UserProductInteractionController(
    private val service: InteractionService
) {
    @PostMapping
    fun processInteractions(@RequestBody interactionRequest: List<InteractionRequest>) = service.processInteractions(interactionRequest)
}