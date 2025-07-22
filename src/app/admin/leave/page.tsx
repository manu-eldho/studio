
"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import type { LeaveRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";


export default function AdminLeavePage() {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "leaveRequests"), orderBy("startDate", "desc"));
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
        } as LeaveRequest;
      });
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Error fetching requests: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch leave requests." });
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleRequest = async (id: string, newStatus: 'Approved' | 'Denied') => {
    const originalRequests = [...leaveRequests];
    // Optimistically update UI
    setLeaveRequests(requests => 
      requests.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );

    try {
      const requestRef = doc(db, "leaveRequests", id);
      await updateDoc(requestRef, { status: newStatus });
      toast({ title: "Success", description: `Request has been ${newStatus.toLowerCase()}.` });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update request status." });
      // Rollback UI change on error
      setLeaveRequests(originalRequests);
    }
  };

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
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            A list of all leave requests from staff members.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                 <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.staffName}</TableCell>
                        <TableCell>{format(request.startDate, "LLL dd, y")} to {format(request.endDate, "LLL dd, y")}</TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                        <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Denied' ? 'destructive' : 'secondary'}>
                            {request.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        {request.status === 'Pending' && (
                            <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleRequest(request.id, 'Approved')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRequest(request.id, 'Denied')}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deny
                            </Button>
                            </div>
                        )}
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
