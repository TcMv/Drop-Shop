import { NextRequest, NextResponse } from 'next/server';
import { getProducts, updateProduct } from '@/lib/db';
import type { Product } from '@/lib/types';

/**
 * Real, verified product images sourced from Amazon, Walmart, and Best Buy CDNs.
 * Each URL was verified with a HEAD/GET request before being stored.
 * Sourced by scripts/source_real_images.py using DuckDuckGo image search.
 */

import fs from 'fs';
import path from 'path';

// Load real verified image URLs from the sourcing results file
const RESULTS_PATH = path.join(process.cwd(), 'scripts', 'image_sourcing_results.json');

interface ImageResult {
  title: string;
  status: string;
  images: string[];
}

function loadImageUpdates(): Record<string, string[]> {
  try {
    if (fs.existsSync(RESULTS_PATH)) {
      const data = fs.readFileSync(RESULTS_PATH, 'utf-8');
      const results: ImageResult[] = JSON.parse(data);
      const updates: Record<string, string[]> = {};
      for (const result of results) {
        updates[result.title] = result.images;
      }
      return updates;
    }
  } catch (err) {
    console.error('Failed to load image sourcing results:', err);
  }
  return {};
}

const IMAGE_UPDATES: Record<string, string[]> = loadImageUpdates();

export async function GET() {
  const results: any[] = [];
  
  try {
    const products = await getProducts();
    
    for (const product of products) {
      const newImages = IMAGE_UPDATES[product.title];
      if (!newImages) {
        results.push({ title: product.title, status: 'skipped', reason: 'No image override found' });
        continue;
      }
      
      await updateProduct(product.id, { images: newImages } as Partial<Product>);
      results.push({ title: product.title, status: 'updated' });
    }
    
    return NextResponse.json({
      success: true,
      updated: results.filter(r => r.status === 'updated').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
