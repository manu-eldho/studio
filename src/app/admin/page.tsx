
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, CalendarClock, DollarSign, Package, ScrollText, ShoppingCart, Star, Users } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { BarChart as RechartsBarChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";


const salesData = [
  { date: 'Mon', sales: 4000 },
  { date: 'Tue', sales: 3000 },
  { date: 'Wed', sales: 2000 },
  { date: 'Thu', sales: 2780 },
  { date: 'Fri', sales: 1890 },
  { date: 'Sat', sales: 2390 },
  { date: 'Sun', sales: 3490 },
];

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  amountDue: number;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersAndCalcStats = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const fetchedOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate(),
          } as Order;
        });
        setOrders(fetchedOrders);
        
        // Calculate stats
        const totalRevenue = fetchedOrders
          .filter(o => o.paymentStatus === 'Paid')
          .reduce((sum, o) => sum + o.total, 0);
        const amountDue = fetchedOrders
          .filter(o => o.paymentStatus === 'Unpaid')
          .reduce((sum, o) => sum + o.total, 0);
        const totalOrders = fetchedOrders.length;
        const pendingOrders = fetchedOrders.filter(o => o.status === 'Pending').length;
        
        setStats({ totalRevenue, totalOrders, pendingOrders, amountDue });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdersAndCalcStats();
  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Delivered': return 'default';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your restaurant's performance.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading || !stats ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From all paid orders.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">Total orders received.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Waiting for processing.</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
                <DollarSign className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">${stats.amountDue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From all unpaid orders.</p>
              </CardContent>
            </Card>
          </>
        )}
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
                <RechartsBarChart data={salesData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
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
            {loading ? <Skeleton className="h-48 w-full" /> : (
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
                            <TableCell className="font-medium">{order.customerName}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(order.status)}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            )}
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
             <Link href="/admin/reviews">
                <Card className="hover:bg-muted/50 transition-colors h-full">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Star className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>View Reviews</CardTitle>
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
