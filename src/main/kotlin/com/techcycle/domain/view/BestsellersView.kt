package com.techcycle.domain.view

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "bestsellers")
data class BestsellersView(
    @Column(name = "product_id")
    @Id
    var id: Long,
    @Column(name = "name")
    var name: String,
    @Column(name = "price")
    var price: BigDecimal,
    @Column(name = "description")
    var description: String,
    @Column(name = "condition")
    var condition: String,
    @Column(name = "brand_id")
    var brandId: Long?,
    @Column(name = "stock_quantity")
    var stockQuantity: Long,
    @Column(name = "total_units_sold")
    var totalUnitsSold: BigDecimal,
)