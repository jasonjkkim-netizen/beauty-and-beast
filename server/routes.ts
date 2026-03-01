import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, updateProductSchema, insertOrderSchema, updateOrderSchema } from "@shared/schema";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

const SIMULATED_DISCOVERIES = [
  { sourceMall: "Olive Young", name: "Centella Green Level Calming Toner", brand: "PURITO", category: "Toners", image: "/images/products/placeholder.png", description: "A mildly acidic toner with 10% Centella Asiatica extract that gently calms stressed skin while maintaining the skin's natural pH balance.", krwPrice: 18000, volume: "200ml", reviewCount: 12847, rating: 4.7 },
  { sourceMall: "Coupang", name: "Mugwort Essence", brand: "I'm From", category: "Essences", image: "/images/products/placeholder.png", description: "A soothing essence made with 100% Ganghwa mugwort extract, carefully harvested to provide maximum calming benefits for sensitive, irritated skin.", krwPrice: 28000, volume: "160ml", reviewCount: 8934, rating: 4.8 },
  { sourceMall: "Gmarket", name: "Birch Juice Moisturizing Sunscreen SPF50+", brand: "Round Lab", category: "Sunscreens", image: "/images/products/placeholder.png", description: "An ultra-lightweight daily sunscreen formulated with birch tree sap for deep hydration. Leaves no white cast and layers seamlessly under makeup.", krwPrice: 22000, volume: "50ml", reviewCount: 15203, rating: 4.6 },
  { sourceMall: "Olive Young", name: "Propolis + Honey Overnight Mask", brand: "COSRX", category: "Masks", image: "/images/products/placeholder.png", description: "A nourishing overnight mask infused with propolis extract and natural honey to deliver intense moisture and repair while you sleep.", krwPrice: 19500, volume: "60ml", reviewCount: 9876, rating: 4.5 },
  { sourceMall: "Coupang", name: "Black Tea Youth Enhancing Eye Cream", brand: "innisfree", category: "Eye Care", image: "/images/products/placeholder.png", description: "An anti-aging eye cream formulated with fermented black tea from Jeju Island to reduce fine lines, wrinkles, and dark circles around the delicate eye area.", krwPrice: 32000, volume: "30ml", reviewCount: 6543, rating: 4.4 },
  { sourceMall: "Gmarket", name: "Rice Water Bright Foaming Cleanser", brand: "The Face Shop", category: "Cleansers", image: "/images/products/placeholder.png", description: "A gentle foaming cleanser enriched with rice water and moringa oil to effectively remove impurities while brightening and softening skin.", krwPrice: 8900, volume: "150ml", reviewCount: 21345, rating: 4.3 },
  { sourceMall: "Olive Young", name: "Soondy Centella Lip Balm", brand: "Dr. Jart+", category: "Lip Care", image: "/images/products/placeholder.png", description: "A nourishing lip balm with centella asiatica and shea butter that heals chapped lips and provides long-lasting moisture with a subtle tint.", krwPrice: 12000, volume: "15ml", reviewCount: 7821, rating: 4.6 },
  { sourceMall: "Coupang", name: "AHA/BHA/PHA 30 Days Miracle Toner", brand: "Some By Mi", category: "Toners", image: "/images/products/placeholder.png", description: "A triple-acid exfoliating toner with tea tree extract that targets blemishes, uneven texture, and excess sebum for clearer skin in 30 days.", krwPrice: 14000, volume: "150ml", reviewCount: 18765, rating: 4.5 },
  { sourceMall: "Gmarket", name: "Vita C Dark Spot Care Serum", brand: "Goodal", category: "Serums", image: "/images/products/placeholder.png", description: "A potent brightening serum with green tangerine vitamin C extract that targets dark spots, hyperpigmentation, and dull skin for a radiant complexion.", krwPrice: 16500, volume: "30ml", reviewCount: 11234, rating: 4.7 },
  { sourceMall: "Olive Young", name: "Glow Deep Serum", brand: "Beauty of Joseon", category: "Serums", image: "/images/products/placeholder.png", description: "A concentrated serum combining rice bran and arbutin to deliver deep hydration and luminous glow, inspired by traditional Korean beauty secrets.", krwPrice: 15000, volume: "30ml", reviewCount: 13456, rating: 4.8 },
  { sourceMall: "Coupang", name: "Hyaluronic Acid Moisture Cream", brand: "Isntree", category: "Moisturizers", image: "/images/products/placeholder.png", description: "A deeply hydrating cream with 50% hyaluronic acid that locks in moisture for up to 72 hours, ideal for dry and dehydrated skin types.", krwPrice: 23000, volume: "80ml", reviewCount: 9012, rating: 4.6 },
  { sourceMall: "Gmarket", name: "Real Artemisia Calming Intensive Ampoule", brand: "Aestura", category: "Serums", image: "/images/products/placeholder.png", description: "A concentrated ampoule with artemisia extract sourced from Ganghwa Island. Repairs damaged skin barrier and provides immediate relief for redness and irritation.", krwPrice: 25000, volume: "30ml", reviewCount: 7654, rating: 4.7 },
  { sourceMall: "Coupang", name: "Organic Lamb & Brown Rice Dog Food", brand: "Natural Core", category: "Pet Food", image: "/images/products/placeholder.png", description: "USDA-certified organic dry dog food made with free-range New Zealand lamb and Korean brown rice. Developed with Korean veterinary nutritionists for all life stages.", krwPrice: 42000, volume: "2kg", reviewCount: 16420, rating: 4.8 },
  { sourceMall: "Gmarket", name: "Grain-Free Tuna & Cranberry Cat Food", brand: "Iskhan", category: "Pet Food", image: "/images/products/placeholder.png", description: "Premium Korean grain-free cat food with wild-caught tuna and cranberry for urinary health. Over 13,000 five-star reviews from cat owners across Korea.", krwPrice: 36000, volume: "2.5kg", reviewCount: 13200, rating: 4.7 },
  { sourceMall: "Coupang", name: "Freeze-Dried Duck Neck Dog Treats", brand: "Bow Wow", category: "Pet Treats", image: "/images/products/placeholder.png", description: "Single-ingredient freeze-dried duck neck treats rich in glucosamine for joint health. Korea''s top-rated natural dog chew with 18,000+ reviews.", krwPrice: 9500, volume: "200g", reviewCount: 18340, rating: 4.6 },
  { sourceMall: "Olive Young", name: "Tuna Purée Cat Lickable Treats", brand: "Meowday", category: "Pet Treats", image: "/images/products/placeholder.png", description: "Creamy tuna purée treats made with Jeju sea salt and no artificial additives. Korea''s #1 cat treat brand with 22,000+ reviews. Perfect for bonding and hydration.", krwPrice: 6500, volume: "15g x 10", reviewCount: 22150, rating: 4.8 },
  { sourceMall: "Gmarket", name: "Ceramide Coat Repair Dog Shampoo", brand: "Forcans", category: "Pet Grooming", image: "/images/products/placeholder.png", description: "Advanced ceramide formula that repairs damaged coat and strengthens skin barrier. Contains Jeju green tea extract for anti-inflammatory benefits. 14,000+ reviews.", krwPrice: 14000, volume: "500ml", reviewCount: 14230, rating: 4.7 },
  { sourceMall: "Coupang", name: "Silent Automatic Cat Water Fountain", brand: "PetsBe", category: "Pet Accessories", image: "/images/products/placeholder.png", description: "Ultra-quiet Korean-designed water fountain with triple filtration. Encourages cats to drink more with flowing water. USB powered, 2L capacity. 16,000+ reviews.", krwPrice: 25000, volume: "2L", reviewCount: 16780, rating: 4.6 },
  { sourceMall: "Olive Young", name: "Probiotics Digestive Health Powder", brand: "Petoria", category: "Pet Health", image: "/images/products/placeholder.png", description: "Korean veterinary-formulated probiotic powder with 10 billion CFU. Improves digestion, reduces allergies, and boosts immunity in dogs and cats. 11,000+ reviews.", krwPrice: 19000, volume: "60 Sachets", reviewCount: 11450, rating: 4.7 },
  { sourceMall: "Gmarket", name: "LED Safety Night Walk Dog Collar", brand: "ARRR", category: "Pet Accessories", image: "/images/products/placeholder.png", description: "Award-winning Korean-designed rechargeable LED collar with 3 light modes. Waterproof, lightweight, and visible up to 500m. Over 9,000 reviews.", krwPrice: 16000, volume: "Medium", reviewCount: 9870, rating: 4.5 },
];

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Storefront routes (only live products) ---
  app.get("/api/products", async (_req, res) => {
    const allProducts = await storage.getLiveProducts();
    res.json(allProducts);
  });

  app.get("/api/products/featured", async (_req, res) => {
    const allProducts = await storage.getFeaturedProducts();
    const live = allProducts.filter(p => p.status === "live");
    res.json(live);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const allProducts = await storage.getProductsByCategory(req.params.category);
    const live = allProducts.filter(p => p.status === "live");
    res.json(live);
  });

  app.get("/api/products/:slug", async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // --- Admin: All products (including draft) ---
  app.get("/api/admin/products", async (_req, res) => {
    const allProducts = await storage.getProducts();
    res.json(allProducts);
  });

  app.post("/api/admin/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid product data", errors: parsed.error.errors });
    }
    const product = await storage.createProduct(parsed.data);
    res.status(201).json(product);
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid product data", errors: parsed.error.errors });
    }
    const product = await storage.updateProduct(id, parsed.data);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await storage.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  });

  // --- Discovery ---
  app.get("/api/admin/discovery", async (_req, res) => {
    const items = await storage.getDiscoveryProducts();
    res.json(items);
  });

  app.post("/api/admin/discovery/run", async (_req, res) => {
    const candidates = shuffleAndPick(SIMULATED_DISCOVERIES, 4 + Math.floor(Math.random() * 4));
    const withStatus = candidates.map(c => ({
      ...c,
      reviewCount: c.reviewCount + Math.floor(Math.random() * 500 - 250),
      rating: Math.round((c.rating + (Math.random() * 0.2 - 0.1)) * 10) / 10,
      status: "pending",
    }));
    const created = await storage.createDiscoveryProducts(withStatus);
    res.json({ message: `Crawl complete. Found ${created.length} products with high review scores.`, products: created });
  });

  app.post("/api/admin/discovery/:id/approve", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const items = await storage.getDiscoveryProducts();
    const item = items.find(i => i.id === id);
    if (!item) return res.status(404).json({ message: "Discovery item not found" });
    if (item.status !== "pending") return res.status(400).json({ message: "Item already processed" });

    const { marginPercent, shippingHkd } = req.body;
    const margin = marginPercent ?? 35;
    const shipping = shippingHkd ?? 25;

    const krwToHkd = item.krwPrice / 165;
    const costHkd = Math.round(krwToHkd);
    const priceHkd = Math.round(costHkd * (1 + margin / 100) + shipping);
    const originalPriceHkd = Math.round(priceHkd * 1.2);
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await storage.createProduct({
      slug,
      name: item.name,
      brand: item.brand,
      category: item.category,
      description: item.description,
      image: item.image,
      priceHKD: priceHkd,
      originalPriceHKD: originalPriceHkd,
      volume: item.volume,
      tags: ["New Arrival"],
      featured: false,
      inStock: true,
      costKrw: item.krwPrice,
      marginPercent: margin,
      shippingHkd: shipping,
      status: "draft",
      sourceMall: item.sourceMall,
      discoveryId: item.id,
    });

    await storage.updateDiscoveryStatus(id, "approved");
    res.json(product);
  });

  app.post("/api/admin/discovery/:id/reject", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const updated = await storage.updateDiscoveryStatus(id, "rejected");
    if (!updated) return res.status(404).json({ message: "Discovery item not found" });
    res.json(updated);
  });

  // --- Stripe Checkout ---
  app.get("/api/stripe/publishable-key", async (_req, res) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (error: any) {
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "No items provided" });
      }

      for (const item of items) {
        if (!item.productId || !Number.isInteger(item.productId)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }
        const qty = item.quantity || 1;
        if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
          return res.status(400).json({ error: "Invalid quantity" });
        }
      }

      const lineItems = [];
      let subtotal = 0;

      for (const item of items) {
        const product = await storage.getProductById(item.productId);
        if (!product || product.status !== "live") {
          return res.status(400).json({ error: `Product not found: ${item.productId}` });
        }

        lineItems.push({
          price_data: {
            currency: 'hkd',
            product_data: {
              name: `${product.brand} — ${product.name}`,
              description: product.volume,
              images: product.image.startsWith('http') ? [product.image] : [],
            },
            unit_amount: product.priceHKD * 100,
          },
          quantity: item.quantity || 1,
        });

        subtotal += product.priceHKD * (item.quantity || 1);
      }

      const shippingCost = subtotal >= 500 ? 0 : 45;

      const sessionConfig: any = {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
        metadata: {
          items: JSON.stringify(items),
          subtotal: String(subtotal),
          shipping: String(shippingCost),
        },
      };

      if (shippingCost > 0) {
        sessionConfig.shipping_options = [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCost * 100, currency: 'hkd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        }];
      } else {
        sessionConfig.shipping_options = [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'hkd' },
            display_name: 'Free Shipping (orders over HK$500)',
          },
        }];
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // --- Orders ---
  app.get("/api/admin/orders", async (_req, res) => {
    const allOrders = await storage.getOrders();
    res.json(allOrders);
  });

  app.post("/api/admin/orders", async (req, res) => {
    const parsed = insertOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid order data", errors: parsed.error.errors });
    }
    const order = await storage.createOrder(parsed.data);
    res.status(201).json(order);
  });

  app.put("/api/admin/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const parsed = updateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid order data", errors: parsed.error.errors });
    }
    const order = await storage.updateOrder(id, parsed.data);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  app.delete("/api/admin/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await storage.deleteOrder(id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  });

  return httpServer;
}