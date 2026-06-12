import { v4 as uuid } from 'uuid';
import type { Product, AgentConfig } from '../types';
import { getProducts, createProduct, updateProduct, getSetting } from '../db';
import { logAgentStart, logAgentSuccess, logAgentError, logAudit } from './audit';

const AGENT_NAME = 'sourcing-agent';

// Seed product catalog
const SEED_CATALOG = [
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

function generateDescription(title: string, category: string): string {
  const descriptions: Record<string, string[]> = {
    Electronics: [
      `Upgrade your tech game with this premium ${title.toLowerCase()}. Designed for performance and style, it's the perfect addition to your daily setup.`,
      `Experience cutting-edge technology with our ${title.toLowerCase()}. Compact, powerful, and built to last.`,
      `Get the most out of your devices with this ${title.toLowerCase()}. High quality at an unbeatable price.`,
    ],
    Home: [
      `Transform your space with this ${title.toLowerCase()}. Modern design meets everyday functionality.`,
      `Add a touch of style to your home with our ${title.toLowerCase()}. Easy to use and looks great in any room.`,
    ],
    Travel: [
      `Travel smarter with this ${title.toLowerCase()}. Compact, lightweight, and designed for life on the go.`,
      `Make every journey better with our ${title.toLowerCase()}. Your perfect travel companion.`,
    ],
    Kitchen: [
      `Simplify your time in the kitchen with this ${title.toLowerCase()}. Practical, durable, and easy to clean.`,
      `The perfect kitchen gadget — our ${title.toLowerCase()} makes meal prep a breeze.`,
    ],
    Fitness: [
      `Stay active and hydrated with this ${title.toLowerCase()}. Built for performance, designed for everyday use.`,
      `Take your fitness journey further with our ${title.toLowerCase()}. Quality you can rely on.`,
    ],
  };
  const pool = descriptions[category] || [
    `Discover our ${title.toLowerCase()} — the perfect blend of quality and value. Fast shipping, easy returns.`,
    `Love this ${title.toLowerCase()}? So will you. Premium quality at an affordable price point.`,
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateSlug(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 6);
}

export async function runSourcing(config?: Partial<AgentConfig>): Promise<{ sourced: number; errors: string[] }> {
  await logAgentStart(AGENT_NAME, 'Running product sourcing cycle');
  
  const errors: string[] = [];
  let sourced = 0;
  
  // Get existing products to avoid duplicates
  const existing = await getProducts();
  const existingTitles = new Set(existing.map(p => p.title.toLowerCase()));
  
  // Get config
  const minMarginSetting = await getSetting('minMarginPercent');
  const maxProductsSetting = await getSetting('maxProducts');
  const minMargin = config?.minMarginPercent ?? parseFloat(minMarginSetting || '30');
  const maxProducts = config?.maxProducts ?? parseInt(maxProductsSetting || '10');
  
  // Filter catalog
  const candidates = SEED_CATALOG
    .filter(p => {
      const margin = ((p.price - p.cost) / p.price) * 100;
      return !existingTitles.has(p.title.toLowerCase()) && margin >= minMargin;
    })
    .slice(0, maxProducts);
  
  await logAudit(AGENT_NAME, 'sourcing_scan', `Found ${candidates.length} candidate products (${existing.length} already in catalog)`, 'info');
  
  for (const item of candidates) {
    try {
      const slug = generateSlug(item.title);
      const images = [`https://picsum.photos/seed/${slug}/400/400`, `https://picsum.photos/seed/${slug}-2/400/400`];
      
      const product: Product = {
        id: uuid(),
        title: item.title,
        slug,
        description: generateDescription(item.title, item.category),
        price: item.price,
        cost: item.cost,
        images,
        category: item.category,
        tags: item.tags,
        supplier: item.supplier,
        supplierUrl: item.supplierUrl,
        stock: Math.floor(Math.random() * 50) + 10,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await createProduct(product);
      sourced++;
      
      await logAgentSuccess(AGENT_NAME, 'product_sourced', `Sourced: ${item.title} ($${item.cost} → $${item.price}, ${Math.round(((item.price - item.cost) / item.price) * 100)}% margin)`, {
        productId: product.id,
        cost: item.cost,
        price: item.price,
        margin: Math.round(((item.price - item.cost) / item.price) * 100),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${item.title}: ${msg}`);
      await logAgentError(AGENT_NAME, 'product_sourcing_failed', `Failed to source ${item.title}: ${msg}`);
    }
  }
  
  if (sourced === 0 && candidates.length === 0) {
    await logAudit(AGENT_NAME, 'sourcing_complete', 'No new products to source — catalog is current', 'info');
  } else {
    await logAgentSuccess(AGENT_NAME, 'sourcing_complete', `Sourced ${sourced} new product(s) as drafts. ${errors.length} error(s).`);
  }
  
  return { sourced, errors };
}
