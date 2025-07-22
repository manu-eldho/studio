
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  customerName: string;
  items: string[];
  status: "Pending" | "In Progress" | "Completed";
};

const initialOrders: Order[] = [
  { id: 'ORD101', customerName: 'Alice Johnson', items: ['Margherita Pizza', 'Iced Tea'], status: 'Pending' },
  { id: 'ORD102', customerName: 'Bob Williams', items: ['Spaghetti Carbonara', 'Caesar Salad'], status: 'Pending' },
  { id: 'ORD103', customerName: 'Charlie Brown', items: ['Chocolate Lava Cake'], status: 'In Progress' },
  { id: 'ORD104', customerName: 'Diana Miller', items: ['Margherita Pizza (x2)'], status: 'Completed' },
];

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleUpdateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(currentOrders =>
      currentOrders.map(order => (order.id === id ? { ...order, status: newStatus } : order))
    );
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
                      <div className="font-medium">Order #{order.id.slice(-3)}</div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Orders currently being prepared.</CardDescription>
          </CardHeader>
          <CardContent>
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
                      <div className="font-medium">Order #{order.id.slice(-3)}</div>
                      <div className="text-sm text-muted-foreground">{order.items.join(', ')}</div>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'Completed')}>
                        Mark as Completed
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
