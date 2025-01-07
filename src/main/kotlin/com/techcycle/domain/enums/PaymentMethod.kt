package com.techcycle.domain.enums

import jakarta.persistence.*
import java.math.BigDecimal

enum class PaymentMethod(var type: String) {
    CARD("Credit/Debit Card"),
    AT_DOOR("Pay at door")
}