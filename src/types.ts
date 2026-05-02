export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  compatibility: string;
  material: string;
  dimensions: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  phone: string;
  email: string;
  location: string;
  quantity: number;
  notes: string;
  timestamp: number;
  status: 'pending' | 'contacted' | 'completed';
}
