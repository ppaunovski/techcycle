package com.techcycle.repository

import com.techcycle.domain.Product
import com.techcycle.domain.ProductCategoriesMapping
import com.techcycle.domain.ProductCategory
import org.springframework.data.jpa.repository.JpaRepository

interface ProductCategoriesMappingRepository: JpaRepository<ProductCategoriesMapping, Long> {
    fun findAllByProduct(it: Product): List<ProductCategoriesMapping>
}