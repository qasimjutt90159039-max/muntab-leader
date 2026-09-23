import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, ShieldCheck, Award, Truck, Check, HelpCircle, Star, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { FAQS } from '../data/faqs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { INITIAL_REVIEWS } from '../data/initialData';

// --- ABOUT PAGE ---
export const AboutPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]} />

      <div className="mt-6 mb-10 text-center">
        <span className="text-xs uppercase tracking-widest text-[#8C5D38] font-semibold">The Multan Heritage</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511] mt-2">
          Mutalib's Leather Factory
        </h1>
        <p className="text-sm text-stone-600 mt-2 font-serif italic">
          "Crafted in Leather. Built to Last."
        </p>
      </div>

      <div className="bg-white border border-[#EBE5DF] p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <p>
          Founded in the historic artisan city of Multan, Pakistan, <strong>Mutalib's Leather Factory</strong> embodies the enduring tradition of authentic Pakistani leathercraft. Multan has been celebrated for centuries as a vital trade hub and center of master leather tanners and artisans.
        </p>

        <p>
          At our Qadri Street workshop, we craft premium everyday carry goods: bifold and slim wallets, formal and casual full-grain belts, executive laptop briefcases, weekend travel duffles, and bespoke corporate accessories. Every article is cut from vegetable-tanned bovine and buffalo hides, hand-edged, and saddle-stitched to ensure years of dependable service.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 pt-6 border-t border-b border-[#EBE5DF] text-center">
          <div>
            <div className="text-2xl font-serif font-bold text-[#8C5D38]">100%</div>
            <div className="text-xs text-stone-600 mt-1">Full-Grain Natural Leather</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#8C5D38]">25+ Years</div>
            <div className="text-xs text-stone-600 mt-1">Artisanal Master Tanning</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#8C5D38]">Pakistan-Wide</div>
            <div className="text-xs text-stone-600 mt-1">Cash on Delivery Service</div>
          </div>
        </div>

        <h3 className="text-base font-serif font-bold text-[#1E1511]">Our Philosophy: Anti-Fast-Fashion</h3>
        <p>
          Unlike synthetic plastic faux leathers or split-bonded materials that peel and end up in landfills within months, genuine full-grain leather develops a rich, golden-brown patina over time. The scratches and marks of everyday life blend into the hide, making each piece an intimate record of your journey.
        </p>

        <div className="mt-8 pt-6 border-t border-[#EBE5DF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-stone-900">Visit Our Factory Showroom</h4>
            <p className="text-xs text-stone-500 mt-0.5">{BUSINESS_INFO.address}</p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white text-xs uppercase tracking-wider font-semibold transition-colors shrink-0"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// --- CONTACT PAGE ---
export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />

        <div className="mt-6 mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">Contact Mutalib's Leather Factory</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Speak directly with our Multan workshop team for product inquiries, bespoke orders, or delivery support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Business Info Card */}
          <div className="lg:col-span-5 bg-[#1E1511] text-[#FAF8F5] p-6 sm:p-8 space-y-6 shadow-md border border-stone-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C89D6E] font-semibold">Direct Assistance</span>
              <h3 className="text-xl font-serif font-bold text-white mt-1">{BUSINESS_INFO.name}</h3>
              <p className="text-xs text-stone-400 mt-1">{BUSINESS_INFO.category}</p>
            </div>

            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C89D6E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-stone-400">Direct Factory Hotline / WhatsApp</div>
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="text-base font-mono font-bold text-white hover:text-[#C89D6E]">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C89D6E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-stone-400">Workshop & Factory Showroom</div>
                  <address className="not-italic text-stone-300 leading-relaxed mt-1">
                    {BUSINESS_INFO.address}
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C89D6E] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-stone-400">Operating Hours</div>
                  <p className="mt-1">Monday – Saturday: 10:00 AM – 8:00 PM (PKT)</p>
                  <p className="text-stone-400">Friday: Break 1:00 PM – 3:00 PM</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400">
              Multan city landmark: Located near Qasim Fort Metro Station Chungi 9.
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#EBE5DF] shadow-xs">
            <h3 className="text-lg font-serif font-bold text-[#1E1511] mb-4 pb-3 border-b border-[#EBE5DF]">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1E1511]">Message Sent!</h4>
                <p className="text-xs text-stone-600 mt-1">
                  Thank you, {name}. Our customer care team will respond via phone or WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!name || !phone) return;
                  setSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-stone-700 uppercase font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Farooq"
                    className="w-full px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 uppercase font-semibold mb-1">Mobile Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0334-1234567"
                    className="w-full px-3.5 py-2.5 border border-stone-300 font-mono focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 uppercase font-semibold mb-1">Message or Query *</label>
                  <textarea
                    rows={4}
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Ask about a specific product, bulk order, or custom leather request..."
                    className="w-full px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#8C5D38] hover:bg-[#6E472A] text-white uppercase tracking-widest font-semibold text-xs transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- FAQ PAGE ---
export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Orders', 'Payments', 'Shipping', 'Custom', 'Care'];
  const filtered = activeCategory === 'All' ? FAQS : FAQS.filter(f => f.category === activeCategory);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Frequently Asked Questions' }]} />

        <div className="mt-6 mb-10 text-center">
          <h1 className="text-3xl font-serif font-bold text-[#1E1511]">Frequently Asked Questions</h1>
          <p className="text-xs text-stone-600 mt-2">
            Answers to common questions regarding ordering, Cash on Delivery, leather care, and bespoke craft.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
                activeCategory === c
                  ? 'bg-[#8C5D38] text-white shadow-xs'
                  : 'bg-white border border-[#EBE5DF] text-stone-700 hover:bg-stone-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* FAQ Accordion list */}
        <div className="space-y-4">
          {filtered.map((faq, i) => (
            <details key={i} className="bg-white border border-[#EBE5DF] p-5 shadow-xs group cursor-pointer">
              <summary className="font-serif font-bold text-sm text-[#1E1511] flex items-center justify-between list-none">
                <span>{faq.question}</span>
                <span className="text-[#8C5D38] text-lg font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CRAFTSMANSHIP & LEATHER GUIDE ---
export const CraftsmanshipPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Our Craftsmanship' }]} />

      <div className="mt-6 mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">Artisan Leather Craftsmanship</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">The time-tested hand techniques behind every Mutalib leather product.</p>
      </div>

      <div className="bg-white border border-[#EBE5DF] p-8 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h3 className="text-lg font-serif font-bold text-[#1E1511]">1. Selection of Premium Full-Grain Hides</h3>
        <p>
          We source prime cowhides and water-buffalo skins directly from certified ethical tanneries in Punjab. Full-grain leather is the outermost layer of hide featuring tight, dense grain fibers that provide immense tensile strength and durability.
        </p>

        <h3 className="text-lg font-serif font-bold text-[#1E1511]">2. Hand Cutting & Skiving</h3>
        <p>
          Each pattern piece is individually cut along the natural grain line by experienced craftsmen. Critical folds and pocket edges are meticulously skived (beveled down) by hand to ensure thin, non-bulky profiles in wallets and cardholders.
        </p>

        <h3 className="text-lg font-serif font-bold text-[#1E1511]">3. Heavy-Duty Bonded Stitching</h3>
        <p>
          We use high-tenacity bonded nylon thread that resists friction, sweat, and humidity. Stress points and strap attachments receive double back-tacking reinforcement.
        </p>

        <h3 className="text-lg font-serif font-bold text-[#1E1511]">4. Hand-Burnished Edges</h3>
        <p>
          Instead of applying cheap rubber edge paints that peel off, our craftsmen bevel and burnish raw edges using natural gum tragacanth and wooden slickers until a glass-smooth, sealed luster is achieved.
        </p>
      </div>
    </div>
  </div>
);

// --- LEATHER GUIDE ---
export const LeatherGuidePage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Leather Guide' }]} />

      <div className="mt-6 mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1511]">The Complete Leather Guide</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">Understanding leather grades, tanning processes, and natural patina.</p>
      </div>

      <div className="bg-white border border-[#EBE5DF] p-8 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h3 className="text-lg font-serif font-bold text-[#1E1511]">1. Full-Grain Leather (The Gold Standard)</h3>
        <p>
          Full-grain leather is the highest quality leather available. It uses the entire grain of the hide with all its natural imperfections and natural toughness. Over time, instead of wearing out, full-grain leather develops an extraordinary lustrous patina.
        </p>

        <h3 className="text-lg font-serif font-bold text-[#1E1511]">2. Top-Grain Leather</h3>
        <p>
          Top-grain leather has had the top layer sanded or buffed to remove scars and blemishes, and is then imprinted with an imitation grain. While durable, it does not develop the rich patina of full-grain leather.
        </p>

        <h3 className="text-lg font-serif font-bold text-[#1E1511]">3. Vegetable-Tanned vs. Chrome-Tanned</h3>
        <p>
          <strong>Vegetable Tanning:</strong> An ancient, eco-friendly method using natural tree bark and plant tannins. It produces stiff, sturdy leather with a sweet woody aroma that ages beautifully.
        </p>
        <p>
          <strong>Chrome Tanning:</strong> Uses chromium salts for rapid tanning. It creates softer, supple leather ideal for jackets and garments.
        </p>

        <h3 className="text-lg font-serif font-bold text-[#1E1511]">4. What Makes Multan Leather Special?</h3>
        <p>
          Multan's arid climate and generations of tanners have mastered the art of curing tough water-buffalo and cow hides that resist humidity fluctuations while maintaining structural integrity for decades.
        </p>
      </div>
    </div>
  </div>
);

// --- PRODUCT CARE ---
export const ProductCarePage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Leather Product Care' }]} />

      <div className="mt-6 mb-10 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#1E1511]">Leather Care Guide</h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">Simple steps to keep your genuine leather supple, protected, and beautiful for decades.</p>
      </div>

      <div className="bg-white border border-[#EBE5DF] p-8 shadow-xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xs">
          <strong>Key Rule:</strong> Leather is natural animal skin with microscopic pores. Never use acetone, bleach, harsh detergents, or direct hairdryer heat on leather.
        </div>

        <h3 className="text-base font-serif font-bold text-[#1E1511]">Daily Cleaning</h3>
        <p>Gently wipe surface dust with a soft, clean cotton or microfiber cloth. For minor dirt, use a slightly damp cloth with lukewarm water, then air dry away from direct sunlight.</p>

        <h3 className="text-base font-serif font-bold text-[#1E1511]">Moisturizing & Conditioning</h3>
        <p>Apply a quality natural leather balm or beeswax conditioner every 4 to 6 months. Apply a pea-sized amount using circular motions, let absorb for 30 minutes, and buff with a dry horsehair brush or soft rag.</p>

        <h3 className="text-base font-serif font-bold text-[#1E1511]">If It Gets Soaked in Rain</h3>
        <p>Pat dry immediately with a clean towel. Stuff bags or jackets with plain unprinted paper to hold shape, and allow to air-dry naturally at room temperature.</p>
      </div>
    </div>
  </div>
);

// --- POLICIES ---
export const ShippingPolicyPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Shipping Policy' }]} />
      <div className="bg-white border border-[#EBE5DF] p-8 mt-6 shadow-xs space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h1 className="text-2xl font-serif font-bold text-[#1E1511]">Nationwide Shipping Policy</h1>
        <p>Mutalib's Leather Factory ships to all cities, towns, and villages across Pakistan.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Delivery Timelines:</strong> Multan city (1-2 business days), Major cities e.g. Lahore, Karachi, Islamabad (2-3 business days), Other regions (3-5 business days).</li>
          <li><strong>Shipping Rates:</strong> Free Delivery on orders of Rs. 5,000 and above. Standard flat courier fee of Rs. 250 for orders below Rs. 5,000.</li>
          <li><strong>Courier Partners:</strong> Dispatched via trusted trackable couriers (TCS, Leopards, Trax, Call Courier).</li>
          <li><strong>Tracking:</strong> Live online tracking available on our website using your Order Number.</li>
        </ul>
      </div>
    </div>
  </div>
);

export const ReturnsPolicyPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Returns & Refunds' }]} />
      <div className="bg-white border border-[#EBE5DF] p-8 mt-6 shadow-xs space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h1 className="text-2xl font-serif font-bold text-[#1E1511]">Return & Exchange Policy</h1>
        <p>We stand behind our handcrafted quality with a 7-day return and exchange policy.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Items must be unused, in their original condition and packaging with tags intact.</li>
          <li>To initiate a return or exchange, call or WhatsApp our factory helpline at <strong>03347214721</strong> with your Order Number.</li>
          <li>Custom personalized goods (with debossed initials or bespoke monograms) are not returnable unless there is an evident manufacturing defect.</li>
          <li>Refunds for eligible returns are processed via online bank transfer, Raast, or EasyPaisa within 3-5 business days after product inspection.</li>
        </ul>
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Privacy Policy' }]} />
      <div className="bg-white border border-[#EBE5DF] p-8 mt-6 shadow-xs space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h1 className="text-2xl font-serif font-bold text-[#1E1511]">Privacy Policy</h1>
        <p>Your privacy is of utmost importance to Mutalib's Leather Factory.</p>
        <p>We only collect information necessary to fulfill orders, facilitate deliveries with courier partners, and communicate order updates. We do not sell, rent, or trade your personal contact details with third-party marketers.</p>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Terms & Conditions' }]} />
      <div className="bg-white border border-[#EBE5DF] p-8 mt-6 shadow-xs space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h1 className="text-2xl font-serif font-bold text-[#1E1511]">Terms & Conditions</h1>
        <p>By using Mutalib's Leather Factory website and placing an order, you agree to our standard store policies. All prices are in Pakistani Rupees (PKR). Genuine leather exhibits natural grain markings, color subtleties, and natural characteristics which verify its authenticity.</p>
      </div>
    </div>
  </div>
);

// --- REVIEWS PAGE ---
export const ReviewsPage: React.FC = () => (
  <div className="bg-[#FAF8F5] min-h-screen py-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Customer Reviews' }]} />

      <div className="mt-6 mb-10 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#1E1511]">Customer Testimonials & Reviews</h1>
        <p className="text-xs text-stone-600 mt-2">What verified buyers across Pakistan say about our genuine leather products.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {INITIAL_REVIEWS.map((r) => (
          <div key={r.id} className="bg-white border border-[#EBE5DF] p-6 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-900">{r.userName}</span>
              <span className="text-stone-400 font-mono text-[11px]">{r.date}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
              {'★'.repeat(r.rating)}
              <span className="text-stone-700 font-bold ml-1">{r.title}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">"{r.comment}"</p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Product: {r.productName}</span>
              {r.verifiedPurchase && <span className="text-emerald-700 font-semibold">✓ Verified Buyer</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
