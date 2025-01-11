package com.techcycle.api

import com.techcycle.service.ProductImagesService
import com.techcycle.service.ProductReviewService
import com.techcycle.service.ProductService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/products")
class ProductController(
    private val service: ProductService,
    private val productImagesService: ProductImagesService,
    private val productReviewService: ProductReviewService
) {
    @GetMapping
    fun getProducts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(name = "limit", defaultValue = "20") size: Int,
        @RequestParam(required = false) search: String?,
        @RequestParam(required = false) category: List<Long>?,
        @RequestParam(required = false) minPrice: Long?,
        @RequestParam(required = false) maxPrice: Long?,
        @RequestParam(required = false) tags: List<Long>?
    ) =
        service.findProducts(
            page = page,
            size = size,
            search = search,
            categoryIds = category,
            minPrice = minPrice,
            maxPrice = maxPrice,
            tagIds = tags
        )

    @GetMapping("/{id}")
    fun getProduct(@PathVariable id: Long) = service.getById(id)

    @GetMapping("/{id}/images")
    fun getProductImages(@PathVariable id: Long) = productImagesService.getImagesForProduct(productId = id)

    @GetMapping("/{id}/reviews")
    fun getProductReviews(@PathVariable id: Long) = productReviewService.getReviewsForProduct(productId = id)

    @GetMapping("/add-bytes")
    fun addBytes() = productImagesService.addBytes()

    @GetMapping("/featured")
    fun getFeaturedProducts() = service.getFeaturedProducts()

    @GetMapping("/bestsellers")
    fun getBestsellers() = service.getBestsellers()

    @GetMapping("/recently-viewed")
    fun getRecentlyViewed() = service.getRecentlyViewed()
}