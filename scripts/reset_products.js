/**
 * Script to delete old products and insert Slice & Dice Golf products.
 */
const ANON_KEY = "sb_publishable_5FXD0udnrbEbuHZuIEv1EA_5AQynlCb";
const API_BASE = "https://oaklafuvpugiafxfjgls.supabase.co/rest/v1";

const HEADERS = {
  "apikey": ANON_KEY,
  "Authorization": `Bearer ${ANON_KEY}`,
  "Content-Type": "application/json",
};

async function api(method, path, body, extraHeaders = {}) {
  const opts = {
    method,
    headers: { ...HEADERS, ...extraHeaders },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null, headers: res.headers };
}

// Golf product data with brand-appropriate names and descriptions
const PRODUCTS = [
  {
    id: "golf-001",
    category: "personalised",
    title: "Personalized Golf Ball Stamp - Custom Logo Reusable Stamper",
    slug: "personalized-golf-ball-stamp",
    description: "Never lose your ball again. Stamp your custom logo, monogram, or initials onto every ball with this reusable stamper. The most consistent part of your game — at least your ball will be easy to identify.",
    price: 34.95,
    cost: 22.99,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sba73ec70c77e4cd68cf97981e6fee133I.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7da2198f5d0e4c54b1949eda6038b03f9.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["personalised", "ball-stamp", "custom"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005012247394933.html",
    stock: 50,
    status: "active",
  },
  {
    id: "golf-002",
    category: "personalised",
    title: "Custom Golf Ball Stamp - Personalized Marker with Pattern Text",
    slug: "custom-golf-ball-stamp-marker",
    description: "Personalise your golf balls with custom pattern and text. Compact, pocket-sized stamp that fits in any golf bag. Because every hacker deserves to know which ball is theirs in the rough.",
    price: 14.95,
    cost: 4.57,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sba73ec70c77e4cd68cf97981e6fee133I.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S7da2198f5d0e4c54b1949eda6038b03f9.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["personalised", "ball-stamp", "custom"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005012247394933.html",
    stock: 50,
    status: "active",
  },
  {
    id: "golf-003",
    category: "personalised",
    title: "Personalized Embroidered Golf Towel - Custom Monogrammed",
    slug: "personalized-embroidered-golf-towel",
    description: "Absorbs your mistakes. Literally. Premium waffle or microfiber golf towel with custom embroidery of your monogram, initials, or name. Hook it to your bag and wipe away the evidence of that last slice.",
    price: 24.95,
    cost: 11.69,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S4507d57d868d423e9eaf340cdc72041fB.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se3fbc815f0d846edb33408fc22040e93I.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["personalised", "towel", "embroidered"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005009885124932.html",
    stock: 30,
    status: "active",
  },
  {
    id: "golf-004",
    category: "personalised",
    title: "Golf Divot Repair Tool - Custom Engravable Zinc Alloy Fork",
    slug: "custom-engravable-divot-tool",
    description: "Fix your divots with style. Solid zinc alloy divot repair tool with custom engraving available. Includes ball marker. The Hackers Pick — because even hackers take care of the course.",
    price: 9.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sff8675096c7544deb035cd22482cd4e87.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S1cdfe976745c4a35b33df4def6ef28ddW.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["personalised", "divot-tool", "custom"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005007372531567.html",
    stock: 100,
    status: "active",
  },
  {
    id: "golf-005",
    category: "personalised",
    title: "Personalized Golf Ball Marker Set with Hat Clip - Custom Logo",
    slug: "personalized-ball-marker-set",
    description: "Mark your spot with pride. Set of custom printed coin markers with a magnetic hat clip. Your logo, photo, or name on a marker that stays put. The Hackers Spot — because your ball's position matters more than your score.",
    price: 14.95,
    cost: 5.42,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S911e76c70b9647c8b9061e72d134804fv.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6af2a16582db48dfb5fbec98218cc355U.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["personalised", "ball-marker", "hat-clip"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005007372531567.html",
    stock: 80,
    status: "active",
  },
  {
    id: "golf-006",
    category: "personalised",
    title: "Golf Scorecard Holder with Stat Tracker - Premium Leather Book",
    slug: "golf-scorecard-holder-stat-tracker",
    description: "Keep score in style. Premium leather scorecard book with built-in stat tracker. Embossable with your custom logo. The Memory Keeper — because you'll want to remember that one good round.",
    price: 14.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S911e76c70b9647c8b9061e72d134804fv.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6af2a16582db48dfb5fbec98218cc355U.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["personalised", "scorecard", "leather"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005005434434091.html",
    stock: 40,
    status: "active",
  },
  {
    id: "golf-007",
    category: "standard",
    title: "Microfiber Golf Towel with Carabiner Hook - Clip-on Towel",
    slug: "microfiber-golf-towel-carabiner",
    description: "The Hackers Towel. Clip it. Dry it. Slice again. Premium microfiber golf towel with sturdy carabiner hook. Absorbs 3x its weight in water — and disappointment.",
    price: 12.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S4507d57d868d423e9eaf340cdc72041fB.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/Se3fbc815f0d846edb33408fc22040e93I.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "towel", "microfiber"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005010044056189.html",
    stock: 60,
    status: "active",
  },
  {
    id: "golf-008",
    category: "standard",
    title: "Golf Divot Repair Tool Foldable Metal with Magnetic Ball Marker",
    slug: "foldable-divot-tool-magnetic-marker",
    description: "Switchblade-style divot tool with magnetic pop-up ball marker. Keep it in your pocket, fix your marks, and never lose your ball marker again. The Hackers Fix — essential for every hacker's pocket.",
    price: 12.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S911e76c70b9647c8b9061e72d134804fv.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S6af2a16582db48dfb5fbec98218cc355U.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "divot-tool", "magnetic"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005012398187869.html",
    stock: 75,
    status: "active",
  },
  {
    id: "golf-009",
    category: "standard",
    title: "Mens Golf Glove - Soft Breathable Synthetic Anti-Slip Grip",
    slug: "mens-golf-glove-synthetic-grip",
    description: "The Grip and Rip Glove. Soft, breathable synthetic leather with anti-slip palm. Available for left and right hand in multiple sizes. Because even a slice needs a solid grip.",
    price: 19.95,
    cost: 6.71,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sf14e6424da6f4e8b89676a7c0aea87f29.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S3cf9af24efc54bf0ba48b367a3309168G.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "glove", "grip"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005006995181606.html",
    stock: 45,
    status: "active",
  },
  {
    id: "golf-010",
    category: "standard",
    title: "3-in-1 Golf Club Groove Cleaner Brush - Portable Multi-Function",
    slug: "golf-club-groove-cleaner-brush",
    description: "The Hackers Bristle. Clean your grooves, sharpen your short game. Pocket-sized 3-in-1 brush with retractable bristles, groove scraper, and carabiner. Dirty clubs = dirty shots.",
    price: 9.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S4455871dacbc4cbda03c28589714a7d2J.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S4555a85ac3ee4da084fdce190c7022e4U.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "cleaner", "groove-brush"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005010044056189.html",
    stock: 90,
    status: "active",
  },
  {
    id: "golf-011",
    category: "standard",
    title: "Golf Alignment Sticks 2-Pack 48inch Collapsible Training Rods",
    slug: "golf-alignment-sticks-2-pack",
    description: "The Straight Talk Sticks. Finally, something that'll help you hit straight. Collapsible 48-inch alignment sticks for drills, setup alignment, and swing path training. Pop 'em in your bag.",
    price: 24.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S265f9c25c116492685907e876ff30d5bq.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S5357b0653fe14da8bfde174ea1a975d4f.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "training", "alignment"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005007010216758.html",
    stock: 35,
    status: "active",
  },
  {
    id: "golf-012",
    category: "standard",
    title: "Travel Hat Clip Leather - Golf Baseball Cap Strap Holder",
    slug: "travel-hat-clip-leather-golf",
    description: "Keep your cap on your bag, not on your head. PU leather clip for attaching your hat or glove to your golf bag. Simple, elegant, and you'll never leave your cap in the clubhouse again.",
    price: 9.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S911e76c70b9647c8b9061e72d134804fv.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "hat-clip", "leather"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005007539924764.html",
    stock: 65,
    status: "active",
  },
  {
    id: "golf-013",
    category: "standard",
    title: "6-in-1 Golf Multi-Function Tool - Divot Repair, Groove Brush, Opener",
    slug: "golf-multi-tool-6-in-1",
    description: "The Hackers Toolbox. Divot repair, groove cleaning, bottle opener, ball marker, and more. Six tools in one pocket-sized gadget. Because you've got enough to carry in your bag.",
    price: 14.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S4555a85ac3ee4da084fdce190c7022e4U.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S9452d1f8b7624594bb6c8f4ad3123b69S.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "multi-tool", "gadget"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005007520053251.html",
    stock: 55,
    status: "active",
  },
  {
    id: "golf-014",
    category: "standard",
    title: "Golf Putter Headcover - PU Leather Blade Cover Magnetic Closure",
    slug: "golf-putter-headcover-leather",
    description: "The Last Putt Cover. Protect your most important club. Premium PU leather blade putter cover with strong magnetic closure. Because it's not the club's fault you three-putted.",
    price: 19.95,
    cost: 1.43,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S7e296b0d44254655be8e75bd98d7658dJ.jpg_480x480q75.jpg_.avif",
      "https://ae-pic-a1.aliexpress-media.com/kf/S17cd2e531e40446981d6a03d3bcba135I.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "headcover", "putter"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005008469327668.html",
    stock: 40,
    status: "active",
  },
  {
    id: "golf-015",
    category: "standard",
    title: "Magnetic Golf Towel/Glove Clip - Strong Magnet Hook for Bag",
    slug: "magnetic-golf-towel-glove-clip",
    description: "Strong industrial magnet clip for attaching your towel or glove to your bag. No more fumbling for your towel after every shot. Just grab and wipe — then slice again.",
    price: 12.95,
    cost: 4.53,
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S911e76c70b9647c8b9061e72d134804fv.jpg_480x480q75.jpg_.avif"
    ],
    tags: ["standard", "magnet", "clip"],
    supplier: "AliExpress",
    supplierUrl: "https://www.aliexpress.com/item/1005007539924764.html",
    stock: 70,
    status: "active",
  }
];

async function main() {
  // Step 1: Delete all existing products
  console.log("Deleting existing products...");
  // Supabase REST requires a filter for DELETE
  const deleteRes = await api("DELETE", "/products?id=gt.0");
  console.log(`Delete status: ${deleteRes.status}`);
  
  // Step 2: Insert golf products
  console.log("Inserting golf products...");
  const now = new Date().toISOString();
  const rows = PRODUCTS.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    cost: p.cost,
    images: JSON.stringify(p.images),
    category: p.category,
    tags: JSON.stringify(p.tags),
    supplier: p.supplier,
    supplier_url: p.supplierUrl,
    stock: p.stock,
    status: p.status,
    created_at: now,
    updated_at: now,
  }));

  const insertRes = await api("POST", "/products", rows);
  console.log(`Insert status: ${insertRes.status}`);
  
  // Step 3: Verify
  const checkRes = await api("GET", "/products?select=id,title,category,status&order=id.asc");
  if (checkRes.data) {
    console.log(`\nProducts in DB: ${checkRes.data.length}`);
    checkRes.data.forEach(p => console.log(`  ${p.id}: ${p.title.slice(0,50)}... [${p.category}] (${p.status})`));
  }
}

main().catch(console.error);
