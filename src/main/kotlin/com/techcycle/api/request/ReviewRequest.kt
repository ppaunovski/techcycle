package com.techcycle.api.request

data class ReviewRequest(
    val productId: Long,
    val comment: String?,
    val rating: Int,
) {

}
