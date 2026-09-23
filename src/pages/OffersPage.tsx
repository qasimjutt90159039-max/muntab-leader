import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, Truck, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_COUPONS } from '../data/initialData';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const OffersPage: React.FC = () => {
  const { applyCoupon, setCouponCodeInput } = useCart();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setCouponCodeInput(code);
    showToast(`Code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Special Offers & Coupons' }]} />

        {/* Hero */}
        <div className="mt-6 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C5D38]/10 text-[#8C5D38] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Factory Direct Savings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">
            Exclusive Store Promotions & Coupons
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-3">
            Take advantage of active discount codes and seasonal benefits on 100% full-grain handcrafted leather goods.
          </p>
        </div>

        {/* Free Shipping Highlight Banner */}
        <div className="bg-[#1E1511] text-[#FAF8F5] p-6 sm:p-8 mb-12 border border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#8C5D38] rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Free Nationwide Delivery</h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Automatically applied at checkout on all orders of <strong>Rs. 5,000</strong> and above across all cities in Pakistan.
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#C89D6E] hover:bg-white text-[#1E1511] text-xs uppercase tracking-wider font-semibold transition-colors shrink-0"
          >
            Start Shopping
          </Link>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {INITIAL_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border-2 border-dashed border-[#8C5D38]/50 p-6 flex flex-col justify-between shadow-xs hover:border-[#8C5D38] transition-all relative"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="uppercase font-semibold tracking-wider text-[#8C5D38]">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `Rs. ${coupon.discountValue} OFF`}
                  </span>
                  <span className="text-[11px] font-mono">Valid till Dec 2026</span>
                </div>

                <div className="bg-[#FAF8F5] p-3 border border-[#EBE5DF] flex items-center justify-between my-3">
                  <span className="font-mono text-base font-bold tracking-wider text-[#1E1511]">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="flex items-center gap-1 text-xs text-[#8C5D38] hover:text-[#6E472A] font-semibold cursor-pointer"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-stone-600 mt-2">
                  {coupon.discountType === 'percentage'
                    ? `Get ${coupon.discountValue}% discount on orders above Rs. ${coupon.minOrder.toLocaleString()}${coupon.maxDiscount ? ` (Up to Rs. ${coupon.maxDiscount.toLocaleString()})` : ''}.`
                    : `Flat Rs. ${coupon.discountValue} off on qualifying carts of Rs. ${coupon.minOrder.toLocaleString()} or more.`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">Remaining uses: {coupon.usageLimit - coupon.usedCount}</span>
                <Link
                  to="/shop"
                  className="text-xs text-[#8C5D38] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Use Coupon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Gifting Perks Banner */}
        <div className="bg-white border border-[#EBE5DF] p-8 text-center max-w-2xl mx-auto shadow-xs">
          <Gift className="w-10 h-10 text-[#8C5D38] mx-auto mb-3" />
          <h3 className="text-xl font-serif font-bold text-[#1E1511]">Ordering for Your Company or Event?</h3>
          <p className="text-xs text-stone-600 mt-2">
            Get up to 35% off on bulk orders with free custom company logo debossing and executive gift packaging.
          </p>
          <div className="mt-5">
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <span>Explore Wholesale Tiers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
