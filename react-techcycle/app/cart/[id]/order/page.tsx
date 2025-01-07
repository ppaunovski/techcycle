"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';


const CheckoutPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        paymentMethod: 'card',
        notes: ''
    });

    useEffect(() => {
        // Check authentication status
        checkAuthStatus();
        // Fetch order information
        fetchOrderInfo();
        fetchPaymentMethods();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Replace with your actual auth check
            const response = await fetch('/api/auth/status');
            const data = await response.json();
            setIsAuthenticated(data.isAuthenticated);
            setIsLoading(false);
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsLoading(false);
        }
    };

    const fetchOrderInfo = async () => {
        try {
            const cartId = params.id
            // Replace cartId with actual cart ID from your state management
            const response = await fetch(`/api/cart/${cartId}/order-info`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrderInfo(data);
        } catch (error) {
            console.error('Failed to fetch order info:', error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            // Replace cartId with actual cart ID from your state management
            const response = await fetch(`/api/orders/payment-methods`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setPaymentMethods(data);
        } catch (error) {
            console.error('Failed to fetch order info:', error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your checkout logic here
        console.log('Submitting order:', formData);

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) console.error("Something went wrong")
        const data = response.json()
        console.log(data)
        localStorage.removeItem('cartId')
        localStorage.removeItem('productCount')
        router.push(`/orders`)
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Alert className="max-w-md">
                    <AlertDescription>
                        Please log in to proceed with checkout
                    </AlertDescription>
                </Alert>
                <Button
                    className="mt-4"
                    onClick={() => router.push('/login')}
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-8">
                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onValueChange={(value) =>
                                    handleInputChange({
                                        target: { name: 'paymentMethod', value }
                                    })
                                }
                            >
                                {paymentMethods.map(pm =>
                                   ( <div key={pm} className="flex items-center space-x-2">
                                        <RadioGroupItem value={pm} id={pm}/>
                                        <Label htmlFor={pm}>{pm}</Label>
                                    </div>)
                                )}
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderInfo ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${orderInfo.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span>-${orderInfo.discount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${orderInfo.tax}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>${orderInfo.total}</span>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading order information...</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Delivery Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Add any special instructions for delivery..."
                                className="min-h-[100px]"
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full">
                        Place Order
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;