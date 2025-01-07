package com.techcycle.repository

import com.techcycle.domain.Product
import com.techcycle.domain.ProductImage
import org.springframework.data.jpa.repository.JpaRepository

interface ImagesRepository: JpaRepository<ProductImage, Int> {
    fun findAllByProduct(product: Product): List<ProductImage>
    fun findByProductAndIsPrimary(product: Product, isPrimary: Boolean): ProductImage?

}
