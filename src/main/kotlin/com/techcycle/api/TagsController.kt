package com.techcycle.api

import com.techcycle.service.TagsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tags")
class TagsController(
    private val service: TagsService
) {
    @GetMapping
    fun getTags() = service.findAll()
}