import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Check, ShoppingBag, Heart, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ImageWithFallback } from './ImageWithFallback';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return <QuickViewModalContent product={product} onClose={onClose} />;
};

const QuickViewModalContent: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);

  const [selectedColor, setSelectedColor] = useState<string>(
    product.color || (product.availableColors && product.availableColors[0]) || 'Cognac Tan'
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.size || (product.availableSizes ? product.availableSizes[0] : undefined)
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(
    (product.images && product.images[0]) || product.thumbnail || ''
  );

  const handleAdd = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-none shadow-2xl border border-[#EBE5DF] overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-900 bg-white/80 hover:bg-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-[#FAF8F5] flex flex-col gap-4">
            <div className="aspect-4/3 overflow-hidden bg-white border border-[#EBE5DF]">
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                fallbackTitle={product.name}
                aspectRatioClass="aspect-4/3"
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 shrink-0 border overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-[#8C5D38] ring-1 ring-[#8C5D38]'
                        : 'border-[#EBE5DF] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="text-xs text-stone-500 flex items-center gap-2 pt-2 border-t border-[#EBE5DF]">
              <ShieldCheck className="w-4 h-4 text-[#8C5D38]" />
              <span>Full-Grain Vegetable Tanned Leather</span>
            </div>
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8C5D38] font-semibold">
                  {product.category} · {product.subcategory}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#1E1511] mt-1">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                  <div className="flex items-center text-[#C5A059]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-mono font-medium text-stone-800">{product.rating}</span>
                  <span>·</span>
                  <span>{product.reviewCount} customer reviews</span>
                  <span>·</span>
                  <span className="font-mono text-stone-400">SKU: {product.sku}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-mono font-bold text-[#1E1511]">
                  Rs. {(product.price || 0).toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm font-mono text-stone-400 line-through">
                    Rs. {(product.compareAtPrice || 0).toLocaleString()}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs font-semibold text-[#8C5D38] bg-[#F4EDE4] px-2 py-0.5">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Color Selector */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Color: <span className="font-normal text-[#8C5D38]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableColors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`text-xs px-3 py-1.5 border transition-all cursor-pointer ${
                          selectedColor === col
                            ? 'border-[#1E1511] bg-[#1E1511] text-white'
                            : 'border-[#EBE5DF] bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Size: <span className="font-normal text-[#8C5D38]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs px-3 py-1.5 border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-[#1E1511] bg-[#1E1511] text-white'
                            : 'border-[#EBE5DF] bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock status */}
              <div className="text-xs flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 5
                      ? 'bg-emerald-600'
                      : product.stock > 0
                      ? 'bg-amber-600'
                      : 'bg-red-600'
                  }`}
                />
                <span className="font-medium text-stone-700">
                  {product.stock > 5
                    ? `In Stock (${product.stock} available)`
                    : product.stock > 0
                    ? `Low Stock - Only ${product.stock} remaining`
                    : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="pt-6 border-t border-[#EBE5DF] mt-6 space-y-3">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#EBE5DF]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-4 bg-[#1E1511] hover:bg-[#8C5D38] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className={`p-3 border border-[#EBE5DF] hover:bg-[#FAF8F5] transition-colors ${
                    isWished ? 'text-red-600' : 'text-stone-700'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* View Full Details Link */}
              <div className="text-center pt-2">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs text-[#8C5D38] hover:text-[#1E1511] underline underline-offset-4"
                >
                  View full specifications & customer reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
