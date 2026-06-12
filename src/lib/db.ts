import { createClient } from '@supabase/supabase-js';
import type { Product, Order, AuditEntry, Supplier } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for server-side operations (bypasses RLS)
const sb = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

// ── Helpers to map between DB snake_case and TS camelCase ──

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    price: row.price,
    cost: row.cost,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
    category: row.category,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    supplier: row.supplier,
    supplierUrl: row.supplier_url || '',
    stock: row.stock,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function productToDb(p: Partial<Product>): any {
  const db: any = {};
  if (p.id !== undefined) db.id = p.id;
  if (p.title !== undefined) db.title = p.title;
  if (p.slug !== undefined) db.slug = p.slug;
  if (p.description !== undefined) db.description = p.description;
  if (p.price !== undefined) db.price = p.price;
  if (p.cost !== undefined) db.cost = p.cost;
  if (p.images !== undefined) db.images = JSON.stringify(p.images);
  if (p.category !== undefined) db.category = p.category;
  if (p.tags !== undefined) db.tags = JSON.stringify(p.tags);
  if (p.supplier !== undefined) db.supplier = p.supplier;
  if (p.supplierUrl !== undefined) db.supplier_url = p.supplierUrl;
  if (p.stock !== undefined) db.stock = p.stock;
  if (p.status !== undefined) db.status = p.status;
  return db;
}

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    total: row.total,
    customerName: row.customer_name || '',
    customerEmail: row.customer_email || '',
    customerPhone: row.customer_phone || '',
    shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address,
    status: row.status,
    supplierOrderRef: row.supplier_order_ref,
    trackingUrl: row.tracking_url,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function orderToDb(p: Partial<Order>): any {
  const db: any = {};
  if (p.id !== undefined) db.id = p.id;
  if (p.items !== undefined) db.items = JSON.stringify(p.items);
  if (p.total !== undefined) db.total = p.total;
  if (p.customerName !== undefined) db.customer_name = p.customerName;
  if (p.customerEmail !== undefined) db.customer_email = p.customerEmail;
  if (p.customerPhone !== undefined) db.customer_phone = p.customerPhone;
  if (p.shippingAddress !== undefined) db.shipping_address = JSON.stringify(p.shippingAddress);
  if (p.status !== undefined) db.status = p.status;
  if (p.supplierOrderRef !== undefined) db.supplier_order_ref = p.supplierOrderRef;
  if (p.trackingUrl !== undefined) db.tracking_url = p.trackingUrl;
  if (p.notes !== undefined) db.notes = p.notes;
  return db;
}

function rowToAudit(row: any): AuditEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    agent: row.agent,
    action: row.action,
    details: row.details,
    status: row.status,
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
  };
}

// ── Product Functions ──

export async function getProducts(status?: string): Promise<Product[]> {
  let query = sb.from('products').select('*').order('created_at', { ascending: false });
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw new Error(`getProducts: ${error.message}`);
  return (data || []).map(rowToProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await sb.from('products').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(`getProduct: ${error.message}`);
  }
  return rowToProduct(data);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await sb.from('products').select('*').eq('slug', slug).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getProductBySlug: ${error.message}`);
  }
  return rowToProduct(data);
}

export async function createProduct(product: Product): Promise<void> {
  const { error } = await sb.from('products').insert(productToDb(product));
  if (error) throw new Error(`createProduct: ${error.message}`);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const { error } = await sb.from('products').update(productToDb(updates)).eq('id', id);
  if (error) throw new Error(`updateProduct: ${error.message}`);
}

// ── Order Functions ──

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`getOrders: ${error.message}`);
  return (data || []).map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await sb.from('orders').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getOrder: ${error.message}`);
  }
  return rowToOrder(data);
}

export async function createOrder(order: Order): Promise<void> {
  const { error } = await sb.from('orders').insert(orderToDb(order));
  if (error) throw new Error(`createOrder: ${error.message}`);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<void> {
  const { error } = await sb.from('orders').update(orderToDb(updates)).eq('id', id);
  if (error) throw new Error(`updateOrder: ${error.message}`);
}

// ── Audit Functions ──

export async function getAuditLog(limit = 100, offset = 0): Promise<{ entries: AuditEntry[]; total: number }> {
  const { data, error, count } = await sb
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('timestamp', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(`getAuditLog: ${error.message}`);
  return { entries: (data || []).map(rowToAudit), total: count || 0 };
}

export async function addAuditEntry(entry: AuditEntry): Promise<void> {
  const { error } = await sb.from('audit_log').insert({
    id: entry.id,
    timestamp: entry.timestamp,
    agent: entry.agent,
    action: entry.action,
    details: entry.details,
    status: entry.status,
    metadata: JSON.stringify(entry.metadata || {}),
  });
  if (error) throw new Error(`addAuditEntry: ${error.message}`);
}

// ── Suppliers ──

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await sb.from('suppliers').select('*');
  if (error) throw new Error(`getSuppliers: ${error.message}`);
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    platform: row.platform,
    baseUrl: row.base_url || '',
    notes: row.notes || '',
    minMargin: row.min_margin,
    avgShippingDays: row.avg_shipping_days,
  }));
}

// ── Settings ──

export async function getSetting(key: string): Promise<string | undefined> {
  const { data, error } = await sb.from('settings').select('value').eq('key', key).single();
  if (error) {
    if (error.code === 'PGRST116') return undefined;
    throw new Error(`getSetting: ${error.message}`);
  }
  return data?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { error } = await sb.from('settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) throw new Error(`setSetting: ${error.message}`);
}
