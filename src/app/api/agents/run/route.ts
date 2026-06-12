import { NextResponse } from 'next/server';
import { runSourcing } from '@/lib/agents/sourcing';
import { runListing } from '@/lib/agents/listing';
import { processPendingOrders, updateShippedOrders } from '@/lib/agents/ordering';
import { logAudit } from '@/lib/agents/audit';

export async function POST() {
  try {
    logAudit('api-trigger', 'full_agent_cycle', 'Manual trigger: running all agents', 'info');
    
    const sourceResult = await runSourcing();
    const listResult = await runListing();
    const orderResult = await processPendingOrders();
    const shipResult = await updateShippedOrders();
    
    return NextResponse.json({
      success: true,
      summary: {
        sourcing: sourceResult,
        listing: listResult,
        orders: orderResult,
        shipments: shipResult,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Agent cycle failed',
    }, { status: 500 });
  }
}
