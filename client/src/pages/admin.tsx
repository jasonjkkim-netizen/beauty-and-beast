import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  priceHKD: number;
  originalPriceHKD: number;
  volume: string;
  tags: string[];
  featured: boolean | null;
  inStock: boolean | null;
  costKrw: number | null;
  marginPercent: number | null;
  shippingHkd: number | null;
  status: string | null;
  sourceMall: string | null;
  discoveryId: number | null;
};

type DiscoveryProduct = {
  id: number;
  sourceMall: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  krwPrice: number;
  volume: string;
  reviewCount: number;
  rating: number;
  status: string | null;
  createdAt: string | null;
};

type Order = {
  id: number;
  orderNumber: string;
  channel: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  items: string;
  subtotalHkd: number;
  shippingHkd: number | null;
  totalHkd: number;
  paymentMethod: string | null;
  status: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminHeader() {
  return (
    <div className="border-b bg-black text-white px-6 py-4 flex items-center justify-between print:hidden" data-testid="admin-header">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Beauty & Beast Admin</h1>
        <p className="text-xs text-gray-400 mt-0.5">Product & Discovery Management</p>
      </div>
      <a href="/" className="text-xs text-gray-400 hover:text-white transition-colors" data-testid="link-storefront">
        View Storefront →
      </a>
    </div>
  );
}

function ProductForm({ product, onSave, onClose }: { product?: Product; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "Toners",
    description: product?.description || "",
    image: product?.image || "/images/products/placeholder.png",
    volume: product?.volume || "",
    costKrw: product?.costKrw || 0,
    marginPercent: product?.marginPercent || 35,
    shippingHkd: product?.shippingHkd || 25,
    tags: product?.tags?.join(", ") || "",
    featured: product?.featured || false,
    inStock: product?.inStock ?? true,
    status: product?.status || "draft",
  });

  const computedCostHkd = Math.round(form.costKrw / 165);
  const computedPrice = Math.round(computedCostHkd * (1 + form.marginPercent / 100) + form.shippingHkd);
  const computedOriginal = Math.round(computedPrice * 1.2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    onSave({
      slug: product?.slug || slugify(form.name),
      name: form.name,
      brand: form.brand,
      category: form.category,
      description: form.description,
      image: form.image,
      volume: form.volume,
      priceHKD: computedPrice,
      originalPriceHKD: computedOriginal,
      costKrw: form.costKrw,
      marginPercent: form.marginPercent,
      shippingHkd: form.shippingHkd,
      tags,
      featured: form.featured,
      inStock: form.inStock,
      status: form.status,
    });
  }

  const categories = ["Toners", "Essences", "Serums", "Sunscreens", "Cleansers", "Moisturizers", "Masks", "Eye Care", "Lip Care", "Pet Food", "Pet Treats", "Pet Grooming", "Pet Health", "Pet Accessories"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Product Name</label>
          <Input data-testid="input-product-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Brand</label>
          <Input data-testid="input-brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
          <select
            data-testid="select-category"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Volume</label>
          <Input data-testid="input-volume" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} placeholder="e.g. 200ml" required />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
        <textarea
          data-testid="input-description"
          className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Image URL</label>
        <Input data-testid="input-image" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold mb-3">Pricing & Margins</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Cost (KRW)</label>
            <Input data-testid="input-cost-krw" type="number" value={form.costKrw} onChange={e => setForm({ ...form, costKrw: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Margin %</label>
            <Input data-testid="input-margin" type="number" value={form.marginPercent} onChange={e => setForm({ ...form, marginPercent: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Shipping (HKD)</label>
            <Input data-testid="input-shipping" type="number" value={form.shippingHkd} onChange={e => setForm({ ...form, shippingHkd: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
          <div className="flex justify-between"><span>Cost (HKD):</span><span className="font-mono">${computedCostHkd}</span></div>
          <div className="flex justify-between"><span>+ Margin ({form.marginPercent}%):</span><span className="font-mono">${Math.round(computedCostHkd * form.marginPercent / 100)}</span></div>
          <div className="flex justify-between"><span>+ Shipping:</span><span className="font-mono">${form.shippingHkd}</span></div>
          <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Selling Price:</span><span className="font-mono text-green-700">HK${computedPrice}</span></div>
          <div className="flex justify-between text-gray-500"><span>Original Price (display):</span><span className="font-mono">HK${computedOriginal}</span></div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Tags (comma separated)</label>
            <Input data-testid="input-tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Best Seller, Hydrating" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
            <select
              data-testid="select-status"
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="live">Live</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6 mt-3">
          <label className="flex items-center gap-2 text-sm">
            <Switch data-testid="switch-featured" checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch data-testid="switch-instock" checked={form.inStock} onCheckedChange={v => setForm({ ...form, inStock: v })} />
            In Stock
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">Cancel</Button>
        <Button type="submit" data-testid="button-save-product">{product ? "Update Product" : "Add Product"}</Button>
      </div>
    </form>
  );
}

function ProductsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }); toast({ title: "Product updated" }); setEditProduct(null); },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }); toast({ title: "Product created" }); setShowAdd(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }); toast({ title: "Product deleted" }); },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error("Failed to toggle");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }); },
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;

  const liveProducts = products.filter(p => p.status === "live");
  const draftProducts = products.filter(p => p.status !== "live");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-products-title">Products ({products.length})</h2>
          <p className="text-sm text-gray-500">{liveProducts.length} live, {draftProducts.length} draft</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-product">+ Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
            <ProductForm onSave={data => createMutation.mutate(data)} onClose={() => setShowAdd(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="table-products">
          <thead>
            <tr className="border-b text-left text-xs text-gray-500 uppercase">
              <th className="pb-2 pr-4">Product</th>
              <th className="pb-2 pr-4">Brand</th>
              <th className="pb-2 pr-4">Category</th>
              <th className="pb-2 pr-4">Cost (KRW)</th>
              <th className="pb-2 pr-4">Margin</th>
              <th className="pb-2 pr-4">Price (HKD)</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50" data-testid={`row-product-${product.id}`}>
                <td className="py-3 pr-4">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-400">{product.volume}</div>
                </td>
                <td className="py-3 pr-4">{product.brand}</td>
                <td className="py-3 pr-4">{product.category}</td>
                <td className="py-3 pr-4 font-mono text-xs">₩{(product.costKrw || 0).toLocaleString()}</td>
                <td className="py-3 pr-4 font-mono text-xs">{product.marginPercent || 0}%</td>
                <td className="py-3 pr-4">
                  <span className="font-mono font-semibold">HK${product.priceHKD}</span>
                  <span className="text-xs text-gray-400 line-through ml-1">HK${product.originalPriceHKD}</span>
                </td>
                <td className="py-3 pr-4">
                  <button
                    data-testid={`button-toggle-status-${product.id}`}
                    onClick={() => toggleStatusMutation.mutate({ id: product.id, status: product.status === "live" ? "draft" : "live" })}
                  >
                    <Badge variant={product.status === "live" ? "default" : "secondary"} className={product.status === "live" ? "bg-green-600 hover:bg-green-700" : ""}>
                      {product.status || "draft"}
                    </Badge>
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <Dialog open={editProduct?.id === product.id} onOpenChange={open => { if (!open) setEditProduct(null); }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditProduct(product)} data-testid={`button-edit-${product.id}`}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                        <ProductForm product={editProduct!} onSave={data => updateMutation.mutate({ id: product.id, data })} onClose={() => setEditProduct(null)} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => { if (confirm("Remove this product from the store?")) deleteMutation.mutate(product.id); }}
                      data-testid={`button-delete-${product.id}`}
                    >
                      Drop
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PriceListTab() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading price list...</div>;

  const beautyProducts = products.filter(p => !p.category.startsWith("Pet"));
  const petProducts = products.filter(p => p.category.startsWith("Pet"));

  const avgMargin = products.length > 0 ? (products.reduce((sum, p) => sum + (p.marginPercent || 0), 0) / products.length).toFixed(1) : "0";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-pricelist-title">Price List</h2>
          <p className="text-sm text-gray-500 print:text-gray-600">{products.length} products | Avg margin: {avgMargin}%</p>
        </div>
        <Button onClick={() => window.print()} className="print:hidden" data-testid="button-print-pricelist">
          Print Price List
        </Button>
      </div>

      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold">Beauty & Beast</h1>
        <p className="text-sm text-gray-600">Complete Price List — {new Date().toLocaleDateString("en-HK", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {beautyProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide border-b pb-2">K-Beauty ({beautyProducts.length})</h3>
          <table className="w-full text-sm" data-testid="table-pricelist-beauty">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase">
                <th className="pb-2 pr-3">#</th>
                <th className="pb-2 pr-3">Product</th>
                <th className="pb-2 pr-3">Brand</th>
                <th className="pb-2 pr-3">Category</th>
                <th className="pb-2 pr-3">Vol.</th>
                <th className="pb-2 pr-3">Cost KRW</th>
                <th className="pb-2 pr-3">Cost HKD</th>
                <th className="pb-2 pr-3">Margin</th>
                <th className="pb-2 pr-3">Ship</th>
                <th className="pb-2 pr-3">Sell Price</th>
                <th className="pb-2 pr-3">RRP</th>
                <th className="pb-2">Saving</th>
              </tr>
            </thead>
            <tbody>
              {beautyProducts.map((p, i) => {
                const costHkd = Math.round((p.costKrw || 0) / 165);
                const saving = p.originalPriceHKD > 0 ? Math.round((1 - p.priceHKD / p.originalPriceHKD) * 100) : 0;
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50 print:hover:bg-transparent" data-testid={`row-price-${p.id}`}>
                    <td className="py-2 pr-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-2 pr-3 font-medium">{p.name}</td>
                    <td className="py-2 pr-3">{p.brand}</td>
                    <td className="py-2 pr-3 text-xs">{p.category}</td>
                    <td className="py-2 pr-3 text-xs">{p.volume}</td>
                    <td className="py-2 pr-3 font-mono text-xs">₩{(p.costKrw || 0).toLocaleString()}</td>
                    <td className="py-2 pr-3 font-mono text-xs">${costHkd}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{p.marginPercent || 0}%</td>
                    <td className="py-2 pr-3 font-mono text-xs">${p.shippingHkd || 0}</td>
                    <td className="py-2 pr-3 font-mono font-semibold">HK${p.priceHKD}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-gray-400 line-through">HK${p.originalPriceHKD}</td>
                    <td className="py-2 font-mono text-xs text-green-700">{saving}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {petProducts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide border-b pb-2">Pet Products ({petProducts.length})</h3>
          <table className="w-full text-sm" data-testid="table-pricelist-pet">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase">
                <th className="pb-2 pr-3">#</th>
                <th className="pb-2 pr-3">Product</th>
                <th className="pb-2 pr-3">Brand</th>
                <th className="pb-2 pr-3">Category</th>
                <th className="pb-2 pr-3">Vol.</th>
                <th className="pb-2 pr-3">Cost KRW</th>
                <th className="pb-2 pr-3">Cost HKD</th>
                <th className="pb-2 pr-3">Margin</th>
                <th className="pb-2 pr-3">Ship</th>
                <th className="pb-2 pr-3">Sell Price</th>
                <th className="pb-2 pr-3">RRP</th>
                <th className="pb-2">Saving</th>
              </tr>
            </thead>
            <tbody>
              {petProducts.map((p, i) => {
                const costHkd = Math.round((p.costKrw || 0) / 165);
                const saving = p.originalPriceHKD > 0 ? Math.round((1 - p.priceHKD / p.originalPriceHKD) * 100) : 0;
                return (
                  <tr key={p.id} className="border-b hover:bg-gray-50 print:hover:bg-transparent" data-testid={`row-price-${p.id}`}>
                    <td className="py-2 pr-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-2 pr-3 font-medium">{p.name}</td>
                    <td className="py-2 pr-3">{p.brand}</td>
                    <td className="py-2 pr-3 text-xs">{p.category}</td>
                    <td className="py-2 pr-3 text-xs">{p.volume}</td>
                    <td className="py-2 pr-3 font-mono text-xs">₩{(p.costKrw || 0).toLocaleString()}</td>
                    <td className="py-2 pr-3 font-mono text-xs">${costHkd}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{p.marginPercent || 0}%</td>
                    <td className="py-2 pr-3 font-mono text-xs">${p.shippingHkd || 0}</td>
                    <td className="py-2 pr-3 font-mono font-semibold">HK${p.priceHKD}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-gray-400 line-through">HK${p.originalPriceHKD}</td>
                    <td className="py-2 font-mono text-xs text-green-700">{saving}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t pt-4 print:mt-8">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded print:border">
            <div className="text-2xl font-bold" data-testid="text-total-products">{products.length}</div>
            <div className="text-xs text-gray-500">Total Products</div>
          </div>
          <div className="p-3 bg-gray-50 rounded print:border">
            <div className="text-2xl font-bold" data-testid="text-avg-margin">{avgMargin}%</div>
            <div className="text-xs text-gray-500">Avg Margin</div>
          </div>
          <div className="p-3 bg-gray-50 rounded print:border">
            <div className="text-2xl font-bold" data-testid="text-beauty-count">{beautyProducts.length}</div>
            <div className="text-xs text-gray-500">Beauty Items</div>
          </div>
          <div className="p-3 bg-gray-50 rounded print:border">
            <div className="text-2xl font-bold" data-testid="text-pet-count">{petProducts.length}</div>
            <div className="text-xs text-gray-500">Pet Items</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderForm({ order, products, onSave, onClose }: { order?: Order; products: Product[]; onSave: (data: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    channel: order?.channel || "online",
    customerName: order?.customerName || "",
    customerPhone: order?.customerPhone || "",
    customerEmail: order?.customerEmail || "",
    paymentMethod: order?.paymentMethod || "",
    status: order?.status || "pending",
    notes: order?.notes || "",
  });

  let existingItems: { productId: number; qty: number; price: number; name: string }[] = [];
  if (order) {
    try { existingItems = JSON.parse(order.items); } catch { existingItems = []; }
  }
  const [orderItems, setOrderItems] = useState<{ productId: number; qty: number; price: number; name: string }[]>(
    existingItems.length > 0 ? existingItems : []
  );

  function addItem(productId: number) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = orderItems.find(i => i.productId === productId);
    if (existing) {
      setOrderItems(orderItems.map(i => i.productId === productId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setOrderItems([...orderItems, { productId, qty: 1, price: product.priceHKD, name: product.name }]);
    }
  }

  function removeItem(productId: number) {
    setOrderItems(orderItems.filter(i => i.productId !== productId));
  }

  function updateQty(productId: number, qty: number) {
    if (qty <= 0) return removeItem(productId);
    setOrderItems(orderItems.map(i => i.productId === productId ? { ...i, qty } : i));
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderShipping = form.channel === "offline" ? 0 : (subtotal >= 500 ? 0 : 45);
  const total = subtotal + orderShipping;

  function generateOrderNumber() {
    const prefix = form.channel === "online" ? "ON" : "OF";
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}-${date}-${rand}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (orderItems.length === 0) return;
    onSave({
      orderNumber: order?.orderNumber || generateOrderNumber(),
      channel: form.channel,
      customerName: form.customerName,
      customerPhone: form.customerPhone || null,
      customerEmail: form.customerEmail || null,
      items: JSON.stringify(orderItems),
      subtotalHkd: subtotal,
      shippingHkd: orderShipping,
      totalHkd: total,
      paymentMethod: form.paymentMethod || null,
      status: form.status,
      notes: form.notes || null,
    });
  }

  const paymentMethods = ["Alipay HK", "WeChat Pay", "Octopus", "EPS", "Visa", "Mastercard", "Cash", "Bank Transfer", "PayMe", "FPS"];
  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Channel</label>
          <select
            data-testid="select-order-channel"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.channel}
            onChange={e => setForm({ ...form, channel: e.target.value })}
          >
            <option value="online">Online</option>
            <option value="offline">Offline (In-Person)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
          <select
            data-testid="select-order-status"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Customer Name</label>
          <Input data-testid="input-customer-name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Payment Method</label>
          <select
            data-testid="select-payment-method"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.paymentMethod}
            onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
          >
            <option value="">Select...</option>
            {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Phone</label>
          <Input data-testid="input-customer-phone" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+852" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
          <Input data-testid="input-customer-email" type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold mb-3">Order Items</h3>
        <div className="mb-3">
          <select
            data-testid="select-add-product"
            className="w-full border rounded px-3 py-2 text-sm"
            value=""
            onChange={e => { if (e.target.value) addItem(parseInt(e.target.value)); e.target.value = ""; }}
          >
            <option value="">+ Add product...</option>
            {products.filter(p => p.status === "live").map(p => (
              <option key={p.id} value={p.id}>{p.brand} — {p.name} (HK${p.priceHKD})</option>
            ))}
          </select>
        </div>

        {orderItems.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No items added yet</p>
        )}

        {orderItems.map(item => (
          <div key={item.productId} className="flex items-center justify-between border-b py-2" data-testid={`order-item-${item.productId}`}>
            <div className="flex-1">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-gray-400 ml-2">HK${item.price} each</span>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => updateQty(item.productId, item.qty - 1)}>-</Button>
              <span className="text-sm font-mono w-6 text-center">{item.qty}</span>
              <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => updateQty(item.productId, item.qty + 1)}>+</Button>
              <span className="text-sm font-mono font-semibold w-16 text-right">HK${item.price * item.qty}</span>
              <Button type="button" variant="outline" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeItem(item.productId)}>×</Button>
            </div>
          </div>
        ))}

        {orderItems.length > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
            <div className="flex justify-between"><span>Subtotal:</span><span className="font-mono">HK${subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span className="font-mono">{orderShipping === 0 ? "FREE" : `HK$${orderShipping}`}</span></div>
            <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total:</span><span className="font-mono text-green-700">HK${total}</span></div>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Notes</label>
        <textarea
          data-testid="input-order-notes"
          className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Delivery instructions, special requests..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-order">Cancel</Button>
        <Button type="submit" disabled={orderItems.length === 0} data-testid="button-save-order">{order ? "Update Order" : "Create Order"}</Button>
      </div>
    </form>
  );
}

function OrdersTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const { data: allOrders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] }); toast({ title: "Order created" }); setShowAdd(false); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] }); toast({ title: "Order updated" }); setEditOrder(null); },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] }); toast({ title: "Order deleted" }); },
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  const orders = filter === "all" ? allOrders : allOrders.filter(o => {
    if (filter === "online" || filter === "offline") return o.channel === filter;
    return o.status === filter;
  });

  const totalRevenue = allOrders.filter(o => o.status !== "cancelled" && o.status !== "refunded").reduce((sum, o) => sum + o.totalHkd, 0);
  const onlineOrders = allOrders.filter(o => o.channel === "online").length;
  const offlineOrders = allOrders.filter(o => o.channel === "offline").length;

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-orders-title">Orders ({allOrders.length})</h2>
          <p className="text-sm text-gray-500">{onlineOrders} online, {offlineOrders} offline | Revenue: HK${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <select
            data-testid="select-order-filter"
            className="border rounded px-3 py-2 text-sm"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-order">+ New Order</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Create New Order</DialogTitle></DialogHeader>
              <OrderForm products={products} onSave={data => createMutation.mutate(data)} onClose={() => setShowAdd(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No orders yet</p>
          <p className="text-sm">Click "+ New Order" to create an online or offline order.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-orders">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500 uppercase">
                <th className="pb-2 pr-4">Order #</th>
                <th className="pb-2 pr-4">Channel</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Items</th>
                <th className="pb-2 pr-4">Total</th>
                <th className="pb-2 pr-4">Payment</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                let items: { name: string; qty: number; price: number }[] = [];
                try { items = JSON.parse(order.items); } catch { items = []; }
                const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50" data-testid={`row-order-${order.id}`}>
                    <td className="py-3 pr-4 font-mono text-xs font-semibold">{order.orderNumber}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className={order.channel === "online" ? "border-blue-300 text-blue-700" : "border-orange-300 text-orange-700"}>
                        {order.channel}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium">{order.customerName}</div>
                      {order.customerPhone && <div className="text-xs text-gray-400">{order.customerPhone}</div>}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-xs">
                        {items.slice(0, 2).map((item, i) => (
                          <div key={i}>{item.qty}x {item.name}</div>
                        ))}
                        {items.length > 2 && <div className="text-gray-400">+{items.length - 2} more</div>}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono font-semibold">HK${order.totalHkd}</td>
                    <td className="py-3 pr-4 text-xs">{order.paymentMethod || "—"}</td>
                    <td className="py-3 pr-4">
                      <select
                        data-testid={`select-status-${order.id}`}
                        className={`text-xs px-2 py-1 rounded border-0 font-medium ${statusColor[order.status || "pending"] || ""}`}
                        value={order.status || "pending"}
                        onChange={e => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-HK", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Dialog open={editOrder?.id === order.id} onOpenChange={open => { if (!open) setEditOrder(null); }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditOrder(order)} data-testid={`button-edit-order-${order.id}`}>Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader><DialogTitle>Edit Order {order.orderNumber}</DialogTitle></DialogHeader>
                            <OrderForm order={editOrder!} products={products} onSave={data => updateMutation.mutate({ id: order.id, data })} onClose={() => setEditOrder(null)} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => { if (confirm("Delete this order?")) deleteMutation.mutate(order.id); }}
                          data-testid={`button-delete-order-${order.id}`}
                        >
                          Del
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {allOrders.length > 0 && (
        <div className="border-t pt-4 mt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold" data-testid="text-total-orders">{allOrders.length}</div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-700" data-testid="text-total-revenue">HK${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-700">{onlineOrders}</div>
              <div className="text-xs text-gray-500">Online</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-orange-700">{offlineOrders}</div>
              <div className="text-xs text-gray-500">Offline</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DiscoveryTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [approveId, setApproveId] = useState<number | null>(null);
  const [margin, setMargin] = useState(35);
  const [shipping, setShipping] = useState(25);

  const { data: discoveries = [], isLoading } = useQuery<DiscoveryProduct[]>({
    queryKey: ["/api/admin/discovery"],
  });

  const runCrawlMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/discovery/run", { method: "POST" });
      if (!res.ok) throw new Error("Failed to run crawl");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/discovery"] });
      toast({ title: "Crawl Complete", description: data.message });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, marginPercent, shippingHkd }: { id: number; marginPercent: number; shippingHkd: number }) => {
      const res = await fetch(`/api/admin/discovery/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marginPercent, shippingHkd }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/discovery"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product approved and added to store (as Draft)" });
      setApproveId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/discovery/${id}/reject`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reject");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/discovery"] });
      toast({ title: "Product rejected" });
    },
  });

  const pending = discoveries.filter(d => d.status === "pending");
  const processed = discoveries.filter(d => d.status !== "pending");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-discovery-title">Product Discovery</h2>
          <p className="text-sm text-gray-500">Crawl Korean malls for high-review products</p>
        </div>
        <Button onClick={() => runCrawlMutation.mutate()} disabled={runCrawlMutation.isPending} data-testid="button-run-crawl">
          {runCrawlMutation.isPending ? "Scanning..." : "Run Discovery Crawl"}
        </Button>
      </div>

      {pending.length === 0 && processed.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No discoveries yet</p>
          <p className="text-sm">Click "Run Discovery Crawl" to scan Korean malls for trending K-Beauty products with high review counts.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Pending Review ({pending.length})</h3>
          <div className="grid gap-3">
            {pending.map(item => {
              const estimatedHkd = Math.round(item.krwPrice / 165);
              const isApproving = approveId === item.id;

              return (
                <div key={item.id} className="border rounded p-4 hover:shadow-sm transition-shadow" data-testid={`card-discovery-${item.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{item.name}</span>
                        <Badge variant="outline" className="text-xs">{item.sourceMall}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{item.brand} · {item.category} · {item.volume}</p>
                      <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="font-mono">₩{item.krwPrice.toLocaleString()} <span className="text-gray-400">(~HK${estimatedHkd})</span></span>
                        <span>⭐ {item.rating}</span>
                        <span>{item.reviewCount.toLocaleString()} reviews</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!isApproving ? (
                        <>
                          <Button size="sm" onClick={() => { setApproveId(item.id); setMargin(35); setShipping(25); }} data-testid={`button-approve-${item.id}`}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => rejectMutation.mutate(item.id)} data-testid={`button-reject-${item.id}`}>
                            Reject
                          </Button>
                        </>
                      ) : (
                        <div className="border rounded p-3 bg-gray-50 min-w-[200px]">
                          <p className="text-xs font-semibold mb-2">Set margin & shipping</p>
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs text-gray-500">Margin %</label>
                              <Input data-testid="input-approve-margin" type="number" value={margin} onChange={e => setMargin(parseFloat(e.target.value) || 0)} className="h-8" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Shipping HKD</label>
                              <Input data-testid="input-approve-shipping" type="number" value={shipping} onChange={e => setShipping(parseInt(e.target.value) || 0)} className="h-8" />
                            </div>
                            <p className="text-xs font-mono text-green-700">
                              Sell at: HK${Math.round(estimatedHkd * (1 + margin / 100) + shipping)}
                            </p>
                            <div className="flex gap-1">
                              <Button size="sm" className="flex-1 h-7 text-xs" onClick={() => approveMutation.mutate({ id: item.id, marginPercent: margin, shippingHkd: shipping })} data-testid="button-confirm-approve">
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setApproveId(null)} data-testid="button-cancel-approve">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {processed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Processed ({processed.length})</h3>
          <div className="grid gap-2">
            {processed.map(item => (
              <div key={item.id} className="border rounded p-3 opacity-60" data-testid={`card-processed-${item.id}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.brand} · {item.sourceMall}</span>
                  </div>
                  <Badge variant={item.status === "approved" ? "default" : "secondary"} className={item.status === "approved" ? "bg-green-600" : "bg-red-100 text-red-600"}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-6xl mx-auto p-6 print:p-2 print:max-w-full">
        <Tabs defaultValue="products">
          <TabsList className="mb-6 print:hidden" data-testid="admin-tabs">
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="pricelist" data-testid="tab-pricelist">Price List</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="discovery" data-testid="tab-discovery">Discovery</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="pricelist">
            <PriceListTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="discovery">
            <DiscoveryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}