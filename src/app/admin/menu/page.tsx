
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { db } from "@/lib/firebase";
import { Dish } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";

const menuFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  category: z.enum(['Main Course', 'Appetizer', 'Dessert', 'Drink']),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
});

type MenuFormValues = z.infer<typeof menuFormSchema>;

const sampleDishes: Omit<Dish, 'id'>[] = [
    {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, tomatoes, and basil.",
        price: 12.99,
        category: "Main Course",
        image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        tags: ["Vegetarian", "Classic"]
    },
    {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan cheese.",
        price: 8.50,
        category: "Appetizer",
        image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        tags: ["Salad", "Light"]
    },
    {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
        price: 7.25,
        category: "Dessert",
        image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        tags: ["Chocolate", "Sweet", "Popular"]
    },
    {
        name: "Iced Tea",
        description: "Freshly brewed iced tea with a hint of lemon.",
        price: 2.99,
        category: "Drink",
        image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        tags: ["Refreshing", "Cold"]
    },
     {
        name: "Spaghetti Carbonara",
        description: "Pasta with a creamy sauce, pancetta, and pecorino cheese.",
        price: 15.00,
        category: "Main Course",
        image: "https://images.pexels.com/photos/128408/pexels-photo-128408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        tags: ["Pasta", "Italian", "Rich"]
    }
];

export default function AdminMenuPage() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "Main Course",
      image: "",
      tags: [],
    },
  });

  const seedDatabase = async () => {
    try {
        const menuCollection = collection(db, "menu");
        const batch = writeBatch(db);
        sampleDishes.forEach(dish => {
            const docRef = doc(menuCollection);
            batch.set(docRef, dish);
        });
        await batch.commit();
        toast({ title: "Success", description: "Sample menu items have been added." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to seed menu items."});
    }
  }

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const menuCollection = collection(db, "menu");
      const menuSnapshot = await getDocs(menuCollection);
      let menuList = menuSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Dish));

      if (menuList.length === 0) {
        await seedDatabase();
        const newSnapshot = await getDocs(menuCollection);
        menuList = newSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Dish));
      }
      
      setMenuItems(menuList);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch menu items." });
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (editingDish) {
      form.reset({
        ...editingDish,
        tags: Array.isArray(editingDish.tags) ? editingDish.tags.join(', ') : '',
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        category: "Main Course",
        image: "",
        tags: [],
      });
    }
  }, [editingDish, form, isDialogOpen]);

  const handleFormSubmit = async (values: MenuFormValues) => {
    setIsSubmitting(true);
    
    // The data that will be saved to Firestore
    const submissionData = {
        ...values,
        image: values.image || "https://placehold.co/600x400.png",
         // The form might return a string, so we ensure it's an array.
        tags: Array.isArray(values.tags) ? values.tags : values.tags.split(',').map(t => t.trim())
    };

    try {
      if (editingDish) {
        // --- Optimistic Update for Edit ---
        setMenuItems(currentItems =>
          currentItems.map(item =>
            item.id === editingDish.id ? { ...item, ...submissionData } : item
          )
        );
        const dishRef = doc(db, "menu", editingDish.id);
        await updateDoc(dishRef, submissionData);
        toast({ title: "Success", description: "Menu item updated successfully." });
      } else {
        // --- Optimistic Update for Add ---
        const docRef = await addDoc(collection(db, "menu"), submissionData);
        const newDish = { ...submissionData, id: docRef.id };
        setMenuItems(currentItems => [...currentItems, newDish]);
        toast({ title: "Item added", description: "The new dish has been saved." });
      }
      
      setIsDialogOpen(false);
      setEditingDish(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save menu item." });
      // If there was an error, we can refetch to get the true state
      fetchMenuItems(); 
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDish = async (dishId: string) => {
    // Optimistic deletion
    const originalItems = [...menuItems];
    setMenuItems(prevItems => prevItems.filter(item => item.id !== dishId));
    try {
        await deleteDoc(doc(db, "menu", dishId));
        toast({ title: "Success", description: "Menu item deleted successfully." });
    } catch (error) {
        setMenuItems(originalItems); // Rollback on error
        toast({ variant: "destructive", title: "Error", description: "Failed to delete menu item."});
    }
  }

  const openEditDialog = (dish: Dish) => {
    setEditingDish(dish);
    setIsDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingDish(null);
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove menu items.</p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2" />
          Add New Item
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell>
                      <Image src={dish.image || "https://placehold.co/600x400.png"} alt={dish.name} width={64} height={64} className="rounded-md object-cover h-16 w-16" data-ai-hint="food dish" />
                    </TableCell>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell>{dish.category}</TableCell>
                    <TableCell>${dish.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(dish)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>This action cannot be undone. This will permanently delete the menu item.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteDish(dish.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            setEditingDish(null);
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDish ? "Edit Menu Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingDish ? "Update the details of the existing dish." : "Fill in the details for the new dish."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Classic Burger" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the dish..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g. 12.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Main Course">Main Course</SelectItem>
                        <SelectItem value="Appetizer">Appetizer</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                        <SelectItem value="Drink">Drink</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://placehold.co/600x400.png" {...field} />
                    </FormControl>
                     <FormDescription>
                        Optional. If left blank, a placeholder image will be used.
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Spicy, Vegan, Popular" {...field} onChange={e => field.onChange(e.target.value)} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of tags.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingDish ? "Save Changes" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    