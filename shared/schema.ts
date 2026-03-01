import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  priceHKD: integer("price_hkd").notNull(),
  originalPriceHKD: integer("original_price_hkd").notNull(),
  volume: text("volume").notNull(),
  tags: text("tags").array().notNull(),
  featured: boolean("featured").default(false),
  inStock: boolean("in_stock").default(true),
  costKrw: integer("cost_krw").default(0),
  marginPercent: real("margin_percent").default(15),
  shippingHkd: integer("shipping_hkd").default(0),
  status: text("status").default("live"),
  sourceMall: text("source_mall"),
  discoveryId: integer("discovery_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});
export const updateProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Product = typeof products.$inferSelect;

export const discoveryProducts = pgTable("discovery_products", {
  id: serial("id").primaryKey(),
  sourceMall: text("source_mall").notNull(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  krwPrice: integer("krw_price").notNull(),
  volume: text("volume").notNull(),
  reviewCount: integer("review_count").notNull(),
  rating: real("rating").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDiscoverySchema = createInsertSchema(discoveryProducts).omit({
  id: true,
  createdAt: true,
});

export type InsertDiscovery = z.infer<typeof insertDiscoverySchema>;
export type DiscoveryProduct = typeof discoveryProducts.$inferSelect;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  channel: text("channel").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  items: text("items").notNull(),
  subtotalHkd: integer("subtotal_hkd").notNull(),
  shippingHkd: integer("shipping_hkd").default(0),
  totalHkd: integer("total_hkd").notNull(),
  paymentMethod: text("payment_method"),
  status: text("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;