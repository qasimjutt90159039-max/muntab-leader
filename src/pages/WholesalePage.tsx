import React, { useState } from 'react';
import { Building2, Package, Check, Send, Phone, ShieldCheck, Truck, Users } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BUSINESS_INFO } from '../data/business';

export const WholesalePage: React.FC = () => {
  const { showToast } = useToast();

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productCategory, setProductCategory] = useState('Wallets & Card Holders');
  const [quantity, setQuantity] = useState(50);
  const [budget, setBudget] = useState('Rs. 100,000 - 250,000');
  const [requiredDate, setRequiredDate] = useState('');
  const [shippingCity, setShippingCity] = useState('Multan');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactPerson.trim() || !phone.trim()) {
      showToast('Please provide your business name, contact person, and phone number.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiService.createWholesaleInquiry({
        businessName: businessName.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        productCategory,
        estimatedQuantity: Number(quantity) || 50,
        budget,
        requiredDate: requiredDate || undefined,
        shippingCity,
        message: message.trim(),
      });

      setSubmittedInquiry(res.inquiryNumber);
      showToast(`Wholesale inquiry submitted! Ref: ${res.inquiryNumber}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Wholesale & Corporate Inquiries' }]} />

        {/* Hero */}
        <div className="mt-6 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C5D38]/10 text-[#8C5D38] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Factory Direct Wholesale</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">
            Corporate Gifting & Bulk Leather Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
            Mutalib's Leather Factory is a premier manufacturer for corporate clients, multinational organizations, and luxury retailers across Pakistan. Benefit from tier discounts, custom brand debossing, and luxury packaging.
          </p>
        </div>

        {/* Wholesale Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 border border-[#EBE5DF] text-center shadow-xs">
            <div className="text-xs font-mono uppercase text-stone-400 font-semibold mb-1">Tier 1</div>
            <h3 className="text-lg font-serif font-bold text-[#1E1511]">25 – 50 Units</h3>
            <div className="text-2xl font-mono font-bold text-[#8C5D38] my-3">15% Off</div>
            <p className="text-xs text-stone-600">Ideal for team gifts, boutique retailers, and small executive seminars.</p>
          </div>

          <div className="bg-white p-6 border-2 border-[#8C5D38] text-center shadow-md relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#8C5D38] text-white text-[10px] uppercase font-bold tracking-wider rounded-full">
              Most Popular
            </span>
            <div className="text-xs font-mono uppercase text-[#8C5D38] font-semibold mb-1">Tier 2</div>
            <h3 className="text-lg font-serif font-bold text-[#1E1511]">51 – 200 Units</h3>
            <div className="text-2xl font-mono font-bold text-[#8C5D38] my-3">25% Off</div>
            <p className="text-xs text-stone-600">Includes complimentary company logo debossing stamp & luxury presentation boxes.</p>
          </div>

          <div className="bg-white p-6 border border-[#EBE5DF] text-center shadow-xs">
            <div className="text-xs font-mono uppercase text-stone-400 font-semibold mb-1">Tier 3</div>
            <h3 className="text-lg font-serif font-bold text-[#1E1511]">200+ Units</h3>
            <div className="text-2xl font-mono font-bold text-[#8C5D38] my-3">35% Off</div>
            <p className="text-xs text-stone-600">Bespoke leather tanning, custom metal hardware, and dedicated priority production line.</p>
          </div>
        </div>

        {submittedInquiry ? (
          <div className="max-w-2xl mx-auto bg-white border border-[#EBE5DF] p-8 text-center shadow-xs">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1E1511]">Wholesale Inquiry Registered!</h2>
            <p className="text-xs text-stone-600 mt-2">
              Our B2B corporate relations lead will review your requirements and reach out within 1 business day with sample terms and formal quotation.
            </p>
            <div className="mt-4 p-3 bg-[#FAF8F5] font-mono text-sm text-[#8C5D38] font-bold border border-[#EBE5DF]">
              Inquiry Ref: {submittedInquiry}
            </div>
            <div className="mt-6">
              <button
                onClick={() => setSubmittedInquiry(null)}
                className="px-6 py-2.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 border border-[#EBE5DF]">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-3">
                  Why Partner With Mutalib's Leather Factory?
                </h3>
                <div className="space-y-3 text-xs text-stone-600">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#8C5D38] shrink-0 mt-0.5" />
                    <span>Direct factory rates with zero middleman markups</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Package className="w-4 h-4 text-[#8C5D38] shrink-0 mt-0.5" />
                    <span>Strict double-point QA inspections before dispatch</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-[#8C5D38] shrink-0 mt-0.5" />
                    <span>Secured cargo delivery to any commercial hub in Pakistan</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EBE5DF]">
                  <div className="text-[11px] text-stone-400">Direct Corporate Desk:</div>
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="font-mono text-xs font-bold text-[#8C5D38] hover:underline"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-6 sm:p-8 border border-[#EBE5DF] shadow-xs">
              <h2 className="text-xl font-serif font-bold text-[#1E1511] mb-6 pb-3 border-b border-[#EBE5DF]">
                Request a Bulk Quotation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Technologies Multan"
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Kashif Mehmood"
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0333-5557788"
                      className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Category</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] bg-white"
                    >
                      <option value="Wallets & Card Holders">Wallets & Card Holders</option>
                      <option value="Corporate Padfolios & Folios">Corporate Padfolios</option>
                      <option value="Laptop Bags & Briefcases">Laptop Bags & Briefcases</option>
                      <option value="Full-Grain Leather Belts">Leather Belts</option>
                      <option value="Travel Duffles & Kits">Travel Bags</option>
                      <option value="Curated Gift Box Sets">Curated Gift Box Sets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Estimated Units</label>
                    <input
                      type="number"
                      min={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Destination City</label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="e.g. Multan, Lahore, Karachi"
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">
                    Order Details, Logo Specifications & Deadlines
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe specific products, embossing needs, packaging preferences, and expected delivery date."
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Request Formal Wholesale Quote'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
