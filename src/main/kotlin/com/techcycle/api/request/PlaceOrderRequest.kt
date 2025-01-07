package com.techcycle.api.request

data class PlaceOrderRequest(
    val street: String,
    val city: String,
    val state: String,
    val postalCode: String,
    val country: String,
    val paymentMethod: String,
    val notes: String? = null
) {

}
