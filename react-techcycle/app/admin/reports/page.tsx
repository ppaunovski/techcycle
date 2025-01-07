"use client";
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

const ReportDashboard = () => {
    const [reportType, setReportType] = useState('regular');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 30),
    });

    const regularReports = [
        { id: 'MONTHLY_PERFORMANCE', name: 'Monthly Performance Report' },
        { id: 'CUSTOMER_SATISFACTION', name: 'Customer Satisfaction Report' }
    ];

    const adhocReports = [
        { id: 'MARKET_ANALYSIS', name: 'Market Price Analysis' },
        { id: 'INVENTORY_OPTIMIZATION', name: 'Inventory Optimization Analysis' }
    ];

    const fetchReport = async () => {
        if (!selectedReport || !dateRange?.from || !dateRange?.to) {
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = reportType === 'regular'
                ? `/api/reports/regular/${selectedReport}`
                : `/api/reports/adhoc/${selectedReport}`;

            const queryParams = new URLSearchParams({
                startDate: format(dateRange.from, 'yyyy-MM-dd'),
                endDate: format(dateRange.to, 'yyyy-MM-dd')
            })
            const response = await fetch(endpoint+`?${queryParams}`, {
                headers: {
                    "Authorizaton": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMonthlyPerformanceReport = (data) => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <LineChart width={600} height={300} data={data.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total Sales</span>
                                <span className="font-bold">${data.totalSales}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Units Sold</span>
                                <span className="font-bold">{data.unitsSold}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Average Order Value</span>
                                <span className="font-bold">${data.averageOrderValue}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inventory Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total SKUs</span>
                                <span className="font-bold">{data.totalSkus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Low Stock Items</span>
                                <span className="font-bold text-yellow-600">{data.lowStockItems}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Out of Stock</span>
                                <span className="font-bold text-red-600">{data.outOfStockItems}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Return Rate</span>
                                <span className="font-bold">{data.returnRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Customer Satisfaction</span>
                                <span className="font-bold">{data.customerSatisfaction}/5</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Warranty Claims</span>
                                <span className="font-bold">{data.warrantyClaims}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Reports Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="regular" onValueChange={setReportType}>
                        <TabsList>
                            <TabsTrigger value="regular">Regular Reports</TabsTrigger>
                            <TabsTrigger value="adhoc">Ad-hoc Reports</TabsTrigger>
                        </TabsList>

                        <TabsContent value="regular">
                            <div className="space-y-4">
                                <Select onValueChange={setSelectedReport}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regularReports.map(report => (
                                            <SelectItem key={report.id} value={report.id}>
                                                {report.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

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
                                                mode="range"
                                                defaultMonth={dateRange?.from}
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button
                                    onClick={fetchReport}
                                    disabled={isLoading || !selectedReport || !dateRange?.from || !dateRange?.to}
                                    className="w-full"
                                >
                                    {isLoading ? 'Generating Report...' : 'Generate Report'}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="adhoc">
                            <div className="space-y-4">
                                <Select onValueChange={setSelectedReport}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {adhocReports.map(report => (
                                            <SelectItem key={report.id} value={report.id}>
                                                {report.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

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
                                                mode="range"
                                                defaultMonth={dateRange?.from}
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Button
                                    onClick={fetchReport}
                                    disabled={isLoading || !selectedReport || !dateRange?.from || !dateRange?.to}
                                    className="w-full"
                                >
                                    {isLoading ? 'Generating Report...' : 'Generate Report'}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {reportData && (
                        <div className="mt-8">
                            {selectedReport === 'MONTHLY_PERFORMANCE' && renderMonthlyPerformanceReport(reportData)}
                            {/* Add other report type renders here */}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportDashboard;