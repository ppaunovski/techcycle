package com.techcycle.service

import com.techcycle.api.response.ProductImageResponse
import com.techcycle.domain.Product
import com.techcycle.domain.ProductImage
import com.techcycle.repository.ImagesRepository
import com.techcycle.repository.ProductRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.io.File
import java.nio.file.Files
import java.util.*

@Service
class ProductImagesService(
    private val productRepository: ProductRepository,
    private val imagesRepository: ImagesRepository
) {
    fun getImagesForProduct(productId: Long): List<ProductImageResponse> {
        return productRepository.findByIdOrNull(productId)?.let {
            imagesRepository.findAllByProduct(it)
        }?.map { ProductImageResponse(
            imageUrl = it.imageUrl,
            url = it.imageUrl,
            bytes = it.bytes,
            isPrimary = it.isPrimary
        ) } ?: emptyList()
    }

    fun addBytes() {
        val productFolderPath = "src/main/resources/static/products"
        val productFolder = File(productFolderPath)

        val classLoader = javaClass.classLoader
        val folder = classLoader.getResource("static/products")?.file?.let { File(it) }

        if (productFolder.exists() && productFolder.isDirectory) {
            addFileBytes(productFolder)
        } else if (folder != null && folder.isDirectory) {
            addFileBytes(folder)
        }

    }

    private fun addFileBytes(productFolder: File) {
        for (productDir in Objects.requireNonNull(productFolder.listFiles())) {
            if (productDir.exists() && productDir.isDirectory) {
                val productId = productDir.name.toLong()

                for(file in Objects.requireNonNull(productDir.listFiles())) {
                    if (file.exists() && file.isFile) {
                        val imgData = Files.readAllBytes(file.toPath())
                        val product = productRepository.findByIdOrNull(productId)
                        product?.let {
                            imagesRepository.save(
                                ProductImage(
                                    product = it,
                                    bytes = imgData,
                                    imageUrl = file.absolutePath,
                                    title = file.name,
                                    isPrimary = Objects.requireNonNull(productDir.listFiles()).indexOf(file) == 0,
                                    displayOrder = Objects.requireNonNull(productDir.listFiles()).indexOf(file).toLong(),
                                    altText = "img"
                                )
                            )
                        }
                    }
                }
            }
        }
    }

    fun findPrimaryForProduct(product: Product) = imagesRepository.findByProductAndIsPrimary(product, true)?.bytes


}
