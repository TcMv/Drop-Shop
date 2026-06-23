CREATE TABLE products (
  id varchar(500) PRIMARY KEY,
  title varchar(500) NOT NULL DEFAULT '',
  slug varchar(500) NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price real NOT NULL DEFAULT 0,
  cost real NOT NULL DEFAULT 0,
  images text NOT NULL DEFAULT '[]',
  category varchar(100) NOT NULL DEFAULT 'general',
  tags text NOT NULL DEFAULT '[]',
  supplier varchar(200) NOT NULL DEFAULT '',
  supplier_url varchar(500) NOT NULL DEFAULT '',
  stock integer NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);

CREATE TABLE orders (
  id varchar(500) PRIMARY KEY,
  items text NOT NULL DEFAULT '[]',
  total real NOT NULL DEFAULT 0,
  customer_name varchar(200) NOT NULL DEFAULT '',
  customer_email varchar(200) NOT NULL DEFAULT '',
  customer_phone varchar(50) NOT NULL DEFAULT '',
  shipping_address text NOT NULL DEFAULT '{}',
  status varchar(30) NOT NULL DEFAULT 'pending',
  supplier_order_ref varchar(200),
  tracking_url varchar(500),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id varchar(500) PRIMARY KEY,
  timestamp timestamptz NOT NULL DEFAULT now(),
  agent varchar(200) NOT NULL DEFAULT '',
  action varchar(200) NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  status varchar(20) NOT NULL DEFAULT 'info',
  metadata text DEFAULT '{}'
);

CREATE TABLE suppliers (
  id varchar(500) PRIMARY KEY,
  name varchar(200) NOT NULL DEFAULT '',
  platform varchar(100) NOT NULL DEFAULT '',
  base_url varchar(500) NOT NULL DEFAULT '',
  notes text DEFAULT '',
  min_margin real NOT NULL DEFAULT 30,
  avg_shipping_days integer NOT NULL DEFAULT 15
);

CREATE TABLE settings (
  key varchar(200) PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

CREATE TABLE hackers_club (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) NOT NULL,
  source varchar(100) NOT NULL DEFAULT 'homepage',
  member_number integer NOT NULL,
  discount_code varchar(20) NOT NULL DEFAULT 'HACKERS10',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_hackers_club_email ON hackers_club(email);
CREATE INDEX idx_hackers_club_member_number ON hackers_club(member_number);

ALTER TABLE hackers_club ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_insert ON hackers_club
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY anon_select ON hackers_club
  FOR SELECT TO anon USING (true);
