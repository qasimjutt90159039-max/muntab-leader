import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const allProducts = useMemo(() => storageService.getProducts(), [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query, allProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="relative bg-white w-full max-w-2xl rounded-none shadow-2xl border border-[#EBE5DF] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EBE5DF] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#8C5D38] shrink-0" />
          <input
            type="text"
            placeholder="Search leather wallets, belts, briefcases, SKU (e.g. MLF-WLT-001)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1E1511] placeholder-stone-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips (Functional button controls) */}
        {!query && (
          <div className="p-5">
            <div className="text-xs uppercase tracking-wider text-stone-400 font-medium mb-3">
              Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {['Bifold Wallets', 'Formal Belts', 'Laptop Briefcase', 'Messenger Bag', 'Desk Mat', 'Passport Holder'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 bg-[#FAF8F5] border border-[#EBE5DF] text-[#2E2019] hover:border-[#8C5D38] hover:text-[#8C5D38] transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto divide-y divide-[#F4EDE4]">
            {results.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-sm">
                No products found matching "<span className="text-[#1E1511] font-semibold">{query}</span>".
                <div className="mt-2 text-xs text-stone-400">
                  Try searching by product category, material (e.g. vegetable tanned), or SKU.
                </div>
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="p-4 flex items-center gap-4 hover:bg-[#FAF8F5] transition-colors group"
                >
                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover border border-[#EBE5DF] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-[#8C5D38] font-medium">
                      {product.category} · {product.sku}
                    </div>
                    <div className="font-serif font-semibold text-sm text-[#1E1511] group-hover:text-[#8C5D38] truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                      Rs. {product.price.toLocaleString()}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#8C5D38] transition-colors shrink-0" />
                </Link>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 bg-[#FAF8F5] border-t border-[#EBE5DF] text-center">
            <Link
              to={`/shop?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-xs text-[#8C5D38] font-semibold hover:underline"
            >
              View all {results.length} results in Shop →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
