
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stockItems = [
  { name: 'Tomatoes', quantity: 20, unit: 'kg', status: 'In Stock' },
  { name: 'Mozzarella Cheese', quantity: 15, unit: 'kg', status: 'In Stock' },
  { name: 'Basil', quantity: 2, unit: 'kg', status: 'Low Stock' },
  { name: 'Pasta', quantity: 50, unit: 'kg', status: 'In Stock' },
  { name: 'Pancetta', quantity: 0, unit: 'kg', status: 'Out of Stock' },
  { name: 'Chicken Breast', quantity: 30, unit: 'kg', status: 'In Stock' },
];

export default function StaffStockPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Stock Levels</h1>
        <p className="text-muted-foreground">
          View current inventory and identify items that are running low.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            A list of all ingredients and their current stock levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Out of Stock' ? 'destructive' : item.status === 'Low Stock' ? 'secondary' : 'default'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
