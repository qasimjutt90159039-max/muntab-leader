import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Printer, ArrowRight, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { Order } from '../types';
import { apiService } from '../services/apiService';
import { BUSINESS_INFO } from '../data/business';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      apiService.getOrderByIdOrNumber(orderNumber).then((data) => {
        if (data) setOrder(data);
        setLoading(false);
      });
    }
  }, [order, orderNumber]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-stone-600">
        <div className="animate-spin w-8 h-8 border-2 border-[#8C5D38] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm">Loading your order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner */}
        <div className="bg-white border border-[#EBE5DF] p-8 text-center shadow-xs mb-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1511]">
            Thank You! Your Order Has Been Received
          </h1>
          <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto">
            Your handcrafted leather items are being queued for packaging at Mutalib's Leather Factory in Multan. You will receive a confirmation call or SMS prior to courier dispatch.
          </p>

          <div className="inline-block mt-4 px-4 py-2 bg-[#FAF8F5] border border-[#EBE5DF] rounded">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Order Number: </span>
            <span className="text-sm font-mono font-bold text-[#8C5D38] ml-1">{order?.orderNumber || orderNumber}</span>
          </div>
        </div>

        {/* Order Details Receipt */}
        {order && (
          <div className="bg-white border border-[#EBE5DF] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-4">
              <div>
                <h3 className="text-sm font-serif font-bold text-[#1E1511]">Order Summary</h3>
                <p className="text-[11px] text-stone-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium rounded-full">
                  Status: {order.orderStatus}
                </span>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-[#EBE5DF]">
              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Customer Information</h4>
                <p className="text-stone-700">{order.customerInformation.name}</p>
                <p className="text-stone-500 font-mono mt-0.5">{order.customerInformation.phone}</p>
                {order.customerInformation.email && (
                  <p className="text-stone-500 mt-0.5">{order.customerInformation.email}</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Delivery Destination</h4>
                <p className="text-stone-700 leading-relaxed">{order.shippingAddress}</p>
                <p className="text-stone-500 mt-1">Payment Method: <strong className="text-stone-800">{order.paymentMethod}</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <div className="divide-y divide-stone-100">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-3">Items Purchased</h4>
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-12 h-12 object-cover border border-stone-200 bg-stone-50 shrink-0"
                    />
                    <div>
                      <h5 className="text-xs font-semibold text-[#1E1511]">{item.name}</h5>
                      <div className="text-[11px] text-stone-500">
                        {item.color && <span>Color: {item.color} · </span>}
                        {item.size && <span>Size: {item.size} · </span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#1E1511]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#EBE5DF] space-y-1.5 text-xs text-stone-600 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-stone-900">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">-Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono text-stone-900">
                  {order.shipping === 0 ? 'FREE' : `Rs. ${order.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1E1511] pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="font-mono text-base text-[#8C5D38]">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Support & Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to={`/track-order?orderNumber=${order?.orderNumber || orderNumber}`}
            className="w-full sm:w-auto px-6 py-3 bg-[#1E1511] hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Direct Factory Support Hotline */}
        <div className="mt-8 p-4 bg-white border border-[#EBE5DF] text-center text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#8C5D38]" />
            <span>Need assistance with your order? Direct Factory Call / WhatsApp:</span>
          </div>
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="font-mono font-bold text-[#8C5D38] hover:underline"
          >
            {BUSINESS_INFO.phone}
          </a>
        </div>
      </div>
    </div>
  );
};
