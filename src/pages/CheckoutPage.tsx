import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, CreditCard, Banknote, Tag, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/apiService';
import { BUSINESS_INFO } from '../data/business';
import { Breadcrumbs } from '../components/Breadcrumbs';

const POPULAR_CITIES = [
  'Multan',
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Bahawalpur',
  'Sargodha',
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, discount, shipping, total, coupon, couponCodeInput, setCouponCodeInput, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Multan');
  const [province, setProvince] = useState(user?.address?.province || 'Punjab');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '60000');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#1E1511] mb-3">Your Shopping Bag is Empty</h2>
        <p className="text-stone-600 text-sm mb-6">Explore our handcrafted leather collection and add items to proceed to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      showToast('Please fill in your name, contact phone, and full delivery address.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        thumbnail: item.product.thumbnail || item.product.images[0] || '',
      }));

      const orderData = {
        user: user ? { id: user.id, name: user.name, email: user.email } : undefined,
        items: orderItems,
        subtotal,
        discount,
        couponCode: coupon?.code,
        shipping,
        total,
        customerInformation: {
          name: name.trim(),
          email: email.trim() || `${phone.replace(/\D/g, '')}@customer.local`,
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          province,
          postalCode,
          orderNotes: orderNotes.trim() || undefined,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? ('Pending' as const) : ('Pending' as const),
        orderStatus: 'Pending' as const,
        shippingAddress: `${address.trim()}, ${city.trim()}, ${province}, Pakistan (${postalCode})`,
        notes: orderNotes.trim() || undefined,
      };

      const newOrder = await apiService.createOrder(orderData);
      clearCart();
      showToast(`Order placed successfully! Order #${newOrder.orderNumber}`, 'success');
      navigate(`/order-success/${newOrder.orderNumber}`, { state: { order: newOrder } });
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to place order. Please try again or call 03347214721.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Shopping Bag', path: '/shop' }, { label: 'Checkout' }]} />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#1E1511]">Secure Checkout</h1>
          <p className="text-xs text-stone-600 mt-1">Direct delivery across Pakistan by Mutalib's Leather Factory Multan.</p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Details */}
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EBE5DF]">
                <span className="w-6 h-6 rounded-full bg-[#8C5D38] text-white text-xs flex items-center justify-center font-bold">1</span>
                <h2 className="text-base font-serif font-bold text-[#1E1511]">Customer Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Usman"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Phone Number (Required for Courier) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0334-1234567"
                    className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Email Address (For Receipt & Tracking)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EBE5DF]">
                <span className="w-6 h-6 rounded-full bg-[#8C5D38] text-white text-xs flex items-center justify-center font-bold">2</span>
                <h2 className="text-base font-serif font-bold text-[#1E1511]">Delivery Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">House, Street & Area Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No, Street, Mohalla / Colony / Sector, Landmark"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">City *</label>
                    <input
                      type="text"
                      list="city-suggestions"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Multan"
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                    <datalist id="city-suggestions">
                      {POPULAR_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Province *</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] bg-white"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital">Islamabad</option>
                      <option value="Azad Kashmir">Azad Kashmir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="60000"
                      className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Delivery / Order Instructions (Optional)</label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Please call before arriving or deliver between 2pm-6pm"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EBE5DF]">
                <span className="w-6 h-6 rounded-full bg-[#8C5D38] text-white text-xs flex items-center justify-center font-bold">3</span>
                <h2 className="text-base font-serif font-bold text-[#1E1511]">Select Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#8C5D38] bg-[#FAF8F5]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-[#8C5D38] focus:ring-[#8C5D38]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#1E1511]">
                      <Banknote className="w-4 h-4 text-[#8C5D38]" />
                      <span>Cash on Delivery (COD)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-medium">Recommended</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Pay safely in cash when your leather goods package arrives at your doorstep anywhere in Pakistan.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'Online Payment'
                      ? 'border-[#8C5D38] bg-[#FAF8F5]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={() => setPaymentMethod('Online Payment')}
                    className="mt-1 text-[#8C5D38] focus:ring-[#8C5D38]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#1E1511]">
                      <CreditCard className="w-4 h-4 text-[#8C5D38]" />
                      <span>Bank Transfer / Raast / EasyPaisa</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Direct online bank transfer details will be provided upon placing order. Order is confirmed once payment screenshot is shared.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary & Final Submission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h2 className="text-base font-serif font-bold text-[#1E1511] mb-4 pb-3 border-b border-[#EBE5DF]">
                Order Items ({cart.length})
              </h2>

              <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#1E1511] truncate">{item.product.name}</h4>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                      <div className="text-xs font-mono text-stone-700 mt-1">
                        Rs. {item.product.price.toLocaleString()} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-[#1E1511]">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="mt-4 pt-4 border-t border-[#EBE5DF]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Discount code (e.g. WELCOME10)"
                    className="flex-1 text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8C5D38] uppercase font-mono"
                  />
                  {coupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 border border-red-200 font-medium transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applyCoupon()}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {coupon && (
                  <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {coupon.code} applied (-Rs. {discount.toLocaleString()})</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-4 border-t border-[#EBE5DF] space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping ({shipping === 0 ? 'Free over Rs. 5,000' : 'Standard'})</span>
                  <span className="font-mono text-stone-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      `Rs. ${shipping.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#1E1511] pt-3 border-t border-[#EBE5DF]">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-[#8C5D38]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Placement CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Processing Order...' : `Place Order (Rs. ${total.toLocaleString()})`}</span>
              </button>

              <div className="mt-4 pt-4 border-t border-[#EBE5DF] space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C5D38] shrink-0" />
                  <span>100% Genuine Leather Guarantee · Handcrafted in Multan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#8C5D38] shrink-0" />
                  <span>Reliable nationwide courier delivery within 2-4 business days</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
