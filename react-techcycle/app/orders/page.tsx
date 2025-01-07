"use client";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DisplayImage from "@/components/custom/img-display";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState({});
    const [reviews, setReviews] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        if (orderDetails[orderId]) return;

        try {
            const response = await fetch(`/api/orders/${orderId}/details`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrderDetails(prev => ({
                ...prev,
                [orderId]: data
            }));
        } catch (error) {
            console.error('Failed to fetch order details:', error);
        }
    };

    const handleOrderClick = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
            await fetchOrderDetails(orderId);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'pending': 'bg-yellow-200 text-yellow-800',
            'processing': 'bg-blue-200 text-blue-800',
            'shipped': 'bg-purple-200 text-purple-800',
            'delivered': 'bg-green-200 text-green-800',
            'cancelled': 'bg-red-200 text-red-800'
        };
        return statusColors[status.toLowerCase()] || 'bg-gray-200 text-gray-800';
    };

    const handleReviewSubmit = async (productId, rating, comment) => {
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment
                }),
            });
            const data = await response.json();
            setReviews(prev => ({
                ...prev,
                [productId]: { rating, comment, submitted: true }
            }));
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    const ReviewForm = ({ productId }) => {
        const [rating, setRating] = useState(5);
        const [comment, setComment] = useState('');

        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Write a Review</h4>
                <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`w-5 h-5 ${
                                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review here..."
                    className="mb-2"
                />
                <Button
                    onClick={() => handleReviewSubmit(productId, rating, comment)}
                    disabled={reviews[productId]?.submitted}
                >
                    {reviews[productId]?.submitted ? 'Review Submitted' : 'Submit Review'}
                </Button>
            </div>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="w-full">
                        <CardHeader
                            className="cursor-pointer"
                            onClick={() => handleOrderClick(order.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <div className="text-sm text-gray-500">
                                        Placed on {format(new Date(order.createdAt), 'PPP')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                    <div className="font-medium">${order.totalPrice}</div>
                                    {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>
                        </CardHeader>

                        {expandedOrder === order.id && orderDetails[order.id] && (
                            <CardContent>
                                {/* Products List */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium mb-4">Order Items</h3>
                                    <div className="grid gap-4">
                                        {orderDetails[order.id].products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                                            >
                                                <DisplayImage className="w-20 h-20 object-cover rounded" imageBytes={product.imageUrl}></DisplayImage>
                                                {/*<img*/}
                                                {/*    src={product.imageUrl}*/}
                                                {/*    alt={product.name}*/}
                                                {/*    className="w-20 h-20 object-cover rounded"*/}
                                                {/*/>*/}
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{product.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {product.quantity} × ${product.price}
                                                    </p>
                                                    {!reviews[product.id]?.submitted && (
                                                        <ReviewForm productId={product.id} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Status History */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Order Status History</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Comment</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orderDetails[order.id].statusHistory.map((status, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Badge className={getStatusColor(status.status)}>
                                                            {status.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(status.createdAt), 'PPP p')}
                                                    </TableCell>
                                                    <TableCell>{status.comment}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryPage;