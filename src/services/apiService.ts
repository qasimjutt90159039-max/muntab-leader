import { Product, CategoryInfo, Order, CustomOrderRequest, WholesaleInquiry, Coupon, Review, User } from '../types';
import { storageService } from './storageService';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Received HTML fallback');
    }
    return await res.json();
  } catch (err) {
    if (fallback) {
      return fallback();
    }
    throw err;
  }
}

export const apiService = {
  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    let url = `${BASE_URL}/products`;
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;

    return fetchJson<Product[]>(url, undefined, () => storageService.getProducts());
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<Product | undefined> {
    return fetchJson<Product>(
      `${BASE_URL}/products/${encodeURIComponent(idOrSlug)}`,
      undefined,
      () => storageService.getProductBySlug(idOrSlug) || storageService.getProductById(idOrSlug)
    );
  },

  async createProduct(product: Product): Promise<Product> {
    return fetchJson<Product>(
      `${BASE_URL}/products`,
      { method: 'POST', body: JSON.stringify(product) },
      () => storageService.saveProduct(product)
    );
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    return fetchJson<Product>(
      `${BASE_URL}/products/${encodeURIComponent(id)}`,
      { method: 'PUT', body: JSON.stringify(updates) },
      () => {
        const prod = storageService.getProductById(id);
        if (prod) {
          const updated = { ...prod, ...updates };
          return storageService.saveProduct(updated);
        }
        return undefined;
      }
    );
  },

  async deleteProduct(id: string): Promise<boolean> {
    return fetchJson<{ success: boolean }>(
      `${BASE_URL}/products/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
      () => ({ success: storageService.deleteProduct(id) })
    ).then(res => res.success);
  },

  async updateStock(id: string, newStock: number): Promise<boolean> {
    return fetchJson<{ success: boolean }>(
      `${BASE_URL}/products/${encodeURIComponent(id)}/stock`,
      { method: 'PATCH', body: JSON.stringify({ stock: newStock }) },
      () => ({ success: storageService.updateStock(id, newStock) })
    ).then(res => res.success);
  },

  // Categories
  async getCategories(): Promise<CategoryInfo[]> {
    return fetchJson<CategoryInfo[]>(
      `${BASE_URL}/categories`,
      undefined,
      () => storageService.getCategories()
    );
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return fetchJson<Order[]>(
      `${BASE_URL}/orders`,
      undefined,
      () => storageService.getOrders()
    );
  },

  async getOrderByIdOrNumber(idOrNumber: string): Promise<Order | undefined> {
    return fetchJson<Order>(
      `${BASE_URL}/orders/${encodeURIComponent(idOrNumber)}`,
      undefined,
      () => storageService.getOrderById(idOrNumber)
    );
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    return fetchJson<Order>(
      `${BASE_URL}/orders`,
      { method: 'POST', body: JSON.stringify(orderData) },
      () => storageService.createOrder(orderData)
    );
  },

  async updateOrderStatus(orderId: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Promise<Order | undefined> {
    return fetchJson<Order>(
      `${BASE_URL}/orders/${encodeURIComponent(orderId)}/status`,
      { method: 'PATCH', body: JSON.stringify({ orderStatus, paymentStatus }) },
      () => storageService.updateOrderStatus(orderId, orderStatus, paymentStatus)
    );
  },

  // Custom Orders
  async getCustomOrders(): Promise<CustomOrderRequest[]> {
    return fetchJson<CustomOrderRequest[]>(
      `${BASE_URL}/custom-orders`,
      undefined,
      () => storageService.getCustomOrders()
    );
  },

  async createCustomOrder(data: Omit<CustomOrderRequest, 'id' | 'inquiryNumber' | 'createdAt' | 'status'>): Promise<CustomOrderRequest> {
    return fetchJson<CustomOrderRequest>(
      `${BASE_URL}/custom-orders`,
      { method: 'POST', body: JSON.stringify(data) },
      () => storageService.createCustomOrder(data)
    );
  },

  async updateCustomOrderStatus(id: string, status: CustomOrderRequest['status'], internalNotes?: string): Promise<CustomOrderRequest | undefined> {
    return fetchJson<CustomOrderRequest>(
      `${BASE_URL}/custom-orders/${encodeURIComponent(id)}/status`,
      { method: 'PATCH', body: JSON.stringify({ status, internalNotes }) },
      () => storageService.updateCustomOrderStatus(id, status, internalNotes)
    );
  },

  // Wholesale Inquiries
  async getWholesaleInquiries(): Promise<WholesaleInquiry[]> {
    return fetchJson<WholesaleInquiry[]>(
      `${BASE_URL}/wholesale`,
      undefined,
      () => storageService.getWholesaleInquiries()
    );
  },

  async createWholesaleInquiry(data: Omit<WholesaleInquiry, 'id' | 'inquiryNumber' | 'createdAt' | 'status'>): Promise<WholesaleInquiry> {
    return fetchJson<WholesaleInquiry>(
      `${BASE_URL}/wholesale`,
      { method: 'POST', body: JSON.stringify(data) },
      () => storageService.createWholesaleInquiry(data)
    );
  },

  async updateWholesaleStatus(id: string, status: WholesaleInquiry['status'], internalNotes?: string): Promise<WholesaleInquiry | undefined> {
    return fetchJson<WholesaleInquiry>(
      `${BASE_URL}/wholesale/${encodeURIComponent(id)}/status`,
      { method: 'PATCH', body: JSON.stringify({ status, internalNotes }) },
      () => storageService.updateWholesaleStatus(id, status, internalNotes)
    );
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    return fetchJson<Coupon[]>(
      `${BASE_URL}/coupons`,
      undefined,
      () => storageService.getCoupons()
    );
  },

  async validateCoupon(code: string, cartTotal: number): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message: string }> {
    return fetchJson<{ valid: boolean; coupon?: Coupon; discount: number; message: string }>(
      `${BASE_URL}/coupons/validate`,
      { method: 'POST', body: JSON.stringify({ code, cartTotal }) },
      () => storageService.validateCoupon(code, cartTotal)
    );
  },

  async saveCoupon(coupon: Coupon): Promise<Coupon> {
    return fetchJson<Coupon>(
      `${BASE_URL}/coupons`,
      { method: 'POST', body: JSON.stringify(coupon) },
      () => storageService.saveCoupon(coupon)
    );
  },

  async deleteCoupon(id: string): Promise<boolean> {
    return fetchJson<{ success: boolean }>(
      `${BASE_URL}/coupons/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
      () => ({ success: storageService.deleteCoupon(id) })
    ).then(res => res.success);
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    const url = productId ? `${BASE_URL}/reviews?productId=${encodeURIComponent(productId)}` : `${BASE_URL}/reviews`;
    return fetchJson<Review[]>(url, undefined, () => storageService.getReviews(productId));
  },

  async addReview(data: Omit<Review, 'id' | 'date' | 'status'>): Promise<Review> {
    return fetchJson<Review>(
      `${BASE_URL}/reviews`,
      { method: 'POST', body: JSON.stringify(data) },
      () => storageService.addReview(data)
    );
  },

  async updateReviewStatus(id: string, status: Review['status']): Promise<boolean> {
    return fetchJson<{ success: boolean }>(
      `${BASE_URL}/reviews/${encodeURIComponent(id)}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      () => ({ success: storageService.updateReviewStatus(id, status) })
    ).then(res => res.success);
  },

  // AI Chat
  async sendAiMessage(message: string): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      return data.reply || "Welcome to Mutalib's Leather Factory. Please contact us at 03347214721 for assistance.";
    } catch {
      return "Welcome to Mutalib's Leather Factory Multan! For prompt assistance or custom orders, call or WhatsApp our factory directly at 03347214721.";
    }
  }
};
