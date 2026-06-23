# Slice & Dice Golf — Sourcing Review

**Date:** June 23, 2026
**Store:** drop-shop-plum.vercel.app
**Products:** 15 total (6 personalised, 9 standard)
**Stack:** Next.js 16 + Supabase + Stripe + Vercel

---

## 1. IMAGE QUALITY ANALYSIS

### Verified Loading Status
All image URLs from AliExpress Media CDN confirmed HTTP 200. Images are .avif at 480x480.

### Duplicate/Shared Images (CRITICAL)

- **golf-001** Personalised Ball Stamp — Unique images
- **golf-002** Custom Ball Stamp — Same as golf-001 (acceptable, same product range)
- **golf-003** Personalised Towel — Unique images
- **golf-004** Engravable Divot Tool — Unique images
- **golf-005** Ball Marker Set — **SHARED by 5 products**
- **golf-006** Scorecard Holder — Uses ball marker photo (WRONG product)
- **golf-007** Microfiber Towel — Same as golf-003 (acceptable)
- **golf-008** Foldable Divot Tool — Uses ball marker photo (WRONG product)
- **golf-009** Golf Glove — Unique images
- **golf-010** Groove Cleaner — Unique images
- **golf-011** Alignment Sticks — Unique images
- **golf-012** Travel Hat Clip — **Only 1 image; shared with 4 others**
- **golf-013** 6-in-1 Multi-Tool — Uses groove brush photo (WRONG product)
- **golf-014** Putter Headcover — Unique images
- **golf-015** Magnet Clip — **Only 1 image; shared with 4 others**

### High Priority Photo Fixes
1. golf-006 (Scorecard Holder) needs its OWN product photo
2. golf-012 (Hat Clip) needs its own photo, currently shows ball marker
3. golf-015 (Magnet Clip) needs its own photo, currently shows ball marker
4. golf-008 (Divot Tool) needs folded/unfolded mechanism shots
5. golf-013 (Multi-Tool) needs all-6-functions photo

---

## 2. PRODUCT DESCRIPTION (COPY) ANALYSIS

### Strong Copy — Keep
- golf-003: "Absorbs your mistakes. Literally." (best line in catalog)
- golf-010: "The Hackers Bristle" (punchy, memorable)
- golf-011: "The Straight Talk Sticks" (perfect brand voice)
- golf-014: "Because it's not the club's fault you three-putted" (excellent humour)

### Weak Copy — Needs Rewriting
1. **golf-001** — Functional but flat. Missing: usage details, ink type, how many stamps, pocket fit
2. **golf-002** — Almost identical to golf-001. Needs differentiation (pattern/text vs logo)
3. **golf-006** — Weak hook. Missing: number of scorecards, stat categories, leather quality
4. **golf-008** — Doesn't explain switchblade mechanism or magnet specs
5. **golf-015** — Missing magnet strength (lbs/kg), dimensions, material specs

---

## 3. SUPPLIER RELIABILITY

### AliExpress Link Verification (ALL PASS)
- 11 unique AliExpress item URLs — all HTTP 200
- 8 unique image CDN URLs — all HTTP 200, image/avif content type

### Concerns
1. **Single-supplier concentration** — 15 products map to 11 AliExpress item IDs; some shared
2. **Empty suppliers table** — No supplier data in Supabase (table exists but empty)
3. **100% AliExpress dependency** — No AU-based backup suppliers
4. **No verified reviews** — No supplier ratings or historical performance tracked
5. **No automated ordering** — Ordering agent exists but no evidence of real order placement

### Recommendations
- Populate suppliers table with contact info, shipping performance, ratings
- Source 2-3 AU-warehoused backup suppliers for top margin products
- Set up automated AliExpress order placement via ordering agent

---

## 4. MARGIN-TO-DEMAND ANALYSIS

### Full Rankings

1. **Alignment Sticks** — 4.95 → 94.3% margin (3.52/unit)
2. **Putter Headcover** — 9.95 → 92.8% margin (8.52/unit)
3. **Scorecard Holder** — 4.95 → 90.4% margin (3.52/unit)
4. **6-in-1 Multi-Tool** — 4.95 → 90.4% margin (3.52/unit)
5. **Microfiber Towel** — 2.95 → 89.0% margin (1.52/unit)
6. **Foldable Divot Tool** — 2.95 → 89.0% margin (1.52/unit)
7. **Divot Tool** — .95 → 85.6% margin (.52/unit)
8. **Groove Brush** — .95 → 85.6% margin (.52/unit)
9. **Hat Clip** — .95 → 85.6% margin (.52/unit)
10. **Ball Stamp Custom** — 4.95 → 69.4% margin (0.38/unit)
11. **Golf Glove** — 9.95 → 66.4% margin (3.24/unit)
12. **Magnet Clip** — 2.95 → 65.0% margin (.42/unit)
13. **Ball Marker Set** — 4.95 → 63.7% margin (.53/unit)
14. **Personalised Towel** — 4.95 → 53.1% margin (3.26/unit)
15. **Ball Stamp Logo** — 4.95 → 34.2% margin (1.96/unit)

**Store average margin: 72.9%**

### Best Margin-to-Demand Ratio
1. **Alignment Sticks** — 94.3%, 4.95. Training aids are highest demand for hackers.
2. **Putter Headcover** — 92.8%, 9.95. Essential, frequently lost, repeat purchase cycle.
3. **Microfiber Towel** — 89.0%, 2.95. Low friction purchase, everyone needs one.
4. **6-in-1 Multi-Tool** — 90.4%, 4.95. Gadget impulse buy, strong gift appeal.
5. **Foldable Divot Tool** — 89.0%, 2.95. Essential item, high restock rate.

### Products to Watch
- **golf-001** — 34.2% margin. Raise price to 4.95 or negotiate 2.99 cost down.
- **golf-003** — 53.1% margin. 1.69 cost is high for a towel. Renegotiate.

---

## 5. CATALOG GAPS — 5 Recommended Additions

### 1. Golf Tees (50-pack) — Essential Volume Driver
- Price: .95 | Cost: -2 | Margin: 80-90%
- Every round consumes tees. Zero current options. Lowest entry point, highest repeat rate.

### 2. Driver Headcover (Sock/PU Leather) — Complements Putter Cover
- Price: 9.95 | Cost: -4 | Margin: 80-90%
- Matches existing putter headcover. Driver + putter = matched set upsell.

### 3. Golf Ball Retriever (Pocket Extendable) — High Utility
- Price: 9.95 | Cost: -5 | Margin: 75-85%
- Weekend hackers lose balls constantly. Pays for itself. Strong impulse near water hazards.

### 4. Budget Laser Rangefinder — Premium Anchor
- Price: 4.95 | Cost: -12 | Margin: 65-75%
- Only tech product. Aspirational purchase at same price as top current item.

### 5. Personalised Leather Bag Tag — Gift/Membership Item
- Price: 4.95 | Cost: -3 | Margin: 80-87%
- Easy customisation. Perfect for Hackers Club member rewards. Strong gift appeal.

---

## 6. EXECUTIVE SUMMARY

### Critical (Fix This Week)
- Replace shared/incorrect images on golf-006, 008, 012, 013, 015
- Add second images to golf-012 (hat clip) and golf-015 (magnet clip)
- Populate empty suppliers table

### Important (This Month)
- Rewrite weak copy on golf-001, 002, 006, 008, 015
- Review golf-001 pricing (34.2% margin is too thin)
- Source AU-based backup for top 3 margin products
- Automate AliExpress order placement

### Strategic (Next Quarter)
- Add 5 new products: Tees, Driver Headcover, Ball Retriever, Rangefinder, Bag Tags
- Implement Hackers Club member-only products (bag tag first)
- Set up AU warehouse for 5-10 best sellers for 3-5 day shipping

