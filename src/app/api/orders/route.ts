import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getOrders, getOrder, createOrder, updateOrder } from '@/lib/db';
import { addAuditEntry } from '@/lib/agents/audit';
import type { Order } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  }
  
  // Only return recent orders (non-admin endpoint)
  const orders = await getOrders();
  return NextResponse.json(orders.slice(0, 5));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, customerName, customerEmail, customerPhone, shippingAddress } = body;
    
    if (!items || !total || !customerName || !customerEmail || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      items,
      total,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      shippingAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await createOrder(order);
    
    await addAuditEntry({
      id: uuid(),
      timestamp: new Date().toISOString(),
      agent: 'order-api',
      action: 'order_created',
      details: `Order ${order.id} for $${total}`,
      status: 'success',
      metadata: { orderId: order.id, total },
    });
    
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Invalid request' }, { status: 400 });
  }
}
