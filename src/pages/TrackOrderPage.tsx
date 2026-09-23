import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Phone, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { apiService } from '../services/apiService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BUSINESS_INFO } from '../data/business';

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'Pending', label: 'Order Placed', description: 'Order recorded in Multan factory queue' },
  { status: 'Confirmed', label: 'Order Confirmed', description: 'Verified by customer care team' },
  { status: 'Processing', label: 'Handcrafted & Packed', description: 'Handcrafted, quality inspected & boxed' },
  { status: 'Shipped', label: 'Dispatched with Courier', description: 'Handed over for nationwide delivery' },
  { status: 'Delivered', label: 'Delivered', description: 'Successfully handed over to customer' },
];

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('orderNumber') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (orderNumToFind = query) => {
    const clean = orderNumToFind.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setSearched(true);
    try {
      // Find by order number
      const found = await apiService.getOrderByIdOrNumber(clean);
      if (found) {
        setOrder(found);
      } else {
        // Try searching orders list for matching phone or number
        const allOrders = await apiService.getOrders();
        const match = allOrders.find(
          (o) =>
            o.orderNumber.toUpperCase() === clean ||
            o.customerInformation.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
        );
        setOrder(match || null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Track Order' }]} />

        <div className="text-center my-8">
          <h1 className="text-3xl font-serif font-bold text-[#1E1511]">Track Your Leather Order</h1>
          <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto">
            Enter your Order Number (e.g. <strong>MLF-ORD-1001</strong>) or registered mobile number to see real-time dispatch progress.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 border border-[#EBE5DF] shadow-xs mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order Number (MLF-ORD-...) or Mobile Number"
                className="w-full pl-11 pr-4 py-3 text-xs uppercase font-mono border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>

          {/* Sample quick demo order buttons */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500">
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => {
                setQuery('MLF-ORD-1001');
                handleSearch('MLF-ORD-1001');
              }}
              className="underline text-[#8C5D38] font-mono hover:text-stone-900"
            >
              MLF-ORD-1001
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setQuery('MLF-ORD-1002');
                handleSearch('MLF-ORD-1002');
              }}
              className="underline text-[#8C5D38] font-mono hover:text-stone-900"
            >
              MLF-ORD-1002
            </button>
          </div>
        </div>

        {/* Order Details & Progress Timeline */}
        {searched && !loading && !order && (
          <div className="bg-white border border-[#EBE5DF] p-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-[#1E1511]">No Order Found</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
              We couldn't locate an order matching "<strong>{query}</strong>". Please check for typos or call our factory desk directly.
            </p>
            <div className="mt-4">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C5D38] font-semibold hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>Call Factory Helpline ({BUSINESS_INFO.phone})</span>
              </a>
            </div>
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Timeline Card */}
            <div className="bg-white border border-[#EBE5DF] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-2">
                <div>
                  <div className="text-xs text-stone-500 font-mono">Order Number</div>
                  <h2 className="text-xl font-mono font-bold text-[#1E1511]">{order.orderNumber}</h2>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-stone-500">Current Status</div>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                    order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : order.orderStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Visual Step Progress */}
              {order.orderStatus === 'Cancelled' ? (
                <div className="py-8 text-center text-red-600">
                  <p className="text-sm font-semibold">This order was cancelled.</p>
                  <p className="text-xs text-stone-500 mt-1">Please reach out to support if you believe this was in error.</p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
                    <div
                      className="hidden md:block absolute top-1/2 left-0 h-1 bg-[#8C5D38] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                      {STEPS.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.status} className="flex md:flex-col items-center gap-3 md:text-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                                isDone
                                  ? 'bg-[#8C5D38] text-white shadow-md'
                                  : 'bg-white border-2 border-stone-300 text-stone-400'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>
                            <div>
                              <div className={`text-xs font-semibold ${isCurrent ? 'text-[#8C5D38]' : 'text-stone-800'}`}>
                                {step.label}
                              </div>
                              <div className="text-[10px] text-stone-500 leading-snug mt-0.5">
                                {step.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Metadata Info */}
              <div className="pt-6 border-t border-[#EBE5DF] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Placed Date</span>
                  <span className="font-semibold text-stone-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Payment</span>
                  <span className="font-semibold text-stone-800">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Delivery City</span>
                  <span className="font-semibold text-stone-800">
                    {order.customerInformation.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Summary in this Order */}
            <div className="bg-white border border-[#EBE5DF] p-6 shadow-xs">
              <h3 className="text-sm font-serif font-bold text-[#1E1511] mb-4">Package Contents</h3>
              <div className="divide-y divide-stone-100">
                {order.items.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.name} className="w-12 h-12 object-cover border border-stone-200" />
                      <div>
                        <span className="font-semibold text-[#1E1511]">{item.name}</span>
                        <div className="text-[11px] text-stone-500">Qty: {item.quantity} · SKU: {item.sku}</div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-stone-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#EBE5DF] flex justify-between text-xs font-bold text-[#1E1511]">
                <span>Total Value:</span>
                <span className="font-mono text-sm text-[#8C5D38]">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
