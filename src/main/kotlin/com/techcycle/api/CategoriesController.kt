package com.techcycle.api

import com.techcycle.service.CategoriesService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoriesController(
    private val service: CategoriesService
) {
    @GetMapping
    fun getAll() = service.findAll()
}