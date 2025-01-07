package com.techcycle.repository

import com.techcycle.domain.Product
import com.techcycle.domain.ProductReview
import org.springframework.data.jpa.repository.JpaRepository

interface ProductReviewRepository: JpaRepository<ProductReview, Long> {
    fun findAllByProduct(product: Product): List<ProductReview>

}
