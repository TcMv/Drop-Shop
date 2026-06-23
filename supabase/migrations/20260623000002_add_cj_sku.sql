-- Add CJdropshipping product mapping columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cj_vid TEXT;

-- Add index for CJ SKU lookups
CREATE INDEX IF NOT EXISTS idx_products_cj_sku ON products (cj_sku);

COMMENT ON COLUMN products.cj_sku IS 'CJdropshipping product SKU (variant)';
COMMENT ON COLUMN products.cj_vid IS 'CJdropshipping variant ID (vid)';
