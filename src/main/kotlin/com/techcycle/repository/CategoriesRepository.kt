package com.techcycle.repository

import com.techcycle.domain.ProductCategory
import org.springframework.data.jpa.repository.JpaRepository

interface CategoriesRepository: JpaRepository<ProductCategory, Long> {

}
