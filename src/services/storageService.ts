import { Product, CategoryInfo, Order, CustomOrderRequest, WholesaleInquiry, Coupon, Review, User } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { BLOG_POSTS } from '../data/blog';
import { INITIAL_COUPONS, INITIAL_CUSTOM_ORDERS, INITIAL_WHOLESALE_INQUIRIES, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/initialData';

const KEYS = {
  PRODUCTS: 'mlf_products_v1',
  CATEGORIES: 'mlf_categories_v1',
  ORDERS: 'mlf_orders_v1',
  CUSTOM_ORDERS: 'mlf_custom_orders_v1',
  WHOLESALE: 'mlf_wholesale_v1',
  COUPONS: 'mlf_coupons_v1',
  REVIEWS: 'mlf_reviews_v1',
  BLOG: 'mlf_blog_v1',
  USERS: 'mlf_users_v1',
  CURRENT_USER: 'mlf_current_user_v1',
  WISHLIST: 'mlf_wishlist_v1',
  CART: 'mlf_cart_v1',
  STORE_SETTINGS: 'mlf_store_settings_v1',
};

// Safe JSON parse helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage set error:', err);
  }
}

// Initializer
export function initializeStorage(): void {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    setStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    setStored(KEYS.CATEGORIES, CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.BLOG)) {
    setStored(KEYS.BLOG, BLOG_POSTS);
  }
  if (!localStorage.getItem(KEYS.COUPONS)) {
    setStored(KEYS.COUPONS, INITIAL_COUPONS);
  }
  if (!localStorage.getItem(KEYS.CUSTOM_ORDERS)) {
    setStored(KEYS.CUSTOM_ORDERS, INITIAL_CUSTOM_ORDERS);
  }
  if (!localStorage.getItem(KEYS.WHOLESALE)) {
    setStored(KEYS.WHOLESALE, INITIAL_WHOLESALE_INQUIRIES);
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    setStored(KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    setStored(KEYS.ORDERS, INITIAL_ORDERS);
  }
  // Initialize sample users: 1 Admin and 1 Demo Customer
  if (!localStorage.getItem(KEYS.USERS)) {
    const initialUsers: User[] = [
      {
        id: 'usr-admin-01',
        name: 'Mutalib Leather Admin',
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
    setStored(KEYS.USERS, initialUsers);
  }
}

export const storageService = {
  // Products
  getProducts(): Product[] {
    return getStored<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },
  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find(p => p.slug === slug);
  },
  saveProduct(product: Product): Product {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }
    setStored(KEYS.PRODUCTS, products);
    return product;
  },
  deleteProduct(id: string): boolean {
    const products = this.getProducts().filter(p => p.id !== id);
    setStored(KEYS.PRODUCTS, products);
    return true;
  },
  updateStock(id: string, newStock: number): boolean {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.stock = Math.max(0, newStock);
      setStored(KEYS.PRODUCTS, products);
      return true;
    }
    return false;
  },

  // Categories
  getCategories(): CategoryInfo[] {
    return getStored<CategoryInfo[]>(KEYS.CATEGORIES, CATEGORIES);
  },
  saveCategory(category: CategoryInfo): CategoryInfo {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    setStored(KEYS.CATEGORIES, list);
    return category;
  },
  deleteCategory(id: string): boolean {
    const list = this.getCategories().filter(c => c.id !== id);
    setStored(KEYS.CATEGORIES, list);
    return true;
  },

  // Orders
  getOrders(): Order[] {
    return getStored<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },
  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  },
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const nextNumber = 1000 + orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `MLF-ORD-${nextNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    setStored(KEYS.ORDERS, orders);

    // Deduct stock for ordered items
    const products = this.getProducts();
    for (const item of newOrder.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }
    setStored(KEYS.PRODUCTS, products);

    return newOrder;
  },
  updateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.orderStatus = orderStatus;
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }
      order.updatedAt = new Date().toISOString();
      setStored(KEYS.ORDERS, orders);
      return order;
    }
    return undefined;
  },

  // Custom Orders
  getCustomOrders(): CustomOrderRequest[] {
    return getStored<CustomOrderRequest[]>(KEYS.CUSTOM_ORDERS, INITIAL_CUSTOM_ORDERS);
  },
  createCustomOrder(data: Omit<CustomOrderRequest, 'id' | 'inquiryNumber' | 'createdAt' | 'status'>): CustomOrderRequest {
    const list = this.getCustomOrders();
    const nextNum = String(list.length + 1).padStart(4, '0');
    const newCustomOrder: CustomOrderRequest = {
      ...data,
      id: 'custom-' + Date.now(),
      inquiryNumber: `MLF-CUSTOM-${nextNum}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newCustomOrder);
    setStored(KEYS.CUSTOM_ORDERS, list);
    return newCustomOrder;
  },
  updateCustomOrderStatus(id: string, status: CustomOrderRequest['status'], internalNotes?: string): CustomOrderRequest | undefined {
    const list = this.getCustomOrders();
    const item = list.find(c => c.id === id || c.inquiryNumber === id);
    if (item) {
      item.status = status;
      if (internalNotes !== undefined) item.internalNotes = internalNotes;
      setStored(KEYS.CUSTOM_ORDERS, list);
      return item;
    }
    return undefined;
  },

  // Wholesale
  getWholesaleInquiries(): WholesaleInquiry[] {
    return getStored<WholesaleInquiry[]>(KEYS.WHOLESALE, INITIAL_WHOLESALE_INQUIRIES);
  },
  createWholesaleInquiry(data: Omit<WholesaleInquiry, 'id' | 'inquiryNumber' | 'createdAt' | 'status'>): WholesaleInquiry {
    const list = this.getWholesaleInquiries();
    const nextNum = String(list.length + 1).padStart(4, '0');
    const newInquiry: WholesaleInquiry = {
      ...data,
      id: 'ws-' + Date.now(),
      inquiryNumber: `MLF-WS-${nextNum}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newInquiry);
    setStored(KEYS.WHOLESALE, list);
    return newInquiry;
  },
  updateWholesaleStatus(id: string, status: WholesaleInquiry['status'], internalNotes?: string): WholesaleInquiry | undefined {
    const list = this.getWholesaleInquiries();
    const item = list.find(w => w.id === id || w.inquiryNumber === id);
    if (item) {
      item.status = status;
      if (internalNotes !== undefined) item.internalNotes = internalNotes;
      setStored(KEYS.WHOLESALE, list);
      return item;
    }
    return undefined;
  },

  // Coupons
  getCoupons(): Coupon[] {
    return getStored<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  },
  validateCoupon(code: string, cartTotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const coupons = this.getCoupons();
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }

    const now = new Date();
    if (new Date(coupon.expiryDate) < now) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }

    if (cartTotal < coupon.minOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of Rs. ${coupon.minOrder.toLocaleString()} required for this coupon.`
      };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This coupon has reached its maximum usage limit.' };
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
  },
  saveCoupon(coupon: Coupon): Coupon {
    const list = this.getCoupons();
    const idx = list.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      list[idx] = coupon;
    } else {
      list.push(coupon);
    }
    setStored(KEYS.COUPONS, list);
    return coupon;
  },
  deleteCoupon(id: string): boolean {
    const list = this.getCoupons().filter(c => c.id !== id);
    setStored(KEYS.COUPONS, list);
    return true;
  },

  // Reviews
  getReviews(productId?: string): Review[] {
    const all = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return all.filter(r => r.productId === productId && r.status === 'approved');
    }
    return all;
  },
  addReview(data: Omit<Review, 'id' | 'date' | 'status'>): Review {
    const all = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    const newRev: Review = {
      ...data,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'approved', // Auto-approved or moderation queue
    };
    all.unshift(newRev);
    setStored(KEYS.REVIEWS, all);

    // Update product rating and review count
    const products = this.getProducts();
    const prod = products.find(p => p.id === data.productId);
    if (prod) {
      const prodRevs = all.filter(r => r.productId === data.productId && r.status === 'approved');
      const avg = prodRevs.reduce((sum, r) => sum + r.rating, 0) / prodRevs.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodRevs.length;
      setStored(KEYS.PRODUCTS, products);
    }

    return newRev;
  },
  updateReviewStatus(id: string, status: Review['status']): boolean {
    const all = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    const r = all.find(item => item.id === id);
    if (r) {
      r.status = status;
      setStored(KEYS.REVIEWS, all);
      return true;
    }
    return false;
  },
  deleteReview(id: string): boolean {
    const all = getStored<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS).filter(r => r.id !== id);
    setStored(KEYS.REVIEWS, all);
    return true;
  },

  // Blog
  getBlogPosts(): BlogPost[] {
    return getStored<BlogPost[]>(KEYS.BLOG, BLOG_POSTS);
  },
  getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.getBlogPosts().find(p => p.slug === slug);
  },
  saveBlogPost(post: BlogPost): BlogPost {
    const list = this.getBlogPosts();
    const idx = list.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      list[idx] = post;
    } else {
      list.unshift(post);
    }
    setStored(KEYS.BLOG, list);
    return post;
  },
  deleteBlogPost(id: string): boolean {
    const list = this.getBlogPosts().filter(p => p.id !== id);
    setStored(KEYS.BLOG, list);
    return true;
  },

  // Users & Auth
  getUsers(): User[] {
    return getStored<User[]>(KEYS.USERS, []);
  },
  getCurrentUser(): User | null {
    return getStored<User | null>(KEYS.CURRENT_USER, null);
  },
  setCurrentUser(user: User | null): void {
    setStored(KEYS.CURRENT_USER, user);
  },
  registerUser(name: string, email: string, phone: string, role: 'customer' | 'admin' = 'customer'): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setStored(KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return newUser;
  },
  loginUser(email: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No user found with this email address.');
    }
    this.setCurrentUser(user);
    return user;
  },
  updateUserProfile(userId: string, updates: Partial<User>): User | undefined {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      setStored(KEYS.USERS, users);
      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        this.setCurrentUser({ ...current, ...updates });
      }
      return user;
    }
    return undefined;
  },

  // Wishlist
  getWishlist(): string[] {
    return getStored<string[]>(KEYS.WISHLIST, []);
  },
  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const idx = list.indexOf(productId);
    let added = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      added = false;
    } else {
      list.push(productId);
      added = true;
    }
    setStored(KEYS.WISHLIST, list);
    return added;
  }
};
