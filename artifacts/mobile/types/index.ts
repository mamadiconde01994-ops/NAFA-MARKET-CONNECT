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

export type MainCategoryId =
  | "agriculture"
  | "restaurants"
  | "real-estate"
  | "vehicles"
  | "electronics"
  | "fashion"
  | "home-furniture"
  | "construction"
  | "services"
  | "jobs"
  | "logistics"
  | "other";

export interface MainCategory {
  id: MainCategoryId;
  name: string;
  icon: string;
  color: string;
  description: string;
  comingSoon?: boolean;
}

export interface MarketPrice {
  id: string;
  product: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  market: string;
}

export type RestaurantCuisine =
  | "guinean"
  | "senegalese"
  | "lebanese"
  | "french"
  | "chinese"
  | "fastfood"
  | "mixed"
  | "bbq"
  | "cafe";

export interface RestaurantMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: RestaurantCuisine;
  address: string;
  city: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceRange: 1 | 2 | 3;
  deliveryTime: number;
  deliveryFee: number;
  featured: boolean;
  isOpen: boolean;
  menu: RestaurantMenuItem[];
  phone: string;
}

export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial"
  | "warehouse";

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  priceType: "sale" | "rent";
  surface: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city: string;
  images: string[];
  rating?: number;
  featured: boolean;
  agentName: string;
  agentPhone: string;
  createdAt: string;
}

export type ServiceCategoryId =
  | "mechanics"
  | "electrician"
  | "plumber"
  | "technician"
  | "freelancer"
  | "cleaning"
  | "security"
  | "transport"
  | "construction"
  | "welder";

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategoryId;
  description: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceType: "per_hour" | "per_job" | "negotiable";
  available: boolean;
  verified: boolean;
  image: string;
  skills: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  surfaceM2: number;
  pricePerMonth: number;
  available: boolean;
  features: string[];
  images: string[];
  ownerName: string;
  ownerPhone: string;
  rating: number;
}

export type VehicleType =
  | "car"
  | "motorcycle"
  | "truck"
  | "van"
  | "parts";

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  price: number;
  priceType: "sale" | "rent";
  mileage?: number;
  fuel?: "petrol" | "diesel" | "electric" | "hybrid";
  condition: "new" | "used" | "refurbished";
  city: string;
  images: string[];
  sellerName: string;
  sellerPhone: string;
  rating?: number;
  featured: boolean;
  createdAt: string;
}

export type JobCategory =
  | "agriculture"
  | "restaurant"
  | "construction"
  | "transport"
  | "tech"
  | "health"
  | "education"
  | "trade"
  | "security"
  | "domestic";

export type ContractType = "full_time" | "part_time" | "temporary" | "freelance";

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  category: JobCategory;
  city: string;
  salary?: number;
  salaryType?: "per_month" | "per_day" | "negotiable";
  contractType: ContractType;
  requirements: string[];
  featured: boolean;
  postedAt: string;
  contactPhone: string;
  contactName: string;
  urgent?: boolean;
}
