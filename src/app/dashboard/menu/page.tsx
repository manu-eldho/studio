"use client";

import { BrowseMenu } from "@/components/dashboard/browse-menu";
import { Dish } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuPage() {
  const [menu, setMenu] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuCollection = collection(db, "menu");
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dish));
        setMenu(menuList);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full md:w-[180px]" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return <BrowseMenu menu={menu} />;
}


const CardSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-2 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="p-4 flex justify-between items-center">
             <Skeleton className="h-8 w-20" />
             <Skeleton className="h-10 w-28" />
        </div>
    </div>
)
