
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, BarChart3, CalendarClock, DollarSign, LineChart, Package, ScrollText, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const salesData = [
  { date: 'Mon', sales: 4000 },
  { date: 'Tue', sales: 3000 },
  { date: 'Wed', sales: 2000 },
  { date: 'Thu', sales: 2780 },
  { date: 'Fri', sales: 1890 },
  { date: 'Sat', sales: 2390 },
  { date: 'Sun', sales: 3490 },
];

const recentOrders = [
    {id: 'ORD001', customer: 'John Doe', amount: 45.50, status: 'Delivered'},
    {id: 'ORD002', customer: 'Jane Smith', amount: 89.99, status: 'Pending'},
    {id: 'ORD003', customer: 'Peter Jones', amount: 12.00, status: 'In Progress'},
    {id: 'ORD004', customer: 'Mary Williams', amount: 32.75, status: 'Delivered'},
    {id: 'ORD005', customer: 'David Brown', amount: 55.00, status: 'Cancelled'},
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your restaurant's performance.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Waiting for processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>A summary of sales for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
               </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>The last 5 orders from customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.customer}</TableCell>
                            <TableCell>
                                <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
      
       <div>
        <h2 className="text-2xl font-bold font-headline tracking-tight">Quick Actions</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Link href="/admin/menu">
                <Card className="hover:bg-muted/50 transition-colors h-full">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <ScrollText className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Manage Menu</CardTitle>
                    </CardHeader>
                </Card>
            </Link>
             <Link href="/admin/orders">
                <Card className="hover:bg-muted/50 transition-colors h-full">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Track Orders</CardTitle>
                    </CardHeader>
                </Card>
            </Link>
             <Link href="/admin/staff">
                <Card className="hover:bg-muted/50 transition-colors h-full">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Manage Staff</CardTitle>
                    </CardHeader>
                </Card>
            </Link>
             <Link href="/admin/leave">
                <Card className="hover:bg-muted/50 transition-colors h-full">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <CalendarClock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Leave Requests</CardTitle>
                    </CardHeader>
                </Card>
            </Link>
         </div>
      </div>
    </div>
  );
}
