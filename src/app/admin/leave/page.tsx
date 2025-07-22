
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLeavePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Leave Requests</h1>
        <p className="text-muted-foreground">
          Approve or deny staff leave requests.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Leave requests that need your attention.
          </CardDescription>
        </Header>
        <CardContent>
            <p>Leave request interface will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
