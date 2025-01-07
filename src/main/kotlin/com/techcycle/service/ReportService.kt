package com.techcycle.service

import com.techcycle.repository.OrderItemRepository
import com.techcycle.repository.OrderRepository
import com.techcycle.repository.ProductRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

enum class RegularReportType {
    MONTHLY_PERFORMANCE,
    CUSTOMER_SATISFACTION
}

enum class AdHocReportType {
    MARKET_ANALYSIS,
    INVENTORY_OPTIMIZATION
}

data class ReportResponse(
    val id: String,
    val type: String,
    val title: String,
    val generatedDate: LocalDateTime,
    val data: Map<String, Any>,
    val metadata: ReportMetadata
)

data class ReportMetadata(
    val reportType: String,
    val period: String? = null,
    val filters: Map<String, Any>? = null,
    val lastUpdated: LocalDateTime
)

@Service
class ReportService(
    private val productRepository: ProductRepository,
    private val orderRepository: OrderRepository,
    private val orderItemRepository: OrderItemRepository,
) {
    fun generateRegularReport(type: RegularReportType, startDate: Instant, endDate: Instant): ReportResponse {
        return when (type) {
            RegularReportType.MONTHLY_PERFORMANCE -> generateMonthlyPerformanceReport(startDate, endDate)
            RegularReportType.CUSTOMER_SATISFACTION -> generateCustomerSatisfactionReport(1,2)
        }
    }

    private fun generateCustomerSatisfactionReport(year: Int, month: Int): ReportResponse {
        TODO("Not yet implemented")
    }

    fun generateAdHocReport(
        type: AdHocReportType,
        startDate: LocalDate?,
        endDate: LocalDate?,
        filters: Map<String, String>?
    ): ReportResponse {
        return when (type) {
            AdHocReportType.MARKET_ANALYSIS -> generateMarketAnalysisReport(startDate, endDate, filters)
            AdHocReportType.INVENTORY_OPTIMIZATION -> generateInventoryOptimizationReport(startDate, endDate, filters)
        }
    }

    private fun generateInventoryOptimizationReport(
        startDate: LocalDate?,
        endDate: LocalDate?,
        filters: Map<String, String>?
    ): ReportResponse {
        TODO("Not yet implemented")
    }

    private fun generateMarketAnalysisReport(
        startDate: LocalDate?,
        endDate: LocalDate?,
        filters: Map<String, String>?
    ): ReportResponse {
        TODO("Not yet implemented")
    }

    fun generateMonthlyPerformanceReport(startDate: Instant, endDate: Instant): ReportResponse {
        // Fetch orders for the specified month
        val monthlyOrders = orderRepository.findAllByCreatedAtBetween(
            startDate,
            endDate
        )

        // Calculate key metrics
        val totalOrders = monthlyOrders.size
        val totalRevenue = monthlyOrders.flatMap { orderItemRepository.findAllByOrder(it) }
            .sumOf { it.priceAtTime * it.quantity.toBigDecimal() }


        val totalItems = monthlyOrders.flatMap { orderItemRepository.findAllByOrder(it) }
            .sumOf { it.quantity }

        val avgOrderValue = if (totalOrders > 0) totalRevenue / totalOrders.toBigDecimal() else 0.0

        // Calculate daily metrics
        val dailyRevenue = monthlyOrders.groupBy { LocalDateTime.from(it.createdAt) }
            .mapValues { (_, orders) ->
                orders.flatMap { orderItemRepository.findAllByOrder(it) }
                    .sumOf { it.priceAtTime * it.quantity.toBigDecimal() }
            }

        // Calculate top-selling products
        val topProducts = monthlyOrders.flatMap { orderItemRepository.findAllByOrder(it) }
            .groupBy { it.product.id }
            .mapValues { (_, items) -> items.sumOf { it.quantity } }
            .entries.sortedByDescending { it.value }
            .take(5)
            .associate { it.key to it.value }

        // Prepare report data
        val reportData = mapOf(
            "totalOrders" to totalOrders,
            "totalRevenue" to totalRevenue,
            "totalItems" to totalItems,
            "averageOrderValue" to avgOrderValue,
            "dailyRevenue" to dailyRevenue,
            "topSellingProducts" to topProducts
        )

        // Create metadata
        val metadata = ReportMetadata(
            reportType = RegularReportType.MONTHLY_PERFORMANCE.toString(),
            period = "${LocalDateTime.from(startDate).year}-${LocalDateTime.from(startDate).month.toString().padStart(2, '0')}",
            lastUpdated = LocalDateTime.now()
        )

        return ReportResponse(
            id = UUID.randomUUID().toString(),
            type = "REGULAR",
            title = "Monthly Performance Report - ${LocalDateTime.from(startDate).month} ${LocalDateTime.from(startDate).year}",
            generatedDate = LocalDateTime.now(),
            data = reportData,
            metadata = metadata
        )
    }
}