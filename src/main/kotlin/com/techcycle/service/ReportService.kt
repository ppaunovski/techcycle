package com.techcycle.service

import com.techcycle.repository.MonthlySalesViewRepository
import com.techcycle.repository.OrderItemRepository
import com.techcycle.repository.OrderRepository
import com.techcycle.repository.ProductRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

enum class RegularReportType {
    MONTHLY_PERFORMANCE,
    CUSTOMER_ANALYTICS
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

data class CustomerAnalyticsReport(
    
    val customerSegmentation: List<CustomerSegment>,
    
    val averageOrderValue: Double,
    
    val topCities: List<CityOrderStats>,
    
    val paymentMethodDistribution: List<PaymentMethodStats>,
    
    val topCustomersByValue: List<CustomerValue>
)

data class CustomerSegment(
    val userId: Long,
    val firstName: String,
    val lastName: String,
    val orderCount: Int,
    val customerType: String  
)

data class CityOrderStats(
    val city: String,
    val orderCount: Long
)

data class PaymentMethodStats(
    val paymentMethod: String,
    val count: Long,
    val percentage: Double  
)

data class CustomerValue(
    val userId: Long,
    val firstName: String,
    val lastName: String,
    val lifetimeValue: Double
)


//data class ReportResponse(






//)

@Service
class ReportService(
    private val productRepository: ProductRepository,
    private val orderRepository: OrderRepository,
    private val orderItemRepository: OrderItemRepository,
    private val monthlySalesViewRepository: MonthlySalesViewRepository,
) {
    fun generateRegularReport(type: RegularReportType, startDate: Instant, endDate: Instant): ReportResponse {
        return when (type) {
            RegularReportType.MONTHLY_PERFORMANCE -> generateMonthlyPerformanceReport(startDate, endDate)
            RegularReportType.CUSTOMER_ANALYTICS -> generateCustomerSatisfactionReport(startDate, endDate)
        }
    }

    private fun generateCustomerSatisfactionReport(startDate: Instant, endDate: Instant): ReportResponse {
        val monthlyOrders = orderRepository.findAllByCreatedAtBetween(
            startDate,
            endDate
        )
        
        val customerSegmentation: List<CustomerSegment> = monthlyOrders.groupBy { it.user }
            .mapValues { ordersByUser ->
                val orderCount = ordersByUser.value.count()
                val customerType = if (orderCount > 1) "Returning" else "New"
                CustomerSegment(
                    customerType = customerType,
                    lastName = ordersByUser.key.lastName,
                    firstName = ordersByUser.key.firstName,
                    userId = ordersByUser.key.id,
                    orderCount = orderCount
                )
            }.map { it.value }
        
        val averageOrderValue: Double = monthlyOrders.map { it.totalAmount.toDouble() }.average()
        
        val topCities: List<CityOrderStats> = monthlyOrders.groupBy { it.shippingAddress.city }
            .mapValues {
                CityOrderStats(
                    city = it.key,
                    orderCount = it.value.count().toLong()
                )
            }.map { it.value }
        
        val paymentMethodDistribution: List<PaymentMethodStats> = monthlyOrders.groupBy { it.paymentMethod }
            .mapValues {
                PaymentMethodStats(
                    paymentMethod = it.key.type,
                    count = it.value.size.toLong(),
                    percentage = it.value.size * 100.0 / monthlyOrders.size
                )
            }.map { it.value }
        
        val topCustomersByValue: List<CustomerValue> = orderRepository.findAll().groupBy { it.user }
            .mapValues {
                CustomerValue(
                    userId = it.key.id,
                    lastName = it.key.lastName,
                    firstName = it.key.firstName,
                    lifetimeValue = it.value.sumOf { it.totalAmount.toDouble() }
                )
            }.map { it.value }
        val metadata = ReportMetadata(
            reportType = RegularReportType.MONTHLY_PERFORMANCE.toString(),
            period = "${LocalDateTime.ofInstant(startDate, ZoneId.systemDefault()).year}-${
                LocalDateTime.ofInstant(
                    startDate,
                    ZoneId.systemDefault()
                ).month.toString().padStart(2, '0')
            }",
            lastUpdated = LocalDateTime.now()
        )
        return ReportResponse(
            id = UUID.randomUUID().toString(),
            data = mapOf(
                "customerSegmentation" to customerSegmentation,
                "averageOrderValue" to averageOrderValue,
                "topCities" to topCities,
                "paymentMethodDistribution" to paymentMethodDistribution,
                "topCustomersByValue" to topCustomersByValue
            ),
            type = RegularReportType.CUSTOMER_ANALYTICS.toString(),
            title = "Customer Analytics Report - ${
                LocalDateTime.ofInstant(
                    startDate,
                    ZoneId.systemDefault()
                ).month
            } ${LocalDateTime.ofInstant(startDate, ZoneId.systemDefault()).year}",
            generatedDate = LocalDateTime.now(),
            metadata = metadata
        )
    }


    fun generateAdHocReport(
        type: AdHocReportType,
        startDate: Instant,
    ): ReportResponse {
        return when (type) {
            AdHocReportType.MARKET_ANALYSIS -> generateMarketAnalysisReport(startDate)
            AdHocReportType.INVENTORY_OPTIMIZATION -> generateInventoryOptimizationReport(startDate)
        }
    }

    private fun generateInventoryOptimizationReport(
        startDate: Instant,
    ): ReportResponse {
        val msvs = monthlySalesViewRepository.findAllOnYearlyBasis(
            LocalDateTime.ofInstant(
                startDate,
                ZoneId.systemDefault()
            ).year
        ).sortedBy { it.totalSales }.subList(0,5)
        val metadata = ReportMetadata(
            reportType = RegularReportType.MONTHLY_PERFORMANCE.toString(),
            period = "${LocalDateTime.ofInstant(startDate, ZoneId.systemDefault()).year}-${
                LocalDateTime.ofInstant(
                    startDate,
                    ZoneId.systemDefault()
                ).month.toString().padStart(2, '0')
            }",
            lastUpdated = LocalDateTime.now()
        )

        return ReportResponse(
            id = UUID.randomUUID().toString(),
            generatedDate = LocalDateTime.now(),
            type = AdHocReportType.INVENTORY_OPTIMIZATION.toString(),
            title = "Inventory Optimization Ad Hock Report - ${
                LocalDateTime.ofInstant(
                    startDate,
                    ZoneId.systemDefault()
                ).month
            } ${LocalDateTime.ofInstant(startDate, ZoneId.systemDefault()).year}",
            metadata = metadata,
            data = mapOf(
                "productsMonthlySale" to msvs
            )
        )
    }

    private fun generateMarketAnalysisReport(
        startDate: Instant,
    ): ReportResponse {
        TODO("Not yet implemented")
    }

    fun generateMonthlyPerformanceReport(startDate: Instant, endDate: Instant): ReportResponse {
        
        val monthlyOrders = orderRepository.findAllByCreatedAtBetween(
            startDate,
            endDate
        )

        
        val totalOrders = monthlyOrders.size
        val totalRevenue = monthlyOrders.flatMap { orderItemRepository.findAllByOrder(it) }
            .sumOf { it.priceAtTime * it.quantity.toBigDecimal() }


        val totalItems = monthlyOrders.flatMap { orderItemRepository.findAllByOrder(it) }
            .sumOf { it.quantity }

        val avgOrderValue = if (totalOrders > 0) totalRevenue / totalOrders.toBigDecimal() else 0.0

        
        val dailyRevenue = monthlyOrders.groupBy { LocalDateTime.ofInstant(it.createdAt, ZoneId.systemDefault()) }
            .mapValues { (_, orders) ->
                orders.flatMap { orderItemRepository.findAllByOrder(it) }
                    .sumOf { it.priceAtTime * it.quantity.toBigDecimal() }
            }

        
        val topProducts = monthlyOrders.flatMap { orderItemRepository.findAllByOrder(it) }
            .groupBy { it.product.id }
            .mapValues { (_, items) -> items.sumOf { it.quantity } }
            .entries.sortedByDescending { it.value }
            .take(5)
            .associate { it.key to it.value }

        
        val reportData = mapOf(
            "totalOrders" to totalOrders,
            "totalRevenue" to totalRevenue,
            "totalItems" to totalItems,
            "averageOrderValue" to avgOrderValue,
            "dailyRevenue" to dailyRevenue,
            "topSellingProducts" to topProducts
        )

        
        val metadata = ReportMetadata(
            reportType = RegularReportType.MONTHLY_PERFORMANCE.toString(),
            period = "${LocalDateTime.ofInstant(startDate, ZoneId.systemDefault()).year}-${
                LocalDateTime.ofInstant(
                    startDate,
                    ZoneId.systemDefault()
                ).month.toString().padStart(2, '0')
            }",
            lastUpdated = LocalDateTime.now()
        )

        return ReportResponse(
            id = UUID.randomUUID().toString(),
            type = "REGULAR",
            title = "Monthly Performance Report - ${
                LocalDateTime.ofInstant(
                    startDate,
                    ZoneId.systemDefault()
                ).month
            } ${LocalDateTime.ofInstant(startDate, ZoneId.systemDefault()).year}",
            generatedDate = LocalDateTime.now(),
            data = reportData,
            metadata = metadata
        )
    }
}