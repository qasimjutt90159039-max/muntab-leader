import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'All Categories' }]} />

        {/* Hero */}
        <div className="mt-6 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C5D38]/10 text-[#8C5D38] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Master Crafts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">
            Explore Leather Collections
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-3">
            Handmade in Multan from vegetable-tanned hides, heavy-duty brass fittings, and precision saddle stitching.
          </p>
        </div>

        {/* Grid of Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-[#EBE5DF] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <h3 className="text-lg font-serif font-bold tracking-tight">{cat.name}</h3>
                    <span className="text-[11px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded font-mono">
                      {cat.productCount} Items
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#FAF8F5] border border-[#EBE5DF] text-stone-600 px-2 py-0.5"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#8C5D38] group-hover:text-[#1E1511] transition-colors">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
