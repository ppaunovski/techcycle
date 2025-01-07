package com.techcycle.api

import com.techcycle.api.request.PlaceOrderRequest
import com.techcycle.service.OrderService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val service: OrderService
) {
    @GetMapping("/payment-methods")
    fun getPaymentMethods() = service.getPaymentMethods()

    @PostMapping
    fun placeOrder(@RequestBody request: PlaceOrderRequest, servletRequest: HttpServletRequest) =
        service.placeOrder(request, servletRequest)

    @GetMapping
    fun getOrdersForUser() = service.getOrdersForActiveUser()

    @GetMapping("/{id}/details")
    fun getOrderDetails(@PathVariable id: Long) = service.getOrderDetails(orderId = id)
}