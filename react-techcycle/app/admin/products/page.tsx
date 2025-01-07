"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Save, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const pageSize = 20;

    const initialNewProduct = {
        name: '',
        description: '',
        detailedDescription: '',
        technicalSpecs: {},
        price: 0,
        stockQuantity: 0,
        lowStockThreshold: 5,
        condition: 'GOOD',
        warrantyInfo: '',
        brandId: '',
        modelNumber: '',
        manufacturingDate: '',
        weight: '',
        dimensions: {},
        featured: false,
        status: 'ACTIVE'
    };

    const [newProduct, setNewProduct] = useState(initialNewProduct);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `/api/products?page=${currentPage}&limit=${pageSize}&search=${searchTerm}`
            );
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalItems);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm]);

    const handleAddProduct = async () => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) throw new Error('Failed to add product');
            fetchProducts();
            setNewProduct(initialNewProduct);
            setIsAddDialogOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateProduct = async (productId, updatedData) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Failed to update product');
            fetchProducts();
            setEditingProduct(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">Product Inventory Management</CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> Add New Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                                    <Input
                                        id="stockQuantity"
                                        type="number"
                                        value={newProduct.stockQuantity}
                                        onChange={e => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="condition">Condition *</Label>
                                    <Select
                                        value={newProduct.condition}
                                        onValueChange={value => setNewProduct({...newProduct, condition: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LIKE_NEW">Like New</SelectItem>
                                            <SelectItem value="GOOD">Good</SelectItem>
                                            <SelectItem value="FAIR">Fair</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="detailedDescription">Detailed Description</Label>
                                    <Textarea
                                        id="detailedDescription"
                                        value={newProduct.detailedDescription}
                                        onChange={e => setNewProduct({...newProduct, detailedDescription: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modelNumber">Model Number</Label>
                                    <Input
                                        id="modelNumber"
                                        value={newProduct.modelNumber}
                                        onChange={e => setNewProduct({...newProduct, modelNumber: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                                    <Input
                                        id="manufacturingDate"
                                        type="date"
                                        value={newProduct.manufacturingDate}
                                        onChange={e => setNewProduct({...newProduct, manufacturingDate: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.01"
                                        value={newProduct.weight}
                                        onChange={e => setNewProduct({...newProduct, weight: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                                    <Input
                                        id="lowStockThreshold"
                                        type="number"
                                        value={newProduct.lowStockThreshold}
                                        onChange={e => setNewProduct({...newProduct, lowStockThreshold: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="warrantyInfo">Warranty Information</Label>
                                    <Textarea
                                        id="warrantyInfo"
                                        value={newProduct.warrantyInfo}
                                        onChange={e => setNewProduct({...newProduct, warrantyInfo: e.target.value})}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Button className="w-full" onClick={handleAddProduct}>
                                        Add Product
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-5 w-5 text-gray-500" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                                    </TableRow>
                                ) : products.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            {editingProduct === product.id ? (
                                                <Input
                                                    type="number"
                                                    value={product.quantity}
                                                    onChange={e => handleUpdateProduct(product.id, {
                                                        ...product,
                                                        quantity: parseInt(e.target.value)
                                                    })}
                                                    className="w-24"
                                                />
                                            ) : (
                                                product.quantity
                                            )}
                                        </TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.condition}</TableCell>
                                        <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {product.tags.map((tag, index) => (
                                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {tag}
                          </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditingProduct(product.id)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            Showing {products.length} of {totalItems} items
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductAdmin;