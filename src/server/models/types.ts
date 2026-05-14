export interface Book {
  id?: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentId?: string;
  shippingAddress: string;
  createdAt: Date;
}

export interface OrderItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}
