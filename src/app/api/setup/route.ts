import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  cost REAL NOT NULL DEFAULT 0,
  images TEXT NOT NULL DEFAULT '[]',
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT NOT NULL DEFAULT '[]',
  supplier TEXT NOT NULL DEFAULT '',
  supplier_url TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('active','draft','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL DEFAULT '[]',
  total REAL NOT NULL DEFAULT 0,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_email TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  shipping_address TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','placed_with_supplier','shipped','delivered','cancelled')),
  supplier_order_ref TEXT,
  tracking_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'info' CHECK(status IN ('success','error','info')),
  metadata TEXT DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT '',
  base_url TEXT NOT NULL DEFAULT '',
  notes TEXT DEFAULT '',
  min_margin REAL NOT NULL DEFAULT 30,
  avg_shipping_days INTEGER NOT NULL DEFAULT 15
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_agent ON audit_log(agent);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp DESC);
`;

const SEED_PRODUCTS = [
  { title: 'Mini Portable Bluetooth Speaker', category: 'Electronics', cost: 8.50, price: 29.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005001.html', tags: ['bluetooth', 'speaker', 'portable', 'gift'] },
  { title: 'LED Strip Lights 5m RGB', category: 'Home', cost: 4.20, price: 15.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005002.html', tags: ['led', 'lighting', 'rgb', 'home-decor'] },
  { title: 'Wireless Charging Pad Fast Charge', category: 'Electronics', cost: 3.80, price: 12.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005003.html', tags: ['charger', 'wireless', 'phone-accessories'] },
  { title: 'Compression Packing Cubes Set 6pcs', category: 'Travel', cost: 5.50, price: 19.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005004.html', tags: ['travel', 'packing', 'organizer', 'luggage'] },
  { title: 'Portable Solar Power Bank 20000mAh', category: 'Electronics', cost: 12.00, price: 39.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005005.html', tags: ['power-bank', 'solar', 'portable', 'outdoor'] },
  { title: 'Bamboo Phone Stand Adjustable', category: 'Accessories', cost: 2.50, price: 9.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005006.html', tags: ['phone-stand', 'bamboo', 'desk-accessory'] },
  { title: 'Essential Oil Diffuser 200ml', category: 'Home', cost: 6.00, price: 22.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005007.html', tags: ['diffuser', 'essential-oils', 'home-fragrance'] },
  { title: 'Reusable Silicone Food Lids Set 10pcs', category: 'Kitchen', cost: 3.00, price: 11.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005008.html', tags: ['kitchen', 'silicone', 'food-storage', 'eco-friendly'] },
  { title: 'Smart Water Bottle with Reminder', category: 'Fitness', cost: 7.50, price: 24.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005009.html', tags: ['water-bottle', 'smart', 'fitness', 'hydration'] },
  { title: 'Adjustable Laptop Stand Aluminum', category: 'Electronics', cost: 9.00, price: 32.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005010.html', tags: ['laptop-stand', 'ergonomic', 'aluminum', 'desk'] },
  { title: 'UV Sanitizer Phone Cleaner Box', category: 'Electronics', cost: 5.80, price: 18.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005011.html', tags: ['uv-sanitizer', 'phone-cleaner', 'sterilizer'] },
  { title: 'Memory Foam Travel Pillow', category: 'Travel', cost: 4.50, price: 16.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005012.html', tags: ['travel-pillow', 'memory-foam', 'neck-support'] },
  { title: 'Digital Kitchen Scale 5kg', category: 'Kitchen', cost: 3.20, price: 11.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005013.html', tags: ['kitchen-scale', 'digital', 'baking', 'cooking'] },
  { title: 'Retractable USB-C Cable 3-in-1', category: 'Electronics', cost: 2.80, price: 9.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005014.html', tags: ['usb-c', 'cable', 'retractable', 'charger'] },
  { title: 'Stainless Steel Insulated Water Bottle 1L', category: 'Fitness', cost: 6.50, price: 22.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005015.html', tags: ['water-bottle', 'insulated', 'stainless-steel', 'eco'] },
  { title: 'Car Phone Holder Dashboard Mount', category: 'Accessories', cost: 2.20, price: 8.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005016.html', tags: ['car-mount', 'phone-holder', 'dashboard', 'driving'] },
  { title: 'Aromatherapy Shower Tablets Set 12pcs', category: 'Wellness', cost: 3.50, price: 14.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005017.html', tags: ['shower-tablets', 'aromatherapy', 'wellness', 'self-care'] },
  { title: 'Foldable Laptop Table Bed Tray', category: 'Home', cost: 8.00, price: 28.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005018.html', tags: ['laptop-table', 'bed-tray', 'foldable', 'desk'] },
  { title: 'Cordless Hair Straightener Brush', category: 'Beauty', cost: 5.00, price: 19.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005019.html', tags: ['hair-straightener', 'brush', 'cordless', 'beauty'] },
  { title: 'Pet Hair Remover Roller Reusable', category: 'Pets', cost: 1.80, price: 6.99, supplier: 'AliExpress', supplierUrl: 'https://www.aliexpress.com/item/1005020.html', tags: ['pet-hair', 'lint-roller', 'reusable', 'pets'] },
];

function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 6);
}

function generateDescription(title: string, category: string): string {
  return `Discover our ${title.toLowerCase()} — the perfect blend of quality and value. Fast shipping, easy returns. Premium quality at an affordable price point.`;
}

export async function GET() {
  const results: any = { schema: null, seed: null, errors: [] as string[] };

  // Step 1: Create the schema via direct pg connection (works on Vercel with IPv6)
  try {
    const { Client } = await import('pg');
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL not set');

    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    // Split and run each statement
    const statements = SCHEMA_SQL.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      await client.query(stmt);
    }
    await client.end();

    results.schema = { status: 'created', tables: ['products', 'orders', 'audit_log', 'suppliers', 'settings'] };
  } catch (err: any) {
    results.schema = { status: 'error', message: err.message };
    results.errors.push(`Schema: ${err.message}`);
  }

  // Step 2: Seed products via the Supabase JS client
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check if products already exist
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (count && count > 0) {
      results.seed = { status: 'skipped', reason: `Already has ${count} products` };
    } else {
      let seeded = 0;
      for (const item of SEED_PRODUCTS) {
        const slug = generateSlug(item.title);
        const { error } = await supabase.from('products').insert({
          id: uuid(),
          title: item.title,
          slug,
          description: generateDescription(item.title, item.category),
          price: item.price,
          cost: item.cost,
          images: JSON.stringify([
            `https://picsum.photos/seed/${slug}/400/400`,
            `https://picsum.photos/seed/${slug}-2/400/400`,
          ]),
          category: item.category,
          tags: JSON.stringify(item.tags),
          supplier: item.supplier,
          supplier_url: item.supplierUrl,
          stock: Math.floor(Math.random() * 50) + 10,
          status: 'active',
        });
        if (error) {
          results.errors.push(`Seed ${item.title}: ${error.message}`);
        } else {
          seeded++;
        }
      }
      results.seed = { status: 'seeded', count: seeded };
    }
  } catch (err: any) {
    results.seed = { status: 'error', message: err.message };
    results.errors.push(`Seed: ${err.message}`);
  }

  return NextResponse.json({
    success: results.errors.length === 0,
    results,
    note: results.errors.length > 0
      ? 'Some steps had errors. Check the errors array for details.'
      : 'All good! The products should now show on the site.',
  });
}
