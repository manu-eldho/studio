import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin. Here's an overview of your restaurant.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">$125,432.50</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">5,678</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>Needs attention</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">12</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Staff on Duty</CardTitle>
                <CardDescription>Currently active</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">8</p>
            </CardContent>
          </Card>
      </div>
       <div>
        <h2 className="text-2xl font-bold font-headline tracking-tight">Quick Actions</h2>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            {/* Quick actions can be added here */}
         </div>
      </div>
    </div>
  );
}
