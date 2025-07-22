
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOrdersPage() {
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
            <p>Order tracking interface will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
