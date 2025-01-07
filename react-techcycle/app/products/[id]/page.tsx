"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DisplayImage from "@/components/custom/img-display";


interface ProductImage {
    id: number;
    url: string;
    isPrimary: boolean;
    bytes: any;
}

interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categories: [];
    tags: [];
    averageRating: number;
    totalReviews: number;
}

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch product details, images, and reviews in parallel
                const [productRes, imagesRes, reviewsRes] = await Promise.all([
                    fetch(`/api/products/${id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}),
                    fetch(`/api/products/${id}/images`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}),
                    fetch(`/api/products/${id}/reviews`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
                ]);

                if (!productRes.ok || !imagesRes.ok || !reviewsRes.ok) {
                    throw new Error('Failed to fetch product data');
                }

                const [productData, imagesData, reviewsData] = await Promise.all([
                    productRes.json(),
                    imagesRes.json(),
                    reviewsRes.json()
                ]);

                setProduct(productData);
                setImages(imagesData);
                setReviews(reviewsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    const addToCart = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            // if (!cartId) throw new Error('No cart found');

            const response = await fetch(`/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: product?.id,
                    quantity,
                    cartId: cartId,
                }),
            });

            if (!response.ok) throw new Error('Failed to add to cart');

            // Show success message or redirect to cart
            // You can implement your preferred feedback mechanism here
            const data = await response.json()
            localStorage.setItem('cartId', data.id)
            localStorage.setItem('productCount', data.productCount)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to cart');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }

    if (error || !product) {
        return (
            <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
                <AlertDescription>{error || 'Product not found'}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="relative">
                    <div className="aspect-square relative overflow-hidden rounded-lg">
                        {/*<img*/}
                        {/*    src={images[currentImageIndex]?.url || '/api/placeholder/600/600'}*/}
                        {/*    alt={`Product image ${currentImageIndex + 1}`}*/}
                        {/*    className="w-full h-full object-cover"*/}
                        {/*/>*/}
                        <DisplayImage imageBytes={images[currentImageIndex].bytes} className={undefined}></DisplayImage>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex(i => (i > 0 ? i - 1 : images.length - 1))}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(i => (i < images.length - 1 ? i + 1 : 0))}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="flex mt-4 space-x-2 overflow-x-auto">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                                    currentImageIndex === index ? 'ring-2 ring-green-600' : ''
                                }`}
                            >
                                <DisplayImage imageBytes={image.bytes} className={undefined}></DisplayImage>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={i < Math.round(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                                        fill={i < Math.round(product.averageRating) ? 'currentColor' : 'none'}
                                    />
                                ))}
                                <span className="ml-2 text-gray-600">({product.totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-2xl font-bold text-green-600">
                        ${product.price.toFixed(2)}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Categories:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.categories.map(category => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                  {category}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Description:</h3>
                        <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-md">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="p-2 hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                className="p-2 hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={addToCart}
                            disabled={product.stock === 0}
                            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <ShoppingCart size={20} />
                                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-600">No reviews yet</p>
                    ) : (
                        reviews.map(review => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{review.userName}</span>
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                                        fill={i < review.rating ? 'currentColor' : 'none'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;