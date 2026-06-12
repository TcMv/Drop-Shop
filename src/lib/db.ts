import { execFile } from "child_process";
import { promisify } from "util";

const exec = promisify(execFile);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const apiBase = supabaseUrl.replace(/\/$/, "") + "/rest/v1";

/**
 * Supabase client using curl (Node.js native fetch/TLS has fingerprinting
 * issues with Cloudflare in front of Supabase REST API).
 */
export async function supabaseGet<T = any>(
  table: string,
  params: Record<string, string> = {},
  options: { count?: "exact" } = {}
): Promise<{ data: T[] | null; count: number | null; error: any }> {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${apiBase}/${table}${query ? "?" + query : ""}`;

    const { stdout } = await exec("curl", [
      "-s",
      "-H", `apikey: ${anonKey}`,
      url,
    ], { timeout: 15000 });

    const data = JSON.parse(stdout);
    return { data: Array.isArray(data) ? data as T[] : null, count: null, error: null };
  } catch (err: any) {
    return { data: null, count: null, error: { message: err.stderr || err.message || String(err) } };
  }
}

export async function supabasePost<T = any>(
  table: string,
  body: any,
  headers: Record<string, string> = {}
): Promise<{ data: T | null; error: any }> {
  try {
    const payload = JSON.stringify(body);
    const args = [
      "-s",
      "-X", "POST",
      "-H", `apikey: ${anonKey}`,
      "-H", "Content-Type: application/json",
      ...Object.entries(headers).flatMap(([k, v]) => ["-H", `${k}: ${v}`]),
      "-d", payload,
      `${apiBase}/${table}`,
    ];

    const { stdout } = await exec("curl", args, { timeout: 15000 });
    const data = JSON.parse(stdout || "null");
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.stderr || err.message || String(err) } };
  }
}

export async function supabasePatch<T = any>(
  table: string,
  body: any,
  query: string
): Promise<{ data: T | null; error: any }> {
  try {
    const payload = JSON.stringify(body);
    const { stdout } = await exec("curl", [
      "-s",
      "-X", "PATCH",
      "-H", `apikey: ${anonKey}`,
      "-H", "Content-Type: application/json",
      "-H", "Prefer: return=representation",
      "-d", payload,
      `${apiBase}/${table}?${query}`,
    ], { timeout: 15000 });

    const data = JSON.parse(stdout || "null");
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.stderr || err.message || String(err) } };
  }
}

// ── Specific DB functions ──

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  cost: number;
  images: string[];
  category: string;
  tags: string[];
  supplier: string;
  supplierUrl: string;
  stock: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  items: { productId: string; title: string; price: number; quantity: number }[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  status: "pending" | "placed_with_supplier" | "shipped" | "delivered" | "cancelled";
  supplierOrderRef?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  status: "success" | "error" | "info";
  metadata?: Record<string, unknown>;
}

function rowToProduct(r: any): Product {
  return {
    id: r.id, title: r.title, slug: r.slug, description: r.description,
    price: r.price, cost: r.cost,
    images: typeof r.images === "string" ? JSON.parse(r.images) : r.images || [],
    category: r.category,
    tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
    supplier: r.supplier, supplierUrl: r.supplier_url || "",
    stock: r.stock, status: r.status,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function rowToOrder(r: any): Order {
  return {
    id: r.id,
    items: typeof r.items === "string" ? JSON.parse(r.items) : r.items || [],
    total: r.total,
    customerName: r.customer_name || "", customerEmail: r.customer_email || "",
    customerPhone: r.customer_phone || "",
    shippingAddress: typeof r.shipping_address === "string" ? JSON.parse(r.shipping_address) : r.shipping_address || {},
    status: r.status,
    supplierOrderRef: r.supplier_order_ref, trackingUrl: r.tracking_url, notes: r.notes,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export async function getProducts(status?: string): Promise<Product[]> {
  const params: Record<string, string> = { select: "*", order: "created_at.desc" };
  if (status) params.status = `eq.${status}`;
  const { data, error } = await supabaseGet("products", params);
  if (error) throw new Error(`getProducts: ${error.message}`);
  return (data || []).map(rowToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabaseGet("products", { id: `eq.${id}`, select: "*" });
  if (error) throw new Error(`getProduct: ${error.message}`);
  return data && data.length > 0 ? rowToProduct(data[0]) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseGet("products", { slug: `eq.${slug}`, select: "*" });
  if (error) throw new Error(`getProductBySlug: ${error.message}`);
  return data && data.length > 0 ? rowToProduct(data[0]) : null;
}

export async function createProduct(product: Product): Promise<void> {
  const { error } = await supabasePost("products", {
    id: product.id, title: product.title, slug: product.slug,
    description: product.description, price: product.price, cost: product.cost,
    images: JSON.stringify(product.images), category: product.category,
    tags: JSON.stringify(product.tags), supplier: product.supplier,
    supplier_url: product.supplierUrl, stock: product.stock, status: product.status,
    created_at: product.createdAt, updated_at: product.updatedAt,
  });
  if (error) throw new Error(`createProduct: ${error.message}`);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const body: any = {};
  if (updates.title !== undefined) body.title = updates.title;
  if (updates.description !== undefined) body.description = updates.description;
  if (updates.price !== undefined) body.price = updates.price;
  if (updates.status !== undefined) body.status = updates.status;
  if (updates.images !== undefined) body.images = JSON.stringify(updates.images);
  if (updates.stock !== undefined) body.stock = updates.stock;
  body.updated_at = new Date().toISOString();

  const { error } = await supabasePatch("products", body, `id=eq.${id}`);
  if (error) throw new Error(`updateProduct: ${error.message}`);
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseGet("orders", { select: "*", order: "created_at.desc" });
  if (error) throw new Error(`getOrders: ${error.message}`);
  return (data || []).map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabaseGet("orders", { id: `eq.${id}`, select: "*" });
  if (error) throw new Error(`getOrder: ${error.message}`);
  return data && data.length > 0 ? rowToOrder(data[0]) : null;
}

export async function createOrder(order: Order): Promise<void> {
  const { error } = await supabasePost("orders", {
    id: order.id, items: JSON.stringify(order.items), total: order.total,
    customer_name: order.customerName, customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    shipping_address: JSON.stringify(order.shippingAddress),
    status: order.status, created_at: order.createdAt, updated_at: order.updatedAt,
  });
  if (error) throw new Error(`createOrder: ${error.message}`);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<void> {
  const body: any = {};
  if (updates.status !== undefined) body.status = updates.status;
  if (updates.supplierOrderRef !== undefined) body.supplier_order_ref = updates.supplierOrderRef;
  if (updates.trackingUrl !== undefined) body.tracking_url = updates.trackingUrl;
  if (updates.notes !== undefined) body.notes = updates.notes;
  body.updated_at = new Date().toISOString();

  const { error } = await supabasePatch("orders", body, `id=eq.${id}`);
  if (error) throw new Error(`updateOrder: ${error.message}`);
}

export async function getAuditLog(limit = 100, offset = 0): Promise<{ entries: AuditEntry[]; total: number }> {
  const { data, error } = await supabaseGet("audit_log", {
    select: "*", order: "timestamp.desc", limit: String(limit), offset: String(offset),
  });
  if (error) throw new Error(`getAuditLog: ${error.message}`);
  const entries = (data || []).map((r: any) => ({
    id: r.id, timestamp: r.timestamp, agent: r.agent, action: r.action,
    details: r.details, status: r.status,
    metadata: typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata,
  }));
  return { entries, total: entries.length };
}

export async function addAuditEntry(entry: AuditEntry): Promise<void> {
  const { error } = await supabasePost("audit_log", {
    id: entry.id, timestamp: entry.timestamp, agent: entry.agent,
    action: entry.action, details: entry.details, status: entry.status,
    metadata: JSON.stringify(entry.metadata || {}),
  });
  if (error) throw new Error(`addAuditEntry: ${error.message}`);
}

export async function getSuppliers(): Promise<any[]> {
  const { data, error } = await supabaseGet("suppliers", { select: "*" });
  if (error) throw new Error(`getSuppliers: ${error.message}`);
  return data || [];
}

export async function getSetting(key: string): Promise<string | undefined> {
  const { data, error } = await supabaseGet("settings", { key: `eq.${key}`, select: "value" });
  if (error) throw new Error(`getSetting: ${error.message}`);
  return data && data.length > 0 ? data[0].value : undefined;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { error } = await supabasePost("settings", { key, value });
  if (error) throw new Error(`setSetting: ${error.message}`);
}
