package com.techcycle.repository

import com.techcycle.domain.ProductTag
import org.springframework.data.jpa.repository.JpaRepository

interface TagsRepository: JpaRepository<ProductTag, Long> {
}