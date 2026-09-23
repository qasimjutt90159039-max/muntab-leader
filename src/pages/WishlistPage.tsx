import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { storageService } from '../services/storageService';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const allProducts = storageService.getProducts();
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'My Saved Wishlist' }]} />

        <div className="mt-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1E1511]">My Wishlist</h1>
            <p className="text-xs text-stone-600 mt-1">Saved handcrafted leather pieces for your personal collection.</p>
          </div>
          <span className="text-xs font-mono text-stone-500 bg-white border border-[#EBE5DF] px-3 py-1 rounded">
            {wishlistProducts.length} Items Saved
          </span>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white border border-[#EBE5DF] p-12 text-center max-w-lg mx-auto shadow-xs">
            <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-[#1E1511]">Your Wishlist is Empty</h3>
            <p className="text-xs text-stone-600 mt-2 mb-6">
              You haven't saved any handcrafted items yet. Explore our genuine leather collection to bookmark your favorites.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#EBE5DF] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={product.thumbnail || product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-xs cursor-pointer transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                      {product.category}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-xs font-semibold text-[#1E1511] hover:text-[#8C5D38] line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#1E1511]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => moveToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full py-2.5 bg-[#8C5D38] hover:bg-[#6E472A] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
