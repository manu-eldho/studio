import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "ORD001",
    date: "2024-07-20",
    status: "Delivered",
    total: 32.50,
    items: ["Spicy Szechuan Chicken", "Crispy Spring Rolls"]
  },
  {
    id: "ORD002",
    date: "2024-07-15",
    status: "Delivered",
    total: 23.50,
    items: ["Gourmet Truffle Burger", "Refreshing Mojito"]
  },
    {
    id: "ORD003",
    date: "2024-07-10",
    status: "Cancelled",
    total: 14.00,
    items: ["Classic Margherita Pizza"]
  },
];


export default function MyOrdersPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">
          View your order history.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items.join(', ')}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
