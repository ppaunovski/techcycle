package com.techcycle.service

import com.techcycle.repository.CategoriesRepository
import org.springframework.stereotype.Service

@Service
class CategoriesService(
    private val repository: CategoriesRepository
) {

    fun findAll() = repository.findAll()

}
