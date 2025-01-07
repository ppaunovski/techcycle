"use client";
import React, {useEffect, useState} from 'react';
import { Plus, Edit, Save, X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ProductAdmin = () => {
    const [products, setProducts] = useState([
        {
            product_id: 1,
            name: 'NVIDIA GTX 1080',
            stock_quantity: 15,
            price: 299.99,
            condition: 'GOOD',
            brand_id: 1,
            status: 'ACTIVE'
        },
        // Add more sample products as needed
    ]);

    const fetchProducts = async () => {
        const response = await fetch("/api/products")
    }

    useEffect(() => {
        fetchProducts;
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const initialNewProduct = {
        name: '',
        stock_quantity: 0,
        price: 0,
        condition: 'GOOD',
        brand_id: '',
        status: 'ACTIVE',
        description: '',
        model_number: '',
        manufacturing_date: '',
        technical_specs: {},
        warranty_info: ''
    };

    const [newProduct, setNewProduct] = useState(initialNewProduct);

    const handleQuantityChange = (productId, newQuantity) => {
        setProducts(products.map(product =>
            product.product_id === productId
                ? { ...product, stock_quantity: parseInt(newQuantity) }
                : product
        ));
    };

    const handleAddProduct = () => {
        // Here you would typically make an API call to add the product
        const productWithId = {
            ...newProduct,
            product_id: Math.max(...products.map(p => p.product_id)) + 1
        };
        setProducts([...products, productWithId]);
        setNewProduct(initialNewProduct);
        setIsAddDialogOpen(false);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Product</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Initial Stock</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={newProduct.stock_quantity}
                                        onChange={e => setNewProduct({...newProduct, stock_quantity: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="condition">Condition</Label>
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
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
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
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Stock Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map(product => (
                                    <TableRow key={product.product_id}>
                                        <TableCell>{product.product_id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            {editingProduct === product.product_id ? (
                                                <Input
                                                    type="number"
                                                    value={product.stock_quantity}
                                                    onChange={e => handleQuantityChange(product.product_id, e.target.value)}
                                                    className="w-24"
                                                />
                                            ) : (
                                                product.stock_quantity
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
                                            {editingProduct === product.product_id ? (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingProduct(null)}
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingProduct(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingProduct(product.product_id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductAdmin;