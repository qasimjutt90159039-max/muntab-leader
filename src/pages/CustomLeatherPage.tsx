import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Check, Send, Phone, Award, Layers } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BUSINESS_INFO } from '../data/business';

export const CustomLeatherPage: React.FC = () => {
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productType, setProductType] = useState('Custom Wallet');
  const [preferredMaterial, setPreferredMaterial] = useState('Vegetable-Tanned Buffalo Hide');
  const [color, setColor] = useState('Vintage Whiskey Tan');
  const [customText, setCustomText] = useState('');
  const [logoRequirement, setLogoRequirement] = useState<'Yes' | 'No'>('No');
  const [quantity, setQuantity] = useState(1);
  const [budget, setBudget] = useState('Rs. 3,500 - 6,000');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      showToast('Please provide your name and phone number.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiService.createCustomOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        productType,
        preferredMaterial,
        color,
        quantity: Number(quantity) || 1,
        customText: customText.trim() || undefined,
        logoRequirement,
        budget,
        additionalInstructions: instructions.trim(),
      });

      setSubmittedInquiry(res.inquiryNumber);
      showToast(`Custom order inquiry submitted! Ref: ${res.inquiryNumber}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Custom Leather Craft' }]} />

        {/* Hero Section */}
        <div className="mt-6 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C5D38]/10 text-[#8C5D38] text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Multan Workshop</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">
            Custom Leather Craft & Monogramming
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
            Have a wallet, bag, or corporate accessory custom tailored to your exact specifications. From hot-foil gold initials debossing to bespoke corporate leather gifts, our master craftsmen in Multan bring your vision to life.
          </p>
        </div>

        {submittedInquiry ? (
          <div className="max-w-2xl mx-auto bg-white border border-[#EBE5DF] p-8 text-center shadow-xs">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1E1511]">Inquiry Received!</h2>
            <p className="text-xs text-stone-600 mt-2">
              Our leather craftsman will review your specifications and contact you via phone/WhatsApp within 24 hours with exact pricing and leather swatch samples.
            </p>
            <div className="mt-4 p-3 bg-[#FAF8F5] font-mono text-sm text-[#8C5D38] font-bold border border-[#EBE5DF]">
              Inquiry Ref: {submittedInquiry}
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSubmittedInquiry(null);
                  setCustomText('');
                  setInstructions('');
                }}
                className="px-6 py-2.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Live Preview & Value Proposition */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Visualizer Card */}
              <div className="bg-[#1E1511] text-[#FAF8F5] p-6 border border-stone-800 shadow-xl relative overflow-hidden">
                <div className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Live Monogram Visualizer</span>
                </div>

                <div className="aspect-16/10 bg-[#3B2C24] border border-[#C89D6E]/40 p-6 flex flex-col justify-between relative shadow-inner">
                  <div className="flex justify-between items-start text-xs">
                    <span className="font-serif italic text-stone-300">{productType}</span>
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 text-[#C89D6E] border border-[#C89D6E]/30 rounded">
                      {preferredMaterial}
                    </span>
                  </div>

                  <div className="text-center py-4">
                    {customText ? (
                      <div className="inline-block px-4 py-2 border-2 border-[#C89D6E] tracking-[0.3em] font-serif text-2xl font-bold text-[#FAF8F5] shadow-lg bg-black/30 backdrop-blur-xs">
                        {customText.toUpperCase()}
                      </div>
                    ) : (
                      <span className="text-stone-400 text-xs italic">
                        [Type custom initials or name below]
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-end text-[11px] text-stone-300">
                    <span>Color: <strong>{color}</strong></span>
                    <span className="text-[#C89D6E]">Handcrafted in Multan</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-stone-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C89D6E]" />
                    <span>Deep hot-foil or blind deboss that lasts a lifetime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C89D6E]" />
                    <span>Vegetable-tanned full-grain leather edges hand-burnished</span>
                  </div>
                </div>
              </div>

              {/* Direct Workshop Contact */}
              <div className="bg-white p-6 border border-[#EBE5DF]">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-800 mb-2">
                  Need Immediate Consultation?
                </h3>
                <p className="text-xs text-stone-600 mb-4">
                  Speak directly with our Multan workshop lead craftsman regarding leather thickness, dye formulas, or urgent deadlines.
                </p>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#8C5D38] hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>Direct Hotline: {BUSINESS_INFO.phone}</span>
                </a>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#EBE5DF] shadow-xs">
              <h2 className="text-xl font-serif font-bold text-[#1E1511] mb-6 pb-3 border-b border-[#EBE5DF]">
                Custom Leather Specification Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Asad Siddiqui"
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0334-1234567"
                      className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Product Type</label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] bg-white"
                    >
                      <option value="Custom Wallet">Custom Bifold / Slim Wallet</option>
                      <option value="Custom Belt">Custom Leather Belt</option>
                      <option value="Custom Bag">Handcrafted Bag / Tote</option>
                      <option value="Laptop Sleeve">Laptop Briefcase / Sleeve</option>
                      <option value="Corporate Padfolio">Executive Padfolio / Folder</option>
                      <option value="Key Organizer">Key Organizer / Pouch</option>
                      <option value="Other Bespoke Article">Other Bespoke Article</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Leather Selection</label>
                    <select
                      value={preferredMaterial}
                      onChange={(e) => setPreferredMaterial(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] bg-white"
                    >
                      <option value="Vegetable-Tanned Buffalo Hide">Vegetable-Tanned Buffalo Hide (Sturdy, Ages Richly)</option>
                      <option value="Full-Grain Cowhide">Full-Grain Cowhide (Supple, Smooth)</option>
                      <option value="Pull-Up Waxed Leather">Pull-Up Waxed Vintage Leather</option>
                      <option value="Italian-Style Crust Leather">Italian-Style Crust Leather</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Leather Shade / Color</label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] bg-white"
                    >
                      <option value="Vintage Whiskey Tan">Vintage Whiskey Tan</option>
                      <option value="Espresso Dark Brown">Espresso Dark Brown</option>
                      <option value="Midnight Classic Black">Midnight Classic Black</option>
                      <option value="Cognac Cognac Brown">Cognac Light Brown</option>
                      <option value="Oxblood Burgundy">Oxblood Burgundy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Initials / Name for Debossing</label>
                    <input
                      type="text"
                      maxLength={20}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. M.A. or QASIM"
                      className="w-full text-xs uppercase px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Quantity Needed</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-medium text-stone-700 mb-1">Custom Metal Logo Stamp Required?</label>
                    <select
                      value={logoRequirement}
                      onChange={(e) => setLogoRequirement(e.target.value as any)}
                      className="w-full text-xs px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38] bg-white"
                    >
                      <option value="No">No (Standard Initials/Letters)</option>
                      <option value="Yes">Yes (Custom Brand/Company Brass Stamp)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-stone-700 mb-1">
                    Special Dimensions & Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Specify dimensions (e.g. 11.5cm x 9cm), pocket configuration, stitching thread color, or deadline."
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Bespoke Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
