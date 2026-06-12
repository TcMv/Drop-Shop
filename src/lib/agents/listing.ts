import { getProducts, updateProduct } from '../db';
import { logAgentStart, logAgentSuccess, logAgentError, logAudit } from './audit';

const AGENT_NAME = 'listing-agent';

export async function runListing(): Promise<{ listed: number; errors: string[] }> {
  await logAgentStart(AGENT_NAME, 'Running listing optimization cycle');
  
  const errors: string[] = [];
  let listed = 0;
  
  const drafts = await getProducts('draft');
  
  if (drafts.length === 0) {
    await logAudit(AGENT_NAME, 'listing_scan', 'No draft products to process', 'info');
    return { listed: 0, errors: [] };
  }
  
  await logAudit(AGENT_NAME, 'listing_scan', `Found ${drafts.length} draft product(s) to review`, 'info');
  
  for (const product of drafts) {
    try {
      const enhancedDescription = `${product.description}\n\n✨ **Why you'll love it:**\n- Premium quality at an affordable price\n- Fast shipping direct to your door\n- 30-day satisfaction guarantee\n- Perfect for gifting or treating yourself`;
      
      await updateProduct(product.id, {
        description: enhancedDescription,
        status: 'active',
      });
      
      listed++;
      
      await logAgentSuccess(AGENT_NAME, 'product_listed', `Published listing: ${product.title} at $${product.price.toFixed(2)}`, {
        productId: product.id,
        price: product.price,
        margin: Math.round(((product.price - product.cost) / product.price) * 100),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${product.title}: ${msg}`);
      await logAgentError(AGENT_NAME, 'listing_failed', `Failed to list ${product.title}: ${msg}`);
    }
  }
  
  await logAgentSuccess(AGENT_NAME, 'listing_complete', `Published ${listed} new product listing(s). ${errors.length} error(s).`);
  
  return { listed, errors };
}
