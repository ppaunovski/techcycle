package com.techcycle.service

import com.techcycle.domain.*
import com.techcycle.repository.*
import jakarta.persistence.criteria.JoinType
import jakarta.persistence.criteria.Predicate
import org.springframework.data.domain.PageRequest
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

data class ProductResponse(
    val products: List<ProductDTO>,
    val totalPages: Int,
    val totalItems: Long
)

data class ProductDTO(
    val id: String,
    val name: String,
    val description: String,
    val price: Number,
    val imageUrl: ByteArray,
    val tags: List<String>,
    val quantity: Int,
)

fun Product.toDTO(tagsMappings: List<ProductTagsMapping> = emptyList(), bytes: ByteArray): ProductDTO = ProductDTO(
    id = this.id.toString(),
    name = this.name,
    description = this.description,
    price = this.price,
    imageUrl = bytes,
    tags = productTagsMappings.map { it.tag.name },
    quantity = stockQuantity?.toInt() ?: 0
)

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val categoryRepository: ProductCategoryRepository,
    private val tagRepository: ProductTagRepository,
    private val productTagMappingRepository: ProductTagMappingRepository,
    private val productCategoriesMappingRepository: ProductCategoriesMappingRepository,
    private val productImagesService: ProductImagesService,
    private val productReviewRepository: ProductReviewRepository,
) {
    fun findProducts(
        page: Int,
        size: Int,
        search: String?,
        categoryIds: List<Long>?,
        minPrice: Long?,
        maxPrice: Long?,
        tagIds: List<Long>?
    ): ProductResponse {
        val specification = ProductSpecification.findByFilters(
            search = search,
            categoryIds = categoryIds,
            minPrice = minPrice,
            maxPrice = maxPrice,
            tagIds = tagIds
        )

        val pageable = PageRequest.of(
            page - 1,
            size
        )


        val productPage = productRepository.findAll(specification, pageable)

        return ProductResponse(
            products = productPage.content.map {
                it.toDTO(
                    productTagMappingRepository.findAllByProduct(it),
                    productImagesService.findPrimaryForProduct(it) ?: "".toByteArray()
                )
            },
            totalPages = productPage.totalPages,
            totalItems = productPage.totalElements
        )
    }

    fun findById(productId: Long) = productRepository.findByIdOrNull(productId)
    fun getById(id: Long): ProductDetailsResponse {
        return findById(id)?.let { product ->
            val reviews = productReviewRepository.findAllByProduct(product)
            ProductDetailsResponse(
                id = product.id,
                name = product.name,
                description = product.description,
                price = product.price.toDouble(),
                stock = product.stockQuantity?.toInt() ?: 0,
                categories = productCategoriesMappingRepository.findAllByProduct(product)
                    .map { it.category.categoryName },
                tags = productTagMappingRepository.findAllByProduct(product).map { it.tag.name },
                averageRating = reviews.map { it.rating }.average(),
                totalReviews = reviews.count().toLong(),
            )
        } ?: throw RuntimeException("Product with id $id not found")
    }

    fun getFeaturedProducts(): List<ProductDTO> {
        return productRepository.findAllByFeaturedIsTrue()
            .map { it.toDTO(bytes = productImagesService.findPrimaryForProduct(it) ?: "".toByteArray()) }
    }

    fun getBestsellers(): List<ProductDTO> {
        return getFeaturedProducts()
    }

    fun getRecentlyViewed(): List<ProductDTO> {
        return getFeaturedProducts()
    }

}

data class ProductDetailsResponse(
    val id: Long,
    val name: String,
    val description: String,
    val price: Double,
    val stock: Int,
    val categories: List<String>,
    val tags: List<String>,
    val averageRating: Double,
    val totalReviews: Long
) {

}

class ProductSpecification {
    companion object {
        fun findByFilters(
            search: String?,
            categoryIds: List<Long>?,
            minPrice: Long?,
            maxPrice: Long?,
            tagIds: List<Long>?
        ): Specification<Product> {
            return Specification { root, query, criteriaBuilder ->
                val predicates = mutableListOf<Predicate>()

                // Avoid duplicate results when joining with multiple tables
                query?.distinct(true)

                // Search by name or description
                search?.let {
                    val searchLower = it.lowercase()
                    predicates.add(
                        criteriaBuilder.or(
                            criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%${searchLower}%"
                            ),
                            criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("description")),
                                "%${searchLower}%"
                            )
                        )
                    )
                }

                // Filter by categories through mapping table
                categoryIds?.let { ids ->
                    if (ids.isNotEmpty()) {
                        val categoryMapping =
                            root.join<Product, ProductCategoriesMapping>("productCategoriesMappings", JoinType.LEFT)
                        val category =
                            categoryMapping.join<ProductCategoriesMapping, ProductCategory>("category", JoinType.LEFT)
                        predicates.add(category.get<Long>("id").`in`(ids))
                    }
                }

                // Filter by price range
                minPrice?.let {
                    predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("price"), it)
                    )
                }

                maxPrice?.let {
                    predicates.add(
                        criteriaBuilder.lessThanOrEqualTo(root.get("price"), it)
                    )
                }

                // Filter by tags through mapping table
                tagIds?.let { ids ->
                    if (ids.isNotEmpty()) {
                        val tagMapping = root.join<Product, ProductTagsMapping>("productTagsMappings", JoinType.LEFT)
                        val tag = tagMapping.join<ProductTagsMapping, ProductTag>("tag", JoinType.LEFT)
                        predicates.add(tag.get<Long>("id").`in`(ids))
                    }
                }

                criteriaBuilder.and(*predicates.toTypedArray())
            }
        }
    }
}
