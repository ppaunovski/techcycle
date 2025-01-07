package com.techcycle.repository

import com.techcycle.domain.ProductCategory
import org.springframework.data.jpa.repository.JpaRepository

interface ProductCategoryRepository: JpaRepository<ProductCategory, Long> {
    fun findAllByCategoryNameIn(names: List<String>): List<ProductCategory>
}
