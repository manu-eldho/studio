
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

type LeaveRequest = {
  id: string;
  staffName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
};

const initialLeaveRequests: LeaveRequest[] = [
  { id: 'LR001', staffName: 'John Doe', startDate: '2024-08-15', endDate: '2024-08-17', reason: 'Family vacation', status: 'Pending' },
  { id: 'LR002', staffName: 'Jane Smith', startDate: '2024-08-20', endDate: '2024-08-21', reason: 'Personal appointment', status: 'Pending' },
  { id: 'LR003', staffName: 'Peter Jones', startDate: '2024-09-01', endDate: '2024-09-05', reason: 'Conference', status: 'Approved' },
  { id: 'LR004', staffName: 'Mary Williams', startDate: '2024-08-12', endDate: '2024-08-12', reason: 'Sick leave', status: 'Denied' },
];


export default function AdminLeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const handleRequest = (id: string, newStatus: 'Approved' | 'Denied') => {
    setLeaveRequests(requests => 
      requests.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
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
                    <TableCell>{request.startDate} to {request.endDate}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
