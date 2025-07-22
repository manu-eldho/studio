
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMenuPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground">
          Add, edit, or remove menu items.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            A list of all the dishes in your restaurant.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>Menu management interface will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
