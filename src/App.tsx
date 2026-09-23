import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AIChatModal } from './components/AIChatModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { CustomLeatherPage } from './pages/CustomLeatherPage';
import { WholesalePage } from './pages/WholesalePage';
import { OffersPage } from './pages/OffersPage';
import { WishlistPage } from './pages/WishlistPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import {
  AboutPage,
  ContactPage,
  FAQPage,
  CraftsmanshipPage,
  LeatherGuidePage,
  ProductCarePage,
  ShippingPolicyPage,
  ReturnsPolicyPage,
  PrivacyPolicyPage,
  TermsPage,
  ReviewsPage,
} from './pages/InfoPages';
import { BlogPage, BlogPostPage } from './pages/BlogPage';

// Automatically scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1511] font-sans antialiased selection:bg-[#8C5D38] selection:text-white">
                <Navbar />
                <CartDrawer />
                <main className="flex-1">
                  <Routes>
                    {/* Catalog & Shopping Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage pageTitle="All Handcrafted Products" filterType="all" />} />
                    <Route path="/products" element={<ShopPage pageTitle="All Handcrafted Products" filterType="all" />} />
                    <Route path="/new-arrivals" element={<ShopPage pageTitle="New Arrivals" filterType="new" />} />
                    <Route path="/best-sellers" element={<ShopPage pageTitle="Best Sellers" filterType="bestseller" />} />
                    <Route path="/featured" element={<ShopPage pageTitle="Featured Collections" filterType="featured" />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/product/:slug" element={<ProductDetailsPage />} />

                    {/* Checkout & Orders */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />

                    {/* Bespoke, Wholesale & Promos */}
                    <Route path="/custom-leather" element={<CustomLeatherPage />} />
                    <Route path="/wholesale" element={<WholesalePage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />

                    {/* Auth & Customer Account */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<AuthPage />} />
                    <Route path="/account" element={<AccountPage />} />

                    {/* Admin Management Dashboard */}
                    <Route path="/admin" element={<AdminDashboardPage />} />

                    {/* Informational & Heritage */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
                    <Route path="/leather-guide" element={<LeatherGuidePage />} />
                    <Route path="/product-care" element={<ProductCarePage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />

                    {/* Legal & Policy */}
                    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                    <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />

                    {/* Blog */}
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>
                <Footer />
                <AIChatModal />
              </div>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
