import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, CategoryInfo, Order, CustomOrderRequest, WholesaleInquiry, Coupon, Review, User, BlogPost } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { BLOG_POSTS } from '../data/blog';
import { INITIAL_COUPONS, INITIAL_CUSTOM_ORDERS, INITIAL_WHOLESALE_INQUIRIES, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/initialData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'store_db.json');

export interface DatabaseSchema {
  products: Product[];
  categories: CategoryInfo[];
  orders: Order[];
  customOrders: CustomOrderRequest[];
  wholesaleInquiries: WholesaleInquiry[];
  coupons: Coupon[];
  reviews: Review[];
  blogPosts: BlogPost[];
  users: User[];
}

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: "Mutalib Leather Admin",
    email: 'admin@mutalibleather.pk',
    phone: '03347214721',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-cust-01',
    name: 'Ahmed Malik',
    email: 'ahmed.malik@example.com',
    phone: '03009876543',
    role: 'customer',
    address: {
      street: 'House 42, Street 7, Officers Colony',
      city: 'Multan',
      postalCode: '60000',
      province: 'Punjab',
    },
    createdAt: '2026-09-01T00:00:00Z',
  }
];

class StoreDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products || INITIAL_PRODUCTS,
          categories: parsed.categories || CATEGORIES,
          orders: parsed.orders || INITIAL_ORDERS,
          customOrders: parsed.customOrders || INITIAL_CUSTOM_ORDERS,
          wholesaleInquiries: parsed.wholesaleInquiries || INITIAL_WHOLESALE_INQUIRIES,
          coupons: parsed.coupons || INITIAL_COUPONS,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          blogPosts: parsed.blogPosts || BLOG_POSTS,
          users: parsed.users || DEFAULT_USERS,
        };
      }
    } catch (err) {
      console.error('Error loading store database from file:', err);
    }

    const initial: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      categories: CATEGORIES,
      orders: INITIAL_ORDERS,
      customOrders: INITIAL_CUSTOM_ORDERS,
      wholesaleInquiries: INITIAL_WHOLESALE_INQUIRIES,
      coupons: INITIAL_COUPONS,
      reviews: INITIAL_REVIEWS,
      blogPosts: BLOG_POSTS,
      users: DEFAULT_USERS,
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave = this.data): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving store database to file:', err);
    }
  }

  // --- PRODUCTS ---
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  createProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.saveData();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.saveData();
      return this.data.products[idx];
    }
    return undefined;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  updateStock(id: string, newStock: number): boolean {
    const prod = this.data.products.find(p => p.id === id);
    if (prod) {
      prod.stock = Math.max(0, newStock);
      this.saveData();
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  getCategories(): CategoryInfo[] {
    return this.data.categories;
  }

  saveCategory(cat: CategoryInfo): CategoryInfo {
    const idx = this.data.categories.findIndex(c => c.id === cat.id);
    if (idx >= 0) {
      this.data.categories[idx] = cat;
    } else {
      this.data.categories.push(cat);
    }
    this.saveData();
    return cat;
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderByIdOrNumber(identifier: string): Order | undefined {
    return this.data.orders.find(o => o.id === identifier || o.orderNumber.toUpperCase() === identifier.trim().toUpperCase());
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const nextNumber = 1000 + this.data.orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `MLF-ORD-${nextNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);

    // Auto-deduct inventory
    for (const item of newOrder.items) {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    this.saveData();
    return newOrder;
  }

  updateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Order | undefined {
    const order = this.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.orderStatus = orderStatus;
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }
      order.updatedAt = new Date().toISOString();
      this.saveData();
      return order;
    }
    return undefined;
  }

  // --- CUSTOM ORDERS ---
  getCustomOrders(): CustomOrderRequest[] {
    return this.data.customOrders;
  }

  createCustomOrder(data: Omit<CustomOrderRequest, 'id' | 'inquiryNumber' | 'createdAt' | 'status'>): CustomOrderRequest {
    const nextNum = String(this.data.customOrders.length + 1).padStart(4, '0');
    const newRequest: CustomOrderRequest = {
      ...data,
      id: 'custom-' + Date.now(),
      inquiryNumber: `MLF-CUSTOM-${nextNum}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    this.data.customOrders.unshift(newRequest);
    this.saveData();
    return newRequest;
  }

  updateCustomOrderStatus(id: string, status: CustomOrderRequest['status'], internalNotes?: string): CustomOrderRequest | undefined {
    const req = this.data.customOrders.find(c => c.id === id || c.inquiryNumber === id);
    if (req) {
      req.status = status;
      if (internalNotes !== undefined) req.internalNotes = internalNotes;
      this.saveData();
      return req;
    }
    return undefined;
  }

  // --- WHOLESALE INQUIRIES ---
  getWholesaleInquiries(): WholesaleInquiry[] {
    return this.data.wholesaleInquiries;
  }

  createWholesaleInquiry(data: Omit<WholesaleInquiry, 'id' | 'inquiryNumber' | 'createdAt' | 'status'>): WholesaleInquiry {
    const nextNum = String(this.data.wholesaleInquiries.length + 1).padStart(4, '0');
    const newInquiry: WholesaleInquiry = {
      ...data,
      id: 'ws-' + Date.now(),
      inquiryNumber: `MLF-WS-${nextNum}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    this.data.wholesaleInquiries.unshift(newInquiry);
    this.saveData();
    return newInquiry;
  }

  updateWholesaleStatus(id: string, status: WholesaleInquiry['status'], internalNotes?: string): WholesaleInquiry | undefined {
    const item = this.data.wholesaleInquiries.find(w => w.id === id || w.inquiryNumber === id);
    if (item) {
      item.status = status;
      if (internalNotes !== undefined) item.internalNotes = internalNotes;
      this.saveData();
      return item;
    }
    return undefined;
  }

  // --- COUPONS ---
  getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  validateCoupon(code: string, cartTotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }

    if (cartTotal < coupon.minOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of Rs. ${coupon.minOrder.toLocaleString()} required.`
      };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This coupon usage limit has been reached.' };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, coupon, discount, message: `Coupon applied! You saved Rs. ${discount.toLocaleString()}` };
  }

  saveCoupon(coupon: Coupon): Coupon {
    const idx = this.data.coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      this.data.coupons[idx] = coupon;
    } else {
      this.data.coupons.push(coupon);
    }
    this.saveData();
    return coupon;
  }

  deleteCoupon(id: string): boolean {
    const len = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    if (this.data.coupons.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- REVIEWS ---
  getReviews(productId?: string): Review[] {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId && r.status === 'approved');
    }
    return this.data.reviews;
  }

  addReview(reviewData: Omit<Review, 'id' | 'date' | 'status'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
    };
    this.data.reviews.unshift(newRev);

    // Update product rating and review count
    const prod = this.data.products.find(p => p.id === reviewData.productId);
    if (prod) {
      const prodRevs = this.data.reviews.filter(r => r.productId === reviewData.productId && r.status === 'approved');
      const avg = prodRevs.reduce((sum, r) => sum + r.rating, 0) / prodRevs.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodRevs.length;
    }

    this.saveData();
    return newRev;
  }

  updateReviewStatus(id: string, status: Review['status']): boolean {
    const r = this.data.reviews.find(item => item.id === id);
    if (r) {
      r.status = status;
      this.saveData();
      return true;
    }
    return false;
  }

  // --- BLOG POSTS ---
  getBlogPosts(): BlogPost[] {
    return this.data.blogPosts;
  }

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.data.blogPosts.find(p => p.slug === slug);
  }

  // --- USERS & AUTH ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  registerUser(name: string, email: string, phone: string, role: 'customer' | 'admin' = 'customer'): User {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUserProfile(userId: string, updates: Partial<User>): User | undefined {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      this.saveData();
      return user;
    }
    return undefined;
  }
}

export const db = new StoreDatabase();
