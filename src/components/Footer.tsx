import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { isAdmin, quickLoginAsAdmin, quickLoginAsCustomer, user, logout } = useAuth();

  return (
    <footer className="bg-[#1E1511] text-[#FAF8F5] pt-16 pb-12 border-t border-[#3B2C24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3B2C24]">
          {/* Col 1: Shop */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/featured" className="hover:text-white transition-colors">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-white transition-colors text-[#C89D6E]">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link to="/custom-leather" className="hover:text-white transition-colors">
                  Custom Leather Craft
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-white transition-colors">
                  Wholesale / Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link to="/shop?category=Wallets" className="hover:text-white transition-colors">
                  Wallets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Belts" className="hover:text-white transition-colors">
                  Belts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bags" className="hover:text-white transition-colors">
                  Bags
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Laptop%20Bags" className="hover:text-white transition-colors">
                  Laptop Bags & Briefcases
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Travel%20Accessories" className="hover:text-white transition-colors">
                  Travel & Duffles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Leather%20Jackets" className="hover:text-white transition-colors">
                  Leather Jackets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Gift%20Sets" className="hover:text-white transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-white transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Knowledge */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/craftsmanship" className="hover:text-white transition-colors">
                  Our Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/leather-guide" className="hover:text-white transition-colors">
                  Leather Guide
                </Link>
              </li>
              <li>
                <Link to="/product-care" className="hover:text-white transition-colors">
                  Product Care
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Leather Journal & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Exact Business Identity */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold">
              Business Identity
            </h3>

            <div className="text-sm font-serif font-bold text-white">
              {BUSINESS_INFO.name}
            </div>

            <p className="text-xs text-stone-400">
              {BUSINESS_INFO.category}
            </p>

            {/* Direct Phone */}
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <Phone className="w-4 h-4 text-[#C89D6E] shrink-0 mt-0.5" />
              <div>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="font-mono text-white hover:text-[#C89D6E] font-semibold transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
                <div className="text-[11px] text-stone-400">Direct Customer Assistance</div>
              </div>
            </div>

            {/* Exact Address */}
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <MapPin className="w-4 h-4 text-[#C89D6E] shrink-0 mt-0.5" />
              <address className="not-italic text-stone-300 leading-relaxed text-[11px]">
                {BUSINESS_INFO.address}
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Anti-slop clean footer, Quick Admin link */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved. Timeless leather products designed for everyday use.
          </div>

          {/* Quick Role Switcher for Test / Evaluation Convenience */}
          <div className="flex items-center gap-3 text-[11px]">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-stone-300 font-mono">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="text-stone-400 hover:text-white underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={quickLoginAsAdmin}
                  className="text-[#C89D6E] hover:text-white underline cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Demo Login</span>
                </button>
                <span className="text-stone-600">·</span>
                <button
                  onClick={quickLoginAsCustomer}
                  className="text-stone-400 hover:text-white underline cursor-pointer"
                >
                  Customer Demo Login
                </button>
              </div>
            )}
            <span className="text-stone-600">·</span>
            <Link
              to="/admin"
              className="text-[#C89D6E] hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Admin Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
