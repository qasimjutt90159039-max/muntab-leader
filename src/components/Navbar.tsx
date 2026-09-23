import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Best Sellers', path: '/best-sellers' },
    { label: 'Custom Leather', path: '/custom-leather' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE5DF]">
        {/* Top Bar 3-Zone Contract Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#1E1511] hover:text-[#8C5D38] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-[#1E1511] hover:text-[#8C5D38] transition-colors whitespace-nowrap"
          >
            Mutalib's Leather Factory
          </Link>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-medium text-[#2E2019]">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `hover:text-[#8C5D38] transition-colors whitespace-nowrap py-1 border-b-2 ${
                    isActive ? 'border-[#8C5D38] text-[#8C5D38] font-semibold' : 'border-transparent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#2E2019] hover:text-[#8C5D38] transition-colors"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account link / Admin badge */}
            <Link
              to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
              className="p-2 text-[#2E2019] hover:text-[#8C5D38] transition-colors relative"
              aria-label={user ? 'My Account' : 'Sign in'}
            >
              {isAdmin ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8C5D38]">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </span>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-[#2E2019] hover:text-[#8C5D38] transition-colors relative hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8C5D38] text-white text-[10px] font-mono flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 p-2 text-[#1E1511] hover:text-[#8C5D38] transition-colors cursor-pointer"
              aria-label="Open cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-[#1E1511] text-white text-[10px] font-mono flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs uppercase tracking-wider font-semibold">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EBE5DF] bg-[#FAF8F5] px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-[#1E1511] py-1"
              >
                Home
              </NavLink>
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-wider font-medium text-[#1E1511] py-1 hover:text-[#8C5D38]"
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/offers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-[#8C5D38] py-1"
              >
                Special Offers
              </NavLink>
              <NavLink
                to="/wholesale"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-[#1E1511] py-1"
              >
                Wholesale / Bulk Inquiries
              </NavLink>
              <NavLink
                to="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-medium text-[#1E1511] py-1"
              >
                Track Order
              </NavLink>
            </nav>

            <div className="pt-4 border-t border-[#EBE5DF] flex items-center justify-between text-xs text-stone-600">
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-[#8C5D38]" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>
              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-semibold text-[#1E1511]"
              >
                {user ? `Account (${user.name})` : 'Sign In / Register'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Live Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
