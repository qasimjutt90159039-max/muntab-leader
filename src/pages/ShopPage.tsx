import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Check, Search } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ShopPage: React.FC<{ pageTitle?: string; filterType?: 'all' | 'new' | 'bestseller' | 'featured' | 'sale' }> = ({
  pageTitle = 'The Leather Goods Catalog',
  filterType = 'all',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(40000);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const allProducts = useMemo(() => storageService.getProducts(), []);
  const allCategories = useMemo(() => storageService.getCategories(), []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Direct page constraints
      if (filterType === 'new' && !p.newArrival) return false;
      if (filterType === 'bestseller' && !p.bestSeller) return false;
      if (filterType === 'featured' && !p.featured) return false;
      if (filterType === 'sale' && (!p.onSale || !p.discountPercentage)) return false;

      // Category
      if (selectedCategory && p.category !== selectedCategory) return false;

      // Subcategory
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Price Range
      if (p.price > priceRange) return false;

      // Color
      if (selectedColor && !p.availableColors.includes(selectedColor)) return false;

      // Stock
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    allProducts,
    filterType,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    priceRange,
    selectedColor,
    inStockOnly,
    sortBy,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Available colors extracted from catalog
  const allColors = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.availableColors.forEach((c) => set.add(c)));
    return Array.from(set).slice(0, 8);
  }, [allProducts]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchQuery('');
    setPriceRange(40000);
    setSelectedColor('');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Top Banner Header */}
      <div className="bg-[#1E1511] text-[#FAF8F5] py-10 sm:py-14 border-b border-[#3B2C24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: pageTitle }]} />
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Browse handcrafted leather goods built with authentic full-grain bovine and buffalo hides in Multan, Pakistan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EBE5DF]">
          {/* Active Search & Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1E1511]">
              Showing {filteredProducts.length} Products
            </span>
            {(selectedCategory || searchQuery || selectedColor || inStockOnly || priceRange < 40000) && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#8C5D38] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Controls: Search input, Sort, Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#EBE5DF] focus:outline-hidden focus:border-[#8C5D38]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-stone-500 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-white border border-[#EBE5DF] px-3 py-2 text-[#1E1511] font-medium focus:outline-hidden focus:border-[#8C5D38]"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="newest">Sort by: Newest</option>
                <option value="popular">Sort by: Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden p-2 bg-white border border-[#EBE5DF] text-[#1E1511] flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8C5D38]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8 items-start">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block space-y-8 bg-white p-6 border border-[#EBE5DF]">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#8C5D38] font-bold mb-3">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubcategory('');
                  }}
                  className={`w-full text-left py-1 px-2 transition-colors flex items-center justify-between ${
                    selectedCategory === '' ? 'bg-[#FAF8F5] text-[#8C5D38] font-semibold' : 'text-stone-600 hover:text-[#1E1511]'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="font-mono text-[11px] text-stone-400">{allProducts.length}</span>
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubcategory('');
                    }}
                    className={`w-full text-left py-1 px-2 transition-colors flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-[#FAF8F5] text-[#8C5D38] font-semibold'
                        : 'text-stone-600 hover:text-[#1E1511]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-mono text-[11px] text-stone-400">
                      {allProducts.filter((p) => p.category === cat.name).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory Filter (when category is selected) */}
            {selectedCategory && (
              <div className="pt-4 border-t border-[#F4EDE4]">
                <h3 className="text-xs uppercase tracking-widest text-[#8C5D38] font-bold mb-3">
                  Subcategories
                </h3>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className={`block w-full text-left py-1 px-2 ${
                      selectedSubcategory === '' ? 'font-semibold text-[#8C5D38]' : 'text-stone-600'
                    }`}
                  >
                    All {selectedCategory}
                  </button>
                  {allCategories
                    .find((c) => c.name === selectedCategory)
                    ?.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`block w-full text-left py-1 px-2 ${
                          selectedSubcategory === sub ? 'font-semibold text-[#8C5D38]' : 'text-stone-600'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="pt-4 border-t border-[#F4EDE4]">
              <h3 className="text-xs uppercase tracking-widest text-[#8C5D38] font-bold mb-3">
                Max Price: <span className="font-mono text-[#1E1511]">Rs. {priceRange.toLocaleString()}</span>
              </h3>
              <input
                type="range"
                min="1000"
                max="40000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#8C5D38] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-1">
                <span>Rs. 1,000</span>
                <span>Rs. 40,000</span>
              </div>
            </div>

            {/* Color Filter */}
            <div className="pt-4 border-t border-[#F4EDE4]">
              <h3 className="text-xs uppercase tracking-widest text-[#8C5D38] font-bold mb-3">
                Leather Color
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                    className={`text-[11px] px-2.5 py-1 border transition-colors cursor-pointer ${
                      selectedColor === color
                        ? 'border-[#1E1511] bg-[#1E1511] text-white'
                        : 'border-[#EBE5DF] bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="pt-4 border-t border-[#F4EDE4]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1E1511]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none text-[#8C5D38] focus:ring-0 accent-[#8C5D38]"
                />
                <span className="font-medium">In Stock Items Only</span>
              </label>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="p-16 text-center bg-white border border-[#EBE5DF] space-y-4">
                <p className="font-serif text-xl text-[#1E1511]">No leather goods match your filters</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price range, clearing selected colors or categories to see more items.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-[#1E1511] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#8C5D38] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Load More Pagination */}
                {visibleCount < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-8 py-3 bg-white border border-[#1E1511] text-[#1E1511] hover:bg-[#1E1511] hover:text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300"
                    >
                      Load More Products ({filteredProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
