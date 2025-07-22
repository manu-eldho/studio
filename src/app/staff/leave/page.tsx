
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { format } from "date-fns";
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeaveRequest } from "@/lib/types";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date({ required_error: "An end date is required." }),
  }),
  reason: z.string().min(10, { message: "Reason must be at least 10 characters." }).max(200, { message: "Reason must be less than 200 characters." }),
});


export default function StaffLeavePage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const [loadingHistory, setLoadingHistory] = React.useState(true);
  const [requestHistory, setRequestHistory] = React.useState<LeaveRequest[]>([]);
  const staffName = "Jane Smith"; // Hardcoded for now, would come from auth in a real app
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
        const q = query(
            collection(db, "leaveRequests"), 
            where("staffName", "==", staffName),
            orderBy("startDate", "desc")
        );
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startDate: data.startDate.toDate(),
                endDate: data.endDate.toDate(),
            } as LeaveRequest;
        });
        setRequestHistory(history);
    } catch (error) {
        console.error("Error fetching history: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load request history."});
    } finally {
        setLoadingHistory(false);
    }
  }

  React.useEffect(() => {
    fetchHistory();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
        await addDoc(collection(db, "leaveRequests"), {
            staffName,
            startDate: Timestamp.fromDate(values.dateRange.from),
            endDate: Timestamp.fromDate(values.dateRange.to),
            reason: values.reason,
            status: 'Pending',
        });

        toast({
            title: "Request Submitted!",
            description: "Your leave request has been sent for approval.",
        });
        
        form.reset();
        // Manually reset date range as react-hook-form doesn't reset it automatically
        form.setValue('dateRange', { from: undefined, to: undefined }); 
        
        // Refetch history to show the new request
        await fetchHistory();

    } catch (error) {
        console.error("Error submitting request: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to submit your request."});
    } finally {
        setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Leave Request</h1>
        <p className="text-muted-foreground">Submit a new leave request and view its status.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submit Request</CardTitle>
          <CardDescription>Fill out the form to request time off.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Leave Dates</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[300px] pl-3 text-left font-normal",
                              !field.value?.from && "text-muted-foreground"
                            )}
                          >
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value as DateRange}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Family vacation"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting}>
                 {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>Your past and pending leave requests.</CardDescription>
        </CardHeader>
        <CardContent>
            {loadingHistory ? (
                <p className="text-muted-foreground">Loading history...</p>
            ) : requestHistory.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Dates</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requestHistory.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{format(request.startDate, "LLL dd, y")} - {format(request.endDate, "LLL dd, y")}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell>
                                    <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Denied' ? 'destructive' : 'secondary'}>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                 <p className="text-muted-foreground">No leave requests submitted yet.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
