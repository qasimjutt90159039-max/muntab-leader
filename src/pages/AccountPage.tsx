import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, Phone, Mail, LogOut, ArrowRight, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/apiService';
import { Order } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Multan');
  const [province, setProvince] = useState(user?.address?.province || 'Punjab');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '60000');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    apiService.getOrders().then((all) => {
      // Filter orders placed by this user ID, email, or phone
      const myOrders = all.filter(
        (o) =>
          o.user?.id === user.id ||
          o.customerInformation.email.toLowerCase() === user.email.toLowerCase() ||
          o.customerInformation.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, '')
      );
      setOrders(myOrders);
      setLoadingOrders(false);
    });
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({
      address: { street, city, province, postalCode },
    });
    if (success) {
      setIsEditingAddress(false);
      showToast('Shipping address saved.', 'success');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'My Account' }]} />

        {/* Header */}
        <div className="mt-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EBE5DF] gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1E1511]">My Account</h1>
            <p className="text-xs text-stone-600 mt-1">
              Welcome, <strong className="text-stone-900">{user.name}</strong> · Member since {new Date(user.createdAt).getFullYear()}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider transition-colors w-fit"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile & Address Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-4">
                Personal Information
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-stone-700">
                  <User className="w-4 h-4 text-[#8C5D38] shrink-0" />
                  <span className="font-semibold text-stone-900">{user.name}</span>
                </div>
                <div className="flex items-center gap-2.5 text-stone-700">
                  <Mail className="w-4 h-4 text-[#8C5D38] shrink-0" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-stone-700 font-mono">
                  <Phone className="w-4 h-4 text-[#8C5D38] shrink-0" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Saved Shipping Address */}
            <div className="bg-white p-6 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Default Delivery Address
                </h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs text-[#8C5D38] hover:underline font-semibold"
                >
                  {isEditingAddress ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Province</label>
                      <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#8C5D38] text-white font-semibold uppercase tracking-wider text-[11px] mt-2"
                  >
                    Save Address
                  </button>
                </form>
              ) : (
                <div className="text-xs text-stone-600 space-y-1">
                  {user.address ? (
                    <>
                      <p className="text-stone-900 font-medium">{user.address.street}</p>
                      <p>{user.address.city}, {user.address.province}</p>
                      <p className="font-mono text-stone-400">{user.address.postalCode}, Pakistan</p>
                    </>
                  ) : (
                    <p className="text-stone-400 italic">No saved address yet. Click Edit to add one.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Orders History Column */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 sm:p-8 border border-[#EBE5DF] shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#EBE5DF] mb-6">
                <h3 className="text-base font-serif font-bold text-[#1E1511]">My Orders ({orders.length})</h3>
                <Link to="/track-order" className="text-xs text-[#8C5D38] font-semibold hover:underline flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track an order</span>
                </Link>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-stone-500">Loading order records...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-xs text-stone-600 mb-4">You haven't placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8C5D38] text-white text-xs uppercase tracking-wider font-semibold"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 border border-[#EBE5DF] rounded-xs hover:border-stone-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2 text-xs">
                        <div>
                          <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                          <span className="text-stone-400 ml-2">
                            · {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-medium text-[11px]">
                            {o.orderStatus}
                          </span>
                          <Link
                            to={`/track-order?orderNumber=${o.orderNumber}`}
                            className="text-[#8C5D38] hover:underline font-semibold text-[11px]"
                          >
                            Track
                          </Link>
                        </div>
                      </div>

                      <div className="py-3 flex flex-wrap gap-3">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                            <img src={item.thumbnail} alt={item.name} className="w-8 h-8 object-cover border border-stone-200" />
                            <span className="font-medium truncate max-w-45">{item.name}</span>
                            <span className="text-stone-400 font-mono">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500">Method: {o.paymentMethod}</span>
                        <div className="font-mono font-bold text-[#8C5D38]">
                          Rs. {o.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
