package com.techcycle.service

import com.techcycle.api.request.ReviewRequest
import com.techcycle.api.response.ProductReviewResponse
import com.techcycle.domain.ProductReview
import com.techcycle.domain.User
import com.techcycle.repository.ProductRepository
import com.techcycle.repository.ProductReviewRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDateTime

@Service
class ProductReviewService(
    private val productReviewRepository: ProductReviewRepository,
    private val productRepository: ProductRepository
) {

    fun getReviewsForProduct(productId: Long): List<ProductReviewResponse> {
        val product = productRepository.findByIdOrNull(productId) ?: return emptyList()
        return productReviewRepository.findAllByProduct(product).map {
            ProductReviewResponse(
                id = it.id,
                comment = it.comment,
                title = it.title,
                rating = it.rating,
                user = it.user.user,
                userName = it.user.user
            )
        }
    }

    fun postReview(request: ReviewRequest): ProductReviewResponse {
        val product = productRepository.findByIdOrNull(request.productId) ?: throw RuntimeException("Product not found")
        val user = when (val principal = SecurityContextHolder.getContext().authentication.principal) {
            is UserDetails -> principal as User
            else -> throw UsernameNotFoundException("User not found")
        }

        return productReviewRepository.save(ProductReview(
            product = product,
            user = user,
            title = request.comment ?: "",
            createdAt = Instant.now(),
            comment = request.comment ?: "No comment",
            rating = request.rating.toLong()
        )).let { ProductReviewResponse(
            id = it.id,
            comment = it.comment,
            title = it.title,
            rating = it.rating,
            user = it.user.user,
            userName = it.user.user
        ) }
    }

}
