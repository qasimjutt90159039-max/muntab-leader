import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    couponCodeInput,
    setCouponCodeInput,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#EBE5DF] flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#EBE5DF] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8C5D38]" />
              <h2 className="font-serif font-bold text-lg text-[#1E1511]">Shopping Bag</h2>
              <span className="text-xs font-mono text-stone-500">({cartCount} items)</span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          <div className="px-5 py-3 bg-[#F4EDE4] text-xs text-[#2E2019] flex flex-col gap-1.5 border-b border-[#EBE5DF]">
            {subtotal >= BUSINESS_INFO.freeShippingThreshold ? (
              <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                <span>You qualify for FREE Nationwide Courier Shipping!</span>
              </div>
            ) : (
              <div>
                Add{' '}
                <span className="font-mono font-semibold">
                  Rs. {(BUSINESS_INFO.freeShippingThreshold - subtotal).toLocaleString()}
                </span>{' '}
                more to unlock Free Shipping.
              </div>
            )}
            <div className="w-full bg-stone-300/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8C5D38] h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / BUSINESS_INFO.freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Itemized list */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F4EDE4]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShoppingBag className="w-12 h-12 text-[#C89D6E] stroke-[1] mb-3" />
                <p className="font-serif text-lg text-[#1E1511]">Your cart is empty</p>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Discover handcrafted leather goods built to last a lifetime.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-5 px-5 py-2.5 bg-[#1E1511] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8C5D38] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor}-${idx}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-[#FAF8F5] border border-[#EBE5DF] shrink-0 overflow-hidden">
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-serif text-sm font-semibold text-[#1E1511] hover:text-[#8C5D38] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>· Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#EBE5DF]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-mono text-sm font-semibold text-[#1E1511]">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal, Coupon, and Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#EBE5DF] bg-[#FAF8F5] space-y-4">
              {/* Coupon input */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-mono font-semibold">{coupon.code}</span>
                      <span>(-Rs. {discount.toLocaleString()})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-stone-500 hover:text-stone-900 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      applyCoupon();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Coupon (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-[#EBE5DF] bg-white uppercase font-mono tracking-wider focus:outline-hidden focus:border-[#8C5D38]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2E2019] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8C5D38] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="tabular-nums">-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums">
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1E1511] pt-2 border-t border-[#EBE5DF]">
                  <span className="font-serif text-base">Grand Total</span>
                  <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3 bg-[#1E1511] hover:bg-[#8C5D38] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 border border-[#EBE5DF] hover:bg-stone-100 text-[#1E1511] text-xs uppercase tracking-wider font-semibold transition-colors text-center block"
                >
                  View Full Cart & Save for Later
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
