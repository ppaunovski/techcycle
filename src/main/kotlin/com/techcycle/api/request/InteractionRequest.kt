package com.techcycle.api.request

import com.techcycle.domain.enums.InteractionType
import java.time.Instant

data class InteractionRequest(
    val interactionType: InteractionType,
    val startDate: Instant,
    val endDate: Instant,
    val productId: Long,
) {

}

