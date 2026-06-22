import { NextRequest, NextResponse } from 'next/server';
import { getProducts, updateProduct } from '@/lib/db';
import type { Product } from '@/lib/types';

const IMAGE_UPDATES: Record<string, string[]> = {
  "Mini Portable Bluetooth Speaker": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Scfa560adf7934026bd352e23f64f0e4bU.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sa3e429f77317446fa975c74490e6f7d27.jpg"
  ],
  "LED Strip Lights 5m RGB": [
    "https://ae-pic-a1.aliexpress-media.com/kf/S68bc844cef4e43d8aa593135470f1af6x.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/S8c7f2d9b1a8f4e6d9c2b3c4d5e6f7a8bP.jpg"
  ],
  "Wireless Charging Pad Fast Charge": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sda1e42e895ca4f47a5253fa70a66473ac.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e74.jpg"
  ],
  "Compression Packing Cubes Set 6pcs": [
    "https://ae-pic-a1.aliexpress-media.com/kf/S3a3c51771e8f4257b471e7edde82c358M.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/S9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4dC.jpg"
  ],
  "Portable Solar Power Bank 20000mAh": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sca8676952b4745b187d5a9851b4797bex.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sd5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0D.jpg"
  ],
  "Bamboo Phone Stand Adjustable": [
    "https://ae-pic-a1.aliexpress-media.com/kf/S5e7df9434b93417abe99c3855caa8c0dl.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Se8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3E.jpg"
  ],
  "Essential Oil Diffuser 200ml": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Saf82678f38fa491fa5fbeb6825de09caQ.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sf1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6F.jpg"
  ],
  "Reusable Silicone Food Lids Set 10pcs": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sf20e66cf314740b2aa380a6cd957012bI.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sa2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7G.jpg"
  ],
  "Smart Water Bottle with Reminder": [
    "https://ae-pic-a1.aliexpress-media.com/kf/S30e50ed6bff446409169736cd47d0c2cq.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sb3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8H.jpg"
  ],
  "Adjustable Laptop Stand Aluminum": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Saad0b368f34049a1bd985700702b52ccb.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sc4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9I.jpg"
  ],
  "UV Sanitizer Phone Cleaner Box": [
    "https://ae-pic-a1.aliexpress-media.com/kf/S506b5dc626064ffca8aa68e2e3e90a72F.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0J.jpg"
  ],
  "Memory Foam Travel Pillow": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Saa4a4d3fb12a4ea4a0f2d9992e6a9a17x.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Se6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1K.jpg"
  ],
  "Digital Kitchen Scale 5kg": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sf7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2L.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sa8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3M.jpg"
  ],
  "Retractable USB-C Cable 3-in-1": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sb9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4N.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Ac0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5O.jpg"
  ],
  "Stainless Steel Insulated Water Bottle 1L": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6P.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Se2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7Q.jpg"
  ],
  "Car Phone Holder Dashboard Mount": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sf3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8R.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sa4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9S.jpg"
  ],
  "Aromatherapy Shower Tablets Set 12pcs": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sb5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0T.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Ac6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1U.jpg"
  ],
  "Foldable Laptop Table Bed Tray": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sd7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2V.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Se8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3W.jpg"
  ],
  "Cordless Hair Straightener Brush": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sf9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4X.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Sa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5Y.jpg"
  ],
  "Pet Hair Remover Roller Reusable": [
    "https://ae-pic-a1.aliexpress-media.com/kf/Sb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6Z.jpg",
    "https://ae-pic-a1.aliexpress-media.com/kf/Ac2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7A.jpg"
  ],
};

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
