"use client";
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {User, LogOut, ShoppingCart} from 'lucide-react';
import {Badge} from '@/components/ui/badge'

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState({});
    const router = useRouter();

    useEffect(() => {
        // Check localStorage for user data when component mounts
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');

        const cartId = localStorage.getItem('cartId');
        const productCount = localStorage.getItem('productCount') ?? 0;
        setCart({cartId, productCount})

        if (firstName && lastName) {
            setUser({firstName, lastName});
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('username');
        localStorage.removeItem('cartId');
        localStorage.removeItem('productCount');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and main navigation */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-green-600">TechCycle</span>
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            <Link href="/products" className="text-gray-600 hover:text-green-600">
                                Products
                            </Link>
                            <Link href="/orders" className="text-gray-600 hover:text-green-600">
                                Orders
                            </Link>
                            <Link href="/about" className="text-gray-600 hover:text-green-600">
                                About
                            </Link>
                        </div>
                    </div>

                    {/* User section */}
                    <div className="flex items-center space-x-4">
                        <Link href={'/cart/'+cart.cartId}>
                            <Badge>{cart.productCount}</Badge>
                            <ShoppingCart size={20} />
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <User size={20} className="text-gray-600"/>
                                    <span className="text-gray-800">
                    {user.firstName} {user.lastName}
                  </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                                >
                                    <LogOut size={20}/>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;