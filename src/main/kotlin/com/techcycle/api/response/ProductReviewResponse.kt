package com.techcycle.api.response

data class ProductReviewResponse(
    val id: Long,
    val rating: Long,
    val comment: String,
    val title: String,
    val user: String,
    val userName: String,
) {

}
