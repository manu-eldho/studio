export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'Single' | 'Double' | 'Suite';
  features: string[];
}
