import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db';
import { BUSINESS_INFO } from './src/data/business';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS headers for local multi-port or cross-origin access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- HEALTH & BUSINESS INFO ---
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: "Mutalib's Leather Factory",
    city: 'Multan, Pakistan',
    phone: BUSINESS_INFO.phone,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/business-info', (req: Request, res: Response) => {
  res.json(BUSINESS_INFO);
});

// --- PRODUCTS ---
app.get('/api/products', (req: Request, res: Response) => {
  try {
    let products = db.getProducts();
    const { category, featured, newArrival, bestSeller, onSale, search } = req.query;

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }
    if (newArrival === 'true') {
      products = products.filter(p => p.newArrival);
    }
    if (bestSeller === 'true') {
      products = products.filter(p => p.bestSeller);
    }
    if (onSale === 'true') {
      products = products.filter(p => p.onSale);
    }
    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }

    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const product = db.getProductByIdOrSlug(idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, message: 'Product deleted' });
});

app.patch('/api/products/:id/stock', (req: Request, res: Response) => {
  const { stock } = req.body;
  if (typeof stock !== 'number') {
    return res.status(400).json({ error: 'Numeric stock required' });
  }
  const success = db.updateStock(req.params.id, stock);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, stock });
});

// --- CATEGORIES ---
app.get('/api/categories', (req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/categories', (req: Request, res: Response) => {
  const cat = db.saveCategory(req.body);
  res.json(cat);
});

// --- ORDERS ---
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(db.getOrders());
});

app.get('/api/orders/:idOrNumber', (req: Request, res: Response) => {
  const order = db.getOrderByIdOrNumber(req.params.idOrNumber);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    if (!orderData.customerInformation || !orderData.customerInformation.phone) {
      return res.status(400).json({ error: 'Customer contact phone is required' });
    }

    const order = db.createOrder(orderData);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;
  const updated = db.updateOrderStatus(req.params.id, orderStatus, paymentStatus);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// --- CUSTOM BESPOKE ORDERS ---
app.get('/api/custom-orders', (req: Request, res: Response) => {
  res.json(db.getCustomOrders());
});

app.post('/api/custom-orders', (req: Request, res: Response) => {
  try {
    const created = db.createCustomOrder(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/custom-orders/:id/status', (req: Request, res: Response) => {
  const { status, internalNotes } = req.body;
  const updated = db.updateCustomOrderStatus(req.params.id, status, internalNotes);
  if (!updated) return res.status(404).json({ error: 'Custom order not found' });
  res.json(updated);
});

// --- WHOLESALE INQUIRIES ---
app.get('/api/wholesale', (req: Request, res: Response) => {
  res.json(db.getWholesaleInquiries());
});

app.post('/api/wholesale', (req: Request, res: Response) => {
  try {
    const created = db.createWholesaleInquiry(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/wholesale/:id/status', (req: Request, res: Response) => {
  const { status, internalNotes } = req.body;
  const updated = db.updateWholesaleStatus(req.params.id, status, internalNotes);
  if (!updated) return res.status(404).json({ error: 'Wholesale inquiry not found' });
  res.json(updated);
});

// --- COUPONS ---
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, discount: 0, message: 'Coupon code required' });
  }
  const result = db.validateCoupon(code, Number(cartTotal) || 0);
  res.json(result);
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const saved = db.saveCoupon(req.body);
  res.status(201).json(saved);
});

app.delete('/api/coupons/:id', (req: Request, res: Response) => {
  const success = db.deleteCoupon(req.params.id);
  if (!success) return res.status(404).json({ error: 'Coupon not found' });
  res.json({ success: true });
});

// --- REVIEWS ---
app.get('/api/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  res.json(db.getReviews(productId ? String(productId) : undefined));
});

app.post('/api/reviews', (req: Request, res: Response) => {
  try {
    const review = db.addReview(req.body);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/reviews/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const success = db.updateReviewStatus(req.params.id, status);
  if (!success) return res.status(404).json({ error: 'Review not found' });
  res.json({ success: true });
});

// --- AUTH & USERS ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'No account found with this email' });
  }
  res.json({ success: true, user });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required' });
  }
  try {
    const user = db.registerUser(name, email, phone, role || 'customer');
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

app.put('/api/auth/users/:id', (req: Request, res: Response) => {
  const updated = db.updateUserProfile(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, user: updated });
});

// --- AI LEATHER CONCIERGE (Gemini / Domain Expert) ---
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = `You are the master leather craftsman and customer concierge for Mutalib's Leather Factory located in Multan, Pakistan.
Store details:
- Factory Address: No, Qadri Street, Opposite Al-Arafat Marriage Club, Near Qasim Fort Metro Station Chungi, 9, Mohalla Muhammadi, Multan, Pakistan.
- Direct Contact / WhatsApp / Phone: 03347214721.
- Offerings: 100% full-grain cowhide, buffalo hide, and lambskin handcrafted wallets, belts, office bags, laptop briefcases, backpacks, travel duffles, jackets, and bespoke personalized gift sets with hot-foil/debossed monograms.
- Shipping: Nationwide Cash on Delivery (COD) across Pakistan. Free shipping on orders above Rs. 5,000 (Standard Rs. 250 fee otherwise). Delivery takes 2-4 business days.
- Custom orders: Bespoke leather goods, corporate logos, and initials personalization.
Tone: Warm, polite, knowledgeable, professional. Fluent in English and Urdu/Roman Urdu. Respond in the language used by the user. Give concise, direct, helpful answers.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptText = `${systemPrompt}\n\nUser Question: ${message}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });

      const reply = response.text || "Thank you for contacting Mutalib's Leather Factory. How can I assist you with our genuine leather products?";
      return res.json({ reply });
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local expert system:', err);
    }
  }

  // Smart local expert response in English/Urdu based on query intent
  const msgLower = message.toLowerCase();
  let fallbackReply = '';

  if (msgLower.includes('multan') || msgLower.includes('location') || msgLower.includes('address') || msgLower.includes('kahan') || msgLower.includes('factory')) {
    fallbackReply = `Humari factory Multan mein waqia hai: No, Qadri Street, Opposite Al-Arafat Marriage Club, Near Qasim Fort Metro Station Chungi 9, Multan. Aap showroom visit kar sakte hain ya direct humein 03347214721 par call/WhatsApp kar sakte hain.`;
  } else if (msgLower.includes('delivery') || msgLower.includes('shipping') || msgLower.includes('charges') || msgLower.includes('cod') || msgLower.includes('cash on delivery')) {
    fallbackReply = `Hum pure Pakistan mein Cash on Delivery (COD) provide karte hain! Rs. 5,000 se upar ke orders par Free Delivery hai. Rs. 5,000 se kam orders par flat Rs. 250 delivery charge hai. Delivery aam taur par 2 se 4 business days mein ho jati hai.`;
  } else if (msgLower.includes('phone') || msgLower.includes('contact') || msgLower.includes('number') || msgLower.includes('whatsapp') || msgLower.includes('rabta')) {
    fallbackReply = `Aap direct humare master craftsman se 03347214721 par call ya WhatsApp ke zariye rabta kar sakte hain.`;
  } else if (msgLower.includes('custom') || msgLower.includes('name') || msgLower.includes('monogram') || msgLower.includes('engrav') || msgLower.includes('gift')) {
    fallbackReply = `Ji bilkul! Hum bespoke custom leather craft provide karte hain. Aap apna name, initials ya company logo wallets, bags ya belts par deboss karwa sakte hain. Aap humare 'Custom Leather' page par inquiry submit kar sakte hain ya 03347214721 par contact karein.`;
  } else if (msgLower.includes('leather') || msgLower.includes('asli') || msgLower.includes('pure') || msgLower.includes('quality') || msgLower.includes('material')) {
    fallbackReply = `Mutalib's Leather Factory sirf 100% Asli Full-Grain cowhide, buffalo hide aur lambskin leather use karti hai. Hum synthetic ya rexine bilkul use nahi karte. Har product waqt ke sath khoobsurat patina develop karta hai.`;
  } else if (msgLower.includes('return') || msgLower.includes('refund') || msgLower.includes('exchange') || msgLower.includes('wapsi')) {
    fallbackReply = `Hum 7-day hassle-free return aur exchange policy offer karte hain agar product unused ho aur original packaging mein ho. Mazeed maloomat ke liye 03347214721 par rabta karein.`;
  } else {
    fallbackReply = `Welcome to Mutalib's Leather Factory Multan! Hum 100% full-grain handcrafted leather wallets, belts, laptop bags, travel bags aur custom products banate hain. Pure Pakistan mein Cash on Delivery available hai. Kisi bhi product ya order ke liye humein 03347214721 par rabta karein ya yahan poochhein!`;
  }

  return res.json({ reply: fallbackReply });
});

// Serve frontend in production or start express
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('Vite middleware not loaded, serving static files:', e);
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    }
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`  Mutalib's Leather Factory - Server & Store Live!`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  API Health: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

startServer();
