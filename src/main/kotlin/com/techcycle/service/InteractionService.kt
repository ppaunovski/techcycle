package com.techcycle.service

import com.techcycle.api.request.InteractionRequest
import com.techcycle.domain.Product
import com.techcycle.domain.User
import com.techcycle.domain.UserProductInteraction
import com.techcycle.domain.enums.InteractionType
import com.techcycle.repository.InteractionRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class InteractionService(
    private val interactionRepository: InteractionRepository,
    private val productService: ProductService
) {
    fun processInteractions(interactionRequest: List<InteractionRequest>) {
        val user = when(val principal = SecurityContextHolder.getContext().authentication.principal) {
            is UserDetails -> principal as User
            else -> throw RuntimeException("Unexpected principal")
        }

        interactionRequest.forEach {
            interactionRepository.save(UserProductInteraction(
                user = user,
                createdAt = it.startDate,
                product = productService.findById(it.productId) ?: throw RuntimeException("Product not found"),
                duration = it.endDate.epochSecond - it.startDate.epochSecond,
                interactionType = it.interactionType,
                source = ""
            ))
        }
    }

    fun saveInteraction(interactionType: InteractionType, product: Product, user: User) {
        interactionRepository.save(UserProductInteraction(
            user = user,
            createdAt = Instant.now(),
            product = product,
            duration = 0L,
            interactionType = interactionType,
            source = ""
        ))
    }

}
