package com.techcycle.repository

import com.techcycle.domain.User
import com.techcycle.domain.UserProductInteraction
import com.techcycle.domain.enums.InteractionType
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface InteractionRepository: JpaRepository<UserProductInteraction, Long> {
    fun findAllByUserAndInteractionTypeOrderByCreatedAtDesc(user: User, interactionType: InteractionType, pageable: Pageable): List<UserProductInteraction>
}
