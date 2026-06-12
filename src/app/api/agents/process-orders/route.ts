import { NextResponse } from 'next/server';
import { processPendingOrders, updateShippedOrders } from '@/lib/agents/ordering';

export async function POST() {
  try {
    const orderResult = await processPendingOrders();
    const shipResult = await updateShippedOrders();
    return NextResponse.json({ success: true, orders: orderResult, shipments: shipResult });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
