package com.techcycle.repository

import com.techcycle.domain.ProductTag
import org.springframework.data.jpa.repository.JpaRepository

interface ProductTagRepository : JpaRepository<ProductTag, Long> {
    fun findAllByNameIn(names: List<String>): List<ProductTag>
}