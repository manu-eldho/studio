
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, query, orderBy, writeBatch } from "firebase/firestore";
import { format } from "date-fns";

import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          customerName: data.customerName || "Guest User",
          paymentStatus: data.paymentStatus || 'Unpaid',
          reviewed: data.reviewed || false
        } as Order;
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch orders." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
     const originalOrders = [...orders];
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast({ title: "Success", description: `Order status updated to ${newStatus}.` });
    } catch (error) {
      console.error("Error updating status:", error);
      setOrders(originalOrders);
      toast({ variant: "destructive", title: "Error", description: "Failed to update order status." });
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: Order['paymentStatus']) => {
    const originalOrders = [...orders];
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, paymentStatus: newStatus } : order
      )
    );

    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { paymentStatus: newStatus });
        toast({ title: "Success", description: `Payment status updated.` });
    } catch (error) {
        console.error("Error updating payment status:", error);
        setOrders(originalOrders);
        toast({ variant: "destructive", title: "Error", description: "Failed to update payment status." });
    }
  }


  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Delivered': return 'default';
        case 'Cancelled': return 'destructive';
        case 'Pending': return 'secondary';
        case 'In Progress': return 'secondary';
        case 'Out for Delivery': return 'secondary';
        default: return 'secondary';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Order Tracking</h1>
        <p className="text-muted-foreground">
          View and manage all customer orders.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all orders from customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>{format(order.date, "PPP p")}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items.join(', ')}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Pending')}>Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'In Progress')}>In Progress</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Out for Delivery')}>Out for Delivery</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Delivered')}>Delivered</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Cancelled')} className="text-destructive">Cancel</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'Paid')}>Mark as Paid</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'Unpaid')}>Mark as Unpaid</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
