package com.techcycle.service

import com.techcycle.repository.TagsRepository
import org.springframework.stereotype.Service

@Service
class TagsService(
    private val tagsRepository: TagsRepository
) {
    fun findAll() = tagsRepository.findAll()
}