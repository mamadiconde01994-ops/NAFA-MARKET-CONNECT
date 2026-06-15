export type UserRole =
  | "farmer"
  | "trader"
  | "warehouse"
  | "restaurant"
  | "delivery"
  | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location: string;
  verified: boolean;
  createdAt: string;
  stats: {
    listings: number;
    sales: number;
    orders: number;
    rating: number;
  };
}

export type ProductCategory =
  | "vegetables"
  | "fruits"
  | "grains"
  | "livestock"
  | "fish"
  | "processed"
  | "dairy";

export type ProductUnit =
  | "kg"
  | "g"
  | "piece"
  | "bunch"
  | "bag"
  | "liter"
  | "bottle";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: ProductUnit;
  category: ProductCategory;
  images: string[];
  quantity: number;
  available: number;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  location: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: ProductCategory;
  name: string;
  icon: string;
  color: string;
}
