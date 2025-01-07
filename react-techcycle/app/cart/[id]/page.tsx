"use client";
import React, { useEffect, useState } from 'react';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {useRouter} from "next/navigation";
import DisplayImage from "@/components/custom/img-display";


// Types for cart data
interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    stock: number;
}

interface Cart {
    id: string;
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
}

const CartPage = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            if (!cartId) {
                setError('No cart found');
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/cart/${cartId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cart');

            const data = await response.json();
            setCart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        try {
            if (!cart) return;

            const response = await fetch(`/api/cart/${cart.id}/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newQuantity),
            });

            if (!response.ok) throw new Error('Failed to update quantity');

            // Optimistically update the UI
            setCart(prevCart => {
                if (!prevCart) return null;

                const updatedItems = prevCart.items.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                );

                const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                return {
                    ...prevCart,
                    items: updatedItems,
                    totalPrice,
                    totalItems,
                };
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update quantity');
            // Revert changes on error
            fetchCart();
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            if (!cart) return;

            const response = await fetch(`/api/cart/${cart.id}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to remove item');

            // Optimistically update the UI
            setCart(prevCart => {
                if (!prevCart) return null;

                const updatedItems = prevCart.items.filter(item => item.id !== itemId);
                const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

                return {
                    ...prevCart,
                    items: updatedItems,
                    totalPrice,
                    totalItems,
                };
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove item');
            fetchCart();
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
    }

    if (error) {
        return (
            <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <ShoppingCart size={48} className="text-gray-400" />
                <h2 className="text-2xl font-semibold text-gray-600">Your cart is empty</h2>
                <p className="text-gray-500">Add some items to your cart to see them here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="divide-y">
                            {cart.items.map((item) => (
                                <div key={item.id} className="py-4 first:pt-6 last:pb-6">
                                    <div className="flex items-start space-x-4">
                                        <DisplayImage className="w-24 h-24 object-cover rounded-md" imageBytes={item.productImage}></DisplayImage>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold">{item.productName}</h3>
                                            <p className="text-green-600 font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>

                                            <div className="flex items-center space-x-4 mt-4">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        <Minus size={16}/>
                                                    </button>
                                                    <span className="px-4 py-2 font-medium">
                            {item.quantity}
                          </span>
                                                    <button
                                                        onClick={() => item.quantity < item.stock && updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        <Plus size={16}/>
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={20}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items ({cart.totalItems})</span>
                                    <span>${cart.totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>

                                <div className="border-t pt-2 mt-4">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>${cart.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/cart/${cart?.id}/order`)}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-green-700"
                            >
                                Proceed to Checkout
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CartPage;