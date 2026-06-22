#!/usr/bin/env python3
"""
Source real, high-quality product images from Amazon, Walmart, Best Buy CDNs
using DuckDuckGo image search. Verifies each URL actually loads before storing.

Usage: python3 scripts/source_real_images.py
"""

import json
import os
import sys
import time
import re
from datetime import datetime, timezone
from urllib.parse import urlparse

import requests
from duckduckgo_search import DDGS

# ── Configuration ──

# Load Supabase credentials from .env.local
def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env.local")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

load_env()

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("ERROR: Missing Supabase credentials. Check .env.local")
    sys.exit(1)

API_BASE = f"{SUPABASE_URL}/rest/v1"

# ── Target Products ──

TARGET_TITLES = [
    "Mini Portable Bluetooth Speaker",
    "LED Strip Lights 5m RGB",
    "Wireless Charging Pad Fast Charge",
    "Compression Packing Cubes Set 6pcs",
    "Portable Solar Power Bank 20000mAh",
    "Bamboo Phone Stand Adjustable",
    "Essential Oil Diffuser 200ml",
    "Reusable Silicone Food Lids Set 10pcs",
    "Smart Water Bottle with Reminder",
    "Adjustable Laptop Stand Aluminum",
    "UV Sanitizer Phone Cleaner Box",
    "Memory Foam Travel Pillow",
    "Digital Kitchen Scale 5kg",
    "Retractable USB-C Cable 3-in-1",
    "Stainless Steel Insulated Water Bottle 1L",
    "Car Phone Holder Dashboard Mount",
    "Aromatherapy Shower Tablets Set 12pcs",
    "Foldable Laptop Table Bed Tray",
    "Cordless Hair Straightener Brush",
    "Pet Hair Remover Roller Reusable",
]

# Retail CDN domains we trust
TRUSTED_DOMAINS = [
    "m.media-amazon.com",
    "images-na.ssl-images-amazon.com",
    "images-fe.ssl-images-amazon.com",
    "i5.walmartimages.com",
    "i5.walmartimages.ca",
    "pisces.bbystatic.com",
    "target.scene7.com",
]

TRUSTED_PATTERNS = [
    re.compile(r"m\.media-amazon\.com/images"),
    re.compile(r"images-na\.ssl-images-amazon\.com"),
    re.compile(r"i5\.walmartimages\.com"),
    re.compile(r"pisces\.bbystatic\.com"),
    re.compile(r"target\.scene7\.com"),
]

def is_trusted_url(url: str) -> bool:
    """Check if URL is from a trusted retail CDN."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        for trusted in TRUSTED_DOMAINS:
            if domain == trusted or domain.endswith("." + trusted):
                return True
        return False
    except Exception:
        return False


def search_images_ddg(query: str, max_results: int = 20) -> list[dict]:
    """Search DuckDuckGo images for a product and return results."""
    results = []
    try:
        with DDGS() as ddgs:
            for i, r in enumerate(ddgs.images(
                query,
                region="us-en",
                safesearch="off",
                size=None,
                color=None,
                type_image=None,
                layout=None,
                license_image=None,
                max_results=max_results,
            )):
                results.append(r)
                if len(results) >= max_results:
                    break
    except Exception as e:
        print(f"  DDG search error: {e}")
    return results


def verify_image_url(url: str, timeout: int = 10) -> bool:
    """Verify an image URL actually loads with a HEAD request."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/120.0.0.0 Safari/537.36"
        }
        resp = requests.head(url, headers=headers, timeout=timeout, allow_redirects=True)
        if resp.status_code == 405:
            # HEAD not allowed, try GET with stream
            resp = requests.get(url, headers=headers, timeout=timeout, stream=True)
            resp.raise_for_status()
            content_type = resp.headers.get("Content-Type", "")
            if not content_type.startswith("image/"):
                return False
            # Read first few bytes to verify it's actually image data
            chunk = resp.raw.read(1024)
            if len(chunk) < 100:
                return False
            return True
        elif resp.status_code == 200:
            content_type = resp.headers.get("Content-Type", "")
            return content_type.startswith("image/")
        else:
            return False
    except Exception:
        return False


def fetch_products() -> list[dict]:
    """Fetch all products from Supabase."""
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }
    resp = requests.get(
        f"{API_BASE}/products?select=id,title,slug,status,images&status=eq.active&order=created_at.desc",
        headers=headers,
    )
    resp.raise_for_status()
    products = resp.json()
    # Parse images field for each product
    for p in products:
        if isinstance(p.get("images"), str):
            try:
                p["images"] = json.loads(p["images"])
            except (json.JSONDecodeError, TypeError):
                p["images"] = []
        if not isinstance(p.get("images"), list):
            p["images"] = []
    return products


def update_product_images(product_id: str, images: list[str]) -> dict:
    """Update a product's images in Supabase."""
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    body = {
        "images": json.dumps(images),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    resp = requests.patch(
        f"{API_BASE}/products?id=eq.{product_id}",
        headers=headers,
        json=body,
    )
    return {"status": resp.status_code, "data": resp.json() if resp.ok else resp.text}


def has_good_existing_images(images: list[str]) -> bool:
    """Check if product already has at least 2 trusted, verified images."""
    if len(images) < 1:
        return False
    # Count trusted URLs
    trusted_count = sum(1 for img in images if is_trusted_url(img))
    return trusted_count >= 1


def main():
    print("=" * 70)
    print("DropShop - Real Product Image Sourcing")
    print("=" * 70)
    print(f"Supabase URL: {SUPABASE_URL}")
    print()

    # Fetch existing products
    print("Fetching existing products from Supabase...")
    products = fetch_products()
    print(f"Found {len(products)} active products")
    print()

    # Build lookup by title
    product_by_title = {}
    for p in products:
        product_by_title[p["title"]] = p

    results = []

    for idx, title in enumerate(TARGET_TITLES, 1):
        print(f"\n{'─' * 60}")
        print(f"[{idx}/{len(TARGET_TITLES)}] {title}")
        print()

        product = product_by_title.get(title)
        if not product:
            print(f"  ⚠  Product not found in Supabase. Skipping.")
            results.append({"title": title, "status": "skipped", "reason": "not_found"})
            continue

        product_id = product["id"]
        existing_images = product.get("images", [])

        print(f"  Product ID: {product_id}")
        print(f"  Existing images ({len(existing_images)}):")
        for img in existing_images:
            trusted = "✓" if is_trusted_url(img) else "?"
            print(f"    {trusted} {img[:80]}...")

        # If it already has good images from trusted sources, verify and keep
        if has_good_existing_images(existing_images):
            print(f"\n  Product already has trusted images. Verifying...")
            verified = []
            for img in existing_images:
                if is_trusted_url(img):
                    print(f"    Verifying: {img[:60]}...", end=" ")
                    ok = verify_image_url(img)
                    print("✓ LOADS" if ok else "✗ FAILED")
                    if ok:
                        verified.append(img)
            if verified:
                # Update with verified images
                print(f"\n  Updating with {len(verified)} verified trusted images...")
                result = update_product_images(product_id, verified)
                if result["status"] == 200:
                    print(f"  ✓ Updated successfully!")
                else:
                    print(f"  ✗ Update failed: {result['data']}")
                results.append({
                    "title": title,
                    "status": "updated_existing",
                    "images": verified,
                })
                continue

        # Search DuckDuckGo for new images
        print(f"\n  Searching DuckDuckGo images...")
        search_queries = [
            f"{title} Amazon",
            f"{title} Walmart",
            f"{title} Best Buy",
            title,
        ]

        all_candidates = []
        seen_urls = set()

        # Also consider existing trusted images
        for img in existing_images:
            if is_trusted_url(img) and img not in seen_urls:
                all_candidates.append({"image": img, "source": "existing", "title": title})
                seen_urls.add(img)

        for query in search_queries:
            print(f"    Searching: \"{query}\"")
            try:
                ddg_results = search_images_ddg(query, max_results=10)
                for r in ddg_results:
                    url = r.get("image", "")
                    if url and url not in seen_urls:
                        all_candidates.append({"image": url, "source": query, "title": r.get("title", "")})
                        seen_urls.add(url)
            except Exception as e:
                print(f"      Error: {e}")
            time.sleep(1)  # Rate limiting

        print(f"\n  Found {len(all_candidates)} total candidates")

        # Filter to trusted domains first
        trusted_candidates = [c for c in all_candidates if is_trusted_url(c["image"])]
        other_candidates = [c for c in all_candidates if not is_trusted_url(c["image"])]

        # Verify candidates: prioritize trusted, then others
        verified_images = []
        print(f"\n  Verifying {len(trusted_candidates)} trusted-domain candidates...")
        for c in trusted_candidates:
            url = c["image"]
            print(f"    {url[:70]}...", end=" ")
            ok = verify_image_url(url)
            print("✓" if ok else "✗")
            if ok:
                verified_images.append(url)
            if len(verified_images) >= 3:
                break

        # If not enough from trusted, fall back to other domains
        if len(verified_images) < 2:
            needed = 3 - len(verified_images)
            print(f"\n  Need {needed} more, checking other domains...")
            for c in other_candidates:
                url = c["image"]
                print(f"    {url[:70]}...", end=" ")
                ok = verify_image_url(url)
                print("✓" if ok else "✗")
                if ok:
                    verified_images.append(url)
                if len(verified_images) >= 3:
                    break

        if not verified_images:
            print(f"\n  ✗ No verified images found!")
            results.append({"title": title, "status": "failed", "reason": "no_verified_images"})
            continue

        # Pick best 2-3 images
        final_images = verified_images[:3]
        print(f"\n  Selected {len(final_images)} images:")
        for img in final_images:
            print(f"    ✓ {img}")

        # Update Supabase
        print(f"\n  Updating Supabase...")
        result = update_product_images(product_id, final_images)
        if result["status"] == 200:
            print(f"  ✓ Updated successfully!")
        else:
            print(f"  ✗ Update failed (HTTP {result['status']}): {result['data'][:200]}")

        results.append({
            "title": title,
            "status": "sourced_new" if not has_good_existing_images(product.get("images", [])) else "updated",
            "images": final_images,
        })

        # Small delay between products
        time.sleep(0.5)

    # ── Summary ──
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    success = 0
    failed = 0
    for r in results:
        status_icon = "✓" if r["status"] != "failed" else "✗"
        print(f"  {status_icon} {r['title']}: {r['status']}")
        if r["status"] != "failed" and "images" in r:
            for img in r["images"]:
                print(f"       {img}")
        if r["status"] != "failed":
            success += 1
        else:
            failed += 1

    print(f"\nTotal: {len(results)} | Succeeded: {success} | Failed: {failed}")

    # Write results to file for reference
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "scripts",
        "image_sourcing_results.json"
    )
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to: {output_path}")


if __name__ == "__main__":
    main()
