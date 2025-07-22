
"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, updateDoc, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffDashboardPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "in", ["Pending", "In Progress"]),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
        } as Order;
      });
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch orders." });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleUpdateStatus = async (id: string, newStatus: Order['status']) => {
    const orderRef = doc(db, "orders", id);
    try {
      await updateDoc(orderRef, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Order #${id.slice(-4)} is now ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update the order status.",
      });
    }
  };

  const getFilteredOrders = (status: Order['status']) => orders.filter(o => o.status === status);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Orders to Prepare</h1>
        <p className="text-muted-foreground">Manage and track the status of incoming customer orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
            <CardDescription>New orders waiting to be prepared.</CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Details</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredOrders('Pending').map(order => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">Order #{order.id.slice(-4)}</div>
                        <div className="text-sm text-muted-foreground">{order.items.join(', ')}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'In Progress')}>
                          Start Preparing
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getFilteredOrders('Pending').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">No pending orders.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Orders currently being prepared.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Details</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredOrders('In Progress').map(order => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">Order #{order.id.slice(-4)}</div>
                        <div className="text-sm text-muted-foreground">{order.items.join(', ')}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}>
                          Mark as Ready
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getFilteredOrders('In Progress').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">No orders in progress.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
