"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {Category, fetchCategories, fetchTags, fetchWithToken, Tag} from "@/service/categories.service";
import Link from "next/link";
import DisplayImage from "@/components/custom/img-display";
import {saveInteractions} from "@/service/interaction.service";

const ProductsPage = () => {
    // State management
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableTags, setTags] = useState<Tag[]>([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        tags: [],
    });
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12,
    });

    // Categories and tags (you can fetch these from backend too)
    useEffect(() => {
        fetchCategories(setCategories, null).then(r => {})
        fetchTags(setTags, null).then(r => {})
    }, []);
    // const categories = ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'Power Supply'];
    // const availableTags = ['Refurbished', 'Like New', 'Tested', 'Warranty', 'Gaming'];
    // Fetch products with filters and pagination
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Construct query parameters
            const queryParams = new URLSearchParams({
                page: pagination.currentPage,
                limit: pagination.itemsPerPage,
                search: filters.search,
                category: filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                tags: filters.tags.map(t => t.id).join(','),
            });

            const response = await fetch(`/api/products?${queryParams}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            console.log(data.products)
            setProducts(data.products);
            setPagination({
                ...pagination,
                totalPages: data.totalPages,
                totalItems: data.totalItems,
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products when filters or pagination changes
    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.currentPage]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    };

    // Handle tag toggle
    const handleTagToggle = (tag: Tag) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    function handleMouseEnter(e, productId) {
        console.log(productId,e)
        saveInteractions(productId, 'HOVER', false)
    }
    function handleMouseLeave(e, productId) {
        console.log(productId,e)
        saveInteractions(productId, 'HOVER', true)
    }
    function handleMouseClick(e, productId) {
        console.log(productId,e)
        saveInteractions(productId, 'CLICKED', true)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Filters Section */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 w-full p-2 border rounded-md"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        className="w-full p-2 border rounded-md"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.categoryName}</option>
                        ))}
                    </select>

                    {/* Price Range */}
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            className="w-1/2 p-2 border rounded-md"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            className="w-1/2 p-2 border rounded-md"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1 rounded-full text-sm ${
                                filters.tags.includes(tag)
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (

                       <Link onClick={(e) => handleMouseClick(e, product.id)} onMouseLeave={(e) => handleMouseLeave(e, product.id)} onMouseEnter={(e) => handleMouseEnter(e, product.id)} href={'/products/'+product.id}>
                           <Card key={product.id} className="flex flex-col">
                               <CardHeader>
                                   {/*<img*/}
                                   {/*    src={product.imageUrl || '/api/placeholder/300/200'}*/}
                                   {/*    alt={product.name}*/}
                                   {/*    className="w-full h-48 object-cover rounded-t-lg"*/}
                                   {/*/>*/}
                                   <DisplayImage className="w-full h-48 object-cover rounded-t-lg"  imageBytes={product.imageUrl}></DisplayImage>
                               </CardHeader>
                               <CardContent className="flex-grow">
                                   <CardTitle className="mb-2">{product.name}</CardTitle>
                                   <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                                   <div className="flex flex-wrap gap-1 mt-2">
                                       {product.tags?.map(tag => (
                                           <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                                       ))}
                                   </div>
                               </CardContent>
                               <CardFooter className="flex justify-between items-center">
                                   <span className="text-xl font-bold text-green-600">${product.price}</span>
                                   <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                       Add To Cart
                                   </button>
                               </CardFooter>
                           </Card>
                       </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
        <span className="text-gray-600">
          Showing {products.length} of {pagination.totalItems} items
        </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                        disabled={pagination.currentPage === 1}
                        className="p-2 border rounded-md disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="p-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="p-2 border rounded-md disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;