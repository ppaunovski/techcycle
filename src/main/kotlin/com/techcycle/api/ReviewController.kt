package com.techcycle.api

import com.techcycle.api.request.ReviewRequest
import com.techcycle.service.ProductReviewService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/reviews")
class ReviewController(
    private val reviewService: ProductReviewService
) {
    @PostMapping
    fun postReview(@RequestBody request: ReviewRequest) = reviewService.postReview(request)
}