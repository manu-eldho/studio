
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Review } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Star } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
        ))}
    </div>
);

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "reviews"), orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);
                const fetchedReviews = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date.toDate(),
                    } as Review;
                });
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Customer Reviews</h1>
                <p className="text-muted-foreground">
                    See what your customers are saying about your dishes.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
                    <CardDescription>A list of all customer feedback.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Dish</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Comment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.map(review => (
                                    <TableRow key={review.id}>
                                        <TableCell>{format(review.date, "PPP")}</TableCell>
                                        <TableCell className="font-medium">{review.customerName}</TableCell>
                                        <TableCell>{review.dishName}</TableCell>
                                        <TableCell>
                                            <StarRating rating={review.rating} />
                                        </TableCell>
                                        <TableCell>{review.comment}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {reviews.length === 0 && !loading && (
                        <div className="text-center py-10 text-muted-foreground">
                            No reviews have been submitted yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
