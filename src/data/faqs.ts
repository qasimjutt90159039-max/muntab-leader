export interface FAQItem {
  question: string;
  answer: string;
  category: 'Orders' | 'Payments' | 'Shipping' | 'Custom' | 'Care';
}

export const FAQS: FAQItem[] = [
  {
    question: 'How can I place an order on the website?',
    answer: 'Simply browse our catalog, select your desired product with options (such as color or belt size), click "Add to Cart", and proceed to Checkout. You can checkout as a guest or create an account to view and track your order history.',
    category: 'Orders'
  },
  {
    question: 'Do you offer Cash on Delivery (COD) across Pakistan?',
    answer: 'Yes! We offer Cash on Delivery across Multan, Lahore, Karachi, Islamabad, and nationwide across Pakistan. You only pay when your parcel is delivered to your doorstep.',
    category: 'Payments'
  },
  {
    question: 'How can I track my order once dispatched?',
    answer: 'Once your order is processed and dispatched, you will receive your unique Order Number (e.g. MLF-ORD-1001). You can visit our "Track Order" page anytime and enter your Order Number and phone or email to view the live timeline: Placed, Confirmed, Processing, Shipped, and Delivered.',
    category: 'Orders'
  },
  {
    question: 'Can I request a custom leather product with my own design or dimensions?',
    answer: 'Yes, we gladly accept bespoke leather requests! Navigate to our "Custom Leather" page to submit your preferred product type, dimensions, hide preference, text or logo stamping requirements, and budget. Our team will generate an inquiry reference (e.g. MLF-CUSTOM-0001) and contact you directly via phone (03347214721) or email.',
    category: 'Custom'
  },
  {
    question: 'Can I place a bulk or wholesale order for corporate gifts or retail resale?',
    answer: 'Yes. We cater to corporate clients, institutions, and retailers seeking custom embossed leather goods. Visit our "Wholesale / Bulk Orders" page to request a detailed quote based on your volume and timeline.',
    category: 'Custom'
  },
  {
    question: 'What type of leather do you use in your products?',
    answer: 'We focus on high-grade full-grain and vegetable-tanned bovine and buffalo leather, along with soft genuine lambskin for our jackets. We do not use faux leather or low-grade plastic-coated split leathers.',
    category: 'Care'
  },
  {
    question: 'How should I properly care for and maintain my leather goods?',
    answer: 'Keep leather away from prolonged soaking in water and direct high heat sources. For regular cleaning, wipe with a dry or slightly damp cotton cloth. Apply a natural beeswax balm or leather conditioner twice a year to keep the leather nourished and supple.',
    category: 'Care'
  },
  {
    question: 'How can I contact Mutalib\'s Leather Factory directly?',
    answer: 'You can contact us by phone at 03347214721 or visit our workshop in Multan at: No, Qadri Street, Opposite Al-Arafat Marriage Club, Near Qasim Fort Metro Station Chungi, 9, Mohalla Muhammadi, Multan, 66000, Pakistan.',
    category: 'Orders'
  },
  {
    question: 'Can I cancel or modify an order after placing it?',
    answer: 'Orders can be modified or cancelled before they are marked as "Shipped". Please call us at 03347214721 immediately with your Order Number so we can assist you before courier pickup.',
    category: 'Orders'
  },
  {
    question: 'What is the return and exchange policy?',
    answer: 'We accept returns and exchanges on standard unused catalog products in their original packaging within 7 days of delivery. Please note that personalized or custom-engraved items cannot be returned unless there is a confirmed manufacturing defect.',
    category: 'Shipping'
  },
  {
    question: 'How long does shipping take within Multan and nationwide?',
    answer: 'Deliveries within Multan typically take 1 to 2 business days. Nationwide deliveries to other cities in Pakistan typically arrive within 3 to 5 business days via trusted courier services.',
    category: 'Shipping'
  },
  {
    question: 'What are the delivery charges?',
    answer: 'Standard courier delivery is Rs. 250 nationwide. We offer Free Shipping on all orders above Rs. 5,000.',
    category: 'Shipping'
  },
  {
    question: 'What online payment methods are supported?',
    answer: 'In addition to Cash on Delivery (COD), we have an online payment integration structure ready for direct bank transfer or gateway processing.',
    category: 'Payments'
  },
  {
    question: 'Do you offer custom embossing or name initials on wallets and belts?',
    answer: 'Yes! We offer blind debossing and gold foil hot-stamping for initials and names. You can mention this in your order notes during checkout or via our Custom Leather inquiry page.',
    category: 'Custom'
  },
  {
    question: 'How do I know my correct belt size?',
    answer: 'As a general rule, choose a belt that is 2 inches larger than your trouser/waist size. For example, if you wear size 32 waist trousers, order a 34-inch belt. Each belt features 5 adjustment holes for a comfortable fit.',
    category: 'Orders'
  },
  {
    question: 'What should I do if my leather item gets wet in the rain?',
    answer: 'Do not panic. Gently pat away excess moisture with a clean dry towel and allow the item to dry naturally at room temperature in a well-ventilated area. Never place it near a radiator or blow-dry it with hot air.',
    category: 'Care'
  }
];
