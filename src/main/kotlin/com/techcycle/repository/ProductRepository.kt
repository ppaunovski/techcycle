package com.techcycle.repository

import com.techcycle.domain.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface ProductRepository: JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    fun findAllByFeaturedIsTrue(): List<Product>
}
