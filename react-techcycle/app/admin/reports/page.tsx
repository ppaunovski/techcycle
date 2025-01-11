"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Loader2, Star, CalendarIcon, TrendingUp, Users, CreditCard, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportDashboard = () => {

    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
    const [reportType, setReportType] = useState('MONTHLY_PERFORMANCE');
    const [reportData, setReportData] = useState(null);
    const [reportCategory, setReportCategory] = useState('regular');
    const [productDetails, setProductDetails] = useState({});

    const renderAdHocReport = () => {
        if (!reportData?.data?.productsMonthlySale) return null;

        const salesData = reportData.data.productsMonthlySale;


        const productTotalSales = {};
        const monthlyTotalSales = {};
        const productSalesByMonth = {};

        salesData.forEach(sale => {

            if (!productTotalSales[sale.product]) {
                productTotalSales[sale.product] = 0;
            }
            productTotalSales[sale.product] += parseFloat(sale.totalSales);


            if (!monthlyTotalSales[sale.month]) {
                monthlyTotalSales[sale.month] = 0;
            }
            monthlyTotalSales[sale.month] += parseFloat(sale.totalSales);


            if (!productSalesByMonth[sale.product]) {
                productSalesByMonth[sale.product] = [];
            }
            productSalesByMonth[sale.product].push({
                month: sale.month,
                sales: parseFloat(sale.totalSales)
            });
        });


        const productSalesData = Object.entries(productTotalSales).map(([product, sales]) => ({
            product,
            sales
        })).sort((a, b) => b.sales - a.sales);

        const monthlyTrendData = Object.entries(monthlyTotalSales).map(([month, sales]) => ({
            month,
            sales
        }));

        return (
            <>
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Monthly Sales Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Sales Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={productSalesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="product"
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Bar dataKey="sales" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product-wise Monthly Sales Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="month"
                                            allowDuplicatedCategory={false}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Legend />
                                        {Object.entries(productSalesByMonth).map(([product, data], index) => (
                                            <Line
                                                key={product}
                                                data={data}
                                                type="monotone"
                                                dataKey="sales"
                                                name={product}
                                                stroke={`hsl(${index * 30}, 70%, 50%)`}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Sales Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Month
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Year
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Sales
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {salesData.map((sale, index) => (
                                        <tr key={`${sale.productId}-${sale.month}-${index}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {sale.product}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sale.month}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sale.year?.toString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${parseFloat(sale.totalSales).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    };


    const fetchReport = async () => {
        if (!dateRange?.from) return;

        setLoading(true);
        try {
            const url = reportCategory === 'adhoc'
                ? `/api/reports/adhoc/${reportType}?startDate=${dateRange.from.toISOString()}`
                : `/api/reports/${reportCategory}/${reportType}?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;

            const response = await fetch(url);
            const data = await response.json();
            setReportData(data);
            if (reportType === 'MONTHLY_PERFORMANCE') {
                await fetchProductDetails(Object.keys(data.data.topSellingProducts));
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        }
        setLoading(false);
    };
    const fetchProductDetails = async (productIds) => {
        const details = {};
        await Promise.all(
            productIds.map(async (id) => {
                try {
                    const response = await fetch(`/api/products/${id}`);
                    details[id] = await response.json();
                } catch (error) {
                    console.error(`Error fetching product ${id}:`, error);
                }
            })
        );
        setProductDetails(details);
    };

    const getDailyRevenueData = () => {
        if (!reportData?.data?.dailyRevenue) return [];
        return Object.entries(reportData.data.dailyRevenue).map(([date, revenue]) => ({
            date: format(new Date(date), 'LLL dd'),
            revenue: parseFloat(revenue)
        }));
    };

    const renderMonthlyPerformanceReport = () => (
        <>
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{reportData.data.totalOrders}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${reportData.data.totalRevenue.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                {/* Rest of the Monthly Performance Report components... */}
                <Card>
                    <CardHeader>
                        <CardTitle>Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{reportData.data.totalItems}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Avg Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${reportData.data.averageOrderValue.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getDailyRevenueData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#8884d8"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {Object.entries(reportData.data.topSellingProducts).map(([productId, quantity]) => {
                            const product = productDetails[productId];
                            return (
                                <div key={productId} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {product?.name || `Product ${productId}`}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {product?.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{quantity} units sold</p>
                                            <p className="text-sm text-gray-600">
                                                ${product?.price?.toLocaleString()} per unit
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {product?.categories?.map((category) => (
                                            <Badge key={category} variant="secondary">
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {product?.tags?.map((tag) => (
                                            <Badge key={tag} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {product?.totalReviews > 0 ?
                                                <span>{product?.averageRating?.toFixed(1)} ({product?.totalReviews} reviews)</span> :
                                                <span>Not reviewed yet.</span>}

                                        </div>
                                        <span className={`font-medium ${
                                            product?.stock > 20 ? 'text-green-600' :
                                                product?.stock > 5 ? 'text-yellow-600' :
                                                    'text-red-600'
                                        }`}>
                          {product?.stock} in stock
                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </>
    );

    const renderCustomerAnalyticsReport = () => {
        const data = reportData.data;

        return (
            <>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Customer Segments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'New', value: data.customerSegmentation.filter(c => c.customerType === 'New').length },
                                                { name: 'Returning', value: data.customerSegmentation.filter(c => c.customerType === 'Returning').length }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({name, value}) => `${name}: ${value}`}
                                        >
                                            {COLORS.map((color, index) => (
                                                <Cell key={`cell-${index}`} fill={color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Average Order Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                ${data.averageOrderValue.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Payment Methods
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.paymentMethodDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="count"
                                            nameKey="paymentMethod"
                                            label={({paymentMethod, percentage}) => `${paymentMethod}: ${percentage.toFixed(1)}%`}
                                        >
                                            {COLORS.map((color, index) => (
                                                <Cell key={`cell-${index}`} fill={color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Top Cities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.topCities} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="city" type="category" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="orderCount" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Customers by Lifetime Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.topCustomersByValue.map((customer, index) => (
                                <div key={customer.userId} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                                            <p className="text-sm text-muted-foreground">Customer ID: {customer.userId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">${customer.lifetimeValue.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Lifetime Value</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    };

    
    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Report Dashboard</CardTitle>
                    <CardDescription>View and analyze business performance reports</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="regular" className="space-y-4" onValueChange={setReportCategory}>
                        <TabsList>
                            <TabsTrigger value="regular">Regular Reports</TabsTrigger>
                            <TabsTrigger value="adhoc">Ad-hoc Reports</TabsTrigger>
                        </TabsList>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium">Report Type</label>
                                <Select onValueChange={setReportType} defaultValue={reportType}>
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reportCategory === 'regular' ? (
                                            <>
                                                <SelectItem value="MONTHLY_PERFORMANCE">Monthly Performance</SelectItem>
                                                <SelectItem value="CUSTOMER_ANALYTICS">Customer Analytics</SelectItem>
                                            </>
                                        ) : (
                                            <SelectItem value="INVENTORY_OPTIMIZATION">Inventory Optimization</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Date Range</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant="outline"
                                            className={cn(
                                                "w-[300px] justify-start text-left font-normal",
                                                !dateRange && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.from ? (
                                                dateRange.to ? (
                                                    <>
                                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                                        {format(dateRange.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(dateRange.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode={"range"}
                                            defaultMonth={dateRange?.from}
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <Button
                                    onClick={fetchReport}
                                    disabled={loading || !dateRange?.from || (reportCategory !== 'adhoc' && !dateRange?.to)}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading
                                        </>
                                    ) : (
                                        'Generate Report'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            {reportData && (
                reportCategory === 'adhoc'
                    ? renderAdHocReport()
                    : (reportType === 'MONTHLY_PERFORMANCE'
                        ? renderMonthlyPerformanceReport()
                        : renderCustomerAnalyticsReport())
            )}
        </div>
    );
};

export default ReportDashboard;