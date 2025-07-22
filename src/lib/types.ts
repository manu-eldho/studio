export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Main Course' | 'Appetizer' | 'Dessert' | 'Drink';
  tags: string[];
}
