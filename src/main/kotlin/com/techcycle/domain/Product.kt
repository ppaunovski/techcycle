package com.techcycle.domain

import com.techcycle.domain.enums.ProductStatus
import jakarta.persistence.*
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.math.BigDecimal
import java.time.LocalDate

@Entity
@Table(name = "products", schema = "public")
data class Product (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false)
    var id: Long = 0,

    @Column(name = "name", nullable = false, length = 100)
    var name: String,

    @Column(name = "description", length = Integer.MAX_VALUE)
    var description: String,

    @Column(name = "detailed_description", length = Integer.MAX_VALUE)
    var detailedDescription: String? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "technical_specs")
    var technicalSpecs: MutableMap<String, Any>? = null,

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    var price: BigDecimal,

    @Column(name = "stock_quantity", nullable = false)
    var stockQuantity: Long? = null,

    @ColumnDefault("5")
    @Column(name = "low_stock_threshold")
    var lowStockThreshold: Long? = null,

    @Column(name = "condition", nullable = false, length = 20)
    var condition: String? = null,

    @Column(name = "warranty_info", length = Integer.MAX_VALUE)
    var warrantyInfo: String? = null,

    @ManyToOne
    @JoinColumn(name = "brand_id")
    var brand: Brand? = null,

    @Column(name = "model_number", length = 50)
    var modelNumber: String? = null,

    @Column(name = "manufacturing_date")
    var manufacturingDate: LocalDate? = null,

    @Column(name = "weight", precision = 10, scale = 2)
    var weight: BigDecimal? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dimensions")
    var dimensions: MutableMap<String, Any>? = null,

    @ColumnDefault("false")
    @Column(name = "is_featured")
    var featured: Boolean = false,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    var status: ProductStatus = ProductStatus.ACTIVE,

    @OneToMany(
        mappedBy = "product",
        fetch = FetchType.LAZY
    ) val productCategoriesMappings: List<ProductCategoriesMapping>,

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    val productTagsMappings: List<ProductTagsMapping>
)