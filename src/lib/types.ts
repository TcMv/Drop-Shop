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
  cjSku?: string;
  cjVid?: string;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  personalisation?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  personalisation?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  status: 'pending' | 'paid' | 'placed_with_supplier' | 'shipped' | 'delivered' | 'cancelled';
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
  status: 'success' | 'error' | 'info';
  metadata?: Record<string, unknown>;
}

export interface Supplier {
  id: string;
  name: string;
  platform: string;
  baseUrl: string;
  notes: string;
  minMargin: number;
  avgShippingDays: number;
}

export interface AgentConfig {
  sourcingSchedule: string;
  autoListProducts: boolean;
  autoProcessOrders: boolean;
  minMarginPercent: number;
  maxProducts: number;
  categories: string[];
}

export type AgentAction = 
  | { type: 'SOURCE_PRODUCTS'; products: { title: string; price: number; supplier: string; url: string }[] }
  | { type: 'CREATE_LISTING'; productId: string }
  | { type: 'UPDATE_LISTING'; productId: string; changes: Partial<Product> }
  | { type: 'ARCHIVE_PRODUCT'; productId: string; reason: string }
  | { type: 'PLACE_ORDER'; orderId: string }
  | { type: 'UPDATE_ORDER_STATUS'; orderId: string; status: Order['status']; trackingUrl?: string }
  | { type: 'CUSTOMER_REPLY'; orderId: string; message: string };
