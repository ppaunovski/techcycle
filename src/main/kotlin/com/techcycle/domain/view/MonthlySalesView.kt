package com.techcycle.domain.view

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "monthly_sales_chart", schema = "public")
data class MonthlySalesView(
    @Id
    @Column(name = "product_id")
    val productId: Long,
    @Column
    val product: String,
    @Column
    val month: String,
    @Column
    val year: BigDecimal?,
    @Column
    val totalSales: BigDecimal,
) {
}