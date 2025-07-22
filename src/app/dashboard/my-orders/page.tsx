
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order, Review } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, addDoc, Timestamp, doc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";

const ReviewForm = ({ order, onReviewSubmitted }: { order: Order, onReviewSubmitted: (orderId: string) => void }) => {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ variant: "destructive", title: "Error", description: "Please select a rating." });
            return;
        }
        setIsSubmitting(true);
        try {
            // Add review
            await addDoc(collection(db, "reviews"), {
                orderId: order.id,
                customerName: order.customerName || "Jane Doe",
                rating,
                comment,
                date: Timestamp.now(),
                dishName: order.items[0], // Assuming one item per order for simplicity
            } as Omit<Review, 'id'>);

            // Mark order as reviewed
            const orderRef = doc(db, "orders", order.id);
            await updateDoc(orderRef, { reviewed: true });
            
            toast({ title: "Success", description: "Your review has been submitted!" });
            onReviewSubmitted(order.id);
            setIsOpen(false);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to submit review." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={order.reviewed}>
                    {order.reviewed ? "Reviewed" : "Leave a Review"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review your order for {order.items[0]}</DialogTitle>
                    <DialogDescription>Share your experience to help us improve.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Rating:</span>
                         <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-7 w-7 cursor-pointer ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                    </div>
                    <Textarea
                        placeholder="Tell us more about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function MyOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersCollection = query(collection(db, "orders"), where("customerName", "==", "Jane Doe"), orderBy("date", "desc"));
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
              date: data.date.toDate(),
          } as Order;
      });
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handlePayment = async (orderId: string) => {
    // Optimistic update
    setOrders(currentOrders => currentOrders.map(o => o.id === orderId ? {...o, paymentStatus: 'Paid'} : o));

    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { paymentStatus: 'Paid' });
        toast({title: "Payment Successful", description: "Thank you for your payment!"});
    } catch (error) {
        console.error("Error processing payment:", error);
        toast({variant: "destructive", title: "Error", description: "Could not process payment."});
        // Rollback on error
        setOrders(currentOrders => currentOrders.map(o => o.id === orderId ? {...o, paymentStatus: 'Unpaid'} : o));
    }
  }

  const handleReviewSubmitted = (orderId: string) => {
     setOrders(currentOrders => currentOrders.map(o => o.id === orderId ? {...o, reviewed: true} : o));
  }
  
  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
        case 'Delivered': return 'default';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">
          View your order history, track payments, and leave reviews.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {loading ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(0, 7)}</TableCell>
                    <TableCell>{format(order.date, 'PPP')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items.join(', ')}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                        {order.paymentStatus === 'Unpaid' && order.status !== 'Cancelled' && (
                            <Button size="sm" onClick={() => handlePayment(order.id)}>Pay Now</Button>
                        )}
                        {order.status === 'Delivered' && (
                            <ReviewForm order={order} onReviewSubmitted={handleReviewSubmitted} />
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {orders.length === 0 && !loading && (
            <div className="text-center py-10 text-muted-foreground">
                You haven't placed any orders yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
