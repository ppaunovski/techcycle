package com.techcycle.repository

import com.techcycle.domain.Product
import com.techcycle.domain.ProductTag
import com.techcycle.domain.ProductTagsMapping
import org.springframework.data.jpa.repository.JpaRepository

interface ProductTagMappingRepository: JpaRepository<ProductTagsMapping, Long> {
    fun findAllByProduct(product: Product): List<ProductTagsMapping>
}