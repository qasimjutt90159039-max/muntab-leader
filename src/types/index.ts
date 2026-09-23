export type ProductCategory =
  | 'Wallets'
  | 'Belts'
  | 'Bags'
  | 'Backpacks'
  | 'Laptop Bags'
  | 'Card Holders'
  | 'Passport Holders'
  | 'Travel Accessories'
  | 'Office Accessories'
  | 'Key Holders'
  | 'Leather Jackets'
  | 'Gift Sets';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  images: string[];
  thumbnail: string;
  material: string;
  color: string;
  availableColors: string[];
  size?: string;
  availableSizes?: string[];
  dimensions: string;
  weight: string;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  onSale: boolean;
  tags: string[];
  careInstructions: string;
  specifications: Record<string, string>;
}

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  image: string;
  subcategories: string[];
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    postalCode: string;
    province: string;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  thumbnail: string;
}

export interface CustomerInformation {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  orderNotes?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type PaymentMethod = 'Cash on Delivery' | 'Online Payment';

export interface Order {
  id: string;
  orderNumber: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  customerInformation: CustomerInformation;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface CustomOrderRequest {
  id: string;
  inquiryNumber: string;
  customerName: string;
  phone: string;
  email: string;
  productType: string;
  preferredMaterial: string;
  color: string;
  size?: string;
  quantity: number;
  customText?: string;
  logoRequirement: 'Yes' | 'No';
  budget?: string;
  additionalInstructions: string;
  referenceImage?: string;
  status: 'New' | 'Reviewing' | 'Quoted' | 'Approved' | 'In Production' | 'Completed' | 'Cancelled';
  internalNotes?: string;
  createdAt: string;
}

export interface WholesaleInquiry {
  id: string;
  inquiryNumber: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productCategory: string;
  estimatedQuantity: number;
  budget?: string;
  requiredDate?: string;
  shippingCity: string;
  message: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Negotiating' | 'Approved' | 'Completed' | 'Cancelled';
  internalNotes?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedDate: string;
  tags: string[];
}
