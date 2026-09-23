import React, { useState, useEffect } from 'react';
import {
  Shield,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Tag,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Save,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/apiService';
import { Order, Product, CustomOrderRequest, WholesaleInquiry, Coupon, Review, ProductCategory } from '../types';
import { CATEGORIES } from '../data/categories';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, quickLoginAsAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'custom' | 'wholesale' | 'coupons' | 'reviews'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>([]);
  const [wholesale, setWholesale] = useState<WholesaleInquiry[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Product editing modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Coupon form modal state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(2500);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [o, p, c, w, cp, r] = await Promise.all([
        apiService.getOrders(),
        apiService.getProducts(),
        apiService.getCustomOrders(),
        apiService.getWholesaleInquiries(),
        apiService.getCoupons(),
        apiService.getReviews(),
      ]);
      setOrders(o);
      setProducts(p);
      setCustomOrders(c);
      setWholesale(w);
      setCoupons(cp);
      setReviews(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-[#EBE5DF] text-center shadow-xs">
        <Shield className="w-12 h-12 text-[#8C5D38] mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold text-[#1E1511]">Administrator Access Required</h2>
        <p className="text-xs text-stone-600 mt-2 mb-6">
          This management portal is reserved for Mutalib's Leather Factory store operators and authorized inventory managers.
        </p>
        <button
          onClick={() => {
            quickLoginAsAdmin();
            loadAllData();
          }}
          className="w-full py-3 bg-[#1E1511] hover:bg-stone-900 text-[#C89D6E] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          Sign In as Admin (Demo)
        </button>
      </div>
    );
  }

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered' ? o.total : 0), 0);
  const totalPendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const lowStockProducts = products.filter(p => p.stock < 5);

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) => {
    const updated = await apiService.updateOrderStatus(orderId, status, paymentStatus);
    if (updated) {
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order ${updated.orderNumber} status updated to ${status}`, 'success');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isNewProduct) {
        const created = await apiService.createProduct(editingProduct);
        setProducts([created, ...products]);
        showToast('New product added to catalog.', 'success');
      } else {
        const updated = await apiService.updateProduct(editingProduct.id, editingProduct);
        if (updated) {
          setProducts(products.map(p => p.id === updated.id ? updated : p));
          showToast('Product updated successfully.', 'success');
        }
      }
      setEditingProduct(null);
    } catch (err: any) {
      showToast(err.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this product from catalog?')) {
      await apiService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showToast('Product deleted.', 'info');
    }
  };

  const handleQuickStockUpdate = async (id: string, newStock: number) => {
    await apiService.updateStock(id, newStock);
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    showToast('Stock inventory updated.', 'success');
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCpn: Coupon = {
      id: 'cpn-' + Date.now(),
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrder: Number(newCouponMin),
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 0,
      active: true,
    };

    const saved = await apiService.saveCoupon(newCpn);
    setCoupons([saved, ...coupons]);
    setNewCouponCode('');
    showToast(`Coupon ${saved.code} created!`, 'success');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#8C5D38]" />
              <h1 className="text-2xl font-serif font-bold text-[#1E1511]">Store Operator Portal</h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Mutalib's Leather Factory · Multan, Pakistan · Live Store Backend Control Center
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 font-mono font-medium rounded-full">
              System Online (v1.0)
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 pb-6 border-b border-[#EBE5DF]">
          {[
            { id: 'overview', label: 'Dashboard Overview', count: undefined },
            { id: 'orders', label: 'Orders', count: orders.length },
            { id: 'products', label: 'Catalog & Inventory', count: products.length },
            { id: 'custom', label: 'Bespoke Inquiries', count: customOrders.length },
            { id: 'wholesale', label: 'Wholesale Leads', count: wholesale.length },
            { id: 'coupons', label: 'Coupons & Promos', count: coupons.length },
            { id: 'reviews', label: 'Customer Reviews', count: reviews.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#1E1511] text-[#FAF8F5] shadow-xs'
                  : 'bg-white border border-[#EBE5DF] text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                  activeTab === tab.id ? 'bg-[#8C5D38] text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 border border-[#EBE5DF] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Total Revenue (Paid/Delivered)</span>
                <div className="text-2xl font-mono font-bold text-[#8C5D38] mt-1">Rs. {totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-stone-500 mt-1">From all completed deliveries</div>
              </div>

              <div className="bg-white p-5 border border-[#EBE5DF] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Active Orders</span>
                <div className="text-2xl font-mono font-bold text-stone-900 mt-1">{orders.length}</div>
                <div className="text-[11px] text-amber-700 mt-1">{totalPendingOrders} pending confirmation</div>
              </div>

              <div className="bg-white p-5 border border-[#EBE5DF] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Bespoke & Wholesale Leads</span>
                <div className="text-2xl font-mono font-bold text-stone-900 mt-1">{customOrders.length + wholesale.length}</div>
                <div className="text-[11px] text-stone-500 mt-1">{customOrders.length} custom, {wholesale.length} bulk</div>
              </div>

              <div className="bg-white p-5 border border-[#EBE5DF] shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Low Stock Warnings</span>
                <div className="text-2xl font-mono font-bold text-red-600 mt-1">{lowStockProducts.length}</div>
                <div className="text-[11px] text-stone-500 mt-1">Items with less than 5 units</div>
              </div>
            </div>

            {/* Quick Actions / Recent Orders */}
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EBE5DF]">
                <h3 className="text-sm font-serif font-bold text-[#1E1511]">Recent Orders Queue</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#8C5D38] hover:underline font-semibold"
                >
                  View All ({orders.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Destination</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-[#8C5D38]">{o.orderNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-stone-900">{o.customerInformation.name}</div>
                          <div className="text-stone-400 font-mono text-[11px]">{o.customerInformation.phone}</div>
                        </td>
                        <td className="p-3 text-stone-600">{o.customerInformation.city}</td>
                        <td className="p-3 font-mono">{o.items.length} items</td>
                        <td className="p-3 font-mono font-bold">Rs. {o.total.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                            className="text-[11px] border border-stone-300 p-1 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="py-6 space-y-4">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1E1511] mb-4">
                All Customer Orders ({orders.length})
              </h3>

              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 border border-[#EBE5DF] rounded-xs bg-[#FAF8F5]/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBE5DF] gap-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#8C5D38]">{o.orderNumber}</span>
                        <span className="text-stone-400 ml-2">Placed: {new Date(o.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-[11px] text-stone-500">Order Status:</label>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className="text-xs font-semibold border border-stone-300 px-2 py-1 bg-white rounded-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <label className="text-[11px] text-stone-500 ml-2">Payment:</label>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, o.orderStatus, e.target.value as any)}
                          className="text-xs font-semibold border border-stone-300 px-2 py-1 bg-white rounded-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 text-xs">
                      <div>
                        <div className="font-semibold text-stone-800">{o.customerInformation.name}</div>
                        <div className="text-stone-600 font-mono">{o.customerInformation.phone}</div>
                        <div className="text-stone-500 mt-1">{o.shippingAddress}</div>
                        {o.notes && <div className="text-amber-800 mt-1 italic">Note: "{o.notes}"</div>}
                      </div>

                      <div className="space-y-1.5 border-l border-stone-200 pl-4">
                        <div className="font-semibold text-stone-500 text-[11px] uppercase">Purchased Items:</div>
                        {o.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="truncate max-w-xs">{item.name} {item.color && `(${item.color})`} × {item.quantity}</span>
                            <span className="font-mono font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                          <span>Total Amount ({o.paymentMethod}):</span>
                          <span className="text-[#8C5D38] font-mono">Rs. {o.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Products Management */}
        {activeTab === 'products' && (
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 border border-[#EBE5DF]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1E1511]">Catalog Inventory</h3>
                <p className="text-xs text-stone-500">Manage real-time product listings, prices, and warehouse stock.</p>
              </div>

              <button
                onClick={() => {
                  setIsNewProduct(true);
                  setEditingProduct({
                    id: 'prod-' + Date.now(),
                    name: '',
                    slug: '',
                    category: 'Wallets',
                    subcategory: 'Classic Wallets',
                    description: '',
                    shortDescription: '',
                    price: 2500,
                    stock: 20,
                    sku: 'MLF-NEW-01',
                    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
                    thumbnail: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
                    material: 'Full-Grain Cowhide Leather',
                    color: 'Whiskey Tan',
                    availableColors: ['Whiskey Tan', 'Dark Brown', 'Black'],
                    dimensions: '11.5 cm x 9.5 cm',
                    weight: '85 grams',
                    rating: 5,
                    reviewCount: 1,
                    featured: false,
                    bestSeller: false,
                    newArrival: true,
                    onSale: false,
                    tags: ['leather', 'wallet', 'multan'],
                    careInstructions: 'Avoid soaking in water. Condition with natural beeswax balm once every 6 months.',
                    specifications: { 'Origin': 'Multan, Pakistan', 'Stitching': 'Heavy-duty bonded nylon' },
                  });
                }}
                className="px-4 py-2 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white border border-[#EBE5DF] shadow-xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.thumbnail || p.images[0]} alt={p.name} className="w-10 h-10 object-cover border border-stone-200 shrink-0" />
                        <div>
                          <div className="font-semibold text-stone-900 truncate max-w-xs">{p.name}</div>
                          <div className="text-[11px] text-stone-400">{p.material}</div>
                        </div>
                      </td>
                      <td className="p-3 text-stone-700">{p.category}</td>
                      <td className="p-3 font-mono text-stone-500">{p.sku}</td>
                      <td className="p-3 font-mono font-bold text-stone-900">Rs. {p.price.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={p.stock}
                            onChange={(e) => handleQuickStockUpdate(p.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-xs border border-stone-300 font-mono text-center"
                          />
                          {p.stock < 5 && (
                            <span className="text-[10px] text-red-600 font-semibold">Low</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {p.featured && <span className="mr-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Featured</span>}
                        {p.newArrival && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">New</span>}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsNewProduct(false);
                              setEditingProduct(p);
                            }}
                            className="p-1.5 text-stone-600 hover:text-[#8C5D38] border border-stone-200 hover:border-[#8C5D38]"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-stone-600 hover:text-red-600 border border-stone-200 hover:border-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Product Edit / Create Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white max-w-2xl w-full p-6 border border-stone-300 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="text-base font-serif font-bold text-[#1E1511]">
                      {isNewProduct ? 'Add New Product to Catalog' : `Edit Product: ${editingProduct.name}`}
                    </h3>
                    <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                          className="w-full px-3 py-2 border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">SKU *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.sku}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                          className="w-full px-3 py-2 border border-stone-300 bg-white"
                        >
                          {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Price (PKR) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-stone-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Stock Quantity *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-stone-300 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Material & Leather Grade</label>
                      <input
                        type="text"
                        value={editingProduct.material}
                        onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300"
                        placeholder="e.g. 100% Vegetable-Tanned Buffalo Hide"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">Detailed Description</label>
                      <textarea
                        rows={3}
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300"
                      />
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.featured}
                          onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                        />
                        <span>Featured on Homepage</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.newArrival}
                          onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                        />
                        <span>New Arrival</span>
                      </label>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-stone-300 text-stone-700 uppercase tracking-wider text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#8C5D38] hover:bg-[#6E472A] text-white uppercase tracking-wider font-semibold text-[11px]"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Custom Orders */}
        {activeTab === 'custom' && (
          <div className="py-6 space-y-4">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1E1511] mb-4">
                Bespoke Leather Requests ({customOrders.length})
              </h3>

              <div className="space-y-4">
                {customOrders.map((c) => (
                  <div key={c.id} className="p-4 border border-[#EBE5DF] bg-[#FAF8F5]/40 rounded-xs text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                      <div>
                        <span className="font-mono font-bold text-[#8C5D38]">{c.inquiryNumber}</span>
                        <span className="text-stone-400 ml-2">Date: {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 font-medium">Status:</span>
                        <select
                          value={c.status}
                          onChange={async (e) => {
                            const updated = await apiService.updateCustomOrderStatus(c.id, e.target.value as any);
                            if (updated) {
                              setCustomOrders(customOrders.map(item => item.id === c.id ? updated : item));
                              showToast('Custom order status updated.', 'success');
                            }
                          }}
                          className="border border-stone-300 p-1 bg-white font-semibold"
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Approved">Approved</option>
                          <option value="In Production">In Production</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                      <div>
                        <div className="font-bold text-stone-900">{c.customerName}</div>
                        <div className="text-stone-600 font-mono">{c.phone}</div>
                        {c.email && <div className="text-stone-500">{c.email}</div>}
                        <div className="mt-2 text-stone-700">
                          <strong>Product:</strong> {c.productType} ({c.preferredMaterial} - {c.color})
                        </div>
                        {c.customText && (
                          <div className="mt-1 text-[#8C5D38] font-bold">
                            Monogram / Initials: "{c.customText}"
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-stone-600">
                        <div><strong>Quantity:</strong> {c.quantity} units</div>
                        <div><strong>Budget:</strong> {c.budget || 'Open'}</div>
                        <div><strong>Special Instructions:</strong> {c.additionalInstructions || 'None'}</div>
                        {c.internalNotes && (
                          <div className="mt-2 p-2 bg-amber-50 text-amber-900 border border-amber-200">
                            <strong>Internal Notes:</strong> {c.internalNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Wholesale Leads */}
        {activeTab === 'wholesale' && (
          <div className="py-6 space-y-4">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1E1511] mb-4">
                Corporate & Bulk Inquiries ({wholesale.length})
              </h3>

              <div className="space-y-4">
                {wholesale.map((w) => (
                  <div key={w.id} className="p-4 border border-[#EBE5DF] bg-[#FAF8F5]/40 rounded-xs text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                      <div>
                        <span className="font-mono font-bold text-[#8C5D38]">{w.inquiryNumber}</span>
                        <span className="text-stone-400 ml-2">Date: {new Date(w.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 font-medium">Status:</span>
                        <select
                          value={w.status}
                          onChange={async (e) => {
                            const updated = await apiService.updateWholesaleStatus(w.id, e.target.value as any);
                            if (updated) {
                              setWholesale(wholesale.map(item => item.id === w.id ? updated : item));
                              showToast('Wholesale lead status updated.', 'success');
                            }
                          }}
                          className="border border-stone-300 p-1 bg-white font-semibold"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Approved">Approved</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                      <div>
                        <div className="font-bold text-stone-900">{w.businessName}</div>
                        <div className="text-stone-600">Contact: {w.contactPerson} ({w.phone})</div>
                        {w.email && <div className="text-stone-500">{w.email}</div>}
                        <div className="text-stone-500 mt-1">Shipping City: {w.shippingCity}</div>
                      </div>

                      <div className="space-y-1 text-stone-600">
                        <div><strong>Category:</strong> {w.productCategory}</div>
                        <div><strong>Units:</strong> {w.estimatedQuantity} units</div>
                        <div><strong>Budget:</strong> {w.budget || 'Open'}</div>
                        <div><strong>Message:</strong> {w.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Coupons */}
        {activeTab === 'coupons' && (
          <div className="py-6 space-y-6">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1E1511] mb-4">Create New Promo Code</h3>
              <form onSubmit={handleCreateCoupon} className="flex flex-wrap gap-4 text-xs items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MULTAN20"
                    className="px-3 py-2 border border-stone-300 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="px-3 py-2 border border-stone-300 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-stone-300 font-mono w-24"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Min Order (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-stone-300 font-mono w-28"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#8C5D38] hover:bg-[#6E472A] text-white uppercase tracking-wider font-semibold text-xs"
                >
                  Create Code
                </button>
              </form>
            </div>

            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1E1511] mb-4">Active Store Coupons ({coupons.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 border border-[#EBE5DF] relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono font-bold text-sm text-[#8C5D38]">{c.code}</span>
                      <button
                        onClick={async () => {
                          await apiService.deleteCoupon(c.id);
                          setCoupons(coupons.filter(item => item.id !== c.id));
                          showToast(`Coupon ${c.code} removed.`, 'info');
                        }}
                        className="text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-stone-600">
                      {c.discountType === 'percentage' ? `${c.discountValue}% discount` : `Rs. ${c.discountValue} flat off`}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1">
                      Min order: Rs. {c.minOrder.toLocaleString()} · Used: {c.usedCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-6 space-y-4">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#1E1511] mb-4">Customer Reviews Moderation ({reviews.length})</h3>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 border border-[#EBE5DF] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">{r.userName} on "{r.productName}"</div>
                      <div className="text-amber-500 font-bold">★ {r.rating} / 5 - {r.title}</div>
                      <p className="text-stone-600 mt-1">"{r.comment}"</p>
                      <div className="text-[10px] text-stone-400 mt-1">Status: {r.status} · Date: {r.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await apiService.updateReviewStatus(r.id, 'approved');
                          setReviews(reviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item));
                          showToast('Review approved', 'success');
                        }}
                        className="px-3 py-1 bg-emerald-700 text-white rounded-xs text-[11px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={async () => {
                          await apiService.updateReviewStatus(r.id, 'rejected');
                          setReviews(reviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item));
                          showToast('Review rejected', 'info');
                        }}
                        className="px-3 py-1 bg-stone-200 text-stone-800 rounded-xs text-[11px]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
