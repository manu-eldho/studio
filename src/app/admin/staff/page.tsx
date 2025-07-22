
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStaffPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage your restaurant's staff members.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>
            A list of all staff members.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p>Staff management interface will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
