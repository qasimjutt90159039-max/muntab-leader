import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#EBE5DF] rounded-none hover:border-[#8C5D38]/40 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Container */}
      <div className="relative overflow-hidden aspect-4/3 bg-[#F4EDE4]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            fallbackTitle={product.name}
            aspectRatioClass="aspect-4/3"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Minimal text-only label (no garish candy badge) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
          {product.newArrival && (
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#1E1511]/90 text-[#FAF8F5] px-2 py-0.5">
              New
            </span>
          )}
          {product.bestSeller && !product.newArrival && (
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#8C5D38] text-white px-2 py-0.5">
              Bestseller
            </span>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#2E2019] text-[#C89D6E] px-2 py-0.5">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => toggleWishlist(product.id, product.name)}
            aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-8 h-8 rounded-none flex items-center justify-center transition-colors shadow-sm ${
              isWished
                ? 'bg-[#1E1511] text-red-500'
                : 'bg-white/95 text-stone-700 hover:bg-[#1E1511] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              aria-label="Quick preview"
              className="w-8 h-8 bg-white/95 rounded-none flex items-center justify-center text-stone-700 hover:bg-[#1E1511] hover:text-white transition-colors shadow-sm"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hover Fast Add-to-Cart bar */}
        <div className="hidden sm:block absolute bottom-0 inset-x-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="w-full py-2.5 bg-[#1E1511] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider hover:bg-[#8C5D38] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category kicker */}
          <div className="text-[11px] uppercase tracking-wider text-[#8C5D38] font-medium mb-1">
            {product.category}
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-serif font-semibold text-[#1E1511] hover:text-[#8C5D38] transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-stone-500">
            <div className="flex items-center text-[#C5A059]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-mono text-xs text-stone-700 font-medium">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-2 border-t border-[#F4EDE4] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-[#1E1511]">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                Rs. {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="sm:hidden p-1.5 bg-[#1E1511] text-white hover:bg-[#8C5D38] transition-colors disabled:bg-stone-300"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
