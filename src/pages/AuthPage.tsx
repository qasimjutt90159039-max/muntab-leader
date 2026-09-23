import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, quickLoginAsAdmin, quickLoginAsCustomer, user, isAdmin } = useAuth();
  const { showToast } = useToast();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    setLoading(true);
    const success = await login(email.trim());
    setLoading(false);
    if (success) {
      navigate('/account');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please fill in your name, email, and phone number.', 'error');
      return;
    }

    setLoading(true);
    const success = await register(name.trim(), email.trim(), phone.trim());
    setLoading(false);
    if (success) {
      navigate('/account');
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-md mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: mode === 'login' ? 'Sign In' : 'Create Account' }]} />

        <div className="bg-white border border-[#EBE5DF] p-6 sm:p-8 shadow-xs mt-6">
          {/* Tabs */}
          <div className="flex border-b border-[#EBE5DF] mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                mode === 'login'
                  ? 'border-[#8C5D38] text-[#8C5D38]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-3 text-xs uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                mode === 'register'
                  ? 'border-[#8C5D38] text-[#8C5D38]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* Quick Demo Logins for fast testing & evaluation */}
          <div className="mb-6 p-3 bg-[#FAF8F5] border border-[#EBE5DF] rounded">
            <div className="text-[11px] font-semibold text-stone-600 mb-2 uppercase tracking-wider">
              1-Click Demo Logins:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickLoginAsAdmin();
                  navigate('/admin');
                }}
                className="py-1.5 px-2 bg-[#1E1511] text-[#C89D6E] hover:bg-black text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Demo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginAsCustomer();
                  navigate('/account');
                }}
                className="py-1.5 px-2 bg-stone-200 text-stone-800 hover:bg-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer Demo</span>
              </button>
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@mutalibleather.pk"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tariq@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Mobile Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
