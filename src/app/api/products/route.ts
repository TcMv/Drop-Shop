import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductBySlug } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const status = searchParams.get('status');
  const admin = searchParams.get('admin');
  
  if (slug) {
    const product = await getProductBySlug(slug);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  }
  
  // Admin view: show all products. Public view: only active.
  if (admin === 'true') {
    const products = await getProducts();
    return NextResponse.json(products);
  }
  
  const products = await getProducts(status || 'active');
  return NextResponse.json(products);
}
