import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Sparkles, Clock, Phone, MapPin, Compass } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { CATEGORIES } from '../data/categories';
import { storageService } from '../services/storageService';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const products = storageService.getProducts();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Editorial Luxury Hero */}
      <section className="relative bg-[#1E1511] text-[#FAF8F5] overflow-hidden">
        {/* Subtle leather grain vignette */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C89D6E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C89D6E] font-medium pb-1 border-b border-[#C89D6E]/30">
                <Compass className="w-3.5 h-3.5" />
                <span>Multan, Pakistan · Handcrafted Leather</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] text-balance">
                Crafted in Leather. Built to Last.
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Discover timeless leather goods designed for style, functionality and everyday use. Handcrafted in Multan from vegetable-tanned hides and solid brass hardware.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#8C5D38] hover:bg-[#C89D6E] hover:text-[#1E1511] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/categories"
                  className="w-full sm:w-auto px-7 py-3.5 border border-[#C89D6E]/50 hover:border-white text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center"
                >
                  Explore Products
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-mono text-sm font-semibold text-[#C89D6E]">100% Real</div>
                  <div className="text-[11px] text-stone-400">Full-Grain Leather</div>
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-[#C89D6E]">Cash on Delivery</div>
                  <div className="text-[11px] text-stone-400">Nationwide Pakistan</div>
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-[#C89D6E]">Custom Craft</div>
                  <div className="text-[11px] text-stone-400">Bespoke Monograms</div>
                </div>
              </div>
            </div>

            {/* Right Focal Visual Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Visual Frame */}
                <div className="relative aspect-4/3 sm:aspect-16/10 overflow-hidden border border-[#C89D6E]/30 shadow-2xl bg-[#2E2019]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"
                    alt="Handcrafted leather briefcase and accessories by Mutalib's Leather Factory"
                    fallbackTitle="Mutalib's Leather Factory Multan"
                    aspectRatioClass="aspect-4/3 sm:aspect-16/10"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1511]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-200">
                    <div>
                      <div className="font-serif text-sm font-semibold text-white">
                        The Heritage Leather Collection
                      </div>
                      <div className="text-[11px] text-[#C89D6E]">
                        Saddle stitched · Vegetable tanned hide
                      </div>
                    </div>
                    <Link
                      to="/product/artisan-classic-messenger-bag"
                      className="px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-[#1E1511] text-[11px] uppercase tracking-wider backdrop-blur-xs transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions (Four Feature Cards) */}
      <section className="py-12 bg-[#F4EDE4] border-b border-[#EBE5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-[#EBE5DF] flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-6 h-6 text-[#8C5D38] mb-3" />
                <h3 className="font-serif text-base font-semibold text-[#1E1511] mb-1">
                  Premium Leather Goods
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Carefully sourced vegetable-tanned and pull-up hides that age gracefully and build individual character.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#EBE5DF] flex flex-col justify-between">
              <div>
                <Award className="w-6 h-6 text-[#8C5D38] mb-3" />
                <h3 className="font-serif text-base font-semibold text-[#1E1511] mb-1">
                  Quality-Focused Craftsmanship
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Meticulous edge burnishing, reinforced stress anchors, and precision saddle stitching on every piece.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#EBE5DF] flex flex-col justify-between">
              <div>
                <Clock className="w-6 h-6 text-[#8C5D38] mb-3" />
                <h3 className="font-serif text-base font-semibold text-[#1E1511] mb-1">
                  Timeless Designs
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Understated, functional silhouettes that outlast seasonal fads and complement both formal and everyday attire.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border border-[#EBE5DF] flex flex-col justify-between">
              <div>
                <Sparkles className="w-6 h-6 text-[#8C5D38] mb-3" />
                <h3 className="font-serif text-base font-semibold text-[#1E1511] mb-1">
                  Customer-Focused Service
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Direct factory assistance, bespoke custom sizing, cash on delivery, and transparent order tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EBE5DF]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C5D38] font-medium">
                Curated Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1511] mt-1">
                Featured Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs uppercase tracking-wider font-semibold text-[#8C5D38] hover:text-[#1E1511] flex items-center gap-1 self-start md:self-auto"
            >
              <span>View All 12 Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col bg-white border border-[#EBE5DF] overflow-hidden hover:border-[#8C5D38]/50 transition-all duration-300"
              >
                <div className="aspect-square bg-[#F4EDE4] overflow-hidden relative">
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    fallbackTitle={cat.name}
                    aspectRatioClass="aspect-square"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] text-[#C89D6E] block font-mono">
                      {cat.productCount} items
                    </span>
                    <span className="font-serif text-sm font-semibold block leading-tight">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-16 bg-white border-y border-[#EBE5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EBE5DF]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C5D38] font-medium">
                Handcrafted Precision
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1511] mt-1">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-semibold text-[#8C5D38] hover:text-[#1E1511] flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Spotlight Section */}
      <section className="py-20 bg-[#2E2019] text-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#C89D6E] font-medium">
                The Multan Workshop
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Authentic Leathercraft Honed with Patience & Precision
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed font-light">
                Every wallet, briefcase, and belt begins with raw hide selection. In our workshop on Qadri Street in Multan, each panel is cut to grain alignment, edge-beveled, and saddle-stitched by skilled artisans dedicated to timeless construction.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-700">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-white">Full-Grain Only</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    No artificial synthetic coatings or bonded dust boards. Pure natural grain structure.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-white">Solid Hardware</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Heavy solid brass buckles, YKK metal zips, and rust-resistant rivets.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/craftsmanship"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8C5D38] hover:bg-[#C89D6E] hover:text-[#1E1511] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Explore Our Craftsmanship Steps</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 overflow-hidden border border-[#C89D6E]/40 shadow-2xl bg-[#1E1511]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
                  alt="Artisanal leathercraft workshop"
                  fallbackTitle="Artisan Craftsmanship"
                  aspectRatioClass="aspect-4/3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Banner & Grid */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EBE5DF]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C5D38] font-medium">
                Latest Additions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E1511] mt-1">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/new-arrivals"
              className="text-xs uppercase tracking-wider font-semibold text-[#8C5D38] hover:text-[#1E1511] flex items-center gap-1 self-start md:self-auto"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Custom & Bulk Order CTA Banner */}
      <section className="py-14 bg-[#1E1511] text-[#FAF8F5] border-t border-[#3B2C24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#C89D6E] font-medium">
            Custom Commissions & Corporate Supply
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2 max-w-2xl mx-auto">
            Need Custom Dimensions, Monograms, or Corporate Wholesale?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto mt-2 leading-relaxed">
            We partner with individuals seeking personalized bespoke creations, and organizations needing branded executive leather gift sets.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/custom-leather"
              className="px-6 py-3 bg-[#8C5D38] hover:bg-[#C89D6E] hover:text-[#1E1511] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Request Custom Product
            </Link>
            <Link
              to="/wholesale"
              className="px-6 py-3 border border-[#C89D6E]/50 hover:border-white text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Wholesale & Bulk Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
