package com.techcycle.api.response

class ProductImageResponse(
    val imageUrl: String,
    val bytes: ByteArray,
    val url: String,
    val isPrimary: Boolean
) {

}
